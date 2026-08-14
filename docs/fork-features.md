# Fork Features & Roadmap

A living inventory of what this fork has shipped and what it can still pull in
from the two forks we track most closely — **witchsky** (our lineage parent) and
**Mu / Eurosky** — plus ideas from **deer-social**, **zeppelin.social**, and
**Elk**.

**Legend** — Status: ✅ done · 🔜 next · 💡 candidate · ⚠️ needs a deliberate
decision. Effort: **S** (hours) / **M** (a day-ish) / **L** (multi-day).

> Lineage: Bluesky → deer-social → {zeppelin, witchsky}; **our fork is
> witchsky-derived**, so most witchsky features are already in (Phases 1-8).
> Mu/Eurosky is an independent, **web-only** fork, so its features are the
> biggest source of *new* ideas — but each needs a native-support check.
>
> Reference source on disk (gitignored, do not commit):
> - witchsky `ADITIONAL/new/witchsky.app-main/witchsky.app-main/src/`
> - Mu `ADITIONAL/new/eurosky-social-app-eurosky-fork/.../src/`
> Both are at upstream **1.130.0**, same as our baseline.

---

## ✅ Already shipped in this fork

**Navigation (from Elk concept):** customizable bottom bar + desktop sidebar
(`features/customNav`), extra destinations, "New post" action item, Android
launcher shortcuts + home-screen widgets.

**Appearance / density (witchsky):** accent-color presets / hue shift
(`alf/util/accentTheme`), square avatars, square buttons, "Mutuals" label,
custom "post" verb.

**Calm timeline (witchsky):** Counts & metrics page — hide post/profile counts,
hide "Follows you", counts format (default/lite/exact); hide composer prompt;
hide load-latest button; no discover-feed fallback.

**Posting / content (witchsky):** delete-and-redraft (`lib/edit-post` +
composer), download video (`lib/media/save-video`), "Open in PDSls", "Open on
fediverse" for bridged accounts.

**Accounts / power-user (witchsky):** multi-account "Like/Repost as…"
(ephemeral agent), PDS badge on profiles, AI alt-text via OpenRouter
(`lib/ai/alt-text`), custom AppView DID override.

**Other fork work:** advanced search filters, public Likes tab on any profile
(`lib/api/feed/publicLikes`), Beta Features settings screen (nested Witchsky
master toggle), What's New changelog flyout, adaptive alt app icons,
pseudolocales, Romanian translations, iOS-version-sunset NUX (Android-previewable).

---

## 🔜 / 💡 Track A — remaining **witchsky** features

These are same-codebase RN/TS, so they port cleanly and survive upstream merges.
Ordered easy → hard.

| Feature | Effort | Notes |
|---|---|---|
| 💡 "+" icon on unfollowed feed avatars | S | small view tweak |
| 💡 Unique repost icons in notifications | S | swap icon in notification item by reason |
| 💡 stream.place embeds in the player | S | extend embed player URL matching (partially present — verify) |
| 💡 Sort / filter accounts in the account switcher | S | switcher list ordering |
| 💡 Compact account switcher | S | density variant, ride display-prefs context |
| 💡 Compact posts | M | post layout spacing; ride display-prefs context (hot path) |
| 💡 Stay on the current page when switching accounts | M | preserve route across account switch |
| 💡 Follow-confirmation dialog | S | confirm before following |
| 💡 Read chat threads with deleted/deactivated accounts | M | DM rendering guard |
| 💡 Repost carousels in the following feed | M | feed slice grouping |
| 💡 Trusted-verifier selection + AppView trust | M | verification prefs; overlaps Mu's version |
| 💡 Handles instead of DIDs in links; "Open original post" | S | link builders + post menu item |
| 💡 Settings sync across devices | M | `features/settingsSync` — needs an NSID; deferred before |
| 💡 PLC directory / constellation / image-CDN host overrides | M | extend the infra-override we already have for AppView DID |
| 💡 `sixSeven` easter-egg burst animation | S | `features/sixSeven`, purely cosmetic fun |
| 💡 Pet label (toggle + visibility for others) | M | profile label; conceptually near Mu's pet companion |
| 💡 OAuth login (atproto web OAuth) | L | biggest witchsky+Mu item; native + web flows, package deps |
| 💡 Material You dynamic theming (Android) | L | full Monet/HCT engine; documented-only so far, needs native module |

## 🔜 / 💡 Track B — **Mu / Eurosky** features (all new to us)

Mu is web-only, so **each needs a native-support audit** before porting (some use
web-only APIs / bunny.net edge functions). Self-contained `features/` modules,
which makes them relatively cherry-pickable. File counts are Mu's module size.

