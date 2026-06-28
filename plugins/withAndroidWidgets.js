const {
  withAndroidManifest,
  withDangerousMod,
  AndroidConfig,
} = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

// Adds Android home-screen widgets to the app.
//
// Existing widgets (untouched):
//   NewPostWidgetProvider  – single "New post" button
//   StatsWidgetProvider    – avatar + followers/following counts
//
// New widgets (Phase A-E):
//   StatsCardWidgetProvider    – card layout with followers/following + "Last 30 days"
//   ComposerWidgetProvider     – "What's up?" placeholder + Camera/Photo/GIF/Post buttons
//   InteractionsWidgetProvider – recent interaction handle/excerpt + reply/repost counts
//   PinnedFeedsWidgetProvider  – scrollable list of pinned feeds (RemoteViewsService)
//   ListsWidgetProvider        – scrollable list of user's lists  (RemoteViewsService)
//
// The app writes JSON files to filesDir via useUpdateWidgets.ts; each provider
// reads the relevant file on update. Colors follow the system dark-mode flag via
// values-night/widget_colors.xml.

const NEW_POST_PROVIDER = 'NewPostWidgetProvider'
const STATS_PROVIDER = 'StatsWidgetProvider'
const STATS_CARD_PROVIDER = 'StatsCardWidgetProvider'
const COMPOSER_PROVIDER = 'ComposerWidgetProvider'
const INTERACTIONS_PROVIDER = 'InteractionsWidgetProvider'
const PINNED_FEEDS_PROVIDER = 'PinnedFeedsWidgetProvider'
const PINNED_FEEDS_SERVICE = 'PinnedFeedsRemoteViewsService'
const LISTS_PROVIDER = 'ListsWidgetProvider'
const LISTS_SERVICE = 'ListsRemoteViewsService'

// ---------------------------------------------------------------------------
// Resource XML
// ---------------------------------------------------------------------------

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
  <string name="widget_stats_card_label">Account stats card</string>
  <string name="widget_stats_card_description">Follower and following counts in a card layout</string>
  <string name="widget_stats_card_title">ACCOUNT STATISTICS</string>
  <string name="widget_stats_card_period">Last 30 days</string>
  <string name="widget_composer_label">Quick composer</string>
  <string name="widget_composer_description">Tap to start composing a post</string>
  <string name="widget_composer_placeholder">What\'s up?</string>
  <string name="widget_composer_camera">Camera</string>
  <string name="widget_composer_photo">Photo</string>
  <string name="widget_composer_gif">GIF</string>
  <string name="widget_composer_post">Post</string>
  <string name="widget_interactions_label">Interactions</string>
  <string name="widget_interactions_description">Recent replies and reposts to your posts</string>
  <string name="widget_interactions_title">Interactions</string>
  <string name="widget_interactions_replies_label">Replies</string>
  <string name="widget_interactions_reposts_label">Reposts</string>
  <string name="widget_interactions_period">Last 7 days</string>
  <string name="widget_interactions_empty">Open the app to load interactions</string>
  <string name="widget_pinned_feeds_label">Pinned feeds</string>
  <string name="widget_pinned_feeds_description">Your pinned custom feeds</string>
  <string name="widget_pinned_feeds_title">Pinned Feeds</string>
  <string name="widget_pinned_feeds_empty">No pinned feeds yet</string>
  <string name="widget_lists_label">Your lists</string>
  <string name="widget_lists_description">Your moderation and curation lists</string>
  <string name="widget_lists_title">Lists</string>
  <string name="widget_lists_empty">No lists found</string>
</resources>
`
}

function widgetColorsXml(night) {
  const bg = night ? '#1A1F24' : '#FFFFFF'
  const text = night ? '#FFFFFF' : '#0B0F14'
  const secondary = night ? '#AEB8C2' : '#566573'
  const btnSecondary = night ? '#2A3040' : '#EEF0F2'
  const divider = night ? '#2A3040' : '#E0E3E6'
  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
  <color name="widget_bg">${bg}</color>
  <color name="widget_text">${text}</color>
  <color name="widget_text_secondary">${secondary}</color>
  <color name="widget_accent">#1083FE</color>
  <color name="widget_btn_secondary">${btnSecondary}</color>
  <color name="widget_divider">${divider}</color>
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

function widgetButtonSecondaryBgXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
  <solid android:color="@color/widget_btn_secondary" />
  <corners android:radius="10dp" />
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

// ---------------------------------------------------------------------------
// Existing widget layouts
// ---------------------------------------------------------------------------

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
    android:id="@+id/widget_new_post_text"
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
      android:id="@+id/widget_stats_followers_label"
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
      android:id="@+id/widget_stats_following_label"
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:text="@string/widget_stats_following_label"
      android:textColor="@color/widget_text_secondary"
      android:textSize="10sp" />
  </LinearLayout>
</LinearLayout>
`
}

