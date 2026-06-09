// @ts-check
const {
  withDangerousMod,
  withAndroidManifest,
  AndroidConfig,
} = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

/**
 * Works around a limitation in @bsky.app/expo-dynamic-app-icon: on Android it
 * generates only flat bitmap drawables (@mipmap/<key>) for alternate icons, so
 * the launcher cannot apply its adaptive mask and renders the raw square image.
 * Only the default icon (configured via android.adaptiveIcon) is adaptive.
 *
 * This plugin:
 *   1. Writes a separately-named adaptive-icon XML for each alternate
 *      (mipmap-anydpi-v26/ic_adaptive_<key>.xml) whose foreground is the
 *      existing flat bitmap (@mipmap/<key>) over a solid white background. The
 *      distinct name avoids a self-referential resource loop.
 *   2. Rewrites the activity-alias icon/roundIcon attributes in the manifest to
 *      point at the adaptive resources.
 *
 * The foreground art is not safe-zone padded, so the launcher mask may crop the
 * edges, but the icon will be correctly masked to the launcher's shape.
 *
 * @type {import('@expo/config-plugins').ConfigPlugin<{iconKeys: string[]}>}
 */

const ANDROID_RES_PATH = ['app', 'src', 'main', 'res']

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

const withAdaptiveIconXml = (config, {iconKeys}) => {
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
        for (const base of [key, `${key}_round`]) {
          await fs.promises.writeFile(
            path.join(anyDpiPath, `ic_adaptive_${base}.xml`),
            adaptiveXml(base),
          )
        }
      }
      console.log(
        `[adaptive-alt-icons] wrote ${iconKeys.length * 2} adaptive icon XML files`,
      )
      return config
    },
  ])
}

const withAdaptiveIconManifest = (config, {iconKeys}) => {
  return withAndroidManifest(config, config => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    )
    const aliases = app['activity-alias'] || []
    const keySet = new Set(iconKeys.map(safeKey))
    let rewritten = 0

    for (const alias of aliases) {
      const attrs = alias.$ || {}
      const icon = attrs['android:icon']
      // Only touch aliases whose icon points at one of our alternate bitmaps.
      const match = typeof icon === 'string' && icon.match(/^@mipmap\/(.+)$/)
      if (!match) continue
      const base = match[1]
      if (!keySet.has(base)) continue

      attrs['android:icon'] = `@mipmap/ic_adaptive_${base}`
      attrs['android:roundIcon'] = `@mipmap/ic_adaptive_${base}_round`
      rewritten++
    }
    console.log(
      `[adaptive-alt-icons] rewrote ${rewritten} activity-alias icon references`,
    )
    return config
  })
}

const withAndroidAdaptiveAltIcons = (config, props) => {
  config = withAdaptiveIconXml(config, props)
  config = withAdaptiveIconManifest(config, props)
  return config
}

module.exports = withAndroidAdaptiveAltIcons
