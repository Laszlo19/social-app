/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: [
    'ab',       // Abkhaz
    'af',       // Afrikaans
    'am',       // Amharic
    'an',       // Aragonese
    'ar',       // Arabic
    'ast',      // Asturian
    'az',       // Azerbaijani
    'bg',       // Bulgarian
    'bn',       // Bengali
    'bs',       // Bosnian
    'ca',       // Catalan
    'co',       // Corsican
    'cs',       // Czech
    'cy',       // Welsh
    'da',       // Danish
    'de',       // German
    'el',       // Greek
    'en',       // English
    'en-GB',    // English (British)
    'eo',       // Esperanto
    'es',       // Spanish
    'et',       // Estonian
    'eu',       // Basque
    'fa',       // Persian
    'fi',       // Finnish
    'fr',       // French
    'fy',       // Frisian
    'ga',       // Irish
    'gd',       // Scottish Gaelic
    'gl',       // Galician
    'he',       // Hebrew
    'hi',       // Hindi
    'hr',       // Croatian
    'hu',       // Hungarian
    'hy',       // Armenian
    'ia',       // Interlingua
    'id',       // Indonesian
    'is',       // Icelandic
    'it',       // Italian
    'ja',       // Japanese
    'ka',       // Georgian
    'kk',       // Kazakh
    'km',       // Khmer
    'kn',       // Kannada
    'ko',       // Korean
    'krc',      // Karachay-Balkar
    'ky',       // Kyrgyz
    'lb',       // Luxembourgish
    'lo',       // Lao
    'lt',       // Lithuanian
    'lv',       // Latvian
    'mi',       // Maori
    'mk',       // Macedonian
    'mn',       // Mongolian
    'ms',       // Malay
    'ne',       // Nepali
    'nl',       // Dutch
    'no',       // Norwegian
    'pl',       // Polish
    'pt-BR',    // Portuguese (Brazilian)
    'pt-PT',    // Portuguese (Portugal)
    'ro',       // Romanian
    'ru',       // Russian
    'se',       // Northern Sami
    'sk',       // Slovak
    'sl',       // Slovene
    'sq',       // Albanian
    'sr',       // Serbian
    'sv',       // Swedish
    'sw',       // Swahili
    'ta',       // Tamil
    'te',       // Telugu
    'tg',       // Tajik
    'th',       // Thai
    'tl',       // Tagalog
    'tr',       // Turkish
    'tt',       // Tatar
    'uk',       // Ukrainian
    'ur',       // Urdu
    'uz',       // Uzbek
    'vi',       // Vietnamese
    'xh',       // Xhosa
    'yo',       // Yoruba
    'yue',      // Cantonese
    'zh-CN',    // Chinese (Simplified)
    'zh-HK',    // Chinese (Hong Kong)
    'zh-TW',    // Chinese (Traditional)
    'zu',       // Zulu
  ],
  catalogs: [
    {
      path: '<rootDir>/src/locale/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'po',
};