// ---------------------------------------------------------------------------
// New widget layouts
// ---------------------------------------------------------------------------

function statsCardLayoutXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
  android:id="@+id/widget_stats_card_root"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:orientation="vertical"
  android:background="@drawable/widget_card_bg"
  android:padding="14dp">
  <TextView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="@string/widget_stats_card_title"
    android:textColor="@color/widget_text_secondary"
    android:textSize="10sp"
    android:letterSpacing="0.08"
    android:layout_marginBottom="10dp" />
  <LinearLayout
    android:layout_width="match_parent"
    android:layout_height="0dp"
    android:layout_weight="1"
    android:orientation="horizontal"
    android:gravity="center_vertical">
    <LinearLayout
      android:layout_width="0dp"
      android:layout_height="wrap_content"
      android:layout_weight="1"
      android:orientation="vertical">
      <TextView
        android:id="@+id/widget_card_followers"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="—"
        android:textColor="@color/widget_text"
        android:textSize="26sp"
        android:textStyle="bold" />
      <TextView
        android:id="@+id/widget_card_followers_label"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/widget_stats_followers_label"
        android:textColor="@color/widget_text_secondary"
        android:textSize="11sp" />
    </LinearLayout>
    <LinearLayout
      android:layout_width="0dp"
      android:layout_height="wrap_content"
      android:layout_weight="1"
      android:orientation="vertical">
      <TextView
        android:id="@+id/widget_card_following"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="—"
        android:textColor="@color/widget_text"
        android:textSize="26sp"
        android:textStyle="bold" />
      <TextView
        android:id="@+id/widget_card_following_label"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/widget_stats_following_label"
        android:textColor="@color/widget_text_secondary"
        android:textSize="11sp" />
    </LinearLayout>
  </LinearLayout>
  <TextView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="@string/widget_stats_card_period"
    android:textColor="@color/widget_text_secondary"
    android:textSize="10sp"
    android:layout_marginTop="8dp" />
</LinearLayout>
`
}

function composerLayoutXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:orientation="vertical"
  android:background="@drawable/widget_card_bg"
  android:padding="14dp">
  <TextView
    android:id="@+id/widget_composer_placeholder"
    android:layout_width="match_parent"
    android:layout_height="0dp"
    android:layout_weight="1"
    android:text="@string/widget_composer_placeholder"
    android:textColor="@color/widget_text_secondary"
    android:textSize="16sp"
    android:gravity="top" />
  <LinearLayout
    android:layout_width="match_parent"
    android:layout_height="1dp"
    android:background="@color/widget_divider"
    android:layout_marginBottom="10dp" />
  <LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal"
    android:gravity="center_vertical">
    <TextView
      android:id="@+id/widget_composer_camera"
      android:layout_width="0dp"
      android:layout_height="36dp"
      android:layout_weight="1"
      android:layout_marginEnd="6dp"
      android:text="@string/widget_composer_camera"
      android:textColor="@color/widget_text"
      android:textSize="12sp"
      android:gravity="center"
      android:background="@drawable/widget_button_secondary_bg" />
    <TextView
      android:id="@+id/widget_composer_photo"
      android:layout_width="0dp"
      android:layout_height="36dp"
      android:layout_weight="1"
      android:layout_marginEnd="6dp"
      android:text="@string/widget_composer_photo"
      android:textColor="@color/widget_text"
      android:textSize="12sp"
      android:gravity="center"
      android:background="@drawable/widget_button_secondary_bg" />
    <TextView
      android:id="@+id/widget_composer_gif"
      android:layout_width="0dp"
      android:layout_height="36dp"
      android:layout_weight="1"
      android:layout_marginEnd="6dp"
      android:text="@string/widget_composer_gif"
      android:textColor="@color/widget_text"
      android:textSize="12sp"
      android:gravity="center"
      android:background="@drawable/widget_button_secondary_bg" />
    <TextView
      android:id="@+id/widget_composer_post"
      android:layout_width="0dp"
      android:layout_height="36dp"
      android:layout_weight="1"
      android:text="@string/widget_composer_post"
      android:textColor="#FFFFFF"
      android:textSize="12sp"
      android:textStyle="bold"
      android:gravity="center"
      android:background="@drawable/widget_button_bg" />
  </LinearLayout>
</LinearLayout>
`
}

function interactionsLayoutXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
  android:id="@+id/widget_interactions_root"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:orientation="vertical"
  android:background="@drawable/widget_card_bg"
  android:padding="14dp">
  <TextView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="@string/widget_interactions_title"
    android:textColor="@color/widget_text_secondary"
    android:textSize="10sp"
    android:letterSpacing="0.08"
    android:layout_marginBottom="6dp" />
  <TextView
    android:id="@+id/widget_interactions_handle"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="@string/widget_interactions_empty"
    android:textColor="@color/widget_text"
    android:textSize="13sp"
    android:textStyle="bold"
    android:maxLines="1"
    android:ellipsize="end" />
  <TextView
    android:id="@+id/widget_interactions_excerpt"
    android:layout_width="match_parent"
    android:layout_height="0dp"
    android:layout_weight="1"
    android:textColor="@color/widget_text_secondary"
    android:textSize="12sp"
    android:maxLines="2"
    android:ellipsize="end"
    android:layout_marginBottom="8dp" />
  <LinearLayout
    android:layout_width="match_parent"
    android:layout_height="1dp"
    android:background="@color/widget_divider"
    android:layout_marginBottom="8dp" />
  <LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal">
    <LinearLayout
      android:layout_width="0dp"
      android:layout_height="wrap_content"
      android:layout_weight="1"
      android:orientation="vertical">
      <TextView
        android:id="@+id/widget_interactions_replies"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="0"
        android:textColor="@color/widget_text"
        android:textSize="20sp"
        android:textStyle="bold" />
      <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/widget_interactions_replies_label"
        android:textColor="@color/widget_text_secondary"
        android:textSize="10sp" />
    </LinearLayout>
    <LinearLayout
      android:layout_width="0dp"
      android:layout_height="wrap_content"
      android:layout_weight="1"
      android:orientation="vertical">
      <TextView
        android:id="@+id/widget_interactions_reposts"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="0"
        android:textColor="@color/widget_text"
        android:textSize="20sp"
        android:textStyle="bold" />
      <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/widget_interactions_reposts_label"
        android:textColor="@color/widget_text_secondary"
        android:textSize="10sp" />
    </LinearLayout>
  </LinearLayout>
  <TextView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="@string/widget_interactions_period"
    android:textColor="@color/widget_text_secondary"
    android:textSize="10sp"
    android:layout_marginTop="6dp" />
</LinearLayout>
`
}

function feedsListLayoutXml(idPrefix, titleStringName, emptyStringName) {
  return `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
  android:id="@+id/${idPrefix}_root"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:orientation="vertical"
  android:background="@drawable/widget_card_bg"
  android:padding="14dp">
  <TextView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="@string/${titleStringName}"
    android:textColor="@color/widget_text_secondary"
    android:textSize="10sp"
    android:letterSpacing="0.08"
    android:layout_marginBottom="6dp" />
  <ListView
    android:id="@+id/${idPrefix}_list"
    android:layout_width="match_parent"
    android:layout_height="0dp"
    android:layout_weight="1"
    android:divider="@color/widget_divider"
    android:dividerHeight="1dp"
    android:scrollbars="none" />
  <TextView
    android:id="@+id/${idPrefix}_empty"
    android:layout_width="match_parent"
    android:layout_height="0dp"
    android:layout_weight="1"
    android:text="@string/${emptyStringName}"
    android:textColor="@color/widget_text_secondary"
    android:textSize="12sp"
    android:gravity="center"
    android:visibility="gone" />
</LinearLayout>
`
}

function feedsListRowXml(idPrefix) {
  return `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
  android:id="@+id/${idPrefix}_row_root"
  android:layout_width="match_parent"
  android:layout_height="wrap_content"
  android:orientation="horizontal"
  android:gravity="center_vertical"
  android:paddingTop="10dp"
  android:paddingBottom="10dp"
  android:paddingStart="2dp"
  android:paddingEnd="2dp">
  <TextView
    android:id="@+id/${idPrefix}_row_name"
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    android:layout_weight="1"
    android:textColor="@color/widget_text"
    android:textSize="13sp"
    android:maxLines="1"
    android:ellipsize="end" />
  <TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="›"
    android:textColor="@color/widget_text_secondary"
    android:textSize="16sp"
    android:layout_marginStart="4dp" />
</LinearLayout>
`
}

// ---------------------------------------------------------------------------
// Widget metadata (appwidget-provider)
// ---------------------------------------------------------------------------

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

function statsCardInfoXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
  android:minWidth="180dp"
  android:minHeight="110dp"
  android:targetCellWidth="3"
  android:targetCellHeight="2"
  android:updatePeriodMillis="1800000"
  android:resizeMode="both"
  android:widgetCategory="home_screen"
  android:description="@string/widget_stats_card_description"
  android:previewImage="@mipmap/ic_launcher"
  android:previewLayout="@layout/widget_stats_card"
  android:initialLayout="@layout/widget_stats_card" />
`
}

function composerInfoXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
  android:minWidth="250dp"
  android:minHeight="110dp"
  android:targetCellWidth="4"
  android:targetCellHeight="2"
  android:resizeMode="both"
  android:widgetCategory="home_screen"
  android:description="@string/widget_composer_description"
  android:previewImage="@mipmap/ic_launcher"
  android:previewLayout="@layout/widget_composer"
  android:initialLayout="@layout/widget_composer" />
`
}

function interactionsInfoXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
  android:minWidth="180dp"
  android:minHeight="110dp"
  android:targetCellWidth="3"
  android:targetCellHeight="2"
  android:updatePeriodMillis="1800000"
  android:resizeMode="both"
  android:widgetCategory="home_screen"
  android:description="@string/widget_interactions_description"
  android:previewImage="@mipmap/ic_launcher"
  android:previewLayout="@layout/widget_interactions"
  android:initialLayout="@layout/widget_interactions" />
`
}

function pinnedFeedsInfoXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
  android:minWidth="180dp"
  android:minHeight="200dp"
  android:targetCellWidth="3"
  android:targetCellHeight="4"
  android:updatePeriodMillis="1800000"
  android:resizeMode="both"
  android:widgetCategory="home_screen"
  android:description="@string/widget_pinned_feeds_description"
  android:previewImage="@mipmap/ic_launcher"
  android:previewLayout="@layout/widget_pinned_feeds"
  android:initialLayout="@layout/widget_pinned_feeds" />
`
}

function listsInfoXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
  android:minWidth="180dp"
  android:minHeight="200dp"
  android:targetCellWidth="3"
  android:targetCellHeight="4"
  android:updatePeriodMillis="1800000"
  android:resizeMode="both"
  android:widgetCategory="home_screen"
  android:description="@string/widget_lists_description"
  android:previewImage="@mipmap/ic_launcher"
  android:previewLayout="@layout/widget_lists"
  android:initialLayout="@layout/widget_lists" />
`
}

// ---------------------------------------------------------------------------
// Existing Kotlin providers
// ---------------------------------------------------------------------------

