/**
 * Hooks for date-fns localized formatters.
 *
 * Our app supports some languages that are not included in date-fns by
 * default, in which case it will fall back to English.
 *
 * {@link https://github.com/date-fns/date-fns/blob/main/docs/i18n.md}
 */

import React from 'react'
import {formatDistance, Locale} from 'date-fns'
import {
  ca,
  cy,
  da,
  de,
  el,
  enGB,
  eo,
  es,
  eu,
  fi,
  fr,
  gd,
  gl,
  hi,
  hu,
  id,
  it,
  ja,
  km,
  ko,
  nl,
  pl,
  ptBR,
  ro,
  ru,
  sv,
  th,
  tr,
  uk,
  vi,
  zhCN,
  zhHK,
  zhTW,
} from 'date-fns/locale'

import {AppLanguage} from '#/locale/languages'
import {useLanguagePrefs} from '#/state/preferences'

/**
 * {@link AppLanguage}
 */
const locales: Record<AppLanguage, Locale | undefined> = {
  en: undefined, // English (default)
  ab: undefined, // Abkhaz (unsupported)
  af: undefined, // Afrikaans (unsupported)
  am: undefined, // Amharic (unsupported)
  an: undefined, // Aragonese (unsupported)
  ar: undefined, // Arabic (unsupported)
  ast: undefined, // Asturian (unsupported)
  az: undefined, // Azerbaijani (unsupported)
  bg: undefined, // Bulgarian (unsupported)
  bn: undefined, // Bengali (unsupported)
  bs: undefined, // Bosnian (unsupported)
  ca, // Catalan
  co: undefined, // Corsican (unsupported)
  cs: undefined, // Czech (unsupported)
  cy, // Welsh
  da, // Danish
  de, // German
  el, // Greek
  ['en-GB']: enGB, // English (British)
  eo, // Esperanto
  es, // Spanish
  et: undefined, // Estonian (unsupported)
  eu, // Basque
  fa: undefined, // Persian (unsupported)
  fi, // Finnish
  fr, // French
  fy: undefined, // Frisian (unsupported)
  ga: undefined, // Irish (unsupported)
  gd, // Scottish Gaelic
  gl, // Galician
  he: undefined, // Hebrew (unsupported)
  hi, // Hindi
  hr: undefined, // Croatian (unsupported)
  hu, // Hungarian
  hy: undefined, // Armenian (unsupported)
  ia: undefined, // Interlingua (unsupported)
  id, // Indonesian
  is: undefined, // Icelandic (unsupported)
  it, // Italian
  ja, // Japanese
  ka: undefined, // Georgian (unsupported)
  kk: undefined, // Kazakh (unsupported)
  km, // Khmer
  kn: undefined, // Kannada (unsupported)
  ko, // Korean
  krc: undefined, // Karachay-Balkar (unsupported)
  ky: undefined, // Kyrgyz (unsupported)
  lb: undefined, // Luxembourgish (unsupported)
  lo: undefined, // Lao (unsupported)
  lt: undefined, // Lithuanian (unsupported)
  lv: undefined, // Latvian (unsupported)
  mi: undefined, // Maori (unsupported)
  mk: undefined, // Macedonian (unsupported)
  mn: undefined, // Mongolian (unsupported)
  ms: undefined, // Malay (unsupported)
  ne: undefined, // Nepali (unsupported)
  nl, // Dutch
  no: undefined, // Norwegian (unsupported)
  pl, // Polish
  ['pt-BR']: ptBR, // Portuguese (Brazilian)
  ['pt-PT']: undefined, // Portuguese (Portugal) (unsupported)
  ro, // Romanian
  ru, // Russian
  se: undefined, // Northern Sami (unsupported)
  sk: undefined, // Slovak (unsupported)
  sl: undefined, // Slovene (unsupported)
  sq: undefined, // Albanian (unsupported)
  sr: undefined, // Serbian (unsupported)
  sv, // Swedish
  sw: undefined, // Swahili (unsupported)
  ta: undefined, // Tamil (unsupported)
  te: undefined, // Telugu (unsupported)
  tg: undefined, // Tajik (unsupported)
  th, // Thai
  tl: undefined, // Tagalog (unsupported)
  tr, // Turkish
  tt: undefined, // Tatar (unsupported)
  uk, // Ukrainian
  ur: undefined, // Urdu (unsupported)
  uz: undefined, // Uzbek (unsupported)
  vi, // Vietnamese
  xh: undefined, // Xhosa (unsupported)
  yo: undefined, // Yoruba (unsupported)
  yue: undefined, // Cantonese (unsupported)
  ['zh-CN']: zhCN, // Chinese (Simplified)
  ['zh-HK']: zhHK, // Chinese (Hong Kong)
  ['zh-TW']: zhTW, // Chinese (Traditional)
  zu: undefined, // Zulu (unsupported)
}

/**
 * Returns a localized `formatDistance` function.
 * {@link formatDistance}
 */
export function useFormatDistance() {
  const {appLanguage} = useLanguagePrefs()
  return React.useCallback<typeof formatDistance>(
    (date, baseDate, options) => {
      const locale = locales[appLanguage as AppLanguage]
      return formatDistance(date, baseDate, {...options, locale: locale})
    },
    [appLanguage],
  )
}
