import {useEffect, useRef} from 'react'
import {type AppBskyFeedPost, type AppBskyNotificationListNotifications} from '@atproto/api'
import {
  documentDirectory,
  downloadAsync,
  writeAsStringAsync,
} from 'expo-file-system/legacy'
import {useLingui} from '@lingui/react/macro'

import {usePinnedFeedsInfos} from '#/state/queries/feed'
import {useMyListsQuery} from '#/state/queries/my-lists'
import {useProfileQuery} from '#/state/queries/profile'
import {useAgent, useSession} from '#/state/session'
import {IS_ANDROID} from '#/env'
import * as AppShortcuts from '../../../modules/expo-app-shortcuts'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
// Throttle the notifications fetch to avoid hammering the API.
const INTERACTIONS_THROTTLE_MS = 30 * 60 * 1000

/**
 * Writes data + localized labels for Android home-screen widgets to filesDir,
 * then broadcasts a refresh to all widget providers. No-op off Android.
 *
 * Files written:
 *   widget_data.json         – profile stats (existing New Post + Stats widgets)
 *   widget_avatar.png        – avatar bitmap (existing Stats widget)
 *   widget_interactions.json – recent reply/repost counts (Interactions widget)
 *   widget_pinned_feeds.json – pinned feed names + AT URIs (Pinned Feeds widget)
 *   widget_lists.json        – list names + AT URIs (Lists widget)
 *   widget_labels.json       – localized static labels for all widgets, so the
 *                              providers can override their @string defaults and
 *                              follow the app language
 */
export function useUpdateWidgets() {
  const {t: l} = useLingui()
  const {currentAccount} = useSession()
  const agent = useAgent()
  const {data: profile} = useProfileQuery({did: currentAccount?.did})
  const {data: pinnedFeeds} = usePinnedFeedsInfos()
  const {data: lists} = useMyListsQuery('all')
  const lastInteractionsFetch = useRef(0)

  // Resolved through Lingui so widget labels follow the app language.
  const newPostLabel = l`New post`
  const followersLabel = l`Followers`
  const followingLabel = l`Following`

  /*
   * Static labels for the newer widgets. The Android layouts ship English
   * @string defaults; these localized values override them at runtime so all
   * widget text follows the app language. Keep the keys in sync with the
   * providers in plugins/withAndroidWidgets.js.
   */
  const labelsPayload = JSON.stringify({
    statsCardTitle: l`Account statistics`,
    statsCardPeriod: l`Last 30 days`,
    composerPlaceholder: l`What's up?`,
    composerCamera: l`Camera`,
    composerPhoto: l`Photo`,
    composerGif: l`GIF`,
    composerPost: l`Post`,
    interactionsTitle: l`Interactions`,
    interactionsReplies: l`Replies`,
    interactionsReposts: l`Reposts`,
    interactionsPeriod: l`Last 7 days`,
    interactionsEmpty: l`Open the app to load interactions`,
    pinnedFeedsTitle: l`Pinned feeds`,
    pinnedFeedsEmpty: l`No pinned feeds yet`,
    listsTitle: l`Lists`,
    listsEmpty: l`No lists found`,
  })

  // Profile / stats data — refreshed whenever profile changes.
  const profilePayload = JSON.stringify({
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
    const data = JSON.parse(profilePayload)
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
  }, [profilePayload])

  // Localized static labels — rewritten whenever the app language changes.
  useEffect(() => {
    if (!IS_ANDROID || !documentDirectory) return
    void writeAsStringAsync(
      documentDirectory + 'widget_labels.json',
      labelsPayload,
    )
      .then(() => AppShortcuts.refreshWidgets())
      .catch(() => {})
  }, [labelsPayload])

  // Pinned feeds — refreshed when the feeds list changes.
  useEffect(() => {
    if (!IS_ANDROID || !documentDirectory || !pinnedFeeds) return
    const feedData = pinnedFeeds.map(f => ({name: f.displayName, uri: f.uri}))
    void writeAsStringAsync(
      documentDirectory + 'widget_pinned_feeds.json',
      JSON.stringify(feedData),
    )
      .then(() => AppShortcuts.refreshWidgets())
      .catch(() => {})
  }, [pinnedFeeds])

  // User's lists — refreshed when the lists query changes.
  useEffect(() => {
    if (!IS_ANDROID || !documentDirectory || !lists) return
    const listData = lists.map(item => ({name: item.name, uri: item.uri}))
    void writeAsStringAsync(
      documentDirectory + 'widget_lists.json',
      JSON.stringify(listData),
    )
      .then(() => AppShortcuts.refreshWidgets())
      .catch(() => {})
  }, [lists])

  // Interactions — throttled fetch of recent notifications to count replies
  // and reposts and surface the most recent reply excerpt.
  useEffect(() => {
    if (!IS_ANDROID || !documentDirectory || !currentAccount) return
    const now = Date.now()
    if (now - lastInteractionsFetch.current < INTERACTIONS_THROTTLE_MS) return
    lastInteractionsFetch.current = now

    void (async () => {
      try {
        const res = await agent.app.bsky.notification.listNotifications({
          limit: 50,
        })
        const cutoff = now - SEVEN_DAYS_MS
        const recent = res.data.notifications.filter(
          (n: AppBskyNotificationListNotifications.Notification) =>
            new Date(n.indexedAt).getTime() > cutoff,
        )
        const replies = recent.filter(
          (n: AppBskyNotificationListNotifications.Notification) =>
            n.reason === 'reply' || n.reason === 'mention',
        ).length
        const reposts = recent.filter(
          (n: AppBskyNotificationListNotifications.Notification) =>
            n.reason === 'repost',
        ).length
        const firstReply = recent.find(
          (n: AppBskyNotificationListNotifications.Notification) =>
            n.reason === 'reply' || n.reason === 'mention',
        )
        const record = firstReply?.record as AppBskyFeedPost.Record | undefined
        await writeAsStringAsync(
          documentDirectory + 'widget_interactions.json',
          JSON.stringify({
            recentHandle: firstReply?.author?.handle ?? '',
            recentExcerpt: record?.text?.slice(0, 80) ?? '',
            replies,
            reposts,
          }),
        )
        AppShortcuts.refreshWidgets()
      } catch {
        // best-effort
      }
    })()
  }, [agent, currentAccount])
}
