import {type CountryCode} from '#/lib/international-telephone-codes'
import {IS_DEV} from '#/env'
import {useGeolocation} from '#/geolocation'

const FIND_CONTACTS_FEATURE_COUNTRY_ALLOWLIST = [
  'US',
  'GB',
  'JP',
  'CA',
  'DE',
  'FR',
  'ES',
  'BR',
  'KR',
  'NL',
  'AU',
  'SE',
  'IT',
] satisfies CountryCode[] as string[]

export function isFindContactsFeatureEnabled(countryCode?: string): boolean {
  // Forced on for sideloaded test builds so the Find Contacts feature is
  // reachable regardless of the emulator's geolocated country.
  return true

  // eslint-disable-next-line no-unreachable
  if (IS_DEV) return true

  /*
   * This should never happen unless geolocation fails entirely. In that
   * case, let the user try, since it should work as long as they have a
   * phone number from one of the allow-listed countries.
   */
  if (!countryCode) return true

  return FIND_CONTACTS_FEATURE_COUNTRY_ALLOWLIST.includes(
    countryCode.toUpperCase(),
  )
}

export function useIsFindContactsFeatureEnabledBasedOnGeolocation() {
  const location = useGeolocation()
  return isFindContactsFeatureEnabled(location.countryCode)
}
