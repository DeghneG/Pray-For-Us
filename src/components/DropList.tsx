import { useState } from 'react'

const KEY = 'pfu-droplist'

export function DropList() {
  const [value, setValue] = useState('')
  const [consent, setConsent] = useState(false)
  const [done, setDone] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim() || !consent) return
    try {
      const list = JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]
      localStorage.setItem(KEY, JSON.stringify([...list, value.trim()]))
    } catch {
      /* demo only */
    }
    setDone(true)
  }

  return (
    <div className="border border-peri/60 bg-coal p-6 md:p-8">
      <h2 className="h-display text-4xl md:text-5xl">Don't miss the next drop</h2>
      <p className="mt-2 text-bone/70">
        The 444 tee comes once a year and never restocks. Leave your contact and we'll tell you first.
      </p>
      {done ? (
        <p className="mt-6 font-fang text-3xl text-peri-light" role="status">
          You're on the list. (Demo: stored in this browser only.)
        </p>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-3">
          <label className="block">
            <span className="label">Email, phone or Messenger name</span>
            <input className="field mt-1" value={value} onChange={(e) => setValue(e.target.value)} required />
          </label>
          <label className="flex items-start gap-2 text-sm text-bone/70">
            <input type="checkbox" className="mt-1 accent-peri" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
            <span>I agree to be contacted about Pray For Us drops. I can opt out any time.</span>
          </label>
          <button className="btn btn-peri" type="submit">
            Notify me
          </button>
        </form>
      )}
    </div>
  )
}
