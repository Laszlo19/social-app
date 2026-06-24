import {useState} from 'react'
import {View} from 'react-native'
import Animated, {
  useAnimatedRef,
  useScrollViewOffset,
} from 'react-native-reanimated'
import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'
import {Trans} from '@lingui/react/macro'

import {
  type CommonNavigatorParams,
  type NativeStackScreenProps,
} from '#/lib/routes/types'
import {
  MAX_VISIBLE,
  type NavCatalogItem,
  useBottomBarItems,
} from '#/features/customNav'
import {atoms as a, useTheme} from '#/alf'
import {Admonition} from '#/components/Admonition'
import {Button, ButtonIcon} from '#/components/Button'
import {SortableList} from '#/components/DraggableList'
import {PlusLarge_Stroke2_Corner0_Rounded as PlusIcon} from '#/components/icons/Plus'
import {TimesLarge_Stroke2_Corner0_Rounded as XIcon} from '#/components/icons/Times'
import * as Layout from '#/components/Layout'
import {Text} from '#/components/Typography'
import * as SettingsList from './components/SettingsList'

const ITEM_HEIGHT = 56

type Props = NativeStackScreenProps<
  CommonNavigatorParams,
  'NavigationBarSettings'
>
export function NavigationBarSettingsScreen({}: Props) {
  const {_} = useLingui()
  const {visible, available, canAdd, canRemove, setOrder, show, hide, reset} =
    useBottomBarItems()
  const [isDragging, setIsDragging] = useState(false)

  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const scrollOffset = useScrollViewOffset(scrollRef)

  return (
    <Layout.Screen testID="navigationBarSettingsScreen">
      <Layout.Header.Outer>
        <Layout.Header.BackButton />
        <Layout.Header.Content>
          <Layout.Header.TitleText>
            <Trans>Navigation bar</Trans>
          </Layout.Header.TitleText>
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <Layout.Content ref={scrollRef} scrollEnabled={!isDragging}>
        <Admonition type="tip" style={[a.mx_lg, a.my_md]}>
          <Trans>
            Choose which items appear in the bottom bar and drag to reorder
            them. Hidden items stay reachable from the menu.
          </Trans>
        </Admonition>

        <SettingsList.Container>
          <SectionHeader>
            <Trans>Shown</Trans>
          </SectionHeader>

          <SortableList
            data={visible}
            keyExtractor={item => item.id}
            itemHeight={ITEM_HEIGHT}
            scrollRef={scrollRef}
            scrollOffset={scrollOffset}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            onReorder={reordered => setOrder(reordered.map(item => item.id))}
            renderItem={(item, dragHandle) => (
              <ShownRow
                item={item}
                dragHandle={dragHandle}
                canRemove={canRemove}
                onRemove={() => hide(item.id)}
              />
            )}
          />

          {available.length > 0 && (
            <>
              <SettingsList.Divider />
              <SectionHeader>
                <Trans>Available</Trans>
              </SectionHeader>

              {!canAdd && (
                <Text
                  style={[a.px_xl, a.pb_sm, a.text_sm, a.leading_snug]}
                  emoji={false}>
                  <Trans>
                    You can show up to {MAX_VISIBLE} items. Remove one to add
                    another.
                  </Trans>
                </Text>
              )}

              {available.map(item => (
                <AvailableRow
                  key={item.id}
                  item={item}
                  canAdd={canAdd}
                  onAdd={() => show(item.id)}
                />
              ))}
            </>
          )}

          <SettingsList.Divider />
          <SettingsList.PressableItem
            label={_(msg`Reset to default`)}
            testID="navBarSettings-reset"
            onPress={() => reset()}>
            <SettingsList.ItemText>
              <Trans>Reset to default</Trans>
            </SettingsList.ItemText>
          </SettingsList.PressableItem>
        </SettingsList.Container>
      </Layout.Content>
    </Layout.Screen>
  )
}

function SectionHeader({children}: {children: React.ReactNode}) {
  const t = useTheme()
  return (
    <Text
      style={[
        a.px_lg,
        a.pt_lg,
        a.pb_xs,
        a.text_sm,
        a.font_bold,
        t.atoms.text_contrast_medium,
      ]}>
      {children}
    </Text>
  )
}

function ShownRow({
  item,
  dragHandle,
  canRemove,
  onRemove,
}: {
  item: NavCatalogItem
  dragHandle: React.ReactNode
  canRemove: boolean
  onRemove: () => void
}) {
  const t = useTheme()
  const {_} = useLingui()
  const label = _(item.label)
  const Icon = item.icons.inactive

  return (
    <View
      testID={`navBarSettings-shown-${item.id}`}
      style={[
        a.flex_row,
        a.align_center,
        a.gap_sm,
        a.px_lg,
        t.atoms.bg,
        {height: ITEM_HEIGHT},
      ]}>
      {dragHandle}
      <Icon width={24} style={t.atoms.text} />
      <Text style={[a.flex_1, a.text_md]} numberOfLines={1}>
        {label}
      </Text>
      <Button
        label={_(msg`Remove ${label} from the bar`)}
        testID={`navBarSettings-remove-${item.id}`}
        size="small"
        color="secondary"
        shape="round"
        disabled={!canRemove}
        onPress={onRemove}>
        <ButtonIcon icon={XIcon} />
      </Button>
    </View>
  )
}

function AvailableRow({
  item,
  canAdd,
  onAdd,
}: {
  item: NavCatalogItem
  canAdd: boolean
  onAdd: () => void
}) {
  const t = useTheme()
  const {_} = useLingui()
  const label = _(item.label)
  const Icon = item.icons.inactive

  return (
    <View
      testID={`navBarSettings-available-${item.id}`}
      style={[
        a.flex_row,
        a.align_center,
        a.gap_sm,
        a.px_lg,
        t.atoms.bg,
        {height: ITEM_HEIGHT},
      ]}>
      <Icon width={24} style={t.atoms.text_contrast_medium} />
      <Text
        style={[a.flex_1, a.text_md, t.atoms.text_contrast_medium]}
        numberOfLines={1}>
        {label}
      </Text>
      <Button
        label={_(msg`Add ${label} to the bar`)}
        testID={`navBarSettings-add-${item.id}`}
        size="small"
        color="secondary"
        shape="round"
        disabled={!canAdd}
        onPress={onAdd}>
        <ButtonIcon icon={PlusIcon} />
      </Button>
    </View>
  )
}
