import {useEffect, useState} from 'react'
import {View} from 'react-native'
import {Trans, useLingui} from '@lingui/react/macro'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'

import {BLUESKY_PROXY_HEADER} from '#/lib/constants'
import {type CommonNavigatorParams} from '#/lib/routes/types'
import {logger} from '#/logger'
import {
  usePreferencesQuery,
  useSetIsBetaUserMutation,
} from '#/state/queries/preferences'
import {useSession} from '#/state/session'
import {BetaFeaturesFeedbackDialog} from '#/screens/Settings/components/BetaFeaturesFeedbackDialog'
import * as SettingsList from '#/screens/Settings/components/SettingsList'
import {account, device, useStorage} from '#/storage'
import {atoms as a, useTheme} from '#/alf'
import {Admonition} from '#/components/Admonition'
import {Button, ButtonIcon, ButtonText} from '#/components/Button'
import * as Dialog from '#/components/Dialog'
import * as TextField from '#/components/forms/TextField'
import * as Toggle from '#/components/forms/Toggle'
import {BubbleInfo_Stroke2_Corner2_Rounded as BubbleInfoIcon} from '#/components/icons/BubbleInfo'
import * as Layout from '#/components/Layout'
import * as Toast from '#/components/Toast'
import {Text} from '#/components/Typography'
import {features, useAnalytics} from '#/analytics'
import {getTargetedFeatures} from '#/analytics/features'
import {IS_WEB} from '#/env'
import {account} from '#/storage'

/**
 * Fork device-storage keys turned on/off together by the Witchsky master toggle.
 */
const WITCHSKY_BOOL_KEYS = [
  'experimentalPdslsLinks',
  'experimentalBridgedFedi',
  'experimentalPdsBadge',
  'experimentalMultiAccount',
  'experimentalTestLiveEvent',
  'squareAvatars',
  'squareButtons',
  'mutualsLabel',
  'hideComposerPrompt',
  'hideLoadLatestButton',
  'noDiscoverFallback',
  'hidePostCounts',
  'hideProfileCounts',
  'hideFollowsYou',
] as const

type Props = NativeStackScreenProps<
  CommonNavigatorParams,
  'BetaFeaturesSettings'
>

