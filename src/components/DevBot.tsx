import { useEffect, useState } from 'react'
import { DEVELOPER_NAME } from '../data/owner'

// Small floating bot that sits above the "Message the page" button.
export function DevBot() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="flex flex-col items-center gap-2">
      {open && (
        <div
          role="dialog"
          aria-label="Developer name"
          className="flex items-start gap-2 border-2 border-[#E11D48] bg-ink px-3 py-2 shadow-[0_0_30px_rgba(225,29,72,0.5)]"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-bone/50">Designer and Developer</p>
            <p className="mt-1 font-display text-base uppercase tracking-wider">{DEVELOPER_NAME}</p>
          </div>
          <button className="chip" onClick={() => setOpen(false)} aria-label="Close">
            Close
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Who made this website?"
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#E11D48] bg-ink text-[#FDA4AF] shadow-[0_0_30px_rgba(225,29,72,0.5)] transition hover:bg-[#E11D48] hover:text-white"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="5" y="8" width="14" height="11" rx="2" />
          <path d="M12 4v4M9 13h.01M15 13h.01M9 16h6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
