# Upstream upgrade: 1.131.1 → 1.132.0

Living tracker. Single merge on `chore/upgrade-1.132.0` (off `main`). User opens
the PR. No local typecheck - CI is the gate.

## Scope
- 94 commits, 444 non-`.po` files, 53 `.po`. **No SDK migration this time** -
  should be a normal merge (unlike the 1.131.1 agent->client rewrite).

## User-facing changes in 1.132.0
- **Moderation inbox built out**: reports list (#11570) + account-status banner
  (#11636) on top of the menu item/gate (#11552). Gate `moderation_inbox:enable`.
- **Known likers on feed posts** (#11595) - "liked by X and others you follow".
- **OP thread numbering** on feed posts (#11472).
- **Video**: playback analytics (#11629), embed lexicon update (#11559), and the
  10-minute / multipart upload feature gates removed (#11528) - video is standard.
  Local `modules/expo-bluesky-video-compress` DELETED, replaced by npm
  `@bsky.app/video-compressor`.
- Starter-pack reference-list opt-out UI (#11578).
- Truncate handles in collapsed profile headers (#11577).
- Composer: preserve focus when adding thread posts (#11605); swap Keep-editing /
  Discard button order (#11606).
- Removed the Live Now new-feature nudge (#11604). City added to IP geo (#11603).
- Backend (Blink) changes - not client-facing.

## Fork implications
- **moderation_inbox gate is `:enable`** -> our analytics stub forces it ON, so
  the (now-real-ish) moderation inbox will show. Decide whether to hide it.
- `expo-bluesky-video-compress` deletion: verify no fork import dangles
  (fork video-download uses getBlob, not compress - likely fine).
- Known-likers / thread-numbering may interact with the counts-hiding fork
  feature - verify after merge.

## Merge steps
1. `git merge 1.132.0`. Resolve `.po` per-hunk theirs (awk).
2. Resolve code conflicts (search gating, settings, analytics stub, custom nav,
   counts, media/composer, public likes).
3. Dangling sweep (`git diff --diff-filter=D`), esp. video-compress.
4. Verify fork customizations; version -> 1.132.0.

## Status
- [ ] 1.132.0 merged
- [ ] Dangling sweep clean
- [ ] Fork customizations verified
- [ ] Pushed
