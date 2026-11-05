import {expect, test} from '@jest/globals'

import {
  findSupportedAppLanguage,
  sanitizeAppLanguageSetting,
} from '#/locale/helpers'
import {AppLanguage} from '#/locale/languages'

test('sanitizeAppLanguageSetting', () => {
  expect(sanitizeAppLanguageSetting('en')).toBe(AppLanguage.en)
  expect(sanitizeAppLanguageSetting('el')).toBe(AppLanguage.el)
  expect(sanitizeAppLanguageSetting('pt-BR')).toBe(AppLanguage.pt_BR)
  expect(sanitizeAppLanguageSetting('hi')).toBe(AppLanguage.hi)
  expect(sanitizeAppLanguageSetting('id')).toBe(AppLanguage.id)
  expect(sanitizeAppLanguageSetting('foo')).toBe(AppLanguage.en)
  expect(sanitizeAppLanguageSetting('en,foo')).toBe(AppLanguage.en)
  expect(sanitizeAppLanguageSetting('foo,en')).toBe(AppLanguage.en)
  expect(sanitizeAppLanguageSetting('vi')).toBe(AppLanguage.vi)
  expect(sanitizeAppLanguageSetting('ne')).toBe(AppLanguage.ne)
  expect(sanitizeAppLanguageSetting('nb')).toBe(AppLanguage.no)
})

test('findSupportedAppLanguage', () => {
  expect(findSupportedAppLanguage(['nb-NO', 'nb'])).toBe(AppLanguage.no)
  expect(findSupportedAppLanguage(['am-ET', 'am'])).toBe(AppLanguage.am)
  expect(findSupportedAppLanguage(['xx', undefined])).toBe(AppLanguage.en)
})
