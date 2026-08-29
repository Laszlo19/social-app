# Upstream upgrade: 1.130.0 → 1.131.1

Living tracker for merging upstream `bluesky-social/social-app` release 1.131.1
onto this fork. Single merge on branch `chore/upgrade-1.131.1` (off `main`).
Merging the `1.131.1` tag includes all of 1.131.0 (it is a descendant). User
opens the PR. Verification can't run locally (no Node toolchain) - CI is the gate.

## Scope (1.130.0 → 1.131.1)

- 92 commits (74 for .0 + 18 for .1), ~1029 non-`.po` files, 53 `.po` catalogs.
- **This is the largest/riskiest merge yet.**

## The dominant change: SDK / lexicon-client migration

PRs #11346-#11389 replaced the monolithic `BskyAgent` with generated per-service
**lexicon clients** (`@atproto/lex` codegen + appview/pds/chat clients + canonical
client hooks). Feed, search, bookmarks, profile/graph, notifications, chat, and
session were all migrated. This is why it touches ~1029 files.

**Deleted (fork imports these!):**
- `src/state/session/agent.ts` (the `Agent` class, `createPublicAgent`, `ProxyHeaderValue`)
- `src/state/session/agent-config.ts` (`saveLabelers`)

## User-facing features in 1.131.x
- Algorithmic visibility setting (#11417)
- 10-minute video uploads + better upload progress (#11445, #11248)
- Pagination in feed search (#11475)
- Perf (React Compiler for PostFeed #11451), telemetry, dep bumps (patches removed)

## Build-break risks (must fix - fork files upstream won't touch)

Dangling imports of the deleted `agent.ts` / `agent-config.ts`:
- [ ] `src/state/queries/pds-detection.ts` - FORK file, `new Agent(null, {service})` for login PDS autodetect. Migrate to the replacement client.
- [ ] `src/lib/constants.ts` - imports `ProxyHeaderValue` (custom AppView DID feature).
- [ ] `src/state/queries/preferences/index.ts` - `saveLabelers` from agent-config.
- [ ] `src/state/queries/service.ts`, `handle-availability.ts` - `Agent`.
- [ ] `src/screens/Login/ForgotPasswordForm.tsx`, `SetNewPasswordForm.tsx` - `Agent` (may be upstream-migrated; verify).
- [ ] `src/view/com/composer/drafts/state/api.ts` - `createPublicAgent`.
- Fork features sitting on this layer: ephemeral-agent multi-account (`session/util.ts createEphemeralAgent`), custom AppView DID (`BLUESKY_PROXY_HEADER`), analytics stub.

Other structural changes:
- [ ] `eslint/` → `lint-rules/` directory rename (build config).
- [ ] assets moved: `assets/splash/*` → `assets/illustrations/*`, `germ_logo` → `assets/icons/community/`.

## Merge strategy

1. `git merge 1.131.1`. Expect ~53 `.po` + many code conflicts.
2. `.po` conflicts: per-hunk **theirs** via the awk script. Never `git checkout --theirs`.
3. Resolve code conflicts area-by-area (search gating, settings, analytics stub,
   custom nav, counts/metrics, media/composer).
4. **Post-merge: figure out what replaced `Agent`** and migrate every fork import
   (grep `session/agent`, `agent-config`, `ProxyHeaderValue`, `createPublicAgent`).
5. Full deleted-file import sweep (`git diff --diff-filter=D`).
6. Verify fork customizations intact; version → 1.131.1.
7. Commit, push. User opens PR.

## Status
- [ ] 1.131.1 merged
- [ ] agent.ts/agent-config migration done, no dangling imports
- [ ] Fork customizations verified
- [ ] Pushed
