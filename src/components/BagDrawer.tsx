import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBag } from '../lib/bag'
import { BUNDLE, getProduct, img, peso } from '../data/products'
import { PhotoPlaceholder } from './bits'
import { StepTrail } from './StepTrail'

export function BagDrawer() {
  const { open, setOpen, items, totals, setQty, remove } = useBag()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div data-lenis-prevent className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Order bag">
      <button className="absolute inset-0 bg-black/70" aria-label="Close bag" onClick={() => setOpen(false)} />
      <aside data-tour="bag" className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-peri/50 bg-ink">
        <header className="flex items-center justify-between border-b border-bone/15 p-4">
          <h2 className="h-display text-3xl">Order bag</h2>
          <button className="chip" onClick={() => setOpen(false)}>
            Close
          </button>
        </header>

        <div className="border-b border-bone/10 px-4 py-2">
          <StepTrail current={1} />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-fang text-3xl">Nothing here yet.</p>
              <p className="mt-2 text-bone/60">Add something from the shop.</p>
              <Link to="/shop" onClick={() => setOpen(false)} className="btn btn-peri mt-6">
                Shop
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((it) => {
                const p = getProduct(it.slug)!
                const photo = it.color
                  ? (p.colors?.find((c) => c.name === it.color)?.photos[0] ?? p.photos[0])
                  : p.photos[0]
                return (
                  <li key={it.key} className="flex gap-3 border border-bone/15 p-2">
                    <div className="h-20 w-20 shrink-0 overflow-hidden bg-coal">
                      {photo ? <img src={img(photo, 'sm')} alt="" className="h-full w-full object-cover" /> : <PhotoPlaceholder label="" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-lg uppercase leading-tight">{p.name}</div>
                      <div className="font-mono text-xs text-bone/60">
                        {[it.color, it.size].filter(Boolean).join(' / ')}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border border-bone/30 font-mono">
                          <button className="px-2.5 py-1" aria-label="Decrease" onClick={() => setQty(it.key, it.qty - 1)}>
                            −
                          </button>
                          <span className="w-7 text-center" aria-live="polite">
                            {it.qty}
                          </span>
                          <button className="px-2.5 py-1" aria-label="Increase" onClick={() => setQty(it.key, it.qty + 1)}>
                            +
                          </button>
                        </div>
                        <span className="font-mono font-bold">{peso(p.price * it.qty)}</span>
                      </div>
                    </div>
                    <button className="self-start px-1 text-bone/50 hover:text-peri" aria-label={`Remove ${p.name}`} onClick={() => remove(it.key)}>
                      ✕
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="space-y-3 border-t border-bone/15 p-4">
            {totals.pairs > 0 && (
              <div className="flex justify-between font-mono text-sm text-peri-light">
                <span>
                  {BUNDLE.name} set ×{totals.pairs}
                </span>
                <span>−{peso(totals.discount)}</span>
              </div>
            )}
            <div className="flex items-baseline justify-between">
              <span className="label">Subtotal</span>
              <span className="font-mono text-2xl font-bold">{peso(totals.subtotal)}</span>
            </div>
            <p className="font-mono text-xs text-bone/60">+ shipping fee. We confirm your order and quote shipping in Messenger.</p>
            <Link data-tour="checkout-btn" to="/checkout" onClick={() => setOpen(false)} className="btn btn-peri w-full">
              Checkout
            </Link>
          </footer>
        )}
      </aside>
    </div>
  )
}
