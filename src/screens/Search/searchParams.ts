/**
 * Advanced-search filter parameters. These live on the route as individual
 * query params (one per key) so that the URL is shareable and linkable.
 *
 * Keep in sync with FILTER_PARAM_KEYS below.
 */
export type SearchFilters = {
  author?: string
  mentions?: string
  domain?: string
  url?: string
  tag?: string
  excludeAuthor?: string
  excludeMentions?: string
  excludeDomain?: string
  excludeUrl?: string
  excludeTag?: string
  lang?: string
  since?: string
  until?: string
  replies?: string
  media?: string
  video?: string
  following?: string
}

/**
 * The route param keys that carry advanced-search filters. Kept as a const so
 * that the Shell can bulk-include/exclude them when building route params.
 */
export const FILTER_PARAM_KEYS = [
  'author',
  'mentions',
  'domain',
  'url',
  'tag',
  'excludeAuthor',
  'excludeMentions',
  'excludeDomain',
  'excludeUrl',
  'excludeTag',
  'lang',
  'since',
  'until',
  'replies',
  'media',
  'video',
  'following',
] as const

/** Pull the active filter keys from a route-params object. */
export function readSearchFilters(
  params: Record<string, unknown>,
): SearchFilters {
  const filters: SearchFilters = {}
  for (const key of FILTER_PARAM_KEYS) {
    const value = params[key]
    if (typeof value === 'string' && value) {
      ;(filters as Record<string, string>)[key] = value
    }
  }
  return filters
}

export function hasActiveFilters(filters: SearchFilters): boolean {
  return FILTER_PARAM_KEYS.some(key => !!filters[key])
}

export function countActiveFilters(filters: SearchFilters): number {
  return FILTER_PARAM_KEYS.filter(key => !!filters[key]).length
}

/**
 * Serialize a history entry. Term-only queries serialize as plain strings
 * (back-compat); queries with filters serialize to JSON.
 */
export function serializeHistoryEntry(
  q: string,
  filters: SearchFilters = {},
): string {
  if (!hasActiveFilters(filters)) return q
  return JSON.stringify({q, ...filters})
}

/**
 * Parse a history entry back into a query + filters. Plain-string entries
 * (legacy) produce an empty filter set.
 */
export function parseHistoryEntry(item: string): {
  q: string
  filters: SearchFilters
} {
  try {
    const parsed = JSON.parse(item)
    if (parsed && typeof parsed === 'object' && typeof parsed.q === 'string') {
      const {q, ...rest} = parsed
      return {q, filters: rest as SearchFilters}
    }
  } catch {
    // Plain string entry.
  }
  return {q: item, filters: {}}
}

/**
 * True if any filter only makes sense for posts (not profiles or feeds). Used
 * to hide the People/Feeds tabs when these are active.
 */
export function hasPostOnlyFilters(filters: SearchFilters): boolean {
  const {lang: _lang, ...rest} = filters
  return hasActiveFilters(rest)
}

/**
 * Build the route-params object that carries the filter values. Absent filters
 * are set to `undefined` so that React Navigation clears stale params.
 */
export function filtersToRouteParams(
  filters: SearchFilters,
): Record<string, string | undefined> {
  const params: Record<string, string | undefined> = {}
  for (const key of FILTER_PARAM_KEYS) {
    params[key] = filters[key] ?? undefined
  }
  return params
}

/** Only the filter keys that have values. Useful for building URLs. */
export function definedFilterParams(
  filters: SearchFilters,
): Record<string, string> {
  const params: Record<string, string> = {}
  for (const key of FILTER_PARAM_KEYS) {
    const value = filters[key]
    if (value) params[key] = value
  }
  return params
}

/** Strip filter params from a route-params object, leaving other keys. */
export function withoutFilterParams(
  routeParams: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const params: Record<string, unknown> = {...routeParams}
  for (const key of FILTER_PARAM_KEYS) {
    delete params[key]
  }
  return params
}

/**
 * Convert structured filters to the legacy single-`q` operator syntax so the
 * v1 `app.bsky.feed.searchPosts` endpoint understands them.
 */
export function filtersToLegacyParams(
  filters: SearchFilters,
): Record<string, string> {
  const parts: string[] = []

  if (filters.author) parts.push(`from:${filters.author}`)
  if (filters.mentions) parts.push(`mentions:${filters.mentions}`)
  if (filters.domain) parts.push(`domain:${filters.domain}`)
  if (filters.url) parts.push(`url:${filters.url}`)
  if (filters.tag) parts.push(`#${filters.tag}`)
  if (filters.lang) parts.push(`lang:${filters.lang}`)
  if (filters.since) parts.push(`since:${filters.since}`)
  if (filters.until) parts.push(`until:${filters.until}`)
  if (filters.replies === 'none') parts.push(`-filter:reply`)
  if (filters.replies === 'only') parts.push(`filter:reply`)
  if (filters.media === 'media') parts.push(`filter:media`)
  if (filters.media === 'video') parts.push(`filter:video`)
  if (filters.video === 'true') parts.push(`filter:video`)
  if (filters.following === 'true') parts.push(`filter:following`)

  return parts.length ? {q: parts.join(' ')} : {}
}

export type SearchApiParams = {
  authors?: string[]
  mentions?: string[]
  domains?: string[]
  urls?: string[]
  hashtags?: string[]
  excludeAuthors?: string[]
  excludeMentions?: string[]
  excludeDomains?: string[]
  excludeUrls?: string[]
  excludeHashtags?: string[]
  language?: string
  since?: string
  until?: string
  hasMedia?: boolean
  hasVideo?: boolean
  following?: boolean
  excludeReplies?: boolean
  repliesOnly?: boolean
}

/**
 * Build structured API params from filters. Used by the v2 query hook
 * and the search-posts-params helper.
 */
export function filtersToApiParams(filters: SearchFilters): SearchApiParams {
  const params: SearchApiParams = {}

  if (filters.author) params.authors = [filters.author]
  if (filters.mentions) params.mentions = [filters.mentions]
  if (filters.domain) params.domains = [filters.domain]
  if (filters.url) params.urls = [filters.url]
  if (filters.tag) params.hashtags = [filters.tag]
  if (filters.excludeAuthor) params.excludeAuthors = [filters.excludeAuthor]
  if (filters.excludeMentions)
    params.excludeMentions = [filters.excludeMentions]
  if (filters.excludeDomain) params.excludeDomains = [filters.excludeDomain]
  if (filters.excludeUrl) params.excludeUrls = [filters.excludeUrl]
  if (filters.excludeTag) params.excludeHashtags = [filters.excludeTag]
  if (filters.lang) params.language = filters.lang
  if (filters.since) params.since = filters.since
  if (filters.until) params.until = filters.until
  if (filters.replies === 'none') params.excludeReplies = true
  if (filters.replies === 'only') params.repliesOnly = true
  if (filters.media === 'media') params.hasMedia = true
  if (filters.media === 'video') params.hasVideo = true
  if (filters.video === 'true') params.hasVideo = true
  if (filters.following === 'true') params.following = true

  return params
}