export function BetaFeaturesSettingsScreen({}: Props) {
  const t = useTheme()
  const ax = useAnalytics()
  const {t: l, i18n} = useLingui()
  const {data: preferences} = usePreferencesQuery()
  const {currentAccount} = useSession()
  const {mutateAsync: setIsBetaUser} = useSetIsBetaUserMutation()
  const isBetaUser = preferences?.bskyAppState?.isBetaUser ?? false
  const [isPending, setIsPending] = useState(false)
  const feedbackControl = Dialog.useDialogControl()

  /*
   * `getTargetedFeatures` reads the GrowthBook singleton synchronously; gates
   * arrive asynchronously, so hold the result in state and re-read on refresh.
   */
  const [betaFeatures, setBetaFeatures] = useState(() =>
    getTargetedFeatures(i18n),
  )

  useEffect(() => {
    let cancelled = false
    void features.refresh({strategy: 'prefer-fresh-gates'}).then(() => {
      if (!cancelled) setBetaFeatures(getTargetedFeatures(i18n))
    })
    return () => {
      cancelled = true
    }
  }, [i18n])

  // Fork toggles (device storage). Gated by the beta master toggle below, and
  // the Witchsky subset additionally by the Witchsky master.
  const [witchskyEnabled, setWitchskyEnabled] = useStorage(device, [
    'witchskyEnabled',
  ])
  const [galleryFallback, setGalleryFallback] = useStorage(device, [
    'experimentalGalleryFallback',
  ])
  const [legacyContacts, setLegacyContacts] = useStorage(device, [
    'experimentalLegacyContacts',
  ])
  const [publicLikes, setPublicLikes] = useStorage(device, [
    'experimentalPublicLikes',
  ])
  const [forceJapanLogo, setForceJapanLogo] = useStorage(device, [
    'forceJapanLogo',
  ])
  const [forceKawaiiLogo, setForceKawaiiLogo] = useStorage(device, [
    'forceKawaiiLogo',
  ])
  const [pdslsLinks, setPdslsLinks] = useStorage(device, [
    'experimentalPdslsLinks',
  ])
  const [bridgedFedi, setBridgedFedi] = useStorage(device, [
    'experimentalBridgedFedi',
  ])
  const [pdsBadge, setPdsBadge] = useStorage(device, ['experimentalPdsBadge'])
  const [multiAccount, setMultiAccount] = useStorage(device, [
    'experimentalMultiAccount',
  ])
  const [testLiveEvent, setTestLiveEvent] = useStorage(device, [
    'experimentalTestLiveEvent',
  ])
  const [openRouterApiKey, setOpenRouterApiKey] = useStorage(device, [
    'openRouterApiKey',
  ])
  const [infraAppviewDid, setInfraAppviewDid] = useStorage(device, [
    'infraAppviewDid',
  ])

  const onChange = async (next: boolean) => {
    try {
      setIsPending(true)
      await setIsBetaUser(next)
      if (currentAccount) {
        account.set([currentAccount.did, 'isBetaUser'], next)
      }
      ax.metric('betaFeatures:toggle', {
        enabled: next,
        betaFeatureKeys: betaFeatures.map(feature => feature.key),
      })
    } catch (e) {
      logger.error('Failed to toggle beta features', {safeMessage: e})
      Toast.show(l`Something went wrong, please try again.`, {type: 'error'})
      setIsPending(false)
      return
    }
    setIsPending(false)
    /*
     * The toggle already succeeded; re-evaluate feature gates against the new
     * attribute in-session as a best-effort follow-up. A failure here should
     * not surface as a toggle error.
     */
    try {
      await features.refresh({strategy: 'prefer-fresh-gates'})
      setBetaFeatures(getTargetedFeatures(i18n))
    } catch {}
  }

  const onToggleWitchsky = (value: boolean) => {
    setWitchskyEnabled(value)
    if (value) {
      for (const key of WITCHSKY_BOOL_KEYS) {
        device.set([key], true)
      }
    } else {
      for (const key of WITCHSKY_BOOL_KEYS) {
        device.set([key], undefined)
      }
      device.set(['countsFormat'], undefined)
      device.set(['accentHue'], undefined)
      device.set(['postWord'], undefined)
    }
  }

  const onPressShareFeedback = () => {
    ax.metric('betaFeatures:feedback:open', {
      betaFeatureKeys: betaFeatures.map(feature => feature.key),
    })
    feedbackControl.open()
  }

  const canSubmitFeedback = !isPending && isBetaUser && betaFeatures.length > 0

  return (
    <Layout.Screen>
      <Layout.Header.Outer>
        <Layout.Header.BackButton />
        <Layout.Header.Content>
          <Layout.Header.TitleText>
            <Trans>Beta features</Trans>
          </Layout.Header.TitleText>
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <Layout.Content>
        <SettingsList.Container>
          <Toggle.Item
            name="enable_beta_features"
            label={l`Enable beta features`}
            value={isBetaUser}
            disabled={isPending}
            onChange={value => void onChange(value)}>
            <SettingsList.Item>
              <View style={[a.flex_1, a.gap_2xs]}>
                <SettingsList.ItemText style={[a.font_semi_bold]}>
                  <Trans>Enable beta features</Trans>
                </SettingsList.ItemText>
                <Text
                  style={[
                    a.text_sm,
                    a.leading_snug,
                    t.atoms.text_contrast_medium,
                  ]}>
                  <Trans>
                    Get early access to experimental features we're testing.
                    Controls the fork toggles below.
                  </Trans>
                </Text>
              </View>
              <Toggle.Platform />
            </SettingsList.Item>
          </Toggle.Item>

          <View style={[a.px_xl, a.gap_md]}>
            <Admonition type="info">
              {IS_WEB
                ? l({
                    message:
                      'Beta features may be unstable. Some changes may require reloading the app.',
                    context: 'web',
                  })
                : l({
                    message:
                      'Beta features may be unstable. Some changes may require restarting the app.',
                    context: 'native',
                  })}
            </Admonition>
          </View>

          {/* Fork features - gated by the beta master toggle above. */}
          {isBetaUser && (
            <>
              <FeatureToggle
                name="gallery_fallback"
                label={l`Gallery fallback`}
                title={<Trans>Gallery fallback</Trans>}
                description={
                  <Trans>
                    Show the update-your-app fallback for galleries with 5+
                    photos instead of the carousel.
                  </Trans>
                }
                value={!!galleryFallback}
                onChange={setGalleryFallback}
              />
              <FeatureToggle
                name="legacy_contacts"
                label={l`Find friends experience`}
                title={<Trans>Find friends experience</Trans>}
                description={
                  <Trans>
                    Use the legacy "Find friends from contacts" instead of "Find
                    and invite friends".
                  </Trans>
                }
                value={!!legacyContacts}
                onChange={setLegacyContacts}
              />

              <FeatureToggle
                name="public_likes"
                label={l`Likes on other profiles`}
                title={<Trans>Likes on other profiles</Trans>}
                description={
                  <Trans>
                    Show a "Likes" tab on other users' profiles, read from their
                    public like records. Bluesky hides these by default, so use
                    respectfully.
                  </Trans>
                }
                value={!!publicLikes}
                onChange={setPublicLikes}
              />

              <FeatureToggle
                name="force_japan_logo"
                label={l`Force the Japan logo`}
                title={<Trans>Force the Japan logo</Trans>}
                description={
                  <Trans>
                    Always use the Japan custom logo, regardless of your
                    location. Takes precedence over the kawaii logo.
                  </Trans>
                }
                value={!!forceJapanLogo}
                onChange={setForceJapanLogo}
              />

              <FeatureToggle
                name="force_kawaii_logo"
                label={l`Force the kawaii logo`}
                title={<Trans>Force the kawaii logo</Trans>}
                description={
                  <Trans>
                    Always use the kawaii logo, regardless of kawaii mode.
                  </Trans>
                }
                value={!!forceKawaiiLogo}
                onChange={setForceKawaiiLogo}
              />

              <FeatureToggle
                name="witchsky_enabled"
                label={l`Enable all Witchsky fork features`}
                title={<Trans>Witchsky</Trans>}
                description={
                  <Trans>
                    Enable all Witchsky features - accent colors, square avatars,
                    counts controls, PDSls links, and more. Disabling turns
                    everything off and hides the controls.
                  </Trans>
                }
                value={!!witchskyEnabled}
                onChange={onToggleWitchsky}
              />

              {!!witchskyEnabled && (
                <>
                  <FeatureToggle
                    name="pdsls_links"
                    label={l`PDSls links in post menu`}
                    title={<Trans>PDSls links in post menu</Trans>}
                    description={
                      <Trans>
                        Show "Open in PDSls" in the post menu (developer tool for
                        inspecting raw AT Protocol records).
                      </Trans>
                    }
                    value={!!pdslsLinks}
                    onChange={setPdslsLinks}
                  />
                  <FeatureToggle
                    name="bridged_fedi"
                    label={l`Bridged fediverse links`}
                    title={<Trans>Bridged fediverse links</Trans>}
                    description={
                      <Trans>
                        Show "Open on [instance]" in the post menu when the
                        author is a bridged fediverse account.
                      </Trans>
                    }
                    value={!!bridgedFedi}
                    onChange={setBridgedFedi}
                  />
                  <FeatureToggle
                    name="pds_badge"
                    label={l`PDS badge on profiles`}
                    title={<Trans>PDS badge on profiles</Trans>}
                    description={
                      <Trans>
                        Show the hosting PDS server as a small badge on profile
                        headers.
                      </Trans>
                    }
                    value={!!pdsBadge}
                    onChange={setPdsBadge}
                  />
                  <FeatureToggle
                    name="multi_account"
                    label={l`Multi-account actions`}
                    title={<Trans>Multi-account actions</Trans>}
                    description={
                      <Trans>
                        Show "Like as…" and "Repost as…" in the post menu for
                        other signed-in accounts.
                      </Trans>
                    }
                    value={!!multiAccount}
                    onChange={setMultiAccount}
                  />
                  <FeatureToggle
                    name="test_live_event"
                    label={l`Test live event banner`}
                    title={<Trans>Test live event banner</Trans>}
                    description={
                      <Trans>
                        Inject a fake "live event" banner into the Explore screen
                        so the live-events UI can be demoed without a real event.
                      </Trans>
                    }
                    value={!!testLiveEvent}
                    onChange={setTestLiveEvent}
                  />

                  <View style={[a.px_xl, a.py_md, a.gap_xs]}>
                    <TextField.LabelText>
                      <Trans>OpenRouter API key</Trans>
                    </TextField.LabelText>
                    <TextField.Root>
                      <TextField.Input
                        label={l`OpenRouter API key`}
                        placeholder="sk-or-v1-..."
                        defaultValue={openRouterApiKey ?? ''}
                        onChangeText={text =>
                          setOpenRouterApiKey(text.trim() || undefined)
                        }
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry
                      />
                    </TextField.Root>
                    <Text
                      style={[a.text_sm, t.atoms.text_contrast_medium]}>
                      <Trans>
                        Used to generate alt text for images in the composer via
                        OpenRouter's vision API. Get a key at openrouter.ai.
                      </Trans>
                    </Text>
                  </View>

                  <View style={[a.px_xl, a.py_md, a.gap_xs]}>
                    <TextField.LabelText>
                      <Trans>Custom AppView DID</Trans>
                    </TextField.LabelText>
                    <TextField.Root>
                      <TextField.Input
                        label={l`AppView DID override`}
                        placeholder="did:web:api.bsky.app"
                        defaultValue={infraAppviewDid ?? ''}
                        onChangeText={text => {
                          const trimmed = text.trim() || undefined
                          setInfraAppviewDid(trimmed)
                          if (trimmed) {
                            BLUESKY_PROXY_HEADER.set(`${trimmed}#bsky_appview`)
                          }
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </TextField.Root>
                    <Text
                      style={[a.text_sm, t.atoms.text_contrast_medium]}>
                      <Trans>
                        Override the AppView DID used for AT Protocol proxying.
                        Takes full effect after signing out and back in.
                      </Trans>
                    </Text>
                  </View>
                </>
              )}
            </>
          )}

          <View style={[a.px_xl, a.gap_md]}>
            <Button
              disabled={!canSubmitFeedback}
              label={l`Share feedback`}
              size="small"
              color="primary_subtle"
              onPress={onPressShareFeedback}
              style={[a.self_start, a.mt_xs, a.mb_xl]}>
              <ButtonIcon icon={BubbleInfoIcon} />
              <ButtonText>
                <Trans>Share feedback</Trans>
              </ButtonText>
            </Button>

            {betaFeatures.length > 0 && (
              <>
                <Text style={[a.text_md, a.font_semi_bold]}>
                  <Trans>Current beta features</Trans>
                </Text>
                <View style={[a.gap_sm]}>
                  {betaFeatures.map(feature => (
                    <View
                      key={feature.key}
                      style={[
                        a.p_md,
                        a.rounded_md,
                        a.border,
                        t.atoms.border_contrast_low,
                      ]}>
                      <Text
                        style={[
                          a.text_md,
                          a.font_medium,
                          a.pb_2xs,
                          t.atoms.text_contrast_high,
                        ]}>
                        {feature.name}
                      </Text>
                      <Text
                        style={[
                          a.text_sm,
                          a.leading_snug,
                          t.atoms.text_contrast_high,
                        ]}>
                        {feature.description}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </SettingsList.Container>
      </Layout.Content>

      <BetaFeaturesFeedbackDialog
        control={feedbackControl}
        betaFeatureKeys={betaFeatures.map(feature => feature.key)}
      />
    </Layout.Screen>
  )
}

/** Fork toggle in the new Beta-page item format. */
function FeatureToggle({
  name,
  label,
  title,
  description,
  value,
  onChange,
}: {
  name: string
  label: string
  title: React.ReactNode
  description: React.ReactNode
  value: boolean
  onChange: (value: boolean) => void
}) {
  const t = useTheme()
  return (
    <Toggle.Item
      name={name}
      label={label}
      value={value}
      onChange={onChange}>
      <SettingsList.Item>
        <View style={[a.flex_1, a.gap_2xs]}>
          <SettingsList.ItemText style={[a.font_semi_bold]}>
            {title}
          </SettingsList.ItemText>
          <Text
            style={[a.text_sm, a.leading_snug, t.atoms.text_contrast_medium]}>
            {description}
          </Text>
        </View>
        <Toggle.Platform />
      </SettingsList.Item>
    </Toggle.Item>
  )
}
