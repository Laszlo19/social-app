# Fork Features & Roadmap

A living inventory of features this fork has added or could add, drawn from
[Elk](https://github.com/elk-zone/elk) (a Mastodon web client we take UX ideas
from) and from other Bluesky forks we studied: **witchsky**, **Mu / Eurosky**,
**deer-social**, and **zeppelin.social**.

**Legend** — Status: ✅ done · 🔜 planned · 💡 candidate · ⚠️ needs a deliberate
decision. Effort: S / M / L. Source is the fork the idea comes from.

> Note: Elk is Vue/Nuxt + Mastodon, so its features are **UX inspiration, not
> portable code**. Among the Bluesky forks, **deer-social** is the best code
> reference (small, toggle-based, rebase-friendly). **zeppelin.social** is a
> rebrand of deer with no new features. Lineage: Bluesky → deer-social →
> {zeppelin, witchsky}; Mu/Eurosky is an independent fork.

---

## ✅ Implemented

### From Elk
- ✅ **Customizable navigation** — reorder, show/hide, and add items to the
  **mobile bottom bar** and the **desktop sidebar**, via Settings → Appearance →
  Navigation. Driven by `src/features/customNav` (`bottomBarItems` /
  `leftNavItems` in device storage).
- ✅ **Add extra destinations** to the nav from a pool (Feeds, Lists, Saved,
  Settings, Federated, Local, New post).
- ✅ **New post** action item that opens the composer from the nav.
- ✅ **Federated / Local placeholder screens** + **Elk icons** brought over
  (Remix `ri:earth-line`, `ri:group-2-line`). Currently empty placeholders for
  testing — see "Pin custom feeds as nav items" below for the real version.

### Baseline fork customizations (pre-existing)
- ✅ Experimental Features settings screen (gallery fallback, legacy contacts).
- ✅ Invite-friends toggle (new QR/share-link invite UI as default).
- ✅ Adaptive alternate app icons (Android), sideload dev `applicationId`,
  pseudolocales (LTR/RTL), splash/branding tweaks, Romanian translations.
- ✅ Sideload-ready Android APK build workflow (`Build Android APK`).

---

## 🔜 / 💡 Roadmap

### Navigation & layout
- 🔜 **Pin custom feeds as nav items** — the real Bluesky answer to Mastodon's
  Local/Federated columns. Let users add any saved feed as a nav destination,
  replacing the Federated/Local placeholders. Source: Elk concept. **M**.
- 💡 **Zen mode** — hide UI chrome (counts, sidebars) for distraction-free
  reading. Source: Elk / witchsky. **M**.

### Theming
- 💡 **Accent color / hue slider** — choose the primary color. Source: witchsky. **M**.
- 💡 **Material You** dynamic theming (Android). Source: witchsky. **M**.
- 💡 **Square avatars / buttons, compact posts** density options. Source: witchsky. **S**.
- 💡 **Font family / size controls** beyond current options. Source: Elk. **S**.

### Accounts & auth
- 💡 **OAuth login** (atproto OAuth web flow). Source: witchsky + Mu. **L**.
- 💡 **Act as another account** via long/right-press on interaction buttons
  (ephemeral agent). Source: witchsky. **M**.
- 💡 **Sort / filter accounts** in the account switcher. Source: witchsky. **S**.
- 💡 **Stay on the current page** when switching accounts. Source: witchsky. **S**.

### Posting & content
- 💡 **Rename the "post" verb** to any phrase. Source: witchsky. **S** (fun, on-brand).
- 💡 **Delete-and-redraft** (effectively edit) posts. Source: witchsky + Mu. **M**.
- 💡 **Choose share-link domain** (fork domain vs `bsky.app`). Source: witchsky. **S**.
- 💡 **Download videos**. Source: witchsky. **M**.
- 💡 **See-through quote blocks / attachments** (view content behind blocks).
  Source: deer-social. **M**.
- 💡 **Reader mode** for threads. Source: Mu. **M**.
- 💡 **stream.place embeds** in the player. Source: witchsky. **S**.

### "Calm timeline" / privacy toggles
- 🔜 **Impressions control** — hide like/repost/quote/reply and follower counts
  (Hidden → Lite → Visible → Exact). Source: witchsky. **M**, high value.
- 💡 **Better defaults** — require alt text, autoplay off. Source: witchsky. **S**.
- 💡 **Disable `go.bsky.app` link proxying** (analytics). Source: deer-social. **S**.
- 💡 **Disable the default app labeler**. Source: deer-social. **S**.
- 💡 **Disable discover-feed fallback** / hide the "Feeds" tab when there's only
  one feed. Source: deer-social / witchsky. **S**.

### Identity / federation (power user)
- 💡 **PDS badge** on profiles + favicon service. Source: witchsky. **M**.
- 💡 **Handles instead of DIDs** in links; "Open in PDSls" / "Open original
  post" menu items. Source: witchsky. **S**.
- 💡 **Trusted-verifier selection** + custom verification. Source: witchsky / Mu. **M**.
- 💡 **Custom AppView DID / PLC directory / image CDN** (infrastructure
  overrides). Source: witchsky. **M**, advanced.
- 💡 **Settings sync** across devices. Source: witchsky. **M**.
- 💡 **Open posts in bridged fedi instances**. Source: witchsky. **S**.
- 💡 **Regional labeler / location settings**. Source: deer-social. **S**.

### AI
- 💡 **AI preferences screen + OpenRouter alt-text generation**. Source: witchsky. **M**.

