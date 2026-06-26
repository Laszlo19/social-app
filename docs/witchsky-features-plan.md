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

| Feature | Home | Status |
|---|---|---|
| Accent/hue color preset picker | **Appearance** | ✅ done - 6 preset hues (Blue/Purple/Pink/Red/Orange/Green); stored as `accentHue` device pref; applied via `buildAccentThemesOverride()` shifting all `primary_*` palette hex colors at HSL level; `ThemeProvider` `themesOverride` in `App.native.tsx`; color swatch UI in Appearance settings |
| OAuth login | login flow | ⛔ not implemented — see notes below |
| Material You dynamic colors | system colors | ⛔ not implemented — see notes below |

### Phase 8 implementation notes

**OAuth login** — The AT Protocol OAuth flow requires:
1. `@atproto/oauth-client-react-native` (not installed; needs pnpm add + prebuild).
2. A registered OAuth client ID (a `client-metadata.json` served from a stable URL on the fork's domain).
3. Rewrite of `src/state/session/index.tsx` `createAccount`/`login` to use `OAuthClient.signIn()`.
4. An intent handler in `src/components/hooks/useIntentHandler.ts` for the OAuth redirect URI (`bsky://oauth-callback`).
5. PKCE + token storage integration with the existing `SessionAccount` type.
This is a multi-day effort and depends on having a fork domain. Deferred until the fork has a stable public deployment.

**Material You dynamic colors** — Android 12+ exposes a dynamic color palette via `DynamicColors` (Material 3). To consume it in React Native, a Kotlin native module is needed that calls `MaterialColors.getColor(context, R.attr.colorPrimary, ...)` from the current system wallpaper palette and bridges it over `NativeModules`. No such module is installed. A lighter alternative: ship a handful of preset themes (already done with `ACCENT_PRESETS`) and let the user pick manually.

---

## Comprehensive skipped items log

### Phase 1
- **Hide "Feeds ✨" tab when only one feed is pinned** — The home pager tab list is built by `useHomeTabs()` from pinned feeds. Hiding one tab entry means conditional logic in `FlatNavigator`'s tab array, which is tricky with the animated tab bar. Doable but touches tab navigation ordering and the tab-bar underline animation. To implement: check `pinnedFeeds.length === 1` in `useHomeTabs()` and omit the Feeds tab when true; also hide the tab-bar label in the bottom bar.
- **Share-link domain override** — No fork web domain yet. When the fork has a stable URL, add a `shareLinkDomain` device pref and plumb it into `toShareUrl()` in `src/lib/strings/url-helpers.ts`.

### Phase 2
- **Square buttons** — `Button` component's default `shape` prop defaults to `'default'` (pill). Overriding per-instance is fine but the witchsky preference is a global toggle. To implement: add `squareButtons` to display-prefs context, read in `ButtonInner`, set `borderRadius: 0` or `rounded_xs` when enabled. Same pattern as `squareAvatars`. Kept deferred because `Button` is used everywhere and the visual impact is large.
- **Compact posts** — Post layout vertical spacing is scattered across `FeedItem`, `PostThreadItem`, etc. To implement: add `compactPosts` to display-prefs context, pass a density multiplier into the layout (e.g. halve `gap_sm` to `gap_xs` on post bodies). Read in `FeedItem` / `PostThreadItem`.

### Phase 3
- **Counts Lite (rounded) and Exact (un-abbreviated)** — Phase 3 only shipped hidden vs. visible. Lite would round to 1 decimal (1.2k), Exact would show unformatted integers (1,234). To implement: extend the `hidePostCounts`/`hideProfileCounts` pref to a tri-state (`'hidden'|'lite'|'exact'`), update `PostControls` count formatting to use `Intl.NumberFormat` with `notation: 'compact'` (Lite) or `notation: 'standard'` (Exact). The display-prefs context already plumbs this through, so it's a formatting-only change.

### Phase 4
- **Use handles instead of DIDs in profile links** — Handles are already preferred by `makeProfileLink` / `toShareUrl`. Nothing to do.

### Phase 6
- **Long-press on like/repost buttons** — `PostControls` renders `Pressable` wrappers with no long-press handler and no ambient menu context. Adding a submenu there would replicate the full post-menu machinery. The post-menu "Like as @x" / "Repost as @x" items (Phase 6) accomplish the same goal without touching `PostControls`. Not planned.
- **PDS favicon service** — No reliable cross-instance favicon endpoint exists (e.g. no `{pds}/favicon.ico` contract in the AT Protocol). Skipped.

### Phase 7
- **Settings sync** — The bsky `getPreferences`/`putPreferences` XRPC endpoints only handle official bsky preference namespaces. Fork-specific prefs have no stable NSID. `app.bsky.actor.putPrivateData` is not a real endpoint. To implement properly: pick a DID-keyed namespace like `app.witchsky.prefs.*`, register Lexicon schemas, stand up a labeler/PDS endpoint, and read/write via the agent.
- **PLC directory override** — The `AtpAgent` resolves DIDs via `https://plc.directory` internally. There is no exposed `plcUrl` option. To override: monkey-patch `agent.api.com.atproto.identity.resolveHandle` or replace `fetch` calls in `@atproto/api` that target `plc.directory`. Very invasive; deferred.
- **Image CDN override** — Blob CDN URLs are embedded in records at upload time and served from the PDS or a CDN the PDS operator controls. To serve via a different CDN requires a URL-rewriting shim in the `Image` components (wrap `source.uri`). Doable but touches every `<Image>` call site.

### Phase 8
- **AT Protocol OAuth** — See Phase 8 implementation notes above.
- **Material You dynamic colors** — See Phase 8 implementation notes above.

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
