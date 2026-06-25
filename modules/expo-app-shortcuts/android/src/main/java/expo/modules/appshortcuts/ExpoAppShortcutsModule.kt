package expo.modules.appshortcuts

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Intent
import android.content.pm.ShortcutInfo
import android.content.pm.ShortcutManager
import android.graphics.drawable.Icon
import android.net.Uri
import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class ShortcutRecord : Record {
  @Field val id: String = ""
  @Field val label: String = ""
  @Field val deepLink: String = ""
  @Field val iconResName: String? = null
}

class ExpoAppShortcutsModule : Module() {
  override fun definition() =
    ModuleDefinition {
      Name("ExpoAppShortcuts")

      // True when the device supports dynamic shortcuts (Android 7.1 / API 25+).
      Function("isSupported") {
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.N_MR1
      }

      // Replace the app's dynamic launcher shortcuts with the given list (in
      // order). Each item deep-links into the app via its `deepLink` URI.
      Function("setShortcuts") { shortcuts: List<ShortcutRecord> ->
        applyShortcuts(shortcuts)
      }

      // Ask the home-screen widget providers to re-render (after the app has
      // written fresh data/labels to filesDir).
      Function("refreshWidgets") { refreshWidgets() }
    }

  private fun refreshWidgets() {
    val context = appContext.reactContext ?: return
    val manager = AppWidgetManager.getInstance(context) ?: return
    val pkg = context.packageName
    for (cls in listOf("StatsWidgetProvider", "NewPostWidgetProvider")) {
      try {
        val comp = ComponentName(pkg, "$pkg.widgets.$cls")
        val ids = manager.getAppWidgetIds(comp)
        if (ids.isNotEmpty()) {
          val intent = Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE)
          intent.component = comp
          intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
          context.sendBroadcast(intent)
        }
      } catch (e: Exception) {
        // best-effort
      }
    }
  }

  private fun applyShortcuts(items: List<ShortcutRecord>) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N_MR1) return
    val context = appContext.reactContext ?: return
    val shortcutManager =
      context.getSystemService(ShortcutManager::class.java) ?: return

    val max = shortcutManager.maxShortcutCountPerActivity.coerceAtLeast(1)
    val infos =
      items.take(max).mapIndexedNotNull { index, item ->
        if (item.id.isEmpty() || item.deepLink.isEmpty()) return@mapIndexedNotNull null
        try {
          val intent =
            Intent(Intent.ACTION_VIEW, Uri.parse(item.deepLink)).apply {
              setPackage(context.packageName)
            }
          val builder =
            ShortcutInfo.Builder(context, item.id)
              .setShortLabel(item.label)
              .setLongLabel(item.label)
              .setRank(index)
              .setIntent(intent)

          val resId =
            item.iconResName?.let {
              context.resources.getIdentifier(it, "drawable", context.packageName)
            } ?: 0
          if (resId != 0) {
            builder.setIcon(Icon.createWithResource(context, resId))
          }
          builder.build()
        } catch (e: Exception) {
          null
        }
      }

    try {
      shortcutManager.dynamicShortcuts = infos
    } catch (e: Exception) {
      // ignore - shortcuts are best-effort
    }
  }
}
