/**
 * Advanced search filters are now standard and always available, so this always
 * returns true. Kept as a hook so existing call sites don't need to change.
 * (Search itself is always v2 now - upstream removed v1 in 1.128.0.)
 */
export function useAdvancedSearchEnabled(): boolean {
  return true
}
