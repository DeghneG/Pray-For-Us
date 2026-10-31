import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import parts from '../data/logoParts.json'
import { finishIntro, SHOW_PRELOADER } from '../lib/intro'

// The opening loader is built from the real logo, cut into layers by scripts/split-logo.mjs:
//   base.webp  = oval + crown-of-thorns wire + lettering, with no nails
//   nail-N.webp = the nails, cut out of the logo pixel for pixel
// The base appears first; then each nail drives in along its own axis, through the wire, to its place in the logo.
// Every nail hit jolts the whole logo away from the strike and flashes where it lands; the last nail hits hardest
// and sends a shockwave ring out of the logo.

const DIR = '/logo-parts/'
const pct = (n: number, of: number) => `${(n / of) * 100}%`

// Where each nail's inner tip lands, as a percentage of the logo, so the impact flash sits on the strike point.
const impacts = parts.nails.map((n) => {
  const x0 = Math.min(...n.pieces.map((p) => p.x))
  const y0 = Math.min(...n.pieces.map((p) => p.y))
  const x1 = Math.max(...n.pieces.map((p) => p.x + p.w))
  const y1 = Math.max(...n.pieces.map((p) => p.y + p.h))
  const half = 0.5 * (Math.abs(n.dx) * (x1 - x0) + Math.abs(n.dy) * (y1 - y0))
  const cx = (x0 + x1) / 2 - n.dx * half * 0.7
  const cy = (y0 + y1) / 2 - n.dy * half * 0.7
  return { x: (cx / parts.w) * 100, y: (cy / parts.h) * 100 }
})

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
      gsap.set(el, { opacity: 1 })
      if (reduce) {
        gsap.delayedCall(0.9, leave)
        return
      }

      const stage = q('.pl-stage')[0] as HTMLElement
      const size = stage.offsetWidth
      const reach = size * 1.2
      const nails = q('.pl-nail') as HTMLElement[]
      const flashes = q('.pl-flash') as HTMLElement[]
      const shake = q('.pl-shake')
      const ring = q('.pl-ring')

      // Jolt the whole logo away from the strike, then let it spring back.
      const jolt = (dx: number, dy: number, power: number) =>
        gsap.fromTo(
          shake,
          { x: -dx * size * 0.006 * power, y: -dy * size * 0.006 * power, scale: 1 + 0.004 * power },
          { x: 0, y: 0, scale: 1, duration: 0.16 + 0.05 * power, ease: 'elastic.out(1,0.45)', overwrite: 'auto' },
        )

      // Start state: nails far outside along their own axes; flashes and ring hidden.
      nails.forEach((n) => gsap.set(n, { x: Number(n.dataset.dx) * reach, y: Number(n.dataset.dy) * reach }))
      gsap.set(flashes, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 })
      gsap.set(ring, { xPercent: -50, yPercent: -50, scale: 0.7, opacity: 0 })

      tl = gsap.timeline({ onComplete: () => gsap.delayedCall(0.4, leave) })
      tl.fromTo(q('.pl-base'), { scale: 0.6, opacity: 0, rotate: -4, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.5)' }, 0)

      const order = gsap.utils.shuffle(nails.map((_, i) => i))
      const last = order[order.length - 1]
      let lastImpact = 0

      order.forEach((idx, n) => {
        const nail = nails[idx]
        const flash = flashes[idx]
        const at = 1.0 + n * 0.028
        const hit = at + 0.42
        const dx = Number(nail.dataset.dx)
        const dy = Number(nail.dataset.dy)
        const heavy = idx === last
        if (heavy) lastImpact = hit

        tl!
          .to(nail, { x: 0, y: 0, duration: 0.42, ease: 'power4.in' }, at)
          // recoil on impact, then settle
          .to(nail, { x: -dx * 7, y: -dy * 7, duration: 0.05, ease: 'power2.out' }, hit)
          .to(nail, { x: 0, y: 0, duration: 0.12, ease: 'power2.inOut' }, hit + 0.05)
          // flash where the tip lands
          .fromTo(flash, { scale: heavy ? 0.5 : 0.25, opacity: 1 }, { scale: heavy ? 3.4 : 1.5, opacity: 0, duration: heavy ? 0.6 : 0.34, ease: 'power2.out' }, hit)
          .call(() => jolt(dx, dy, heavy ? 6 : 1), undefined, hit)
      })

      // The last nail is the heaviest: shockwave ring out of the logo.
      tl.fromTo(ring, { scale: 0.7, opacity: 0.9 }, { scale: 1.7, opacity: 0, duration: 0.9, ease: 'power2.out' }, lastImpact)

      // Hand off to the untouched logo, so the final frame is exactly the real artwork.
      tl.to(q('.pl-final'), { opacity: 1, duration: 0.2 }, lastImpact + 0.18)
        .to(q('.pl-glow'), { filter: 'drop-shadow(0 0 46px rgba(142,155,255,0.95))', duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, lastImpact)
    }

    // Wait for the cut-out images (and the label font) so nothing pops in mid-animation.
    const imgs = Array.from(el.querySelectorAll('img'))
    const decoded = Promise.all(imgs.map((i) => (i.decode ? i.decode().catch(() => undefined) : Promise.resolve())))
    Promise.race([Promise.all([decoded, document.fonts.ready]), new Promise((r) => setTimeout(r, 2500))]).then(build)

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
        <div className="pl-stage relative w-[min(88vw,820px)]" style={{ aspectRatio: `${parts.w} / ${parts.h}` }}>
          <span
            className="pl-ring pointer-events-none absolute left-1/2 top-1/2 rounded-[50%] border-[3px] border-peri-light opacity-0"
            style={{ width: '96%', height: '92%' }}
            aria-hidden="true"
          />
          <div className="pl-shake absolute inset-0">
            <div className="pl-body absolute inset-0">
              <img className="pl-base absolute inset-0 h-full w-full" src={`${DIR}base.webp`} alt="" />
            </div>
            {parts.nails.map((nail, i) => (
              <div key={i} className="pl-nail absolute inset-0 will-change-transform" data-dx={nail.dx} data-dy={nail.dy}>
                {nail.pieces.map((p) => (
                  <img
                    key={p.file}
                    src={`${DIR}${p.file}`}
                    alt=""
                    className="absolute"
                    style={{ left: pct(p.x, parts.w), top: pct(p.y, parts.h), width: pct(p.w, parts.w), height: pct(p.h, parts.h) }}
                  />
                ))}
              </div>
            ))}
            <img className="pl-final absolute inset-0 h-full w-full opacity-0" src="/logo.png" alt="" style={{ objectFit: 'fill' }} />
            {impacts.map((pt, i) => (
              <span
                key={i}
                className="pl-flash pointer-events-none absolute aspect-square rounded-full opacity-0"
                aria-hidden="true"
                style={{
                  left: `${pt.x}%`,
                  top: `${pt.y}%`,
                  width: '9%',
                  background: 'radial-gradient(circle, #fff 0%, rgba(190,198,255,0.85) 30%, rgba(92,108,242,0) 70%)',
                  mixBlendMode: 'screen',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-bone/60">Pray for us</p>

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
