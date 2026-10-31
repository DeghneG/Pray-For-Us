import { Link } from 'react-router-dom'
import { getProduct, img, isOrderable, peso, products } from '../../data/products'
import { loadOrders } from '../../lib/order'
import { SAMPLE_ORDERS, SAMPLE_SOURCES, SAMPLE_UNITS, SAMPLE_WEEK } from '../demoData'

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="border border-bone/15 bg-coal p-4">
      <p className="label">{label}</p>
      <p className="mt-1 font-display text-4xl leading-none md:text-5xl">{value}</p>
      {hint && <p className="mt-2 font-mono text-[11px] text-bone/50">{hint}</p>}
    </div>
  )
}

export default function Overview() {
  const orders = [...loadOrders(), ...SAMPLE_ORDERS]
  const live = orders.filter((o) => o.status !== 'cancelled')
  const revenue = live.reduce((n, o) => n + o.subtotal, 0)
  const toConfirm = orders.filter((o) => o.status === 'new').length
  let drops = 0
  try {
    drops = (JSON.parse(localStorage.getItem('pfu-droplist') ?? '[]') as string[]).length
  } catch {
    /* ignore */
  }
  const top = Object.entries(SAMPLE_UNITS)
    .map(([slug, units]) => ({ p: getProduct(slug), units }))
    .filter((x): x is { p: NonNullable<typeof x.p>; units: number } => Boolean(x.p))
  const maxUnits = Math.max(...top.map((t) => t.units))
  const maxDay = Math.max(...SAMPLE_WEEK.map((d) => d.orders))
  const watch = products.filter((p) => !isOrderable(p))

  return (
    <div>
      <p className="label">Welcome back</p>
      <h1 className="h-display text-5xl md:text-6xl">Overview</h1>
      <p className="mt-2 max-w-2xl font-mono text-xs text-bone/60">
        Demo numbers so you can see the layout. Orders placed on the site in this browser also show up here.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Orders" value={String(orders.length)} hint="all time (demo)" />
        <Kpi label="To confirm" value={String(toConfirm)} hint="status: new" />
        <Kpi label="Order value" value={peso(revenue)} hint="before shipping fees" />
        <Kpi label="Drop-list sign-ups" value={String(drops)} hint="from the home page form" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="border border-bone/15 p-4" aria-labelledby="week-h">
          <h2 id="week-h" className="font-display text-2xl uppercase">
            Orders, last 7 days
          </h2>
          <div className="mt-4 flex h-40 items-end gap-2" role="img" aria-label={`Orders per day: ${SAMPLE_WEEK.map((d) => `${d.day} ${d.orders}`).join(', ')}`}>
            {SAMPLE_WEEK.map((d) => (
              <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="font-mono text-xs text-bone/70">{d.orders}</span>
                <div className="w-full bg-peri" style={{ height: `${(d.orders / maxDay) * 100}%` }} />
                <span className="font-mono text-[11px] text-bone/50">{d.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-bone/15 p-4" aria-labelledby="src-h">
          <h2 id="src-h" className="font-display text-2xl uppercase">
            Where customers message from
          </h2>
          <ul className="mt-4 space-y-3">
            {SAMPLE_SOURCES.map((s) => (
              <li key={s.name}>
                <div className="flex justify-between font-mono text-xs">
                  <span>{s.name}</span>
                  <span className="text-bone/60">{s.share}%</span>
                </div>
                <div className="mt-1 h-2 bg-bone/10">
                  <div className="h-full bg-peri" style={{ width: `${s.share}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-[11px] text-bone/50">Once the site tracks orders, this fills in from real data.</p>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="border border-bone/15 p-4" aria-labelledby="top-h">
          <h2 id="top-h" className="font-display text-2xl uppercase">
            Best sellers this month
          </h2>
          <ul className="mt-4 space-y-2">
            {top.map(({ p, units }) => (
              <li key={p.slug} className="flex items-center gap-3">
                {p.photos[0] ? <img src={img(p.photos[0], 'sm')} alt="" className="h-10 w-10 shrink-0 object-cover" /> : <span className="h-10 w-10 shrink-0 bg-coal" />}
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2 font-mono text-xs">
                    <span className="truncate">{p.name}</span>
                    <span className="shrink-0 text-bone/60">{units} sold</span>
                  </div>
                  <div className="mt-1 h-2 bg-bone/10">
                    <div className="h-full bg-peri" style={{ width: `${(units / maxUnits) * 100}%` }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="border border-bone/15 p-4" aria-labelledby="watch-h">
          <h2 id="watch-h" className="font-display text-2xl uppercase">
            Not available right now
          </h2>
          <ul className="mt-4 space-y-2 font-mono text-sm">
            {watch.length === 0 && <li className="text-bone/60">Everything is available.</li>}
            {watch.map((p) => (
              <li key={p.slug} className="flex justify-between gap-3 border-b border-bone/10 pb-2">
                <span>{p.name}</span>
                <Link to="/admin/products" className="shrink-0 text-peri-light underline">
                  edit
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 font-display text-xl uppercase">Latest orders</h3>
          <ul className="mt-2 space-y-1 font-mono text-xs">
            {orders.slice(0, 4).map((o) => (
              <li key={o.orderNo} className="flex justify-between gap-3">
                <span>
                  {o.orderNo} · {o.status}
                </span>
                <span className="text-bone/60">{peso(o.subtotal)}</span>
              </li>
            ))}
          </ul>
          <Link to="/admin/orders" className="chip mt-4 inline-block">
            All orders
          </Link>
        </section>
      </div>
    </div>
  )
}