### Fun / niche extras
- 💡 **Custom embeds** (RSVP events, code blocks). Source: Mu. **M**.
- 💡 **Code syntax highlighting** in posts. Source: Mu. **S**.
- 💡 **Cat companion** animated sprite. Source: Mu. **S**.
- 💡 **Live sports** widget / **News feed**. Source: Mu. **L**, niche.
- 💡 **Pet labels**, **unique repost icons**, **repost carousels**,
  **"Mutuals" label**. Source: witchsky. **S** each.

### ⚠️ Safety-sensitive (review before adding)
These change moderation / compliance behavior and may have legal weight
depending on distribution. Add only as deliberate, clearly-scoped decisions.
- ⚠️ Remove **age assurance**. Source: witchsky.
- ⚠️ Ignore **`!no-unauthenticated`** labels (even when logged out).
  Source: deer-social / witchsky.
- ⚠️ Remove **location-based blocks**. Source: witchsky.
- ⚠️ Remove the **unread-notification badge cap** ("30+"). Source: witchsky. (cosmetic)

---

## Appendix: features by fork

The same features grouped by their source fork, for reference. Lineage:
Bluesky → deer-social → {zeppelin, witchsky}; Mu/Eurosky is independent; Elk is
a separate Mastodon client.

### Elk (elk-zone/elk) — Mastodon web client, UX inspiration only
Vue/Nuxt + Mastodon, so **not portable code** — we re-build ideas natively.
- Customizable bottom bar / nav: edit, rearrange, remove items ← **adopted**
- Multiple accounts across multiple instances
- Local / Federated / Hashtag timeline columns (Mastodon concept)
- Zen mode (distraction-free reading)
- Custom themes + font sizing
- Keyboard shortcuts (web)
- PWA install (desktop + mobile); self-hostable via Docker

### witchsky (witchsky.app) — based on deer-social, largest feature set
- **Theming:** themes, hue slider, Material You / Material 3 (full Monet/HCT
  color engine), square avatars/buttons, compact posts, compact account
  switcher; bundles deer/blacksky/zeppelin color palettes
- **Accounts/auth:** OAuth login; sort/filter accounts in switcher; hold /
  right-click an interaction button to act as another account (ephemeral agent);
  stay on the page when switching accounts; read chat threads with
  deleted/deactivated accounts; follow-confirmation dialog
- **Posting/content:** rename the "post" verb; choose witchsky.app vs bsky.app
  share links; delete-and-redraft (edit) posts; download videos (format choice);
  stream.place embeds; open posts in PDSls / bridged fedi; "Mutuals" label;
  repost carousels in the following feed; unique repost notification icons
- **"Runes" settings:** Menus (handles instead of DIDs, "Open original post" /
  "Open in PDSls", URL on non-bsky handles); Badges (trusted-verifier selection
  + AppView, PDS badges, favicon service); Impressions (Hidden/Lite/Visible/Exact
  visibility for like/repost/quote/save/reply counts, follower/following/post
  counts, "followed by" avatars, "Follows you" label); Usability/Feeds (no
  discover fallback, hide "Feeds" tab when only one feed, disable composer
  prompt, disable top-of-feed button, plus icon on unfollowed feed avatars);
  Feature gates; Density; Infrastructure (custom AppView DID, PLC directory,
  constellation instance, image CDN host); Settings sync across devices
- **AI:** AI preferences screen; OpenRouter alt-text generation
- **Other:** pet labels; better defaults (alt text required, autoplay off); no
  notification badge cap; ⚠️ removed age assurance / location blocks; ⚠️ ignores
  `!no-unauthenticated`; no push notifications

### Mu / Eurosky (mu.social) — independent, web-only fork
- **Branding:** `brand.json` single-source-of-truth (name, hosts, pink accent
  palette, custom neutrals), BrandLogo/LogoHero, Plausible analytics
- **Auth/posting:** OAuth login (full web flow) + OAuth/Password sign-in screens;
  post editing + edited indicator; reader mode for threads
- **New content:** cat companion (animated sprite + settings); live sports (match
  cards, standings, football-data provider, explore widget); news feed
  (topic/source setup); custom embeds (atmoRsvp RSVP events, tangledString code
  blocks with lexicons); code syntax highlighting + RichTextCode
- **Identity/trust:** custom verification (Mu trusted verifiers, constellation,
  merged verification state); Mu age-assurance backend + confirm dialog; custom
  identity / PDS resolution
- **Other:** Eurosky-curated onboarding (suggested follows / starter packs);
  pronouns support; BetaTag; translation-provider preference

### deer-social (deer.social) — the shared base; small toggle-based diffs
- Toggle to disable `go.bsky.app` link proxying (analytics)
- Toggle to disable the default app labeler
- Toggle to disable discover-feed fallback in the following feed
- See-through quote blocks / attachments (view content behind blocks)
- Enable feature gates
- Configure location settings for regional labelers
- ⚠️ Entirely ignore `!no-unauthenticated` labels, even when logged out
- Distinct colors / branding

### zeppelin.social — fork of deer-social
- Rebrand only — no new features beyond deer-social (bundles a zeppelin color
  palette). Nothing to port.

---

## Maintenance notes
- Keep new features **toggle-based and self-contained** (the deer-social model)
  so they survive upstream merges. See `docs/build.md` and the fork-upgrade flow.
- This file is a roadmap, not a commitment — prune/promote items as we build.
