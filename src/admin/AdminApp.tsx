// Owner dashboard (demo). Sample data + browser storage only; production uses Supabase (see ARCHITECTURE.md).
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { isAuthed, logout } from '../lib/adminAuth'
import Overview from './pages/Overview'
import OrdersPage from './pages/OrdersPage'
import ProductsPage from './pages/ProductsPage'
import { DropsPage, FitsPage } from './pages/MiscPages'
import PreviewPage from './pages/PreviewPage'

const nav = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/fits', label: 'Congregation' },
  { to: '/admin/drops', label: 'Drop list' },
  { to: '/admin/preview', label: 'Mobile preview' },
]

export default function AdminApp() {
  const navigate = useNavigate()
  if (!isAuthed()) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen bg-ink text-bone md:grid md:grid-cols-[15rem_1fr]">
      <aside className="border-b border-bone/10 bg-coal md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:block md:py-6">
          <img src="/logo.png" alt="Pray For Us" className="h-10 w-auto md:h-16" />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-peri-light md:mt-3">Owner dashboard · demo</p>
        </div>
        <nav aria-label="Admin" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:px-3 md:pb-0">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `shrink-0 whitespace-nowrap border px-3 py-2 font-display text-lg uppercase tracking-wider transition ${
                  isActive ? 'border-peri bg-peri text-white' : 'border-transparent text-bone/75 hover:border-bone/30 hover:text-bone'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden gap-2 px-3 pt-6 md:flex md:flex-col">
          <a href="/" target="_blank" rel="noopener noreferrer" className="chip text-center">
            View live site ↗
          </a>
          <button
            className="chip"
            onClick={() => {
              logout()
              navigate('/admin/login', { replace: true })
            }}
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-6 md:px-8 md:py-8">
        <div className="mb-6 flex items-center justify-end gap-2 md:hidden">
          <a href="/" target="_blank" rel="noopener noreferrer" className="chip">
            View site ↗
          </a>
          <button
            className="chip"
            onClick={() => {
              logout()
              navigate('/admin/login', { replace: true })
            }}
          >
            Log out
          </button>
        </div>
        <Routes>
          <Route index element={<Overview />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="fits" element={<FitsPage />} />
          <Route path="drops" element={<DropsPage />} />
          <Route path="preview" element={<PreviewPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  )
}
