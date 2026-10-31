// Tracks whether the opening loader has finished, so page-top reveals can wait for it.

/** Flip to false to remove the opening loader entirely. */
// Skipped inside the admin mobile preview (?embed) and on /admin pages.
const skip = typeof window !== 'undefined' && (window.location.search.includes('embed') || window.location.pathname.startsWith('/admin'))
export const SHOW_PRELOADER = !skip

export const introState = { done: !SHOW_PRELOADER }

const waiting = new Set<() => void>()

export function finishIntro() {
  introState.done = true
  waiting.forEach((cb) => cb())
  waiting.clear()
}

/** Run `cb` once the loader is gone. Returns an unsubscribe function. */
export function onIntroDone(cb: () => void) {
  waiting.add(cb)
  return () => {
    waiting.delete(cb)
  }
}
