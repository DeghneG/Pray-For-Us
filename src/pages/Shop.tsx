import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/bits'
import { Reveal } from '../components/Reveal'
import { categories, products, type Category } from '../data/products'

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const current = (params.get('c') ?? 'all') as Category | 'all'
  const list = current === 'all' ? products : products.filter((p) => p.category === current)

  return (
    <section className="mx-auto max-w-6xl px-4 pt-12">
      <p className="label">Everything we've got</p>
      <h1 className="h-display text-6xl md:text-8xl">Shop</h1>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {categories.map((c) => (
          <button
            key={c.key}
            className={`chip ${current === c.key ? 'chip-on' : ''}`}
            aria-pressed={current === c.key}
            onClick={() => setParams(c.key === 'all' ? {} : { c: c.key })}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="mt-6 font-mono text-xs text-bone/50">
        All prices are in pesos + shipping fee. Availability changes fast, so we confirm in Messenger.
      </p>

      <Reveal group key={current} intro className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </Reveal>
    </section>
  )
}