function newPostProviderKt(pkg) {
  return `package ${pkg}.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import java.io.File
import org.json.JSONObject
import ${pkg}.R

class ${NEW_POST_PROVIDER} : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray,
  ) {
    for (appWidgetId in appWidgetIds) {
      val views = RemoteViews(context.packageName, R.layout.widget_new_post)

      try {
        val dataFile = File(context.filesDir, "widget_data.json")
        if (dataFile.exists()) {
          val label = JSONObject(dataFile.readText()).optString("newPostLabel", "")
          if (label.isNotEmpty()) {
            views.setTextViewText(R.id.widget_new_post_text, label)
          }
        }
      } catch (e: Exception) {
        // keep the default label
      }

      val intent =
        Intent(Intent.ACTION_VIEW, Uri.parse("bluesky://intent/compose")).apply {
          setPackage(context.packageName)
          flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
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
        val statsFile = File(context.filesDir, "widget_data.json")
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
          val followersLabel = json.optString("followersLabel", "")
          if (followersLabel.isNotEmpty()) {
            views.setTextViewText(R.id.widget_stats_followers_label, followersLabel)
          }
          val followingLabel = json.optString("followingLabel", "")
          if (followingLabel.isNotEmpty()) {
            views.setTextViewText(R.id.widget_stats_following_label, followingLabel)
          }
        }
        val avatarFile = File(context.filesDir, "widget_avatar.png")
        if (avatarFile.exists()) {
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
          flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
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

// ---------------------------------------------------------------------------
// New Kotlin providers
// ---------------------------------------------------------------------------

function statsCardProviderKt(pkg) {
  return `package ${pkg}.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import java.io.File
import org.json.JSONObject
import ${pkg}.R

class ${STATS_CARD_PROVIDER} : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray,
  ) {
    for (appWidgetId in appWidgetIds) {
      val views = RemoteViews(context.packageName, R.layout.widget_stats_card)
      var handle = ""
      try {
        val dataFile = File(context.filesDir, "widget_data.json")
        if (dataFile.exists()) {
          val json = JSONObject(dataFile.readText())
          handle = json.optString("handle", "")
          views.setTextViewText(
            R.id.widget_card_followers,
            json.optInt("followers", 0).toString(),
          )
          views.setTextViewText(
            R.id.widget_card_following,
            json.optInt("following", 0).toString(),
          )
          val followersLabel = json.optString("followersLabel", "")
          if (followersLabel.isNotEmpty()) {
            views.setTextViewText(R.id.widget_card_followers_label, followersLabel)
          }
          val followingLabel = json.optString("followingLabel", "")
          if (followingLabel.isNotEmpty()) {
            views.setTextViewText(R.id.widget_card_following_label, followingLabel)
          }
        }
      } catch (e: Exception) {
        // best-effort
      }

      val link =
        if (handle.isNotEmpty()) "https://bsky.app/profile/" + handle
        else "bluesky://"
      val intent =
        Intent(Intent.ACTION_VIEW, Uri.parse(link)).apply {
          setPackage(context.packageName)
          flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
      val pendingIntent =
        PendingIntent.getActivity(
          context,
          appWidgetId,
          intent,
          PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
      views.setOnClickPendingIntent(R.id.widget_stats_card_root, pendingIntent)
      appWidgetManager.updateAppWidget(appWidgetId, views)
    }
  }
}
`
}

function composerProviderKt(pkg) {
  // Each button opens compose; source param added for future deep-link routing.
  return `package ${pkg}.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import ${pkg}.R

class ${COMPOSER_PROVIDER} : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray,
  ) {
    for (appWidgetId in appWidgetIds) {
      val views = RemoteViews(context.packageName, R.layout.widget_composer)

      fun composePendingIntent(requestCode: Int, source: String): PendingIntent {
        val uri = Uri.parse("bluesky://intent/compose?source=" + source)
        val intent = Intent(Intent.ACTION_VIEW, uri).apply {
          setPackage(context.packageName)
          flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        return PendingIntent.getActivity(
          context,
          requestCode,
          intent,
          PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
      }

      views.setOnClickPendingIntent(R.id.widget_composer_placeholder, composePendingIntent(0, "compose"))
      views.setOnClickPendingIntent(R.id.widget_composer_camera, composePendingIntent(1, "camera"))
      views.setOnClickPendingIntent(R.id.widget_composer_photo, composePendingIntent(2, "gallery"))
      views.setOnClickPendingIntent(R.id.widget_composer_gif, composePendingIntent(3, "gif"))
      views.setOnClickPendingIntent(R.id.widget_composer_post, composePendingIntent(4, "compose"))

      appWidgetManager.updateAppWidget(appWidgetId, views)
    }
  }
}
`
}

function interactionsProviderKt(pkg) {
  return `package ${pkg}.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import java.io.File
import org.json.JSONObject
import ${pkg}.R

class ${INTERACTIONS_PROVIDER} : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray,
  ) {
    for (appWidgetId in appWidgetIds) {
      val views = RemoteViews(context.packageName, R.layout.widget_interactions)
      try {
        val dataFile = File(context.filesDir, "widget_interactions.json")
        if (dataFile.exists()) {
          val json = JSONObject(dataFile.readText())
          val handle = json.optString("recentHandle", "")
          val excerpt = json.optString("recentExcerpt", "")
          if (handle.isNotEmpty()) {
            views.setTextViewText(R.id.widget_interactions_handle, "@" + handle)
          }
          if (excerpt.isNotEmpty()) {
            views.setTextViewText(R.id.widget_interactions_excerpt, excerpt)
          }
          views.setTextViewText(
            R.id.widget_interactions_replies,
            json.optInt("replies", 0).toString(),
          )
          views.setTextViewText(
            R.id.widget_interactions_reposts,
            json.optInt("reposts", 0).toString(),
          )
        }
      } catch (e: Exception) {
        // best-effort
      }

      val intent =
        Intent(Intent.ACTION_VIEW, Uri.parse("bluesky://notifications")).apply {
          setPackage(context.packageName)
          flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
      val pendingIntent =
        PendingIntent.getActivity(
          context,
          appWidgetId,
          intent,
          PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
      views.setOnClickPendingIntent(R.id.widget_interactions_root, pendingIntent)
      appWidgetManager.updateAppWidget(appWidgetId, views)
    }
  }
}
`
}

// Extracts did + rkey from an AT URI and builds a bsky.app deep link.
// at://did:plc:abc/app.bsky.feed.generator/rkey -> bluesky://profile/did:plc:abc/feed/rkey
// at://did:plc:abc/app.bsky.graph.list/rkey     -> bluesky://profile/did:plc:abc/lists/rkey
// Returns fallback if the URI cannot be parsed.
function atUriParserKt() {
  return `
  private fun atUriToDeepLink(atUri: String, feedFallback: String): String {
    return try {
      val without = atUri.removePrefix("at://")
      val parts = without.split("/")
      if (parts.size < 3) return feedFallback
      val did = parts[0]
      val collection = parts[1]
      val rkey = parts[2]
      when {
        collection == "app.bsky.feed.generator" ->
          "bluesky://profile/" + did + "/feed/" + rkey
        collection == "app.bsky.graph.list" ->
          "bluesky://profile/" + did + "/lists/" + rkey
        else -> feedFallback
      }
    } catch (e: Exception) {
      feedFallback
    }
  }
`
}

function pinnedFeedsProviderKt(pkg) {
  return `package ${pkg}.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import ${pkg}.R

class ${PINNED_FEEDS_PROVIDER} : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray,
  ) {
    for (appWidgetId in appWidgetIds) {
      val views = RemoteViews(context.packageName, R.layout.widget_pinned_feeds)

      val serviceIntent = Intent(context, ${PINNED_FEEDS_SERVICE}::class.java).apply {
        putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
        data = Uri.parse(toUri(Intent.URI_INTENT_SCHEME))
      }
      views.setRemoteAdapter(R.id.widget_pinned_feeds_list, serviceIntent)
      views.setEmptyView(R.id.widget_pinned_feeds_list, R.id.widget_pinned_feeds_empty)

      val templateIntent = Intent(Intent.ACTION_VIEW).apply {
        setPackage(context.packageName)
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
      }
      val pendingTemplate = PendingIntent.getActivity(
        context,
        appWidgetId,
        templateIntent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE,
      )
      views.setPendingIntentTemplate(R.id.widget_pinned_feeds_list, pendingTemplate)

      appWidgetManager.updateAppWidget(appWidgetId, views)
      appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetId, R.id.widget_pinned_feeds_list)
    }
  }
}
`
}

function pinnedFeedsServiceKt(pkg) {
  return `package ${pkg}.widgets

