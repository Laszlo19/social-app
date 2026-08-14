import {type Nux} from '#/state/queries/nuxs/definitions'

/*
 * NuxDialogs renders as a sibling of the navigator, so its context provider
 * does not wrap app screens (e.g. Settings). This module bridges that gap: the
 * active NuxDialogs instance registers a handler, and any screen can trigger a
 * NUX by calling triggerNuxExternally. Used by Developer Options to force-show
 * a NUX for testing.
 */

/**
 * Optional dev-only preview payload passed alongside a manual trigger. NUXs
 * whose rendered content depends on device state (e.g. the iOS-version sunset
 * warning, which picks its copy from the running OS version) read this so every
 * variant can be previewed on any platform. Ignored on the real auto-show path.
 */
export type NuxPreview = {variant?: string}

let handler: ((id: Nux, preview?: NuxPreview) => void) | null = null

export function setNuxTriggerHandler(
  fn: ((id: Nux, preview?: NuxPreview) => void) | null,
) {
  handler = fn
}

export function triggerNuxExternally(id: Nux, preview?: NuxPreview) {
  handler?.(id, preview)
}
