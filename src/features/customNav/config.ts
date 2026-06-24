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

/** Default bottom bar layout - matches the pre-customization hardcoded bar. */
export const DEFAULT_VISIBLE: NavItemId[] = [
  'home',
  'search',
  'messages',
  'notifications',
  'profile',
]

/** Always keep at least one item so the bar is never empty. */
export const MIN_VISIBLE = 1

/**
 * Cap visible items so tap targets stay usable. The bar distributes width
 * with flex, so more items just shrink each button.
 */
export const MAX_VISIBLE = 6
