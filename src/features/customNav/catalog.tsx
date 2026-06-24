/**
 * Catalog of every nav item that can appear in the mobile bottom bar.
 *
 * Two kinds of items:
 * - `tab`  - one of the five real bottom-tab navigators. Uses tab-switch
 *            semantics (pop-to-top / soft reset) and `useNavigationTabState`
 *            for active detection.
 * - `link` - a regular destination screen (Feeds, Lists, Saved, Settings).
 *            Navigated like the desktop left-nav links and highlighted via the
 *            current route name.
 */

import {type MessageDescriptor} from '@lingui/core'
import {msg} from '@lingui/core/macro'

import {type Events} from '#/analytics/metrics/types'
import {type SharedNavTab} from '#/lib/routes/tab-to-nav-item'
import {type Props as SVGIconProps} from '#/components/icons/common'
import {
  Bell_Filled_Corner0_Rounded as BellFilled,
  Bell_Stroke2_Corner0_Rounded as Bell,
} from '#/components/icons/Bell'
import {Bookmark, BookmarkFilled} from '#/components/icons/Bookmark'
import {
  BulletList_Filled_Corner0_Rounded as ListFilled,
  BulletList_Stroke2_Corner0_Rounded as List,
} from '#/components/icons/BulletList'
import {
  Hashtag_Filled_Corner0_Rounded as HashtagFilled,
  Hashtag_Stroke2_Corner0_Rounded as Hashtag,
} from '#/components/icons/Hashtag'
import {
  HomeOpen_Filled_Corner0_Rounded as HomeFilled,
  HomeOpen_Stoke2_Corner0_Rounded as Home,
} from '#/components/icons/HomeOpen'
import {
  MagnifyingGlass_Filled_Stroke2_Corner0_Rounded as MagnifyingGlassFilled,
  MagnifyingGlass_Stroke2_Corner0_Rounded as MagnifyingGlass,
} from '#/components/icons/MagnifyingGlass'
import {
  Message_Stroke2_Corner0_Rounded as Message,
  Message_Stroke2_Corner0_Rounded_Filled as MessageFilled,
} from '#/components/icons/Message'
import {
  SettingsGear2_Filled_Corner0_Rounded as SettingsFilled,
  SettingsGear2_Stroke2_Corner0_Rounded as Settings,
} from '#/components/icons/SettingsGear2'
import {
  UserCircle_Filled_Corner0_Rounded as UserCircleFilled,
  UserCircle_Stroke2_Corner0_Rounded as UserCircle,
} from '#/components/icons/UserCircle'
import {type NavItemId} from './config'

/** Keys of the `useNavigationTabState()` result used for native highlighting. */
export type TabStateKey =
  | 'isAtHome'
  | 'isAtSearch'
  | 'isAtMessages'
  | 'isAtNotifications'
  | 'isAtMyProfile'
  | 'isAtFeeds'
  | 'isAtBookmarks'

export type NavCatalogItem = {
  id: NavItemId
  /** Label for the settings list + accessibility. Resolve with `_(label)`. */
  label: MessageDescriptor
  icons: {
    active: React.ComponentType<SVGIconProps>
    inactive: React.ComponentType<SVGIconProps>
  }
  /** Route name for active detection (and native link navigation). */
  routeName: string
  /** Web href / native matchPath target. Profile is resolved at render time. */
  href: string
  /** Analytics item id for the `nav:click` metric. */
  navMetric: Events['nav:click']['item']
  /** Present for the five real tabs; drives tab-switch semantics on native. */
  nativeTab?: SharedNavTab
  /** Native active-state source when the item maps to a known tab-state flag. */
  tabStateKey?: TabStateKey
  /** Live unread badge to render, if any. */
  badge?: 'notifications' | 'messages'
  /** Profile renders the account avatar instead of a static icon. */
  special?: 'profileAvatar'
}

/**
 * Ordered superset of available items. Order here is only the default order
 * shown in the settings "Available" section; the user's own order is stored
 * separately.
 */
export const NAV_ITEM_CATALOG: NavCatalogItem[] = [
  {
    id: 'home',
    label: msg`Home`,
    icons: {active: HomeFilled, inactive: Home},
    routeName: 'Home',
    href: '/',
    navMetric: 'home',
    nativeTab: 'Home',
    tabStateKey: 'isAtHome',
  },
  {
    id: 'search',
    label: msg`Search`,
    icons: {active: MagnifyingGlassFilled, inactive: MagnifyingGlass},
    routeName: 'Search',
    href: '/search',
    navMetric: 'search',
    nativeTab: 'Search',
    tabStateKey: 'isAtSearch',
  },
  {
    id: 'messages',
    label: msg`Chat`,
    icons: {active: MessageFilled, inactive: Message},
    routeName: 'Messages',
    href: '/messages',
    navMetric: 'chat',
    nativeTab: 'Messages',
    tabStateKey: 'isAtMessages',
    badge: 'messages',
  },
  {
    id: 'notifications',
    label: msg`Notifications`,
    icons: {active: BellFilled, inactive: Bell},
    routeName: 'Notifications',
    href: '/notifications',
    navMetric: 'notifications',
    nativeTab: 'Notifications',
    tabStateKey: 'isAtNotifications',
    badge: 'notifications',
  },
  {
    id: 'profile',
    label: msg`Profile`,
    icons: {active: UserCircleFilled, inactive: UserCircle},
    routeName: 'Profile',
    href: '/', // resolved to the account profile link at render time
    navMetric: 'profile',
    nativeTab: 'MyProfile',
    tabStateKey: 'isAtMyProfile',
    special: 'profileAvatar',
  },
  {
    id: 'feeds',
    label: msg`Feeds`,
    icons: {active: HashtagFilled, inactive: Hashtag},
    routeName: 'Feeds',
    href: '/feeds',
    navMetric: 'feeds',
    tabStateKey: 'isAtFeeds',
  },
  {
    id: 'lists',
    label: msg`Lists`,
    icons: {active: ListFilled, inactive: List},
    routeName: 'Lists',
    href: '/lists',
    navMetric: 'lists',
  },
  {
    id: 'saved',
    label: msg({message: 'Saved', context: 'link to bookmarks screen'}),
    icons: {active: BookmarkFilled, inactive: Bookmark},
    routeName: 'Bookmarks',
    href: '/saved',
    navMetric: 'saved',
    tabStateKey: 'isAtBookmarks',
  },
  {
    id: 'settings',
    label: msg`Settings`,
    icons: {active: SettingsFilled, inactive: Settings},
    routeName: 'Settings',
    href: '/settings',
    navMetric: 'settings',
  },
]

export const NAV_ITEM_BY_ID: Record<NavItemId, NavCatalogItem> =
  Object.fromEntries(NAV_ITEM_CATALOG.map(item => [item.id, item])) as Record<
    NavItemId,
    NavCatalogItem
  >
