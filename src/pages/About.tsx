import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { SocialLinks } from '../components/Social'
import { ownerBattles, ownerFacts, ownerIntro, ownerMilestones, ownerSections, ownerStyle } from '../data/owner'
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
            <p className="font-fang text-3xl leading-tight text-bone">Founder of Pray For Us.</p>
            <p className="text-base leading-relaxed">{ownerIntro}</p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/product/prodigal-son-tee" className="btn btn-peri">
                His tee: Prodigal Son
              </Link>
              <SocialLinks />
            </div>
          </div>
        </div>
      </Reveal>

      <section className="mx-auto mt-14 max-w-4xl px-4" aria-labelledby="profile-heading">
        <h3 id="profile-heading" className="sr-only">
          Saint Ice profile
        </h3>
        <Reveal group>
          <dl className="grid grid-cols-2 gap-px border border-bone/15 bg-bone/15 md:grid-cols-5">
            {ownerFacts.map((f) => (
              <div key={f.label} className="bg-ink p-4">
                <dt className="label">{f.label}</dt>
                <dd className="mt-1 font-display text-xl uppercase leading-tight">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal group className="mt-12 space-y-8">
          {ownerSections.map((s) => (
            <article key={s.title}>
              <h3 className="h-display text-3xl md:text-4xl">{s.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-bone/80">{s.body}</p>
            </article>
          ))}
        </Reveal>

        <div className="mt-14">
          <h3 className="h-display text-3xl md:text-4xl">Style and mastery</h3>
          <Reveal group as="ul" className="mt-5 grid gap-4 md:grid-cols-3">
            {ownerStyle.map((s) => (
              <li key={s.title} className="border border-bone/15 bg-coal p-5">
                <h4 className="font-display text-2xl uppercase">{s.title}</h4>
                <p className="mt-2 text-bone/75">{s.body}</p>
              </li>
            ))}
          </Reveal>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="h-display text-3xl md:text-4xl">Milestones</h3>
            <Reveal group as="ol" className="mt-5 space-y-0 border-l-2 border-peri">
              {ownerMilestones.map((m) => (
                <li key={m.year} className="relative pb-6 pl-6 last:pb-0">
                  <span className="absolute -left-[7px] top-1.5 h-3 w-3 bg-peri" aria-hidden="true" />
                  <span className="font-display text-2xl text-peri-light">{m.year}</span>
                  <p className="text-bone/80">{m.text}</p>
                </li>
              ))}
            </Reveal>
          </div>
          <div>
            <h3 className="h-display text-3xl md:text-4xl">Key battles</h3>
            <Reveal group as="ul" className="mt-5 space-y-3">
              {ownerBattles.map((b) => (
                <li key={b.title} className="border border-bone/15 p-4">
                  <p className="font-display text-xl uppercase leading-tight">{b.title}</p>
                  <p className="mt-1 text-sm text-bone/70">{b.note}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

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
