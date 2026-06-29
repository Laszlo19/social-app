import {useMemo} from 'react'
import {Trans, useLingui} from '@lingui/react/macro'

import {augmentSearchQuery} from '#/lib/strings/helpers'
import {codeToLanguageName} from '#/locale/helpers'
import {useLanguagePrefs} from '#/state/preferences/languages'
import {useSearchPostsV2Query} from '#/state/queries/search-posts-v2'
import {useSession} from '#/state/session'
import {type SearchFilters} from '#/screens/Search/searchParams'
import {Admonition} from '#/components/Admonition'
import {createStaticClick, InlineLinkText} from '#/components/Link'

type DetectedLanguage = {code: string; name: string}

/**
 * Shows a tip naming the languages detected in the query text so the user
 * can confirm we parsed the query as they intended. Only shown when the
 * v2 search API returns detected languages.
 */
export function DetectedLanguagesAdmonition({
  query,
  filters,
  sort,
  enabled,
  onPressLanguage,
}: {
  query: string
  filters: SearchFilters
  sort?: 'top' | 'latest'
  enabled: boolean
  onPressLanguage: (code: string) => void
}) {
  const {appLanguage} = useLanguagePrefs()
  const {currentAccount} = useSession()

  const augmentedQuery = useMemo(
    () => augmentSearchQuery(query || '', {did: currentAccount?.did}),
    [query, currentAccount],
  )

  const {data} = useSearchPostsV2Query({
    query: augmentedQuery,
    filters,
    sort,
    enabled,
  })

  const languages = useMemo<DetectedLanguage[]>(() => {
    const codes = (data?.pages[0] as any)?.detectedQueryLanguages ?? []
    return codes.map((code: string) => ({
      code,
      name: codeToLanguageName(code, appLanguage),
    }))
  }, [data, appLanguage])

  if (languages.length === 0) return null
  if (filters.lang && languages.some(({code}) => code === filters.lang))
    return null

  return (
    <Admonition type="tip">
      <DetectedLanguagesPrompt
        languages={languages}
        onPressLanguage={onPressLanguage}
      />
    </Admonition>
  )
}

function DetectedLanguagesPrompt({
  languages,
  onPressLanguage,
}: {
  languages: DetectedLanguage[]
  onPressLanguage: (code: string) => void
}) {
  const {t: l} = useLingui()

  const link = (lang: DetectedLanguage) => (
    <InlineLinkText
      label={l`Filter this search by ${lang.name}`}
      {...createStaticClick(() => onPressLanguage(lang.code))}>
      {lang.name}
    </InlineLinkText>
  )

  if (languages.length === 1) {
    return <Trans>Are you searching for posts in {link(languages[0])}?</Trans>
  }

  if (languages.length === 2) {
    return (
      <Trans>
        Are you searching for posts in {link(languages[0])} or{' '}
        {link(languages[1])}?
      </Trans>
    )
  }

  const head = languages.slice(0, -1)
  const last = languages[languages.length - 1]
  return (
    <Trans comment="List formatting: {0}, {1}, or {2}">
      Are you searching for posts in{' '}
      {head.map(lang => (
        <Trans key={lang.code} comment="List formatting: {0}, {1}, {2}">
          {link(lang)},{' '}
        </Trans>
      ))}
      or {link(last)}?
    </Trans>
  )
}
