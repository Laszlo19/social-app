import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'
import {Trans} from '@lingui/react/macro'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'

import {BLUESKY_PROXY_HEADER} from '#/lib/constants'
import {type CommonNavigatorParams} from '#/lib/routes/types'
import * as SettingsList from '#/screens/Settings/components/SettingsList'
import {device, useStorage} from '#/storage'
import {atoms as a, useTheme} from '#/alf'
import {Admonition} from '#/components/Admonition'
import * as TextField from '#/components/forms/TextField'
import * as Toggle from '#/components/forms/Toggle'
import {Beaker_Stroke2_Corner2_Rounded as BeakerIcon} from '#/components/icons/Beaker'
import * as Layout from '#/components/Layout'
import {Text} from '#/components/Typography'

type Props = NativeStackScreenProps<
  CommonNavigatorParams,
  'ExperimentalFeaturesSettings'
>
export function ExperimentalFeaturesSettingsScreen({}: Props) {
  const {_} = useLingui()
  const t = useTheme()
  const [galleryFallback, setGalleryFallback] = useStorage(device, [
    'experimentalGalleryFallback',
  ])
  const [legacyContacts, setLegacyContacts] = useStorage(device, [
    'experimentalLegacyContacts',
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
  const [openRouterApiKey, setOpenRouterApiKey] = useStorage(device, [
    'openRouterApiKey',
  ])
  const [infraAppviewDid, setInfraAppviewDid] = useStorage(device, [
    'infraAppviewDid',
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

          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={BeakerIcon} />
            <SettingsList.ItemText>
              <Trans>Find friends experience</Trans>
            </SettingsList.ItemText>
            <Toggle.Item
              name="legacy_contacts"
              label={_(
                msg`Use the legacy "Find friends from contacts" instead of "Find and invite friends"`,
              )}
              value={!!legacyContacts}
              onChange={value => setLegacyContacts(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>
                  Use the legacy “Find friends from contacts” instead of “Find
                  and invite friends”
                </Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
          </SettingsList.Group>

          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={BeakerIcon} />
            <SettingsList.ItemText>
              <Trans>PDSls links in post menu</Trans>
            </SettingsList.ItemText>
            <Toggle.Item
              name="pdsls_links"
              label={_(
                msg`Show "Open in PDSls" in the post menu for developer inspection of raw AT Protocol records`,
              )}
              value={!!pdslsLinks}
              onChange={value => setPdslsLinks(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>
                  Show "Open in PDSls" in the post menu (developer tool for
                  inspecting raw AT Protocol records)
                </Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
          </SettingsList.Group>

          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={BeakerIcon} />
            <SettingsList.ItemText>
              <Trans>Bridged fediverse links</Trans>
            </SettingsList.ItemText>
            <Toggle.Item
              name="bridged_fedi"
              label={_(
                msg`Show "Open on [instance]" in the post menu for bridged fediverse accounts`,
              )}
              value={!!bridgedFedi}
              onChange={value => setBridgedFedi(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>
                  Show "Open on [instance]" in the post menu when the author is
                  a bridged fediverse account
                </Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
          </SettingsList.Group>
          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={BeakerIcon} />
            <SettingsList.ItemText>
              <Trans>PDS badge on profiles</Trans>
            </SettingsList.ItemText>
            <Toggle.Item
              name="pds_badge"
              label={_(
                msg`Show the hosting PDS as a badge on profile headers`,
              )}
              value={!!pdsBadge}
              onChange={value => setPdsBadge(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>
                  Show the hosting PDS server as a small badge on profile
                  headers
                </Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
          </SettingsList.Group>

          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={BeakerIcon} />
            <SettingsList.ItemText>
              <Trans>Multi-account actions</Trans>
            </SettingsList.ItemText>
            <Toggle.Item
              name="multi_account"
              label={_(
                msg`Show "Like as…" and "Repost as…" in the post menu for other signed-in accounts`,
              )}
              value={!!multiAccount}
              onChange={value => setMultiAccount(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>
                  Show "Like as…" and "Repost as…" in the post menu for
                  other signed-in accounts
                </Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
          </SettingsList.Group>
          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={BeakerIcon} />
            <SettingsList.ItemText>
              <Trans>AI alt-text (OpenRouter)</Trans>
            </SettingsList.ItemText>
            <TextField.LabelText>
              <Trans>OpenRouter API key</Trans>
            </TextField.LabelText>
            <TextField.Root>
              <TextField.Input
                label={_(msg`OpenRouter API key`)}
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
            <Text style={[a.text_sm, t.atoms.text_contrast_medium]}>
              <Trans>
                Used to generate alt text for images in the composer via
                OpenRouter's vision API. Get a key at openrouter.ai.
              </Trans>
            </Text>
          </SettingsList.Group>

          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={BeakerIcon} />
            <SettingsList.ItemText>
              <Trans>Custom AppView DID</Trans>
            </SettingsList.ItemText>
            <TextField.LabelText>
              <Trans>AppView DID override</Trans>
            </TextField.LabelText>
            <TextField.Root>
              <TextField.Input
                label={_(msg`AppView DID override`)}
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
            <Text style={[a.text_sm, t.atoms.text_contrast_medium]}>
              <Trans>
                Override the AppView DID used for AT Protocol proxying. Takes
                full effect after signing out and back in.
              </Trans>
            </Text>
          </SettingsList.Group>
        </SettingsList.Container>
      </Layout.Content>
    </Layout.Screen>
  )
}
