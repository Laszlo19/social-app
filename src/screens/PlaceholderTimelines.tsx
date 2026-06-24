import {View} from 'react-native'
import {Trans} from '@lingui/react/macro'

import {
  type CommonNavigatorParams,
  type NativeStackScreenProps,
} from '#/lib/routes/types'
import {atoms as a, useTheme} from '#/alf'
import {Earth_Stroke2_Corner0_Rounded as EarthIcon} from '#/components/icons/Earth'
import {GroupTwo_Stroke2_Corner0_Rounded as GroupIcon} from '#/components/icons/GroupTwo'
import {type Props as SVGIconProps} from '#/components/icons/common'
import * as Layout from '#/components/Layout'
import {Text} from '#/components/Typography'

/**
 * Placeholder timeline screens (Federated / Local) reachable from the
 * customizable nav. These are intentionally empty - for testing the nav
 * customization only, not real timelines.
 */
function EmptyTimeline({
  title,
  icon: Icon,
}: {
  title: React.ReactNode
  icon: React.ComponentType<SVGIconProps>
}) {
  const t = useTheme()
  return (
    <Layout.Screen>
      <Layout.Header.Outer>
        <Layout.Header.BackButton />
        <Layout.Header.Content>
          <Layout.Header.TitleText>{title}</Layout.Header.TitleText>
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <Layout.Content>
        <View
          style={[
            a.align_center,
            a.justify_center,
            a.gap_md,
            a.px_xl,
            {paddingVertical: 96},
          ]}>
          <Icon width={48} fill={t.atoms.text_contrast_low.color} />
          <Text style={[a.text_lg, a.font_bold, t.atoms.text_contrast_medium]}>
            <Trans>Nothing here</Trans>
          </Text>
          <Text style={[a.text_sm, a.text_center, t.atoms.text_contrast_low]}>
            <Trans>This is a placeholder for testing only.</Trans>
          </Text>
        </View>
      </Layout.Content>
    </Layout.Screen>
  )
}

type FederatedProps = NativeStackScreenProps<CommonNavigatorParams, 'Federated'>
export function FederatedScreen({}: FederatedProps) {
  return <EmptyTimeline title={<Trans>Federated</Trans>} icon={EarthIcon} />
}

type LocalProps = NativeStackScreenProps<CommonNavigatorParams, 'Local'>
export function LocalScreen({}: LocalProps) {
  return <EmptyTimeline title={<Trans>Local</Trans>} icon={GroupIcon} />
}
