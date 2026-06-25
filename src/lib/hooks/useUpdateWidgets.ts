import {useEffect} from 'react'
import {
  documentDirectory,
  downloadAsync,
  writeAsStringAsync,
} from 'expo-file-system/legacy'
import {useLingui} from '@lingui/react/macro'

import {useProfileQuery} from '#/state/queries/profile'
import {useSession} from '#/state/session'
import {IS_ANDROID} from '#/env'
import * as AppShortcuts from '../../../modules/expo-app-shortcuts'

/**
 * Writes data + localized labels for the Android home-screen widgets to
 * filesDir, then asks the widget providers to re-render. The widget providers
 * read `widget_data.json` (so their text follows the app language) and
 * `widget_avatar.png`. No-op off Android.
 */
export function useUpdateWidgets() {
  const {t: l} = useLingui()
  const {currentAccount} = useSession()
  const {data: profile} = useProfileQuery({did: currentAccount?.did})

  // Resolved through Lingui so the widgets follow the app language.
  const newPostLabel = l`New post`
  const followersLabel = l`Followers`
  const followingLabel = l`Following`

  const payload = JSON.stringify({
    newPostLabel,
    followersLabel,
    followingLabel,
    followers: profile?.followersCount ?? 0,
    following: profile?.followsCount ?? 0,
    handle: profile?.handle ?? '',
    displayName: profile?.displayName ?? '',
    avatar: profile?.avatar ?? '',
  })

  useEffect(() => {
    if (!IS_ANDROID || !documentDirectory) return
    const data = JSON.parse(payload)
    const run = async () => {
      try {
        await writeAsStringAsync(
          documentDirectory + 'widget_data.json',
          JSON.stringify({
            newPostLabel: data.newPostLabel,
            followersLabel: data.followersLabel,
            followingLabel: data.followingLabel,
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
        AppShortcuts.refreshWidgets()
      } catch {
        // best-effort; widget data is non-critical
      }
    }
    void run()
  }, [payload])
}
