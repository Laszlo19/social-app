import {useEffect, useState} from 'react'
import {
  AccessibilityInfo,
  Image as RNImage,
  useColorScheme,
  View,
} from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import Svg, {Path} from 'react-native-svg'
import {scheduleOnRN} from 'react-native-worklets'
import {Image} from 'expo-image'
import * as SplashScreen from 'expo-splash-screen'

import {Logotype} from '#/view/icons/Logotype'
import {atoms as a} from '#/alf'
// @ts-expect-error
import splashImagePointer from '../assets/splash/splash.png'
// @ts-expect-error
import darkSplashImagePointer from '../assets/splash/splash-dark.png'

/*
 * Fork: Android port of the iOS splash animation in Splash.tsx, with the same
 * gradient, logo, wordmark and timings.
 *
 * Two Android-specific differences:
 *
 * 1. Android 12+ always draws its own launch splash: a centred logo on a
 *    solid colour, which can't be a gradient. So instead of the iOS intro
 *    (logo fading in over the gradient) the overlay starts as an exact copy of
 *    the system splash and morphs into the iOS starting frame: the gradient
 *    fades in, the logo slides to the iOS position and the wordmark appears.
 *
 * 2. The animation only starts once the app has mounted and laid out behind
 *    the system splash. Mounting the app blocks the UI thread, and starting
 *    the timers during that would drop most of the animation's frames.
 *
 * Keep SPLASH_BG* and LOGO_WIDTH in sync with the `expo-splash-screen`
 * android options in app.config.js.
 */

const splashImageUri = RNImage.resolveAssetSource(splashImagePointer)!.uri
const darkSplashImageUri = RNImage.resolveAssetSource(
  darkSplashImagePointer,
)!.uri

/** Matches `imageWidth` of the android splash in app.config.js. */
const LOGO_WIDTH = 102
/** The iOS logo is 100dp wide (a 1000-wide Logo scaled by 0.1). */
const IOS_LOGO_WIDTH = 100
/**
 * The iOS Logo's viewBox has padding below the artwork, so the butterfly sits
 * this far above the centre of the screen.
 */
const IOS_LOGO_LIFT = 7.8
/**
 * The logo renders large and is scaled down, so the vector stays sharp while
 * it grows to cover the screen.
 */
const RENDER_WIDTH = 1000
const BASE_SCALE = LOGO_WIDTH / RENDER_WIDTH

const SPLASH_BG = '#006AFF' // primary_500
const SPLASH_BG_DARK = '#002861' // primary_900
const LOGO_FILL = '#fff'
/** Same special off-spec dark mode colour as iOS. */
const LOGO_FILL_DARK = '#0F1824'

