import {useMemo} from 'react'
import {Pressable, View} from 'react-native'
import {Trans, useLingui} from '@lingui/react/macro'

import {useLanguagePrefs} from '#/state/preferences'
import {Nux, useNux, useSaveNux} from '#/state/queries/nuxs'
import {atoms as a, select, useTheme} from '#/alf'
import {useDialogControl} from '#/components/Dialog'
import {Earth_Stroke2_Corner2_Rounded as GlobeIcon} from '#/components/icons/Globe'
import {TimesLarge_Stroke2_Corner0_Rounded as X} from '#/components/icons/Times'
import {LocalizationHelpDialog} from '#/components/localization/LocalizationHelpDialog'
import {Text} from '#/components/Typography'

/**
 * Whether the feed banner nudging users to help translate should show. Gated to
 * users whose app language is not the source language (English), since they are
 * the ones a translation would help. Dismiss is persisted via a NUX id.
 */
export function useInternalState() {
  const langPrefs = useLanguagePrefs()
  const {nux} = useNux(Nux.LocalizationHelpBanner)
  const {mutate: save, variables} = useSaveNux()
  const hidden = !!variables

  const visible = useMemo(() => {
    if (langPrefs.appLanguage.split('-')[0] === 'en') return false
    if (hidden) return false
    if (nux && nux.completed) return false
    return true
  }, [langPrefs.appLanguage, hidden, nux])

  const close = () => {
    save({
      id: Nux.LocalizationHelpBanner,
      completed: true,
      data: undefined,
    })
  }

  return {visible, close}
}

export function LocalizationHelpBanner() {
  const t = useTheme()
  const {t: l} = useLingui()
  const {visible, close} = useInternalState()
  const control = useDialogControl()

  return (
    <>
      {visible && (
        <View
          style={[
            a.px_lg,
            {
              paddingVertical: 10,
              backgroundColor: select(t.name, {
                light: t.palette.primary_25,
                dark: t.palette.primary_25,
                dim: t.palette.primary_25,
              }),
            },
          ]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={l`Help translate the app`}
            accessibilityHint={l`Opens details about joining the localization project`}
            onPress={() => control.open()}
            style={[a.w_full, a.flex_row, a.justify_between, a.align_center, a.gap_md]}>
            <View
              style={[
                a.align_center,
                a.justify_center,
                a.rounded_full,
                {
                  width: 42,
                  height: 42,
                  backgroundColor: select(t.name, {
                    light: t.palette.primary_100,
                    dark: t.palette.primary_100,
                    dim: t.palette.primary_100,
                  }),
                },
              ]}>
              <GlobeIcon size="lg" fill={t.palette.primary_600} />
            </View>

            <View style={[a.flex_1, {paddingRight: 40}]}>
              <View style={{maxWidth: 400}}>
                <Text style={[a.leading_snug]}>
                  <Trans>
                    Help translate the app into your language – tap to learn how.
                  </Trans>
                </Text>
              </View>
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={l`Don't show again`}
            onPress={close}
            style={[
              a.absolute,
              a.justify_center,
              a.align_center,
              {
                top: 0,
                bottom: 0,
                right: 0,
                paddingRight: a.px_md.paddingLeft,
              },
            ]}>
            <X width={20} fill={t.palette.primary_600} />
          </Pressable>
        </View>
      )}

      {/*
       * Mounted alongside the banner so the dialog stays usable; it is only
       * reachable while the (visible) banner is rendered as a feed row.
       */}
      <LocalizationHelpDialog control={control} />
    </>
  )
}
