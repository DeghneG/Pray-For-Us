import { Link } from 'react-router-dom'
import { SizeChart } from '../components/SizeChart'
import { LINKS } from '../data/products'

const steps = [
  ['Pick your piece', 'Choose the item and your size. Check the size chart on each product page.'],
  ['Add to bag, check out', 'Fill in your name, contact and delivery details. Your order opens in Messenger, ready to send.'],
  ['We confirm', 'We reply with availability and the shipping fee. The fee depends on where you are.'],
  ['Pay and ship', 'Pay the way we agree in Messenger. Your order ships once payment is confirmed.'],
]

export default function HowToOrder() {
  return (
    <section className="mx-auto max-w-4xl px-4 pt-12">
      <p className="label">No middlemen</p>
      <h1 className="h-display text-6xl md:text-8xl">How to order</h1>

      <ol className="mt-10 space-y-4">
        {steps.map(([t, d], i) => (
          <li key={t} className="flex gap-5 border border-bone/15 p-5">
            <span className="wire-text font-display text-6xl leading-none">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h2 className="font-display text-2xl uppercase">{t}</h2>
              <p className="mt-1 text-bone/70">{d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="border border-bone/15 p-5">
          <h2 className="label mb-2">Prices</h2>
          <p className="text-bone/80">Every price is in pesos and <strong>+ shipping fee</strong>. That includes the hoodie, keychain and stickers.</p>
        </div>
        <div className="border border-bone/15 p-5">
          <h2 className="label mb-2">Pre-orders and drops</h2>
          <p className="text-bone/80">Some pieces are made to order with a deadline. The 444 tee is sold once a year with no restocks.</p>
        </div>
        <div className="border border-dashed border-bone/30 p-5">
          <h2 className="label mb-2">Payment</h2>
          <p className="text-bone/60">Accepted payment methods and processing time to be confirmed with the brand.</p>
        </div>
        <div className="border border-bone/15 p-5">
          <h2 className="label mb-2">Questions?</h2>
          <a className="text-peri-light underline" href={LINKS.messenger} target="_blank" rel="noopener noreferrer">
            Message us on Messenger
          </a>
        </div>
      </div>

      <h2 className="h-display mb-4 mt-14 text-4xl">Size charts</h2>
      <div className="space-y-3">
        <SizeChart kind="tee" />
        <SizeChart kind="hoodie" />
      </div>

      <Link to="/shop" className="btn btn-peri mt-10">
        Start shopping
      </Link>
    </section>
  )
}
