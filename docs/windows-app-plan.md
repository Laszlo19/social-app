# Windows app plan (WinUI 3)

A plan for a native Windows client, written in C# and XAML with WinUI 3. It is
**not a port**: no React Native code runs in it. It follows this project's
structure, layout and design so the two feel like the same app, and it reuses
the translation catalogs from `src/locale/locales/`.

Status: **planning only**. Nothing is built yet.

---

## Goals

- A real Windows app: Mica backdrop, title bar integration, Windows
  notifications, taskbar badge, jump list, Snap layouts, keyboard and pen.
- Same information architecture and look as the desktop web layout of this
  project (left nav, centre column, right sidebar).
- Reuse every existing translation, so the Windows app starts with the same
  language coverage, including the fork's Romanian.
- Lives in its **own repository** (e.g. `bluesky-windows`), with this repo as
  the reference and the source of the translation catalogs.

## Non-goals (for the first versions)

- Sharing code with React Native, or running this codebase through React Native
  for Windows. Many Expo modules this app depends on have no Windows support,
  and upstream doesn't target Windows, so every upgrade would be a fight.
- Feature parity on day one. See the phases below.

---

## Tech stack

| Area | Choice | Notes |
|---|---|---|
| UI | WinUI 3 (Windows App SDK), XAML | Packaged (MSIX), Windows 10 1809+ |
| Language | C# on current .NET | |
| Architecture | MVVM with CommunityToolkit.Mvvm | Mirrors this project's screens → hooks/state split |
| AT Protocol | [FishyFlip](https://github.com/drasticactions/FishyFlip) to start, wrapped behind our own interfaces | Swappable later; generate missing calls from `lexicons/` |
| Data / caching | In-memory cache per query, keyed like TanStack Query keys | Equivalent of `src/state/queries` |
| Storage | `ApplicationData` (settings), Credential Locker / `PasswordVault` (sessions) | Never store tokens in plain settings |
| Images | WinUI `Image` with a disk cache | |
| Video | `MediaPlayerElement` (HLS) | |
| Translations | `.resw` generated from the `.po` catalogs + an ICU MessageFormat library at runtime | See **Translations** |
| Packaging / CI | MSIX, GitHub Actions on `windows-latest` | Sideload build first, Store later |

---

## Project structure

Mirrors `src/` so a feature is easy to find in both projects.

```
bluesky-windows/
├── src/
│   ├── Bluesky.App/                  # WinUI 3 app project
│   │   ├── App.xaml(.cs)             # ← src/App.tsx (startup, providers)
│   │   ├── Shell/                    # ← src/view/shell
│   │   │   ├── MainWindow.xaml       #   window, title bar, Mica
│   │   │   ├── LeftNav.xaml          #   ← desktop/LeftNav.tsx (customizable, like features/customNav)
│   │   │   └── RightSidebar.xaml     #   ← desktop/RightNav.tsx (search, trending)
│   │   ├── Navigation/               # ← src/Navigation.tsx, src/routes.ts
│   │   │   ├── Routes.cs             #   same route names and paths (/profile/:name, …)
│   │   │   └── DeepLinks.cs          #   bsky.app links and bluesky:// protocol activation
│   │   ├── Screens/                  # ← src/screens (+ src/view/screens)
│   │   │   ├── Home/  Profile/  PostThread/  Search/  Notifications/
│   │   │   ├── Messages/  Settings/  ModerationInbox/  …
│   │   │   └── <Screen>/<Screen>Page.xaml + <Screen>ViewModel.cs
│   │   ├── Controls/                 # ← src/components (Button, Dialog, Menu, TextField…)
│   │   │   ├── Post/                 #   post card, embeds, rich text, post controls
│   │   │   └── …
│   │   ├── Features/                 # ← src/features (larger cross-screen modules)
│   │   ├── Themes/                   # ← src/alf
│   │   │   ├── Tokens.xaml           #   ← alf/tokens.ts (spacing, radii, font sizes)
│   │   │   ├── Light.xaml  Dim.xaml  Dark.xaml   # ← alf/themes.ts palettes
│   │   │   └── Typography.xaml       #   ← Typography (Text, H1, H2, P)
│   │   ├── Strings/                  # generated .resw per language (see Translations)
│   │   │   ├── en-US/Resources.resw
│   │   │   ├── ro/Resources.resw
│   │   │   └── …
│   │   └── Assets/                   # icons (from assets/icons SVGs), app icon, splash
│   ├── Bluesky.Core/                 # no UI; unit-testable
│   │   ├── Api/                      # ← src/lib/api: AT Protocol client wrapper
│   │   ├── Session/                  # ← src/state/session (multi-account)
│   │   ├── Queries/                  # ← src/state/queries (feeds, threads, profiles…)
│   │   ├── Preferences/              # ← src/state/preferences
│   │   ├── Moderation/               # ← moderation decisions (see Risks)
│   │   ├── RichText/                 # facets: mentions, links, tags
│   │   └── Localization/             # string lookup + ICU formatting
│   └── Bluesky.Core.Tests/
├── tools/
│   └── PoToResw/                     # .po → .resw converter (see Translations)
└── docs/
```

### Design system mapping (ALF → XAML)

| This project | Windows app |
|---|---|
| `alf/tokens.ts` spacing (`2xs`…`5xl`), radii, font sizes | `Tokens.xaml` as `x:Double` / `Thickness` / `CornerRadius` resources with the same names |
| `alf/themes.ts` palettes (`primary_500`, `contrast_*`) | `ThemeDictionaries` in `Light/Dim/Dark.xaml`, same names |
| Theme atoms (`t.atoms.bg`, `t.atoms.text`) | Semantic brushes (`BackgroundBrush`, `TextBrush`) |
| Breakpoints (`gtMobile`, `gtTablet`) | `VisualStateManager` adaptive triggers on window width |
| Icons (`assets/icons/ui/*.svg`) | Converted to XAML `PathIcon` data at build time |

### Layout mapping

| Window width | Layout | Same as |
|---|---|---|
| > 1300 px | Full left nav + centre column + right sidebar | Desktop web |
| 1100–1300 px | Minimal left nav (icons) + centre column + right sidebar | Desktop web, minimal nav |
| 800–1100 px | Minimal left nav + centre column | Tablet |
| < 800 px | Bottom nav, single column | Phone |

These match `src/alf/breakpoints.shared.ts` (`mobile` 800, `rightNav` 1100,
`tablet` 1300). The centre column keeps the same 600 px max width
(`CENTER_COLUMN_WIDTH` in `src/components/Layout/const.ts`).

---

## Translations

The `.po` files in this repo are the single source of truth. A build-time tool
converts them to `.resw`, so every existing translation (and future Crowdin
updates) reaches the Windows app automatically.

### Pipeline

```
src/locale/locales/<lang>/messages.po   (this repo, Crowdin)
        │  tools/PoToResw (runs in CI and on build)
        ▼
src/Bluesky.App/Strings/<lang>/Resources.resw
        │  ResourceLoader at runtime
        ▼
Localization.Get(key, args)  → ICU MessageFormat → final text
```

### Converter rules

| `.po` concept | `.resw` handling |
|---|---|
| Entry key | `.resw` names must be stable identifiers, so use the **same id Lingui generates** (hash of `msgid` + `msgctxt`). The key then matches across both apps, and keeps working when a `.po` is regenerated. |
| `msgstr` | Resource value. Empty → omitted, so the English (`en-US`) value is used. |
| `msgctxt` | Part of the key (as in Lingui). |
| `#.` translator comments, `#:` references | Written to the resource `<comment>`. |
| Placeholders `{name}` | Kept as-is; filled in by the ICU formatter. |
| Plurals `{count, plural, one {…} few {…} other {…}}` | Kept as the full ICU string; `.resw` has no plural support, so formatting happens at runtime with an ICU MessageFormat library (e.g. Jeffijoe.MessageFormat). Romanian's `few` form works this way. |
| Rich-text tags `<0>…</0>` | Kept; a small helper turns them into WinUI `Run`/`Hyperlink` inlines. |
| Language folders | `.po` folder names are BCP-47 already (`ro`, `pt-BR`, `zh-HK`); use them as `.resw` folder names. `en` becomes the default `en-US`. |

### Strings only the Windows app needs

New UI text (e.g. "Pin to taskbar") goes in a **Windows-only `.po`** next to the
main one, through the same Crowdin flow, so translators work in one place.
Strings that exist in the main catalog are reused, not duplicated: matching
English text gets the existing translation for free.

### Not covered by `.resw`

Windows reads some text from the package manifest (app name, description,
jump list and notification labels). Generate those per language as
`Strings/<lang>/Resources.resw` entries referenced with `ms-resource:` in
`Package.appxmanifest`.

---

## Features by phase

| Phase | Scope |
|---|---|
| **0. Foundation** | Repo, CI, MSIX sideload build, design tokens, translation pipeline, sign-in (app password first), multi-account storage |
| **1. Read-only MVP** | Home (Following + pinned feeds), post threads, profiles, search, images, link cards, quote posts, **moderation labels and hiding** |
| **2. Posting** | Composer (text, mentions, links, images, alt text, languages, threadgates), like/repost/quote/reply, follow/block/mute |
| **3. Notifications** | Notifications screen, Windows toast notifications, taskbar badge |
| **4. Chat** | Conversations, requests, group chats |
| **5. Settings and moderation** | Settings screens, content filters, muted words, lists, moderation inbox |
| **6. Windows extras** | Jump list (like the Android launcher shortcuts), Windows Widgets board (like the Android home screen widgets), share target, protocol links, Store release |

Fork features (customizable nav, Witchsky options, Beta features) come after
the matching base feature, using [FORK_CHANGES.md](./FORK_CHANGES.md) as the list.

---

## Risks

- **Moderation correctness.** Labels, warnings, blur/hide rules, muted words,
  blocks and age-restricted content come from Bluesky's moderation logic in
  TypeScript. The Windows app must reproduce the same decisions, or it shows
  content it shouldn't. Port it carefully, and test it against the same inputs
  as this project.
- **API drift.** Bluesky adds lexicons often. Keep the API layer generated from
  `lexicons/` where possible instead of hand-writing calls.
- **Scale.** Full parity with this app is months of work. Ship phases, not
  parity.
- **Auth.** App passwords are simplest to start; OAuth (atproto OAuth with a
  loopback redirect) should follow for a public release.

## Open questions

- FishyFlip vs a generated client from `lexicons/`.
- Minimum Windows version (Windows 10 support vs Windows 11-only features).
- Distribution: sideload only, or Microsoft Store.
