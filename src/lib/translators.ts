/**
 * Curated list of the fork's localization contributors, used to show a
 * translator badge on their profiles.
 *
 * Keyed by DID (the stable atproto identity - survives handle changes), NOT by
 * handle. `lang` is a 2-letter code2 matching src/locale/languages.ts; `roles`
 * is any combination of the two contributor roles.
 *
 * To add a contributor, add an entry here. Example:
 *
 *   'did:plc:abc123': {
 *     languages: [
 *       {lang: 'es', roles: ['translator']},
 *       {lang: 'de', roles: ['translator', 'proofreader']},
 *     ],
 *   },
 */
export type TranslatorRole = 'translator' | 'proofreader'

export type TranslatorLanguage = {
  /** 2-letter language code (code2), e.g. "es". */
  lang: string
  roles: TranslatorRole[]
}

export type TranslatorEntry = {
  languages: TranslatorLanguage[]
}

export const TRANSLATORS: Record<string, TranslatorEntry> = {
  'did:plc:eqwo3fvlzdordtlut4nbaqfr': {
    languages: [{lang: 'ro', roles: ['translator', 'proofreader']}],
  },
}

/**
 * Look up a profile's translator entry by DID. Returns undefined for
 * non-contributors (and when did is missing).
 */
export function getTranslatorEntry(
  did: string | undefined,
): TranslatorEntry | undefined {
  if (!did) return undefined
  const entry = TRANSLATORS[did]
  if (!entry || entry.languages.length === 0) return undefined
  return entry
}