/**
 * The butterfly from Splash.tsx's Logo, with the viewBox cropped tightly to
 * the artwork (64x56) so it lines up with android-splash-logo-white.png,
 * which has no padding.
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
  const insets = useSafeAreaInsets()
  const isDarkMode = useColorScheme() === 'dark'
  const intro = useSharedValue(0)
  const outroLogo = useSharedValue(0)
  const outroApp = useSharedValue(0)
  const outroSplashOpacity = useSharedValue(0)
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isLayoutReady, setIsLayoutReady] = useState(false)
  const [isAppLaidOut, setIsAppLaidOut] = useState(false)
  const [reduceMotion, setReduceMotion] = useState<boolean | undefined>()
  const isReady =
    isAppReady && isImageLoaded && isLayoutReady && reduceMotion !== undefined
  const canAnimate = isReady && isAppLaidOut

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => setReduceMotion(false))
  }, [])

  useEffect(() => {
    if (!canAnimate) return
    const onFinish = () => setIsAnimationComplete(true)
    let frame = requestAnimationFrame(() => {
      // a second frame, so the app's first draw has landed too
      frame = requestAnimationFrame(() => {
        SplashScreen.hideAsync()
          .catch(() => {})
          .then(() => {
            intro.set(
              withTiming(
                1,
                {duration: 400, easing: Easing.out(Easing.cubic)},
                () => {
                  'worklet'
                  outroLogo.set(
                    withTiming(
                      1,
                      {duration: 1200, easing: Easing.in(Easing.cubic)},
                      () => {
                        scheduleOnRN(onFinish)
                      },
                    ),
                  )
                  outroApp.set(
                    withTiming(1, {
                      duration: 1200,
                      easing: Easing.inOut(Easing.cubic),
                    }),
                  )
                  outroSplashOpacity.set(
                    withTiming(1, {
                      duration: 1200,
                      easing: Easing.in(Easing.cubic),
                    }),
                  )
                },
              ),
            )
          })
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [canAnimate, intro, outroLogo, outroApp, outroSplashOpacity])

  const logoAnimation = useAnimatedStyle(() => {
    const introScale = interpolate(
      intro.get(),
      [0, 1],
      [1, IOS_LOGO_WIDTH / LOGO_WIDTH],
      'clamp',
    )
    const outroScale =
      reduceMotion === true
        ? 1
        : interpolate(outroLogo.get(), [0, 0.08, 1], [1, 0.8, 500], 'clamp')
    const introLift = interpolate(
      intro.get(),
      [0, 1],
      [0, -(IOS_LOGO_LIFT + insets.top / 2)],
      'clamp',
    )
    const outroOpacity = interpolate(
      outroSplashOpacity.get(),
      [0, 0.1, 0.2, 1],
      [1, 1, 0, 0],
      'clamp',
    )

    return {
      opacity: outroOpacity,
      transform: [
        {translateY: introLift},
        {scale: BASE_SCALE * introScale * outroScale},
      ],
    }
  })

  /*
   * The system splash logo is always white. In dark mode the iOS logo is the
   * dark app colour, so the white copy fades out during the intro.
   */
  const whiteLogoAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(intro.get(), [0, 1], [1, 0], 'clamp'),
  }))

  /** Fades in the iOS gradient over the system splash's solid colour. */
  const gradientAnimation = useAnimatedStyle(() => ({
    opacity: intro.get(),
  }))

  const bottomLogoAnimation = useAnimatedStyle(() => ({
    opacity: intro.get(),
  }))

  const splashAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(
      outroSplashOpacity.get(),
      [0, 0.1, 0.2, 1],
      [1, 1, 0, 0],
      'clamp',
    ),
  }))

  const appAnimation = useAnimatedStyle(() => ({
    transform: [
      {scale: interpolate(outroApp.get(), [0, 1], [1.1, 1], 'clamp')},
    ],
  }))

  return (
    <View style={a.flex_1} onLayout={() => setIsLayoutReady(true)}>
      {isReady && (
        <Animated.View
          style={[a.flex_1, appAnimation]}
          onLayout={() => setIsAppLaidOut(true)}>
          {children}
        </Animated.View>
      )}

      {!isAnimationComplete && (
        <Animated.View
          style={[
            a.absolute,
            a.inset_0,
            a.pointer_events_none,
            {backgroundColor: isDarkMode ? SPLASH_BG_DARK : SPLASH_BG},
            splashAnimation,
          ]}>
          <Animated.View style={[a.absolute, a.inset_0, gradientAnimation]}>
            <Image
              accessibilityIgnoresInvertColors
              onLoadEnd={() => setIsImageLoaded(true)}
              source={{uri: isDarkMode ? darkSplashImageUri : splashImageUri}}
              style={[a.absolute, a.inset_0]}
            />
          </Animated.View>

          <Animated.View
            style={[
              a.absolute,
              a.align_center,
              a.justify_center,
              {bottom: insets.bottom + 40, left: 0, right: 0},
              bottomLogoAnimation,
            ]}>
            <Logotype fill="#fff" width={90} />
          </Animated.View>
        </Animated.View>
      )}

      {!isAnimationComplete && (
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
      )}
    </View>
  )
}
