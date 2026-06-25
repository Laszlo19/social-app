import {requireNativeModule} from 'expo-modules-core'

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

const NativeModule = requireNativeModule('ExpoAppShortcuts')

export function isSupported(): boolean {
  return NativeModule.isSupported()
}

export function setShortcuts(shortcuts: ShortcutItem[]): void {
  NativeModule.setShortcuts(shortcuts)
}
