import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { LINKS } from '../data/products'
import { useBag } from '../lib/bag'

const SEEN_KEY = 'pfu-guide-seen'
const DEMO_KEY = 'windmill-tee|L|' // the bag line the tour adds, so it can be removed afterwards

export function tourSeen() {
  try {
    return localStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return true
  }
}
function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* ignore */
  }
}

interface Step {
  id: string
  title: string
  body: string
  /** One line telling the visitor they can do it themselves. */
  hint?: string
  /** CSS selector of the thing to highlight. No target = centered card. */
  target?: string
  /** True when the current page is the right one for this step. */
  pathOk?: (p: string) => boolean
  /** Where to go if the page is wrong. */
  go?: string
  /** Detects that the visitor already did the step themselves. */
  done?: () => boolean
  /** What "Next" does on the real page before moving on. */
  act?: () => void
  nextLabel?: string
  enter?: () => void
  center?: boolean
}

const q = (sel: string) => document.querySelector(sel) as HTMLElement | null

interface Props {
  /** null = closed; otherwise the step to start on (0 = welcome card). */
  startAt: number | null
  onClose: () => void
}

export function Tour({ startAt, onClose }: Props) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const bag = useBag()
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const [vw, setVw] = useState(() => window.innerWidth)
  const [vh, setVh] = useState(() => window.innerHeight)
  const card = useRef<HTMLDivElement>(null)
  const hadItem = useRef(false)
  const advanced = useRef(false)
  const [ok, setOk] = useState(false) // the step's action just happened: show a beat of confirmation before moving on
  const open = startAt !== null

  const steps = useMemo<Step[]>(
    () => [
      {
        id: 'welcome',
        center: true,
        title: 'Want a quick walkthrough?',
        body: 'I will take you through ordering a piece, step by step, right on the real site. It takes about a minute, and nothing is bought.',
        nextLabel: 'Start the demo',
      },
      {
        id: 'pick',
        title: 'Pick a piece',
        body: 'This is the shop. Every piece shows its price and "+ shipping fee". Tap one to open it.',
        hint: 'Tap the highlighted tee yourself, or press Next.',
        target: '[data-tour="product-windmill-tee"]',
        pathOk: (p) => p === '/shop',
        go: '/shop',
        done: () => window.location.pathname.startsWith('/product/'),
        act: () => navigate('/product/windmill-tee'),
      },
      {
        id: 'size',
        title: 'Choose your size',
        body: 'Pick the size that fits. The size chart right under it lists the measurements in inches.',
        hint: 'Tap a size, or press Next and I will pick L for you.',
        target: '[data-tour="sizes"]',
        pathOk: (p) => p.startsWith('/product/'),
        go: '/product/windmill-tee',
        done: () => Boolean(q('[data-tour="sizes"] [aria-pressed="true"]')),
        act: () => q('[data-tour="sizes"] button[data-size="L"]')?.click(),
      },
      {
        id: 'add',
        title: 'Add it to your bag',
        body: 'Add as many pieces as you like. DAY and NITE tees together get the set price automatically.',
        hint: 'Tap Add to bag, or press Next.',
        target: '[data-tour="add"]',
        pathOk: (p) => p.startsWith('/product/'),
        enter: () => bag.setOpen(false),
        done: () => Boolean(q('[data-tour="bag"]')),
        act: () => q('[data-tour="add"]')?.click(),
      },
      {
        id: 'bag',
        title: 'Check your bag',
        body: 'Everything you picked is here with the subtotal. Shipping is a separate fee, which we quote once you send the order.',
        target: '[data-tour="bag"]',
        act: () => q('[data-tour="checkout-btn"]')?.click(),
        nextLabel: 'Go to checkout',
      },
      {
        id: 'details',
        title: 'Tell us where to send it',
        body: 'Name, mobile number and address. We only use these to process and deliver your order.',
        target: '[data-tour="checkout-form"]',
        pathOk: (p) => p === '/checkout',
        go: '/checkout',
        enter: () => bag.setOpen(false),
      },
      {
        id: 'send',
        title: 'Send it in Messenger',
        body: 'Place your order request and we write the message for you. One tap copies it and opens Messenger. Send it, and we reply with your exact shipping fee and how to pay.',
        target: '[data-tour="place"]',
        pathOk: (p) => p === '/checkout',
        go: '/checkout',
        nextLabel: 'Finish',
      },
      {
        id: 'end',
        center: true,
        title: "That's it. Pray for us.",
        body: 'You can replay this any time with the Guide button in the top bar. Questions? We are in Messenger.',
        nextLabel: 'Start shopping',
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate],
  )

  const total = steps.length - 2 // welcome and ending do not count
  const s = steps[step]

  const finish = useCallback(
    (to?: string) => {
      markSeen()
      if (open) {
        if (!hadItem.current) bag.remove(DEMO_KEY)
        bag.setOpen(false)
      }
      onClose()
      if (to) navigate(to)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, onClose, navigate],
  )

  // Start.
  useEffect(() => {
    if (startAt === null) return
    hadItem.current = bag.items.some((i) => i.slug === 'windmill-tee')
    advanced.current = false
    setStep(startAt)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAt])

  // Entering a step: run its hook and bring the visitor to the right page.
  useEffect(() => {
    if (!open) return
    advanced.current = false
    setOk(false)
    s.enter?.()
    if (s.pathOk && s.go && !s.pathOk(window.location.pathname)) navigate(s.go)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, open])

  // Follow the highlighted element as the page moves, scrolls or changes.
  useEffect(() => {
    if (!open || !s.target) {
      setRect(null)
      return
    }
    let raf = 0
    let scrolled = false
    const tick = () => {
      const el = q(s.target!)
      if (el) {
        const r = el.getBoundingClientRect()
        const next = { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }
        setRect((p) => (p && p.x === next.x && p.y === next.y && p.w === next.w && p.h === next.h ? p : next))
        if (!scrolled && r.height > 0) {
          scrolled = true
          if (r.top < 90 || r.bottom > window.innerHeight - 90) el.scrollIntoView({ block: r.height > window.innerHeight * 0.6 ? 'start' : 'center', behavior: 'smooth' })
        }
      } else {
        setRect(null)
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [step, open, pathname, s.target])

  // If the visitor did the step themselves, move on.
  useEffect(() => {
    if (!open || !s.done) return
    const t = window.setInterval(() => {
      if (!advanced.current && s.done!()) {
        advanced.current = true
        setOk(true)
        window.setTimeout(() => setStep((n) => Math.min(steps.length - 1, n + 1)), 1800)
      }
    }, 250)
    return () => window.clearInterval(t)
  }, [step, open, s, steps.length])

  useEffect(() => {
    const on = () => {
      setVw(window.innerWidth)
      setVh(window.innerHeight)
    }
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && finish()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, finish])

  useEffect(() => {
    if (!open || !card.current) return
    gsap.fromTo(card.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'opacity,transform' })
  }, [step, open])

  if (!open) return null

  function next() {
    const cur = steps[step]
    if (cur.id === 'welcome') return setStep(1)
    if (cur.id === 'end') return finish('/shop')
    if (advanced.current) return // already moving on (the visitor did the step themselves)
    advanced.current = true
    cur.act?.()
    // let the real click land and stay visible before the next card appears
    if (cur.act) setOk(true)
    window.setTimeout(() => setStep((n) => Math.min(steps.length - 1, n + 1)), cur.act ? 1600 : 0)
  }

  const pad = 8
  const hole = rect && !s.center ? { left: rect.x - pad, top: rect.y - pad, width: rect.w + pad * 2, height: rect.h + pad * 2 } : null
  const mobile = vw < 640
  const tall = rect ? rect.h > vh * 0.55 : false
  const cardW = Math.min(380, vw - 24)

  let cardStyle: React.CSSProperties
  if (!hole || s.center) {
    cardStyle = { left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: cardW }
  } else if (!mobile && tall && hole.left > cardW + 40) {
    // a tall target on the right (the bag): put the card beside it, not on top of it
    cardStyle = { left: hole.left - cardW - 16, top: '50%', transform: 'translateY(-50%)', width: cardW }
  } else if (mobile || tall) {
    cardStyle = { left: '50%', bottom: 12, transform: 'translateX(-50%)', width: cardW }
  } else {
    const below = hole.top + hole.height + 14
    const roomBelow = vh - below
    const left = Math.min(Math.max(12, hole.left + hole.width / 2 - cardW / 2), vw - cardW - 12)
    cardStyle = roomBelow > 250 ? { left, top: below, width: cardW } : { left, bottom: vh - hole.top + 14, width: cardW }
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" role="dialog" aria-label="How to order walkthrough">
      {s.center || !hole ? (
        <div className="absolute inset-0 bg-black/70" />
      ) : (
        <div
          className="absolute rounded-sm border-2 border-peri transition-[left,top,width,height] duration-700 ease-in-out motion-reduce:transition-none"
          style={{ ...hole, boxShadow: '0 0 0 100vmax rgba(5,5,10,0.78), 0 0 28px 4px rgba(92,108,242,0.7)' }}
        />
      )}

      <div className="pointer-events-auto absolute" style={cardStyle}>
      <div ref={card} className="border border-peri/80 bg-ink p-4 shadow-[0_0_50px_rgba(92,108,242,0.45)]">
        <div className="flex items-center justify-between gap-3">
          <p className="label">{s.center ? 'Guide' : `Step ${step} of ${total}`}</p>
          <button className="chip" onClick={() => finish()}>
            Skip tour
          </button>
        </div>
        <h2 className="h-display mt-2 text-3xl">{s.title}</h2>
        <p className="mt-2 text-sm text-bone/85">{s.body}</p>
        {ok ? (
          <p className="mt-2 font-mono text-xs text-peri-light" role="status">
            ✓ Done. One moment…
          </p>
        ) : (
          s.hint && <p className="mt-2 font-mono text-xs text-peri-light">{s.hint}</p>
        )}
        {!s.center && (
          <div className="mt-3 flex gap-1" aria-hidden="true">
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} className={`h-1 flex-1 ${i < step ? 'bg-peri' : 'bg-bone/20'}`} />
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between gap-2">
          {step > 1 && s.id !== 'end' ? (
            <button className="btn btn-ghost !px-4 !py-1.5 !text-base" onClick={() => setStep(step - 1)}>
              Back
            </button>
          ) : (
            <span />
          )}
          <button className="btn btn-peri !px-5 !py-1.5 !text-base" onClick={next} disabled={ok}>
            {s.nextLabel ?? 'Next'}
          </button>
        </div>
        {s.id === 'end' && (
          <p className="mt-3 font-mono text-[11px] text-bone/50">
            <a className="text-peri-light underline" href={LINKS.messenger} target="_blank" rel="noopener noreferrer">
              Message us on Messenger
            </a>
          </p>
        )}
      </div>
      </div>
    </div>
  )
}
