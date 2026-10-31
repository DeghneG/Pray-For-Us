// Tracks whether the opening loader has finished, so page-top reveals can wait for it.

/** Flip to false to remove the opening loader entirely. */
export const SHOW_PRELOADER = true

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
