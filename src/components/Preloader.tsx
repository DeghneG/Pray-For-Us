import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { finishIntro, SHOW_PRELOADER } from '../lib/intro'

// Nails, in the logo's own coordinate space (700 x 340, oval centred on 350,170).
// x,y = centre of the nail, a = angle in degrees, l = length. They cross the wire ring, which sits at rx 262 / ry 104.
const NAILS = [
  { x: 112, y: 104, a: 62, l: 200 },
  { x: 182, y: 80, a: 78, l: 215 },
  { x: 258, y: 68, a: 102, l: 235 },
  { x: 352, y: 58, a: 88, l: 250 },
  { x: 446, y: 68, a: 72, l: 225 },
  { x: 532, y: 82, a: 106, l: 220 },
  { x: 600, y: 108, a: 122, l: 195 },
  { x: 122, y: 236, a: 118, l: 195 },
  { x: 204, y: 258, a: 100, l: 225 },
  { x: 292, y: 266, a: 80, l: 235 },
  { x: 382, y: 272, a: 112, l: 245 },
  { x: 470, y: 260, a: 95, l: 225 },
  { x: 556, y: 240, a: 70, l: 215 },
  { x: 612, y: 198, a: 132, l: 175 },
]

const W = 7 // half-width of a nail at its thickest point

export function Preloader() {
  const [gone, setGone] = useState(!SHOW_PRELOADER)
  const root = useRef<HTMLDivElement>(null)
  const skip = useRef<() => void>(() => {})

  useEffect(() => {
    if (gone) return
    const el = root.current
    if (!el) return
    document.body.style.overflow = 'hidden'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cancelled = false
    let tl: gsap.core.Timeline | undefined

    const leave = () => {
      if (cancelled) return
      gsap.to(el, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          setGone(true)
          finishIntro()
        },
      })
    }
    skip.current = () => {
      tl?.kill()
      leave()
    }

    const build = () => {
      if (cancelled) return
      const q = gsap.utils.selector(el)
      const nails = q('.pl-nail') as unknown as SVGElement[]
      gsap.set(el, { opacity: 1 })

      if (reduce) {
        gsap.delayedCall(0.9, leave)
        return
      }

      const shake = () =>
        gsap.fromTo(
          q('.pl-body'),
          { x: (Math.random() - 0.5) * 7, y: (Math.random() - 0.5) * 7 },
          { x: 0, y: 0, duration: 0.18, ease: 'elastic.out(1,0.4)', overwrite: 'auto' },
        )

      tl = gsap.timeline({ onComplete: () => gsap.delayedCall(0.45, leave) })
      tl.fromTo(q('.pl-oval'), { scale: 0.55, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' }, 0)
        .fromTo(q('.pl-wire'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0.25)
        .fromTo(q('.pl-twist'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.95)
        .fromTo(q('.pl-text'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.7)
        .fromTo(q('.pl-bar'), { scaleX: 0 }, { scaleX: 1, duration: 2.9, ease: 'none', transformOrigin: '0 50%' }, 0)

      // Each nail starts far outside along its own axis, then drives in through the wire and lands in place.
      const order = gsap.utils.shuffle(nails.map((_, i) => i))
      order.forEach((idx, n) => {
        const nail = nails[idx]
        const side = idx % 2 === 0 ? 1 : -1
        const at = 1.2 + n * 0.065
        tl!
          .fromTo(nail, { x: side * 1800 }, { x: 0, duration: 0.42, ease: 'power4.in' }, at)
          .to(nail, { x: -side * 8, duration: 0.05, ease: 'power2.out' }, at + 0.42)
          .to(nail, { x: 0, duration: 0.12, ease: 'power2.inOut' }, at + 0.47)
          .call(shake, undefined, at + 0.42)
      })

      tl.to(q('.pl-glow'), { filter: 'drop-shadow(0 0 46px rgba(142,155,255,0.95))', duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '>-0.05')
    }

    // Wait briefly for the display font so the lettering does not jump.
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(build)

    return () => {
      cancelled = true
      tl?.kill()
      gsap.killTweensOf(el)
      document.body.style.overflow = ''
    }
  }, [gone])

  if (gone) return null

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading Pray For Us"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-ink opacity-0"
    >
      <div className="pl-glow" style={{ filter: 'drop-shadow(0 0 26px rgba(92,108,242,0.55))' }}>
        <svg viewBox="-20 -24 740 388" className="w-[min(88vw,780px)] overflow-visible" aria-hidden="true">
          <g className="pl-body">
            <ellipse className="pl-oval" cx="350" cy="170" rx="300" ry="135" fill="#5C6CF2" />
            <text
              className="pl-text"
              x="350"
              y="208"
              textAnchor="middle"
              fill="#fff"
              style={{ fontFamily: "Anton, Impact, 'Arial Black', sans-serif", fontSize: 120 }}
              textLength="468"
              lengthAdjust="spacingAndGlyphs"
            >
              PRAY FOR US
            </text>
            <ellipse className="pl-wire" cx="350" cy="170" rx="262" ry="104" fill="none" stroke="#fff" strokeWidth="13" pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
            <ellipse className="pl-twist" cx="350" cy="170" rx="262" ry="104" fill="none" stroke="#5C6CF2" strokeWidth="13" pathLength={1} strokeDasharray="0.004 0.021" opacity="0" />
          </g>
          <g>
            {NAILS.map((n, i) => (
              <g key={i} transform={`translate(${n.x} ${n.y}) rotate(${n.a})`}>
                <polygon
                  className="pl-nail"
                  points={`${-n.l / 2},0 0,${-W} ${n.l / 2},0 0,${W}`}
                  fill="#fff"
                  stroke="#5C6CF2"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="mt-8 w-[min(70vw,360px)]">
        <div className="h-[3px] w-full bg-bone/15">
          <div className="pl-bar h-full w-full origin-left scale-x-0 bg-peri" />
        </div>
        <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-bone/60">Pray for us</p>
      </div>

      <button
        type="button"
        onClick={() => skip.current()}
        className="absolute bottom-6 right-6 font-mono text-[11px] uppercase tracking-[0.25em] text-bone/60 underline-offset-4 hover:text-peri-light hover:underline"
      >
        Skip
      </button>
    </div>
  )
}
