// Don't remove -force from these because detection is VERY slow on low-end Android.
// https://github.com/formatjs/formatjs/issues/4463#issuecomment-2176070577
import '@formatjs/intl-locale/polyfill-force.js'
import '@formatjs/intl-pluralrules/polyfill-force.js'
import '@formatjs/intl-numberformat/polyfill-force.js'
import '@formatjs/intl-displaynames/polyfill-force.js'
import '@formatjs/intl-pluralrules/locale-data/en.js'
import '@formatjs/intl-numberformat/locale-data/en.js'
import '@formatjs/intl-displaynames/locale-data/en.js'

import {useEffect, useState} from 'react'
import {i18n} from '@lingui/core'
import {enUS as defaultLocale} from 'date-fns/locale/en-US'

import {sanitizeAppLanguageSetting} from '#/locale/helpers'
import {AppLanguage} from '#/locale/languages'
import {pseudolocalizeCatalog} from '#/locale/pseudo'
import {messages as messagesAn} from '#/locale/locales/an/messages'
import {messages as messagesAst} from '#/locale/locales/ast/messages'
import {messages as messagesCa} from '#/locale/locales/ca/messages'
import {messages as messagesCs} from '#/locale/locales/cs/messages'
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
import {messages as messagesFy} from '#/locale/locales/fy/messages'
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
import {messages as messagesPt_PT} from '#/locale/locales/pt-PT/messages'
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
import {messages as messagesEn_CA} from '#/locale/locales/en-CA/messages'
import {messages as messagesFr_CA} from '#/locale/locales/fr-CA/messages'
import {messages as messagesAr} from '#/locale/locales/ar/messages'
import {messages as messagesAz} from '#/locale/locales/az/messages'
import {messages as messagesBn} from '#/locale/locales/bn/messages'
import {messages as messagesBr} from '#/locale/locales/br/messages'
import {messages as messagesHaw} from '#/locale/locales/haw/messages'
import {messages as messagesKab} from '#/locale/locales/kab/messages'
import {messages as messagesKw} from '#/locale/locales/kw/messages'
import {messages as messagesLt} from '#/locale/locales/lt/messages'
import {messages as messagesLv} from '#/locale/locales/lv/messages'
import {messages as messagesAf} from '#/locale/locales/af/messages'
import {messages as messagesBe} from '#/locale/locales/be/messages'
import {messages as messagesBg} from '#/locale/locales/bg/messages'
import {messages as messagesBs} from '#/locale/locales/bs/messages'
import {messages as messagesCkb} from '#/locale/locales/ckb/messages'
import {messages as messagesCo} from '#/locale/locales/co/messages'
import {messages as messagesEs_AR} from '#/locale/locales/es-AR/messages'
import {messages as messagesEs_MX} from '#/locale/locales/es-MX/messages'
import {messages as messagesEt} from '#/locale/locales/et/messages'
import {messages as messagesFa} from '#/locale/locales/fa/messages'
import {messages as messagesFil} from '#/locale/locales/fil/messages'
import {messages as messagesFo} from '#/locale/locales/fo/messages'
import {messages as messagesHe} from '#/locale/locales/he/messages'
import {messages as messagesHr} from '#/locale/locales/hr/messages'
import {messages as messagesHy} from '#/locale/locales/hy/messages'
import {messages as messagesIe} from '#/locale/locales/ie/messages'
import {messages as messagesIg} from '#/locale/locales/ig/messages'
import {messages as messagesIo} from '#/locale/locales/io/messages'
import {messages as messagesIs} from '#/locale/locales/is/messages'
import {messages as messagesKa} from '#/locale/locales/ka/messages'
import {messages as messagesKk} from '#/locale/locales/kk/messages'
import {messages as messagesKn} from '#/locale/locales/kn/messages'
import {messages as messagesKu} from '#/locale/locales/ku/messages'
import {messages as messagesLa} from '#/locale/locales/la/messages'
import {messages as messagesLad} from '#/locale/locales/lad/messages'
import {messages as messagesMk} from '#/locale/locales/mk/messages'
import {messages as messagesMl} from '#/locale/locales/ml/messages'
import {messages as messagesMr} from '#/locale/locales/mr/messages'
import {messages as messagesMs} from '#/locale/locales/ms/messages'
import {messages as messagesMy} from '#/locale/locales/my/messages'
import {messages as messagesNan_TW} from '#/locale/locales/nan-TW/messages'
import {messages as messagesNn} from '#/locale/locales/nn/messages'
import {messages as messagesNo} from '#/locale/locales/no/messages'
import {messages as messagesOc} from '#/locale/locales/oc/messages'
import {messages as messagesPa} from '#/locale/locales/pa/messages'
import {messages as messagesRy} from '#/locale/locales/ry/messages'
import {messages as messagesSa} from '#/locale/locales/sa/messages'
import {messages as messagesSc} from '#/locale/locales/sc/messages'
import {messages as messagesSco} from '#/locale/locales/sco/messages'
import {messages as messagesSi} from '#/locale/locales/si/messages'
import {messages as messagesSk} from '#/locale/locales/sk/messages'
import {messages as messagesSl} from '#/locale/locales/sl/messages'
import {messages as messagesSq} from '#/locale/locales/sq/messages'
import {messages as messagesSr_Latn} from '#/locale/locales/sr-Latn/messages'
import {messages as messagesSr} from '#/locale/locales/sr/messages'
import {messages as messagesSzl} from '#/locale/locales/szl/messages'
import {messages as messagesTa} from '#/locale/locales/ta/messages'
import {messages as messagesTai} from '#/locale/locales/tai/messages'
import {messages as messagesTe} from '#/locale/locales/te/messages'
import {messages as messagesTlh} from '#/locale/locales/tlh/messages'
import {messages as messagesTok} from '#/locale/locales/tok/messages'
import {messages as messagesTt} from '#/locale/locales/tt/messages'
import {messages as messagesUg} from '#/locale/locales/ug/messages'
import {messages as messagesUr} from '#/locale/locales/ur/messages'
import {messages as messagesUz} from '#/locale/locales/uz/messages'
import {messages as messagesZgh} from '#/locale/locales/zgh/messages'
import {useLanguagePrefs} from '#/state/preferences'

