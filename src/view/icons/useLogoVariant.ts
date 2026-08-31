import {useKawaiiMode} from '#/state/preferences/kawaii'
import {device, useStorage} from '#/storage'
import {useAnalytics} from '#/analytics'
import {useGeolocation} from '#/geolocation'

export type LogoVariant = 'default' | 'japan' | 'kawaii'

export function useLogoVariant(allowVariants = true): LogoVariant {
  const ax = useAnalytics()
  const geolocation = useGeolocation()
  const kawaii = useKawaiiMode()
  /*
   * Fork beta overrides (Settings > Beta features): force a specific logo
   * variant regardless of geolocation / kawaii mode, so the Japan and kawaii
   * logos can be used/previewed anywhere. Japan wins if both are enabled.
   */
  const [forceJapanLogo] = useStorage(device, ['forceJapanLogo'])
  const [forceKawaiiLogo] = useStorage(device, ['forceKawaiiLogo'])
  const japanLogoEnabled =
    allowVariants &&
    geolocation.countryCode === 'JP' &&
    ax.features.enabled(ax.features.CustomLogoJapanEnable)

  if (!allowVariants) return 'default'
  if (forceJapanLogo) return 'japan'
  if (forceKawaiiLogo) return 'kawaii'
  if (japanLogoEnabled) return 'japan'
  if (kawaii) return 'kawaii'
  return 'default'
}
