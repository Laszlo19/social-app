import {createContext, useContext, useMemo} from 'react'
import {hasMutedWord} from '@bsky/sdk/moderation'
import {QueryClient, useQuery} from '@tanstack/react-query'

import {useOnAppStateChange} from '#/lib/appState'
import {useIsBskyTeam} from '#/lib/hooks/useIsBskyTeam'
import {
  convertBskyAppUrlIfNeeded,
  isBskyCustomFeedUrl,
  makeRecordUri,
} from '#/lib/strings/url-helpers'
import {usePreferencesQuery} from '#/state/queries/preferences'
import {IS_DEV, LIVE_EVENTS_URL} from '#/env'
import {useLiveEventPreferences} from '#/features/liveEvents/preferences'
import {
  type LiveEventFeed,
  type LiveEventsWorkerResponse,
} from '#/features/liveEvents/types'
import {device, useStorage} from '#/storage'
import {useDevMode} from '#/storage/hooks/dev-mode'

const qc = new QueryClient()
const liveEventsQueryKey = ['live-events']

export const DEFAULT_LIVE_EVENTS = {
  feeds: [],
}

/**
 * Fork testing aid: a hardcoded live event injected when the
 * `experimentalTestLiveEvent` toggle is on, so the banner can be demoed without
 * a real remote event. `url` points at the Discover feed so the card links
 * somewhere valid; the image is a stable placeholder.
 */
const TEST_LIVE_EVENT: LiveEventFeed = {
  id: 'fork-test-live-event',
  preview: false,
  title: 'Test Live Event',
  url: 'https://bsky.app/profile/did:plc:z72i7hdynmk6r22z27h6tvur/feed/whats-hot',
  layouts: {
    wide: {
      title: 'Test Live Event',
      overlayColor: '#1083FE',
      textColor: '#FFFFFF',
      image: 'https://picsum.photos/seed/bskyliveevent/576/144',
      blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
    },
    compact: {
      title: 'Test Live Event',
      overlayColor: '#1083FE',
      textColor: '#FFFFFF',
      image: 'https://picsum.photos/seed/bskyliveevent/369/100',
      blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
    },
  },
}

async function fetchLiveEvents(): Promise<LiveEventsWorkerResponse | null> {
  try {
    const res = await fetch(`${LIVE_EVENTS_URL}/config`)
    if (!res.ok) return null
    const data = await res.json()
    return data
  } catch {
    return null
  }
}

const Context = createContext<LiveEventsWorkerResponse>(DEFAULT_LIVE_EVENTS)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [isDevMode] = useDevMode()
  const [testEvent] = useStorage(device, ['experimentalTestLiveEvent'])
  const isBskyTeam = useIsBskyTeam()
  const {data: preferences} = usePreferencesQuery()
  const mutedWords = useMemo(
    () => preferences?.moderationPrefs?.mutedWords ?? [],
    [preferences?.moderationPrefs?.mutedWords],
  )

  const {data, refetch} = useQuery(
    {
      // keep this, prefectching handles initial load
      staleTime: 1000 * 15,
      queryKey: liveEventsQueryKey,
      refetchInterval: 1000 * 60 * 5, // refetch every 5 minutes
      async queryFn() {
        return fetchLiveEvents()
      },
    },
    qc,
  )

  useOnAppStateChange(state => {
    if (state === 'active') void refetch()
  })

  const ctx = useMemo(() => {
    // Fork testing: inject a fake event so the banner shows without a real one.
    const injected = testEvent ? [TEST_LIVE_EVENT] : []
    if (!data) {
      return injected.length ? {feeds: injected} : DEFAULT_LIVE_EVENTS
    }
    const skipMuteFilter = isBskyTeam || IS_DEV
    const feeds = data.feeds.filter(f => {
      if (f.preview && !isBskyTeam) return false
      if (!skipMuteFilter && mutedWords.length > 0) {
        const text = [
          f.title,
          f.layouts?.wide?.title,
          f.layouts?.compact?.title,
        ]
          .filter(Boolean)
          .join(' ')
        if (hasMutedWord({mutedWords, text})) return false
      }
      return true
    })
    return {
      ...data,
      // only one at a time for now, unless bsky team and dev mode
      feeds: [
        ...injected,
        ...(isBskyTeam && isDevMode ? feeds : feeds.slice(0, 1)),
      ],
    }
  }, [data, isBskyTeam, isDevMode, mutedWords, testEvent])

  return <Context.Provider value={ctx}>{children}</Context.Provider>
}

export async function prefetchLiveEvents() {
  const data = await fetchLiveEvents()
  if (data) {
    qc.setQueryData(liveEventsQueryKey, data)
  }
}

export function useLiveEvents() {
  const ctx = useContext(Context)
  if (!ctx) {
    throw new Error('useLiveEventsContext must be used within a Provider')
  }
  return ctx
}

export function useUserPreferencedLiveEvents() {
  const events = useLiveEvents()
  const {data, isLoading} = useLiveEventPreferences()
  if (isLoading) return DEFAULT_LIVE_EVENTS
  const {hideAllFeeds, hiddenFeedIds} = data
  return {
    ...events,
    feeds: hideAllFeeds
      ? []
      : events.feeds.filter(f => {
          const hidden = f?.id ? hiddenFeedIds.includes(f?.id || '') : false
          return !hidden
        }),
  }
}

export function useActiveLiveEventFeedUris() {
  const {feeds} = useLiveEvents()

  return new Set(
    feeds
      // insurance
      .filter(f => isBskyCustomFeedUrl(f.url))
      .map(f => {
        const uri = convertBskyAppUrlIfNeeded(f.url)
        const [_0, did, _1, rkey] = uri.split('/').filter(Boolean)
        const urip = makeRecordUri(did, 'app.bsky.feed.generator', rkey)
        return urip.toString()
      }),
  )
}
