import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { answer, SUGGESTIONS, type BotLink, type BotReply } from '../lib/chatbot'
import { LINKS } from '../data/products'
import { DevBot } from './DevBot'

interface Msg {
  id: number
  from: 'bot' | 'user'
  text: string
  links?: BotLink[]
}

const GREETING: BotReply = {
  text: 'Hi, I am the Pray For Us helper. I answer from what the brand has published: prices, sizes, shipping, how to order. For anything else, Messenger is the fastest way to reach the team.',
}

export function Chat() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, from: 'bot', text: GREETING.text }])
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const nextId = useRef(1)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing, open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function ask(q: string) {
    const question = q.trim()
    if (!question || typing) return
    setMsgs((m) => [...m, { id: nextId.current++, from: 'user', text: question }])
    setText('')
    setTyping(true)
    const reply = answer(question)
    timer.current = window.setTimeout(() => {
      setMsgs((m) => [...m, { id: nextId.current++, from: 'bot', text: reply.text, links: reply.links }])
      setTyping(false)
    }, 450)
  }

  return (
    <>
      {!open && (
        <div className="fixed bottom-4 right-4 z-[65] flex w-max max-w-[calc(100vw-2rem)] flex-col items-center gap-2">
          <DevBot />
          <a
            href={LINKS.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-peri px-4 py-2 font-display uppercase tracking-wider text-white shadow-[0_0_30px_rgba(92,108,242,0.5)] transition hover:bg-peri-light"
          >
            Message the page ↗
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open chat. Ask a question about Pray For Us"
            className="flex items-center gap-2 border-2 border-peri bg-ink px-4 py-3 font-display text-lg uppercase tracking-wider shadow-[0_0_30px_rgba(92,108,242,0.5)] transition hover:bg-peri"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 5h16v11H9l-5 4V5Z" strokeLinejoin="round" />
            </svg>
            Ask us
          </button>
        </div>
      )}

      {open && (
        <section
          data-lenis-prevent
          role="dialog"
          aria-label="Pray For Us chat"
          className="fixed bottom-4 right-4 z-[65] flex h-[min(34rem,calc(100vh-2rem))] w-[calc(100vw-2rem)] max-w-sm flex-col border-2 border-peri bg-ink shadow-[0_0_40px_rgba(92,108,242,0.45)]"
        >
          <header className="flex items-center justify-between border-b border-bone/15 bg-coal px-4 py-3">
            <div>
              <h2 className="font-display text-xl uppercase tracking-wider">Ask us</h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-bone/50">Automated answers · no AI</p>
            </div>
            <button className="chip" onClick={() => setOpen(false)} aria-label="Close chat">
              Close
            </button>
          </header>

          <div ref={logRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m) => (
              <div key={m.id} className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={`max-w-[88%] px-3 py-2 text-sm leading-relaxed ${m.from === 'user' ? 'bg-peri text-white' : 'border border-bone/20 bg-coal'}`}>
                  <p>{m.text}</p>
                  {m.links && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.links.map((l) =>
                        l.to ? (
                          <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="chip">
                            {l.label}
                          </Link>
                        ) : (
                          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="chip">
                            {l.label}
                          </a>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start" aria-label="Typing">
                <div className="border border-bone/20 bg-coal px-3 py-2 font-mono text-sm text-bone/60">…</div>
              </div>
            )}
          </div>

          <a
            href={LINKS.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border-t border-peri bg-peri px-3 py-2.5 font-display uppercase tracking-wider text-white hover:bg-peri-light"
          >
            Message the page on Messenger ↗
          </a>

          <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-bone/15 px-3 py-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chip shrink-0 whitespace-nowrap" onClick={() => ask(s)} disabled={typing}>
                {s}
              </button>
            ))}
          </div>

          <form
            className="flex border-t border-bone/15"
            onSubmit={(e) => {
              e.preventDefault()
              ask(text)
            }}
          >
            <label className="sr-only" htmlFor="chat-input">
              Your question
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={200}
              autoComplete="off"
              placeholder="Ask about price, size, shipping…"
              className="min-w-0 flex-1 bg-ink px-3 py-3 text-sm placeholder:text-bone/40 focus:outline-none"
            />
            <button type="submit" disabled={typing || !text.trim()} className="bg-peri px-4 font-display uppercase tracking-wider text-white disabled:opacity-40">
              Send
            </button>
          </form>
        </section>
      )}
    </>
  )
}
