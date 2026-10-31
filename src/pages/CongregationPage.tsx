import { useMemo, useState } from 'react'
import { FitDialog, FitFrame } from '../components/Congregation'
import { ThornDivider } from '../components/bits'
import { Reveal } from '../components/Reveal'
import { fits, type Fit } from '../data/fits'
import { getProduct, LINKS } from '../data/products'

export default function CongregationPage() {
  const [filter, setFilter] = useState<string>('all')
  const [open, setOpen] = useState<Fit | null>(null)

  const itemOptions = useMemo(() => {
    const slugs = Array.from(new Set(fits.flatMap((f) => f.items)))
    return slugs.map((s) => ({ slug: s, name: getProduct(s)?.name ?? s }))
  }, [])

  const list = filter === 'all' ? fits : fits.filter((f) => f.items.includes(filter))

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <p className="label">Who's praying with us?</p>
        <h1 className="h-display text-6xl md:text-8xl">The Congregation</h1>
        <p className="mt-4 max-w-xl text-bone/70">
          Real people in Pray For Us. Tap a fit to see what they're wearing, then get it for yourself.
        </p>

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by piece">
          <button className={`chip ${filter === 'all' ? 'chip-on' : ''}`} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
            All fits
          </button>
          {itemOptions.map((o) => (
            <button key={o.slug} className={`chip ${filter === o.slug ? 'chip-on' : ''}`} aria-pressed={filter === o.slug} onClick={() => setFilter(o.slug)}>
              {o.name}
            </button>
          ))}
        </div>

        <Reveal group intro key={filter} className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {list.map((f, i) => (
            <div key={f.id} className={i % 2 === 1 ? 'md:mt-10' : ''}>
              <FitFrame fit={f} onOpen={setOpen} />
              <p className="mt-3 line-clamp-2 font-fang text-xl leading-snug">{f.caption}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <div className="mt-20">
        <ThornDivider />
      </div>

      <Reveal as="section" className="mx-auto mt-16 max-w-3xl px-4">
        <div className="border border-peri/60 bg-coal p-6 md:p-8">
          <h2 className="h-display text-4xl md:text-5xl">Send your fit</h2>
          <ol className="mt-4 space-y-2 font-mono text-sm text-bone/80">
            <li>1. Post a photo wearing Pray For Us.</li>
            <li>
              2. Tag <span className="text-peri-light">{LINKS.igHandle}</span> and use <span className="text-peri-light">#PrayForUs</span>, or DM it to us.
            </li>
            <li>3. Tell us the piece, your size and height. It helps the next person pick a size.</li>
            <li>4. Say yes to being featured. We only post fits with your OK, and we take them down any time you ask.</li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="btn btn-peri" href={LINKS.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a className="btn btn-ghost" href={LINKS.messenger} target="_blank" rel="noopener noreferrer">
              Messenger
            </a>
          </div>
        </div>
      </Reveal>

      {open && <FitDialog fit={open} onClose={() => setOpen(null)} />}
    </>
  )
}
