import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { fits, type Fit } from '../data/fits'
import { getProduct, img, LINKS, peso } from '../data/products'

export function FitFrame({
  fit,
  onOpen,
  className = '',
  ghost = false,
}: {
  fit: Fit
  onOpen: (f: Fit) => void
  className?: string
  /** Duplicate copy used to loop the carousel: hidden from assistive tech and the tab order. */
  ghost?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(fit)}
      aria-label={`Open fit: ${fit.caption}`}
      aria-hidden={ghost || undefined}
      tabIndex={ghost ? -1 : undefined}
      className={`arch block w-full text-left ${className}`}
      style={{ aspectRatio: '3 / 4' }}
    >
      <img
        src={img(fit.photo, 'sm')}
        alt={ghost ? '' : fit.caption}
        loading="lazy"
        className="h-full w-full object-cover"
        style={{
          objectPosition: fit.focus ?? '50% 50%',
          transform: fit.hideBar ? 'scale(1.22)' : undefined,
          transformOrigin: '50% 0%',
        }}
      />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink to-transparent px-3 pb-3 pt-10 font-mono text-[11px] uppercase tracking-wider">
        {fit.handle ?? '#PrayForUs'}
      </span>
    </button>
  )
}

export function FitDialog({ fit, onClose }: { fit: Fit; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const worn = fit.items.map((s) => getProduct(s)).filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <div data-lenis-prevent className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label="Fit details">
      <button className="absolute inset-0 bg-black/80" aria-label="Close" onClick={onClose} tabIndex={-1} />
      <div className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto border border-peri/60 bg-ink md:grid-cols-[1.2fr_1fr]">
        <div className="bg-coal">
          <img src={img(fit.photo, 'lg')} alt={fit.caption} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col gap-5 p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label">{fit.handle ?? '#PrayForUs'}</p>
              {fit.context && <p className="font-mono text-xs text-bone/60">{fit.context}</p>}
            </div>
            <button ref={closeRef} className="chip" onClick={onClose}>
              Close
            </button>
          </div>

          <p className="font-fang text-3xl leading-tight md:text-4xl">“{fit.caption}”</p>

          {(fit.height || fit.sizeWorn) && (
            <dl className="grid grid-cols-2 gap-3 font-mono text-sm">
              {fit.height && (
                <div className="border border-bone/20 p-3">
                  <dt className="label">Height</dt>
                  <dd>{fit.height}</dd>
                </div>
              )}
              {fit.sizeWorn && (
                <div className="border border-bone/20 p-3">
                  <dt className="label">Size worn</dt>
                  <dd>{fit.sizeWorn}</dd>
                </div>
              )}
            </dl>
          )}

          <div>
            <h3 className="label mb-2">Wearing</h3>
            {worn.length > 0 ? (
              <ul className="space-y-2">
                {worn.map((p) => (
                  <li key={p.slug}>
                    <Link
                      to={`/product/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between gap-3 border border-bone/25 p-2 pr-3 transition hover:border-peri"
                    >
                      <span className="flex items-center gap-3">
                        {p.photos[0] && <img src={img(p.photos[0], 'sm')} alt="" className="h-12 w-12 object-cover" />}
                        <span className="font-display text-lg uppercase leading-tight">{p.name}</span>
                      </span>
                      <span className="font-mono text-sm">{peso(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-mono text-sm text-bone/60">Items to be tagged.</p>
            )}
          </div>

          {fit.credit && <p className="mt-auto font-mono text-[11px] uppercase tracking-wider text-bone/40">Photo: {fit.credit}</p>}
          <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-base">
            Send your fit
          </a>
        </div>
      </div>
    </div>
  )
}

/** Fits that include a given product, used for the "Worn by" strip on product pages. */
export function fitsFor(slug: string) {
  return fits.filter((f) => f.items.includes(slug))
}
