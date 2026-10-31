import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { useMotion } from '../lib/motion'

interface Props {
  /** Pixels per second. */
  speed?: number
  className?: string
  trackClassName?: string
  /** Render the content; the second call (`ghost`) is the duplicate that makes the loop seamless. */
  children: (ghost: boolean) => ReactNode
  pauseOnHover?: boolean
}

/** Seamless looping marquee driven by GSAP. Pauses on hover/focus/touch and with the site-wide motion toggle. */
export function Marquee({ speed = 60, className = '', trackClassName = '', children, pauseOnHover = true }: Props) {
  const track = useRef<HTMLDivElement>(null)
  const tween = useRef<gsap.core.Tween | null>(null)
  const held = useRef(false)
  const { paused, pausedRef, factor } = useMotion()

  const sync = () => tween.current?.paused(pausedRef.current || held.current)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const build = () => {
      tween.current?.kill()
      gsap.set(el, { x: 0 })
      const half = el.scrollWidth / 2
      if (!half) return
      tween.current = gsap.to(el, { x: -half, duration: half / (speed * factor), ease: 'none', repeat: -1 })
      sync()
    }
    build()
    const ro = new ResizeObserver(build)
    ro.observe(el)
    return () => {
      ro.disconnect()
      tween.current?.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, factor])

  useEffect(() => {
    sync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused])

  const hold = (v: boolean) => {
    if (!pauseOnHover) return
    held.current = v
    sync()
  }

  return (
    <div
      className={`overflow-hidden ${className}`}
      onPointerEnter={() => hold(true)}
      onPointerLeave={() => hold(false)}
      onFocusCapture={() => hold(true)}
      onBlurCapture={() => hold(false)}
    >
      <div ref={track} className={`flex w-max will-change-transform ${trackClassName}`}>
        {children(false)}
        {children(true)}
      </div>
    </div>
  )
}

export function MotionToggle() {
  const { paused, toggle } = useMotion()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/70 underline-offset-4 hover:text-peri-light hover:underline"
    >
      {paused ? '▶ Play motion' : '⏸ Pause motion'}
    </button>
  )
}
