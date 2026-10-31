import { useState } from 'react'
import { HOODIE_CHART, TEE_CHART, type SizeSet } from '../data/products'

export function SizeChart({ kind, highlight }: { kind: Exclude<SizeSet, 'one'>; highlight?: string }) {
  const [open, setOpen] = useState(false)
  const isTee = kind === 'tee'
  return (
    <div className="border border-bone/20">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-mono text-xs uppercase tracking-widest hover:text-peri-light"
      >
        <span>Size chart ({isTee ? 'tee' : 'hoodie'}, inches)</span>
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="overflow-x-auto border-t border-bone/20">
          <table className="w-full min-w-[320px] text-center font-mono text-sm">
            <thead className="bg-coal text-peri-light">
              <tr>
                <th className="p-2">Size</th>
                {isTee ? (
                  <>
                    <th className="p-2">Length</th>
                    <th className="p-2">Width</th>
                    <th className="p-2">Sleeve</th>
                  </>
                ) : (
                  <>
                    <th className="p-2">Width</th>
                    <th className="p-2">Length</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {isTee
                ? TEE_CHART.map((r) => (
                    <tr key={r.size} className={r.size === highlight ? 'bg-peri/30' : 'odd:bg-white/[0.03]'}>
                      <td className="p-2 font-bold">{r.size}</td>
                      <td className="p-2">{r.length}</td>
                      <td className="p-2">{r.width}</td>
                      <td className="p-2">{r.sleeve}</td>
                    </tr>
                  ))
                : HOODIE_CHART.map((r) => (
                    <tr key={r.size} className={r.size === highlight ? 'bg-peri/30' : 'odd:bg-white/[0.03]'}>
                      <td className="p-2 font-bold">{r.size}</td>
                      <td className="p-2">{r.width}</td>
                      <td className="p-2">{r.length}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
