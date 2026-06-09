import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'
import {Trans} from '@lingui/react/macro'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'

import {type CommonNavigatorParams} from '#/lib/routes/types'
import * as SettingsList from '#/screens/Settings/components/SettingsList'
import {device, useStorage} from '#/storage'
import {atoms as a} from '#/alf'
import {Admonition} from '#/components/Admonition'
import * as Toggle from '#/components/forms/Toggle'
import {Beaker_Stroke2_Corner2_Rounded as BeakerIcon} from '#/components/icons/Beaker'
import * as Layout from '#/components/Layout'

type Props = NativeStackScreenProps<
  CommonNavigatorParams,
  'ExperimentalFeaturesSettings'
>
export function ExperimentalFeaturesSettingsScreen({}: Props) {
  const {_} = useLingui()
  const [galleryFallback, setGalleryFallback] = useStorage(device, [
    'experimentalGalleryFallback',
  ])

  return (
    <Layout.Screen>
      <Layout.Header.Outer>
        <Layout.Header.BackButton />
        <Layout.Header.Content>
          <Layout.Header.TitleText>
            <Trans>Experimental features</Trans>
          </Layout.Header.TitleText>
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <Layout.Content>
        <SettingsList.Container>
          <Admonition type="warning" style={[a.mx_lg]}>
            <Trans>
              These features are experimental and may change or break at any
              time.
            </Trans>
          </Admonition>

          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={BeakerIcon} />
            <SettingsList.ItemText>
              <Trans>Gallery fallback</Trans>
            </SettingsList.ItemText>
            <Toggle.Item
              name="gallery_fallback"
              label={_(
                msg`Show the update-your-app fallback for galleries with 5+ photos`,
              )}
              value={!!galleryFallback}
              onChange={value => setGalleryFallback(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>
                  Show the fallback for galleries (5+ photos) instead of the
                  carousel
                </Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
          </SettingsList.Group>
        </SettingsList.Container>
      </Layout.Content>
    </Layout.Screen>
  )
}
