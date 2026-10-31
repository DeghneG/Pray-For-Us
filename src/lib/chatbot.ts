// Hardcoded FAQ bot. No API: every answer is written from what the brand has published
// (Facebook posts, size charts, prices) plus live product data. Anything unknown says so and points to Messenger.
import { BUNDLE, HOODIE_CHART, LINKS, STATUS_LABEL, TEE_CHART, getProduct, peso, products, type Product } from '../data/products'

export interface BotLink {
  label: string
  to?: string
  href?: string
}

export interface BotReply {
  text: string
  links?: BotLink[]
}

export const MESSENGER_LINK: BotLink = { label: 'Message us on Messenger', href: LINKS.messenger }

export const SUGGESTIONS = [
  'How do I order?',
  'How much is shipping?',
  'What sizes are there?',
  "What's in stock?",
  'Payment methods?',
  'Who is Saint Ice?',
]

const ALIASES: Record<string, string[]> = {
  'tuff-as-nailz-hoodie': ['tuff', 'nailz', 'hoodie', 'zip up', 'zipper'],
  'prodigal-son-tee': ['prodigal'],
  'portal-hat': ['portal', 'reflective'],
  'windmill-tee': ['windmill'],
  'black-widow-tee': ['black widow', 'widow'],
  'layeth-tee': ['layeth'],
  'monday-tee': ['monday'],
  'praystation-tee': ['praystation', 'playstation'],
  'nite-tee': ['nite'],
  'day-tee': ['day tee', 'day shirt', 'white day'],
  'raplines-numero-uno-tee': ['raplines', 'numero'],
  '444-tee': ['444'],
  'goodwill-hat': ['good will', 'goodwill'],
  'isaiah-hat': ['isaiah'],
  'paris-hat': ['paris'],
  'fmj-hat': ['fmj'],
  'larry-hat': ['larry', 'trucker'],
  'ambrose-keychain': ['ambrose', 'keychain', 'key chain'],
  'year-one-stickers': ['year one', 'yearone'],
}

