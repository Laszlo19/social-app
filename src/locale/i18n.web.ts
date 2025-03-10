import {useEffect} from 'react'
import {i18n} from '@lingui/core'

import {sanitizeAppLanguageSetting} from '#/locale/helpers'
import {AppLanguage} from '#/locale/languages'
import {useLanguagePrefs} from '#/state/preferences'

/**
 * We do a dynamic import of just the catalog that we need
 */
export async function dynamicActivate(locale: AppLanguage) {
  let mod: any

  switch (locale) {
    case AppLanguage.an: {
      mod = await import(`./locales/an/messages`)
      break
    }
    case AppLanguage.ast: {
      mod = await import(`./locales/ast/messages`)
      break
    }
    case AppLanguage.ca: {
      mod = await import(`./locales/ca/messages`)
      break
    }
    case AppLanguage.cy: {
      mod = await import(`./locales/cy/messages`)
      break
    }
    case AppLanguage.da: {
      mod = await import(`./locales/da/messages`)
      break
    }
    case AppLanguage.de: {
      mod = await import(`./locales/de/messages`)
      break
    }
    case AppLanguage.el: {
      mod = await import(`./locales/el/messages`)
      break
    }
    case AppLanguage.en_GB: {
      mod = await import(`./locales/en-GB/messages`)
      break
    }
    case AppLanguage.eo: {
      mod = await import(`./locales/eo/messages`)
      break
    }
    case AppLanguage.es: {
      mod = await import(`./locales/es/messages`)
      break
    }
    case AppLanguage.eu: {
      mod = await import(`./locales/eu/messages`)
      break
    }
    case AppLanguage.fi: {
      mod = await import(`./locales/fi/messages`)
      break
    }
    case AppLanguage.fr: {
      mod = await import(`./locales/fr/messages`)
      break
    }
    case AppLanguage.ga: {
      mod = await import(`./locales/ga/messages`)
      break
    }
    case AppLanguage.gd: {
      mod = await import(`./locales/gd/messages`)
      break
    }
    case AppLanguage.gl: {
      mod = await import(`./locales/gl/messages`)
      break
    }
    case AppLanguage.hi: {
      mod = await import(`./locales/hi/messages`)
      break
    }
    case AppLanguage.hu: {
      mod = await import(`./locales/hu/messages`)
      break
    }
    case AppLanguage.ia: {
      mod = await import(`./locales/ia/messages`)
      break
    }
    case AppLanguage.id: {
      mod = await import(`./locales/id/messages`)
      break
    }
    case AppLanguage.it: {
      mod = await import(`./locales/it/messages`)
      break
    }
    case AppLanguage.ja: {
      mod = await import(`./locales/ja/messages`)
      break
    }
    case AppLanguage.km: {
      mod = await import(`./locales/km/messages`)
      break
    }
    case AppLanguage.ko: {
      mod = await import(`./locales/ko/messages`)
      break
    }
    case AppLanguage.ne: {
      mod = await import(`./locales/ne/messages`)
      break
    }
    case AppLanguage.nl: {
      mod = await import(`./locales/nl/messages`)
      break
    }
    case AppLanguage.pl: {
      mod = await import(`./locales/pl/messages`)
      break
    }
    case AppLanguage.pt_BR: {
      mod = await import(`./locales/pt-BR/messages`)
      break
    }
    case AppLanguage.ro: {
      mod = await import(`./locales/ro/messages`)
      break
    }
    case AppLanguage.ru: {
      mod = await import(`./locales/ru/messages`)
      break
    }
    case AppLanguage.sv: {
      mod = await import(`./locales/sv/messages`)
      break
    }
    case AppLanguage.th: {
      mod = await import(`./locales/th/messages`)
      break
    }
    case AppLanguage.tr: {
      mod = await import(`./locales/tr/messages`)
      break
    }
    case AppLanguage.uk: {
      mod = await import(`./locales/uk/messages`)
      break
    }
    case AppLanguage.vi: {
      mod = await import(`./locales/vi/messages`)
      break
    }
    case AppLanguage.zh_CN: {
      mod = await import(`./locales/zh-CN/messages`)
      break
    }
    case AppLanguage.zh_HK: {
      mod = await import(`./locales/zh-HK/messages`)
      break
    }
    case AppLanguage.zh_TW: {
      mod = await import(`./locales/zh-TW/messages`)
      break
    }
    // New languages
    case AppLanguage.ab: {
      mod = await import(`./locales/ab/messages`)
      break
    }
    case AppLanguage.af: {
      mod = await import(`./locales/af/messages`)
      break
    }
    case AppLanguage.am: {
      mod = await import(`./locales/am/messages`)
      break
    }
    case AppLanguage.ar: {
      mod = await import(`./locales/ar/messages`)
      break
    }
    case AppLanguage.az: {
      mod = await import(`./locales/az/messages`)
      break
    }
    case AppLanguage.bg: {
      mod = await import(`./locales/bg/messages`)
      break
    }
    case AppLanguage.bn: {
      mod = await import(`./locales/bn/messages`)
      break
    }
    case AppLanguage.bs: {
      mod = await import(`./locales/bs/messages`)
      break
    }
    case AppLanguage.co: {
      mod = await import(`./locales/co/messages`)
      break
    }
    case AppLanguage.cs: {
      mod = await import(`./locales/cs/messages`)
      break
    }
    case AppLanguage.et: {
      mod = await import(`./locales/et/messages`)
      break
    }
    case AppLanguage.fa: {
      mod = await import(`./locales/fa/messages`)
      break
    }
    case AppLanguage.fy: {
      mod = await import(`./locales/fy/messages`)
      break
    }
    case AppLanguage.he: {
      mod = await import(`./locales/he/messages`)
      break
    }
    case AppLanguage.hr: {
      mod = await import(`./locales/hr/messages`)
      break
    }
    case AppLanguage.hy: {
      mod = await import(`./locales/hy/messages`)
      break
    }
    case AppLanguage.is: {
      mod = await import(`./locales/is/messages`)
      break
    }
    case AppLanguage.ka: {
      mod = await import(`./locales/ka/messages`)
      break
    }
    case AppLanguage.kk: {
      mod = await import(`./locales/kk/messages`)
      break
    }
    case AppLanguage.kn: {
      mod = await import(`./locales/kn/messages`)
      break
    }
    case AppLanguage.krc: {
      mod = await import(`./locales/krc/messages`)
      break
    }
    case AppLanguage.ky: {
      mod = await import(`./locales/ky/messages`)
      break
    }
    case AppLanguage.lb: {
      mod = await import(`./locales/lb/messages`)
      break
    }
    case AppLanguage.lo: {
      mod = await import(`./locales/lo/messages`)
      break
    }
    case AppLanguage.lt: {
      mod = await import(`./locales/lt/messages`)
      break
    }
    case AppLanguage.lv: {
      mod = await import(`./locales/lv/messages`)
      break
    }
    case AppLanguage.mi: {
      mod = await import(`./locales/mi/messages`)
      break
    }
    case AppLanguage.mk: {
      mod = await import(`./locales/mk/messages`)
      break
    }
    case AppLanguage.mn: {
      mod = await import(`./locales/mn/messages`)
      break
    }
    case AppLanguage.ms: {
      mod = await import(`./locales/ms/messages`)
      break
    }
    case AppLanguage.no: {
      mod = await import(`./locales/no/messages`)
      break
    }
    case AppLanguage.pt_PT: {
      mod = await import(`./locales/pt-PT/messages`)
      break
    }
    case AppLanguage.se: {
      mod = await import(`./locales/se/messages`)
      break
    }
    case AppLanguage.sk: {
      mod = await import(`./locales/sk/messages`)
      break
    }
    case AppLanguage.sl: {
      mod = await import(`./locales/sl/messages`)
      break
    }
    case AppLanguage.sq: {
      mod = await import(`./locales/sq/messages`)
      break
    }
    case AppLanguage.sr: {
      mod = await import(`./locales/sr/messages`)
      break
    }
    case AppLanguage.sw: {
      mod = await import(`./locales/sw/messages`)
      break
    }
    case AppLanguage.ta: {
      mod = await import(`./locales/ta/messages`)
      break
    }
    case AppLanguage.te: {
      mod = await import(`./locales/te/messages`)
      break
    }
    case AppLanguage.tg: {
      mod = await import(`./locales/tg/messages`)
      break
    }
    case AppLanguage.tl: {
      mod = await import(`./locales/tl/messages`)
      break
    }
    case AppLanguage.tt: {
      mod = await import(`./locales/tt/messages`)
      break
    }
    case AppLanguage.ur: {
      mod = await import(`./locales/ur/messages`)
      break
    }
    case AppLanguage.uz: {
      mod = await import(`./locales/uz/messages`)
      break
    }
    case AppLanguage.xh: {
      mod = await import(`./locales/xh/messages`)
      break
    }
    case AppLanguage.yo: {
      mod = await import(`./locales/yo/messages`)
      break
    }
    case AppLanguage.yue: {
      mod = await import(`./locales/yue/messages`)
      break
    }
    case AppLanguage.zu: {
      mod = await import(`./locales/zu/messages`)
      break
    }
    default: {
      mod = await import(`./locales/en/messages`)
      break
    }
  }

  i18n.load(locale, mod.messages)
  i18n.activate(locale)
}

export async function useLocaleLanguage() {
  const {appLanguage} = useLanguagePrefs()
  useEffect(() => {
    const sanitizedLanguage = sanitizeAppLanguageSetting(appLanguage)

    document.documentElement.lang = sanitizedLanguage
    dynamicActivate(sanitizedLanguage)
  }, [appLanguage])
}
