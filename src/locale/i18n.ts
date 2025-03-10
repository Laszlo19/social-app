// Don't remove -force from these because detection is VERY slow on low-end Android.
// https://github.com/formatjs/formatjs/issues/4463#issuecomment-2176070577
import '@formatjs/intl-locale/polyfill-force'
import '@formatjs/intl-pluralrules/polyfill-force'
import '@formatjs/intl-numberformat/polyfill-force'
import '@formatjs/intl-pluralrules/locale-data/en'
import '@formatjs/intl-numberformat/locale-data/en'

import {useEffect} from 'react'
import {i18n} from '@lingui/core'

import {sanitizeAppLanguageSetting} from '#/locale/helpers'
import {AppLanguage} from '#/locale/languages'
import {messages as messagesAn} from '#/locale/locales/an/messages'
import {messages as messagesAst} from '#/locale/locales/ast/messages'
import {messages as messagesCa} from '#/locale/locales/ca/messages'
import {messages as messagesCy} from '#/locale/locales/cy/messages'
import {messages as messagesDa} from '#/locale/locales/da/messages'
import {messages as messagesDe} from '#/locale/locales/de/messages'
import {messages as messagesEl} from '#/locale/locales/el/messages'
import {messages as messagesEn} from '#/locale/locales/en/messages'
import {messages as messagesEn_GB} from '#/locale/locales/en-GB/messages'
import {messages as messagesEo} from '#/locale/locales/eo/messages'
import {messages as messagesEs} from '#/locale/locales/es/messages'
import {messages as messagesEu} from '#/locale/locales/eu/messages'
import {messages as messagesFi} from '#/locale/locales/fi/messages'
import {messages as messagesFr} from '#/locale/locales/fr/messages'
import {messages as messagesGa} from '#/locale/locales/ga/messages'
import {messages as messagesGd} from '#/locale/locales/gd/messages'
import {messages as messagesGl} from '#/locale/locales/gl/messages'
import {messages as messagesHi} from '#/locale/locales/hi/messages'
import {messages as messagesHu} from '#/locale/locales/hu/messages'
import {messages as messagesIa} from '#/locale/locales/ia/messages'
import {messages as messagesId} from '#/locale/locales/id/messages'
import {messages as messagesIt} from '#/locale/locales/it/messages'
import {messages as messagesJa} from '#/locale/locales/ja/messages'
import {messages as messagesKm} from '#/locale/locales/km/messages'
import {messages as messagesKo} from '#/locale/locales/ko/messages'
import {messages as messagesNe} from '#/locale/locales/ne/messages'
import {messages as messagesNl} from '#/locale/locales/nl/messages'
import {messages as messagesPl} from '#/locale/locales/pl/messages'
import {messages as messagesPt_BR} from '#/locale/locales/pt-BR/messages'
import {messages as messagesRo} from '#/locale/locales/ro/messages'
import {messages as messagesRu} from '#/locale/locales/ru/messages'
import {messages as messagesSv} from '#/locale/locales/sv/messages'
import {messages as messagesTh} from '#/locale/locales/th/messages'
import {messages as messagesTr} from '#/locale/locales/tr/messages'
import {messages as messagesUk} from '#/locale/locales/uk/messages'
import {messages as messagesVi} from '#/locale/locales/vi/messages'
import {messages as messagesZh_CN} from '#/locale/locales/zh-CN/messages'
import {messages as messagesZh_HK} from '#/locale/locales/zh-HK/messages'
import {messages as messagesZh_TW} from '#/locale/locales/zh-TW/messages'

