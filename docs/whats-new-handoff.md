# "What's New" - build handoff / progress tracker

Living status doc for the What's New feature. Design lives in
[whats-new-plan.md](./whats-new-plan.md). Update the checkboxes as work lands.

Branch: `feat/whats-new` (off `main` @ 1.127.1).

## Locked decisions

- Content: Markdown files `changelog/<locale>/<version>.md`; English is source,
  Crowdin translates as separate MD files. Runtime falls back to English.
- Bundling: CI script -> committed `changelog.generated.ts` (no Metro/dep change).
- Rendering: custom lightweight renderer (no dependency).
- Flyout: `Dialog` + `Dialog.InnerFlatList`; `onViewableItemsChanged` drives the
  "What's new in version {0}" title.
- Entry points: Settings > About row + a `/whats-new` URL handled by
  `useIntentHandler` (works from links in posts, notifications, in-app text).
- No auto-show on update.

## Build order + status

- [x] **1. Scaffold + content**
  - [x] `changelog/en/1.127.1.md`, `changelog/en/1.126.0.md` (seed content)
  - [x] `scripts/build-changelog.mjs` (scan -> generate)
  - [x] `src/features/whatsNew/changelog.generated.ts` (seeded via python to
        match the script output since we can't run node locally)
  - [x] `src/features/whatsNew/Markdown.tsx` (renderer)
- [x] **2. Flyout**
  - [x] `src/features/whatsNew/index.tsx` - `Provider`, `useWhatsNew()`,
        `WhatsNewDialog` with InnerFlatList + sticky scroll-driven title
        (onViewableItemsChanged; overrides List's internal handler via ...props)
  - [x] mount `<WhatsNewProvider>` around the shell in `App.tsx` + `App.web.tsx`
- [x] **3. Settings entry**
  - [x] "What's new" row in `AboutSettings.tsx` -> `whatsNew.open()`
- [x] **4. URL / deep link**
  - [x] register `/whats-new` in `routes.ts` + route types
  - [x] `WhatsNewScreen` transient route: opens the flyout + pops itself, so a
        `bsky.app/whats-new` post link, external/cold-start deep links, and
        in-app links all open the flyout (no intent-handler change needed)
- [x] **5. i18n / CI**
  - [x] changelog translated by hand (no Crowdin - personal fork). Add
        `changelog/<locale>/<version>.md` to translate a version.
  - [x] `changelog:build` script + run it from `postinstall` (every CI install
        regenerates the committed generated file - no workflow edit needed)
  - [x] UI chrome (title, Settings label, screen title) wrapped with Lingui -
        picked up by the extract-strings action after merge

## Status: feature built (pending CI verification)

All stages implemented on `feat/whats-new`. Cannot build/typecheck/lint locally
(no toolchain) - CI on the PR is the check.

## Verification (CI only - no local toolchain)

- Cannot build/typecheck/lint locally. Rely on CI on the PR.
- Manual test after an APK build:
  - Settings > About > What's new opens the flyout; title = newest version.
  - Scroll down -> title changes to older versions.
  - Tap a `bsky.app/whats-new` link in a post -> flyout opens.
  - Switch app language to Romanian -> changelog shows Romanian (or English
    fallback for untranslated versions).

## Gotchas / open items

- `changelog.generated.ts` is generated but committed; keep it in sync with the
  `.md` files. CI regenerates. If edited by hand, re-run codegen later.
- Markdown renderer is a deliberate subset - if authors use unsupported syntax it
  degrades (renders as text), doesn't crash.
- Decide the exact CI workflow to host the codegen step (nightly i18n job vs a
  dedicated one) when wiring step 5.
