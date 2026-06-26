import {type Theme} from '@bsky.app/alf'

import {themes} from '#/alf/themes'
import {
  hexToRgb,
  hslToRgb,
  rgbToHex,
  rgbToHsl,
} from '#/alf/util/colorGeneration'

/**
 * The hue (degrees) of the default primary palette (sky blue).
 */
export const BLUE_HUE = 211

/**
 * Preset accent choices exposed in Appearance settings.
 */
export const ACCENT_PRESETS = [
  {label: 'Blue', hue: 211},
  {label: 'Purple', hue: 270},
  {label: 'Pink', hue: 322},
  {label: 'Red', hue: 5},
  {label: 'Orange', hue: 28},
  {label: 'Green', hue: 145},
] as const

export type AccentPresetHue = (typeof ACCENT_PRESETS)[number]['hue']

const PRIMARY_KEYS = [
  'primary_25',
  'primary_50',
  'primary_100',
  'primary_200',
  'primary_300',
  'primary_400',
  'primary_500',
  'primary_600',
  'primary_700',
  'primary_800',
  'primary_900',
  'primary_950',
  'primary_975',
] as const

function shiftHex(hex: string, delta: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const {h, s, l} = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const newH = ((h + delta) % 360 + 360) % 360
  const out = hslToRgb(newH, s, l)
  return rgbToHex(out.r, out.g, out.b)
}

function shiftThemePrimary(theme: Theme, delta: number): Theme {
  const palette = {...theme.palette} as Record<string, unknown>
  for (const key of PRIMARY_KEYS) {
    const existing = palette[key]
    if (typeof existing === 'string') {
      palette[key] = shiftHex(existing, delta)
    }
  }
  return {...theme, palette: palette as Theme['palette']}
}

/**
 * Builds `themesOverride` for `ThemeProvider` that shifts the primary accent
 * hue from the default blue to `toHue` (degrees, 0-359).
 */
export function buildAccentThemesOverride(
  toHue: number,
): Partial<typeof themes> {
  const delta = toHue - BLUE_HUE
  return {
    light: shiftThemePrimary(themes.light, delta),
    dark: shiftThemePrimary(themes.dark, delta),
    dim: shiftThemePrimary(themes.dim, delta),
  }
}
