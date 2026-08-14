# Upstream upgrade: 1.128.0 → 1.129.0 → 1.129.1

Living tracker for merging upstream `bluesky-social/social-app` releases
1.129.0 and 1.129.1 onto this fork. Two staged merges on branch
`chore/upgrade-1.129.1` (off `main`). User opens the PR to `main`.

Verification cannot run locally (no Node toolchain) - CI on the PR is the gate.

## Scope (1.128.0 → 1.129.0)

- 54 commits, 328 files.
- 53 `.po` catalogs (routine, per-hunk *theirs*).
- ~36 non-`.po` code conflicts (fork ∩ upstream).
- 1.129.1 adds 31 more commits on top.

## Merge strategy

1. Merge `1.129.0`, resolve, commit.
2. Merge `1.129.1`, resolve, commit.
3. Dangling-import sweep + push. User opens PR.

`.po` conflicts: resolve **per-hunk theirs** via the awk script (state machine:
`^<<<<<<< ` -> skip ours, `^=======$` -> keep theirs, `^>>>>>>> ` -> end). Never
`git checkout --theirs` (drops non-conflicting fork strings). Preserves fork
strings + Romanian.

## Build-break risks (found during planning)

- [ ] **`expo-scroll-forwarder` DELETED** (whole native module). Fork's
  `src/view/screens/Profile.tsx` still `import {ExpoScrollForwarderView}` and
  wraps content in it. Upstream removed all its own usages; the fork's legacy
  profile screen is not in the conflict set, so the merge won't flag it.
  **Fix: unwrap `ExpoScrollForwarderView`** in the fork Profile.tsx.
- [ ] **Trending queries refactored**: `state/queries/trending/useTrendingTopics.ts`
  DELETED, consolidated into `useGetTrendsQuery.ts`. Fork's
  `view/shell/desktop/SidebarTrendingTopics.tsx` (conflict set) uses the old
  path -> adopt upstream's new API. `Trending.tsx`/`TrendingTopics.tsx` are not
  fork-modified (upstream wins cleanly).
- [x] `ExploreRecommendations.tsx` deletion is clean (upstream removed its
  `Explore.tsx` import; fork didn't touch `Explore.tsx`).

## Conflict set (code) - resolution notes

Search (recurring fork pattern): take upstream, re-apply advanced-search gate at
the `AdvancedSearchDialog` render sites (1.128.0 playbook).
- [ ] src/screens/Search/Shell.tsx
- [ ] src/screens/Search/SearchResults.tsx
- [ ] src/screens/Search/searchParams.ts (+ __tests__/searchParams.test.ts)
- [ ] src/state/queries/search-posts-v2.ts
- [ ] src/state/queries/search-posts-params.ts (+ __tests__)

Routing (custom nav + fork routes):
- [ ] src/Navigation.tsx
- [ ] src/routes.ts
- [ ] src/lib/routes/types.ts

Settings (witchsky toggles, what's-new link, public-likes toggle):
- [ ] src/screens/Settings/Settings.tsx
- [ ] src/screens/Settings/AppearanceSettings.tsx

Counts/metrics fork features (hide counts):
- [ ] src/screens/PostThread/components/LikesStat.tsx
- [ ] src/screens/PostThread/components/ThreadItemAnchor.tsx
- [ ] src/components/moderation/PostAlerts.tsx
- [ ] src/components/Pills.tsx

Media fork features:
- [ ] src/components/Post/Embed/ImageEmbed.tsx (gallery fallback)
- [ ] src/components/Post/Embed/VideoEmbed/index.tsx
- [ ] src/view/com/posts/PostFeed.tsx
- [ ] src/view/com/composer/Composer.tsx
- [ ] src/screens/VideoFeed/index.tsx

Analytics stub (keep always-on `enabled` stub):
- [ ] src/analytics/features/index.ts
- [ ] src/analytics/features/types.ts
- [ ] src/analytics/metrics/types.ts

Trending:
- [ ] src/view/shell/desktop/SidebarTrendingTopics.tsx (see risk above)

Build / native / config:
- [ ] package.json
- [ ] pnpm-lock.yaml
- [ ] pnpm-workspace.yaml
- [ ] app.config.js
- [ ] .gitignore
- [ ] oxlint-suppressions.json
- [ ] modules/bottom-sheet/ios/SheetView.swift

Misc:
- [ ] src/view/com/auth/SplashScreen.tsx
- [ ] src/components/WelcomeModal.tsx
- [ ] src/screens/Messages/ChatList.tsx
- [ ] src/components/dms/MessageItem.tsx

## Post-merge sweep

- [ ] `grep` src for every path in `git diff --diff-filter=D --name-only 1.128.0 1.129.1`.
- [ ] `.github/workflows`: keep fork's `claude.yml.disabled`; disable any
  upstream `nightly-build.yml` (references EAS secrets the fork lacks).
- [ ] Known fork customizations to preserve: sideload package id, pseudolocales
  (LTR/RTL), adaptive alt-icons, experimental/witchsky features, inverted
  find-friends/invite toggle, NUX tweaks, fork strings + Romanian, custom nav,
  public-likes tab.

## Status - COMPLETE

- [x] 1.129.0 merged (merge 9b0ea7ca8). Conflicts were far smaller than the
      predicted ~36: **3 code + 42 .po**. Code: `.gitignore` (kept both),
      `PostFeed.tsx` deps array (kept both `hideComposerPrompt` + `t`),
      `AppearanceSettings.tsx` (kept HEAD - fork App Icon setting + Navigation
      bar link; upstream had commented the App Icon block out behind
      IS_INTERNAL). Everything else in the predicted set auto-merged.
- [x] 1.129.1 merged (merge 82f3d6701). **1 code + 42 .po**. Code conflict was
      `.github/workflows/pull-request-comment.yml.disabled` (UD - upstream
      deleted the active workflow, fork keeps the `.disabled` copy; same as
      claude.yml). Kept ours.
- [x] Dangling-import sweep clean. The two flagged risks self-resolved:
      `expo-scroll-forwarder` removal auto-merged into the fork Profile.tsx (no
      manual unwrap needed); trending-query refactor left no old-path imports.
- [x] Fork customizations verified: version 1.129.1, changelog:build script,
      public-likes tab, advanced-search gate, analytics `enabled` stub, witchsky
      settings, custom nav (BottomBar `visible.map` + features/customNav).
      `nightly-build.yml` already `.disabled`.
- [ ] Pushed / PR opened (user opens PR). CI is the real verification.
