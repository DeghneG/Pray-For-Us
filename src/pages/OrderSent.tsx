import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { copyText, loadOrders, openMessenger } from '../lib/order'

export default function OrderSent() {
  const { orderNo = '' } = useParams()
  const order = loadOrders().find((o) => o.orderNo === orderNo)
  const [copied, setCopied] = useState<'yes' | 'no' | null>(null)

  if (!order) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="h-display text-5xl">Order not found</h1>
        <Link to="/shop" className="btn btn-peri mt-6">
          Shop
        </Link>
      </section>
    )
  }

  async function send() {
    if (!order) return
    setCopied((await copyText(order.message)) ? 'yes' : 'no')
    openMessenger()
  }

  return (
    <section className="mx-auto max-w-2xl px-4 pt-12">
      <p className="label">Order request saved (demo)</p>
      <h1 className="h-display text-6xl md:text-7xl">{order.orderNo}</h1>
      <p className="font-fang mt-4 text-4xl">Now send it to us in Messenger.</p>
      <p className="mt-3 text-bone/70">
        We reply with availability and your shipping fee, then confirm how to pay. Your message is ready below.
      </p>

      <label className="mt-6 block">
        <span className="label">Your order message</span>
        <textarea readOnly rows={Math.min(14, order.message.split('\n').length + 1)} className="field mt-1 font-mono text-sm" value={order.message} onFocus={(e) => e.currentTarget.select()} />
      </label>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button className="btn btn-peri flex-1" onClick={send}>
          Copy &amp; open Messenger
        </button>
        <Link to="/shop" className="btn btn-ghost flex-1">
          Keep shopping
        </Link>
      </div>
      <p className="mt-3 min-h-[1.5rem] font-mono text-xs text-bone/60" role="status">
        {copied === 'yes' && 'Copied. Paste it into the Messenger chat and send.'}
        {copied === 'no' && 'Could not copy automatically. Select the text above and copy it, then paste it into Messenger.'}
      </p>
    </section>
  )
}
