import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-32 text-center">
      <p className="wire-text font-display text-9xl">404</p>
      <p className="font-fang mt-4 text-4xl">Lost? Pray on it.</p>
      <Link to="/shop" className="btn btn-peri mt-8">
        Back to the shop
      </Link>
    </section>
  )
}
