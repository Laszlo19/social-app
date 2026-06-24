import {type ID as PolicyUpdate202508} from '#/components/PolicyUpdateOverlay/updates/202508/config'
import {type NavItemId} from '#/features/customNav/config'
import {type Gif} from '#/features/gifPicker/types'
import {type InviteThemeKey} from '#/features/inviteFriends/themes'
import {type Geolocation} from '#/geolocation/types'

/**
 * Data that's specific to the device and does not vary based account
 */
export type Device = {
  /**
   * Formerly managed by StatSig, this is the migrated stable ID for the
   * device, used with our logging and metrics tracking.
   */
  deviceId?: string
  /**
   * Session ID storage for _native only_. On web, use we `sessionStorage`
   */
  nativeSessionId?: string
  nativeSessionIdLastEventAt?: number

  fontScale: '-2' | '-1' | '0' | '1' | '2'
  fontFamily: 'system' | 'theme'
  lastNuxDialog: string | undefined

  /**
   * Geolocation config, fetched from the IP service. This previously did
   * double duty as the "status" for geolocation state, but that has since
   * moved here to the client.
   *
   * @deprecated use `mergedGeolocation` instead
   */
  geolocation?: {
    countryCode: string | undefined
    regionCode: string | undefined
    ageRestrictedGeos: {
      countryCode: string
      regionCode: string | undefined
    }[]
    ageBlockedGeos: {
      countryCode: string
      regionCode: string | undefined
    }[]
  }

  /**
   * The raw response from the geolocation service, if available. We
   * cache this here and update it lazily on session start.
   */
  geolocationServiceResponse?: Geolocation
  /**
   * The GPS-based geolocation, if the user has granted permission.
   */
  deviceGeolocation?: Geolocation
  /**
   * The merged geolocation, combining `geolocationServiceResponse` and
   * `deviceGeolocation`, with preference to `deviceGeolocation`.
   */
  mergedGeolocation?: Geolocation

  trendingBetaEnabled: boolean
  devMode: boolean
  demoMode: boolean
  activitySubscriptionsNudged?: boolean
  threadgateNudged?: boolean
  inviteFriendsFollowersPromoDismissed?: boolean
  /**
   * Selected color theme for the Invite Friends QR card.
   */
  inviteFriendsThemeKey?: InviteThemeKey

  /**
   * Experimental features (see ExperimentalFeaturesSettings). When enabled,
   * gallery posts (5+ images) render the OTA "update your app" fallback
   * instead of the real gallery carousel, for testing that fallback.
   */
  experimentalGalleryFallback?: boolean

  /**
   * Experimental: the new "Find and invite friends" (QR / share-link) UI is
   * the default. When this is enabled, the "find friends" entry point reverts
   * to the legacy "Find friends from contacts" string + contacts-upload flow.
   */
  experimentalLegacyContacts?: boolean

  /**
   * Ordered list of nav-item ids shown in the mobile bottom bar. Customized
   * via Settings > Appearance > Navigation bar. Absent means "use defaults".
   * See features/customNav.
   */
  bottomBarItems?: NavItemId[]

  /**
   * Policy update overlays. New IDs are required for each new announcement.
   */
  policyUpdateDebugOverride?: boolean
  [PolicyUpdate202508]?: boolean
}

export type Account = {
  searchTermHistory?: string[]
  searchAccountHistory?: string[]

  /**
   * The ISO date string of when this account's birthdate was last updated on
   * this device.
   */
  birthdateLastUpdatedAt?: string

  lastSelectedHomeFeed?: string

  /**
   * Recently selected GIFs in the GIF picker. Most recent first, capped at 20.
   */
  recentGifs?: Gif[]
}
