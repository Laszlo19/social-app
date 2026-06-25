const {
  withAndroidManifest,
  withDangerousMod,
  AndroidConfig,
} = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

// Adds Android home-screen widgets to the app:
// - New post widget: a button that opens the composer via the existing
//   `bluesky://intent/compose` deep link. Pure native, no data.
// - Account stats widget: shows the current account's avatar + follower /
//   following counts. The app writes `widget_stats.json` + `widget_avatar.png`
//   into filesDir (see useUpdateStatsWidget); the provider reads them on
//   update. Tapping opens the profile.
//
// All user-facing text lives in res/values/widget_strings.xml as @string
// resources (translatable by default). Colors live in widget_colors.xml with a
// values-night variant for dark mode.

const NEW_POST_PROVIDER = 'NewPostWidgetProvider'
const STATS_PROVIDER = 'StatsWidgetProvider'

function widgetStringsXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
  <string name="widget_new_post_label">New post</string>
  <string name="widget_new_post_button">New post</string>
  <string name="widget_new_post_description">Quickly start a new post</string>
  <string name="widget_stats_label">Account stats</string>
  <string name="widget_stats_description">Your follower and following counts</string>
  <string name="widget_stats_followers_label">Followers</string>
  <string name="widget_stats_following_label">Following</string>
  <string name="widget_stats_empty">Open the app to load stats</string>
</resources>
`
}

function widgetColorsXml(night) {
  const bg = night ? '#1A1F24' : '#FFFFFF'
  const text = night ? '#FFFFFF' : '#0B0F14'
  const secondary = night ? '#AEB8C2' : '#566573'
  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
  <color name="widget_bg">${bg}</color>
  <color name="widget_text">${text}</color>
  <color name="widget_text_secondary">${secondary}</color>
  <color name="widget_accent">#1083FE</color>
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

function widgetCardBgXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
  <solid android:color="@color/widget_bg" />
  <corners android:radius="16dp" />
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

function statsLayoutXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
  android:id="@+id/widget_stats_root"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:orientation="horizontal"
  android:gravity="center_vertical"
  android:background="@drawable/widget_card_bg"
  android:padding="12dp">
  <ImageView
    android:id="@+id/widget_stats_avatar"
    android:layout_width="44dp"
    android:layout_height="44dp"
    android:layout_marginEnd="12dp"
    android:src="@mipmap/ic_launcher"
    android:contentDescription="@string/widget_stats_label" />
  <LinearLayout
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    android:layout_weight="1"
    android:orientation="vertical">
    <TextView
      android:id="@+id/widget_stats_name"
      android:layout_width="match_parent"
      android:layout_height="wrap_content"
      android:maxLines="1"
      android:ellipsize="end"
      android:text="@string/widget_stats_empty"
      android:textColor="@color/widget_text"
      android:textSize="14sp"
      android:textStyle="bold" />
    <TextView
      android:id="@+id/widget_stats_handle"
      android:layout_width="match_parent"
      android:layout_height="wrap_content"
      android:maxLines="1"
      android:ellipsize="end"
      android:textColor="@color/widget_text_secondary"
      android:textSize="12sp" />
  </LinearLayout>
  <LinearLayout
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:gravity="center"
    android:layout_marginStart="8dp">
    <TextView
      android:id="@+id/widget_stats_followers"
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:text="0"
      android:textColor="@color/widget_accent"
      android:textSize="15sp"
      android:textStyle="bold" />
    <TextView
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:text="@string/widget_stats_followers_label"
      android:textColor="@color/widget_text_secondary"
      android:textSize="10sp" />
  </LinearLayout>
  <LinearLayout
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:gravity="center"
    android:layout_marginStart="12dp">
    <TextView
      android:id="@+id/widget_stats_following"
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:text="0"
      android:textColor="@color/widget_accent"
      android:textSize="15sp"
      android:textStyle="bold" />
    <TextView
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:text="@string/widget_stats_following_label"
      android:textColor="@color/widget_text_secondary"
      android:textSize="10sp" />
  </LinearLayout>
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
  android:previewLayout="@layout/widget_new_post"
  android:initialLayout="@layout/widget_new_post" />
`
}

function statsInfoXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
  android:minWidth="250dp"
  android:minHeight="40dp"
  android:targetCellWidth="4"
  android:targetCellHeight="1"
  android:updatePeriodMillis="1800000"
  android:resizeMode="horizontal"
  android:widgetCategory="home_screen"
  android:description="@string/widget_stats_description"
  android:previewImage="@mipmap/ic_launcher"
  android:previewLayout="@layout/widget_stats"
  android:initialLayout="@layout/widget_stats" />
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

