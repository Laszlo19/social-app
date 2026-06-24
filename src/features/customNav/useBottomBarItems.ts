import {device, useStorage} from '#/storage'
import {
  NAV_ITEM_BY_ID,
  NAV_ITEM_CATALOG,
  type NavCatalogItem,
} from './catalog'
import {
  DEFAULT_VISIBLE,
  MAX_VISIBLE,
  MIN_VISIBLE,
  type NavItemId,
} from './config'

// Stable scope identity so `useStorage`'s subscription effect doesn't re-run
// every render (the bottom bar re-renders frequently).
const SCOPE: ['bottomBarItems'] = ['bottomBarItems']

/**
 * Reads and mutates the user's bottom-bar layout from device storage, resolved
 * against the catalog. Reactive via `useStorage`, so the bar and the settings
 * screen stay in sync. Unknown / stale ids are dropped defensively, and we fall
 * back to the default layout when nothing is stored or everything was removed.
 */
export function useBottomBarItems() {
  const [stored, setStored] = useStorage(device, SCOPE)

  const filtered = (stored ?? DEFAULT_VISIBLE).filter(
    id => id in NAV_ITEM_BY_ID,
  )
  const visibleIds = filtered.length > 0 ? filtered : DEFAULT_VISIBLE

  const visible: NavCatalogItem[] = visibleIds.map(id => NAV_ITEM_BY_ID[id])
  const available: NavCatalogItem[] = NAV_ITEM_CATALOG.filter(
    item => !visibleIds.includes(item.id),
  )

  const canAdd = visibleIds.length < MAX_VISIBLE
  const canRemove = visibleIds.length > MIN_VISIBLE

  const setOrder = (ids: NavItemId[]) => setStored(ids)

  const show = (id: NavItemId) => {
    if (visibleIds.includes(id) || !canAdd) return
    setStored([...visibleIds, id])
  }

  const hide = (id: NavItemId) => {
    if (!canRemove) return
    setStored(visibleIds.filter(x => x !== id))
  }

  const reset = () => setStored(DEFAULT_VISIBLE)

  return {
    visible,
    available,
    visibleIds,
    canAdd,
    canRemove,
    setOrder,
    show,
    hide,
    reset,
  }
}
