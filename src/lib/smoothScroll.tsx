import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'

let instance: Lenis | null = null

/** Jump (or glide) the page. Falls back to the native scroll when smooth scrolling is off. */
export function scrollPageTo(target: number | HTMLElement, immediate = false) {
  if (instance) instance.scrollTo(target, { immediate })
  else if (typeof target === 'number') window.scrollTo(0, target)
  else target.scrollIntoView()
}

/** Inertia scrolling for the storefront. Off for people who ask their system to reduce motion. */
export function SmoothScroll() {
  useEffect(() => {
    let reduce = false
    try {
      reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      /* ignore */
    }
    if (reduce) return
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
    instance = lenis
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      instance = null
    }
  }, [])
  return null
}
