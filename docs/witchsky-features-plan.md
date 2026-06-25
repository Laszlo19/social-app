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

| Feature | Home | Notes |
|---|---|---|
| Rename the "post" verb to any phrase | **Appearance** (new "Wording" row) | one device pref read where the compose/"post" label renders |
| "Mutuals" label instead of "Following" when mutual | **Appearance** toggle | uses existing follow-state |
| Density: square avatars, square buttons, compact posts | **Appearance** (new "Density" group) | a few ALF/token-level toggles; touches shared components |

## Phase 3 – Counts & metrics (its own sub-page)

| Feature | Home | Notes |
|---|---|---|
| Visibility (Hidden / Lite / Visible / Exact) of like/repost/quote/reply counts | **new "Counts & metrics" sub-page**, linked from Content & media | conditional rendering in `PostControls` |
| Visibility of follower / following / post counts + "Follows you" label | same sub-page | conditional in profile header |

This is the **one** feature that earns a dedicated page (6+ sub-toggles). It's
also the highest-value "calm timeline" feature.

## Phase 4 – Post menu items & link behavior

| Feature | Home | Notes |
|---|---|---|
| "Open original post" / "Open in PDSls" menu items | **post dropdown menu**, gated by an **Experimental** toggle | adds menu rows |
| Use handles instead of DIDs in profile links | **Experimental features** toggle | link-builder change |
| Open posts in bridged fedi instances | **post menu**, **Experimental** toggle | detect bridged accounts |

## Phase 5 – Post actions (no settings, just actions)

| Feature | Home | Notes |
|---|---|---|
| Delete-and-redraft (effectively edit) | **post dropdown menu** action | delete + reopen composer prefilled |
| Download video | **video/post menu** action | reuse media-save plumbing |

## Phase 6 – Multi-account & identity (Experimental)

| Feature | Home | Notes |
|---|---|---|
| Act as another account via long/right-press on like/repost | behavior + **Experimental** toggle | "ephemeral agent" for one action |
| PDS badge on profiles + favicon service | profile header + **Experimental** toggles | fetch/show hosting PDS |

## Phase 7 – Infra, sync, AI (advanced; Experimental or new groups)

| Feature | Home | Notes |
|---|---|---|
| Settings sync across devices | **Account settings** / Experimental | store prefs in a repo record |
| AI alt-text generation (OpenRouter) | **Accessibility** (alt-text area) + small "AI" group for the API key | network + key management |
| Custom AppView DID / PLC directory / image CDN host | **Experimental features** ("Infrastructure" group) | power-user overrides |

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
