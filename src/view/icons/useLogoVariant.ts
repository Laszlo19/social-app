import {useKawaiiMode} from '#/state/preferences/kawaii'
import {device, useStorage} from '#/storage'

export type LogoVariant = 'default' | 'japan' | 'kawaii'

export function useLogoVariant(allowVariants = true): LogoVariant {
  const kawaii = useKawaiiMode()
  /*
   * Fork beta overrides (Settings > Beta features): force a specific logo
   * variant regardless of kawaii mode. Upstream retired the Japan logo, so
   * the override is now the only way to show it. Japan wins if both are
   * enabled.
   */
  const [forceJapanLogo] = useStorage(device, ['forceJapanLogo'])
  const [forceKawaiiLogo] = useStorage(device, ['forceKawaiiLogo'])

  if (!allowVariants) return 'default'
  if (forceJapanLogo) return 'japan'
  if (forceKawaiiLogo) return 'kawaii'
  if (kawaii) return 'kawaii'
  return 'default'
}
