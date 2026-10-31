const LABELS = ['Bag', 'Your details', 'Send in Messenger']

/** Where the customer is in the three ordering steps. */
export function StepTrail({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-wider" aria-label="Order steps">
      {LABELS.map((l, i) => {
        const n = i + 1
        const on = n === current
        return (
          <li key={l} className={`flex items-center gap-2 ${on ? 'text-peri-light' : n < current ? 'text-bone/70' : 'text-bone/40'}`} aria-current={on ? 'step' : undefined}>
            <span className={`grid h-5 w-5 place-items-center border text-[10px] ${on ? 'border-peri bg-peri text-white' : 'border-bone/30'}`}>{n}</span>
            {l}
            {n < 3 && <span aria-hidden="true">—</span>}
          </li>
        )
      })}
    </ol>
  )
}
