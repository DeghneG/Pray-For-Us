import { useState } from 'react'
import { img, loadOverrides, OVERRIDE_KEY, peso, products, STATUS_LABEL, type Override, type Status } from '../../data/products'

export default function ProductsPage() {
  const [ov, setOv] = useState<Record<string, Override>>(() => loadOverrides())
  const [saved, setSaved] = useState(false)

  function update(slug: string, patch: Override) {
    setOv((cur) => {
      const next = { ...cur, [slug]: { ...cur[slug], ...patch } }
      try {
        localStorage.setItem(OVERRIDE_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  function reset() {
    try {
      localStorage.removeItem(OVERRIDE_KEY)
    } catch {
      /* ignore */
    }
    window.location.reload()
  }

  return (
    <div>
      <p className="label">Catalog</p>
      <h1 className="h-display text-5xl md:text-6xl">Products</h1>
      <p className="mt-2 max-w-2xl font-mono text-xs text-bone/60">
        Change a price or mark something sold out. The site and the mobile preview pick it up on reload (demo: saved in this browser only).
      </p>
      <div className="mt-4 flex items-center gap-3">
        <button className="chip" onClick={reset}>
          Reset to original
        </button>
        <span role="status" className="font-mono text-xs text-peri-light">
          {saved ? 'Saved ✓' : ''}
        </span>
      </div>

      <ul className="mt-6 grid gap-3 lg:grid-cols-2">
        {products.map((p) => {
          const base = ov[p.slug]
          const price = base?.price ?? p.price
          const status = base?.status ?? p.status
          return (
            <li key={p.slug} className="flex gap-3 border border-bone/15 bg-coal p-3">
              {p.photos[0] ? <img src={img(p.photos[0], 'sm')} alt="" className="h-20 w-20 shrink-0 object-cover" /> : <span className="grid h-20 w-20 shrink-0 place-items-center bg-ink font-mono text-[10px] text-bone/40">no photo</span>}
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-xl uppercase leading-tight">{p.name}</p>
                <p className="font-mono text-xs text-bone/50">{peso(price)} + shipping fee</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <label className="sr-only" htmlFor={`price-${p.slug}`}>
                    Price for {p.name}
                  </label>
                  <input
                    id={`price-${p.slug}`}
                    className="field !w-24 !py-1.5"
                    inputMode="numeric"
                    value={price}
                    onChange={(e) => {
                      const n = Number(e.target.value.replace(/[^\d]/g, ''))
                      if (n > 0) update(p.slug, { price: n })
                    }}
                  />
                  <label className="sr-only" htmlFor={`status-${p.slug}`}>
                    Status for {p.name}
                  </label>
                  <select id={`status-${p.slug}`} className="field !w-auto !py-1.5" value={status} onChange={(e) => update(p.slug, { status: e.target.value as Status })}>
                    {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