| Feature | Effort | Native? | Notes / source module |
|---|---|---|---|
| 💡 Code syntax highlighting + RichTextCode | S | likely ✅ | inline code rendering; part of `customEmbeds` |
| 💡 Reader mode for threads | M | ✅ | distraction-free thread view |
| 💡 Pronouns support | S | ✅ | profile pronouns field/display |
| 💡 Translation-provider preference | S | ✅ | pick translation backend |
| 💡 Avatar decorations (code-drawn ring frames) | M | ✅ | `features/avatarDecorations` (11 files); Discord-style, follows live-status ring pattern |
| 💡 Pet companion (animated on-screen pet) | M | ✅ reanimated | `features/petCompanion` (10); pairs with witchsky "pet label" |
| 💡 Custom embeds (RSVP events, code blocks) | M | verify | `features/customEmbeds` (15); pluggable handler registry (atmoRsvp, tangledString lexicons) |
| 💡 News feed (topic/source setup) | L | verify | `features/newsFeed` (10); dedicated feed screen |
| 💡 Newsrooms (branded spaces + WCAG-AA accent) | L | verify | `features/newsrooms` (16); larger surface |
| 💡 Live sports widget | L | web-leaning | `features/liveSports` (9); football-data.org, needs an API token + explore widget |
| ⚠️ Plausible analytics | — | — | we already ship an always-on analytics **stub**; skip unless swapping telemetry deliberately |
| ⚠️ Mu age-assurance backend / custom identity resolution | — | — | Mu-infra-specific; not portable, skip |

## ⚠️ Safety-sensitive (decide deliberately, don't bulk-add)

Change moderation / compliance behavior; may carry legal weight by distribution.
- ⚠️ Remove **age assurance** (witchsky).
- ⚠️ Ignore **`!no-unauthenticated`** labels even when logged out (deer/witchsky).
- ⚠️ Remove **location-based blocks** (witchsky).
- ⚠️ Remove the **unread-notification badge cap** ("30+") (witchsky) — cosmetic.
- ⚠️ Disable **`go.bsky.app` link proxying** / default app labeler (deer-social).

---

## Recommended order

1. **Quick witchsky wins** (Track A, all S): unique repost icons, "+" on
   unfollowed feeds, account-switcher sort/filter, handles-in-links + "Open
   original post", follow-confirmation, sixSeven. One batch, one PR.
2. **Display-prefs density batch** (Track A, M): compact posts + compact
   switcher, riding the existing `display-prefs` context.
3. **Mu low-risk natives** (Track B, S/M): code highlighting, pronouns,
   translation-provider pref, reader mode — each behind a Beta toggle.
4. **Visual Mu features** (Track B, M): avatar decorations + pet companion
   (pairs with witchsky pet label) — fun, self-contained.
5. **Bigger bets** (L, one at a time, own PRs): custom embeds → news feed →
   newsrooms → live sports; and separately OAuth login and Material You.
6. **Safety-sensitive**: only if/when explicitly chosen, each its own PR.

## Porting method (keep merges cheap)

- Every feature **toggle-based and self-contained** (deer-social model), placed
  per the fork's convention: spread into the relevant existing settings page,
  Beta Features for niche/unstable, a sub-page only when it has many sub-toggles.
- Prefer copying Mu's isolated `features/<name>/` module wholesale, then wiring a
  single entry point + toggle, over threading changes through core files.
- Can't typecheck/lint locally — CI on the PR is the gate.
- This file is a roadmap, not a commitment. Promote 💡→🔜→✅ as we build; prune
  what we reject.

---

## Appendix: full feature lists by fork

Kept for reference. The two on-disk forks (witchsky, Mu) are the actionable
sources; deer/zeppelin/Elk are context.

### witchsky (witchsky.app) — our lineage parent, largest feature set
Theming (themes, hue slider, Material You, square avatars/buttons, compact posts,
compact switcher, bundled palettes); accounts/auth (OAuth, switcher sort/filter,
act-as-another-account, stay-on-page, read chats with deleted accounts,
follow-confirm); posting (rename post verb, share-link domain choice,
delete-and-redraft, download video, stream.place, PDSls / bridged-fedi opens,
"Mutuals", repost carousels, unique repost icons); "Runes" settings (handles vs
DIDs, open-original-post, trusted verifiers + PDS badges + favicon service,
impressions visibility Hidden/Lite/Visible/Exact, usability/feeds toggles,
feature gates, density, infra overrides, settings sync); AI (prefs screen +
OpenRouter alt-text); other (pet labels, better defaults, no badge cap, sixSeven;
⚠️ removed age assurance / location blocks, ignores `!no-unauthenticated`).

### Mu / Eurosky (mu.social) — independent, web-only
Branding (`brand.json` single source, pink palette, Plausible analytics);
auth/posting (OAuth web flow, OAuth/password screens, post editing + edited
indicator, reader mode); new content (pet companion, live sports, news feed,
custom embeds — atmoRsvp RSVP + tangledString code blocks, code highlighting +
RichTextCode, avatar decorations, newsrooms); identity/trust (custom verification
+ trusted verifiers + constellation, Mu age-assurance, custom PDS resolution);
other (Eurosky onboarding, pronouns, BetaTag, translation-provider pref).

### deer-social — the shared base; small toggle diffs
Disable `go.bsky.app` proxying; disable default app labeler; disable discover
fallback; see-through quote blocks; enable feature gates; regional-labeler
location settings; ⚠️ ignore `!no-unauthenticated`; distinct branding.

### zeppelin.social — rebrand of deer, no new features to port.

### Elk (elk-zone/elk) — Mastodon web client, **UX inspiration only** (Vue/Nuxt,
not portable): customizable nav (adopted), zen mode, custom themes/fonts,
keyboard shortcuts, PWA install.
