import {useState} from 'react'
import {type Insets, Pressable, View} from 'react-native'
import {useLingui} from '@lingui/react/macro'

import {
  getTranslatorEntry,
  type TranslatorEntry,
} from '#/lib/translators'
import {languageName} from '#/locale/helpers'
import {LANGUAGES} from '#/locale/languages'
import {useLanguagePrefs} from '#/state/preferences'
import {atoms as a, useTheme} from '#/alf'
import {Language_Stroke2_Corner2_Rounded as LanguageIcon} from '#/components/icons/Language'
import * as Tooltip from '#/components/Tooltip'
import type * as bsky from '#/types/bsky'

/**
 * A profile's translator entry, if they are a listed localization contributor.
 * Keyed by DID via the curated list in `#/lib/translators`.
 */
export function useTranslatorInfo(
  profile: bsky.profile.AnyProfileView,
): TranslatorEntry | undefined {
  return getTranslatorEntry(profile.did)
}

/**
 * Build the combined tooltip line for a translator, e.g.
 * "Translator for Spanish\nTranslator and proofreader for German". Language
 * names are localized into the viewer's app language.
 */
function useTranslatorLabel(entry: TranslatorEntry | undefined): string {
  const {t: l} = useLingui()
  const langPrefs = useLanguagePrefs()

  if (!entry) return ''

  return entry.languages
    .map(({lang, roles}) => {
      const found = LANGUAGES.find(x => x.code2 === lang)
      const name = found ? languageName(found, langPrefs.appLanguage) : lang
      const hasTranslator = roles.includes('translator')
      const hasProofreader = roles.includes('proofreader')
      const rolePhrase =
        hasTranslator && hasProofreader
          ? l`Translator and proofreader`
          : hasProofreader
            ? l`Proofreader`
            : l`Translator`
      return l`${rolePhrase} for ${name}`
    })
    .join('\n')
}

export function TranslatorBadge({
  profile,
  width,
  padding,
}: {
  profile: bsky.profile.AnyProfileView
  width: number
  padding: number
}) {
  const t = useTheme()
  const entry = useTranslatorInfo(profile)

  if (!entry) return null

  return (
    <View
      style={[
        a.rounded_full,
        a.align_center,
        a.justify_center,
        {backgroundColor: t.palette.primary_50, padding},
      ]}>
      <LanguageIcon width={width} height={width} fill={t.palette.primary_500} />
    </View>
  )
}

export function TranslatorBadgeButton({
  profile,
  width,
  padding,
  hitSlop,
}: {
  profile: bsky.profile.AnyProfileView
  width: number
  padding: number
  hitSlop: Insets
}) {
  const t = useTheme()
  const entry = useTranslatorInfo(profile)
  const label = useTranslatorLabel(entry)
  const [tooltipVisible, setTooltipVisible] = useState(false)

  if (!entry) return null

  return (
    <Tooltip.Outer
      color="primary"
      visible={tooltipVisible}
      onVisibleChange={setTooltipVisible}>
      <Tooltip.Target>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityHint=""
          hitSlop={hitSlop}
          style={({hovered}) => [
            a.rounded_full,
            a.align_center,
            a.justify_center,
            a.transition_transform,
            {
              backgroundColor: t.palette.primary_50,
              padding,
              transform: [{scale: hovered ? 1.1 : 1}],
            },
          ]}
          onPress={() => setTooltipVisible(v => !v)}>
          <LanguageIcon width={width} height={width} fill={t.palette.primary_500} />
        </Pressable>
      </Tooltip.Target>
      <Tooltip.BubbleText label={label}>{label}</Tooltip.BubbleText>
    </Tooltip.Outer>
  )
}
