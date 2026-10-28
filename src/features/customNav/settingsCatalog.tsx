/**
 * Settings pages offered as Android launcher shortcuts (Settings > Appearance
 * > Navigation > Launcher shortcuts). Every main and sub page of Settings,
 * plus the developer screens, in the same order as the Settings screens.
 *
 * Each page uses the same icon as its row in Settings. The launcher icons are
 * generated from the same SVGs by `plugins/withAndroidShortcutIcons.js`, so
 * keep its `SETTINGS_SHORTCUT_ICONS` map in sync with this file.
 */

import {msg} from '@lingui/core/macro'

import {Accessibility_Stroke2_Corner2_Rounded as Accessibility} from '#/components/icons/Accessibility'
import {Bars3_Stroke2_Corner0_Rounded as Bars} from '#/components/icons/Bars3'
import {Beaker_Stroke2_Corner2_Rounded as Beaker} from '#/components/icons/Beaker'
import {
  Bell_Stroke2_Corner0_Rounded as Bell,
  BellRinging_Stroke2_Corner0_Rounded as BellRinging,
} from '#/components/icons/Bell'
import {Bot_Stroke2_Corner0_Rounded as Bot} from '#/components/icons/Bot'
import {BubbleInfo_Stroke2_Corner2_Rounded as BubbleInfo} from '#/components/icons/Bubble'
import {Bubbles_Stroke2_Corner2_Rounded as Bubbles} from '#/components/icons/Bubbles'
import {
  CircleBanSign_Stroke2_Corner0_Rounded as CircleBanSign,
  CircleCheck_Stroke2_Corner0_Rounded as CircleCheck,
  CircleInfo_Stroke2_Corner0_Rounded as CircleInfo,
} from '#/components/icons/Circle'
import {
  CodeBrackets_Stroke2_Corner0_Rounded as CodeBrackets,
  CodeLines_Stroke2_Corner2_Rounded as CodeLines,
} from '#/components/icons/Code'
import {Contacts_Stroke2_Corner2_Rounded as Contacts} from '#/components/icons/Contacts'
import {Earth_Stroke2_Corner2_Rounded as Earth} from '#/components/icons/Earth'
import {EditBig_Stroke2_Corner2_Rounded as EditBig} from '#/components/icons/EditBig'
import {EyeSlash_Stroke2_Corner0_Rounded as EyeSlash} from '#/components/icons/Eye'
import {Group3_Stroke2_Corner0_Rounded as Group} from '#/components/icons/Group3'
import {Hashtag_Stroke2_Corner0_Rounded as Hashtag} from '#/components/icons/Hashtag'
import {Home_Stroke2_Corner2_Rounded as Home} from '#/components/icons/Home'
import {Inbox_Stroke2_Corner2_Rounded as Inbox} from '#/components/icons/Inbox'
import {Key_Stroke2_Corner2_Rounded as Key} from '#/components/icons/Key'
import {Lock_Stroke2_Corner2_Rounded as Lock} from '#/components/icons/Lock'
import {Macintosh_Stroke2_Corner2_Rounded as Macintosh} from '#/components/icons/Macintosh'
import {PaintRoller_Stroke2_Corner2_Rounded as PaintRoller} from '#/components/icons/PaintRoller'
import {
  Person_Stroke2_Corner0_Rounded as PersonSquare,
  Person_Stroke2_Corner2_Rounded as Person,
} from '#/components/icons/Person'
import {RaisingHand4Finger_Stroke2_Corner2_Rounded as Hand} from '#/components/icons/RaisingHand4Finger'
import {SettingsGear2_Stroke2_Corner0_Rounded as SettingsGear} from '#/components/icons/Settings'
import {Shapes_Stroke2_Corner0_Rounded as Shapes} from '#/components/icons/Shapes'
import {Shield_Stroke2_Corner0_Rounded as Shield} from '#/components/icons/Shield'
import {Window_Stroke2_Corner2_Rounded as Window} from '#/components/icons/Window'
import {type NavCatalogItem} from './catalog'

