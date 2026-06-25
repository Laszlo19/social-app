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
export type DisplayPrefs = {
  /** Use square avatars instead of circular. */
  squareAvatars: boolean
}

const DISPLAY_PREF_KEYS = ['squareAvatars'] as const

const defaults: DisplayPrefs = {
  squareAvatars: false,
}

function readPrefs(): DisplayPrefs {
  return {
    squareAvatars: device.get(['squareAvatars']) ?? false,
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
