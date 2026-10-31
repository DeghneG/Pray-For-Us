import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PhotoPlaceholder, ProductCard, StatusBadge } from '../components/bits'
import { Reveal } from '../components/Reveal'
import { SizeChart } from '../components/SizeChart'
import { FitDialog, FitFrame, fitsFor } from '../components/Congregation'
import { BUNDLE, getProduct, img, isOrderable, LINKS, peso, products, TEE_SIZES } from '../data/products'
import { useBag } from '../lib/bag'
import type { Fit } from '../data/fits'
import NotFound from './NotFound'

export default function ProductPage() {
  const { slug = '' } = useParams()
  const product = getProduct(slug)
  const { add } = useBag()
  const [colorName, setColorName] = useState<string | undefined>(undefined)
  const [photoIdx, setPhotoIdx] = useState(0)
  const [size, setSize] = useState<string | null>(null)
  const [warn, setWarn] = useState(false)
  const [fit, setFit] = useState<Fit | null>(null)

  const color = product?.colors?.find((c) => c.name === (colorName ?? product.colors?.[0]?.name))
  const photos = color?.photos ?? product?.photos ?? []
  const worn = useMemo(() => (product ? fitsFor(product.slug) : []), [product])
  const related = useMemo(
    () => (product ? products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4) : []),
    [product],
  )

  if (!product) return <NotFound />

  const orderable = isOrderable(product)
  const sizes = product.sizeSet === 'one' ? ['One size'] : TEE_SIZES
  const needsSize = product.sizeSet !== 'one'
  const bundlePartner = product.bundleWith ? getProduct(product.bundleWith) : undefined

  function addToBag() {
    if (!product) return
    if (needsSize && !size) {
      setWarn(true)
      return
    }
    add({ slug: product.slug, size: needsSize ? size! : 'One size', color: color?.name })
  }

  function switchColor(name: string) {
    setColorName(name)
    setPhotoIdx(0)
  }

  const currentPhoto = photos[Math.min(photoIdx, photos.length - 1)]

  return (
    <article className="mx-auto max-w-6xl px-4 pt-8">
      <nav className="mb-6 font-mono text-xs uppercase tracking-widest text-bone/60" aria-label="Breadcrumb">
        <Link to="/shop" className="hover:text-peri-light">
          Shop
        </Link>{' '}
        / {product.name}
      </nav>

      <Reveal group intro className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden border border-bone/15 bg-coal">
            {currentPhoto ? (
              <img src={img(currentPhoto, 'lg')} alt={`${product.name}${color ? `, ${color.name}` : ''}`} className="h-full w-full object-cover" />
            ) : (
              <PhotoPlaceholder />
            )}
          </div>
          {photos.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {photos.map((p, i) => (
                <button
                  key={p}
                  onClick={() => setPhotoIdx(i)}
                  aria-label={`Photo ${i + 1}`}
                  aria-current={i === photoIdx}
                  className={`aspect-square overflow-hidden border-2 ${i === photoIdx ? 'border-peri' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img(p, 'sm')} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <StatusBadge product={product} />
            <h1 className="h-display mt-3 text-5xl md:text-6xl">{product.name}</h1>
            <p className="mt-3 font-mono text-3xl font-bold">
              {peso(product.price)} <span className="text-sm font-normal text-bone/50">+ shipping fee</span>
            </p>
          </div>

          <ul className="space-y-1 font-mono text-sm text-bone/80">
            {product.bullets.map((b) => (
              <li key={b}>+ {b}</li>
            ))}
          </ul>

          {product.note && <p className="border-l-2 border-peri pl-3 text-bone/80">{product.note}</p>}

          {product.colors && (
            <fieldset>
              <legend className="label mb-2">Color: {color?.name}</legend>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button key={c.name} className={`chip ${c.name === color?.name ? 'chip-on' : ''}`} onClick={() => switchColor(c.name)} aria-pressed={c.name === color?.name}>
                    {c.name}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {orderable && (
            <>
              {needsSize && (
                <fieldset>
                  <legend className="label mb-2">Size</legend>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        className={`chip min-w-[3.25rem] ${size === s ? 'chip-on' : ''}`}
                        aria-pressed={size === s}
                        onClick={() => {
                          setSize(s)
                          setWarn(false)
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {warn && (
                    <p role="alert" className="mt-2 font-mono text-xs text-peri-light">
                      Pick a size first.
                    </p>
                  )}
                </fieldset>
              )}
              {(product.sizeSet === 'tee' || product.sizeSet === 'hoodie') && (
                <SizeChart kind={product.sizeSet} highlight={size ?? undefined} />
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="btn btn-peri flex-1" onClick={addToBag}>
                  Add to bag
                </button>
                <a className="btn btn-ghost flex-1" href={LINKS.messenger} target="_blank" rel="noopener noreferrer">
                  Ask on Messenger
                </a>
              </div>
              {bundlePartner && (
                <p className="font-mono text-xs text-peri-light">
                  {BUNDLE.name}: get {product.name.split(' ')[0]} and {bundlePartner.name.split(' ')[0]} together for {peso(BUNDLE.pairPrice)} (save {peso(BUNDLE.singlePrice * 2 - BUNDLE.pairPrice)}). Add both to your bag.
                </p>
              )}
              <p className="font-mono text-xs text-bone/50">Stock moves fast. We confirm availability and the shipping fee in Messenger.</p>
            </>
          )}

          {!orderable && (
            <div className="space-y-3 border border-bone/20 p-4">
              <p className="font-mono text-sm">Not available to order right now.</p>
              <a className="btn btn-peri w-full" href={LINKS.messenger} target="_blank" rel="noopener noreferrer">
                Ask on Messenger
              </a>
              <Link to="/#drops" className="btn btn-ghost w-full">
                Notify me for the next drop
              </Link>
            </div>
          )}
        </div>
      </Reveal>

      {worn.length > 0 && (
        <Reveal as="section" className="mt-16">
          <h2 className="h-display mb-5 text-4xl">Worn by the Congregation</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {worn.map((f) => (
              <div key={f.id} className="w-48 shrink-0">
                <FitFrame fit={f} onOpen={setFit} />
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="h-display mb-5 text-4xl">More like this</h2>
          <Reveal group className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </Reveal>
        </section>
      )}

      {fit && <FitDialog fit={fit} onClose={() => setFit(null)} />}
    </article>
  )
}
