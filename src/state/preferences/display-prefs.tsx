import {createContext, useContext, useEffect, useState} from 'react'

import {device} from '#/storage'

/**
 * App-wide "density" / display preferences read by hot components (avatars,
 * etc.). These are device-storage prefs, but exposed through a single context
 * + one subscription per key so a component rendered hundreds of times reads
 * them with a cheap `useContext` instead of its own storage subscription.
 *
 * Extend this as more density options land (square buttons, compact posts, ...).
 */
export type CountsFormat = 'default' | 'lite' | 'exact'

export type DisplayPrefs = {
  /** Master toggle: all Witchsky fork features are visible/active. */
  witchskyEnabled: boolean
  /** Use square avatars instead of circular. */
  squareAvatars: boolean
  /** Replace pill-shaped buttons with rectangular ones. */
  squareButtons: boolean
  /** Hide post engagement counts (likes / reposts / replies). */
  hidePostCounts: boolean
  /** Hide profile counts (followers / following / posts). */
  hideProfileCounts: boolean
  /** Hide the "Follows you" label on profiles. */
  hideFollowsYou: boolean
  /** How to format visible counts: compact, rounded compact, or exact. */
  countsFormat: CountsFormat
}

const DISPLAY_PREF_KEYS = [
  'witchskyEnabled',
  'squareAvatars',
  'squareButtons',
  'hidePostCounts',
  'hideProfileCounts',
  'hideFollowsYou',
  'countsFormat',
] as const

const defaults: DisplayPrefs = {
  witchskyEnabled: false,
  squareAvatars: false,
  squareButtons: false,
  hidePostCounts: false,
  hideProfileCounts: false,
  hideFollowsYou: false,
  countsFormat: 'default',
}

function readPrefs(): DisplayPrefs {
  const witchskyEnabled = device.get(['witchskyEnabled']) ?? false
  return {
    witchskyEnabled,
    squareAvatars: witchskyEnabled && (device.get(['squareAvatars']) ?? false),
    squareButtons: witchskyEnabled && (device.get(['squareButtons']) ?? false),
    hidePostCounts: witchskyEnabled && (device.get(['hidePostCounts']) ?? false),
    hideProfileCounts:
      witchskyEnabled && (device.get(['hideProfileCounts']) ?? false),
    hideFollowsYou: witchskyEnabled && (device.get(['hideFollowsYou']) ?? false),
    countsFormat: witchskyEnabled
      ? (device.get(['countsFormat']) ?? 'default')
      : 'default',
  }
}

const Context = createContext<DisplayPrefs>(defaults)
Context.displayName = 'ForkDisplayPrefsContext'

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [prefs, setPrefs] = useState(readPrefs)

  useEffect(() => {
    const subs = DISPLAY_PREF_KEYS.map(key =>
      device.addOnValueChangedListener([key], () => setPrefs(readPrefs())),
    )
    return () => subs.forEach(sub => sub.remove())
  }, [])

  return <Context.Provider value={prefs}>{children}</Context.Provider>
}

export function useDisplayPrefs() {
  return useContext(Context)
}
