import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import {type ViewToken, View} from 'react-native'
import {Trans, useLingui} from '@lingui/react/macro'

import {useLanguagePrefs} from '#/state/preferences/languages'
import {atoms as a, native, useTheme, web} from '#/alf'
import {Button, ButtonIcon} from '#/components/Button'
import * as Dialog from '#/components/Dialog'
import {TimesLarge_Stroke2_Corner0_Rounded as XIcon} from '#/components/icons/Times'
import {Text} from '#/components/Typography'
import {IS_WEB} from '#/env'
import {CHANGELOG, CHANGELOG_VERSIONS} from './changelog.generated'
import {Markdown} from './Markdown'

type WhatsNewControl = {
  open: () => void
  control: Dialog.DialogControlProps
}

const Context = createContext<WhatsNewControl | null>(null)

/**
 * Resolve the changelog markdown for a version, following the user's app
 * language and falling back through base language to English.
 */
function resolveChangelog(version: string, appLanguage: string): string {
  const byLocale = CHANGELOG[version] ?? {}
  const base = appLanguage.split('-')[0]
  return (
    byLocale[appLanguage] ??
    byLocale[base] ??
    byLocale.en ??
    Object.values(byLocale)[0] ??
    ''
  )
}

export function Provider({children}: {children: React.ReactNode}) {
  const control = Dialog.useDialogControl()
  const value = useMemo<WhatsNewControl>(
    () => ({open: () => control.open(), control}),
    [control],
  )
  return (
    <Context.Provider value={value}>
      {children}
      <WhatsNewDialog control={control} />
    </Context.Provider>
  )
}

/** Open the What's New flyout from anywhere within the Provider. */
export function useWhatsNew(): WhatsNewControl {
  const ctx = useContext(Context)
  if (!ctx) {
    throw new Error('useWhatsNew must be used within the WhatsNew Provider')
  }
  return ctx
}

function WhatsNewDialog({control}: {control: Dialog.DialogControlProps}) {
  return (
    <Dialog.Outer control={control}>
      <Dialog.Handle />
      <WhatsNewInner control={control} />
    </Dialog.Outer>
  )
}

function WhatsNewInner({control}: {control: Dialog.DialogControlProps}) {
  const t = useTheme()
  const {t: l} = useLingui()
  const {appLanguage} = useLanguagePrefs()
  const [activeVersion, setActiveVersion] = useState(
    CHANGELOG_VERSIONS[0] ?? '',
  )

  // onViewableItemsChanged / viewabilityConfig must be stable across renders.
  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      const top = viewableItems[0]?.item as string | undefined
      if (top) setActiveVersion(top)
    },
  ).current
  const viewabilityConfig = useRef({itemVisiblePercentThreshold: 10}).current

  const listHeader = (
    <View
      style={[
        native(a.pt_2xl),
        web(a.pt_lg),
        a.pb_sm,
        a.px_lg,
        a.border_b,
        t.atoms.border_contrast_low,
        t.atoms.bg,
      ]}>
      <View style={[a.relative, a.align_center, a.justify_center]}>
        <Text
          style={[
            a.text_lg,
            a.font_bold,
            a.leading_tight,
            a.text_center,
            t.atoms.text_contrast_high,
          ]}>
          <Trans>What's new in version {activeVersion}</Trans>
        </Text>
        {IS_WEB && (
          <Button
            label={l`Close`}
            size="small"
            shape="round"
            variant="ghost"
            color="secondary"
            style={[a.absolute, a.z_20, {right: -4}]}
            onPress={() => control.close()}>
            <ButtonIcon icon={XIcon} size="md" />
          </Button>
        )}
      </View>
    </View>
  )

  return (
    <Dialog.InnerFlatList
      data={CHANGELOG_VERSIONS}
      keyExtractor={(version: string) => version}
      renderItem={({item: version}: {item: string}) => (
        <View
          style={[
            a.px_lg,
            a.py_lg,
            a.border_b,
            t.atoms.border_contrast_low,
          ]}>
          <Markdown source={resolveChangelog(version, appLanguage)} />
        </View>
      )}
      ListHeaderComponent={listHeader}
      stickyHeaderIndices={[0]}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      style={[
        web([a.py_0, a.px_0, {height: '100vh', maxHeight: 600}]),
        native({height: '100%'}),
      ]}
      webInnerStyle={[a.py_0, {maxWidth: 500, minWidth: 200}]}
      webInnerContentContainerStyle={a.py_0}
    />
  )
}
