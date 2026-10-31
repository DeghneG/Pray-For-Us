import { useState } from 'react'
import { peso } from '../../data/products'
import { copyText, loadOrders, type SavedOrder } from '../../lib/order'
import { SAMPLE_ORDERS } from '../demoData'

const STATUSES: SavedOrder['status'][] = ['new', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled']

export default function OrdersPage() {
  const [orders, setOrders] = useState<SavedOrder[]>(() => [...loadOrders(), ...SAMPLE_ORDERS])
  const [fees, setFees] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState<'all' | SavedOrder['status']>('all')
  const [openNo, setOpenNo] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const list = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  async function copyReply(o: SavedOrder) {
    const fee = Number(fees[o.orderNo])
    const lines = [
      `Hi ${o.customer.name.split(' ')[0] || 'there'}! This is Pray For Us about order ${o.orderNo}.`,
      `Subtotal: ${peso(o.subtotal)}`,
      fee > 0 ? `Shipping fee: ${peso(fee)}` : 'Shipping fee: (to be quoted)',
      fee > 0 ? `Total: ${peso(o.subtotal + fee)}` : '',
      'Please confirm and we will send the payment details.',
    ].filter(Boolean)
    await copyText(lines.join('\n'))
    setCopied(o.orderNo)
    setTimeout(() => setCopied(null), 1600)
  }

  return (
    <div>
      <p className="label">Customer orders</p>
      <h1 className="h-display text-5xl md:text-6xl">Orders</h1>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {(['all', ...STATUSES] as const).map((s) => (
          <button key={s} className={`chip ${filter === s ? 'chip-on' : ''}`} aria-pressed={filter === s} onClick={() => setFilter(s)}>
            {s}
          </button>
        ))}
      </div>

      <ul className="mt-6 space-y-3">
        {list.length === 0 && <li className="font-mono text-sm text-bone/60">No orders with this status.</li>}
        {list.map((o) => {
          const open = openNo === o.orderNo
          return (
            <li key={o.orderNo} className="border border-bone/15 bg-coal">
              <div className="grid gap-3 p-4 md:grid-cols-[1.2fr_1fr_auto_auto] md:items-center">
                <div>
                  <p className="font-display text-2xl">{o.orderNo}</p>
                  <p className="font-mono text-xs text-bone/50">{new Date(o.createdAt).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                <div className="font-mono text-sm">
                  <p>{o.customer.name}</p>
                  <p className="text-xs text-bone/50">
                    {o.customer.phone} · {o.customer.address}
                  </p>
                </div>
                <p className="font-mono text-lg font-bold">{peso(o.subtotal)}</p>
                <div className="flex items-center gap-2">
                  <label className="sr-only" htmlFor={`fee-${o.orderNo}`}>
                    Shipping fee for {o.orderNo}
                  </label>
                  <input
                    id={`fee-${o.orderNo}`}
                    className="field !w-24 !py-1.5"
                    inputMode="numeric"
                    placeholder="Ship ₱"
                    value={fees[o.orderNo] ?? ''}
                    onChange={(e) => setFees((s) => ({ ...s, [o.orderNo]: e.target.value.replace(/[^\d]/g, '') }))}
                  />
                  <label className="sr-only" htmlFor={`st-${o.orderNo}`}>
                    Status for {o.orderNo}
                  </label>
                  <select
                    id={`st-${o.orderNo}`}
                    className="field !w-auto !py-1.5"
                    value={o.status}
                    onChange={(e) => setOrders((l) => l.map((x) => (x.orderNo === o.orderNo ? { ...x, status: e.target.value as SavedOrder['status'] } : x)))}
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 border-t border-bone/10 px-4 py-2">
                <button className="chip" aria-expanded={open} onClick={() => setOpenNo(open ? null : o.orderNo)}>
                  {open ? 'Hide details' : 'Details'}
                </button>
                <button className="chip" onClick={() => copyReply(o)}>
                  {copied === o.orderNo ? 'Copied ✓' : 'Copy Messenger reply'}
                </button>
              </div>
              {open && (
                <div className="space-y-2 border-t border-bone/10 px-4 py-3 font-mono text-sm text-bone/80">
                  {o.customer.handle && <p>Messenger / IG: {o.customer.handle}</p>}
                  <p>Address: {o.customer.address}</p>
                  {o.customer.notes && <p>Notes: {o.customer.notes}</p>}
                  <pre className="whitespace-pre-wrap border border-bone/10 bg-ink p-3 text-xs">{o.message}</pre>
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <p className="mt-6 font-mono text-xs text-bone/50">Demo: changes stay on this page only. Orders marked DEMO are samples.</p>
    </div>
  )
}
