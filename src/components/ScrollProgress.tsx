import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'

/**
 * Reading-progress bar: a length of barbed wire that unrolls across the top of the page as you scroll,
 * with a nail driven in at the leading edge.
 */
export function ScrollProgress() {
  const id = 'sp' + useId().replace(/:/g, '')
  const fill = useRef<HTMLDivElement>(null)
  const nail = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const f = fill.current
    const n = nail.current
    const t = track.current
    if (!f || !n || !t) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const setW = gsap.quickSetter(f, 'width', 'px')
    const setX = gsap.quickSetter(n, 'x', 'px')
    let target = 0
    let shown = 0
    let raf = 0

    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      target = p * t.clientWidth
      n.style.opacity = p > 0.002 ? '1' : '0'
      // A small tilt while moving, like the nail is being hammered along.
      gsap.to(n, { rotate: p > 0.002 ? -2 : 0, duration: 0.2, overwrite: 'auto' })
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const tick = () => {
      shown += (target - shown) * (reduce ? 1 : 0.18)
      if (Math.abs(target - shown) < 0.3) shown = target
      setW(shown)
      setX(shown)
      raf = Math.abs(target - shown) > 0 ? requestAnimationFrame(tick) : 0
    }

    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={track}
      className="pointer-events-none absolute inset-x-0 -bottom-[7px] z-10 h-4"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-hidden="true"
    >
      <div ref={fill} className="absolute left-0 top-0 h-4 w-0 overflow-hidden">
        <svg className="block h-4 text-peri" style={{ width: '100vw', maxWidth: 'none' }} aria-hidden="true">
          <defs>
            <pattern id={id} width="48" height="16" patternUnits="userSpaceOnUse">
              {/* two twisted strands */}
              <path d="M0 8 Q12 2 24 8 T48 8" fill="none" stroke="#F4F4F8" strokeWidth="2" />
              <path d="M0 8 Q12 14 24 8 T48 8" fill="none" stroke="#F4F4F8" strokeWidth="1.3" opacity="0.65" />
              {/* barb */}
              <path d="M18 2 L30 14 M30 2 L18 14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
      </div>
      {/* the nail: point faces the unrolled end, so it looks driven in along the wire */}
      <div ref={nail} className="absolute left-0 top-0 h-4 w-0 opacity-0" style={{ filter: 'drop-shadow(0 0 5px rgba(92,108,242,0.95))' }}>
        <svg viewBox="0 0 44 16" className="absolute right-[-8px] top-0 h-4 w-11" aria-hidden="true">
          <polygon points="0,3 5,1 5,15 0,13" fill="#fff" stroke="#5C6CF2" strokeWidth="1.5" strokeLinejoin="round" />
          <polygon points="5,6 40,8 5,10" fill="#fff" stroke="#5C6CF2" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
