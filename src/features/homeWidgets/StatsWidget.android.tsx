import {createWidget, type WidgetEnvironment} from 'expo-widgets'
import {
  Box,
  Button,
  Column,
  Image,
  Row,
  Spacer,
  Text,
} from '@expo/ui/jetpack-compose'
import {
  background,
  cornerRadius,
  fillMaxSize,
  paddingAll,
  size,
  weight,
  width,
} from '@expo/ui/jetpack-compose/modifiers'

export type StatsWidgetProps = {
  /** `file://` URI of the avatar the app downloaded. */
  avatarUri?: string
  displayName?: string
  emptyMessage?: string
  followers?: number
  followersLabel?: string
  following?: number
  followingLabel?: string
  handle?: string
}

/*
 * Fork: the signed-in account's avatar, name and follower/following counts.
 * Tapping it opens the profile. The app sends the data and translated labels
 * through `updateSnapshot`. Widget functions are compiled by expo-widgets, so
 * like upstream's TrendingTopicsWidget everything lives inside this function
 * (no helper components or imported helpers).
 */
function StatsWidget(props: StatsWidgetProps, environment: WidgetEnvironment) {
  'use no memo'
  'widget'

  const isDark = environment.colorScheme === 'dark'
  const backgroundColor = isDark ? '#1A1F24' : '#FFFFFF'
  const textColor = isDark ? '#FFFFFF' : '#0B0F14'
  const secondaryTextColor = isDark ? '#AEB8C2' : '#566573'
  const placeholderColor = isDark ? '#2A3040' : '#EEF0F2'
  const accentColor = '#1083FE'
  const handle = props.handle ?? ''
  const destination = handle
    ? `https://bsky.app/profile/${handle}`
    : 'bluesky://'

  return (
    <Button url={destination} modifiers={[fillMaxSize()]}>
      <Row
        verticalAlignment="center"
        modifiers={[
          fillMaxSize(),
          cornerRadius(16),
          background(backgroundColor),
          paddingAll(12),
        ]}>
        <Box
          modifiers={[
            size(44, 44),
            cornerRadius(22),
            background(placeholderColor),
          ]}>
          {props.avatarUri ? (
            <Image
              source={{uri: props.avatarUri}}
              contentScale="crop"
              contentDescription={null}
              modifiers={[size(44, 44), cornerRadius(22)]}
            />
          ) : null}
        </Box>
        <Spacer modifiers={[width(12)]} />

        <Column modifiers={[weight(1)]}>
          <Text
            color={textColor}
            maxLines={handle ? 1 : 2}
            style={{fontSize: handle ? 14 : 13, fontWeight: 'bold'}}>
            {handle
              ? props.displayName || handle
              : (props.emptyMessage ?? 'Open the app to load stats')}
          </Text>
          {handle ? (
            <Text
              color={secondaryTextColor}
              maxLines={1}
              style={{fontSize: 12}}>
              {`@${handle}`}
            </Text>
          ) : null}
        </Column>

        <Spacer modifiers={[width(8)]} />
        <Column horizontalAlignment="center">
          <Text color={accentColor} style={{fontSize: 15, fontWeight: 'bold'}}>
            {String(props.followers ?? 0)}
          </Text>
          <Text color={secondaryTextColor} maxLines={1} style={{fontSize: 10}}>
            {props.followersLabel ?? 'Followers'}
          </Text>
        </Column>
        <Spacer modifiers={[width(12)]} />
        <Column horizontalAlignment="center">
          <Text color={accentColor} style={{fontSize: 15, fontWeight: 'bold'}}>
            {String(props.following ?? 0)}
          </Text>
          <Text color={secondaryTextColor} maxLines={1} style={{fontSize: 10}}>
            {props.followingLabel ?? 'Following'}
          </Text>
        </Column>
      </Row>
    </Button>
  )
}

export default createWidget('StatsWidget', StatsWidget, {})