class ${NEW_POST_PROVIDER} : AppWidgetProvider() {
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

function statsProviderKt(pkg) {
  return `package ${pkg}.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.net.Uri
import android.widget.RemoteViews
import java.io.File
import kotlin.math.max
import kotlin.math.min
import org.json.JSONObject
import ${pkg}.R

class ${STATS_PROVIDER} : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray,
  ) {
    for (appWidgetId in appWidgetIds) {
      val views = RemoteViews(context.packageName, R.layout.widget_stats)
      var handle = ""
      try {
        val statsFile = File(context.filesDir, "widget_stats.json")
        if (statsFile.exists()) {
          val json = JSONObject(statsFile.readText())
          handle = json.optString("handle", "")
          val displayName = json.optString("displayName", "")
          views.setTextViewText(
            R.id.widget_stats_name,
            if (displayName.isNotEmpty()) displayName else handle,
          )
          views.setTextViewText(
            R.id.widget_stats_handle,
            if (handle.isNotEmpty()) "@" + handle else "",
          )
          views.setTextViewText(
            R.id.widget_stats_followers,
            json.optInt("followers", 0).toString(),
          )
          views.setTextViewText(
            R.id.widget_stats_following,
            json.optInt("following", 0).toString(),
          )
        }
        val avatarFile = File(context.filesDir, "widget_avatar.png")
        if (avatarFile.exists()) {
          // Downscale to ~144px so the bitmap stays well under the RemoteViews
          // transaction size limit (a full-size avatar would be megabytes).
          val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
          BitmapFactory.decodeFile(avatarFile.absolutePath, bounds)
          val smallest = min(bounds.outWidth, bounds.outHeight)
          val sample = if (smallest > 0) max(1, smallest / 144) else 1
          val opts = BitmapFactory.Options().apply { inSampleSize = sample }
          val bitmap = BitmapFactory.decodeFile(avatarFile.absolutePath, opts)
          if (bitmap != null) {
            views.setImageViewBitmap(R.id.widget_stats_avatar, bitmap)
          }
        }
      } catch (e: Exception) {
        // best-effort; leave defaults from the layout
      }

      val link =
        if (handle.isNotEmpty()) "https://bsky.app/profile/" + handle
        else "bluesky://"
      val intent =
        Intent(Intent.ACTION_VIEW, Uri.parse(link)).apply {
          setPackage(context.packageName)
        }
      val pendingIntent =
        PendingIntent.getActivity(
          context,
          appWidgetId,
          intent,
          PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
      views.setOnClickPendingIntent(R.id.widget_stats_root, pendingIntent)
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
        path.join(res, 'values', 'widget_colors.xml'),
        widgetColorsXml(false),
      )
      writeFile(
        path.join(res, 'values-night', 'widget_colors.xml'),
        widgetColorsXml(true),
      )
      writeFile(
        path.join(res, 'drawable', 'widget_button_bg.xml'),
        widgetButtonBgXml(),
      )
      writeFile(
        path.join(res, 'drawable', 'widget_card_bg.xml'),
        widgetCardBgXml(),
      )
      writeFile(
        path.join(res, 'layout', 'widget_new_post.xml'),
        newPostLayoutXml(),
      )
      writeFile(path.join(res, 'layout', 'widget_stats.xml'), statsLayoutXml())
      writeFile(
        path.join(res, 'xml', 'widget_new_post_info.xml'),
        newPostInfoXml(),
      )
      writeFile(path.join(res, 'xml', 'widget_stats_info.xml'), statsInfoXml())

      const javaDir = path.join(main, 'java', ...pkg.split('.'), 'widgets')
      writeFile(
        path.join(javaDir, `${NEW_POST_PROVIDER}.kt`),
        newPostProviderKt(pkg),
      )
      writeFile(path.join(javaDir, `${STATS_PROVIDER}.kt`), statsProviderKt(pkg))

      return config
    },
  ])
}

function receiverNode(name, label, infoResource) {
  return {
    $: {
      'android:name': name,
      'android:exported': 'false',
      'android:label': label,
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
          'android:resource': infoResource,
        },
      },
    ],
  }
}

const withWidgetReceivers = config => {
  return withAndroidManifest(config, config => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    )
    app.receiver = app.receiver || []

    const receivers = [
      receiverNode(
        `.widgets.${NEW_POST_PROVIDER}`,
        '@string/widget_new_post_label',
        '@xml/widget_new_post_info',
      ),
      receiverNode(
        `.widgets.${STATS_PROVIDER}`,
        '@string/widget_stats_label',
        '@xml/widget_stats_info',
      ),
    ]

    for (const receiver of receivers) {
      const name = receiver.$['android:name']
      if (!app.receiver.some(r => r.$?.['android:name'] === name)) {
        app.receiver.push(receiver)
      }
    }

    return config
  })
}

module.exports = function withAndroidWidgets(config) {
  config = withWidgetFiles(config)
  config = withWidgetReceivers(config)
  return config
}
