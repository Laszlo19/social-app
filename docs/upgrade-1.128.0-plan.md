# Upgrade to 1.128.0 - plan

Merge upstream `1.128.0` (47 commits) onto the fork, and fold the fork's
Experimental Features page into upstream's new Beta Features page.

Base: `origin/main` @ 1.127.1. **Merge `feat/whats-new` into `main` first**
(both touch `package.json`, so landing it first avoids a second
reconciliation), then branch `chore/upgrade-1.128.0` off the updated `main`.

Cannot build/typecheck/lint locally (no toolchain) - CI on the PR is the check.

## Headline changes and what they mean for the fork

### 1. Search goes v2-only (#11125) - **breaking for our search toggle**
Upstream deletes `src/state/queries/search-posts.ts` (v1) and reworks
`Shell.tsx` + `SearchResults.tsx` to use only v2. Our `experimentalSearchV2`
toggle (which chose v1 vs v2) becomes meaningless, and our v1 fallback code
would reference the deleted file.

- Take upstream's v2-only `Shell.tsx`, `SearchResults.tsx`, `search-posts-v2.ts`.
- Re-apply **only** the advanced-search gating (`useAdvancedSearchEnabled`);
  the advanced-search dialog still exists in 1.128.0.
- **Drop `experimentalSearchV2`**: remove `useSearchV2Enabled` from
  `searchExperiments.ts`, the `experimentalSearchV2` schema key, and its toggle.
  v2 is simply always on now, matching upstream.
- Verify no dangling `useSearchPostsQuery` / `#/state/queries/search-posts`
  import remains.

### 2. Beta Features page (#11123) - **fold our Experimental page into it**
Upstream adds `src/screens/Settings/BetaFeaturesSettings.tsx` (a master
`isBetaUser` toggle synced as a bsky preference + a GrowthBook-driven feature
list via `getTargetedFeatures` + `BetaFeaturesFeedbackDialog`), a
`BetaFeaturesSettings` route, and a Settings link.

The fork has no GrowthBook backend, so upstream's dynamic feature list is empty
on the fork. We reuse the Beta screen as the container and host the fork's own
toggles on it.

**Target layout (nested masters):**

```
Beta Features
  [x] Enable beta features            <- upstream master (isBetaUser).
                                          Gates EVERYTHING below.
  (when beta enabled:)
    <upstream GrowthBook beta features list>   <- empty on the fork
    --- fork section ---
    [x] Gallery fallback
    [x] Find friends experience (legacy contacts)
    [x] Witchsky                       <- fork master (witchskyEnabled).
                                          Gates the Witchsky toggles below.
      (when Witchsky enabled:)
        [x] PDSls links in post menu
        [x] Bridged fediverse links
        [x] PDS badge on profiles
        [x] Multi-account actions
        [x] Advanced search filters
        [x] Test live event banner
        (text) OpenRouter API key
        (text) Custom AppView DID
```

- **Master beta toggle exists and controls all the others**: everything below
  the "Enable beta features" toggle is hidden/inert unless it is on.
- **Witchsky master stays**: a second-level master that gates the
  Witchsky-specific toggles (unchanged behavior), now nested under the beta
  master.
- **Reformat all toggles** to the new Beta-page item style:

  ```tsx
  <Toggle.Item name="..." label={l`...`} value={...} onChange={...}>
    <SettingsList.Item>
      <View style={[a.flex_1, a.gap_2xs]}>
        <SettingsList.ItemText style={[a.font_semi_bold]}>...</SettingsList.ItemText>
        <Text style={[a.text_sm, a.leading_snug, t.atoms.text_contrast_medium]}>
          ...description...
        </Text>
      </View>
      <Toggle.Platform />
    </SettingsList.Item>
  </Toggle.Item>
  ```

  (replacing our old `SettingsList.Group` layout.)
- **Delete** `ExperimentalFeaturesSettings.tsx`, its route
  (`ExperimentalFeaturesSettings` in `routes.ts` + route types + `Navigation`),
  and the Settings link to it. Keep upstream's new `BetaFeaturesSettings` route
  and link.
- Schema: keep all `experimental*` / `witchsky*` / `openRouterApiKey` /
  `infraAppviewDid` / `accentHue` / etc. keys, **minus `experimentalSearchV2`**.

### 3. Known likers on post thread (#11080) - **make it show up**
Gated by `PostThreadKnownLikersEnable` (`post_thread:known_likers:enable`) and
`PostThreadKnownLikersFetchEnable`. Both end in `:enable`, and our fork's
`ax.features.enabled` stub returns true for any flag not ending in `:disable`,
so **known likers shows automatically as long as we preserve the stub** (see
#4). No separate work.

### 4. Analytics rework (#11123) - **the critical merge**
#11123 modifies `src/analytics/index.tsx` (+55) and
`src/analytics/features/index.ts` (+97) - the same file holding our always-on
`enabled` stub. This is a **manual merge**, not take-ours/take-theirs:

- **Keep our stub** (`enabled` returns `false` for `*:disable`, `true`
  otherwise) so upstream `:enable`-gated features (known likers, etc.) stay on
  without GrowthBook.
- **Adopt upstream's beta additions**: the `isBetaUser` GrowthBook attribute,
  `getTargetedFeatures`, `useSetIsBetaUserMutation`, `beta-user-sync`.
- Consequence: with the stub always-on, the beta master toggle mainly serves as
  the fork's visibility gate for our toggles (the stub ignores `isBetaUser` for
  actual feature evaluation, and the GrowthBook list is empty on the fork). That
  is the intended design here.

