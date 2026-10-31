import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import parts from '../data/logoParts.json'
import { finishIntro, SHOW_PRELOADER } from '../lib/intro'

// The opening loader is built from the real logo, cut into layers by scripts/split-logo.mjs:
//   base.webp  = oval + crown-of-thorns wire + lettering, with no nails
//   nail-N.webp = the nails, cut out of the logo pixel for pixel
// The base appears first; then each nail drives in along its own axis, through the wire, to its place in the logo.

const DIR = '/logo-parts/'
const pct = (n: number, of: number) => `${(n / of) * 100}%`

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
      const reach = stage.offsetWidth * 1.2
      const nails = q('.pl-nail') as HTMLElement[]
      const shake = () =>
        gsap.fromTo(
          q('.pl-body'),
          { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 },
          { x: 0, y: 0, duration: 0.2, ease: 'elastic.out(1,0.4)', overwrite: 'auto' },
        )

      // Start state: nails far outside along their own axes.
      nails.forEach((n) => gsap.set(n, { x: Number(n.dataset.dx) * reach, y: Number(n.dataset.dy) * reach }))

      tl = gsap.timeline({ onComplete: () => gsap.delayedCall(0.4, leave) })
      tl.fromTo(q('.pl-base'), { scale: 0.6, opacity: 0, rotate: -4, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.5)' }, 0)
        .fromTo(q('.pl-bar'), { scaleX: 0 }, { scaleX: 1, duration: 2.7, ease: 'none', transformOrigin: '0 50%' }, 0)

      const order = gsap.utils.shuffle(nails.map((_, i) => i))
      order.forEach((idx, n) => {
        const nail = nails[idx]
        const at = 1.0 + n * 0.028
        const dx = Number(nail.dataset.dx)
        const dy = Number(nail.dataset.dy)
        tl!
          .to(nail, { x: 0, y: 0, duration: 0.42, ease: 'power4.in' }, at)
          // recoil on impact, then settle
          .to(nail, { x: -dx * 7, y: -dy * 7, duration: 0.05, ease: 'power2.out' }, at + 0.42)
          .to(nail, { x: 0, y: 0, duration: 0.12, ease: 'power2.inOut' }, at + 0.47)
        if (n % 3 === 0) tl!.call(shake, undefined, at + 0.42)
      })

      // Hand off to the untouched logo, so the final frame is exactly the real artwork.
      tl.to(q('.pl-final'), { opacity: 1, duration: 0.2 }, '>0.1')
        .to(q('.pl-glow'), { filter: 'drop-shadow(0 0 46px rgba(142,155,255,0.95))', duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<')
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
        </div>
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
