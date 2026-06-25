// Default (iOS / web) implementation. Dynamic launcher shortcuts are an
// Android-only feature, so these are no-ops everywhere else.

export type ShortcutItem = {
  /** Stable id for the shortcut. */
  id: string
  /** Visible label (already localized). */
  label: string
  /** Deep link the shortcut opens, e.g. `bluesky://search`. */
  deepLink: string
  /** Android drawable resource name for the icon, e.g. `shortcut_search`. */
  iconResName?: string
}

export function isSupported(): boolean {
  return false
}

export function setShortcuts(_shortcuts: ShortcutItem[]): void {
  // no-op on non-Android platforms
}
