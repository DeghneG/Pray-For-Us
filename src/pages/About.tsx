import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { SocialLinks } from '../components/Social'
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

      <Reveal as="section" className="mx-auto mt-16 max-w-4xl px-4">
        <p className="label">The man behind it</p>
        <h2 className="h-display text-5xl md:text-6xl">Saint Ice</h2>
        <div className="mt-8 grid items-center gap-8 md:grid-cols-[1fr_1.1fr]">
          <div className="grid grid-cols-2 gap-4">
            <figure>
              <div className="arch" style={{ aspectRatio: '3 / 4' }}>
                <img src={img('owner-1', 'lg')} alt="Saint Ice at a FlipTop event, fist raised, wearing the Prodigal Son tee" className="h-full w-full object-cover object-top" loading="lazy" />
              </div>
              <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-wider text-bone/50">Unibersikulo 13 · Photo: Nina Sandejas / FlipTop</figcaption>
            </figure>
            <figure className="mt-8">
              <div className="arch" style={{ aspectRatio: '3 / 4' }}>
                <img src={img('owner-2', 'lg')} alt="Portrait of Saint Ice in a cap and hood at a FlipTop event" className="h-full w-full object-cover object-center" loading="lazy" />
              </div>
              <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-wider text-bone/50">Balentong 12 · FlipTop</figcaption>
            </figure>
          </div>
          <div className="space-y-4 text-lg text-bone/80">
            <p>
              Saint Ice, formerly known as Icerocks, is the founder of Pray For Us. He is an emcee from Parañaque and has been on the FlipTop roster since 2011.
            </p>
            <p>He stepped away from battling to focus on music and MMA, then came back in 2024. Pray For Us is where that story goes next: faith, the street, and something you can wear.</p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/product/prodigal-son-tee" className="btn btn-peri">
                His tee: Prodigal Son
              </Link>
              <SocialLinks />
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="mx-auto mt-20 grid max-w-4xl gap-6 px-4 md:grid-cols-2">
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
