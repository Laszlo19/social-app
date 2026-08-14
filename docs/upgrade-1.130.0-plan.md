# Upstream upgrade: 1.129.1 → 1.130.0

Living tracker for merging upstream `bluesky-social/social-app` release 1.130.0
onto this fork. Single merge on branch `chore/upgrade-1.130.0` (off `main`).
User opens the PR to `main`. Verification can't run locally (no Node toolchain)
- CI on the PR is the gate.

## Scope (1.129.1 → 1.130.0)

- 59 commits, 199 files.
- 53 `.po` catalogs (routine, per-hunk *theirs*).
- **0 deleted code files** - no dangling-import risk from deletions.
- ~15 predicted code conflicts (fork ∩ upstream; usually far fewer in practice).

## Structural change: ProfileFeed -> CustomFeed rename

Upstream renamed (fork did NOT touch these -> renames auto-apply, no conflict):
- src/screens/Profile/ProfileFeed/index.tsx -> src/screens/CustomFeed/index.tsx
- src/screens/Profile/components/ProfileFeedHeader.tsx -> CustomFeed/components/CustomFeedHeader.tsx
- src/view/screens/ProfileFeedLikedBy.tsx -> src/screens/CustomFeed/CustomFeedLikedBy.tsx

Route KEYS renamed: `ProfileFeed`/`ProfileFeedLikedBy` -> `CustomFeed`/`CustomFeedLikedBy`
(routes.ts, lib/routes/types.ts, Navigation.tsx). Adopt upstream rename; keep
fork custom routes. **Post-merge: grep non-.po fork code for old names.**

## Predicted conflict set (resolution notes)

Routing (rename + fork routes):
- [ ] src/Navigation.tsx
- [ ] src/routes.ts
- [ ] src/lib/routes/types.ts

Fork settings / device schema (keep fork keys, take upstream additions):
- [ ] src/screens/Settings/Settings.tsx
- [ ] src/storage/schema.ts

Analytics stub (keep always-on `enabled` stub; reconcile `'ProfileFeed'`
event-name string in metrics/types with the route rename):
- [ ] src/analytics/index.tsx
- [ ] src/analytics/metrics/types.ts

Media / composer fork features:
- [ ] src/view/com/composer/Composer.tsx
- [ ] src/view/com/composer/photos/ImageAltTextDialog.tsx (keep fork ✨ AI
      alt-text button + generateAltTextViaOpenRouter; upstream change is a
      single trivial line deletion)
- [ ] src/view/com/posts/PostFeed.tsx

Display-prefs fork features:
- [ ] src/view/com/util/UserAvatar.tsx (square avatars)
- [ ] src/view/shell/index.tsx

i18n / misc:
- [ ] src/locale/i18n.ts (pseudolocales / Romanian)
- [ ] src/view/com/util/ErrorBoundary.tsx

Build:
- [ ] package.json

## Post-merge sweep

- [ ] grep non-.po fork code for `ProfileFeed` / `ProfileFeedLikedBy` (route
      rename dangling check - replaces the deleted-file sweep, empty this time).
- [ ] Keep fork's `claude.yml.disabled` / `nightly-build.yml.disabled`; disable
      any newly-enabled upstream workflow referencing EAS secrets.
- [ ] Verify fork customizations: version 1.130.0, changelog:build, public-likes
      tab, advanced-search gate, analytics `enabled` stub, witchsky settings,
      custom nav (BottomBar + features/customNav), AI alt-text, square avatars.

## Status - COMPLETE

- [x] 1.130.0 merged (merge 5f48b2f5c). **3 code + 42 .po** (again far fewer
      than the ~15 predicted). Code, all keep-both:
      - `src/analytics/index.tsx` - kept fork `enabled` stub + upstream's new
        `getValue: feats.getFeatureValue.bind(feats)` (`feats` still in scope).
      - `src/view/com/util/ErrorBoundary.tsx` - kept fork
        `setState({componentStack})` + upstream's `logger.error(error, {errorInfo,
        ...getErrorMetadata?.(error)})`.
      - `src/view/shell/index.tsx` - kept fork `useSyncAppShortcuts()` +
        `useUpdateWidgets()` AND upstream's new `useOTAUpdateRecovery()` hook.
- [x] Route-rename dangling check clean. `ProfileFeed`/`ProfileFeedLikedBy` route
      keys became `CustomFeed*`; the 3 renamed files were untouched by the fork
      so renames auto-applied. Remaining `'ProfileFeed'` hits are `logContext`
      /analytics event-name strings (a different namespace upstream did NOT
      rename) - not route refs, no action.
- [x] Fork customizations verified: version 1.130.0, public-likes, AI alt-text,
      analytics stub, square avatars, custom nav (shell hooks), CustomFeed rename
      applied. EAS/nightly workflows remain `.disabled`.
- [ ] Pushed / PR opened (user opens PR). CI is the real verification.
