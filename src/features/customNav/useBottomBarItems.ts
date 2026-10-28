import {device, useStorage} from '#/storage'
import {useAnalytics} from '#/analytics'
import {
  NAV_ITEM_BY_ID,
  NAV_ITEM_CATALOG,
  type NavCatalogItem,
} from './catalog'
import {
  DEFAULT_LEFT_NAV,
  DEFAULT_QUICK_ACTIONS,
  DEFAULT_VISIBLE,
  MAX_LEFT_NAV,
  MAX_QUICK_ACTIONS,
  MAX_VISIBLE,
  MIN_VISIBLE,
  type NavItemId,
  type NavSurface,
} from './config'

// Stable scope identities so `useStorage`'s subscription effect doesn't re-run
// every render (these navs re-render frequently).
const BOTTOM_BAR_SCOPE: ['bottomBarItems'] = ['bottomBarItems']
const LEFT_NAV_SCOPE: ['leftNavItems'] = ['leftNavItems']
const QUICK_ACTIONS_SCOPE: ['quickActionItems'] = ['quickActionItems']

const DEFAULTS: Record<NavSurface, NavItemId[]> = {
  bottomBar: DEFAULT_VISIBLE,
  leftNav: DEFAULT_LEFT_NAV,
  quickActions: DEFAULT_QUICK_ACTIONS,
}

const MAXES: Record<NavSurface, number> = {
  bottomBar: MAX_VISIBLE,
  leftNav: MAX_LEFT_NAV,
  quickActions: MAX_QUICK_ACTIONS,
}

/**
 * The catalog items offered for a surface. The left nav keeps its own
 * dedicated compose button, so `compose` is not offered there. Items limited
 * to other surfaces (e.g. settings pages, launcher shortcuts only) and items
 * whose feature gate is off aren't offered.
 */
function poolForSurface(
  surface: NavSurface,
  isFeatureEnabled: (
    feature: NonNullable<NavCatalogItem['requiresFeature']>,
  ) => boolean,
): NavCatalogItem[] {
  return NAV_ITEM_CATALOG.filter(
    item =>
      !(surface === 'leftNav' && item.id === 'compose') &&
      (!item.surfaces || item.surfaces.includes(surface)) &&
      (!item.requiresFeature || isFeatureEnabled(item.requiresFeature)),
  )
}

/**
 * Reads and mutates a nav surface's layout from device storage, resolved
 * against the catalog. Reactive via `useStorage`, so the nav and the settings
 * screen stay in sync. Unknown / stale (or surface-disallowed) ids are dropped
 * defensively, and we fall back to the default layout when nothing is stored or
 * everything was removed.
 */
export function useNavItems(surface: NavSurface) {
  // Both literal scopes are read unconditionally (rules of hooks); we select
  // the one for this surface. Keeps each useStorage call strongly typed.
  const [bottomBarStored, setBottomBarStored] = useStorage(
    device,
    BOTTOM_BAR_SCOPE,
  )
  const [leftNavStored, setLeftNavStored] = useStorage(device, LEFT_NAV_SCOPE)
  const [quickActionsStored, setQuickActionsStored] = useStorage(
    device,
    QUICK_ACTIONS_SCOPE,
  )
  const stored =
    surface === 'bottomBar'
      ? bottomBarStored
      : surface === 'leftNav'
        ? leftNavStored
        : quickActionsStored
  const setStored =
    surface === 'bottomBar'
      ? setBottomBarStored
      : surface === 'leftNav'
        ? setLeftNavStored
        : setQuickActionsStored

  const ax = useAnalytics()
  const pool = poolForSurface(surface, feature =>
    ax.features.enabled(ax.features[feature]),
  )
  const allowed = new Set(pool.map(item => item.id))

  const filtered = (stored ?? DEFAULTS[surface]).filter(
    id => id in NAV_ITEM_BY_ID && allowed.has(id),
  )
  const visibleIds = filtered.length > 0 ? filtered : DEFAULTS[surface]

  const visible: NavCatalogItem[] = visibleIds.map(id => NAV_ITEM_BY_ID[id])
  const available: NavCatalogItem[] = pool.filter(
    item => !visibleIds.includes(item.id),
  )

  const canAdd = visibleIds.length < MAXES[surface]
  const canRemove = visibleIds.length > MIN_VISIBLE

  const setOrder = (ids: NavItemId[]) => setStored(ids)

  const show = (id: NavItemId) => {
    if (visibleIds.includes(id) || !canAdd || !allowed.has(id)) return
    setStored([...visibleIds, id])
  }

  const hide = (id: NavItemId) => {
    if (!canRemove) return
    setStored(visibleIds.filter(x => x !== id))
  }

  const reset = () => setStored(DEFAULTS[surface])

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

export function useBottomBarItems() {
  return useNavItems('bottomBar')
}

export function useLeftNavItems() {
  return useNavItems('leftNav')
}

export function useQuickActionItems() {
  return useNavItems('quickActions')
}
