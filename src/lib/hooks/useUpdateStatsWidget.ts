import {useEffect} from 'react'
import {
  documentDirectory,
  downloadAsync,
  writeAsStringAsync,
} from 'expo-file-system/legacy'

import {useProfileQuery} from '#/state/queries/profile'
import {useSession} from '#/state/session'
import {IS_ANDROID} from '#/env'

/**
 * Writes the current account's stats (+ avatar) to filesDir so the Android
 * "Account stats" home-screen widget can read them. The widget picks up changes
 * on its next update (periodic, or when added). No-op off Android.
 *
 * Paths mirror what StatsWidgetProvider reads: filesDir/widget_stats.json and
 * filesDir/widget_avatar.png (documentDirectory maps to filesDir on Android).
 */
export function useUpdateStatsWidget() {
  const {currentAccount} = useSession()
  const {data: profile} = useProfileQuery({did: currentAccount?.did})

  const payload = JSON.stringify({
    followers: profile?.followersCount ?? 0,
    following: profile?.followsCount ?? 0,
    handle: profile?.handle ?? '',
    displayName: profile?.displayName ?? '',
    avatar: profile?.avatar ?? '',
  })

  useEffect(() => {
    if (!IS_ANDROID || !documentDirectory) return
    const data = JSON.parse(payload) as {
      followers: number
      following: number
      handle: string
      displayName: string
      avatar: string
    }
    if (!data.handle) return

    const run = async () => {
      try {
        await writeAsStringAsync(
          documentDirectory + 'widget_stats.json',
          JSON.stringify({
            followers: data.followers,
            following: data.following,
            handle: data.handle,
            displayName: data.displayName,
          }),
        )
        if (data.avatar) {
          await downloadAsync(
            data.avatar,
            documentDirectory + 'widget_avatar.png',
          )
        }
      } catch {
        // best-effort; widget data is non-critical
      }
    }
    void run()
  }, [payload])
}
