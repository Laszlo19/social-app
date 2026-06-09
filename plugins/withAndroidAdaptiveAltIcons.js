// @ts-check
const {withDangerousMod} = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

/**
 * Works around a limitation in @bsky.app/expo-dynamic-app-icon: on Android it
 * generates only flat bitmap drawables (@mipmap/<key>) for alternate icons, so
 * the launcher cannot apply its adaptive mask and renders the raw square image.
 * Only the default icon (configured via android.adaptiveIcon) is adaptive.
 *
 * This plugin runs AFTER the dynamic-app-icon plugin during prebuild and wraps
 * each alternate's flat bitmap in an adaptive-icon XML, using the existing
 * bitmap as the foreground over a solid white background. The foreground art is
 * not safe-zone padded, so the mask may crop the edges, but the icon will be
 * correctly masked to the launcher's shape.
 *
 * @param {import('@expo/config-plugins').ConfigPlugin<{iconKeys: string[]}>}
 */
const ANDROID_RES_PATH = ['app', 'src', 'main', 'res']
const DPI_FOLDERS = [
  'mipmap-mdpi',
  'mipmap-hdpi',
  'mipmap-xhdpi',
  'mipmap-xxhdpi',
  'mipmap-xxxhdpi',
]

function safeKey(name) {
  return name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()
}

function adaptiveXml(foregroundResource) {
  return `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@android:color/white"/>
    <foreground android:drawable="@mipmap/${foregroundResource}"/>
</adaptive-icon>
`
}

const withAndroidAdaptiveAltIcons = (config, {iconKeys}) => {
  return withDangerousMod(config, [
    'android',
    async config => {
      const resPath = path.join(
        config.modRequest.platformProjectRoot,
        ...ANDROID_RES_PATH,
      )
      const anyDpiPath = path.join(resPath, 'mipmap-anydpi-v26')
      await fs.promises.mkdir(anyDpiPath, {recursive: true})

      for (const rawKey of iconKeys) {
        const key = safeKey(rawKey)
        // The dynamic-app-icon plugin writes <key>.png and <key>_round.png to
        // each dpi folder. Wrap both variants.
        for (const base of [key, `${key}_round`]) {
          const fgName = `${base}_fg`
          let copiedAny = false

          for (const dpi of DPI_FOLDERS) {
            const src = path.join(resPath, dpi, `${base}.png`)
            const dst = path.join(resPath, dpi, `${fgName}.png`)
            try {
              await fs.promises.copyFile(src, dst)
              copiedAny = true
            } catch {
              // bitmap for this dpi/variant may not exist; skip
            }
          }

          if (!copiedAny) continue

          // mipmap/<base> now resolves to this adaptive XML on API 26+, whose
          // foreground points at the copied bitmap (<base>_fg) to avoid a
          // self-referential resource loop.
          await fs.promises.writeFile(
            path.join(anyDpiPath, `${base}.xml`),
            adaptiveXml(fgName),
          )
        }
      }

      return config
    },
  ])
}

module.exports = withAndroidAdaptiveAltIcons
