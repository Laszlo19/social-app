import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'
import {Trans} from '@lingui/react/macro'

import {
  type CommonNavigatorParams,
  type NativeStackScreenProps,
} from '#/lib/routes/types'
import {atoms as a} from '#/alf'
import {useDisplayPrefs} from '#/state/preferences'
import {Admonition} from '#/components/Admonition'
import * as SegmentedControl from '#/components/forms/SegmentedControl'
import * as Toggle from '#/components/forms/Toggle'
import {EyeSlash_Stroke2_Corner0_Rounded as EyeSlashIcon} from '#/components/icons/EyeSlash'
import {HashtagWide_Stroke1_Corner0_Rounded as HashIcon} from '#/components/icons/Hashtag'
import * as Layout from '#/components/Layout'
import {device, useStorage} from '#/storage'
import * as SettingsList from './components/SettingsList'

type Props = NativeStackScreenProps<
  CommonNavigatorParams,
  'CountsMetricsSettings'
>
export function CountsMetricsSettingsScreen({}: Props) {
  const {_} = useLingui()
  const {witchskyEnabled} = useDisplayPrefs()

  const [hidePostCounts, setHidePostCounts] = useStorage(device, [
    'hidePostCounts',
  ])
  const [hideProfileCounts, setHideProfileCounts] = useStorage(device, [
    'hideProfileCounts',
  ])
  const [hideFollowsYou, setHideFollowsYou] = useStorage(device, [
    'hideFollowsYou',
  ])
  const [countsFormat, setCountsFormat] = useStorage(device, ['countsFormat'])

  return (
    <Layout.Screen testID="countsMetricsSettingsScreen">
      <Layout.Header.Outer>
        <Layout.Header.BackButton />
        <Layout.Header.Content>
          <Layout.Header.TitleText>
            <Trans>Counts & metrics</Trans>
          </Layout.Header.TitleText>
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <Layout.Content>
        <Admonition type="tip" style={[a.mx_lg, a.my_md]}>
          <Trans>
            Hide engagement numbers for a calmer experience. This only changes
            what you see.
          </Trans>
        </Admonition>

        <SettingsList.Container>
          {!!witchskyEnabled && <SettingsList.Group iconInset={false}>
            <SettingsList.ItemIcon icon={EyeSlashIcon} />
            <SettingsList.ItemText>
              <Trans>Hide counts</Trans>
            </SettingsList.ItemText>
            <Toggle.Item
              type="checkbox"
              name="hide-post-counts"
              label={_(msg`Hide post engagement counts`)}
              value={!!hidePostCounts}
              onChange={value => setHidePostCounts(value)}
              style={[a.w_full, a.gap_md]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Hide like, repost and reply counts on posts</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
            <Toggle.Item
              type="checkbox"
              name="hide-profile-counts"
              label={_(msg`Hide profile counts`)}
              value={!!hideProfileCounts}
              onChange={value => setHideProfileCounts(value)}
              style={[a.w_full, a.gap_md]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Hide follower, following and post counts</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
            <Toggle.Item
              type="checkbox"
              name="hide-follows-you"
              label={_(msg`Hide the “Follows you” label`)}
              value={!!hideFollowsYou}
              onChange={value => setHideFollowsYou(value)}
              style={[a.w_full, a.gap_md]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Hide the “Follows you” label on profiles</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
          </SettingsList.Group>}

          {!!witchskyEnabled && <><SettingsList.Divider />

          <SettingsList.Group contentContainerStyle={[a.gap_sm]} iconInset={false}>
            <SettingsList.ItemIcon icon={HashIcon} />
            <SettingsList.ItemText>
              <Trans>Count format</Trans>
            </SettingsList.ItemText>
            <SegmentedControl.Root
              type="radio"
              label={_(msg`Count format`)}
              value={countsFormat ?? 'default'}
              onChange={value =>
                setCountsFormat(
                  value as 'default' | 'lite' | 'exact',
                )
              }>
              <SegmentedControl.Item
                label={_(msg`Default`)}
                value="default">
                <SegmentedControl.ItemText>
                  <Trans>Default</Trans>
                </SegmentedControl.ItemText>
              </SegmentedControl.Item>
              <SegmentedControl.Item label={_(msg`Lite`)} value="lite">
                <SegmentedControl.ItemText>
                  <Trans>Lite</Trans>
                </SegmentedControl.ItemText>
              </SegmentedControl.Item>
              <SegmentedControl.Item label={_(msg`Exact`)} value="exact">
                <SegmentedControl.ItemText>
                  <Trans>Exact</Trans>
                </SegmentedControl.ItemText>
              </SegmentedControl.Item>
            </SegmentedControl.Root>
          </SettingsList.Group></>}
        </SettingsList.Container>
      </Layout.Content>
    </Layout.Screen>
  )
}
