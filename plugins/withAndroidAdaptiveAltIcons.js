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
 * This runs as a dangerous mod so that, by the time it executes, all structured
 * manifest changes (the plugin's activity-aliases) are already serialized to
 * AndroidManifest.xml on disk. It then:
 *   1. Writes a distinctly-named adaptive-icon XML for each alternate
 *      (mipmap-anydpi-v26/ic_adaptive_<key>.xml) whose foreground is the
 *      existing flat bitmap (@mipmap/<key>) over a solid white background.
 *   2. Rewrites the activity-alias icon/roundIcon references in the on-disk
 *      manifest to point at those adaptive resources.
 *
 * The foreground art is not safe-zone padded, so the mask may crop the edges,
 * but the icon will be correctly masked to the launcher's shape.
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

const withAndroidAdaptiveAltIcons = (config, {iconKeys}) => {
  return withDangerousMod(config, [
    'android',
    async config => {
      const projectRoot = config.modRequest.platformProjectRoot
      const resPath = path.join(projectRoot, ...ANDROID_RES_PATH)
      const anyDpiPath = path.join(resPath, 'mipmap-anydpi-v26')
      await fs.promises.mkdir(anyDpiPath, {recursive: true})

      const keys = iconKeys.map(safeKey)

      // Write adaptive-icon XML for square + round variants of each icon. The
      // manifest activity-alias icon/roundIcon attributes are repointed at
      // these resources by a post-prebuild workflow step (the dynamic-app-icon
      // plugin's aliases are not yet present during this dangerous mod, which
      // Expo runs before structured manifest mods).
      for (const key of keys) {
        for (const base of [key, `${key}_round`]) {
          await fs.promises.writeFile(
            path.join(anyDpiPath, `ic_adaptive_${base}.xml`),
            adaptiveXml(base),
          )
        }
      }

      console.log(
        `[adaptive-alt-icons] wrote ${keys.length * 2} adaptive icon XML files`,
      )
      return config
    },
  ])
}

module.exports = withAndroidAdaptiveAltIcons
