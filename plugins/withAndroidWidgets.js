const {
  withAndroidManifest,
  withDangerousMod,
  AndroidConfig,
} = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

// Adds Android home-screen widgets to the app. Currently:
// - New post widget: a button that opens the composer via the existing
//   `bluesky://intent/compose` deep link.
//
// Everything user-facing lives in res/values/widget_strings.xml as @string
// resources (translatable by default) so the widget label, the launcher
// "preview" description, and the button text can be localized.

const NEW_POST_PROVIDER_NAME = 'NewPostWidgetProvider'

function widgetStringsXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
  <string name="widget_new_post_label">New post</string>
  <string name="widget_new_post_button">New post</string>
  <string name="widget_new_post_description">Quickly start a new post</string>
</resources>
`
}

function widgetButtonBgXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
  <solid android:color="#1083FE" />
  <corners android:radius="12dp" />
</shape>
`
}

function newPostLayoutXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
  android:id="@+id/widget_new_post_root"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:orientation="horizontal"
  android:gravity="center"
  android:background="@drawable/widget_button_bg"
  android:padding="10dp">
  <TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/widget_new_post_button"
    android:textColor="#FFFFFF"
    android:textSize="14sp"
    android:textStyle="bold" />
</LinearLayout>
`
}

function newPostInfoXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
  android:minWidth="110dp"
  android:minHeight="40dp"
  android:targetCellWidth="2"
  android:targetCellHeight="1"
  android:resizeMode="horizontal"
  android:widgetCategory="home_screen"
  android:description="@string/widget_new_post_description"
  android:previewImage="@mipmap/ic_launcher"
  android:initialLayout="@layout/widget_new_post" />
`
}

function newPostProviderKt(pkg) {
  return `package ${pkg}.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import ${pkg}.R

class ${NEW_POST_PROVIDER_NAME} : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray,
  ) {
    for (appWidgetId in appWidgetIds) {
      val views = RemoteViews(context.packageName, R.layout.widget_new_post)
      val intent =
        Intent(Intent.ACTION_VIEW, Uri.parse("bluesky://intent/compose")).apply {
          setPackage(context.packageName)
        }
      val pendingIntent =
        PendingIntent.getActivity(
          context,
          0,
          intent,
          PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
      views.setOnClickPendingIntent(R.id.widget_new_post_root, pendingIntent)
      appWidgetManager.updateAppWidget(appWidgetId, views)
    }
  }
}
`
}

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), {recursive: true})
  fs.writeFileSync(filePath, contents)
}

const withWidgetFiles = config => {
  return withDangerousMod(config, [
    'android',
    async config => {
      const pkg = config.android?.package
      if (!pkg) {
        throw new Error('withAndroidWidgets: missing android.package')
      }
      const root = config.modRequest.platformProjectRoot
      const main = path.join(root, 'app', 'src', 'main')
      const res = path.join(main, 'res')

      writeFile(
        path.join(res, 'values', 'widget_strings.xml'),
        widgetStringsXml(),
      )
      writeFile(
        path.join(res, 'drawable', 'widget_button_bg.xml'),
        widgetButtonBgXml(),
      )
      writeFile(
        path.join(res, 'layout', 'widget_new_post.xml'),
        newPostLayoutXml(),
      )
      writeFile(
        path.join(res, 'xml', 'widget_new_post_info.xml'),
        newPostInfoXml(),
      )

      const javaDir = path.join(main, 'java', ...pkg.split('.'), 'widgets')
      writeFile(
        path.join(javaDir, `${NEW_POST_PROVIDER_NAME}.kt`),
        newPostProviderKt(pkg),
      )

      return config
    },
  ])
}

const withWidgetReceiver = config => {
  return withAndroidManifest(config, config => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    )
    app.receiver = app.receiver || []

    const name = `.widgets.${NEW_POST_PROVIDER_NAME}`
    if (app.receiver.some(r => r.$?.['android:name'] === name)) {
      return config
    }

    app.receiver.push({
      $: {
        'android:name': name,
        'android:exported': 'false',
        'android:label': '@string/widget_new_post_label',
      },
      'intent-filter': [
        {
          action: [
            {$: {'android:name': 'android.appwidget.action.APPWIDGET_UPDATE'}},
          ],
        },
      ],
      'meta-data': [
        {
          $: {
            'android:name': 'android.appwidget.provider',
            'android:resource': '@xml/widget_new_post_info',
          },
        },
      ],
    })

    return config
  })
}

module.exports = function withAndroidWidgets(config) {
  config = withWidgetFiles(config)
  config = withWidgetReceiver(config)
  return config
}
