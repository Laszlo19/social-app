import {useCallback, useMemo, useRef} from 'react'
import {type AppBskyFeedDefs, moderatePost} from '@atproto/api'
import {
  type InfiniteData,
  type QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query'

import {useModerationOpts} from '#/state/preferences/moderation-opts'
import {useAgent} from '#/state/session'
import {type SearchFilters} from '#/screens/Search/searchParams'

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

/** Split a space-separated string param into an array, dropping empties. */
function splitParam(value?: string): string[] | undefined {
  if (!value) return undefined
  const parts = value.trim().split(/\s+/).filter(Boolean)
  return parts.length > 0 ? parts : undefined
}

/** Map our SearchFilters (route params) to app.bsky.feed.searchPostsV2 params. */
function filtersToV2Params(
  filters: SearchFilters,
): Record<string, string | string[] | boolean | undefined> {
  return {
    authors: splitParam(filters.author),
    mentions: splitParam(filters.mentions),
    domains: splitParam(filters.domain),
    urls: splitParam(filters.url),
    hashtags: splitParam(filters.tag),
    excludeAuthors: splitParam(filters.excludeAuthor),
    excludeMentions: splitParam(filters.excludeMentions),
    excludeDomains: splitParam(filters.excludeDomain),
    excludeUrls: splitParam(filters.excludeUrl),
    excludeHashtags: splitParam(filters.excludeTag),
    languages: filters.lang ? [filters.lang] : undefined,
    since: filters.since,
    until: filters.until,
    excludeReplies:
      filters.replies === 'none' ? true : undefined,
    repliesOnly:
      filters.replies === 'only' ? true : undefined,
    hasMedia: filters.media === 'true' ? true : undefined,
    hasVideo: filters.video === 'true' ? true : undefined,
    following: filters.following === 'true' ? true : undefined,
  }
}

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
      const v2Params = filtersToV2Params(filters ?? {})
      const res = await agent.app.bsky.feed.searchPostsV2({
        query: query || undefined,
        sort: sort === 'latest' ? 'recent' : 'top',
        limit: 25,
        cursor: pageParam,
        ...v2Params,
      })
      return {
        posts: res.data.posts,
        cursor: res.data.cursor,
        detectedQueryLanguages: res.data.detectedQueryLanguages ?? [],
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
