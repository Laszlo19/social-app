import {device, useStorage} from '#/storage'

/**
 * Experimental fork toggle for the advanced-search dialog, stored in device
 * storage and managed on the Beta Features settings screen. Defaults to off, so
 * the advanced filter dialog stays hidden until the user opts in (or enables the
 * Witchsky master toggle). Note: search itself is always v2 now (upstream
 * removed v1 in 1.128.0), so there is no longer a v2 toggle.
 */
export function useAdvancedSearchEnabled(): boolean {
  const [enabled] = useStorage(device, ['experimentalAdvancedSearch'])
  return !!enabled
}
