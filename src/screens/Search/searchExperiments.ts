import {device, useStorage} from '#/storage'

/**
 * Experimental fork toggles for the search screen, stored in device storage and
 * managed on the Experimental Features settings screen. Both default to off, so
 * search uses the stable v1 endpoint and hides the advanced filter dialog until
 * the user opts in (or enables the Witchsky master toggle).
 */
export function useSearchV2Enabled(): boolean {
  const [enabled] = useStorage(device, ['experimentalSearchV2'])
  return !!enabled
}

export function useAdvancedSearchEnabled(): boolean {
  const [enabled] = useStorage(device, ['experimentalAdvancedSearch'])
  return !!enabled
}