// Match at the start of a word, so "hat" does not fire inside "what".
const has = (t: string, ...words: string[]) =>
  words.some((w) => new RegExp('(^|\\s)' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(t))

function findProduct(t: string): Product | undefined {
  if (has(t, 'thorns')) return getProduct(has(t, 'sticker') ? 'thorns-stickers' : 'thorns-tee')
  for (const [slug, names] of Object.entries(ALIASES)) {
    if (has(t, ...names)) return getProduct(slug)
  }
  return undefined
}

function sizeLine(p: Product): string {
  if (p.sizeSet === 'tee') {
    return `Sizes S to XXXL. Tee chart in inches: S is ${TEE_CHART[0].length} long x ${TEE_CHART[0].width} wide, L is ${TEE_CHART[2].length} x ${TEE_CHART[2].width}, XXXL is ${TEE_CHART[5].length} x ${TEE_CHART[5].width}.`
  }
  if (p.sizeSet === 'hoodie') {
    return `Sizes S to XXXL. Hoodie chart in inches (width x length): S ${HOODIE_CHART[0].width} x ${HOODIE_CHART[0].length}, L ${HOODIE_CHART[2].width} x ${HOODIE_CHART[2].length}, XXXL ${HOODIE_CHART[5].width} x ${HOODIE_CHART[5].length}.`
  }
  if (p.slug === 'portal-hat') return 'One size fits all (snapback).'
  if (p.category === 'hat') return "I don't have the size details for this cap yet. Ask us on Messenger."
  return ''
}

function productReply(p: Product): BotReply {
  const parts = [
    `${p.name}: ${peso(p.price)} + shipping fee.`,
    `Status: ${STATUS_LABEL[p.status]}.`,
    p.bullets.length ? p.bullets.join('. ') + '.' : '',
    sizeLine(p),
    p.note ?? '',
    'Stock moves fast, so we confirm availability in Messenger.',
  ]
  return { text: parts.filter(Boolean).join(' '), links: [{ label: `View ${p.name}`, to: `/product/${p.slug}` }] }
}

function priceOverview(): string {
  const hoodie = getProduct('tuff-as-nailz-hoodie')!.price
  const tee = getProduct('windmill-tee')!.price
  const tee444 = getProduct('444-tee')!.price
  const hats = [getProduct('larry-hat')!.price, getProduct('goodwill-hat')!.price, getProduct('portal-hat')!.price]
  const key = getProduct('ambrose-keychain')!.price
  const stick = getProduct('year-one-stickers')!.price
  return (
    `Tees are ${peso(tee)} (the 444 tee is ${peso(tee444)}). The TUFF AS NAILZ hoodie is ${peso(hoodie)}. ` +
    `Hats: ${peso(hats[0])} (LARRY), ${peso(hats[1])} (GOOD WILL, ISAIAH, Paris, FMJ), ${peso(hats[2])} (PORTAL). ` +
    `AMBROSE keychain ${peso(key)}, sticker packs ${peso(stick)}. ` +
    `DAY N NITE: both tees for ${peso(BUNDLE.pairPrice)}. Every price is + shipping fee.`
  )
}

export function answer(input: string): BotReply {
  const t = input.toLowerCase().replace(/[^a-z0-9\s'+₱]/g, ' ').replace(/\s+/g, ' ').trim()
  if (!t) return { text: 'Type a question and I will do my best.' }

  if (/^(hi|hello|hey|yo|kumusta|musta|good (morning|afternoon|evening))\b/.test(t) && t.split(' ').length <= 4) {
    return { text: 'Hi! Ask me about prices, sizes, shipping, payment or how to order. You can also tap one of the questions below.' }
  }
  if (has(t, 'thank', 'salamat')) return { text: 'You are welcome. Pray for us.' }

  if (has(t, 'day n nite', 'day and nite', 'bundle', 'set price', 'both tees')) {
    return {
      text: `DAY N NITE is the white DAY tee and the navy NITE tee together for ${peso(BUNDLE.pairPrice)} instead of ${peso(BUNDLE.singlePrice * 2)} (${peso(BUNDLE.singlePrice)} each). Add both to your bag and the discount applies automatically. + shipping fee.`,
      links: [
        { label: 'DAY tee', to: '/product/day-tee' },
        { label: 'NITE tee', to: '/product/nite-tee' },
      ],
    }
  }

  const p = findProduct(t)
  if (p) return productReply(p)

  if (has(t, 'sticker')) {
    return {
      text: 'We have two sticker packs, each ₱135 + shipping fee. YEAR ONE: 9 stickers, weatherproof, matte finish. THORNS: 12 waterproof stickers, 3"x1.5", matte finish. The hoodie also comes with a sticker pack.',
      links: [
        { label: 'YEAR ONE pack', to: '/product/year-one-stickers' },
        { label: 'THORNS pack', to: '/product/thorns-stickers' },
      ],
    }
  }
  if (has(t, 'hat', 'cap', 'snapback')) {
    return {
      text: 'Hats: LARRY trucker ₱777, GOOD WILL / ISAIAH / Paris / FMJ ₱999, PORTAL snapback ₱1,111. All + shipping fee.',
      links: [{ label: 'See the hats', to: '/shop?c=hat' }],
    }
  }
  if (has(t, 'tee', 'shirt', 't shirt')) {
    return { text: `Our tees are ${peso(795)} each (the 444 tee is ${peso(444)}), + shipping fee. Boxy fit. Tell me a tee's name for details.`, links: [{ label: 'See the tees', to: '/shop?c=tee' }] }
  }

  if (has(t, 'pre order', 'preorder', 'pre-order', 'deadline', 'eta')) {
    return {
      text: 'Some drops open as pre-orders with a deadline and an ETA, posted on our Facebook page. The Raplines NUMERO UNO tee pre-order is closed. Join the drop list on the home page or follow us to catch the next one.',
      links: [{ label: 'Facebook page', href: LINKS.facebook }, { label: 'Drop list', to: '/#drops' }],
    }
  }
  if (has(t, 'ship', 'deliver', 'padala', 'courier', 'free shipping', 'delivery fee')) {
    return {
      text: 'Shipping is a separate fee on everything, including the hoodie, keychain and stickers, and the amount depends on where you are. That is why every price reads "+ shipping fee". We quote the exact fee in Messenger after you send your order. I do not have courier names or delivery times to share yet.',
      links: [MESSENGER_LINK],
    }
  }
  if (has(t, 'pay', 'gcash', 'maya', 'cod', 'cash on delivery', 'bank', 'bayad', 'paypal')) {
    return {
      text: 'We confirm the payment method and details in Messenger once we check your order. The accepted payment methods and processing time have not been published on this site yet, so please ask us on Messenger.',
      links: [MESSENGER_LINK],
    }
  }
  if (has(t, 'how to order', 'order', 'buy', 'bili', 'checkout', 'purchase')) {
    return {
      text: '1) Pick a piece and size and add it to your bag. 2) Check out with your name, number and address. 3) Your order opens in Messenger, ready to send. 4) We reply with availability and the shipping fee, then confirm payment. 5) It ships once payment is confirmed.',
      links: [{ label: 'How to order', to: '/how-to-order' }, { label: 'Shop', to: '/shop' }],
    }
  }
  if (has(t, 'price', 'how much', 'magkano', 'cost', 'presyo', 'cheap')) return { text: priceOverview(), links: [{ label: 'Shop', to: '/shop' }] }
  if (has(t, 'size', 'sizing', 'fit', 'measure', 'chart', 'sukat', 'xl', 'large', 'small', 'medium')) {
    return {
      text: `Tees run S to XXXL and are boxy. Tee chart (inches, length x width x sleeve): S ${TEE_CHART[0].length}x${TEE_CHART[0].width}x${TEE_CHART[0].sleeve}, M ${TEE_CHART[1].length}x${TEE_CHART[1].width}x${TEE_CHART[1].sleeve}, L ${TEE_CHART[2].length}x${TEE_CHART[2].width}x${TEE_CHART[2].sleeve}, XL ${TEE_CHART[3].length}x${TEE_CHART[3].width}x${TEE_CHART[3].sleeve}, XXL ${TEE_CHART[4].length}x${TEE_CHART[4].width}x${TEE_CHART[4].sleeve}, XXXL ${TEE_CHART[5].length}x${TEE_CHART[5].width}x${TEE_CHART[5].sleeve}. The hoodie is boxy and cropped, width x length from ${HOODIE_CHART[0].width}x${HOODIE_CHART[0].length} (S) to ${HOODIE_CHART[5].width}x${HOODIE_CHART[5].length} (XXXL). The PORTAL snapback is one size. Photos in The Congregation also show real fits.`,
      links: [{ label: 'Size charts', to: '/how-to-order' }, { label: 'The Congregation', to: '/congregation' }],
    }
  }
  if (has(t, 'stock', 'available', 'availability', 'restock', 'sold out', 'meron', 'left')) {
    return {
      text: 'Each product shows its status (in stock, back in stock, sold out). Stock moves fast, so we confirm availability in Messenger. The 444 tee is sold once a year with no restocks, and the Raplines tee pre-order is closed.',
      links: [{ label: 'Shop', to: '/shop' }, MESSENGER_LINK],
    }
  }
  if (has(t, 'saint ice', 'icerocks', 'ice rocks', 'owner', 'founder', 'who made', 'who are you', 'who is', 'emcee', 'fliptop', 'about')) {
    return {
      text: 'Pray For Us is made by Saint Ice (formerly Ice Rocks), a veteran FlipTop battle rapper from Parañaque City in the Metro Manila division (CIDA / AOJ). He joined FlipTop in 2011, stepped away for about a decade to focus on music and MMA, and returned in February 2024 at Won Minutes Luzon. His win over Yuniko at Zoning 17 and his Ahon 16 match against Ban in December 2025 are among his key battles. Full profile on the About page.',
      links: [{ label: 'About Saint Ice', to: '/about' }],
    }
  }
  if (has(t, 'congregation', 'feature', 'featured', 'tag', 'hashtag', 'wear it', 'my fit', 'send my')) {
    return {
      text: 'To join The Congregation: post a photo wearing Pray For Us, tag @prayforusprayforus and use #PrayForUs (or DM it), tell us the piece, your size and your height, and say yes to being featured. We only post fits with your OK and take them down whenever you ask.',
      links: [{ label: 'The Congregation', to: '/congregation' }, { label: 'Instagram', href: LINKS.instagram }],
    }
  }
  if (has(t, 'facebook', 'instagram', 'insta', 'ig', 'fb', 'social', 'contact', 'messenger', 'dm', 'message', 'reach')) {
    return {
      text: 'Find us on Facebook and Instagram (@prayforusprayforus). Orders and questions are handled in Messenger.',
      links: [{ label: 'Facebook', href: LINKS.facebook }, { label: 'Instagram', href: LINKS.instagram }, MESSENGER_LINK],
    }
  }
  if (has(t, 'return', 'exchange', 'refund', 'palit', 'defect', 'wrong size', 'warranty')) {
    return {
      text: 'I do not have a return or exchange policy to share yet. Please message us on Messenger and the team will help.',
      links: [MESSENGER_LINK],
    }
  }
  if (has(t, 'where', 'location', 'store', 'address', 'pickup', 'pick up', 'meet up', 'meetup')) {
    return {
      text: 'We sell through our Facebook page, Instagram and this site, and orders are handled in Messenger. I do not have a store address or pickup details, so please ask on Messenger.',
      links: [MESSENGER_LINK],
    }
  }
  if (has(t, 'wholesale', 'collab', 'partner', 'sponsor', 'reseller', 'bulk')) {
    return { text: 'For collabs, bulk orders or partnerships, message us on Messenger. The Raplines NUMERO UNO tee was one of our collabs.', links: [MESSENGER_LINK] }
  }
  if (has(t, 'what do you sell', 'what do you have', 'products', 'catalog', 'items', 'merch')) {
    return {
      text: `We have ${products.length} pieces right now: tees, a zip hoodie, hats, a keychain and sticker packs.`,
      links: [{ label: 'Shop', to: '/shop' }],
    }
  }

  return {
    text: "I don't have an answer for that yet. Try one of the questions below, or message us on Messenger and the team will reply.",
    links: [MESSENGER_LINK],
  }
}