### 5. Migrate to Oxlint (#10384) - **CI lint change / risk**
Replaces ESLint with Oxlint: adds `.oxlintrc.json` + `oxlint-suppressions.json`,
deletes `eslint.config.mjs`, and changes `package.json` `lint` to
`oxlint --quiet src modules` (+ oxlint deps).

- Take upstream's lint tooling.
- **Re-apply our `package.json` edits**: the `changelog:build` script and the
  `postinstall` addition (`... && pnpm changelog:build`).
- **Risk**: oxlint runs on CI and may flag fork-only files not covered by
  upstream's suppressions (`features/whatsNew/*`, `features/liveEvents` fork
  bits, `lib/hooks/useUpdateWidgets.ts`, `screens/Search/searchExperiments.ts`,
  the migrated Beta page). Expect to fix a few lint findings or add suppressions.

### 6. CLAUDE.md (#11102) - keep ours
Upstream slims CLAUDE.md (-445/+97). The fork's is heavily customized - **keep
ours**.

### 7. BottomBar.tsx - keep ours
Changed upstream; our custom nav. Keep ours for the conflicted render hunk (as
in prior upgrades).

## Untouched by 1.128.0 (merge clean)
`features/liveEvents/context.tsx` (test-banner), `components/forms/DateField/*`,
`view/com/util/ErrorBoundary.tsx` + `error/ErrorScreen.tsx` (copy button),
`lib/hooks/useUpdateWidgets.ts`, `plugins/withAndroidWidgets.js` (all widgets),
and everything in `features/whatsNew/`.

## Other new features / fixes (not fork-specific)
- Beta opt-in setting; DM button on labeler profiles (#11149); chat "mark
  requests as read" (#11107); known-likers prototype; collapse label-appeal into
  ModerationDetailsDialog (#11091).
- Fixes: Android carousel jiggle (#11153); invisible bidi chars in handles on
  web (#11066); strip leading `@` in `from:` queries (#11158); KWS language
  picker resets (#11082); sheet crash when maxHeight nil (#11104); web feed
  footer over bottom bar (#11151).
- Chore: **Sentry 8.x** (#11147), **pnpm 11.13.1**, SVGO, `@ipld/dag-cbor`
  lazy-load; TS7 added then **reverted** (net neutral); share intent allows 10
  images (#11132).

## Deps / native
Sentry 8.x, pnpm 11.13.1, oxlint toolchain -> `pnpm-lock.yaml` churn. Fork CI
uses `--no-frozen-lockfile`, so this is fine.

## Merge order

1. Merge `feat/whats-new` -> `main`.
2. Branch `chore/upgrade-1.128.0` off updated `main`; `git merge 1.128.0`.
3. `.po` conflicts (~40): auto-resolve per-hunk theirs (awk script).
4. **Search v2-only**: take upstream Shell/SearchResults/search-posts-v2;
   re-apply advanced-search gating; drop the searchV2 toggle; check for dangling
   v1 imports.
5. **analytics/index.tsx + features/index.ts**: manual merge - keep the stub,
   take the beta additions.
6. **Beta page**: build the nested-master layout in `BetaFeaturesSettings.tsx`
   (upstream master + fork sections, reformatted); delete
   `ExperimentalFeaturesSettings` screen + route + link; keep the schema keys
   (minus `experimentalSearchV2`).
7. **CLAUDE.md, BottomBar**: keep ours.
8. **package.json**: take upstream (oxlint + Sentry + pnpm), re-apply
   `changelog:build` + `postinstall`.
9. Push; watch CI - especially the new **oxlint** run.

## Decisions (locked)
- Master beta toggle **exists and controls all the other toggles** (nested).
- Witchsky master **stays** (second-level, gates the Witchsky toggles).
- Drop `experimentalSearchV2` (v1 removed upstream).
- Known likers **on** (via preserving the always-on `enabled` stub).

## Verification (CI + manual on an APK build)
- Settings shows **Beta Features** (not Experimental Features); the old route is
  gone.
- Beta master off -> only the master toggle shows. On -> fork toggles appear;
  Witchsky master gates its subset.
- Search still works (v2), advanced-search dialog gated by its toggle.
- Known likers appears on post-thread pages.
- All prior fork features intact (widgets, live-event test banner, What's New,
  crash copy button).
