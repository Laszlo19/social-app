import {type Nux} from '#/state/queries/nuxs/definitions'

/*
 * NuxDialogs renders as a sibling of the navigator, so its context provider
 * does not wrap app screens (e.g. Settings). This module bridges that gap: the
 * active NuxDialogs instance registers a handler, and any screen can trigger a
 * NUX by calling triggerNuxExternally. Used by Developer Options to force-show
 * a NUX for testing.
 */

let handler: ((id: Nux) => void) | null = null

export function setNuxTriggerHandler(fn: ((id: Nux) => void) | null) {
  handler = fn
}

export function triggerNuxExternally(id: Nux) {
  handler?.(id)
}
