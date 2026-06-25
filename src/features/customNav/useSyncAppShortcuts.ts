import {useEffect} from 'react'
import {useLingui} from '@lingui/react/macro'

import {useSession} from '#/state/session'
import {IS_ANDROID} from '#/env'
import * as AppShortcuts from '../../../modules/expo-app-shortcuts'
import {type NavCatalogItem} from './catalog'
import {useQuickActionItems} from './useBottomBarItems'

function deepLinkFor(item: NavCatalogItem, handle?: string): string {
  if (item.special === 'compose') {
    return 'bluesky://intent/compose'
  }
  if (item.special === 'profileAvatar') {
    return handle ? `https://bsky.app/profile/${handle}` : 'https://bsky.app/'
  }
  // item.href is a path like "/search"; https links are handled by the app's
  // universal-link intent filter and routed by the existing linking config.
  return `https://bsky.app${item.href}`
}

/**
 * Keeps the Android launcher long-press shortcuts in sync with the user's
 * configured quick-action items. No-op on non-Android platforms (the native
 * module is Android-only). Mounted once in the app shell.
 */
export function useSyncAppShortcuts() {
  const {i18n} = useLingui()
  const {currentAccount} = useSession()
  const {visible} = useQuickActionItems()
  const handle = currentAccount?.handle

  // Serialize so the effect only re-runs when the resolved shortcuts actually
  // change (labels included, so it also re-syncs on language change).
  const payload = JSON.stringify(
    visible.map(item => ({
      id: item.id,
      label: i18n._(item.label),
      deepLink: deepLinkFor(item, handle),
    })),
  )

  useEffect(() => {
    if (!IS_ANDROID) return
    try {
      AppShortcuts.setShortcuts(JSON.parse(payload))
    } catch {
      // best-effort; shortcuts are non-critical
    }
  }, [payload])
}
