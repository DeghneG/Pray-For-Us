import { useEffect, useRef, useState } from 'react'

const DEVICES = [
  { id: 'iphone', label: 'iPhone', w: 393, h: 852, r: 52 },
  { id: 'android', label: 'Small Android', w: 360, h: 740, r: 34 },
  { id: 'tablet', label: 'Tablet', w: 744, h: 1133, r: 36 },
] as const

const PAGES = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'A product', path: '/product/windmill-tee' },
  { label: 'Hoodie', path: '/product/tuff-as-nailz-hoodie' },
  { label: 'Congregation', path: '/congregation' },
  { label: 'How to order', path: '/how-to-order' },
  { label: 'About', path: '/about' },
]

export default function PreviewPage() {
  const [device, setDevice] = useState<(typeof DEVICES)[number]>(DEVICES[0])
  const [path, setPath] = useState('/')
  const [nonce, setNonce] = useState(0)
  const [avail, setAvail] = useState(640)
  const box = useRef<HTMLDivElement>(null)

  // Fit the phone to the space on screen.
  useEffect(() => {
    const calc = () => setAvail(Math.max(360, Math.min(window.innerHeight - 220, 760)))
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const bezel = 14
  const outerH = device.h + bezel * 2
  const outerW = device.w + bezel * 2
  const scale = Math.min(1, avail / outerH, (box.current?.clientWidth ?? 9999) / outerW)
  const src = `${path}${path.includes('?') ? '&' : '?'}embed=1`

  return (
    <div>
      <p className="label">Show the owner</p>
      <h1 className="h-display text-5xl md:text-6xl">Mobile preview</h1>
      <p className="mt-2 max-w-2xl font-mono text-xs text-bone/60">The live site inside a phone frame. Tap around in it like a customer. Edits in Products show up after reload.</p>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Device">
        {DEVICES.map((d) => (
          <button key={d.id} className={`chip ${device.id === d.id ? 'chip-on' : ''}`} aria-pressed={device.id === d.id} onClick={() => setDevice(d)}>
            {d.label} · {d.w}×{d.h}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Page">
        {PAGES.map((p) => (
          <button
            key={p.path}
            className={`chip ${path === p.path ? 'chip-on' : ''}`}
            aria-pressed={path === p.path}
            onClick={() => {
              setPath(p.path)
              setNonce((n) => n + 1)
            }}
          >
            {p.label}
          </button>
        ))}
        <button className="chip" onClick={() => setNonce((n) => n + 1)}>
          ↻ Reload
        </button>
        <a className="chip" href={path} target="_blank" rel="noopener noreferrer">
          Open full size ↗
        </a>
      </div>

      <div ref={box} className="mt-6 flex justify-center">
        <div style={{ width: outerW * scale, height: outerH * scale }}>
          <div
            style={{
              width: outerW,
              height: outerH,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              borderRadius: device.r + bezel,
              padding: bezel,
              background: '#050508',
              boxShadow: '0 0 0 2px #2b2b3a, 0 0 60px rgba(92,108,242,0.35)',
            }}
          >
            <div className="relative h-full w-full overflow-hidden bg-ink" style={{ borderRadius: device.r }}>
              {device.id === 'iphone' && <span className="absolute left-1/2 top-2 z-10 h-6 w-28 -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />}
              <iframe key={`${nonce}-${device.id}`} src={src} title={`Mobile preview: ${path}`} className="h-full w-full border-0" style={{ width: device.w, height: device.h }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
