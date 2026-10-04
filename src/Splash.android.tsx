import {useEffect, useState} from 'react'
import {AccessibilityInfo, useColorScheme, View} from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Svg, {Path} from 'react-native-svg'
import {scheduleOnRN} from 'react-native-worklets'
import * as SplashScreen from 'expo-splash-screen'

import {atoms as a} from '#/alf'

/*
 * Fork: Android version of the iOS splash outro in Splash.tsx. Android 12+
 * draws its own launch splash (a centred icon on a solid colour), so this
 * overlay starts as an exact copy of that frame - same colours, logo size and
 * position - which makes the handoff from the system splash invisible. Once
 * the app is ready it runs the same grow-and-fade as iOS.
 *
 * Keep the colours and LOGO_WIDTH in sync with the `expo-splash-screen`
 * android options in app.config.js.
 */

/** Matches `imageWidth` of the android splash in app.config.js. */
const LOGO_WIDTH = 102
/**
 * The logo renders large and is scaled down, so the vector stays sharp while
 * it grows to cover the screen.
 */
const RENDER_WIDTH = 1000
const BASE_SCALE = LOGO_WIDTH / RENDER_WIDTH
const DURATION = 1200

const SPLASH_BG = '#006AFF' // primary_500
const SPLASH_BG_DARK = '#002861' // primary_900
/** Same off-spec fills as the iOS outro, so the growing logo matches the app. */
const LOGO_FILL = '#fff'
const LOGO_FILL_DARK = '#0F1824'

/**
 * The butterfly from Splash.tsx's Logo. The viewBox is cropped tightly to the
 * artwork (64x56) so it lines up with android-splash-logo-white.png, which
 * has no padding.
 */
const BUTTERFLY_PATH =
  'M13.873 3.77C21.21 9.243 29.103 20.342 32 26.3v15.732c0-.335-.13.043-.41.858-1.512 4.414-7.418 21.642-20.923 7.87-7.111-7.252-3.819-14.503 9.125-16.692-7.405 1.252-15.73-.817-18.014-8.93C1.12 22.804 0 8.431 0 6.488 0-3.237 8.579-.18 13.873 3.77ZM50.127 3.77C42.79 9.243 34.897 20.342 32 26.3v15.732c0-.335.13.043.41.858 1.512 4.414 7.418 21.642 20.923 7.87 7.111-7.252 3.819-14.503-9.125-16.692 7.405 1.252 15.73-.817 18.014-8.93C62.88 22.804 64 8.431 64 6.488 64-3.237 55.422-.18 50.127 3.77Z'

function Butterfly({fill}: {fill: string}) {
  return (
    <Svg
      viewBox="0 0 64 56"
      style={{width: RENDER_WIDTH, height: RENDER_WIDTH * (56 / 64)}}>
      <Path fill={fill} d={BUTTERFLY_PATH} />
    </Svg>
  )
}

export function Splash({
  isReady: isAppReady,
  children,
}: React.PropsWithChildren<{isReady: boolean}>) {
  const isDarkMode = useColorScheme() === 'dark'
  const outro = useSharedValue(0)
  const outroApp = useSharedValue(0)
  const [isLayoutReady, setIsLayoutReady] = useState(false)
  const [reduceMotion, setReduceMotion] = useState<boolean | undefined>()
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  const isReady = isAppReady && isLayoutReady && reduceMotion !== undefined

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => setReduceMotion(false))
  }, [])

  useEffect(() => {
    if (!isReady) return
    const onFinish = () => setIsAnimationComplete(true)
    SplashScreen.hideAsync()
      .catch(() => {})
      .then(() => {
        outro.set(
          withTiming(
            1,
            {duration: DURATION, easing: Easing.in(Easing.cubic)},
            () => {
              'worklet'
              scheduleOnRN(onFinish)
            },
          ),
        )
        outroApp.set(
          withTiming(1, {
            duration: DURATION,
            easing: Easing.inOut(Easing.cubic),
          }),
        )
      })
  }, [isReady, outro, outroApp])

  /** Background and logo fade together, as on iOS. */
  const splashAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(outro.get(), [0, 0.1, 0.2, 1], [1, 1, 0, 0], 'clamp'),
  }))

  /** A small squeeze, then the logo grows until it fills the screen. */
  const logoAnimation = useAnimatedStyle(() => {
    const outroScale = reduceMotion
      ? 1
      : interpolate(outro.get(), [0, 0.08, 1], [1, 0.8, 500], 'clamp')
    return {
      opacity: interpolate(
        outro.get(),
        [0, 0.1, 0.2, 1],
        [1, 1, 0, 0],
        'clamp',
      ),
      transform: [{scale: BASE_SCALE * outroScale}],
    }
  })

  /*
   * The system splash logo is always white, but in dark mode the growing logo
   * should be the dark app colour, so the white copy fades out during the
   * squeeze to reveal a dark one underneath.
   */
  const whiteLogoAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(outro.get(), [0, 0.08], [1, 0], 'clamp'),
  }))

  const appAnimation = useAnimatedStyle(() => ({
    transform: [
      {scale: interpolate(outroApp.get(), [0, 1], [1.1, 1], 'clamp')},
    ],
  }))

  return (
    <View style={a.flex_1} onLayout={() => setIsLayoutReady(true)}>
      {isReady && (
        <Animated.View style={[a.flex_1, appAnimation]}>
          {children}
        </Animated.View>
      )}

      {!isAnimationComplete && (
        <>
          <Animated.View
            style={[
              a.absolute,
              a.inset_0,
              a.pointer_events_none,
              {backgroundColor: isDarkMode ? SPLASH_BG_DARK : SPLASH_BG},
              splashAnimation,
            ]}
          />
          <Animated.View
            style={[
              a.absolute,
              a.inset_0,
              a.pointer_events_none,
              a.align_center,
              a.justify_center,
              logoAnimation,
            ]}>
            {isDarkMode ? (
              <View>
                <Butterfly fill={LOGO_FILL_DARK} />
                <Animated.View
                  style={[a.absolute, a.inset_0, whiteLogoAnimation]}>
                  <Butterfly fill={LOGO_FILL} />
                </Animated.View>
              </View>
            ) : (
              <Butterfly fill={LOGO_FILL} />
            )}
          </Animated.View>
        </>
      )}
    </View>
  )
}
