import {useEffect, useState} from 'react'
import {i18n, type Messages} from '@lingui/core'
import {type Locale} from 'date-fns/locale'
import {enUS as defaultLocale} from 'date-fns/locale/en-US'

import {sanitizeAppLanguageSetting} from '#/locale/helpers'
import {AppLanguage} from '#/locale/languages'
import {useLanguagePrefs} from '#/state/preferences'

/**
 * We do a dynamic import of just the catalog that we need
 */
export async function dynamicActivate(locale: AppLanguage) {
  let messages: Messages
  let dateLocale: Locale = defaultLocale

  switch (locale) {
    case AppLanguage.an: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/an/messages`).then(m => m.messages),
        import('date-fns/locale/es').then(m => m.es),
      ])
      break
    }
    case AppLanguage.ast: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/ast/messages`).then(m => m.messages),
        import('date-fns/locale/es').then(m => m.es),
      ])
      break
    }
    case AppLanguage.ca: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/ca/messages`).then(m => m.messages),
        import('date-fns/locale/ca').then(m => m.ca),
      ])
      break
    }
    case AppLanguage.cs: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/cs/messages`).then(m => m.messages),
        import('date-fns/locale/cs').then(m => m.cs),
      ])
      break
    }
    case AppLanguage.cy: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/cy/messages`).then(m => m.messages),
        import('date-fns/locale/cy').then(m => m.cy),
      ])
      break
    }
    case AppLanguage.da: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/da/messages`).then(m => m.messages),
        import('date-fns/locale/da').then(m => m.da),
      ])
      break
    }
    case AppLanguage.de: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/de/messages`).then(m => m.messages),
        import('date-fns/locale/de').then(m => m.de),
      ])
      break
    }
    case AppLanguage.el: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/el/messages`).then(m => m.messages),
        import('date-fns/locale/el').then(m => m.el),
      ])
      break
    }
    case AppLanguage.en_GB: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/en-GB/messages`).then(m => m.messages),
        import('date-fns/locale/en-GB').then(m => m.enGB),
      ])
      break
    }
    case AppLanguage.eo: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/eo/messages`).then(m => m.messages),
        import('date-fns/locale/eo').then(m => m.eo),
      ])
      break
    }
    case AppLanguage.es: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/es/messages`).then(m => m.messages),
        import('date-fns/locale/es').then(m => m.es),
      ])
      break
    }
    case AppLanguage.eu: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/eu/messages`).then(m => m.messages),
        import('date-fns/locale/eu').then(m => m.eu),
      ])
      break
    }
    case AppLanguage.fi: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/fi/messages`).then(m => m.messages),
        import('date-fns/locale/fi').then(m => m.fi),
      ])
      break
    }
    case AppLanguage.fr: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/fr/messages`).then(m => m.messages),
        import('date-fns/locale/fr').then(m => m.fr),
      ])
      break
    }
    case AppLanguage.fy: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/fy/messages`).then(m => m.messages),
        import('date-fns/locale/fy').then(m => m.fy),
      ])
      break
    }
    case AppLanguage.ga: {
      messages = await import(`./locales/ga/messages`).then(m => m.messages)
      break
    }
    case AppLanguage.gd: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/gd/messages`).then(m => m.messages),
        import('date-fns/locale/gd').then(m => m.gd),
      ])
      break
    }
    case AppLanguage.gl: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/gl/messages`).then(m => m.messages),
        import('date-fns/locale/gl').then(m => m.gl),
      ])
      break
    }
    case AppLanguage.hi: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/hi/messages`).then(m => m.messages),
        import('date-fns/locale/hi').then(m => m.hi),
      ])
      break
    }
    case AppLanguage.hu: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/hu/messages`).then(m => m.messages),
        import('date-fns/locale/hu').then(m => m.hu),
      ])
      break
    }
    case AppLanguage.ia: {
      messages = await import(`./locales/ia/messages`).then(m => m.messages)
      break
    }
    case AppLanguage.id: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/id/messages`).then(m => m.messages),
        import('date-fns/locale/id').then(m => m.id),
      ])
      break
    }
    case AppLanguage.it: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/it/messages`).then(m => m.messages),
        import('date-fns/locale/it').then(m => m.it),
      ])
      break
    }
    case AppLanguage.ja: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/ja/messages`).then(m => m.messages),
        import('date-fns/locale/ja').then(m => m.ja),
      ])
      break
    }
    case AppLanguage.km: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/km/messages`).then(m => m.messages),
        import('date-fns/locale/km').then(m => m.km),
      ])
      break
    }
    case AppLanguage.ko: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/ko/messages`).then(m => m.messages),
        import('date-fns/locale/ko').then(m => m.ko),
      ])
      break
    }
    case AppLanguage.ne: {
      messages = await import(`./locales/ne/messages`).then(m => m.messages)
      break
    }
    case AppLanguage.nl: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/nl/messages`).then(m => m.messages),
        import('date-fns/locale/nl').then(m => m.nl),
      ])
      break
    }
    case AppLanguage.pl: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/pl/messages`).then(m => m.messages),
        import('date-fns/locale/pl').then(m => m.pl),
      ])
      break
    }
    case AppLanguage.pt_BR: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/pt-BR/messages`).then(m => m.messages),
        import('date-fns/locale/pt-BR').then(m => m.ptBR),
      ])
      break
    }
    case AppLanguage.pt_PT: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/pt-PT/messages`).then(m => m.messages),
        import('date-fns/locale/pt').then(m => m.pt),
      ])
      break
    }
    case AppLanguage.ro: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/ro/messages`).then(m => m.messages),
        import('date-fns/locale/ro').then(m => m.ro),
      ])
      break
    }
    case AppLanguage.ru: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/ru/messages`).then(m => m.messages),
        import('date-fns/locale/ru').then(m => m.ru),
      ])
      break
    }
    case AppLanguage.sv: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/sv/messages`).then(m => m.messages),
        import('date-fns/locale/sv').then(m => m.sv),
      ])
      break
    }
    case AppLanguage.th: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/th/messages`).then(m => m.messages),
        import('date-fns/locale/th').then(m => m.th),
      ])
      break
    }
    case AppLanguage.tr: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/tr/messages`).then(m => m.messages),
        import('date-fns/locale/tr').then(m => m.tr),
      ])
      break
    }
    case AppLanguage.uk: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/uk/messages`).then(m => m.messages),
        import('date-fns/locale/uk').then(m => m.uk),
      ])
      break
    }
    case AppLanguage.vi: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/vi/messages`).then(m => m.messages),
        import('date-fns/locale/vi').then(m => m.vi),
      ])
      break
    }
    case AppLanguage.zh_CN: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/zh-CN/messages`).then(m => m.messages),
        import('date-fns/locale/zh-CN').then(m => m.zhCN),
      ])
      break
    }
    case AppLanguage.zh_HK: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/zh-HK/messages`).then(m => m.messages),
        import('date-fns/locale/zh-HK').then(m => m.zhHK),
      ])
      break
    }
    case AppLanguage.zh_TW: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/zh-TW/messages`).then(m => m.messages),
        import('date-fns/locale/zh-TW').then(m => m.zhTW),
      ])
      break
    }
    case AppLanguage.en_CA: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/en-CA/messages`).then(m => m.messages),
        import('date-fns/locale/en-CA').then(m => m.enCA),
      ])
      break
    }
    case AppLanguage.fr_CA: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/fr-CA/messages`).then(m => m.messages),
        import('date-fns/locale/fr-CA').then(m => m.frCA),
      ])
      break
    }
    case AppLanguage.ar: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/ar/messages`).then(m => m.messages),
        import('date-fns/locale/ar').then(m => m.ar),
      ])
      break
    }
    case AppLanguage.az: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/az/messages`).then(m => m.messages),
        import('date-fns/locale/az').then(m => m.az),
      ])
      break
    }
    case AppLanguage.bn: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/bn/messages`).then(m => m.messages),
        import('date-fns/locale/bn').then(m => m.bn),
      ])
      break
    }
    case AppLanguage.br: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/br/messages`).then(m => m.messages),
        import('date-fns/locale/fr').then(m => m.fr),
      ])
      break
    }
    case AppLanguage.haw: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/haw/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.kab: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/kab/messages`).then(m => m.messages),
        import('date-fns/locale/fr').then(m => m.fr),
      ])
      break
    }
    case AppLanguage.kw: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/kw/messages`).then(m => m.messages),
        import('date-fns/locale/en-GB').then(m => m.enGB),
      ])
      break
    }
    case AppLanguage.lt: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/lt/messages`).then(m => m.messages),
        import('date-fns/locale/lt').then(m => m.lt),
      ])
      break
    }
    case AppLanguage.lv: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/lv/messages`).then(m => m.messages),
        import('date-fns/locale/lv').then(m => m.lv),
      ])
      break
    }
    case AppLanguage.af: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/af/messages`).then(m => m.messages),
        import('date-fns/locale/af').then(m => m.af),
      ])
      break
    }
    case AppLanguage.be: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/be/messages`).then(m => m.messages),
        import('date-fns/locale/be').then(m => m.be),
      ])
      break
    }
    case AppLanguage.bg: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/bg/messages`).then(m => m.messages),
        import('date-fns/locale/bg').then(m => m.bg),
      ])
      break
    }
    case AppLanguage.bs: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/bs/messages`).then(m => m.messages),
        import('date-fns/locale/bs').then(m => m.bs),
      ])
      break
    }
    case AppLanguage.ckb: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/ckb/messages`).then(m => m.messages),
        import('date-fns/locale/ckb').then(m => m.ckb),
      ])
      break
    }
    case AppLanguage.co: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/co/messages`).then(m => m.messages),
        import('date-fns/locale/fr').then(m => m.fr),
      ])
      break
    }
    case AppLanguage.es_AR: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/es-AR/messages`).then(m => m.messages),
        import('date-fns/locale/es').then(m => m.es),
      ])
      break
    }
    case AppLanguage.es_MX: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/es-MX/messages`).then(m => m.messages),
        import('date-fns/locale/es').then(m => m.es),
      ])
      break
    }
    case AppLanguage.et: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/et/messages`).then(m => m.messages),
        import('date-fns/locale/et').then(m => m.et),
      ])
      break
    }
    case AppLanguage.fa: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/fa/messages`).then(m => m.messages),
        import('date-fns/locale/fa-IR').then(m => m.faIR),
      ])
      break
    }
    case AppLanguage.fil: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/fil/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.fo: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/fo/messages`).then(m => m.messages),
        import('date-fns/locale/da').then(m => m.da),
      ])
      break
    }
    case AppLanguage.he: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/he/messages`).then(m => m.messages),
        import('date-fns/locale/he').then(m => m.he),
      ])
      break
    }
    case AppLanguage.hr: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/hr/messages`).then(m => m.messages),
        import('date-fns/locale/hr').then(m => m.hr),
      ])
      break
    }
    case AppLanguage.hy: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/hy/messages`).then(m => m.messages),
        import('date-fns/locale/hy').then(m => m.hy),
      ])
      break
    }
    case AppLanguage.ie: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/ie/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.ig: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/ig/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.io: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/io/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.is: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/is/messages`).then(m => m.messages),
        import('date-fns/locale/is').then(m => m.is),
      ])
      break
    }
    case AppLanguage.ka: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/ka/messages`).then(m => m.messages),
        import('date-fns/locale/ka').then(m => m.ka),
      ])
      break
    }
    case AppLanguage.kk: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/kk/messages`).then(m => m.messages),
        import('date-fns/locale/kk').then(m => m.kk),
      ])
      break
    }
    case AppLanguage.kn: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/kn/messages`).then(m => m.messages),
        import('date-fns/locale/kn').then(m => m.kn),
      ])
      break
    }
    case AppLanguage.ku: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/ku/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.la: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/la/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.lad: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/lad/messages`).then(m => m.messages),
        import('date-fns/locale/es').then(m => m.es),
      ])
      break
    }
    case AppLanguage.mk: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/mk/messages`).then(m => m.messages),
        import('date-fns/locale/mk').then(m => m.mk),
      ])
      break
    }
    case AppLanguage.ml: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/ml/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.mr: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/mr/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.ms: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/ms/messages`).then(m => m.messages),
        import('date-fns/locale/ms').then(m => m.ms),
      ])
      break
    }
    case AppLanguage.my: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/my/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.nan_TW: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/nan-TW/messages`).then(m => m.messages),
        import('date-fns/locale/zh-TW').then(m => m.zhTW),
      ])
      break
    }
    case AppLanguage.nn: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/nn/messages`).then(m => m.messages),
        import('date-fns/locale/nn').then(m => m.nn),
      ])
      break
    }
    case AppLanguage.no: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/no/messages`).then(m => m.messages),
        import('date-fns/locale/nb').then(m => m.nb),
      ])
      break
    }
    case AppLanguage.oc: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/oc/messages`).then(m => m.messages),
        import('date-fns/locale/oc').then(m => m.oc),
      ])
      break
    }
    case AppLanguage.pa: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/pa/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.ry: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/ry/messages`).then(m => m.messages),
        import('date-fns/locale/uk').then(m => m.uk),
      ])
      break
    }
    case AppLanguage.sa: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/sa/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.sc: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/sc/messages`).then(m => m.messages),
        import('date-fns/locale/it').then(m => m.it),
      ])
      break
    }
    case AppLanguage.sco: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/sco/messages`).then(m => m.messages),
        import('date-fns/locale/en-GB').then(m => m.enGB),
      ])
      break
    }
    case AppLanguage.si: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/si/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.sk: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/sk/messages`).then(m => m.messages),
        import('date-fns/locale/sk').then(m => m.sk),
      ])
      break
    }
    case AppLanguage.sl: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/sl/messages`).then(m => m.messages),
        import('date-fns/locale/sl').then(m => m.sl),
      ])
      break
    }
    case AppLanguage.sq: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/sq/messages`).then(m => m.messages),
        import('date-fns/locale/sq').then(m => m.sq),
      ])
      break
    }
    case AppLanguage.sr_Latn: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/sr-Latn/messages`).then(m => m.messages),
        import('date-fns/locale/sr-Latn').then(m => m.srLatn),
      ])
      break
    }
    case AppLanguage.sr: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/sr/messages`).then(m => m.messages),
        import('date-fns/locale/sr').then(m => m.sr),
      ])
      break
    }
    case AppLanguage.szl: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/szl/messages`).then(m => m.messages),
        import('date-fns/locale/pl').then(m => m.pl),
      ])
      break
    }
    case AppLanguage.ta: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/ta/messages`).then(m => m.messages),
        import('date-fns/locale/ta').then(m => m.ta),
      ])
      break
    }
    case AppLanguage.tai: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/tai/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.te: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/te/messages`).then(m => m.messages),
        import('date-fns/locale/te').then(m => m.te),
      ])
      break
    }
    case AppLanguage.tlh: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/tlh/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.tok: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/tok/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.tt: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/tt/messages`).then(m => m.messages),
        import('date-fns/locale/ru').then(m => m.ru),
      ])
      break
    }
    case AppLanguage.ug: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/ug/messages`).then(m => m.messages),
        import('date-fns/locale/ug').then(m => m.ug),
      ])
      break
    }
    case AppLanguage.ur: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/ur/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.uz: {
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/uz/messages`).then(m => m.messages),
        import('date-fns/locale/uz').then(m => m.uz),
      ])
      break
    }
    case AppLanguage.zgh: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/zgh/messages`).then(
        m => m.messages,
      )
      break
    }
    case AppLanguage.am: {
      // no date-fns locale; dates use English formats
      messages = await import(`./locales/am/messages`).then(m => m.messages)
      break
    }
    case AppLanguage.jv: {
      // no Javanese date-fns locale; Indonesian shares its month names
      ;[messages, dateLocale] = await Promise.all([
        import(`./locales/jv/messages`).then(m => m.messages),
        import('date-fns/locale/id').then(m => m.id),
      ])
      break
    }
    default: {
      messages = await import(`./locales/en/messages`).then(m => m.messages)
      break
    }
  }

  i18n.load(locale, messages)
  i18n.activate(locale)

  return dateLocale
}

export function useLocaleLanguage() {
  const {appLanguage} = useLanguagePrefs()
  const [dateLocale, setDateLocale] = useState(defaultLocale)

  useEffect(() => {
    const sanitizedLanguage = sanitizeAppLanguageSetting(appLanguage)

    document.documentElement.lang = sanitizedLanguage
    void dynamicActivate(sanitizedLanguage).then(locale => {
      setDateLocale(locale)
    })
  }, [appLanguage])

  return dateLocale
}
