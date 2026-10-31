// @ts-check
const {withDangerousMod} = require('expo/config-plugins')
const fs = require('fs')
const path = require('path')

const SOURCE_DIRECTORY = 'modules/fork-widgets/android/res'

/**
 * Widgets that get a static picker preview image for Android 11 and lower,
 * keyed by the widget info resource expo-widgets writes (`res/xml/<name>.xml`).
 * Those versions ignore `android:previewLayout` and show the app icon instead.
 */
const PREVIEW_IMAGES = {
  trending_topics_widget_info: '@drawable/trending_topics_widget_preview_image',
  new_post_widget_info: '@drawable/new_post_widget_preview_image',
  stats_widget_info: '@drawable/stats_widget_preview_image',
}

/**
 * Fork: shared extras for expo-widgets home screen widgets.
 *
 * - Copies modules/fork-widgets/android/res into the app: a themed, translatable
 *   replacement for expo-widgets' initial "Loading widget" layout, picker
 *   preview images, and Romanian picker text.
 * - Adds `android:previewImage` to each widget in PREVIEW_IMAGES.
 *
 * It edits what expo-widgets and withTrendingWidget write, and mods run in
 * reverse order of registration, so list it before both in app.config.js.
 *
 * @param {import('@expo/config-types').ExpoConfig} config
 */
module.exports = function withForkWidgets(config) {
  return withDangerousMod(config, [
    'android',
    config => {
      const resDirectory = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/res',
      )
      fs.cpSync(
        path.join(config.modRequest.projectRoot, SOURCE_DIRECTORY),
        resDirectory,
        {recursive: true},
      )

      for (const [infoName, previewImage] of Object.entries(PREVIEW_IMAGES)) {
        const infoPath = path.join(resDirectory, 'xml', `${infoName}.xml`)
        if (!fs.existsSync(infoPath)) {
          throw new Error(
            `withForkWidgets: ${infoName}.xml not found. Is this plugin listed before expo-widgets?`,
          )
        }
        const info = fs.readFileSync(infoPath, 'utf8')
        if (!info.includes('android:previewImage')) {
          fs.writeFileSync(
            infoPath,
            info.replace(
              '<appwidget-provider ',
              `<appwidget-provider android:previewImage="${previewImage}" `,
            ),
          )
        }
      }
      return config
    },
  ])
}