// New language imports
import {messages as messagesAb} from '#/locale/locales/ab/messages'
import {messages as messagesAf} from '#/locale/locales/af/messages'
import {messages as messagesAm} from '#/locale/locales/am/messages'
import {messages as messagesAr} from '#/locale/locales/ar/messages'
import {messages as messagesAz} from '#/locale/locales/az/messages'
import {messages as messagesBg} from '#/locale/locales/bg/messages'
import {messages as messagesBn} from '#/locale/locales/bn/messages'
import {messages as messagesBs} from '#/locale/locales/bs/messages'
import {messages as messagesCo} from '#/locale/locales/co/messages'
import {messages as messagesCs} from '#/locale/locales/cs/messages'
import {messages as messagesEt} from '#/locale/locales/et/messages'
import {messages as messagesFa} from '#/locale/locales/fa/messages'
import {messages as messagesFy} from '#/locale/locales/fy/messages'
import {messages as messagesHe} from '#/locale/locales/he/messages'
import {messages as messagesHr} from '#/locale/locales/hr/messages'
import {messages as messagesHy} from '#/locale/locales/hy/messages'
import {messages as messagesIs} from '#/locale/locales/is/messages'
import {messages as messagesKa} from '#/locale/locales/ka/messages'
import {messages as messagesKk} from '#/locale/locales/kk/messages'
import {messages as messagesKn} from '#/locale/locales/kn/messages'
import {messages as messagesKrc} from '#/locale/locales/krc/messages'
import {messages as messagesKy} from '#/locale/locales/ky/messages'
import {messages as messagesLb} from '#/locale/locales/lb/messages'
import {messages as messagesLo} from '#/locale/locales/lo/messages'
import {messages as messagesLt} from '#/locale/locales/lt/messages'
import {messages as messagesLv} from '#/locale/locales/lv/messages'
import {messages as messagesMi} from '#/locale/locales/mi/messages'
import {messages as messagesMk} from '#/locale/locales/mk/messages'
import {messages as messagesMn} from '#/locale/locales/mn/messages'
import {messages as messagesMs} from '#/locale/locales/ms/messages'
import {messages as messagesNo} from '#/locale/locales/no/messages'
import {messages as messagesPt_PT} from '#/locale/locales/pt-PT/messages'
import {messages as messagesSe} from '#/locale/locales/se/messages'
import {messages as messagesSk} from '#/locale/locales/sk/messages'
import {messages as messagesSl} from '#/locale/locales/sl/messages'
import {messages as messagesSq} from '#/locale/locales/sq/messages'
import {messages as messagesSr} from '#/locale/locales/sr/messages'
import {messages as messagesSw} from '#/locale/locales/sw/messages'
import {messages as messagesTa} from '#/locale/locales/ta/messages'
import {messages as messagesTe} from '#/locale/locales/te/messages'
import {messages as messagesTg} from '#/locale/locales/tg/messages'
import {messages as messagesTl} from '#/locale/locales/tl/messages'
import {messages as messagesTt} from '#/locale/locales/tt/messages'
import {messages as messagesUr} from '#/locale/locales/ur/messages'
import {messages as messagesUz} from '#/locale/locales/uz/messages'
import {messages as messagesXh} from '#/locale/locales/xh/messages'
import {messages as messagesYo} from '#/locale/locales/yo/messages'
import {messages as messagesYue} from '#/locale/locales/yue/messages'
import {messages as messagesZu} from '#/locale/locales/zu/messages'

import {useLanguagePrefs} from '#/state/preferences'

/**
 * We do a dynamic import of just the catalog that we need
 */
