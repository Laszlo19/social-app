# Fork changes

Every change this fork makes on top of upstream
[bluesky-social/social-app](https://github.com/bluesky-social/social-app), with
where each one came from. For ideas that aren't built yet, see
[fork-features.md](./fork-features.md).

**Fork:** [Laszlo19/social-app](https://github.com/Laszlo19/social-app) ·
**Current upstream base:** 1.137.0

## Sources

| Source | What it means |
|---|---|
| **Fork** | Our own idea, built for this fork |
| **Witchsky** | Ported from [witchsky.app](https://witchsky.app), a Bluesky fork (deer-social lineage) |
| **Elk** | UX idea from [Elk](https://github.com/elk-zone/elk), a Mastodon client, rebuilt natively (no shared code) |
| **Upstream #N** | An upstream PR or feature, adopted early or adapted for the fork |

Commit hashes are on this fork's `main` unless noted.

---

## Build, distribution and CI

| Change | Source | Commits |
|---|---|---|
| **Build Android APK** workflow: sideloadable release APK, placeholder `google-services.json`, Lingui compile, explicit NDK install | Fork | `deb2c423b` `6bff3a50e` `6853d3a34` `cf79d11ad` `5ab1ae802` |
| **Sideload package id**: `EXPO_PUBLIC_SIDELOAD=true` builds `xyz.blueskyweb.app.dev` ("Bluesky Dev"), installable next to the Play Store app (`app.config.js`) | Fork | `7b61d6a28` |
| **Extract translations** workflow: re-extracts Lingui catalogs so fork strings reach the `.po` files | Fork | `1e6bed2cb` |
| Extract translations: skip install scripts, 15-minute timeout | Fork | branch `ci/faster-extract-translations` (`37fee503a`), not merged yet |
| Toolchain follows upstream: Node and pnpm from `package.json`, `setup-android` installs only `platform-tools` | Fork | `7db7221e3` `c85748f8e` |
| Upstream workflows the fork doesn't run are renamed to `.disabled` (Claude, nightly build, asset notices, icon codegen, EAS/deploy, lint) | Fork | `a68162406` `4685a174b` `25922e901` `385b2bc91` |
| `ADITIONAL/` (reference copies of other forks) is git-ignored | Fork | `9c783b84a` |

## Internal and testing access

| Change | Source | Commits |
|---|---|---|
| **`IS_INTERNAL` forced on** (`src/env/common.ts`) so Developer options, NUX triggers and internal settings work in release builds. Upstream "on for internal builds" shortcuts must not bypass fork toggles; see the Notifications fix below | Fork | `a83f59442` |
| **Feature-gate stub** (`src/analytics/index.tsx`): every `:enable` flag on, every `:disable` flag off, except **Upstream previews** (below) | Fork | `deb2c423b` |
| **NUX triggers** in Developer options can force-show any NUX, with a preview payload for platform-gated variants | Fork | `446393b27` `650d63e14` `9e60c760f` |
| Contacts flow bypass and a typable phone shortcut for testing Find Contacts | Fork | `deb2c423b` `ea551cff0` |
| Crash screen shows the full stack with a copy button | Fork | `a71b9a0c7` |

## App identity and branding

| Change | Source | Commits |
|---|---|---|
| **Legacy app icon is the default** again (flat butterfly on the blue gradient) on Android, iOS and web; legacy adaptive assets restored as `assets/icon-android-*-legacy.png` | Fork | `191b02c9d` |
| **Adaptive alternate app icons** on Android: wraps the dynamic-icon plugin's flat bitmaps in adaptive XML so launchers mask them (`plugins/withAndroidAdaptiveAltIcons.js`) | Fork | `7b61d6a28` `74c2e1515` `38d9b4fb7` `144708b8d` |
| **Animated splash on Android**: port of the iOS grow-and-fade outro, drawn with the Android splash's own look, started only after the app has laid out (`src/Splash.android.tsx`) | Fork (upstream iOS animation) | `52d253214` `bdc05e246` `30874c3c6` |
| **Force the Japan / kawaii logo** Beta toggles. Upstream retired the Japan logo in 1.135; the fork keeps it at `assets/custom_logo_japan.svg` | Fork | `f7907a1de` `7e1b08caf` |

## Navigation

| Change | Source | Commits |
|---|---|---|
| **Customizable bottom bar** (phones): reorder, show/hide, add items (Settings → Appearance → Navigation; `src/features/customNav`) | Elk | `113d36fd6` |
| **Customizable sidebar** (tablets and desktop), extra destinations (Feeds, Lists, Saved, Settings, New post) | Elk | `24b86a15a` `c3e419ae2` |
| **Federated / Local** placeholder timelines (`src/screens/PlaceholderTimelines.tsx`) | Elk | `24b86a15a` |
| Tablets use the custom sidebar as their tab bar (upstream 1.136 renders the sidebar on native tablets; the fork threads upstream's tab switching through the catalog items) | Fork, adapting upstream 1.136 | `c85748f8e` |
| **Atmosphere** as a nav catalog option, offered while its Upstream preview is on; Federated moved to the Globe icon | Fork, adapting upstream 1.136/1.137 | `c85748f8e` `c68517420` |
| **Android launcher shortcuts** (long-press the app icon): customizable like the bottom bar, up to 4, icons generated from the app's SVGs (`modules/expo-app-shortcuts`, `plugins/withAndroidShortcutIcons.js`) | Fork | `3ba0aa956` `1ea7fef8a` `7a8b24ad6` `abfd1207d` |
| **Settings pages as launcher shortcuts**: every Settings page and sub-page plus Storybook/Debug Moderation, in a "Settings" section of the shortcuts editor (`settingsCatalog.tsx`) | Fork | `4140cae56` |

## Android home screen widgets

| Change | Source | Commits |
|---|---|---|
| **New post** and **Account stats** widgets | Fork | `3eaa09e66` `b37072a3f` |
| **Stats card, Composer, Interactions, Pinned feeds, Lists** widgets | Fork | `714759782` `c74015ec3` |
| **Chats** widget (square, scrolling list, empty state with "New chat") | Fork | `709dbbd72` `6a5d427a5` |
| Widget text follows the app language (`widget_labels.json`), all providers refresh | Fork | `d2cd5622e` `d70902e63` |
| Generated by `plugins/withAndroidWidgets.js` (Kotlin RemoteViews providers); data written by `src/lib/hooks/useUpdateWidgets.ts` | Fork | (above) |
| **Trending Topics widget fixes** for upstream's widget: picker preview image on Android 11 and lower, themed and translatable loading card instead of the bare "Loading widget", Romanian picker text (`modules/fork-widgets`, `plugins/withForkWidgets.js`) | Fork, adapting upstream 1.137 | `4dae56757` `a4626e070` `ef45cf57f` |
| **Moving to expo-widgets** (in progress): New post and Stats rewritten as expo-widgets components (`src/features/homeWidgets`) with picker previews and light/dark; the other six are still Kotlin | Fork | `4da7b8017` `45e80a2f2` (fix on branch `fix/widgets-plugin-syntax`) |

## Witchsky features

Ported in phases from witchsky, all behind the **Witchsky** master toggle in Beta
features. Plan and skipped items: [witchsky-features-plan.md](./witchsky-features-plan.md).

| Change | Source | Commits |
|---|---|---|
| Feed display toggles: hide composer prompt, hide "Load new posts" button, don't fall back to Discover | Witchsky | `124302a94` `22e60b279` |
| "Mutuals" label, rename the "post" verb | Witchsky | `4134f9059` |
| Square avatars (display-prefs context) and square buttons | Witchsky | `1d9a047bf` `a1b31e249` |
| **Counts & metrics** ("calm timeline"): hide post/profile counts and "Follows you", Lite/Exact count formats | Witchsky | `a6720c3d4` `a1b31e249` |
| "Open in PDSls" and "Open on [instance]" for bridged fediverse accounts in the post menu | Witchsky | `ae80cdebe` |
| Delete-and-redraft, download video | Witchsky | `76dd1f938` |
| PDS badge on profiles, multi-account "Like as…" / "Repost as…" | Witchsky | `952c170ba` |
| Custom AppView DID override | Witchsky | `655075508` |
| Accent colour / hue presets | Witchsky | `83247f58b` `125daeb74` |
| Witchsky master toggle | Fork | `cf0fd1af0` |

## Search

| Change | Source | Commits |
|---|---|---|
| Advanced search UI and search v2, adopted before upstream shipped them (now upstream's own) | Upstream #10992, #10993 | `1e4cc48f0` `775e597a1` `b9f5f8f56` `8327443d6` |
| Advanced search behind a Beta toggle (`src/screens/Search/searchExperiments.ts`) | Fork | `ca651b9da` |
| **Media tab** in search results (posts with images or video) | Fork | `491855ea2` |

## Profiles and posts

| Change | Source | Commits |
|---|---|---|
| **Public Likes tab** on other profiles, read from their public like records (`src/lib/api/feed/publicLikes.ts`) | Fork | `7f3943903` `7c77b7782` |
| **Translator badge** on profiles of app translators (DID-keyed) | Fork | `bef0d2d49` `a5c509319` |
| **Gallery fallback**: "update your app" card for 5+ image galleries (Beta toggle); restored after upstream deleted it | Fork | `033dd97ed` `8a456dfef` |

## Beta features page

Upstream's Beta features page (1.128) rewritten as a nested layout: the beta master
toggle gates all fork sections, with the Witchsky master nested inside.

| Change | Source | Commits |
|---|---|---|
| Fork toggles in Beta features (replaced the old Experimental features screen) | Fork, adapting upstream 1.128 | `033dd97ed` `234d6f8c7` |
| **Upstream previews**: in-development upstream features off by default, each with a toggle (Keep your place in Following, New Notifications screen, Atmosphere) | Fork | `95a2015a1` `b52e5cd38` `c68517420` |
| **Moderation inbox sample data**: the real inbox, or generated reports and notices covering every status, action and appeal state, with a chosen standing banner; writes stay local (`moderation-inbox-test-data.ts`) | Fork | `50a45f78f` `c85748f8e` |
| Find friends: new invite UI by default, legacy contacts opt-in | Fork | `394ea411b` `6e864df3e` |
| Test live event banner | Fork | `ab98557aa` |
| iOS version sunset NUX, previewable on Android | Upstream #11424 | `9e60c760f` |

## Localization

| Change | Source | Commits |
|---|---|---|
| **Romanian translations** for all fork strings and widget picker text | Fork | `57ceb4fa7` `b573f50d8` `ef45cf57f` |
| **Pseudolocales** (LTR and RTL) for testing layouts (`src/locale/pseudo.ts`) | Fork | `7b61d6a28` |
| **What's New** changelog flyout: Settings entry and `/whats-new` link, Markdown changelog with Romanian translation (`src/features/whatsNew`) | Fork | `02ba8da24` `157e54226` `e66e8e66a` `3a8cfcae4` |
| **Localization help** feed banner and Crowdin/Discord invite dialog | Fork | `ed69ee350` |

## Removed

| Change | Why | Commits |
|---|---|---|
| **AI alt text via OpenRouter** (Witchsky phase 7) | No longer needed | added `655075508`, removed `c85748f8e` |
| **Search v2 toggle** | Upstream made search v2 the only search (1.128) | `234d6f8c7` |
| **"Storybook (old)"** legacy debug panel | Upstream deleted the old panel (1.127) | `75db10aad`, reverted `b95d9b96c` |
| **Experimental features screen** | Replaced by Beta features | `234d6f8c7` |
| **"Better defaults"** (alt text required, autoplay off) | Reverted to upstream defaults | `b393ca5b0` |
| **Profile links preview toggle** | Shipped upstream in 1.137 | `c68517420` |

## Upstream upgrades

Each upgrade is a `git merge <tag>` on a `chore/upgrade-<version>` branch. Older ones
have a plan in `docs/upgrade-<version>-plan.md`.

| Version | Notes |
|---|---|
| 1.125.0 | First upstream merge into the fork; restored `GalleryFallbackEmbed` |
| 1.126.0 | Took upstream's advanced search / DateField over the early fork ports |
| 1.127.1 | Dropped the legacy debug panel |
| 1.128.0 | Search v2 only; Beta features page rewritten; ESLint → Oxlint |
| 1.129.0 + 1.129.1 | Two staged merges |
| 1.130.0 | ProfileFeed → CustomFeed rename |
| 1.131.1 | `@atproto/api` → generated lexicon clients; fork call sites migrated |
| 1.132.0 | Moderation inbox (gated) |
| 1.133.0 | Webpack → Metro for web; legacy icon restored |
| 1.134.0 + 1.135.0 | Icon system rewrite; Japan logo kept as a fork asset; Upstream previews |
| 1.136.0 | Tablet support; real moderation inbox; OpenRouter removed |
| 1.137.0 | React Native 0.88 / Expo 58; Trending Topics widget; flag renames |

---

## Keeping this file up to date

- **New fork feature:** add a row to the right section with its source and commits.
- **Removed feature:** move it to **Removed** and say why.
- **Upstream upgrade:** add a row to **Upstream upgrades** and update **Current
  upstream base** at the top. If upstream ships something the fork had, note it
  under the original entry.
- **Source** is where the idea or code came from, not who wrote it here.
