import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useBag } from '../lib/bag'
import { LINKS } from '../data/products'
import { BagDrawer } from './BagDrawer'
import { ThornDivider } from './bits'
import { Chat } from './Chat'
import { Marquee, MotionToggle } from './Marquee'
import { SocialLinks } from './Social'

const nav = [
  { to: '/shop', label: 'Shop' },
  { to: '/congregation', label: 'Congregation' },
  { to: '/how-to-order', label: 'How to order' },
  { to: '/about', label: 'About' },
]

// The top strip: the brand name set in six different typefaces, repeated edge to edge.
const wordmarks = [
  'font-display tracking-widest text-[16px]',
  'font-fang normal-case tracking-wide text-[20px]',
  'font-marker tracking-wide text-[16px]',
  'font-typewriter tracking-widest text-[15px]',
  'font-bungee tracking-wider text-[14px]',
  'font-mono font-bold tracking-[0.25em] text-[13px]',
]

function WordmarkStrip() {
  return (
    <div className="bg-coal py-1.5 text-bone/75" role="img" aria-label="Pray For Us">
      <Marquee speed={38} pauseOnHover={false}>
        {(ghost) => (
          <div className="flex items-center whitespace-nowrap" data-ghost={ghost}>
            {Array.from({ length: 4 }).flatMap((_, round) =>
              wordmarks.map((cls, i) => (
                <span key={`${round}-${i}`} aria-hidden="true" className={`${cls} px-5 uppercase leading-none`}>
                  Pray for us
                  <span className="pl-10 text-peri/70">✦</span>
                </span>
              )),
            )}
          </div>
        )}
      </Marquee>
    </div>
  )
}

function BackButton() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <button type="button" onClick={() => navigate('/')} aria-label="Back to the home page" className="chip inline-flex items-center gap-2">
        <span aria-hidden="true">←</span> Back
      </button>
    </div>
  )
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export function Layout() {
  const { totals, setOpen } = useBag()
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setMenu(false), [pathname])

  return (
    <div className="grain">
      <ScrollToTop />
      <WordmarkStrip />

      <header className="sticky top-0 z-50 border-b border-bone/10 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" aria-label="Pray For Us, home" className="shrink-0">
            <img src="/logo.png" alt="Pray For Us" className="h-10 w-auto" />
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `font-display text-lg uppercase tracking-widest transition hover:text-peri-light ${isActive ? 'text-peri' : ''}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <SocialLinks className="hidden lg:flex" />
            <button className="btn btn-ghost !px-4 !py-2 !text-base" onClick={() => setOpen(true)} aria-label={`Open order bag, ${totals.count} items`}>
              Bag
              <span className="bg-peri px-1.5 font-mono text-xs text-white">{totals.count}</span>
            </button>
            <button className="chip md:hidden" aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu((m) => !m)}>
              {menu ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
        {menu && (
          <nav id="mobile-nav" className="border-t border-bone/10 px-4 pb-4 md:hidden" aria-label="Mobile">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} className="block border-b border-bone/10 py-3 font-display text-2xl uppercase tracking-widest">
                {n.label}
              </NavLink>
            ))}
            <SocialLinks className="pt-4" />
          </nav>
        )}
      </header>

      <main>
        {pathname !== '/' && <BackButton />}
        <Outlet />
      </main>

      <footer className="mt-24">
        <ThornDivider />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
          <div>
            <img src="/logo.png" alt="Pray For Us" className="h-16 w-auto" />
            <p className="mt-4 font-fang text-3xl">Do you believe in divine intervention?</p>
          </div>
          <div>
            <h2 className="label mb-3">Find us</h2>
            <SocialLinks className="mb-4" />
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <a className="hover:text-peri-light" href={LINKS.facebook} target="_blank" rel="noopener noreferrer">
                  Facebook: Pray For Us
                </a>
              </li>
              <li>
                <a className="hover:text-peri-light" href={LINKS.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram: {LINKS.igHandle}
                </a>
              </li>
              <li>
                <a className="hover:text-peri-light" href={LINKS.messenger} target="_blank" rel="noopener noreferrer">
                  Messenger: order here
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="label mb-3">Wear it. Tag it.</h2>
            <p className="font-mono text-sm text-bone/70">
              Post your fit with <span className="text-peri-light">#PrayForUs</span> and tag {LINKS.igHandle} to join the Congregation.
            </p>
            <Link to="/admin" className="mt-6 inline-block font-mono text-[11px] uppercase tracking-widest text-bone/30 hover:text-bone/60">
              Admin (demo)
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-bone/10 px-4 py-4 text-center font-mono text-[11px] uppercase tracking-widest text-bone/40">
          <span>© Pray For Us · #PrayForUs</span>
          <span>Proposal prototype · sample data</span>
          <MotionToggle />
        </div>
      </footer>

      <BagDrawer />
      <Chat />
    </div>
  )
}
