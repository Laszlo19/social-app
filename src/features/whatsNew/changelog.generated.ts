/*
 * GENERATED FILE - do not edit by hand.
 * Regenerate with: node scripts/build-changelog.mjs
 * Source: changelog/<locale>/<version>.md
 */

export const CHANGELOG_VERSIONS: string[] = [
  "1.127.1",
  "1.126.0"
]

/** version -> locale -> markdown source */
export const CHANGELOG: Record<string, Record<string, string>> = {
  "1.126.0": {
    "en": "# Version 1.126.0\n\n- **Home-screen widgets now speak your language** – widget labels follow your app language instead of always showing English.\n- Fixed a crash when opening the **Search** tab.\n- Fixed the advanced-search **date pickers** crashing when left empty.\n- When something goes wrong, the error screen now shows a **copyable report** so issues are easier to send in.\n- Upgraded to Bluesky **1.126.0**.\n"
  },
  "1.127.1": {
    "en": "# Version 1.127.1\n\n- **New Chats widget** – a compact home-screen widget listing your recent chats and group chats, with a friendly empty state when you have none.\n- **Tidier widgets** – the Feeds, Lists, and composer widgets now default to a small square size. You can still resize them on your home screen.\n- **Search is now yours to control** – the newer search and advanced filters live under *Experimental features* in Settings, so you can turn them on or off.\n- Upgraded to Bluesky **1.127.1**, bringing chat fixes, a smoother sign-up flow, and better video uploads.\n"
  }
}