import android.content.Intent
import android.widget.RemoteViewsService

class ${PINNED_FEEDS_SERVICE} : RemoteViewsService() {
  override fun onGetViewFactory(intent: Intent): RemoteViewsFactory {
    return PinnedFeedsRemoteViewsFactory(applicationContext)
  }
}
`
}

function pinnedFeedsFactoryKt(pkg) {
  return `package ${pkg}.widgets

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import java.io.File
import org.json.JSONArray
import ${pkg}.R

class PinnedFeedsRemoteViewsFactory(private val context: Context) :
  RemoteViewsService.RemoteViewsFactory {

  private data class FeedItem(val name: String, val uri: String)

  private var feeds: List<FeedItem> = emptyList()

  ${atUriParserKt()}

  private fun loadData() {
    feeds = try {
      val file = File(context.filesDir, "widget_pinned_feeds.json")
      if (!file.exists()) return
      val arr = JSONArray(file.readText())
      (0 until arr.length()).map { i ->
        val obj = arr.getJSONObject(i)
        FeedItem(
          name = obj.optString("name", ""),
          uri = obj.optString("uri", ""),
        )
      }.filter { it.name.isNotEmpty() }
    } catch (e: Exception) {
      emptyList()
    }
  }

  override fun onCreate() { loadData() }
  override fun onDataSetChanged() { loadData() }
  override fun onDestroy() {}
  override fun getCount() = feeds.size
  override fun getLoadingView() = null
  override fun getViewTypeCount() = 1
  override fun getItemId(position: Int) = position.toLong()
  override fun hasStableIds() = true

  override fun getViewAt(position: Int): RemoteViews {
    val views = RemoteViews(context.packageName, R.layout.widget_pinned_feeds_row)
    if (position >= feeds.size) return views
    val feed = feeds[position]
    views.setTextViewText(R.id.widget_pinned_feeds_row_name, feed.name)
    val deepLink = atUriToDeepLink(feed.uri, "bluesky://feeds")
    val fillIn = Intent().apply { data = Uri.parse(deepLink) }
    views.setOnClickFillInIntent(R.id.widget_pinned_feeds_row_root, fillIn)
    return views
  }
}
`
}

function listsProviderKt(pkg) {
  return `package ${pkg}.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import ${pkg}.R

class ${LISTS_PROVIDER} : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray,
  ) {
    for (appWidgetId in appWidgetIds) {
      val views = RemoteViews(context.packageName, R.layout.widget_lists)

      val serviceIntent = Intent(context, ${LISTS_SERVICE}::class.java).apply {
        putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
        data = Uri.parse(toUri(Intent.URI_INTENT_SCHEME))
      }
      views.setRemoteAdapter(R.id.widget_lists_list, serviceIntent)
      views.setEmptyView(R.id.widget_lists_list, R.id.widget_lists_empty)

      val templateIntent = Intent(Intent.ACTION_VIEW).apply {
        setPackage(context.packageName)
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
      }
      val pendingTemplate = PendingIntent.getActivity(
        context,
        appWidgetId + 1000,
        templateIntent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE,
      )
      views.setPendingIntentTemplate(R.id.widget_lists_list, pendingTemplate)

      appWidgetManager.updateAppWidget(appWidgetId, views)
      appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetId, R.id.widget_lists_list)
    }
  }
}
`
}

function listsServiceKt(pkg) {
  return `package ${pkg}.widgets

