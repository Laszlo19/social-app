import {useCallback} from 'react'
import {View} from 'react-native'
import Animated, {
  FadeInUp,
  FadeOutUp,
  LayoutAnimationConfig,
  LinearTransition,
} from 'react-native-reanimated'
import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'
import {Trans} from '@lingui/react/macro'

import {
  type CommonNavigatorParams,
  type NativeStackScreenProps,
} from '#/lib/routes/types'
import {useSetThemePrefs, useThemePrefs} from '#/state/shell'
import {SettingsListItem as AppIconSettingsListItem} from '#/screens/Settings/AppIconSettings/SettingsListItem'
import {type Alf, atoms as a, native, useAlf, useTheme} from '#/alf'
import {Bars3_Stroke2_Corner0_Rounded as BarsIcon} from '#/components/icons/Bars'
import * as SegmentedControl from '#/components/forms/SegmentedControl'
import * as TextField from '#/components/forms/TextField'
import * as Toggle from '#/components/forms/Toggle'
import {type Props as SVGIconProps} from '#/components/icons/common'
import {Group3_Stroke2_Corner0_Rounded as GroupIcon} from '#/components/icons/Group'
import {Moon_Stroke2_Corner0_Rounded as MoonIcon} from '#/components/icons/Moon'
import {Phone_Stroke2_Corner0_Rounded as PhoneIcon} from '#/components/icons/Phone'
import {TextSize_Stroke2_Corner0_Rounded as TextSize} from '#/components/icons/TextSize'
import {TitleCase_Stroke2_Corner0_Rounded as Aa} from '#/components/icons/TitleCase'
import * as Layout from '#/components/Layout'
import {Text} from '#/components/Typography'
import {device, useStorage} from '#/storage'
import {IS_NATIVE} from '#/env'
import * as SettingsList from './components/SettingsList'

