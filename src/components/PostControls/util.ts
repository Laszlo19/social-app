import {useCallback} from 'react'
import {useLingui} from '@lingui/react'

import {useDisplayPrefs} from '#/state/preferences'

/**
 * This matches `formatCount` from `view/com/util/numeric/format.ts`, but has
 * additional truncation logic for large numbers and honours the `countsFormat`
 * display pref (default = compact with decimals, lite = compact no decimals,
 * exact = standard full-number notation). `roundingMode` always uses 'trunc'.
 */
export function useFormatPostStatCount() {
  const {i18n} = useLingui()
  const {countsFormat} = useDisplayPrefs()

  return useCallback(
    (postStatCount: number) => {
      if (countsFormat === 'exact') {
        return i18n.number(postStatCount, {
          notation: 'standard',
          roundingMode: 'trunc',
        })
      }
      if (countsFormat === 'lite') {
        return i18n.number(postStatCount, {
          notation: 'compact',
          maximumFractionDigits: 0,
          roundingMode: 'trunc',
        })
      }
      // default: compact with up to 1 decimal, dropping decimals above 10k
      const isOver10k = postStatCount >= 10_000
      return i18n.number(postStatCount, {
        notation: 'compact',
        maximumFractionDigits: isOver10k ? 0 : 1,
        roundingMode: 'trunc',
      })
    },
    [i18n, countsFormat],
  )
}
