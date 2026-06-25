/**
 * Shared types + constants for the customizable mobile bottom bar.
 *
 * The user's configuration is stored as a single ordered array of nav-item
 * ids (`bottomBarItems` in device storage). Any catalog item not present in
 * that array is considered "available" (hidden), so order and visibility live
 * in one field. See features/customNav/README is intentionally omitted; the
 * catalog in catalog.tsx is the source of truth for available items.
 */

export type NavItemId =
  | 'home'
  | 'search'
  | 'messages'
  | 'notifications'
  | 'profile'
  | 'feeds'
  | 'lists'
  | 'saved'
  | 'settings'
  | 'compose'
  | 'federated'
  | 'local'

/** The navigation surfaces that can be customized. */
export type NavSurface = 'bottomBar' | 'leftNav' | 'quickActions'

/** Default bottom bar layout - matches the pre-customization hardcoded bar. */
export const DEFAULT_VISIBLE: NavItemId[] = [
  'home',
  'search',
  'messages',
  'notifications',
  'profile',
]

/**
 * Default desktop sidebar layout - matches the pre-customization left nav
 * (which has room for more items than the bottom bar).
 */
export const DEFAULT_LEFT_NAV: NavItemId[] = [
  'home',
  'search',
  'notifications',
  'messages',
  'feeds',
  'lists',
  'saved',
  'profile',
  'settings',
]

/**
 * Default launcher long-press shortcuts (Android). Android shows ~4, so keep
 * the most useful destinations plus quick compose.
 */
export const DEFAULT_QUICK_ACTIONS: NavItemId[] = [
  'search',
  'notifications',
  'messages',
  'compose',
]

/** Always keep at least one item so the nav is never empty. */
export const MIN_VISIBLE = 1

/**
 * Cap visible items so tap targets stay usable. The bottom bar distributes
 * width with flex, so more items just shrink each button. The vertical
 * sidebar has room for the whole catalog. Android caps launcher shortcuts
 * at ~4-5, so we cap there.
 */
export const MAX_VISIBLE = 6
export const MAX_LEFT_NAV = 12
export const MAX_QUICK_ACTIONS = 4
