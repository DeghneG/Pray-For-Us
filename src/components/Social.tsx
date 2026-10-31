import { LINKS } from '../data/products'

export function FacebookIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-1 .4-1.7 1.8-1.7H17V3.9c-.3 0-1.3-.2-2.5-.2-2.6 0-4.3 1.6-4.3 4.4v2.4H7.4v3.3h2.8V22h3.3Z" />
    </svg>
  )
}

export function InstagramIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Facebook + Instagram buttons. */
export function SocialLinks({ className = '', size = 'h-5 w-5' }: { className?: string; size?: string }) {
  const base =
    'inline-flex h-10 w-10 items-center justify-center border border-bone/30 text-bone transition hover:border-peri hover:bg-peri hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-peri'
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <a href={LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Pray For Us on Facebook" className={base}>
        <FacebookIcon className={size} />
      </a>
      <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Pray For Us on Instagram" className={base}>
        <InstagramIcon className={size} />
      </a>
    </div>
  )
}
