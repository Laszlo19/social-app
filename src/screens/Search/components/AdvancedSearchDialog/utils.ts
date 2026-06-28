import {nanoid} from 'nanoid/non-secure'

import {type SearchFilters} from '#/screens/Search/searchParams'

export type RepliesFilter = 'all' | 'none' | 'only'
export type MediaFilter = 'all' | 'media' | 'video'
export type FollowingFilter = 'everyone' | 'following'
export type FilterField = 'authors' | 'mentions' | 'domains' | 'urls' | 'tags'
export type FilterMode = 'include' | 'exclude'

export type AdvancedFilter = {
  id: string
  field: FilterField
  mode: FilterMode
  value: string
}

export const FILTER_FIELDS: FilterField[] = [
  'authors',
  'mentions',
  'domains',
  'urls',
  'tags',
]

export const HANDLE_FIELDS = new Set<FilterField>(['authors', 'mentions'])

export type DialogState = {
  query: string
  exactPhrase: string
  negatedWords: string
  language: string
  replies: RepliesFilter
  media: MediaFilter
  following: FollowingFilter
  since: string
  until: string
  dateSince: string
  dateSinceActive: boolean
  dateUntil: string
  dateUntilActive: boolean
  filters: AdvancedFilter[]
}

export function makeFilter(
  field: FilterField = 'authors',
  value = '',
  mode: FilterMode = 'include',
): AdvancedFilter {
  return {id: nanoid(), field, mode, value}
}

/**
 * Parse the current route query + filter params into dialog state so the form
 * opens pre-filled.
 */
export function parseAdvancedSearch(
  q: string,
  filters: SearchFilters,
): Omit<DialogState, 'dateSince' | 'dateSinceActive' | 'dateUntil' | 'dateUntilActive'> & {
  since: string
  until: string
} {
  // Split "must-have words" out of the raw query.
  // Quoted phrases stay intact; negated terms (-word) become negatedWords.
  const tokens = q.split(/\s+/).filter(Boolean)
  const positive: string[] = []
  const negated: string[] = []
  let exactPhrase = ''

  for (const token of tokens) {
    if (token.startsWith('"') && token.endsWith('"') && token.length > 2) {
      exactPhrase = token.slice(1, -1)
    } else if (token.startsWith('-') && token.length > 1) {
      negated.push(token.slice(1))
    } else {
      positive.push(token)
    }
  }

  const advancedFilters: AdvancedFilter[] = []

  const addFilters = (
    values: string | undefined,
    field: FilterField,
    mode: FilterMode,
  ) => {
    if (!values) return
    for (const v of values.split(/[\s,]+/).filter(Boolean)) {
      advancedFilters.push(makeFilter(field, v, mode))
    }
  }

  addFilters(filters.author, 'authors', 'include')
  addFilters(filters.mentions, 'mentions', 'include')
  addFilters(filters.domain, 'domains', 'include')
  addFilters(filters.url, 'urls', 'include')
  addFilters(filters.tag, 'tags', 'include')
  addFilters(filters.excludeAuthor, 'authors', 'exclude')
  addFilters(filters.excludeMentions, 'mentions', 'exclude')
  addFilters(filters.excludeDomain, 'domains', 'exclude')
  addFilters(filters.excludeUrl, 'urls', 'exclude')
  addFilters(filters.excludeTag, 'tags', 'exclude')

  return {
    query: positive.join(' '),
    exactPhrase,
    negatedWords: negated.join(' '),
    language: filters.lang ?? '',
    replies: (filters.replies as RepliesFilter) ?? 'all',
    media: (filters.media as MediaFilter) ?? 'all',
    following: filters.following === 'true' ? 'following' : 'everyone',
    since: filters.since ?? '',
    until: filters.until ?? '',
    filters: advancedFilters,
  }
}

/**
 * Convert dialog state back into a route query string and filter params.
 */
export function serializeAdvancedSearch(state: {
  query: string
  exactPhrase: string
  negatedWords: string
  language: string
  replies: RepliesFilter
  media: MediaFilter
  following: FollowingFilter
  dateSince: string
  dateSinceActive: boolean
  dateUntil: string
  dateUntilActive: boolean
  filters: AdvancedFilter[]
}): {q: string; filters: SearchFilters} {
  const parts: string[] = []

  if (state.query) parts.push(state.query)
  if (state.exactPhrase) parts.push(`"${state.exactPhrase}"`)
  if (state.negatedWords) {
    for (const word of state.negatedWords.split(/\s+/).filter(Boolean)) {
      parts.push(`-${word}`)
    }
  }

  const filters: SearchFilters = {}

  if (state.language) filters.lang = state.language

  if (state.replies === 'none') filters.replies = 'none'
  else if (state.replies === 'only') filters.replies = 'only'

  if (state.media === 'media') filters.media = 'media'
  else if (state.media === 'video') filters.media = 'video'

  if (state.following === 'following') filters.following = 'true'

  if (state.dateSinceActive && state.dateSince) filters.since = state.dateSince
  if (state.dateUntilActive && state.dateUntil) filters.until = state.dateUntil

  for (const filter of state.filters) {
    if (!filter.value) continue
    if (filter.field === 'authors') {
      if (filter.mode === 'include') filters.author = filter.value
      else filters.excludeAuthor = filter.value
    } else if (filter.field === 'mentions') {
      if (filter.mode === 'include') filters.mentions = filter.value
      else filters.excludeMentions = filter.value
    } else if (filter.field === 'domains') {
      if (filter.mode === 'include') filters.domain = filter.value
      else filters.excludeDomain = filter.value
    } else if (filter.field === 'urls') {
      if (filter.mode === 'include') filters.url = filter.value
      else filters.excludeUrl = filter.value
    } else if (filter.field === 'tags') {
      if (filter.mode === 'include') filters.tag = filter.value
      else filters.excludeTag = filter.value
    }
  }

  return {q: parts.join(' '), filters}
}
