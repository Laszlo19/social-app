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

## Maintenance notes
- Keep new features **toggle-based and self-contained** (the deer-social model)
  so they survive upstream merges. See `docs/build.md` and the fork-upgrade flow.
- This file is a roadmap, not a commitment — prune/promote items as we build.
