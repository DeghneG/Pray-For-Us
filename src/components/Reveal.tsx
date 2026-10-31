import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import gsap from 'gsap'
import { introState, onIntroDone } from '../lib/intro'
import { useMotion } from '../lib/motion'

interface Props {
  children: ReactNode
  className?: string
  id?: string
  as?: ElementType
  /** Reveal each direct child one after another instead of the whole block at once. */
  group?: boolean
  /** Animate as soon as it mounts (for the top of a page) instead of waiting to scroll into view. */
  intro?: boolean
  delay?: number
  y?: number
}

/**
 * Scroll reveal with GSAP. Content below the fold starts hidden and rises in when it scrolls into view.
 * Content already on screen is never hidden, and the motion toggle / reduced-motion setting soften or skip it.
 */
export function Reveal({ children, className, id, as: Tag = 'div', group = false, intro = false, delay = 0, y = 36 }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { pausedRef } = useMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || pausedRef.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = group ? (Array.from(el.children) as HTMLElement[]) : [el]
    if (targets.length === 0) return
    const dist = reduce ? 0 : y
    const play = () =>
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: reduce ? 0.4 : 0.75,
        ease: 'power3.out',
        stagger: group ? 0.08 : 0,
        delay,
        clearProps: 'opacity,transform',
      })

    if (intro) {
      gsap.set(targets, { opacity: 0, y: dist })
      let cancelled = false
      const go = () => {
        if (!cancelled) play()
      }
      // On the first load, wait for the opening loader to finish so the page-top animation is actually seen.
      let off = () => {}
      if (introState.done) go()
      else off = onIntroDone(go)
      return () => {
        cancelled = true
        off()
        gsap.killTweensOf(targets)
        gsap.set(targets, { clearProps: 'opacity,transform' })
      }
    }

    // Already on screen: leave it alone so nothing flashes away and back.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return

    gsap.set(targets, { opacity: 0, y: dist })
    // Reveal once the block's top edge reaches the lower part of the screen. Anything already scrolled past
    // (fast scroll, anchor jump) also counts, so nothing is left invisible above the viewport.
    let done = false
    const stop = () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
    function check() {
      if (done || !el) return
      if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
        done = true
        stop()
        play()
      }
    }
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      done = true
      stop()
      gsap.killTweensOf(targets)
      gsap.set(targets, { clearProps: 'opacity,transform' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  )
}
