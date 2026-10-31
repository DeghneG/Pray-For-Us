// Demo admin. No real login or database: this only shows the owner what managing the shop will feel like.
// Production: Supabase Auth + row-level security (see ARCHITECTURE.md).
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { fits } from '../data/fits'
import { img, peso, products, STATUS_LABEL, type Status } from '../data/products'
import { loadOrders, type SavedOrder } from '../lib/order'

type Tab = 'orders' | 'products' | 'fits' | 'drops'

const SAMPLE: SavedOrder[] = [
  {
    orderNo: 'DEMO-003',
    createdAt: '2026-10-29T14:20:00.000Z',
    status: 'shipped',
    customer: { name: 'Sample Customer', phone: '09XX XXX 0003', handle: 'sample.c', address: 'Quezon City', notes: '' },
    items: [],
    subtotal: 2590,
    message: 'Sample order: WINDMILL tee L, TUFF AS NAILZ hoodie M',
  },
  {
    orderNo: 'DEMO-002',
    createdAt: '2026-10-28T09:05:00.000Z',
    status: 'paid',
    customer: { name: 'Sample Customer', phone: '09XX XXX 0002', handle: 'sample.b', address: 'Cebu City', notes: '' },
    items: [],
    subtotal: 1495,
    message: 'Sample order: DAY N NITE set',
  },
  {
    orderNo: 'DEMO-001',
    createdAt: '2026-10-27T18:40:00.000Z',
    status: 'new',
    customer: { name: 'Sample Customer', phone: '09XX XXX 0001', handle: 'sample.a', address: 'Davao City', notes: 'Call before delivery' },
    items: [],
    subtotal: 999,
    message: 'Sample order: ISAIAH hat',
  },
]