/**
 * Builds a settings catalog item. Settings pages are only offered as launcher
 * shortcuts, and use the same icon whether or not they're active.
 */
function page(
  item: Pick<NavCatalogItem, 'id' | 'label' | 'routeName' | 'href'> & {
    icon: NavCatalogItem['icons']['inactive']
    parent?: NavCatalogItem['settingsParent']
  },
): NavCatalogItem {
  return {
    id: item.id,
    label: item.label,
    routeName: item.routeName,
    href: item.href,
    icons: {active: item.icon, inactive: item.icon},
    group: 'settings',
    surfaces: ['quickActions'],
    settingsParent: item.parent,
  }
}

export const SETTINGS_NAV_ITEMS: NavCatalogItem[] = [
  page({
    id: 'settings_account',
    label: msg`Account`,
    routeName: 'AccountSettings',
    href: '/settings/account',
    icon: Person,
  }),
  page({
    id: 'settings_automation_label',
    label: msg`Automation label`,
    routeName: 'AutomationLabelSettings',
    href: '/settings/automation-label',
    icon: Bot,
    parent: 'settings_account',
  }),
  page({
    id: 'settings_privacy',
    label: msg`Privacy and security`,
    routeName: 'PrivacyAndSecuritySettings',
    href: '/settings/privacy-and-security',
    icon: Lock,
  }),
  page({
    id: 'settings_app_passwords',
    label: msg`App passwords`,
    routeName: 'AppPasswords',
    href: '/settings/app-passwords',
    icon: Key,
    parent: 'settings_privacy',
  }),
  page({
    id: 'settings_activity_privacy',
    label: msg`Activity privacy`,
    routeName: 'ActivityPrivacySettings',
    href: '/settings/privacy-and-security/activity',
    icon: BellRinging,
    parent: 'settings_privacy',
  }),
  page({
    id: 'settings_moderation',
    label: msg`Moderation tools`,
    routeName: 'Moderation',
    href: '/moderation',
    icon: Hand,
  }),
  page({
    id: 'settings_moderation_inbox',
    label: msg`Moderation inbox`,
    routeName: 'ModerationInbox',
    href: '/moderation/inbox',
    icon: Inbox,
    parent: 'settings_moderation',
  }),
  page({
    id: 'settings_moderation_inbox_settings',
    label: msg`Moderation inbox settings`,
    routeName: 'ModerationInboxSettings',
    href: '/moderation/inbox/settings',
    icon: SettingsGear,
    parent: 'settings_moderation',
  }),
  page({
    id: 'settings_interaction',
    label: msg`Interaction settings`,
    routeName: 'ModerationInteractionSettings',
    href: '/moderation/interaction-settings',
    icon: EditBig,
    parent: 'settings_moderation',
  }),
  page({
    id: 'settings_modlists',
    label: msg`Moderation lists`,
    routeName: 'ModerationModlists',
    href: '/moderation/modlists',
    icon: Group,
    parent: 'settings_moderation',
  }),
  page({
    id: 'settings_muted',
    label: msg`Muted accounts`,
    routeName: 'ModerationMutedAccounts',
    href: '/moderation/muted-accounts',
    icon: PersonSquare,
    parent: 'settings_moderation',
  }),
  page({
    id: 'settings_blocked',
    label: msg`Blocked accounts`,
    routeName: 'ModerationBlockedAccounts',
    href: '/moderation/blocked-accounts',
    icon: CircleBanSign,
    parent: 'settings_moderation',
  }),
  page({
    id: 'settings_verification',
    label: msg`Verification settings`,
    routeName: 'ModerationVerificationSettings',
    href: '/moderation/verification-settings',
    icon: CircleCheck,
    parent: 'settings_moderation',
  }),
  page({
    id: 'settings_notifications',
    label: msg`Notifications`,
    routeName: 'NotificationSettings',
    href: '/settings/notifications',
    icon: Bell,
  }),
  page({
    id: 'settings_activity_notifications',
    label: msg`Activity notifications`,
    routeName: 'ActivityNotificationSettings',
    href: '/settings/notifications/activity',
    icon: BellRinging,
    parent: 'settings_notifications',
  }),
  page({
    id: 'settings_content_media',
    label: msg`Content and media`,
    routeName: 'ContentAndMediaSettings',
    href: '/settings/content-and-media',
    icon: Window,
  }),
  page({
    id: 'settings_saved_feeds',
    label: msg`Manage saved feeds`,
    routeName: 'SavedFeeds',
    href: '/settings/saved-feeds',
    icon: Hashtag,
    parent: 'settings_content_media',
  }),
  page({
    id: 'settings_threads',
    label: msg`Thread preferences`,
    routeName: 'PreferencesThreads',
    href: '/settings/threads',
    icon: Bubbles,
    parent: 'settings_content_media',
  }),
  page({
    id: 'settings_following_feed',
    label: msg`Following feed preferences`,
    routeName: 'PreferencesFollowingFeed',
    href: '/settings/following-feed',
    icon: Home,
    parent: 'settings_content_media',
  }),
  page({
    id: 'settings_counts_metrics',
    label: msg`Counts & metrics`,
    routeName: 'CountsMetricsSettings',
    href: '/settings/counts-metrics',
    icon: EyeSlash,
    parent: 'settings_content_media',
  }),
  page({
    id: 'settings_external_media',
    label: msg`External media`,
    routeName: 'PreferencesExternalEmbeds',
    href: '/settings/external-embeds',
    icon: Macintosh,
    parent: 'settings_content_media',
  }),
  page({
    id: 'settings_interests',
    label: msg`Your interests`,
    routeName: 'InterestsSettings',
    href: '/settings/interests',
    icon: CircleInfo,
    parent: 'settings_content_media',
  }),
  page({
    id: 'settings_find_contacts',
    label: msg`Find friends from contacts`,
    routeName: 'FindContactsSettings',
    href: '/settings/find-contacts',
    icon: Contacts,
  }),
  page({
    id: 'settings_appearance',
    label: msg`Appearance`,
    routeName: 'AppearanceSettings',
    href: '/settings/appearance',
    icon: PaintRoller,
  }),
  page({
    id: 'settings_app_icon',
    label: msg`App Icon`,
    routeName: 'AppIconSettings',
    href: '/settings/app-icon',
    icon: Shapes,
    parent: 'settings_appearance',
  }),
  page({
    id: 'settings_navigation',
    label: msg`Navigation bar`,
    routeName: 'NavigationBarSettings',
    href: '/settings/navigation',
    icon: Bars,
    parent: 'settings_appearance',
  }),
  page({
    id: 'settings_accessibility',
    label: msg`Accessibility`,
    routeName: 'AccessibilitySettings',
    href: '/settings/accessibility',
    icon: Accessibility,
  }),
  page({
    id: 'settings_languages',
    label: msg`Languages`,
    routeName: 'LanguageSettings',
    href: '/settings/language',
    icon: Earth,
  }),
  page({
    id: 'settings_beta_features',
    label: msg`Beta features`,
    routeName: 'BetaFeaturesSettings',
    href: '/settings/beta-features',
    icon: Beaker,
  }),
  page({
    id: 'settings_about',
    label: msg`About`,
    routeName: 'AboutSettings',
    href: '/settings/about',
    icon: BubbleInfo,
  }),
  page({
    id: 'settings_system_log',
    label: msg`System log`,
    routeName: 'Log',
    href: '/sys/log',
    icon: CodeLines,
    parent: 'settings_about',
  }),
  page({
    id: 'settings_storybook',
    label: msg`Storybook`,
    routeName: 'Debug',
    href: '/sys/debug',
    icon: CodeBrackets,
  }),
  page({
    id: 'settings_debug_moderation',
    label: msg`Debug Moderation`,
    routeName: 'DebugMod',
    href: '/sys/debug-mod',
    icon: Shield,
  }),
]
