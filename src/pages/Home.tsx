import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard, ThornDivider, Ticker } from '../components/bits'
import { FitDialog, FitFrame } from '../components/Congregation'
import { Marquee } from '../components/Marquee'
import { fits, type Fit } from '../data/fits'
import { LINKS, products } from '../data/products'
import { DropList } from '../components/DropList'

export default function Home() {
  const [open, setOpen] = useState<Fit | null>(null)
  const featured = products.filter((p) => p.featured)
  const latest = products.filter((p) => !p.featured && (p.status === 'available' || p.status === 'back-in-stock')).slice(0, 6)

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-peri/40 blur-[110px] animate-halo" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-14 pt-12 text-center md:pt-20">
          <p className="label mb-6">Filipino hip-hop streetwear</p>
          <img src="/logo.png" alt="Pray For Us" className="w-full max-w-xl drop-shadow-[0_0_40px_rgba(92,108,242,0.55)]" />
          <h1 className="font-fang mt-8 text-4xl leading-tight md:text-6xl">Do you believe in divine intervention?</h1>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn btn-peri">
              Shop the drop
            </Link>
            <Link to="/congregation" className="btn btn-ghost">
              See the Congregation
            </Link>
          </div>
        </div>
      </section>

      <Ticker items={['Pray for us', 'Do you believe in divine intervention?', 'Order via Messenger', 'Wear it. Tag it. #PrayForUs', 'Thorns']} />

      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="h-display text-5xl md:text-6xl">The drop</h2>
          <Link to="/shop" className="chip">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
          {[...featured, ...latest].map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <div className="mt-20">
        <ThornDivider />
      </div>

      <section className="py-16">
        <div className="mx-auto mb-8 flex max-w-6xl items-end justify-between gap-4 px-4">
          <div>
            <p className="label">Who's praying with us?</p>
            <h2 className="h-display text-5xl md:text-6xl">The Congregation</h2>
          </div>
          <Link to="/congregation" className="chip">
            Enter
          </Link>
        </div>
        <Marquee speed={45} className="py-3" trackClassName="gap-6 pr-6">
          {(ghost) => (
            <>
              {fits.map((f) => (
                <div key={`${f.id}-${ghost}`} className="w-52 shrink-0 md:w-60">
                  <FitFrame fit={f} onOpen={setOpen} ghost={ghost} />
                </div>
              ))}
            </>
          )}
        </Marquee>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <h2 className="h-display mb-8 text-5xl md:text-6xl">Order in three steps</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            ['01', 'Pick it', 'Choose your piece and size. Add it to your bag.'],
            ['02', 'Send it', 'Check out. Your order opens in Messenger, ready to send.'],
            ['03', 'We confirm', 'We reply with the shipping fee and how to pay. Then it ships to you.'],
          ].map(([n, t, d]) => (
            <li key={n} className="border border-bone/15 p-5">
              <span className="wire-text font-display text-6xl">{n}</span>
              <h3 className="mt-2 font-display text-2xl uppercase">{t}</h3>
              <p className="mt-1 text-bone/70">{d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 font-mono text-xs text-bone/50">
          Prefer to chat first? Message us on{' '}
          <a className="text-peri-light underline" href={LINKS.messenger} target="_blank" rel="noopener noreferrer">
            Messenger
          </a>
          .
        </p>
      </section>

      <section id="drops" className="mx-auto mt-20 max-w-3xl scroll-mt-24 px-4">
        <DropList />
      </section>

      {open && <FitDialog fit={open} onClose={() => setOpen(null)} />}
    </>
  )
}
