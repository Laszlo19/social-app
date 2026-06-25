import {useState} from 'react'
import {View} from 'react-native'
import Animated, {
  type AnimatedRef,
  type SharedValue,
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
  MAX_LEFT_NAV,
  MAX_QUICK_ACTIONS,
  MAX_VISIBLE,
  type NavCatalogItem,
  type NavSurface,
  useNavItems,
} from '#/features/customNav'
import {atoms as a, useTheme} from '#/alf'
import {Admonition} from '#/components/Admonition'
import {Button, ButtonIcon} from '#/components/Button'
import {SortableList} from '#/components/DraggableList'
import {PlusLarge_Stroke2_Corner0_Rounded as PlusIcon} from '#/components/icons/Plus'
import {TimesLarge_Stroke2_Corner0_Rounded as XIcon} from '#/components/icons/Times'
import * as Layout from '#/components/Layout'
import {Text} from '#/components/Typography'
import {IS_ANDROID} from '#/env'
import * as SettingsList from './components/SettingsList'

const ITEM_HEIGHT = 56

type Props = NativeStackScreenProps<
  CommonNavigatorParams,
  'NavigationBarSettings'
>
export function NavigationBarSettingsScreen({}: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const scrollOffset = useScrollViewOffset(scrollRef)

  return (
    <Layout.Screen testID="navigationBarSettingsScreen">
      <Layout.Header.Outer>
        <Layout.Header.BackButton />
        <Layout.Header.Content>
          <Layout.Header.TitleText>
            <Trans>Navigation</Trans>
          </Layout.Header.TitleText>
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <Layout.Content ref={scrollRef} scrollEnabled={!isDragging}>
        <Admonition type="tip" style={[a.mx_lg, a.my_md]}>
          <Trans>
            Choose which items appear in each navigation bar and drag to reorder
            them. Hidden items stay reachable from the menu.
          </Trans>
        </Admonition>

        <NavEditor
          surface="bottomBar"
          max={MAX_VISIBLE}
          title={<Trans>Bottom bar (mobile)</Trans>}
          scrollRef={scrollRef}
          scrollOffset={scrollOffset}
          setIsDragging={setIsDragging}
        />
        <NavEditor
          surface="leftNav"
          max={MAX_LEFT_NAV}
          title={<Trans>Sidebar (desktop)</Trans>}
          scrollRef={scrollRef}
          scrollOffset={scrollOffset}
          setIsDragging={setIsDragging}
        />
        {IS_ANDROID && (
          <NavEditor
            surface="quickActions"
            max={MAX_QUICK_ACTIONS}
            title={<Trans>Launcher shortcuts</Trans>}
            scrollRef={scrollRef}
            scrollOffset={scrollOffset}
            setIsDragging={setIsDragging}
          />
        )}
      </Layout.Content>
    </Layout.Screen>
  )
}

function NavEditor({
  surface,
  max,
  title,
  scrollRef,
  scrollOffset,
  setIsDragging,
}: {
  surface: NavSurface
  max: number
  title: React.ReactNode
  scrollRef: AnimatedRef<Animated.ScrollView>
  scrollOffset: SharedValue<number>
  setIsDragging: (v: boolean) => void
}) {
  const {_} = useLingui()
  const {visible, available, canAdd, canRemove, setOrder, show, hide, reset} =
    useNavItems(surface)

  const labelOf = (item: NavCatalogItem) =>
    _(surface === 'leftNav' ? (item.leftNavLabel ?? item.label) : item.label)

  return (
    <SettingsList.Container>
      <SurfaceHeader>{title}</SurfaceHeader>

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
            label={labelOf(item)}
            dragHandle={dragHandle}
            canRemove={canRemove}
            onRemove={() => hide(item.id)}
          />
        )}
      />

      {available.length > 0 && (
        <>
          <SectionHeader>
            <Trans>Available</Trans>
          </SectionHeader>
          {!canAdd && (
            <Text style={[a.px_lg, a.pb_sm, a.text_sm, a.leading_snug]}>
              <Trans>
                You can show up to {max} items. Remove one to add another.
              </Trans>
            </Text>
          )}
          {available.map(item => (
            <AvailableRow
              key={item.id}
              item={item}
              label={labelOf(item)}
              canAdd={canAdd}
              onAdd={() => show(item.id)}
            />
          ))}
        </>
      )}

      <SettingsList.Divider />
      <SettingsList.PressableItem
        label={_(msg`Reset to default`)}
        testID={`navBarSettings-reset-${surface}`}
        onPress={() => reset()}>
        <SettingsList.ItemText>
          <Trans>Reset to default</Trans>
        </SettingsList.ItemText>
      </SettingsList.PressableItem>
    </SettingsList.Container>
  )
}

function SurfaceHeader({children}: {children: React.ReactNode}) {
  const t = useTheme()
  return (
    <Text style={[a.px_lg, a.pt_xl, a.pb_xs, a.text_lg, a.font_bold, t.atoms.text]}>
      {children}
    </Text>
  )
}

function SectionHeader({children}: {children: React.ReactNode}) {
  const t = useTheme()
  return (
    <Text
      style={[
        a.px_lg,
        a.pt_md,
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
  label,
  dragHandle,
  canRemove,
  onRemove,
}: {
  item: NavCatalogItem
  label: string
  dragHandle: React.ReactNode
  canRemove: boolean
  onRemove: () => void
}) {
  const t = useTheme()
  const {_} = useLingui()
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
  label,
  canAdd,
  onAdd,
}: {
  item: NavCatalogItem
  label: string
  canAdd: boolean
  onAdd: () => void
}) {
  const t = useTheme()
  const {_} = useLingui()
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
