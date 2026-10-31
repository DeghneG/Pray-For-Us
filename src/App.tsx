import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Preloader } from './components/Preloader'
import About from './pages/About'
import Checkout from './pages/Checkout'
import CongregationPage from './pages/CongregationPage'
import Home from './pages/Home'
import HowToOrder from './pages/HowToOrder'
import NotFound from './pages/NotFound'
import OrderSent from './pages/OrderSent'
import ProductPage from './pages/ProductPage'
import Shop from './pages/Shop'

// Admin is split into its own chunk so shoppers never download it.
const Admin = lazy(() => import('./admin/Admin'))

export default function App() {
  return (
    <>
      <Preloader />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="congregation" element={<CongregationPage />} />
          <Route path="how-to-order" element={<HowToOrder />} />
          <Route path="about" element={<About />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order/:orderNo" element={<OrderSent />} />
          <Route
            path="admin"
            element={
              <Suspense fallback={<p className="p-10 text-center font-mono">Loading…</p>}>
                <Admin />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
