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
  'squareAvatars',
  'squareButtons',
  'hidePostCounts',
  'hideProfileCounts',
  'hideFollowsYou',
  'countsFormat',
] as const

const defaults: DisplayPrefs = {
  squareAvatars: false,
  squareButtons: false,
  hidePostCounts: false,
  hideProfileCounts: false,
  hideFollowsYou: false,
  countsFormat: 'default',
}

function readPrefs(): DisplayPrefs {
  return {
    squareAvatars: device.get(['squareAvatars']) ?? false,
    squareButtons: device.get(['squareButtons']) ?? false,
    hidePostCounts: device.get(['hidePostCounts']) ?? false,
    hideProfileCounts: device.get(['hideProfileCounts']) ?? false,
    hideFollowsYou: device.get(['hideFollowsYou']) ?? false,
    countsFormat: device.get(['countsFormat']) ?? 'default',
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