export async function dynamicActivate(locale: AppLanguage) {
  switch (locale) {
    case AppLanguage.an: {
      i18n.loadAndActivate({locale, messages: messagesAn})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/an'),
        import('@formatjs/intl-numberformat/locale-data/es'),
      ])
      break
    }
    case AppLanguage.ast: {
      i18n.loadAndActivate({locale, messages: messagesAst})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/ast'),
        import('@formatjs/intl-numberformat/locale-data/ast'),
      ])
      break
    }
    case AppLanguage.ca: {
      i18n.loadAndActivate({locale, messages: messagesCa})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/ca'),
        import('@formatjs/intl-numberformat/locale-data/ca'),
      ])
      break
    }
    case AppLanguage.cy: {
      i18n.loadAndActivate({locale, messages: messagesCy})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/cy'),
        import('@formatjs/intl-numberformat/locale-data/cy'),
      ])
      break
    }
    case AppLanguage.da: {
      i18n.loadAndActivate({locale, messages: messagesDa})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/da'),
        import('@formatjs/intl-numberformat/locale-data/da'),
      ])
      break
    }
    case AppLanguage.de: {
      i18n.loadAndActivate({locale, messages: messagesDe})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/de'),
        import('@formatjs/intl-numberformat/locale-data/de'),
      ])
      break
    }
    case AppLanguage.el: {
      i18n.loadAndActivate({locale, messages: messagesEl})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/el'),
        import('@formatjs/intl-numberformat/locale-data/el'),
      ])
      break
    }
    case AppLanguage.en_GB: {
      i18n.loadAndActivate({locale, messages: messagesEn_GB})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/en'),
        import('@formatjs/intl-numberformat/locale-data/en-GB'),
      ])
      break
    }
    case AppLanguage.eo: {
      i18n.loadAndActivate({locale, messages: messagesEo})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/eo'),
        import('@formatjs/intl-numberformat/locale-data/eo'),
      ])
      break
    }
    case AppLanguage.es: {
      i18n.loadAndActivate({locale, messages: messagesEs})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/es'),
        import('@formatjs/intl-numberformat/locale-data/es'),
      ])
      break
    }
    case AppLanguage.eu: {
      i18n.loadAndActivate({locale, messages: messagesEu})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/eu'),
        import('@formatjs/intl-numberformat/locale-data/eu'),
      ])
      break
    }
    case AppLanguage.fi: {
      i18n.loadAndActivate({locale, messages: messagesFi})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/fi'),
        import('@formatjs/intl-numberformat/locale-data/fi'),
      ])
      break
    }
    case AppLanguage.fr: {
      i18n.loadAndActivate({locale, messages: messagesFr})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/fr'),
        import('@formatjs/intl-numberformat/locale-data/fr'),
      ])
      break
    }
    case AppLanguage.ga: {
      i18n.loadAndActivate({locale, messages: messagesGa})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/ga'),
        import('@formatjs/intl-numberformat/locale-data/ga'),
      ])
      break
    }
    case AppLanguage.gd: {
      i18n.loadAndActivate({locale, messages: messagesGd})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/gd'),
        import('@formatjs/intl-numberformat/locale-data/gd'),
      ])
      break
    }
    case AppLanguage.gl: {
      i18n.loadAndActivate({locale, messages: messagesGl})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/gl'),
        import('@formatjs/intl-numberformat/locale-data/gl'),
      ])
      break
    }
    case AppLanguage.hi: {
      i18n.loadAndActivate({locale, messages: messagesHi})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/hi'),
        import('@formatjs/intl-numberformat/locale-data/hi'),
      ])
      break
    }
    case AppLanguage.hu: {
      i18n.loadAndActivate({locale, messages: messagesHu})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/hu'),
        import('@formatjs/intl-numberformat/locale-data/hu'),
      ])
      break
    }
    case AppLanguage.ia: {
      i18n.loadAndActivate({locale, messages: messagesIa})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/ia'),
        import('@formatjs/intl-numberformat/locale-data/ia'),
      ])
      break
    }
    case AppLanguage.id: {
      i18n.loadAndActivate({locale, messages: messagesId})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/id'),
        import('@formatjs/intl-numberformat/locale-data/id'),
      ])
      break
    }
    case AppLanguage.it: {
      i18n.loadAndActivate({locale, messages: messagesIt})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/it'),
        import('@formatjs/intl-numberformat/locale-data/it'),
      ])
      break
    }
    case AppLanguage.ja: {
      i18n.loadAndActivate({locale, messages: messagesJa})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/ja'),
        import('@formatjs/intl-numberformat/locale-data/ja'),
      ])
      break
    }
    case AppLanguage.km: {
      i18n.loadAndActivate({locale, messages: messagesKm})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/km'),
        import('@formatjs/intl-numberformat/locale-data/km'),
      ])
      break
    }
    case AppLanguage.ko: {
      i18n.loadAndActivate({locale, messages: messagesKo})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/ko'),
        import('@formatjs/intl-numberformat/locale-data/ko'),
      ])
      break
    }
    case AppLanguage.ne: {
      i18n.loadAndActivate({locale, messages: messagesNe})
      break
    }
    case AppLanguage.nl: {
      i18n.loadAndActivate({locale, messages: messagesNl})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/nl'),
        import('@formatjs/intl-numberformat/locale-data/nl'),
      ])
      break
    }
    case AppLanguage.pl: {
      i18n.loadAndActivate({locale, messages: messagesPl})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/pl'),
        import('@formatjs/intl-numberformat/locale-data/pl'),
      ])
      break
    }
    case AppLanguage.pt_BR: {
      i18n.loadAndActivate({locale, messages: messagesPt_BR})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/pt'),
        import('@formatjs/intl-numberformat/locale-data/pt'),
      ])
      break
    }
    case AppLanguage.ro: {
      i18n.loadAndActivate({locale, messages: messagesRo})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/ro'),
        import('@formatjs/intl-numberformat/locale-data/ro'),
      ])
      break
    }
    case AppLanguage.ru: {
      i18n.loadAndActivate({locale, messages: messagesRu})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/ru'),
        import('@formatjs/intl-numberformat/locale-data/ru'),
      ])
      break
    }
    case AppLanguage.sv: {
      i18n.loadAndActivate({locale, messages: messagesSv})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/sv'),
        import('@formatjs/intl-numberformat/locale-data/sv'),
      ])
      break
    }
    case AppLanguage.th: {
      i18n.loadAndActivate({locale, messages: messagesTh})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/th'),
        import('@formatjs/intl-numberformat/locale-data/th'),
      ])
      break
    }
    case AppLanguage.tr: {
      i18n.loadAndActivate({locale, messages: messagesTr})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/tr'),
        import('@formatjs/intl-numberformat/locale-data/tr'),
      ])
      break
    }
    case AppLanguage.uk: {
      i18n.loadAndActivate({locale, messages: messagesUk})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/uk'),
        import('@formatjs/intl-numberformat/locale-data/uk'),
      ])
      break
    }
    case AppLanguage.vi: {
      i18n.loadAndActivate({locale, messages: messagesVi})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/vi'),
        import('@formatjs/intl-numberformat/locale-data/vi'),
      ])
      break
    }
    case AppLanguage.zh_CN: {
      i18n.loadAndActivate({locale, messages: messagesZh_CN})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/zh'),
        import('@formatjs/intl-numberformat/locale-data/zh'),
      ])
      break
    }
    case AppLanguage.zh_HK: {
      i18n.loadAndActivate({locale, messages: messagesZh_HK})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/zh'),
        import('@formatjs/intl-numberformat/locale-data/zh'),
      ])
      break
    }
    case AppLanguage.zh_TW: {
      i18n.loadAndActivate({locale, messages: messagesZh_TW})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/zh'),
        import('@formatjs/intl-numberformat/locale-data/zh'),
      ])
      break
    }
    // New languages
    case AppLanguage.ab: {
      i18n.loadAndActivate({locale, messages: messagesAb})
      break
    }
    case AppLanguage.af: {
      i18n.loadAndActivate({locale, messages: messagesAf})
      break
    }
    case AppLanguage.am: {
      i18n.loadAndActivate({locale, messages: messagesAm})
      break
    }
    case AppLanguage.ar: {
      i18n.loadAndActivate({locale, messages: messagesAr})
      break
    }
    case AppLanguage.az: {
      i18n.loadAndActivate({locale, messages: messagesAz})
      break
    }
    case AppLanguage.bg: {
      i18n.loadAndActivate({locale, messages: messagesBg})
      break
    }
    case AppLanguage.bn: {
      i18n.loadAndActivate({locale, messages: messagesBn})
      break
    }
    case AppLanguage.bs: {
      i18n.loadAndActivate({locale, messages: messagesBs})
      break
    }
    case AppLanguage.co: {
      i18n.loadAndActivate({locale, messages: messagesCo})
      break
    }
    case AppLanguage.cs: {
      i18n.loadAndActivate({locale, messages: messagesCs})
      break
    }
    case AppLanguage.et: {
      i18n.loadAndActivate({locale, messages: messagesEt})
      break
    }
    case AppLanguage.fa: {
      i18n.loadAndActivate({locale, messages: messagesFa})
      break
    }
    case AppLanguage.fy: {
      i18n.loadAndActivate({locale, messages: messagesFy})
      break
    }
    case AppLanguage.he: {
      i18n.loadAndActivate({locale, messages: messagesHe})
      break
    }
    case AppLanguage.hr: {
      i18n.loadAndActivate({locale, messages: messagesHr})
      break
    }
    case AppLanguage.hy: {
      i18n.loadAndActivate({locale, messages: messagesHy})
      break
    }
    case AppLanguage.is: {
      i18n.loadAndActivate({locale, messages: messagesIs})
      break
    }
    case AppLanguage.ka: {
      i18n.loadAndActivate({locale, messages: messagesKa})
      break
    }
    case AppLanguage.kk: {
      i18n.loadAndActivate({locale, messages: messagesKk})
      break
    }
    case AppLanguage.kn: {
      i18n.loadAndActivate({locale, messages: messagesKn})
      break
    }
    case AppLanguage.krc: {
      i18n.loadAndActivate({locale, messages: messagesKrc})
      break
    }
    case AppLanguage.ky: {
      i18n.loadAndActivate({locale, messages: messagesKy})
      break
    }
    case AppLanguage.lb: {
      i18n.loadAndActivate({locale, messages: messagesLb})
      break
    }
    case AppLanguage.lo: {
      i18n.loadAndActivate({locale, messages: messagesLo})
      break
    }
    case AppLanguage.lt: {
      i18n.loadAndActivate({locale, messages: messagesLt})
      break
    }
    case AppLanguage.lv: {
      i18n.loadAndActivate({locale, messages: messagesLv})
      break
    }
    case AppLanguage.mi: {
      i18n.loadAndActivate({locale, messages: messagesMi})
      break
    }
    case AppLanguage.mk: {
      i18n.loadAndActivate({locale, messages: messagesMk})
      break
    }
    case AppLanguage.mn: {
      i18n.loadAndActivate({locale, messages: messagesMn})
      break
    }
    case AppLanguage.ms: {
      i18n.loadAndActivate({locale, messages: messagesMs})
      break
    }
    case AppLanguage.no: {
      i18n.loadAndActivate({locale, messages: messagesNo})
      break
    }
    case AppLanguage.pt_PT: {
      i18n.loadAndActivate({locale, messages: messagesPt_PT})
      break
    }
    case AppLanguage.se: {
      i18n.loadAndActivate({locale, messages: messagesSe})
      break
    }
    case AppLanguage.sk: {
      i18n.loadAndActivate({locale, messages: messagesSk})
      break
    }
    case AppLanguage.sl: {
      i18n.loadAndActivate({locale, messages: messagesSl})
      break
    }
    case AppLanguage.sq: {
      i18n.loadAndActivate({locale, messages: messagesSq})
      break
    }
    case AppLanguage.sr: {
      i18n.loadAndActivate({locale, messages: messagesSr})
      break
    }
    case AppLanguage.sw: {
      i18n.loadAndActivate({locale, messages: messagesSw})
      break
    }
    case AppLanguage.ta: {
      i18n.loadAndActivate({locale, messages: messagesTa})
      break
    }
    case AppLanguage.te: {
      i18n.loadAndActivate({locale, messages: messagesTe})
      break
    }
    case AppLanguage.tg: {
      i18n.loadAndActivate({locale, messages: messagesTg})
      break
    }
    case AppLanguage.tl: {
      i18n.loadAndActivate({locale, messages: messagesTl})
      break
    }
    case AppLanguage.tt: {
      i18n.loadAndActivate({locale, messages: messagesTt})
      break
    }
    case AppLanguage.ur: {
      i18n.loadAndActivate({locale, messages: messagesUr})
      break
    }
    case AppLanguage.uz: {
      i18n.loadAndActivate({locale, messages: messagesUz})
      break
    }
    case AppLanguage.xh: {
      i18n.loadAndActivate({locale, messages: messagesXh})
      break
    }
    case AppLanguage.yo: {
      i18n.loadAndActivate({locale, messages: messagesYo})
      break
    }
    case AppLanguage.yue: {
      i18n.loadAndActivate({locale, messages: messagesYue})
      break
    }
    case AppLanguage.zu: {
      i18n.loadAndActivate({locale, messages: messagesZu})
      break
    }
    default: {
      i18n.loadAndActivate({locale, messages: messagesEn})
      break
    }
  }
}

export function useLocaleLanguage() {
  const {appLanguage} = useLanguagePrefs()
  useEffect(() => {
    dynamicActivate(sanitizeAppLanguageSetting(appLanguage))
  }, [appLanguage])
}
