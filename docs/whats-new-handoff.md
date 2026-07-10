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

- [ ] **1. Scaffold + content**
  - [ ] `changelog/en/1.127.1.md`, `changelog/en/1.126.0.md` (seed content)
  - [ ] `scripts/build-changelog.mjs` (scan -> generate)
  - [ ] `src/features/whatsNew/changelog.generated.ts` (initial, hand-seeded to
        match the script output since we can't run it locally)
  - [ ] `src/features/whatsNew/Markdown.tsx` (renderer)
- [ ] **2. Flyout**
  - [ ] `src/features/whatsNew/index.tsx` - `WhatsNewProvider`, `useWhatsNew()`,
        `WhatsNewDialog` with InnerFlatList + scroll-driven title
  - [ ] mount `<WhatsNewProvider>` in `App.native.tsx` + `App.web.tsx`
- [ ] **3. Settings entry**
  - [ ] "What's new" row in `AboutSettings.tsx` -> `open()`
- [ ] **4. URL / deep link**
  - [ ] register `/whats-new` in `src/routes.ts` (+ route types if needed)
  - [ ] handle it in `src/lib/hooks/useIntentHandler.ts` -> `open()`
  - [ ] verify a `bsky.app/whats-new` link in a post opens the flyout
- [ ] **5. i18n / CI**
  - [ ] add changelog file set to `crowdin.yml`
  - [ ] add codegen step to a CI workflow (run `build-changelog.mjs`)
  - [ ] wrap all UI chrome strings (title, Settings label, etc.) with Lingui

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
