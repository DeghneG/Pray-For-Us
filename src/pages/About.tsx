import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { img } from '../data/products'

export default function About() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pt-12">
        <p className="label">The brand</p>
        <h1 className="h-display text-6xl md:text-8xl">About</h1>
        <p className="font-fang mt-8 text-4xl leading-tight md:text-5xl">Do you believe in divine intervention?</p>
        <Reveal group intro className="mt-8 space-y-5 text-lg text-bone/80">
          <p>
            Pray For Us is Filipino hip-hop streetwear. Faith and the street in one frame: a crown of thorns done as barbed wire, a prayer said out loud, a message you can wear.
          </p>
          <p>
            It's made by Saint Ice, an emcee from Parañaque. After years in the battle scene, he stepped away, came back, and put the weight of it into clothes.
          </p>
          <p>
            Every drop is small on purpose. Heavy tees, hats, a hoodie, stickers. Some pieces come back, some never do.
          </p>
        </Reveal>
      </section>

      <Reveal as="section" className="mx-auto mt-14 grid max-w-4xl gap-6 px-4 md:grid-cols-2">
        <img src={img('lifestyle-cap-desk', 'lg')} alt="A washed Pray For Us cap on a desk with markers and toys" className="w-full border border-bone/15 object-cover" loading="lazy" />
        <div className="flex flex-col justify-center gap-4">
          <h2 className="h-display text-4xl">Wear it. Tag it.</h2>
          <p className="text-bone/80">Post your fit with #PrayForUs and join the Congregation.</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/congregation" className="btn btn-peri">
              The Congregation
            </Link>
            <Link to="/shop" className="btn btn-ghost">
              Shop
            </Link>
          </div>
        </div>
      </Reveal>
    </>
  )
}
