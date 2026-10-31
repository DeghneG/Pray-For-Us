import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { SocialLinks } from '../components/Social'
import { ownerBattles, ownerFacts, ownerMilestones, ownerSections, ownerStyle } from '../data/owner'
import { img } from '../data/products'

export default function About() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pt-12">
        <p className="label">The brand</p>
        <h1 className="h-display text-6xl md:text-8xl">About</h1>
        <p className="font-fang mt-6 text-4xl leading-tight md:text-5xl">Do you believe in divine intervention?</p>
        <Reveal intro className="mt-6 max-w-2xl text-lg text-bone/80">
          <p>Filipino hip-hop streetwear. Faith and the street in one frame: a crown of thorns done as barbed wire, a message you can wear. Every drop is small on purpose.</p>
        </Reveal>
      </section>

      <Reveal as="section" className="mx-auto mt-14 max-w-4xl px-4">
        <p className="label">The man behind it</p>
        <h2 className="h-display text-5xl md:text-6xl">Saint Ice</h2>
        <div className="mt-8 grid items-center gap-8 md:grid-cols-[1fr_1.1fr]">
          <div className="grid grid-cols-2 gap-4">
            <figure>
              <div className="arch" style={{ aspectRatio: '3 / 4' }}>
                <img src={img('owner-1', 'lg')} alt="Saint Ice at a FlipTop event, fist raised, wearing the Prodigal Son tee" className="h-full w-full object-cover object-top" loading="lazy" />
              </div>
              <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-wider text-bone/50">Unibersikulo 13 · Nina Sandejas / FlipTop</figcaption>
            </figure>
            <figure className="mt-8">
              <div className="arch" style={{ aspectRatio: '3 / 4' }}>
                <img src={img('owner-2', 'lg')} alt="Portrait of Saint Ice in a cap and hood at a FlipTop event" className="h-full w-full object-cover object-center" loading="lazy" />
              </div>
              <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-wider text-bone/50">Balentong 12 · FlipTop</figcaption>
            </figure>
          </div>
          <div className="space-y-4">
            <p className="font-fang text-3xl leading-tight">Founder of Pray For Us.</p>
            <p className="text-lg text-bone/80">
              A veteran FlipTop battle rapper from Parañaque City, formerly Ice Rocks. He stepped away to focus on music and MMA, then returned in 2024 in a comeback the league counts among its best.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/product/prodigal-son-tee" className="btn btn-peri">
                His tee: Prodigal Son
              </Link>
              <SocialLinks />
            </div>
          </div>
        </div>
      </Reveal>

      <section className="mx-auto mt-12 max-w-4xl px-4" aria-label="Saint Ice at a glance">
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

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="h-display text-3xl">Milestones</h3>
            <Reveal group as="ol" className="mt-4 border-l-2 border-peri">
              {ownerMilestones.map((m) => (
                <li key={m.year} className="relative pb-4 pl-6 last:pb-0">
                  <span className="absolute -left-[7px] top-2 h-3 w-3 bg-peri" aria-hidden="true" />
                  <span className="font-display text-xl text-peri-light">{m.year}</span>
                  <span className="ml-3 text-bone/80">{m.text}</span>
                </li>
              ))}
            </Reveal>
          </div>
          <div>
            <h3 className="h-display text-3xl">Key battles</h3>
            <Reveal group as="ul" className="mt-4 space-y-2">
              {ownerBattles.map((b) => (
                <li key={b.title} className="border border-bone/15 px-4 py-3 font-display text-lg uppercase leading-tight">
                  {b.title}
                </li>
              ))}
            </Reveal>
          </div>
        </div>

        <details className="group mt-10 border border-bone/20">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-mono text-xs uppercase tracking-[0.2em] hover:text-peri-light">
            <span>Read the full profile</span>
            <span className="text-lg group-open:hidden" aria-hidden="true">
              +
            </span>
            <span className="hidden text-lg group-open:inline" aria-hidden="true">
              −
            </span>
          </summary>
          <div className="space-y-8 border-t border-bone/20 p-5">
            {ownerSections.map((s) => (
              <article key={s.title}>
                <h4 className="h-display text-2xl md:text-3xl">{s.title}</h4>
                <p className="mt-2 text-bone/80">{s.body}</p>
              </article>
            ))}
            <div>
              <h4 className="h-display text-2xl md:text-3xl">Style and mastery</h4>
              <ul className="mt-3 grid gap-3 md:grid-cols-3">
                {ownerStyle.map((s) => (
                  <li key={s.title} className="border border-bone/15 bg-coal p-4">
                    <p className="font-display text-xl uppercase">{s.title}</p>
                    <p className="mt-1 text-sm text-bone/75">{s.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </details>
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