/**
 * We do a dynamic import of just the catalog that we need
 */
export async function dynamicActivate(locale: AppLanguage) {
  switch (locale) {
    case AppLanguage.an: {
      i18n.loadAndActivate({locale, messages: messagesAn})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/es').then(m => m.es),
        import('@formatjs/intl-pluralrules/locale-data/an.js'),
        import('@formatjs/intl-numberformat/locale-data/an.js'),
        // Aragonese locale data is missing
        // see: https://github.com/bluesky-social/social-app/pull/11327
        import('@formatjs/intl-displaynames/locale-data/es.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ast: {
      i18n.loadAndActivate({locale, messages: messagesAst})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/es').then(m => m.es),
        import('@formatjs/intl-pluralrules/locale-data/ast.js'),
        import('@formatjs/intl-numberformat/locale-data/ast.js'),
        import('@formatjs/intl-displaynames/locale-data/ast.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ca: {
      i18n.loadAndActivate({locale, messages: messagesCa})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/ca').then(m => m.ca),
        import('@formatjs/intl-pluralrules/locale-data/ca.js'),
        import('@formatjs/intl-numberformat/locale-data/ca.js'),
        import('@formatjs/intl-displaynames/locale-data/ca.js'),
      ])
      return dateLocale
    }
    case AppLanguage.cs: {
      i18n.loadAndActivate({locale, messages: messagesCs})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/cs').then(m => m.cs),
        import('@formatjs/intl-pluralrules/locale-data/cs.js'),
        import('@formatjs/intl-numberformat/locale-data/cs.js'),
        import('@formatjs/intl-displaynames/locale-data/cs.js'),
      ])
      return dateLocale
    }
    case AppLanguage.cy: {
      i18n.loadAndActivate({locale, messages: messagesCy})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/cy').then(m => m.cy),
        import('@formatjs/intl-pluralrules/locale-data/cy.js'),
        import('@formatjs/intl-numberformat/locale-data/cy.js'),
        import('@formatjs/intl-displaynames/locale-data/cy.js'),
      ])
      return dateLocale
    }
    case AppLanguage.da: {
      i18n.loadAndActivate({locale, messages: messagesDa})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/da').then(m => m.da),
        import('@formatjs/intl-pluralrules/locale-data/da.js'),
        import('@formatjs/intl-numberformat/locale-data/da.js'),
        import('@formatjs/intl-displaynames/locale-data/da.js'),
      ])
      return dateLocale
    }
    case AppLanguage.de: {
      i18n.loadAndActivate({locale, messages: messagesDe})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/de').then(m => m.de),
        import('@formatjs/intl-pluralrules/locale-data/de.js'),
        import('@formatjs/intl-numberformat/locale-data/de.js'),
        import('@formatjs/intl-displaynames/locale-data/de.js'),
      ])
      return dateLocale
    }
    case AppLanguage.el: {
      i18n.loadAndActivate({locale, messages: messagesEl})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/el').then(m => m.el),
        import('@formatjs/intl-pluralrules/locale-data/el.js'),
        import('@formatjs/intl-numberformat/locale-data/el.js'),
        import('@formatjs/intl-displaynames/locale-data/el.js'),
      ])
      return dateLocale
    }
    case AppLanguage.en_GB: {
      i18n.loadAndActivate({locale, messages: messagesEn_GB})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/en-GB').then(m => m.enGB),
        import('@formatjs/intl-pluralrules/locale-data/en.js'),
        import('@formatjs/intl-numberformat/locale-data/en-GB.js'),
        import('@formatjs/intl-displaynames/locale-data/en-GB.js'),
      ])
      return dateLocale
    }
    case AppLanguage.eo: {
      i18n.loadAndActivate({locale, messages: messagesEo})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/eo').then(m => m.eo),
        import('@formatjs/intl-pluralrules/locale-data/eo.js'),
        import('@formatjs/intl-numberformat/locale-data/eo.js'),
        import('@formatjs/intl-displaynames/locale-data/eo.js'),
      ])
      return dateLocale
    }
    case AppLanguage.es: {
      i18n.loadAndActivate({locale, messages: messagesEs})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/es').then(m => m.es),
        import('@formatjs/intl-pluralrules/locale-data/es.js'),
        import('@formatjs/intl-numberformat/locale-data/es.js'),
        import('@formatjs/intl-displaynames/locale-data/es.js'),
      ])
      return dateLocale
    }
    case AppLanguage.eu: {
      i18n.loadAndActivate({locale, messages: messagesEu})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/eu').then(m => m.eu),
        import('@formatjs/intl-pluralrules/locale-data/eu.js'),
        import('@formatjs/intl-numberformat/locale-data/eu.js'),
        import('@formatjs/intl-displaynames/locale-data/eu.js'),
      ])
      return dateLocale
    }
    case AppLanguage.fi: {
      i18n.loadAndActivate({locale, messages: messagesFi})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/fi').then(m => m.fi),
        import('@formatjs/intl-pluralrules/locale-data/fi.js'),
        import('@formatjs/intl-numberformat/locale-data/fi.js'),
        import('@formatjs/intl-displaynames/locale-data/fi.js'),
      ])
      return dateLocale
    }
    case AppLanguage.fr: {
      i18n.loadAndActivate({locale, messages: messagesFr})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/fr').then(m => m.fr),
        import('@formatjs/intl-pluralrules/locale-data/fr.js'),
        import('@formatjs/intl-numberformat/locale-data/fr.js'),
        import('@formatjs/intl-displaynames/locale-data/fr.js'),
      ])
      return dateLocale
    }
    case AppLanguage.fy: {
      i18n.loadAndActivate({locale, messages: messagesFy})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/fy').then(m => m.fy),
        import('@formatjs/intl-pluralrules/locale-data/fy.js'),
        import('@formatjs/intl-numberformat/locale-data/fy.js'),
        import('@formatjs/intl-displaynames/locale-data/fy.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ga: {
      i18n.loadAndActivate({locale, messages: messagesGa})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/ga.js'),
        import('@formatjs/intl-numberformat/locale-data/ga.js'),
        import('@formatjs/intl-displaynames/locale-data/ga.js'),
      ])
      return undefined
    }
    case AppLanguage.gd: {
      i18n.loadAndActivate({locale, messages: messagesGd})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/gd').then(m => m.gd),
        import('@formatjs/intl-pluralrules/locale-data/gd.js'),
        import('@formatjs/intl-numberformat/locale-data/gd.js'),
        import('@formatjs/intl-displaynames/locale-data/gd.js'),
      ])
      return dateLocale
    }
    case AppLanguage.gl: {
      i18n.loadAndActivate({locale, messages: messagesGl})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/gl').then(m => m.gl),
        import('@formatjs/intl-pluralrules/locale-data/gl.js'),
        import('@formatjs/intl-numberformat/locale-data/gl.js'),
        import('@formatjs/intl-displaynames/locale-data/gl.js'),
      ])
      return dateLocale
    }
    case AppLanguage.hi: {
      i18n.loadAndActivate({locale, messages: messagesHi})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/hi').then(m => m.hi),
        import('@formatjs/intl-pluralrules/locale-data/hi.js'),
        import('@formatjs/intl-numberformat/locale-data/hi.js'),
        import('@formatjs/intl-displaynames/locale-data/hi.js'),
      ])
      return dateLocale
    }
    case AppLanguage.hu: {
      i18n.loadAndActivate({locale, messages: messagesHu})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/hu').then(m => m.hu),
        import('@formatjs/intl-pluralrules/locale-data/hu.js'),
        import('@formatjs/intl-numberformat/locale-data/hu.js'),
        import('@formatjs/intl-displaynames/locale-data/hu.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ia: {
      i18n.loadAndActivate({locale, messages: messagesIa})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/ia.js'),
        import('@formatjs/intl-numberformat/locale-data/ia.js'),
        import('@formatjs/intl-displaynames/locale-data/ia.js'),
      ])
      return undefined
    }
    case AppLanguage.id: {
      i18n.loadAndActivate({locale, messages: messagesId})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/id').then(m => m.id),
        import('@formatjs/intl-pluralrules/locale-data/id.js'),
        import('@formatjs/intl-numberformat/locale-data/id.js'),
        import('@formatjs/intl-displaynames/locale-data/id.js'),
      ])
      return dateLocale
    }
    case AppLanguage.it: {
      i18n.loadAndActivate({locale, messages: messagesIt})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/it').then(m => m.it),
        import('@formatjs/intl-pluralrules/locale-data/it.js'),
        import('@formatjs/intl-numberformat/locale-data/it.js'),
        import('@formatjs/intl-displaynames/locale-data/it.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ja: {
      i18n.loadAndActivate({locale, messages: messagesJa})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/ja').then(m => m.ja),
        import('@formatjs/intl-pluralrules/locale-data/ja.js'),
        import('@formatjs/intl-numberformat/locale-data/ja.js'),
        import('@formatjs/intl-displaynames/locale-data/ja.js'),
      ])
      return dateLocale
    }
    case AppLanguage.km: {
      i18n.loadAndActivate({locale, messages: messagesKm})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/km').then(m => m.km),
        import('@formatjs/intl-pluralrules/locale-data/km.js'),
        import('@formatjs/intl-numberformat/locale-data/km.js'),
        import('@formatjs/intl-displaynames/locale-data/km.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ko: {
      i18n.loadAndActivate({locale, messages: messagesKo})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/ko').then(m => m.ko),
        import('@formatjs/intl-pluralrules/locale-data/ko.js'),
        import('@formatjs/intl-numberformat/locale-data/ko.js'),
        import('@formatjs/intl-displaynames/locale-data/ko.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ne: {
      i18n.loadAndActivate({locale, messages: messagesNe})
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/ne.js'),
        import('@formatjs/intl-numberformat/locale-data/ne.js'),
        import('@formatjs/intl-displaynames/locale-data/ne.js'),
      ])
      return undefined
    }
    case AppLanguage.nl: {
      i18n.loadAndActivate({locale, messages: messagesNl})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/nl').then(m => m.nl),
        import('@formatjs/intl-pluralrules/locale-data/nl.js'),
        import('@formatjs/intl-numberformat/locale-data/nl.js'),
        import('@formatjs/intl-displaynames/locale-data/nl.js'),
      ])
      return dateLocale
    }
    case AppLanguage.pl: {
      i18n.loadAndActivate({locale, messages: messagesPl})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/pl').then(m => m.pl),
        import('@formatjs/intl-pluralrules/locale-data/pl.js'),
        import('@formatjs/intl-numberformat/locale-data/pl.js'),
        import('@formatjs/intl-displaynames/locale-data/pl.js'),
      ])
      return dateLocale
    }
    case AppLanguage.pt_BR: {
      i18n.loadAndActivate({locale, messages: messagesPt_BR})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/pt-BR').then(m => m.ptBR),
        import('@formatjs/intl-pluralrules/locale-data/pt.js'),
        import('@formatjs/intl-numberformat/locale-data/pt.js'),
        import('@formatjs/intl-displaynames/locale-data/pt.js'),
      ])
      return dateLocale
    }
    case AppLanguage.pt_PT: {
      i18n.loadAndActivate({locale, messages: messagesPt_PT})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/pt').then(m => m.pt),
        import('@formatjs/intl-pluralrules/locale-data/pt-PT.js'),
        import('@formatjs/intl-numberformat/locale-data/pt-PT.js'),
        import('@formatjs/intl-displaynames/locale-data/pt-PT.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ro: {
      i18n.loadAndActivate({locale, messages: messagesRo})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/ro').then(m => m.ro),
        import('@formatjs/intl-pluralrules/locale-data/ro.js'),
        import('@formatjs/intl-numberformat/locale-data/ro.js'),
        import('@formatjs/intl-displaynames/locale-data/ro.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ru: {
      i18n.loadAndActivate({locale, messages: messagesRu})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/ru').then(m => m.ru),
        import('@formatjs/intl-pluralrules/locale-data/ru.js'),
        import('@formatjs/intl-numberformat/locale-data/ru.js'),
        import('@formatjs/intl-displaynames/locale-data/ru.js'),
      ])
      return dateLocale
    }
    case AppLanguage.sv: {
      i18n.loadAndActivate({locale, messages: messagesSv})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/sv').then(m => m.sv),
        import('@formatjs/intl-pluralrules/locale-data/sv.js'),
        import('@formatjs/intl-numberformat/locale-data/sv.js'),
        import('@formatjs/intl-displaynames/locale-data/sv.js'),
      ])
      return dateLocale
    }
    case AppLanguage.th: {
      i18n.loadAndActivate({locale, messages: messagesTh})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/th').then(m => m.th),
        import('@formatjs/intl-pluralrules/locale-data/th.js'),
        import('@formatjs/intl-numberformat/locale-data/th.js'),
        import('@formatjs/intl-displaynames/locale-data/th.js'),
      ])
      return dateLocale
    }
    case AppLanguage.tr: {
      i18n.loadAndActivate({locale, messages: messagesTr})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/tr').then(m => m.tr),
        import('@formatjs/intl-pluralrules/locale-data/tr.js'),
        import('@formatjs/intl-numberformat/locale-data/tr.js'),
        import('@formatjs/intl-displaynames/locale-data/tr.js'),
      ])
      return dateLocale
    }
    case AppLanguage.uk: {
      i18n.loadAndActivate({locale, messages: messagesUk})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/uk').then(m => m.uk),
        import('@formatjs/intl-pluralrules/locale-data/uk.js'),
        import('@formatjs/intl-numberformat/locale-data/uk.js'),
        import('@formatjs/intl-displaynames/locale-data/uk.js'),
      ])
      return dateLocale
    }
    case AppLanguage.vi: {
      i18n.loadAndActivate({locale, messages: messagesVi})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/vi').then(m => m.vi),
        import('@formatjs/intl-pluralrules/locale-data/vi.js'),
        import('@formatjs/intl-numberformat/locale-data/vi.js'),
        import('@formatjs/intl-displaynames/locale-data/vi.js'),
      ])
      return dateLocale
    }
    case AppLanguage.zh_CN: {
      i18n.loadAndActivate({locale, messages: messagesZh_CN})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/zh-CN').then(m => m.zhCN),
        import('@formatjs/intl-pluralrules/locale-data/zh.js'),
        import('@formatjs/intl-numberformat/locale-data/zh.js'),
        import('@formatjs/intl-displaynames/locale-data/zh.js'),
      ])
      return dateLocale
    }
    case AppLanguage.zh_HK: {
      i18n.loadAndActivate({locale, messages: messagesZh_HK})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/zh-HK').then(m => m.zhHK),
        import('@formatjs/intl-pluralrules/locale-data/zh.js'),
        import('@formatjs/intl-numberformat/locale-data/yue-Hant.js'),
        import('@formatjs/intl-displaynames/locale-data/yue-Hant.js'),
      ])
      return dateLocale
    }
    case AppLanguage.zh_TW: {
      i18n.loadAndActivate({locale, messages: messagesZh_TW})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/zh-TW').then(m => m.zhTW),
        import('@formatjs/intl-pluralrules/locale-data/zh.js'),
        import('@formatjs/intl-numberformat/locale-data/zh-Hant.js'),
        import('@formatjs/intl-displaynames/locale-data/zh-Hant.js'),
      ])
      return dateLocale
    }
    case AppLanguage.en_CA: {
      i18n.loadAndActivate({locale, messages: messagesEn_CA})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/en-CA').then(m => m.enCA),
        import('@formatjs/intl-pluralrules/locale-data/en.js'),
        import('@formatjs/intl-numberformat/locale-data/en-CA.js'),
        import('@formatjs/intl-displaynames/locale-data/en-CA.js'),
      ])
      return dateLocale
    }
    case AppLanguage.fr_CA: {
      i18n.loadAndActivate({locale, messages: messagesFr_CA})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/fr-CA').then(m => m.frCA),
        import('@formatjs/intl-pluralrules/locale-data/fr.js'),
        import('@formatjs/intl-numberformat/locale-data/fr-CA.js'),
        import('@formatjs/intl-displaynames/locale-data/fr-CA.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ar: {
      i18n.loadAndActivate({locale, messages: messagesAr})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/ar').then(m => m.ar),
        import('@formatjs/intl-pluralrules/locale-data/ar.js'),
        import('@formatjs/intl-numberformat/locale-data/ar.js'),
        import('@formatjs/intl-displaynames/locale-data/ar.js'),
      ])
      return dateLocale
    }
    case AppLanguage.az: {
      i18n.loadAndActivate({locale, messages: messagesAz})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/az').then(m => m.az),
        import('@formatjs/intl-pluralrules/locale-data/az.js'),
        import('@formatjs/intl-numberformat/locale-data/az.js'),
        import('@formatjs/intl-displaynames/locale-data/az.js'),
      ])
      return dateLocale
    }
    case AppLanguage.bn: {
      i18n.loadAndActivate({locale, messages: messagesBn})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/bn').then(m => m.bn),
        import('@formatjs/intl-pluralrules/locale-data/bn.js'),
        import('@formatjs/intl-numberformat/locale-data/bn.js'),
        import('@formatjs/intl-displaynames/locale-data/bn.js'),
      ])
      return dateLocale
    }
    case AppLanguage.br: {
      i18n.loadAndActivate({locale, messages: messagesBr})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/fr').then(m => m.fr),
        import('@formatjs/intl-pluralrules/locale-data/br.js'),
        import('@formatjs/intl-numberformat/locale-data/br.js'),
        import('@formatjs/intl-displaynames/locale-data/br.js'),
      ])
      return dateLocale
    }
    case AppLanguage.haw: {
      i18n.loadAndActivate({locale, messages: messagesHaw})
      // no date-fns locale; dates use English formats
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/haw.js'),
        import('@formatjs/intl-numberformat/locale-data/haw.js'),
        import('@formatjs/intl-displaynames/locale-data/haw.js'),
      ])
      return defaultLocale
    }
    case AppLanguage.kab: {
      i18n.loadAndActivate({locale, messages: messagesKab})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/fr').then(m => m.fr),
        import('@formatjs/intl-pluralrules/locale-data/kab.js'),
        import('@formatjs/intl-numberformat/locale-data/kab.js'),
        import('@formatjs/intl-displaynames/locale-data/kab.js'),
      ])
      return dateLocale
    }
    case AppLanguage.kw: {
      i18n.loadAndActivate({locale, messages: messagesKw})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/en-GB').then(m => m.enGB),
        import('@formatjs/intl-pluralrules/locale-data/kw.js'),
        import('@formatjs/intl-numberformat/locale-data/kw.js'),
        import('@formatjs/intl-displaynames/locale-data/kw.js'),
      ])
      return dateLocale
    }
    case AppLanguage.lt: {
      i18n.loadAndActivate({locale, messages: messagesLt})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/lt').then(m => m.lt),
        import('@formatjs/intl-pluralrules/locale-data/lt.js'),
        import('@formatjs/intl-numberformat/locale-data/lt.js'),
        import('@formatjs/intl-displaynames/locale-data/lt.js'),
      ])
      return dateLocale
    }
    case AppLanguage.lv: {
      i18n.loadAndActivate({locale, messages: messagesLv})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/lv').then(m => m.lv),
        import('@formatjs/intl-pluralrules/locale-data/lv.js'),
        import('@formatjs/intl-numberformat/locale-data/lv.js'),
        import('@formatjs/intl-displaynames/locale-data/lv.js'),
      ])
      return dateLocale
    }
    case AppLanguage.af: {
      i18n.loadAndActivate({locale, messages: messagesAf})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/af').then(m => m.af),
        import('@formatjs/intl-pluralrules/locale-data/af.js'),
        import('@formatjs/intl-numberformat/locale-data/af.js'),
        import('@formatjs/intl-displaynames/locale-data/af.js'),
      ])
      return dateLocale
    }
    case AppLanguage.be: {
      i18n.loadAndActivate({locale, messages: messagesBe})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/be').then(m => m.be),
        import('@formatjs/intl-pluralrules/locale-data/be.js'),
        import('@formatjs/intl-numberformat/locale-data/be.js'),
        import('@formatjs/intl-displaynames/locale-data/be.js'),
      ])
      return dateLocale
    }
    case AppLanguage.bg: {
      i18n.loadAndActivate({locale, messages: messagesBg})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/bg').then(m => m.bg),
        import('@formatjs/intl-pluralrules/locale-data/bg.js'),
        import('@formatjs/intl-numberformat/locale-data/bg.js'),
        import('@formatjs/intl-displaynames/locale-data/bg.js'),
      ])
      return dateLocale
    }
    case AppLanguage.bs: {
      i18n.loadAndActivate({locale, messages: messagesBs})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/bs').then(m => m.bs),
        import('@formatjs/intl-pluralrules/locale-data/bs.js'),
        import('@formatjs/intl-numberformat/locale-data/bs.js'),
        import('@formatjs/intl-displaynames/locale-data/bs.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ckb: {
      i18n.loadAndActivate({locale, messages: messagesCkb})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/ckb').then(m => m.ckb),
        import('@formatjs/intl-pluralrules/locale-data/ckb.js'),
        import('@formatjs/intl-numberformat/locale-data/ckb.js'),
        import('@formatjs/intl-displaynames/locale-data/ckb.js'),
      ])
      return dateLocale
    }
    case AppLanguage.co: {
      i18n.loadAndActivate({locale, messages: messagesCo})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/fr').then(m => m.fr),
        import('@formatjs/intl-pluralrules/locale-data/fr.js'),
        import('@formatjs/intl-numberformat/locale-data/co.js'),
        import('@formatjs/intl-displaynames/locale-data/co.js'),
      ])
      return dateLocale
    }
    case AppLanguage.es_AR: {
      i18n.loadAndActivate({locale, messages: messagesEs_AR})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/es').then(m => m.es),
        import('@formatjs/intl-pluralrules/locale-data/es.js'),
        import('@formatjs/intl-numberformat/locale-data/es-AR.js'),
        import('@formatjs/intl-displaynames/locale-data/es-AR.js'),
      ])
      return dateLocale
    }
    case AppLanguage.es_MX: {
      i18n.loadAndActivate({locale, messages: messagesEs_MX})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/es').then(m => m.es),
        import('@formatjs/intl-pluralrules/locale-data/es.js'),
        import('@formatjs/intl-numberformat/locale-data/es-MX.js'),
        import('@formatjs/intl-displaynames/locale-data/es-MX.js'),
      ])
      return dateLocale
    }
    case AppLanguage.et: {
      i18n.loadAndActivate({locale, messages: messagesEt})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/et').then(m => m.et),
        import('@formatjs/intl-pluralrules/locale-data/et.js'),
        import('@formatjs/intl-numberformat/locale-data/et.js'),
        import('@formatjs/intl-displaynames/locale-data/et.js'),
      ])
      return dateLocale
    }
    case AppLanguage.fa: {
      i18n.loadAndActivate({locale, messages: messagesFa})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/fa-IR').then(m => m.faIR),
        import('@formatjs/intl-pluralrules/locale-data/fa.js'),
        import('@formatjs/intl-numberformat/locale-data/fa.js'),
        import('@formatjs/intl-displaynames/locale-data/fa.js'),
      ])
      return dateLocale
    }
    case AppLanguage.fil: {
      i18n.loadAndActivate({locale, messages: messagesFil})
      // no date-fns locale; dates use English formats
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/fil.js'),
        import('@formatjs/intl-numberformat/locale-data/fil.js'),
        import('@formatjs/intl-displaynames/locale-data/fil.js'),
      ])
      return defaultLocale
    }
    case AppLanguage.fo: {
      i18n.loadAndActivate({locale, messages: messagesFo})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/da').then(m => m.da),
        import('@formatjs/intl-pluralrules/locale-data/fo.js'),
        import('@formatjs/intl-numberformat/locale-data/fo.js'),
        import('@formatjs/intl-displaynames/locale-data/fo.js'),
      ])
      return dateLocale
    }
    case AppLanguage.he: {
      i18n.loadAndActivate({locale, messages: messagesHe})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/he').then(m => m.he),
        import('@formatjs/intl-pluralrules/locale-data/he.js'),
        import('@formatjs/intl-numberformat/locale-data/he.js'),
        import('@formatjs/intl-displaynames/locale-data/he.js'),
      ])
      return dateLocale
    }
    case AppLanguage.hr: {
      i18n.loadAndActivate({locale, messages: messagesHr})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/hr').then(m => m.hr),
        import('@formatjs/intl-pluralrules/locale-data/hr.js'),
        import('@formatjs/intl-numberformat/locale-data/hr.js'),
        import('@formatjs/intl-displaynames/locale-data/hr.js'),
      ])
      return dateLocale
    }
    case AppLanguage.hy: {
      i18n.loadAndActivate({locale, messages: messagesHy})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/hy').then(m => m.hy),
        import('@formatjs/intl-pluralrules/locale-data/hy.js'),
        import('@formatjs/intl-numberformat/locale-data/hy.js'),
        import('@formatjs/intl-displaynames/locale-data/hy.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ie: {
      i18n.loadAndActivate({locale, messages: messagesIe})
      // no date-fns locale; dates use English formats
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/ie.js'),
        import('@formatjs/intl-numberformat/locale-data/ie.js'),
        import('@formatjs/intl-displaynames/locale-data/ie.js'),
      ])
      return defaultLocale
    }
    case AppLanguage.ig: {
      i18n.loadAndActivate({locale, messages: messagesIg})
      // no date-fns locale; dates use English formats
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/ig.js'),
        import('@formatjs/intl-numberformat/locale-data/ig.js'),
        import('@formatjs/intl-displaynames/locale-data/ig.js'),
      ])
      return defaultLocale
    }
    case AppLanguage.io: {
      i18n.loadAndActivate({locale, messages: messagesIo})
      // no date-fns locale; dates use English formats
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/io.js'),
        import('@formatjs/intl-numberformat/locale-data/io.js'),
        import('@formatjs/intl-displaynames/locale-data/io.js'),
      ])
      return defaultLocale
    }
    case AppLanguage.is: {
      i18n.loadAndActivate({locale, messages: messagesIs})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/is').then(m => m.is),
        import('@formatjs/intl-pluralrules/locale-data/is.js'),
        import('@formatjs/intl-numberformat/locale-data/is.js'),
        import('@formatjs/intl-displaynames/locale-data/is.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ka: {
      i18n.loadAndActivate({locale, messages: messagesKa})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/ka').then(m => m.ka),
        import('@formatjs/intl-pluralrules/locale-data/ka.js'),
        import('@formatjs/intl-numberformat/locale-data/ka.js'),
        import('@formatjs/intl-displaynames/locale-data/ka.js'),
      ])
      return dateLocale
    }
    case AppLanguage.kk: {
      i18n.loadAndActivate({locale, messages: messagesKk})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/kk').then(m => m.kk),
        import('@formatjs/intl-pluralrules/locale-data/kk.js'),
        import('@formatjs/intl-numberformat/locale-data/kk.js'),
        import('@formatjs/intl-displaynames/locale-data/kk.js'),
      ])
      return dateLocale
    }
    case AppLanguage.kn: {
      i18n.loadAndActivate({locale, messages: messagesKn})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/kn').then(m => m.kn),
        import('@formatjs/intl-pluralrules/locale-data/kn.js'),
        import('@formatjs/intl-numberformat/locale-data/kn.js'),
        import('@formatjs/intl-displaynames/locale-data/kn.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ku: {
      i18n.loadAndActivate({locale, messages: messagesKu})
      // no date-fns locale; dates use English formats
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/ku.js'),
        import('@formatjs/intl-numberformat/locale-data/ku.js'),
        import('@formatjs/intl-displaynames/locale-data/ku.js'),
      ])
      return defaultLocale
    }
    case AppLanguage.la: {
      // no plural rules for this locale, so fall back to English ones
      i18n.loadAndActivate({
        locale,
        locales: [locale, 'en'],
        messages: messagesLa,
      })
      // no date-fns locale; dates use English formats
      await Promise.all([
        // no intl-pluralrules data for this locale; English is used
        import('@formatjs/intl-numberformat/locale-data/la.js'),
        import('@formatjs/intl-displaynames/locale-data/la.js'),
      ])
      return defaultLocale
    }
    case AppLanguage.lad: {
      i18n.loadAndActivate({locale, messages: messagesLad})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/es').then(m => m.es),
        import('@formatjs/intl-pluralrules/locale-data/es.js'),
        import('@formatjs/intl-numberformat/locale-data/es.js'),
        import('@formatjs/intl-displaynames/locale-data/es.js'),
      ])
      return dateLocale
    }
    case AppLanguage.mk: {
      i18n.loadAndActivate({locale, messages: messagesMk})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/mk').then(m => m.mk),
        import('@formatjs/intl-pluralrules/locale-data/mk.js'),
        import('@formatjs/intl-numberformat/locale-data/mk.js'),
        import('@formatjs/intl-displaynames/locale-data/mk.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ml: {
      i18n.loadAndActivate({locale, messages: messagesMl})
      // no date-fns locale; dates use English formats
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/ml.js'),
        import('@formatjs/intl-numberformat/locale-data/ml.js'),
        import('@formatjs/intl-displaynames/locale-data/ml.js'),
      ])
      return defaultLocale
    }
    case AppLanguage.mr: {
      i18n.loadAndActivate({locale, messages: messagesMr})
      // no date-fns locale; dates use English formats
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/mr.js'),
        import('@formatjs/intl-numberformat/locale-data/mr.js'),
        import('@formatjs/intl-displaynames/locale-data/mr.js'),
      ])
      return defaultLocale
    }
    case AppLanguage.ms: {
      i18n.loadAndActivate({locale, messages: messagesMs})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/ms').then(m => m.ms),
        import('@formatjs/intl-pluralrules/locale-data/ms.js'),
        import('@formatjs/intl-numberformat/locale-data/ms.js'),
        import('@formatjs/intl-displaynames/locale-data/ms.js'),
      ])
      return dateLocale
    }
    case AppLanguage.my: {
      i18n.loadAndActivate({locale, messages: messagesMy})
      // no date-fns locale; dates use English formats
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/my.js'),
        import('@formatjs/intl-numberformat/locale-data/my.js'),
        import('@formatjs/intl-displaynames/locale-data/my.js'),
      ])
      return defaultLocale
    }
    case AppLanguage.nan_TW: {
      i18n.loadAndActivate({locale, messages: messagesNan_TW})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/zh-TW').then(m => m.zhTW),
        import('@formatjs/intl-pluralrules/locale-data/zh.js'),
        import('@formatjs/intl-numberformat/locale-data/zh.js'),
        import('@formatjs/intl-displaynames/locale-data/zh.js'),
      ])
      return dateLocale
    }
    case AppLanguage.nn: {
      i18n.loadAndActivate({locale, messages: messagesNn})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/nn').then(m => m.nn),
        import('@formatjs/intl-pluralrules/locale-data/nn.js'),
        import('@formatjs/intl-numberformat/locale-data/nn.js'),
        import('@formatjs/intl-displaynames/locale-data/nn.js'),
      ])
      return dateLocale
    }
    case AppLanguage.no: {
      i18n.loadAndActivate({locale, messages: messagesNo})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/nb').then(m => m.nb),
        import('@formatjs/intl-pluralrules/locale-data/no.js'),
        import('@formatjs/intl-numberformat/locale-data/no.js'),
        import('@formatjs/intl-displaynames/locale-data/no.js'),
      ])
      return dateLocale
    }
    case AppLanguage.oc: {
      // no plural rules for this locale, so fall back to English ones
      i18n.loadAndActivate({
        locale,
        locales: [locale, 'en'],
        messages: messagesOc,
      })
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/oc').then(m => m.oc),
        // no intl-pluralrules data for this locale; English is used
        import('@formatjs/intl-numberformat/locale-data/oc.js'),
        import('@formatjs/intl-displaynames/locale-data/oc.js'),
      ])
      return dateLocale
    }
    case AppLanguage.pa: {
      i18n.loadAndActivate({locale, messages: messagesPa})
      // no date-fns locale; dates use English formats
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/pa.js'),
        import('@formatjs/intl-numberformat/locale-data/pa.js'),
        import('@formatjs/intl-displaynames/locale-data/pa.js'),
      ])
      return defaultLocale
    }
    case AppLanguage.ry: {
      i18n.loadAndActivate({locale, messages: messagesRy})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/uk').then(m => m.uk),
        import('@formatjs/intl-pluralrules/locale-data/uk.js'),
        import('@formatjs/intl-numberformat/locale-data/uk.js'),
        import('@formatjs/intl-displaynames/locale-data/uk.js'),
      ])
      return dateLocale
    }
    case AppLanguage.sa: {
      // no plural rules for this locale, so fall back to English ones
      i18n.loadAndActivate({
        locale,
        locales: [locale, 'en'],
        messages: messagesSa,
      })
      // no date-fns locale; dates use English formats
      await Promise.all([
        // no intl-pluralrules data for this locale; English is used
        import('@formatjs/intl-numberformat/locale-data/sa.js'),
        import('@formatjs/intl-displaynames/locale-data/sa.js'),
      ])
      return defaultLocale
    }
    case AppLanguage.sc: {
      i18n.loadAndActivate({locale, messages: messagesSc})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/it').then(m => m.it),
        import('@formatjs/intl-pluralrules/locale-data/sc.js'),
        import('@formatjs/intl-numberformat/locale-data/sc.js'),
        import('@formatjs/intl-displaynames/locale-data/sc.js'),
      ])
      return dateLocale
    }
    case AppLanguage.sco: {
      i18n.loadAndActivate({locale, messages: messagesSco})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/en-GB').then(m => m.enGB),
        import('@formatjs/intl-pluralrules/locale-data/en.js'),
        import('@formatjs/intl-numberformat/locale-data/en.js'),
        import('@formatjs/intl-displaynames/locale-data/en.js'),
      ])
      return dateLocale
    }
    case AppLanguage.si: {
      i18n.loadAndActivate({locale, messages: messagesSi})
      // no date-fns locale; dates use English formats
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/si.js'),
        import('@formatjs/intl-numberformat/locale-data/si.js'),
        import('@formatjs/intl-displaynames/locale-data/si.js'),
      ])
      return defaultLocale
    }
    case AppLanguage.sk: {
      i18n.loadAndActivate({locale, messages: messagesSk})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/sk').then(m => m.sk),
        import('@formatjs/intl-pluralrules/locale-data/sk.js'),
        import('@formatjs/intl-numberformat/locale-data/sk.js'),
        import('@formatjs/intl-displaynames/locale-data/sk.js'),
      ])
      return dateLocale
    }
    case AppLanguage.sl: {
      i18n.loadAndActivate({locale, messages: messagesSl})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/sl').then(m => m.sl),
        import('@formatjs/intl-pluralrules/locale-data/sl.js'),
        import('@formatjs/intl-numberformat/locale-data/sl.js'),
        import('@formatjs/intl-displaynames/locale-data/sl.js'),
      ])
      return dateLocale
    }
    case AppLanguage.sq: {
      i18n.loadAndActivate({locale, messages: messagesSq})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/sq').then(m => m.sq),
        import('@formatjs/intl-pluralrules/locale-data/sq.js'),
        import('@formatjs/intl-numberformat/locale-data/sq.js'),
        import('@formatjs/intl-displaynames/locale-data/sq.js'),
      ])
      return dateLocale
    }
    case AppLanguage.sr_Latn: {
      i18n.loadAndActivate({locale, messages: messagesSr_Latn})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/sr-Latn').then(m => m.srLatn),
        import('@formatjs/intl-pluralrules/locale-data/sr.js'),
        import('@formatjs/intl-numberformat/locale-data/sr-Latn.js'),
        import('@formatjs/intl-displaynames/locale-data/sr-Latn.js'),
      ])
      return dateLocale
    }
    case AppLanguage.sr: {
      i18n.loadAndActivate({locale, messages: messagesSr})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/sr').then(m => m.sr),
        import('@formatjs/intl-pluralrules/locale-data/sr.js'),
        import('@formatjs/intl-numberformat/locale-data/sr.js'),
        import('@formatjs/intl-displaynames/locale-data/sr.js'),
      ])
      return dateLocale
    }
    case AppLanguage.szl: {
      i18n.loadAndActivate({locale, messages: messagesSzl})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/pl').then(m => m.pl),
        import('@formatjs/intl-pluralrules/locale-data/pl.js'),
        import('@formatjs/intl-numberformat/locale-data/szl.js'),
        import('@formatjs/intl-displaynames/locale-data/szl.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ta: {
      i18n.loadAndActivate({locale, messages: messagesTa})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/ta').then(m => m.ta),
        import('@formatjs/intl-pluralrules/locale-data/ta.js'),
        import('@formatjs/intl-numberformat/locale-data/ta.js'),
        import('@formatjs/intl-displaynames/locale-data/ta.js'),
      ])
      return dateLocale
    }
    case AppLanguage.tai: {
      // no plural rules for this locale, so fall back to English ones
      i18n.loadAndActivate({
        locale,
        locales: [locale, 'en'],
        messages: messagesTai,
      })
      // no date-fns locale; dates use English formats
      // no intl-pluralrules data for this locale; English is used
      // no intl-numberformat data for this locale; English is used
      // no intl-displaynames data for this locale; English is used
      return defaultLocale
    }
    case AppLanguage.te: {
      i18n.loadAndActivate({locale, messages: messagesTe})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/te').then(m => m.te),
        import('@formatjs/intl-pluralrules/locale-data/te.js'),
        import('@formatjs/intl-numberformat/locale-data/te.js'),
        import('@formatjs/intl-displaynames/locale-data/te.js'),
      ])
      return dateLocale
    }
    case AppLanguage.tlh: {
      // no plural rules for this locale, so fall back to English ones
      i18n.loadAndActivate({
        locale,
        locales: [locale, 'en'],
        messages: messagesTlh,
      })
      // no date-fns locale; dates use English formats
      // no intl-pluralrules data for this locale; English is used
      // no intl-numberformat data for this locale; English is used
      // no intl-displaynames data for this locale; English is used
      return defaultLocale
    }
    case AppLanguage.tok: {
      // no plural rules for this locale, so fall back to English ones
      i18n.loadAndActivate({
        locale,
        locales: [locale, 'en'],
        messages: messagesTok,
      })
      // no date-fns locale; dates use English formats
      await Promise.all([
        // no intl-pluralrules data for this locale; English is used
        import('@formatjs/intl-numberformat/locale-data/tok.js'),
        import('@formatjs/intl-displaynames/locale-data/tok.js'),
      ])
      return defaultLocale
    }
    case AppLanguage.tt: {
      i18n.loadAndActivate({locale, messages: messagesTt})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/ru').then(m => m.ru),
        import('@formatjs/intl-pluralrules/locale-data/ru.js'),
        import('@formatjs/intl-numberformat/locale-data/tt.js'),
        import('@formatjs/intl-displaynames/locale-data/tt.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ug: {
      i18n.loadAndActivate({locale, messages: messagesUg})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/ug').then(m => m.ug),
        import('@formatjs/intl-pluralrules/locale-data/ug.js'),
        import('@formatjs/intl-numberformat/locale-data/ug.js'),
        import('@formatjs/intl-displaynames/locale-data/ug.js'),
      ])
      return dateLocale
    }
    case AppLanguage.ur: {
      i18n.loadAndActivate({locale, messages: messagesUr})
      // no date-fns locale; dates use English formats
      await Promise.all([
        import('@formatjs/intl-pluralrules/locale-data/ur.js'),
        import('@formatjs/intl-numberformat/locale-data/ur.js'),
        import('@formatjs/intl-displaynames/locale-data/ur.js'),
      ])
      return defaultLocale
    }
    case AppLanguage.uz: {
      i18n.loadAndActivate({locale, messages: messagesUz})
      const [dateLocale] = await Promise.all([
        import('date-fns/locale/uz').then(m => m.uz),
        import('@formatjs/intl-pluralrules/locale-data/uz.js'),
        import('@formatjs/intl-numberformat/locale-data/uz.js'),
        import('@formatjs/intl-displaynames/locale-data/uz.js'),
      ])
      return dateLocale
    }
    case AppLanguage.zgh: {
      // no plural rules for this locale, so fall back to English ones
      i18n.loadAndActivate({
        locale,
        locales: [locale, 'en'],
        messages: messagesZgh,
      })
      // no date-fns locale; dates use English formats
      await Promise.all([
        // no intl-pluralrules data for this locale; English is used
        import('@formatjs/intl-numberformat/locale-data/zgh.js'),
        import('@formatjs/intl-displaynames/locale-data/zgh.js'),
      ])
      return defaultLocale
    }
    case AppLanguage.pseudo: {
      // Activate under 'en' so plural rules and date formatting still work,
      // but with pseudolocalized text.
      i18n.loadAndActivate({
        locale: 'en',
        messages: pseudolocalizeCatalog(messagesEn),
      })
      return defaultLocale
    }
    default: {
      i18n.loadAndActivate({locale, messages: messagesEn})
      return defaultLocale
    }
  }
}

export function useLocaleLanguage() {
  const {appLanguage} = useLanguagePrefs()
  const [dateLocale, setDateLocale] = useState(defaultLocale)

  useEffect(() => {
    void dynamicActivate(sanitizeAppLanguageSetting(appLanguage)).then(
      locale => {
        setDateLocale(locale ?? defaultLocale)
      },
    )
  }, [appLanguage])

  return dateLocale
}
