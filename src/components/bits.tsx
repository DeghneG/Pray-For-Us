import { Link } from 'react-router-dom'
import { img, type Product, STATUS_LABEL, peso } from '../data/products'

/** Barbed-wire divider, tiled so it works at any width. */
export function ThornDivider({ className = '' }: { className?: string }) {
  return (
    <svg className={`block h-8 w-full text-peri ${className}`} aria-hidden="true" role="presentation">
      <defs>
        <pattern id="wire" width="64" height="32" patternUnits="userSpaceOnUse">
          <path d="M0 16 Q16 8 32 16 T64 16" fill="none" stroke="#F4F4F8" strokeWidth="2.2" />
          <path d="M0 18 Q16 24 32 18 T64 18" fill="none" stroke="#F4F4F8" strokeWidth="1.2" opacity="0.6" />
          <path d="M24 5 L40 27 M40 5 L24 27" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wire)" />
    </svg>
  )
}

export function Ticker({ items }: { items: string[] }) {
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-bone/15 bg-peri py-2 text-white" aria-hidden="true">
      <div className="flex w-max animate-marquee whitespace-nowrap font-display text-lg uppercase tracking-widest">
        {row.map((t, i) => (
          <span key={i} className="px-6">
            {t}
            <span className="pl-12 text-white/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function PhotoPlaceholder({ label = 'Photo coming soon' }: { label?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-coal p-6 text-center">
      <img src="/logo.png" alt="" className="w-1/2 opacity-60" />
      <span className="label">{label}</span>
    </div>
  )
}

export function StatusBadge({ product }: { product: Product }) {
  const tone =
    product.status === 'available'
      ? 'border-bone/40 text-bone/80'
      : product.status === 'back-in-stock'
        ? 'border-peri bg-peri text-white'
        : 'border-bone/30 bg-ink/80 text-bone/70'
  return <span className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${tone}`}>{STATUS_LABEL[product.status]}</span>
}

export function ProductCard({ product }: { product: Product }) {
  const [first, second] = product.photos
  const dim = product.status === 'limited-sold-out' || product.status === 'preorder-closed'
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-peri"
    >
      <div className="relative aspect-square overflow-hidden border border-bone/10 bg-coal">
        {first ? (
          <>
            <img
              src={img(first, 'sm')}
              alt={`${product.name}, front`}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${second ? 'group-hover:opacity-0' : 'group-hover:scale-105'} ${dim ? 'opacity-60' : ''}`}
            />
            {second && (
              <img
                src={img(second, 'sm')}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <PhotoPlaceholder />
        )}
        <div className="absolute left-2 top-2">
          <StatusBadge product={product} />
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <h3 className="font-display text-xl uppercase leading-tight tracking-wide group-hover:text-peri-light">{product.name}</h3>
        <div className="shrink-0 text-right">
          <div className="font-mono text-base font-bold">{peso(product.price)}</div>
          <div className="font-mono text-[10px] uppercase text-bone/50">+ shipping fee</div>
        </div>
      </div>
    </Link>
  )
}
