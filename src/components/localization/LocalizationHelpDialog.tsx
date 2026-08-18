import {Trans, useLingui} from '@lingui/react/macro'

import {
  LOCALIZATION_CROWDIN_URL,
  LOCALIZATION_DISCORD_URL,
  LOCALIZATION_GUIDE_URL,
} from '#/lib/constants'
import {useOpenLink} from '#/lib/hooks/useOpenLink'
import {atoms as a, useTheme} from '#/alf'
import type * as Dialog from '#/components/Dialog'
import {Earth_Stroke2_Corner2_Rounded as GlobeIcon} from '#/components/icons/Globe'
import * as Prompt from '#/components/Prompt'
import {Text} from '#/components/Typography'

/**
 * Invites the user to help translate the app. The translation project lives on
 * Crowdin Enterprise (so contributors need a Crowdin account and to be granted
 * access), coordinated in a community-run Discord. Opened from the feed banner
 * and from Settings > Languages.
 */
export function LocalizationHelpDialog({
  control,
}: {
  control: Dialog.DialogControlProps
}) {
  const t = useTheme()
  const {t: l} = useLingui()
  const openLink = useOpenLink()

  return (
    <Prompt.Outer control={control}>
      <GlobeIcon size="xl" fill={t.palette.primary_500} style={[a.mb_sm]} />
      <Prompt.TitleText>
        <Trans>Help translate the app</Trans>
      </Prompt.TitleText>
      <Prompt.DescriptionText>
        <Trans>
          The app is translated by volunteers. If you'd like to help bring it to
          your language – or improve an existing translation – you can join the
          localization project.
        </Trans>
      </Prompt.DescriptionText>

      <Text
        style={[a.text_sm, a.leading_snug, a.pb_lg, t.atoms.text_contrast_medium]}>
        <Trans>
          Translations are hosted on Crowdin Enterprise, so you will need a free
          Crowdin account and to be granted access to the project. Ask in the
          community Discord (unofficial) to get set up.
        </Trans>
      </Text>

      <Prompt.Actions>
        <Prompt.Action
          cta={l`Open Crowdin project`}
          color="primary"
          onPress={() => openLink(LOCALIZATION_CROWDIN_URL)}
        />
        <Prompt.Action
          cta={l`Join the Discord`}
          color="secondary"
          onPress={() => openLink(LOCALIZATION_DISCORD_URL)}
        />
        {LOCALIZATION_GUIDE_URL ? (
          <Prompt.Action
            cta={l`How it works`}
            color="secondary"
            onPress={() => openLink(LOCALIZATION_GUIDE_URL)}
          />
        ) : null}
        <Prompt.Cancel cta={l`Close`} />
      </Prompt.Actions>
    </Prompt.Outer>
  )
}
