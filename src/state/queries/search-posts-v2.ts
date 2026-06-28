/**
 * Fork stub: wraps the v1 searchPosts endpoint with the same interface as the
 * upstream v2 hook, converting structured filters to legacy operator syntax.
 * This keeps full compatibility with @atproto/api 0.20.15 while allowing the
 * advanced-search UI to function.
 */
import {useCallback, useMemo, useRef} from 'react'
import {type AppBskyFeedDefs, moderatePost} from '@atproto/api'
import {
  type InfiniteData,
  type QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query'

import {useModerationOpts} from '#/state/preferences/moderation-opts'
import {useAgent} from '#/state/session'
import {
  filtersToLegacyParams,
  type SearchFilters,
} from '#/screens/Search/searchParams'
import {augmentSearchQuery} from '#/lib/strings/helpers'

type SearchV2Page = {
  posts: AppBskyFeedDefs.PostView[]
  cursor?: string
  detectedQueryLanguages?: string[]
}

const searchPostsQueryKeyRoot = 'search-posts'

const searchPostsV2QueryKey = ({
  query,
  sort,
  filters,
}: {
  query: string
  sort?: string
  filters?: SearchFilters
}) => [searchPostsQueryKeyRoot, query, sort, filters]

export function useSearchPostsV2Query({
  query,
  sort,
  enabled,
  filters,
}: {
  query: string
  sort?: 'top' | 'latest'
  enabled?: boolean
  filters?: SearchFilters
}) {
  const agent = useAgent()
  const moderationOpts = useModerationOpts()
  const selectArgs = useMemo(
    () => ({
      isSearchingSpecificUser:
        /from:(\w+)/.test(query) || !!filters?.author,
      moderationOpts,
    }),
    [query, filters?.author, moderationOpts],
  )
  const lastRun = useRef<{
    data: InfiniteData<SearchV2Page>
    args: typeof selectArgs
    result: InfiniteData<SearchV2Page>
  } | null>(null)

  return useInfiniteQuery<
    SearchV2Page,
    Error,
    InfiniteData<SearchV2Page>,
    QueryKey,
    string | undefined
  >({
    queryKey: searchPostsV2QueryKey({query, sort, filters}),
    queryFn: async ({pageParam}) => {
      // Build a legacy query string from the structured filters.
      const legacyExtra = filtersToLegacyParams(filters ?? {})
      const combinedQ = [query, legacyExtra.q].filter(Boolean).join(' ')

      const res = await agent.app.bsky.feed.searchPosts({
        q: combinedQ,
        sort: sort === 'latest' ? 'latest' : 'top',
        limit: 25,
        cursor: pageParam,
      })
      return {
        posts: res.data.posts,
        cursor: res.data.cursor,
        detectedQueryLanguages: [],
      }
    },
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.cursor,
    enabled: enabled ?? !!moderationOpts,
    select: useCallback(
      (data: InfiniteData<SearchV2Page>) => {
        const {moderationOpts: opts, isSearchingSpecificUser} = selectArgs

        if (isSearchingSpecificUser) {
          return data
        }

        let reusedPages: SearchV2Page[] = []
        if (lastRun.current) {
          const {data: lastData, args: lastArgs, result: lastResult} =
            lastRun.current
          let canReuse = true
          for (const key in selectArgs) {
            if (Object.prototype.hasOwnProperty.call(selectArgs, key)) {
              if (
                (selectArgs as Record<string, unknown>)[key] !==
                (lastArgs as Record<string, unknown>)[key]
              ) {
                canReuse = false
                break
              }
            }
          }
          if (canReuse) {
            for (let i = 0; i < data.pages.length; i++) {
              if (data.pages[i] && lastData.pages[i] === data.pages[i]) {
                reusedPages.push(lastResult.pages[i])
                continue
              }
              break
            }
          }
        }

        const result = {
          ...data,
          pages: [
            ...reusedPages,
            ...data.pages.slice(reusedPages.length).map(page => ({
              ...page,
              posts: page.posts.filter(post => {
                const mod = moderatePost(post, opts!)
                return !mod.ui('contentList').filter
              }),
            })),
          ],
        }

        lastRun.current = {data, result, args: selectArgs}

        return result
      },
      [selectArgs],
    ),
  })
}
