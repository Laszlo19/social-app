import {createWidget, type WidgetEnvironment} from 'expo-widgets'
import {Button, Row, Text} from '@expo/ui/jetpack-compose'
import {
  background,
  cornerRadius,
  fillMaxSize,
  paddingAll,
} from '@expo/ui/jetpack-compose/modifiers'

export type NewPostWidgetProps = {
  /** Button text, translated by the app. */
  label?: string
}

/*
 * Fork: a single button that opens the composer. The app sends the translated
 * label through `updateSnapshot`. Widget functions are compiled by
 * expo-widgets, so everything lives inside this function.
 */
function NewPostWidget(
  props: NewPostWidgetProps,
  _environment: WidgetEnvironment,
) {
  'use no memo'
  'widget'

  return (
    <Button url="bluesky://intent/compose" modifiers={[fillMaxSize()]}>
      <Row
        horizontalArrangement="center"
        verticalAlignment="center"
        modifiers={[
          fillMaxSize(),
          cornerRadius(12),
          background('#1083FE'),
          paddingAll(10),
        ]}>
        <Text
          color="#FFFFFF"
          maxLines={1}
          style={{fontSize: 14, fontWeight: 'bold'}}>
          {props.label ?? 'New post'}
        </Text>
      </Row>
    </Button>
  )
}

export default createWidget('NewPostWidget', NewPostWidget, {})