import android.content.Intent
import android.widget.RemoteViewsService

class ${LISTS_SERVICE} : RemoteViewsService() {
  override fun onGetViewFactory(intent: Intent): RemoteViewsFactory {
    return ListsRemoteViewsFactory(applicationContext)
  }
}
`
}

function listsFactoryKt(pkg) {
  return `package ${pkg}.widgets

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import java.io.File
import org.json.JSONArray
import ${pkg}.R

class ListsRemoteViewsFactory(private val context: Context) :
  RemoteViewsService.RemoteViewsFactory {

  private data class ListItem(val name: String, val uri: String)

  private var lists: List<ListItem> = emptyList()

  private fun atUriToDeepLink(atUri: String): String {
    return try {
      val without = atUri.removePrefix("at://")
      val parts = without.split("/")
      if (parts.size < 3) return "bluesky://lists"
      "bluesky://profile/" + parts[0] + "/lists/" + parts[2]
    } catch (e: Exception) {
      "bluesky://lists"
    }
  }

  private fun loadData() {
    lists = try {
      val file = File(context.filesDir, "widget_lists.json")
      if (!file.exists()) return
      val arr = JSONArray(file.readText())
      (0 until arr.length()).map { i ->
        val obj = arr.getJSONObject(i)
        ListItem(
          name = obj.optString("name", ""),
          uri = obj.optString("uri", ""),
        )
      }.filter { it.name.isNotEmpty() }
    } catch (e: Exception) {
      emptyList()
    }
  }

  override fun onCreate() { loadData() }
  override fun onDataSetChanged() { loadData() }
  override fun onDestroy() {}
  override fun getCount() = lists.size
  override fun getLoadingView() = null
  override fun getViewTypeCount() = 1
  override fun getItemId(position: Int) = position.toLong()
  override fun hasStableIds() = true

  override fun getViewAt(position: Int): RemoteViews {
    val views = RemoteViews(context.packageName, R.layout.widget_lists_row)
    if (position >= lists.size) return views
    val list = lists[position]
    views.setTextViewText(R.id.widget_lists_row_name, list.name)
    val deepLink = atUriToDeepLink(list.uri)
    val fillIn = Intent().apply { data = Uri.parse(deepLink) }
    views.setOnClickFillInIntent(R.id.widget_lists_row_root, fillIn)
    return views
  }
}
`
}

// ---------------------------------------------------------------------------
// File-system helpers
// ---------------------------------------------------------------------------

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), {recursive: true})
  fs.writeFileSync(filePath, contents)
}

// ---------------------------------------------------------------------------
// Config plugin: write all resource and Kotlin files
// ---------------------------------------------------------------------------

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

      // Colors and shared drawables
      writeFile(path.join(res, 'values', 'widget_strings.xml'), widgetStringsXml())
      writeFile(path.join(res, 'values', 'widget_colors.xml'), widgetColorsXml(false))
      writeFile(path.join(res, 'values-night', 'widget_colors.xml'), widgetColorsXml(true))
      writeFile(path.join(res, 'drawable', 'widget_button_bg.xml'), widgetButtonBgXml())
      writeFile(path.join(res, 'drawable', 'widget_button_secondary_bg.xml'), widgetButtonSecondaryBgXml())
      writeFile(path.join(res, 'drawable', 'widget_card_bg.xml'), widgetCardBgXml())

      // Existing widget layouts + metadata
      writeFile(path.join(res, 'layout', 'widget_new_post.xml'), newPostLayoutXml())
      writeFile(path.join(res, 'layout', 'widget_stats.xml'), statsLayoutXml())
      writeFile(path.join(res, 'xml', 'widget_new_post_info.xml'), newPostInfoXml())
      writeFile(path.join(res, 'xml', 'widget_stats_info.xml'), statsInfoXml())

      // New widget layouts + metadata
      writeFile(path.join(res, 'layout', 'widget_stats_card.xml'), statsCardLayoutXml())
      writeFile(path.join(res, 'xml', 'widget_stats_card_info.xml'), statsCardInfoXml())

      writeFile(path.join(res, 'layout', 'widget_composer.xml'), composerLayoutXml())
      writeFile(path.join(res, 'xml', 'widget_composer_info.xml'), composerInfoXml())

      writeFile(path.join(res, 'layout', 'widget_interactions.xml'), interactionsLayoutXml())
      writeFile(path.join(res, 'xml', 'widget_interactions_info.xml'), interactionsInfoXml())

      writeFile(
        path.join(res, 'layout', 'widget_pinned_feeds.xml'),
        feedsListLayoutXml('widget_pinned_feeds', 'widget_pinned_feeds_title', 'widget_pinned_feeds_empty'),
      )
      writeFile(
        path.join(res, 'layout', 'widget_pinned_feeds_row.xml'),
        feedsListRowXml('widget_pinned_feeds'),
      )
      writeFile(path.join(res, 'xml', 'widget_pinned_feeds_info.xml'), pinnedFeedsInfoXml())

      writeFile(
        path.join(res, 'layout', 'widget_lists.xml'),
        feedsListLayoutXml('widget_lists', 'widget_lists_title', 'widget_lists_empty'),
      )
      writeFile(
        path.join(res, 'layout', 'widget_lists_row.xml'),
        feedsListRowXml('widget_lists'),
      )
      writeFile(path.join(res, 'xml', 'widget_lists_info.xml'), listsInfoXml())

      // Kotlin sources
      const javaDir = path.join(main, 'java', ...pkg.split('.'), 'widgets')
      writeFile(path.join(javaDir, `${NEW_POST_PROVIDER}.kt`), newPostProviderKt(pkg))
      writeFile(path.join(javaDir, `${STATS_PROVIDER}.kt`), statsProviderKt(pkg))
      writeFile(path.join(javaDir, `${STATS_CARD_PROVIDER}.kt`), statsCardProviderKt(pkg))
      writeFile(path.join(javaDir, `${COMPOSER_PROVIDER}.kt`), composerProviderKt(pkg))
      writeFile(path.join(javaDir, `${INTERACTIONS_PROVIDER}.kt`), interactionsProviderKt(pkg))
      writeFile(path.join(javaDir, `${PINNED_FEEDS_PROVIDER}.kt`), pinnedFeedsProviderKt(pkg))
      writeFile(path.join(javaDir, `${PINNED_FEEDS_SERVICE}.kt`), pinnedFeedsServiceKt(pkg))
      writeFile(path.join(javaDir, 'PinnedFeedsRemoteViewsFactory.kt'), pinnedFeedsFactoryKt(pkg))
      writeFile(path.join(javaDir, `${LISTS_PROVIDER}.kt`), listsProviderKt(pkg))
      writeFile(path.join(javaDir, `${LISTS_SERVICE}.kt`), listsServiceKt(pkg))
      writeFile(path.join(javaDir, 'ListsRemoteViewsFactory.kt'), listsFactoryKt(pkg))

      return config
    },
  ])
}

// ---------------------------------------------------------------------------
// Config plugin: AndroidManifest receivers + services
// ---------------------------------------------------------------------------

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

function serviceNode(name) {
  return {
    $: {
      'android:name': name,
      'android:permission': 'android.permission.BIND_REMOTEVIEWS',
      'android:exported': 'false',
    },
  }
}

const withWidgetReceivers = config => {
  return withAndroidManifest(config, config => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    )
    app.receiver = app.receiver || []
    app.service = app.service || []

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
      receiverNode(
        `.widgets.${STATS_CARD_PROVIDER}`,
        '@string/widget_stats_card_label',
        '@xml/widget_stats_card_info',
      ),
      receiverNode(
        `.widgets.${COMPOSER_PROVIDER}`,
        '@string/widget_composer_label',
        '@xml/widget_composer_info',
      ),
      receiverNode(
        `.widgets.${INTERACTIONS_PROVIDER}`,
        '@string/widget_interactions_label',
        '@xml/widget_interactions_info',
      ),
      receiverNode(
        `.widgets.${PINNED_FEEDS_PROVIDER}`,
        '@string/widget_pinned_feeds_label',
        '@xml/widget_pinned_feeds_info',
      ),
      receiverNode(
        `.widgets.${LISTS_PROVIDER}`,
        '@string/widget_lists_label',
        '@xml/widget_lists_info',
      ),
    ]

    for (const receiver of receivers) {
      const name = receiver.$['android:name']
      if (!app.receiver.some(r => r.$?.['android:name'] === name)) {
        app.receiver.push(receiver)
      }
    }

    const services = [
      serviceNode(`.widgets.${PINNED_FEEDS_SERVICE}`),
      serviceNode(`.widgets.${LISTS_SERVICE}`),
    ]

    for (const svc of services) {
      const name = svc.$['android:name']
      if (!app.service.some(s => s.$?.['android:name'] === name)) {
        app.service.push(svc)
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
