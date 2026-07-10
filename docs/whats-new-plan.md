# "What's New" feature - plan

A localized, in-app changelog shown in a flyout (bottom sheet on native, modal
on web). Openable from Settings > About and from any hyperlink (including links
in posts) via a `/whats-new` URL. The flyout title tracks the changelog version
currently scrolled into view: **"What's new in version {0}"**.

## Goals / requirements

- Flyout titled "What's new in version {0}", listing a changelog newest-first.
- Scrolling into older releases updates the title's version to match.
- Openable from Settings > About **and** from a hyperlink anywhere - including a
  link in a post, exactly like existing deep links (settings pages, chat
  notification options).
- Changelog is **translatable** and follows the user's locale, falling back to
  English.
- Changelog authored as **Markdown files**, one per version per language, pushed
  to Crowdin as their own files (separate from the UI `messages.po`).
- Manual open only (no auto-show after an update).

## Content model - Markdown files

```
changelog/
  en/            # source of truth (authored in English)
    1.127.1.md
    1.126.0.md
    ...
  ro/            # Crowdin-translated
    1.127.1.md
    ...
  <locale>/...
```

- Each file is the changelog for one version, in one language. Simple Markdown:
  headings, bold/italic, bullet lists, links, inline code.
- Filenames are the version string (`<version>.md`). The set of versions is
  derived from the `en/` folder (source of truth for which versions exist).
- **Translation**: this fork translates the changelog by hand (no Crowdin) -
  create `changelog/<locale>/<version>.md` with the matching filename. (If a
  Crowdin flow is ever wanted, add a `files` entry pointing at
  `/changelog/en/**.md` -> `/changelog/%two_letters_code%/**.md`; Crowdin treats
  Markdown as its own file type, separate from the `.po` catalogs.)

## Bundling - CI-generated TS module

Metro can't `import` `.md`, and we avoid new runtime deps (no local toolchain -
see the fork's no-local-node-toolchain constraint). So mirror the i18n codegen:

- `scripts/build-changelog.mjs` scans `changelog/**/*.md` and emits a committed
  `src/features/whatsNew/changelog.generated.ts`:

  ```ts
  export const CHANGELOG_VERSIONS = ['1.127.1', '1.126.0', ...] // newest first
  export const CHANGELOG: Record<string /*version*/, Record<string /*locale*/, string /*md*/>> = { ... }
  ```

- Runs in CI (like `intl:compile`). The generated file is committed so builds
  work without running the script. Regenerated when `changelog/**` changes or
  Crowdin syncs translations back.
- Version ordering: sort filenames by semver, newest first.

## Locale resolution + fallback

At runtime, for a given version pick the changelog string by:
1. exact app language (e.g. `ro`, `pt-BR`),
2. base language (`pt` for `pt-BR`),
3. `en`.

Mirror however the app already resolves `appLanguage` (see `#/state/preferences/languages`).

## Rendering - lightweight custom Markdown renderer

No markdown dependency. `src/features/whatsNew/Markdown.tsx` (~150 lines) renders
the supported subset with ALF primitives:
- `#`/`##`/`###` -> ALF headings/`Text` sizes
- `- ` / `* ` bullet lists
- `**bold**`, `*italic*`, `` `code` ``
- `[text](href)` -> `InlineLinkText` (internal links route normally; a
  `/whats-new` link inside the changelog would re-open/scroll the flyout)

Keep the parser deliberately small and forgiving; changelog Markdown is authored
in-repo so we control the subset.

## The flyout + "title follows scroll"

- `#/components/Dialog` (bottom sheet native / modal web) with
  `Dialog.InnerFlatList`, one item (section) per version, newest first.
- `onViewableItemsChanged` (viewability config, e.g. itemVisiblePercentThreshold
  ~50 or top-most visible) -> set `activeVersion` state.
- `Dialog.Header` title = `` t`What's new in version ${activeVersion}` ``.
  Defaults to the newest version on open.
- Each section renders: version sub-header (+ optional date via `i18n.date`) then
  the rendered Markdown body.

## Opening from a hyperlink (incl. links in posts)

One URL drives every entry point. Register `/whats-new` and handle it in
`src/lib/hooks/useIntentHandler.ts` (the same hook behind `intent/compose`,
verify-email, etc.): instead of navigating to a screen, it calls the global
flyout control's `open()`.

- Link in a post `https://bsky.app/whats-new` -> opens the flyout.
- `bluesky://whats-new` (notifications/external) -> opens the flyout.
- In-app `<InlineLinkText to="/whats-new">` -> opens the flyout.
- Settings > About row -> calls `open()` directly (no URL needed).

Global control: a `WhatsNewProvider` mounted near app root
(`App.native.tsx` / `App.web.tsx`) holds a `Dialog.useDialogControl()` and
exposes `useWhatsNew()` -> `{ open, control }`.

## Files / touch points

```
changelog/en|ro|.../<version>.md         NEW authored content (+ sample seed)
crowdin.yml                              + changelog file set
scripts/build-changelog.mjs              NEW codegen (run in CI)
.github/workflows/<i18n or dedicated>    + run the codegen step
src/features/whatsNew/
  index.tsx                              WhatsNewProvider + useWhatsNew() + flyout
  changelog.generated.ts                 GENERATED, committed
  Markdown.tsx                           lightweight renderer
  README.md                              feature docs
src/App.native.tsx / src/App.web.tsx     mount <WhatsNewProvider>
src/lib/hooks/useIntentHandler.ts        handle /whats-new
src/routes.ts + src/lib/routes/types.ts  register the path
src/screens/Settings/AboutSettings.tsx   "What's new" row
```

## Out of scope (decided)

- Auto-show on first launch after an update (manual open only).
- Remote/dynamic changelog (it's version-tied, so it ships with the app).

## Constraints / notes

- No local Node toolchain: the changelog codegen and any lint/typecheck run in
  CI, not locally. Prefer the generated-file + custom-renderer approach (zero new
  deps, no Metro changes).
- Title interpolates the version (`{0}`); version numbers/dates are not
  translated. The title string and any UI chrome ARE translated via Lingui.
