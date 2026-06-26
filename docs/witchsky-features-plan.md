# Witchsky features – implementation plan

A staged plan for bringing witchsky's features into this fork, ordered **easy →
difficult**. Almost all of these are pure React Native / JS (same codebase as
witchsky), so they're verifiable via typecheck/CI – unlike the Android widgets.

## Placement philosophy

We deliberately **do not** put everything under one "Runes" mega-page. Instead:

- **Slot features into the existing settings page they thematically belong to**
  (Appearance, Following feed preferences, Content & media, Accessibility).
- **Experimental features page** (`ExperimentalFeaturesSettings.tsx`) is the home
  for niche / advanced / unstable toggles (custom infra, PDSls links, fedi,
  ephemeral-agent, etc.).
- **A dedicated sub-page only when a feature has many sub-toggles** – here, just
  "Counts & metrics".
- **Some features need no setting at all** – they're just menu items or actions
  (edit/redraft, download video, "open original post").

Storage: reuse the established patterns – `device` + `useStorage` (as the
Experimental page does) for simple device prefs, or the
`state/preferences/*` context pattern for app-wide prefs. New strings go through
Lingui.

---

## Phase 1 – Quick wins (pure toggles, drop into existing pages)

| Feature | Home | Notes |
|---|---|---|
| Don't fall back to the discover feed | **Following feed preferences** | pref + skip fallback in the following-feed query |
| Disable the composer prompt ("What's up?") | **Following feed preferences** | hide the inline prompt |
| Disable the top-of-feed/"scroll to top" button | **Following feed preferences** | hide control |
| Hide the "Feeds ✨" tab when only one feed is pinned | **Following feed preferences** | conditional in the home pager |
| Choose share-link domain (fork domain vs `bsky.app`) | **Content & media** | pref read in the share/copy-link helpers |
| Fork defaults: require alt text on, autoplay off | existing **Accessibility/Content** prefs | just change the fork's default values |

## Phase 2 – Wording & display

| Feature | Home | Status |
|---|---|---|
| Rename the "post" verb to any phrase | **Appearance** > Post button text | ✅ done |
| "Mutuals" label instead of "Following" when mutual | **Appearance** > Profiles | ✅ done |
| Square avatars | **Appearance** > Profiles | ✅ done (via display-prefs context) |
| Square buttons | **Appearance** | 🔜 TODO (Button default shape is hot/invasive; ride the display-prefs context) |
| Compact posts | **Appearance** | 🔜 TODO (post layout spacing; ride the display-prefs context) |

The shared **display-prefs context** (`state/preferences/display-prefs`) exists so
the remaining density items read prefs cheaply in hot components - add a key +
field and consume via `useDisplayPrefs()`.

## Phase 3 – Counts & metrics (its own sub-page) ✅

Done: a **Counts & metrics** sub-page (Settings > Content & media), driven by the
display-prefs context:
- ✅ Hide post engagement counts (like/repost/reply) - gated in `PostControls`.
- ✅ Hide profile counts (followers/following/posts) - gated in profile `Metrics`.
- ✅ Hide the "Follows you" label - gated in profile `Handle`.

🔜 TODO (future): the per-metric **Lite** (rounded) and **Exact** (un-abbreviated)
levels - v1 ships Hidden vs Visible only.

## Phase 4 – Post menu items & link behavior ✅

| Feature | Home | Status |
|---|---|---|
| "Open in PDSls" menu item | **post dropdown menu**, gated by **Experimental** toggle | ✅ done - opens pdsls.dev with post AT URI |
| Open posts/profiles in bridged fedi instances | **post menu**, **Experimental** toggle | ✅ done - detects *.ap.brid.gy handles, links to fedi profile |
| Use handles instead of DIDs in profile links | **Experimental features** toggle | skipped - handles are already preferred by default in makeProfileLink/toShareUrl |

## Phase 5 – Post actions (no settings, just actions) ✅

| Feature | Home | Status |
|---|---|---|
| Delete-and-redraft (effectively edit) | **post dropdown menu** action | ✅ done - "Delete and redraft" prompts, deletes, reopens composer with text |
| Download video | **video/post menu** action (native only) | ✅ done - "Download video" on video posts; saves via PDS blob sync endpoint + MediaLibrary |

Notes:
- Delete-and-redraft prefills text only; images/video are not re-attached (CDN blobs, not local files)
- Video download uses `bsky.social` as PDS — works for the vast majority; federated PDSes are a TODO

## Phase 6 – Multi-account & identity (Experimental) ✅

| Feature | Home | Status |
|---|---|---|
| Like/Repost as another account | **post menu**, **Experimental** toggle (`experimentalMultiAccount`) | ✅ done - "Like as @x" / "Repost as @x" menu items per non-expired alt account; uses createEphemeralAgent(); no optimistic update, shows toast |
| PDS badge on profiles | profile header, **Experimental** toggle (`experimentalPdsBadge`) | ✅ done - hostname displayed below handle; resolved via describeRepo (did:plc) or parsed from DID (did:web); cached 1h |

Notes:
- Long/right-press on the like/repost buttons (witchsky's original UX) was skipped — it would require invasive changes to PostControls. The post-menu approach achieves the same result more cleanly.
- Favicon service for PDS badge is skipped (no reliable cross-instance favicon API).

## Phase 7 – Infra, sync, AI (advanced; Experimental or new groups) ✅

| Feature | Home | Status |
|---|---|---|
| AI alt-text (OpenRouter) | composer alt-text dialog + **Experimental** API key field | ✅ done - "✨ AI" button in ImageAltTextDialog (native only); reads image as base64, calls openrouter.ai/api/v1/chat/completions with gemini-flash-1.5 |
| Custom AppView DID | **Experimental** text field | ✅ done - overrides BLUESKY_PROXY_HEADER on change + at app startup (App.native.tsx); takes full effect on next sign-in |
| Settings sync across devices | Experimental | skipped - no stable NSID for fork-specific prefs; bsky-native prefs already synced via agent.getPreferences() |
| PLC directory / image CDN overrides | Experimental | deferred - PLC override needs agent-level DID resolution plumbing; CDN is already implicit in blob serving URLs |

## Phase 8 – Big bets (largest effort)

| Feature | Home | Notes |
|---|---|---|
| OAuth login | login flow (no settings page) | atproto OAuth; large surface |
| Material You + accent/hue slider + themes | **Appearance** (theming engine) | biggest UI change |

---

## ⚠️ Out of scope here – safety-sensitive (decide separately)

These change moderation / compliance behavior and can carry legal weight
depending on distribution. Not in this plan unless explicitly chosen:

- Remove age assurance
- Ignore `!no-unauthenticated` labels even when logged out
- Remove location-based blocks
- Remove the unread-notification badge cap

---

## How we'll ship

One branch (`witchsky`), commits per phase (PRs handled separately). Each phase
is independently shippable; we can stop/reorder at any point. Recommended start:
**Phase 1** (fastest, lowest risk), then **Phase 3 (counts/metrics)** as the
flagship.
