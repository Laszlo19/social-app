# What's New

A localized changelog flyout (bottom sheet on native, modal on web) titled
"What's new in version {0}", where the title tracks the version scrolled into
view.

## Content

Authored as Markdown, one file per version per language:

```
changelog/<locale>/<version>.md   e.g. changelog/en/1.127.1.md
```

English (`en/`) is the source of truth and defines which versions exist and
their order (newest first). At runtime the flyout picks the user's app language,
falling back through the base language to English.

Translations are authored by hand (this fork does not run the changelog through
Crowdin): to translate a version, create `changelog/<locale>/<version>.md` with
the same filename, e.g. `changelog/ro/1.127.1.md`. Locale folder names match the
app language codes (`ro`, `pt-BR`, `zh-CN`, ...). Any version without a file for
the user's locale falls back to English automatically.

To add a release: drop a new `changelog/en/<version>.md`. The generated module
is rebuilt by `scripts/build-changelog.mjs` (wired into `postinstall`, so CI
regenerates it on install). Keep the Markdown to the supported subset: headings,
bold/italic, bullet lists, links, inline code.

## How it works

- `scripts/build-changelog.mjs` -> committed `changelog.generated.ts`
  (`CHANGELOG_VERSIONS`, `CHANGELOG[version][locale]`).
- `Markdown.tsx` - dependency-free renderer for the supported subset.
- `index.tsx` - `Provider` (mounted around the shell), `useWhatsNew()` -> `{open}`,
  and the flyout (`Dialog.InnerFlatList`, sticky title via
  `onViewableItemsChanged`).
- `WhatsNewScreen.tsx` - transient `/whats-new` route that opens the flyout and
  pops itself, so any hyperlink (posts, notifications, in-app) opens it.

## Entry points

- Settings > About > "What's new".
- Any link to `/whats-new` (e.g. `bsky.app/whats-new`, `bluesky://whats-new`).
