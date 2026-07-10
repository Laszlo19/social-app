import {useCallback} from 'react'
import {useFocusEffect, useNavigation} from '@react-navigation/native'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'

import {
  type CommonNavigatorParams,
  type NavigationProp,
} from '#/lib/routes/types'
import {useWhatsNew} from '#/features/whatsNew'
import * as Layout from '#/components/Layout'

/**
 * A transient route so the What's New flyout can be opened from any hyperlink
 * (including links in posts, e.g. bsky.app/whats-new, and external/notification
 * deep links). It renders nothing: on focus it pops itself and opens the global
 * flyout over wherever the user lands.
 */
export function WhatsNewScreen(
  _props: NativeStackScreenProps<CommonNavigatorParams, 'WhatsNew'>,
) {
  const navigation = useNavigation<NavigationProp>()
  const whatsNew = useWhatsNew()

  useFocusEffect(
    useCallback(() => {
      if (navigation.canGoBack()) {
        navigation.goBack()
      } else {
        navigation.navigate('Home')
      }
      whatsNew.open()
    }, [navigation, whatsNew]),
  )

  return <Layout.Screen />
}
