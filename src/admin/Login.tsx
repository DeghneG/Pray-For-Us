import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { DEMO_PASS, DEMO_USER, isAuthed, login } from '../lib/adminAuth'

export default function Login() {
  const nav = useNavigate()
  const [user, setUser] = useState(DEMO_USER)
  const [pass, setPass] = useState(DEMO_PASS)
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  if (isAuthed()) return <Navigate to="/admin" replace />

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (login(user, pass)) nav('/admin', { replace: true })
    else setError('Wrong username or password.')
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4 py-10">
      <div className="w-full max-w-md">
        <img src="/logo.png" alt="Pray For Us" className="mx-auto h-24 w-auto drop-shadow-[0_0_30px_rgba(92,108,242,0.55)]" />
        <div className="mt-8 border border-peri/60 bg-coal p-6 md:p-8">
          <p className="label">Owner access</p>
          <h1 className="h-display text-5xl">Admin login</h1>

          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            <label className="block">
              <span className="label">Username</span>
              <input
                className="field mt-1"
                value={user}
                onChange={(e) => {
                  setUser(e.target.value)
                  setError('')
                }}
                autoComplete="username"
                required
              />
            </label>
            <label className="block">
              <span className="label">Password</span>
              <div className="relative mt-1">
                <input
                  className="field pr-16"
                  type={show ? 'text' : 'password'}
                  value={pass}
                  onChange={(e) => {
                    setPass(e.target.value)
                    setError('')
                  }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-pressed={show}
                  className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[11px] uppercase tracking-wider text-bone/60 hover:text-peri-light"
                >
                  {show ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>
            {error && (
              <p role="alert" className="font-mono text-sm text-peri-light">
                {error}
              </p>
            )}
            <button className="btn btn-peri w-full" type="submit">
              Log in
            </button>
          </form>

          <div className="mt-6 border border-dashed border-bone/30 p-3 font-mono text-xs text-bone/70">
            <p className="label mb-1">Demo account</p>
            <p>
              Username <b className="text-bone">{DEMO_USER}</b> · Password <b className="text-bone">{DEMO_PASS}</b>
            </p>
            <p className="mt-1 text-bone/50">Pre-filled for the demo. The real site gets a private login.</p>
          </div>
        </div>
        <Link to="/" className="mt-6 block text-center font-mono text-xs uppercase tracking-widest text-bone/50 hover:text-peri-light">
          ← Back to the site
        </Link>
      </div>
    </div>
  )
}