type Props = NativeStackScreenProps<CommonNavigatorParams, 'AppearanceSettings'>
export function AppearanceSettingsScreen({}: Props) {
  const {_} = useLingui()
  const {fonts} = useAlf()

  const {colorMode, darkTheme} = useThemePrefs()
  const {setColorMode, setDarkTheme} = useSetThemePrefs()

  const [mutualsLabel, setMutualsLabel] = useStorage(device, ['mutualsLabel'])
  const [postWord, setPostWord] = useStorage(device, ['postWord'])
  const [squareAvatars, setSquareAvatars] = useStorage(device, [
    'squareAvatars',
  ])

  const onChangeAppearance = useCallback(
    (value: 'light' | 'system' | 'dark') => {
      setColorMode(value)
    },
    [setColorMode],
  )

  const onChangeDarkTheme = useCallback(
    (value: 'dim' | 'dark') => {
      setDarkTheme(value)
    },
    [setDarkTheme],
  )

  const onChangeFontFamily = useCallback(
    (value: 'system' | 'theme') => {
      fonts.setFontFamily(value)
    },
    [fonts],
  )

  const onChangeFontScale = useCallback(
    (value: Alf['fonts']['scale']) => {
      fonts.setFontScale(value)
    },
    [fonts],
  )

  return (
    <LayoutAnimationConfig skipExiting skipEntering>
      <Layout.Screen testID="preferencesThreadsScreen">
        <Layout.Header.Outer>
          <Layout.Header.BackButton />
          <Layout.Header.Content>
            <Layout.Header.TitleText>
              <Trans>Appearance</Trans>
            </Layout.Header.TitleText>
          </Layout.Header.Content>
          <Layout.Header.Slot />
        </Layout.Header.Outer>
        <Layout.Content>
          <SettingsList.Container>
            <AppearanceToggleButtonGroup
              title={_(msg`Color mode`)}
              icon={PhoneIcon}
              items={[
                {
                  label: _(msg`System`),
                  name: 'system',
                },
                {
                  label: _(msg`Light`),
                  name: 'light',
                },
                {
                  label: _(msg`Dark`),
                  name: 'dark',
                },
              ]}
              value={colorMode}
              onChange={onChangeAppearance}
            />

            {colorMode !== 'light' && (
              <Animated.View
                entering={native(FadeInUp)}
                exiting={native(FadeOutUp)}>
                <AppearanceToggleButtonGroup
                  title={_(msg`Dark theme`)}
                  icon={MoonIcon}
                  items={[
                    {
                      label: _(msg`Dim`),
                      name: 'dim',
                    },
                    {
                      label: _(msg`Dark`),
                      name: 'dark',
                    },
                  ]}
                  value={darkTheme ?? 'dim'}
                  onChange={onChangeDarkTheme}
                />
              </Animated.View>
            )}

            <Animated.View layout={native(LinearTransition)}>
              <SettingsList.Divider />

              <AppearanceToggleButtonGroup
                title={_(msg`Font`)}
                description={_(
                  msg`For the best experience, we recommend using the theme font.`,
                )}
                icon={Aa}
                items={[
                  {
                    label: _(msg`System`),
                    name: 'system',
                  },
                  {
                    label: _(msg`Theme`),
                    name: 'theme',
                  },
                ]}
                value={fonts.family}
                onChange={onChangeFontFamily}
              />

              <AppearanceToggleButtonGroup
                title={_(msg`Font size`)}
                icon={TextSize}
                items={[
                  {
                    label: _(msg`Smaller`),
                    name: '-1',
                  },
                  {
                    label: _(msg`Default`),
                    name: '0',
                  },
                  {
                    label: _(msg`Larger`),
                    name: '1',
                  },
                ]}
                value={fonts.scale}
                onChange={onChangeFontScale}
              />

              {IS_NATIVE && (
                <>
                  <SettingsList.Divider />
                  <AppIconSettingsListItem />
                </>
              )}

              <SettingsList.Divider />
              <SettingsList.LinkItem
                to="/settings/navigation"
                label={_(msg`Navigation bar`)}>
                <SettingsList.ItemIcon icon={BarsIcon} />
                <SettingsList.ItemText>
                  <Trans>Navigation bar</Trans>
                </SettingsList.ItemText>
              </SettingsList.LinkItem>

              <SettingsList.Divider />
              <SettingsList.Group iconInset={false}>
                <SettingsList.ItemIcon icon={GroupIcon} />
                <SettingsList.ItemText>
                  <Trans>Profiles</Trans>
                </SettingsList.ItemText>
                <Toggle.Item
                  type="checkbox"
                  name="mutuals-label"
                  label={_(msg`Show “Mutuals” instead of “Following”`)}
                  value={!!mutualsLabel}
                  onChange={value => setMutualsLabel(value)}
                  style={[a.w_full, a.gap_md]}>
                  <Toggle.LabelText style={[a.flex_1]}>
                    <Trans>
                      Show “Mutuals” instead of “Following” on profiles you
                      mutually follow
                    </Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>
                <Toggle.Item
                  type="checkbox"
                  name="square-avatars"
                  label={_(msg`Use square avatars`)}
                  value={!!squareAvatars}
                  onChange={value => setSquareAvatars(value)}
                  style={[a.w_full, a.gap_md]}>
                  <Toggle.LabelText style={[a.flex_1]}>
                    <Trans>Use square avatars instead of circular</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>
              </SettingsList.Group>

              <SettingsList.Divider />
              <SettingsList.Group iconInset={false}>
                <SettingsList.ItemIcon icon={Aa} />
                <SettingsList.ItemText>
                  <Trans>Post button text</Trans>
                </SettingsList.ItemText>
                <View style={[a.w_full, a.px_lg, a.pb_sm]}>
                  <TextField.Root>
                    <TextField.Input
                      label={_(msg`Post button text`)}
                      placeholder={_(msg`Post`)}
                      defaultValue={postWord ?? ''}
                      onChangeText={text => setPostWord(text)}
                      autoCapitalize="none"
                    />
                  </TextField.Root>
                </View>
              </SettingsList.Group>
            </Animated.View>
          </SettingsList.Container>
        </Layout.Content>
      </Layout.Screen>
    </LayoutAnimationConfig>
  )
}

export function AppearanceToggleButtonGroup<T extends string>({
  title,
  description,
  icon: Icon,
  items,
  value,
  onChange,
}: {
  title: string
  description?: string
  icon: React.ComponentType<SVGIconProps>
  items: {
    label: string
    name: T
  }[]
  value: T
  onChange: (value: T) => void
}) {
  const t = useTheme()
  return (
    <>
      <SettingsList.Group contentContainerStyle={[a.gap_sm]} iconInset={false}>
        <SettingsList.ItemIcon icon={Icon} />
        <SettingsList.ItemText>{title}</SettingsList.ItemText>
        {description && (
          <Text
            style={[
              a.text_sm,
              a.leading_snug,
              t.atoms.text_contrast_medium,
              a.w_full,
            ]}>
            {description}
          </Text>
        )}
        <SegmentedControl.Root
          type="radio"
          label={title}
          value={value}
          onChange={onChange}>
          {items.map(item => (
            <SegmentedControl.Item
              key={item.name}
              label={item.label}
              value={item.name}>
              <SegmentedControl.ItemText>
                {item.label}
              </SegmentedControl.ItemText>
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </SettingsList.Group>
    </>
  )
}
