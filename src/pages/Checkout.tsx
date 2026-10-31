import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BUNDLE, peso } from '../data/products'
import { useBag } from '../lib/bag'
import { StepTrail } from '../components/StepTrail'
import { buildMessage, saveOrder, type Customer } from '../lib/order'

export default function Checkout() {
  const { items, totals, clear } = useBag()
  const nav = useNavigate()
  const [c, setC] = useState<Customer>({ name: '', phone: '', handle: '', address: '', notes: '' })
  const [consent, setConsent] = useState(false)
  const [trap, setTrap] = useState('') // honeypot: real people leave this empty

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="h-display text-5xl">Your bag is empty</h1>
        <Link to="/shop" className="btn btn-peri mt-6">
          Shop
        </Link>
      </section>
    )
  }

  const set = (k: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setC((prev) => ({ ...prev, [k]: e.target.value }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (trap || !consent) return
    const order = saveOrder({ customer: c, items, subtotal: totals.subtotal }, (no) => buildMessage(totals, no, c))
    clear()
    nav(`/order/${order.orderNo}`)
  }

  return (
    <section className="mx-auto max-w-5xl px-4 pt-12">
      <StepTrail current={2} />
      <p className="label mt-4">Almost there</p>
      <h1 className="h-display text-6xl md:text-7xl">Checkout</h1>
      <p className="mt-3 max-w-xl border-l-2 border-peri pl-3 font-mono text-sm text-bone/70">
        This is a prototype: no order is sent anywhere. In the real site your order is saved and the brand is notified, then you finish in Messenger.
      </p>

      <div className="mt-8 grid gap-10 md:grid-cols-[1.3fr_1fr]">
        <form data-tour="checkout-form" onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="label">Full name</span>
            <input className="field mt-1" required autoComplete="name" value={c.name} onChange={set('name')} />
          </label>
          <label className="block">
            <span className="label">Mobile number</span>
            <input className="field mt-1" required type="tel" autoComplete="tel" inputMode="tel" value={c.phone} onChange={set('phone')} />
          </label>
          <label className="block">
            <span className="label">Messenger or Instagram name</span>
            <input className="field mt-1" autoComplete="off" value={c.handle} onChange={set('handle')} />
          </label>
          <label className="block">
            <span className="label">Delivery address</span>
            <textarea className="field mt-1" rows={3} required autoComplete="street-address" value={c.address} onChange={set('address')} />
          </label>
          <label className="block">
            <span className="label">Notes (optional)</span>
            <textarea className="field mt-1" rows={2} value={c.notes} onChange={set('notes')} />
          </label>

          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label>
              Leave this empty
              <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </label>
          </div>

          <label className="flex items-start gap-2 text-sm text-bone/70">
            <input type="checkbox" className="mt-1 accent-peri" required checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>I agree that Pray For Us may use these details to process and deliver my order.</span>
          </label>
          <button data-tour="place" type="submit" className="btn btn-peri w-full">
            Place order request
          </button>
        </form>

        <aside className="h-fit border border-bone/20 p-5">
          <h2 className="label mb-4">Your order</h2>
          <ul className="space-y-3 text-sm">
            {totals.lines.map((l) => (
              <li key={l.item.key} className="flex justify-between gap-3">
                <span>
                  {l.item.qty}× {l.name}
                  <span className="block font-mono text-xs text-bone/50">{[l.item.color, l.item.size].filter(Boolean).join(' / ')}</span>
                </span>
                <span className="font-mono">{peso(l.total)}</span>
              </li>
            ))}
            {totals.pairs > 0 && (
              <li className="flex justify-between font-mono text-peri-light">
                <span>
                  {BUNDLE.name} ×{totals.pairs}
                </span>
                <span>−{peso(totals.discount)}</span>
              </li>
            )}
          </ul>
          <div className="mt-4 flex justify-between border-t border-bone/20 pt-4">
            <span className="label">Subtotal</span>
            <span className="font-mono text-xl font-bold">{peso(totals.subtotal)}</span>
          </div>
          <p className="mt-2 font-mono text-xs text-bone/60">+ shipping fee, quoted by the brand in Messenger.</p>
        </aside>
      </div>
    </section>
  )
}