const STATUSES: SavedOrder['status'][] = ['new', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled']

function Login({ onIn }: { onIn: () => void }) {
  return (
    <form
      className="mx-auto mt-24 max-w-sm space-y-4 border border-bone/20 p-6"
      onSubmit={(e) => {
        e.preventDefault()
        onIn()
      }}
    >
      <h1 className="h-display text-4xl">Admin</h1>
      <p className="font-mono text-xs text-bone/60">Demo only. Any email and password works. The real site uses a protected login.</p>
      <label className="block">
        <span className="label">Email</span>
        <input className="field mt-1" type="email" required defaultValue="owner@example.com" />
      </label>
      <label className="block">
        <span className="label">Password</span>
        <input className="field mt-1" type="password" required defaultValue="demo" />
      </label>
      <button className="btn btn-peri w-full" type="submit">
        Log in
      </button>
      <Link to="/" className="block text-center font-mono text-xs text-bone/50 hover:text-peri-light">
        ← Back to the site
      </Link>
    </form>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<Tab>('orders')
  const [orders, setOrders] = useState<SavedOrder[]>(() => [...loadOrders(), ...SAMPLE])
  const [shipFees, setShipFees] = useState<Record<string, string>>({})
  const [statuses, setStatuses] = useState<Record<string, Status>>(() => Object.fromEntries(products.map((p) => [p.slug, p.status])))
  const [approved, setApproved] = useState<Record<string, boolean>>(() => Object.fromEntries(fits.map((f) => [f.id, true])))

  if (!authed) return <Login onIn={() => setAuthed(true)} />

  const drops = (() => {
    try {
      return JSON.parse(localStorage.getItem('pfu-droplist') ?? '[]') as string[]
    } catch {
      return []
    }
  })()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-bone/15 pb-4">
        <h1 className="h-display text-4xl">Pray For Us · Admin</h1>
        <div className="flex items-center gap-2">
          <Link to="/" className="chip">
            View site
          </Link>
          <button className="chip" onClick={() => setAuthed(false)}>
            Log out
          </button>
        </div>
      </header>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist">
        {(['orders', 'products', 'fits', 'drops'] as Tab[]).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={`chip ${tab === t ? 'chip-on' : ''}`} onClick={() => setTab(t)}>
            {t === 'drops' ? 'drop list' : t}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left font-mono text-sm">
            <thead className="text-peri-light">
              <tr>
                <th className="p-2">Order</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Subtotal</th>
                <th className="p-2">Shipping fee</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.orderNo} className="border-t border-bone/10 align-top">
                  <td className="p-2">
                    <div className="font-bold">{o.orderNo}</div>
                    <div className="text-xs text-bone/50">{new Date(o.createdAt).toLocaleDateString('en-PH')}</div>
                  </td>
                  <td className="p-2">
                    <div>{o.customer.name}</div>
                    <div className="text-xs text-bone/50">
                      {o.customer.phone} · {o.customer.address}
                    </div>
                  </td>
                  <td className="p-2">{peso(o.subtotal)}</td>
                  <td className="p-2">
                    <input
                      className="field !w-24 !py-1"
                      inputMode="numeric"
                      aria-label={`Shipping fee for ${o.orderNo}`}
                      placeholder="₱"
                      value={shipFees[o.orderNo] ?? ''}
                      onChange={(e) => setShipFees((s) => ({ ...s, [o.orderNo]: e.target.value }))}
                    />
                  </td>
                  <td className="p-2">
                    <select
                      className="field !w-auto !py-1"
                      aria-label={`Status for ${o.orderNo}`}
                      value={o.status}
                      onChange={(e) =>
                        setOrders((list) => list.map((x) => (x.orderNo === o.orderNo ? { ...x, status: e.target.value as SavedOrder['status'] } : x)))
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 font-mono text-xs text-bone/50">Rows labeled "Sample Customer" are demo data. Orders placed on this prototype appear at the top.</p>
        </div>
      )}

      {tab === 'products' && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left font-mono text-sm">
            <thead className="text-peri-light">
              <tr>
                <th className="p-2">Product</th>
                <th className="p-2">Price</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.slug} className="border-t border-bone/10">
                  <td className="flex items-center gap-3 p-2">
                    {p.photos[0] ? <img src={img(p.photos[0], 'sm')} alt="" className="h-10 w-10 object-cover" /> : <span className="h-10 w-10 bg-coal" />}
                    {p.name}
                  </td>
                  <td className="p-2">{peso(p.price)}</td>
                  <td className="p-2">
                    <select
                      className="field !w-auto !py-1"
                      aria-label={`Status for ${p.name}`}
                      value={statuses[p.slug]}
                      onChange={(e) => setStatuses((s) => ({ ...s, [p.slug]: e.target.value as Status }))}
                    >
                      {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 font-mono text-xs text-bone/50">Demo: changes here do not update the public site. In production they do, instantly.</p>
        </div>
      )}

      {tab === 'fits' && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fits.map((f) => (
            <li key={f.id} className="border border-bone/15 p-3">
              <img src={img(f.photo, 'sm')} alt={f.caption} className="aspect-[4/3] w-full object-cover" />
              <p className="mt-2 font-fang text-xl">{f.caption}</p>
              <p className="font-mono text-xs text-bone/50">{f.handle ?? 'no handle'} · {f.credit ?? 'no credit'}</p>
              <button className={`chip mt-3 ${approved[f.id] ? 'chip-on' : ''}`} onClick={() => setApproved((a) => ({ ...a, [f.id]: !a[f.id] }))}>
                {approved[f.id] ? 'Approved' : 'Hidden'}
              </button>
            </li>
          ))}
        </ul>
      )}

      {tab === 'drops' && (
        <div className="mt-6">
          {drops.length === 0 ? (
            <p className="font-mono text-sm text-bone/60">No sign-ups yet. Try the "Notify me" form on the home page.</p>
          ) : (
            <ul className="space-y-1 font-mono text-sm">
              {drops.map((d, i) => (
                <li key={i} className="border-b border-bone/10 py-2">
                  {d}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
