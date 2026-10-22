import {useEffect, useState} from 'react'
import {View} from 'react-native'
import {Trans, useLingui} from '@lingui/react/macro'
import {useNavigation} from '@react-navigation/native'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'

import {BLUESKY_PROXY_HEADER} from '#/lib/constants'
import {
  type CommonNavigatorParams,
  type NavigationProp,
} from '#/lib/routes/types'
import {logger} from '#/logger'
import {useResetTestModerationInbox} from '#/state/queries/moderation-inbox'
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
import {
  features,
  Features,
  UPSTREAM_PREVIEW_FEATURES,
  useAnalytics,
} from '#/analytics'
import {getTargetedFeatures} from '#/analytics/features'
import {IS_IPAD, IS_WEB} from '#/env'

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
  const navigation = useNavigation<NavigationProp>()
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
  const [modInboxTestData, setModInboxTestData] = useStorage(device, [
    'modInboxTestData',
  ])
  const [modInboxStatus, setModInboxStatus] = useStorage(device, [
    'modInboxTestAccountStatus',
  ])
  const resetModInboxTestData = useResetTestModerationInbox()
  const [upstreamPreviews, setUpstreamPreviews] = useStorage(device, [
    'upstreamPreviewFeatures',
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
  const [infraAppviewDid, setInfraAppviewDid] = useStorage(device, [
    'infraAppviewDid',
  ])

  /*
   * iPad support isn't a GrowthBook gate and can't be switched off in the app,
   * so on iPad it's listed whether or not beta features are enabled.
   */
  const listedFeatures = [
    ...(IS_IPAD
      ? [
          {
            key: 'ipad_support',
            name: l({
              message: 'iPad support',
              comment: 'Name for a beta feature',
            }),
            description: l({
              message:
                'Bluesky adapts to your iPad’s screen in any orientation or window size.',
              comment: 'Description of a beta feature (iPad support)',
            }),
          },
        ]
      : []),
    ...betaFeatures,
  ]
  const feedbackFeatureKeys = listedFeatures.map(feature => feature.key)

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

  const setUpstreamPreview = (feature: Features, value: boolean) => {
    setUpstreamPreviews({...upstreamPreviews, [feature]: value})
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
      betaFeatureKeys: feedbackFeatureKeys,
    })
    feedbackControl.open()
  }

  const canSubmitFeedback =
    !isPending && (isBetaUser || IS_IPAD) && listedFeatures.length > 0

  function getUpstreamPreviewCopy(feature: Features): {
    label: string
    description: string
  } {
    switch (feature) {
      case Features.FollowingV2Enable:
        return {
          label: l`Keep your place in Following`,
          description: l`Replaces Home with Bluesky’s in-development version. Your place in the Following feed is saved between sessions, and new posts wait above you until you’re ready. Android and iOS only.`,
        }
      case Features.NotificationsV2Enable:
        return {
          label: l`New Notifications screen`,
          description: l`Bluesky’s redesigned Notifications screen, with tabs and grouped notifications.`,
        }
      case Features.AtmosphereExploreEnable:
        return {
          label: l`Atmosphere tab`,
          description: l`Adds Atmosphere to the side menu, and lets you add it to your bottom bar and sidebar in Settings → Appearance → Navigation.`,
        }
      case Features.ProfileLinksEnable:
        return {
          label: l`Profile links`,
          description: l`Add links under your bio, and see other people’s. Links to support sites like Ko-fi or Patreon show as a Support button.`,
        }
      default:
        return {label: feature, description: ''}
    }
  }

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

              <View style={[a.px_xl, a.py_md, a.gap_sm]}>
                <Text style={[a.text_md, a.font_semi_bold]}>
                  <Trans>Moderation inbox</Trans>
                </Text>
                <Text
                  style={[
                    a.text_sm,
                    a.leading_snug,
                    t.atoms.text_contrast_medium,
                  ]}>
                  <Trans>
                    Test the moderation inbox with sample reports and notices
                    instead of your real ones. Nothing is sent to Bluesky while
                    this is on.
                  </Trans>
                </Text>
              </View>
              <FeatureToggle
                name="mod_inbox_test_data"
                label={l`Use sample data`}
                title={<Trans>Use sample data</Trans>}
                description={
                  <Trans>
                    Fills the inbox with dozens of reports and notices, covering
                    every status, action and appeal state.
                  </Trans>
                }
                value={!!modInboxTestData}
                onChange={setModInboxTestData}
              />
              <View style={[a.px_xl, a.pb_md, a.gap_sm]}>
                {!!modInboxTestData && (
                  <>
                    <Text
                      style={[
                        a.text_sm,
                        a.leading_snug,
                        t.atoms.text_contrast_medium,
                      ]}>
                      <Trans>Account standing banner</Trans>
                    </Text>
                    <View style={[a.flex_row, a.gap_sm, a.flex_wrap]}>
                      {(
                        [
                          ['good', l`No banner`],
                          ['warning', l`Strikes banner`],
                          ['atRisk', l`At-risk banner`],
                        ] as const
                      ).map(([status, label]) => {
                        const active = (modInboxStatus ?? 'warning') === status
                        return (
                          <Button
                            key={status}
                            label={label}
                            size="small"
                            color={active ? 'primary' : 'secondary'}
                            onPress={() => setModInboxStatus(status)}>
                            <ButtonText>{label}</ButtonText>
                          </Button>
                        )
                      })}
                    </View>
                  </>
                )}
                <View style={[a.flex_row, a.gap_sm, a.flex_wrap]}>
                  <Button
                    label={l`Open moderation inbox`}
                    size="small"
                    color="secondary_inverted"
                    onPress={() => navigation.navigate('ModerationInbox')}>
                    <ButtonText>
                      <Trans>Open moderation inbox</Trans>
                    </ButtonText>
                  </Button>
                  {!!modInboxTestData && (
                    <Button
                      label={l`Reset sample data`}
                      size="small"
                      color="secondary"
                      onPress={() => {
                        void resetModInboxTestData()
                        Toast.show(l`Sample data reset`)
                      }}>
                      <ButtonText>
                        <Trans>Reset sample data</Trans>
                      </ButtonText>
                    </Button>
                  )}
                </View>
              </View>

              <View style={[a.px_xl, a.pt_md, a.gap_xs]}>
                <Text style={[a.text_md, a.font_semi_bold]}>
                  <Trans>Upstream previews</Trans>
                </Text>
                <Text
                  style={[
                    a.text_sm,
                    a.leading_snug,
                    t.atoms.text_contrast_medium,
                  ]}>
                  <Trans>
                    Features Bluesky is still building. They may be unfinished
                    or change between updates.
                  </Trans>
                </Text>
              </View>
              {UPSTREAM_PREVIEW_FEATURES.map(feature => {
                const copy = getUpstreamPreviewCopy(feature)
                return (
                  <FeatureToggle
                    key={feature}
                    name={feature}
                    label={copy.label}
                    title={copy.label}
                    description={copy.description}
                    value={!!upstreamPreviews?.[feature]}
                    onChange={value => setUpstreamPreview(feature, value)}
                  />
                )
              })}

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

            {listedFeatures.length > 0 && (
              <>
                <Text style={[a.text_md, a.font_semi_bold]}>
                  <Trans>Current beta features</Trans>
                </Text>
                <View style={[a.gap_sm]}>
                  {listedFeatures.map(feature => (
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
        betaFeatureKeys={feedbackFeatureKeys}
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
