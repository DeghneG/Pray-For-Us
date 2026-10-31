import { useState } from 'react'
import { fits } from '../../data/fits'
import { img } from '../../data/products'

export function FitsPage() {
  const [approved, setApproved] = useState<Record<string, boolean>>(() => Object.fromEntries(fits.map((f) => [f.id, true])))
  return (
    <div>
      <p className="label">The Congregation</p>
      <h1 className="h-display text-5xl md:text-6xl">Fit photos</h1>
      <p className="mt-2 max-w-2xl font-mono text-xs text-bone/60">
        Approve or hide the fits shown on the site. Only post a customer's photo with their OK, and take it down when they ask.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {fits.map((f) => (
          <li key={f.id} className="border border-bone/15 bg-coal p-3">
            <img src={img(f.photo, 'sm')} alt={f.caption} className="aspect-[4/3] w-full object-cover" />
            <p className="mt-2 font-fang text-xl leading-snug">{f.caption}</p>
            <p className="font-mono text-xs text-bone/50">
              {f.handle ?? 'no handle'} · {f.credit ?? 'no credit'}
            </p>
            <button className={`chip mt-3 ${approved[f.id] ? 'chip-on' : ''}`} aria-pressed={approved[f.id]} onClick={() => setApproved((a) => ({ ...a, [f.id]: !a[f.id] }))}>
              {approved[f.id] ? 'Shown on site' : 'Hidden'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DropsPage() {
  const list = (() => {
    try {
      return JSON.parse(localStorage.getItem('pfu-droplist') ?? '[]') as string[]
    } catch {
      return []
    }
  })()
  return (
    <div>
      <p className="label">Next drop</p>
      <h1 className="h-display text-5xl md:text-6xl">Drop list</h1>
      <p className="mt-2 max-w-2xl font-mono text-xs text-bone/60">People who asked to be told first, like for the once-a-year 444 tee.</p>
      {list.length === 0 ? (
        <p className="mt-6 border border-dashed border-bone/30 p-6 font-mono text-sm text-bone/60">No sign-ups yet. Try the "Notify me" form on the home page.</p>
      ) : (
        <ul className="mt-6 divide-y divide-bone/10 border border-bone/15 font-mono text-sm">
          {list.map((d, i) => (
            <li key={i} className="px-4 py-3">
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
