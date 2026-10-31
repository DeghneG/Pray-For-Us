// Seed catalog, built from the client's Facebook posts.
// Photo names refer to public/img/<name>-sm.webp and <name>-lg.webp (see scripts/image-map.json).

export type Category = 'tee' | 'hat' | 'hoodie' | 'accessory'

export type Status =
  | 'available'
  | 'back-in-stock'
  | 'limited-sold-out'
  | 'preorder-closed'

export type SizeSet = 'tee' | 'hoodie' | 'one'

export interface Colorway {
  name: string
  photos: string[]
}

export interface Product {
  slug: string
  name: string
  category: Category
  price: number
  status: Status
  sizeSet: SizeSet
  photos: string[]
  colors?: Colorway[]
  bullets: string[]
  note?: string
  bundleWith?: string
  /** Shown as "new" or highlight on the home page */
  featured?: boolean
}

export const TEE_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']

export const TEE_CHART = [
  { size: 'S', length: 26, width: 22, sleeve: 7 },
  { size: 'M', length: 27, width: 23, sleeve: 8 },
  { size: 'L', length: 28, width: 24, sleeve: 9 },
  { size: 'XL', length: 29, width: 25, sleeve: 10 },
  { size: 'XXL', length: 30, width: 26, sleeve: 11 },
  { size: 'XXXL', length: 31, width: 27, sleeve: 12 },
]

export const HOODIE_CHART = [
  { size: 'S', width: 22, length: 26 },
  { size: 'M', width: 23, length: 27 },
  { size: 'L', width: 24, length: 28 },
  { size: 'XL', width: 25, length: 29 },
  { size: 'XXL', width: 26, length: 30 },
  { size: 'XXXL', width: 27, length: 31 },
]

export const BUNDLE = {
  name: 'DAY N NITE',
  slugs: ['day-tee', 'nite-tee'] as const,
  pairPrice: 1495,
  singlePrice: 795,
}

export const STATUS_LABEL: Record<Status, string> = {
  available: 'In stock',
  'back-in-stock': 'Back in stock',
  'limited-sold-out': 'Sold out: annual drop',
  'preorder-closed': 'Pre-order closed',
}

export function isOrderable(p: Product) {
  return p.status === 'available' || p.status === 'back-in-stock'
}

export const products: Product[] = [
  {
    slug: 'tuff-as-nailz-hoodie',
    name: 'TUFF AS NAILZ hoodie',
    category: 'hoodie',
    price: 1795,
    status: 'available',
    sizeSet: 'hoodie',
    photos: ['hoodie-back', 'hoodie-chest', 'hoodie-hood', 'hoodie-sleeve'],
    bullets: ['Color: Smoke', 'Boxy, cropped fit', 'Sticker pack included'],
    featured: true,
  },
  {
    slug: 'prodigal-son-tee',
    name: 'Prodigal Son tee',
    category: 'tee',
    price: 795,
    status: 'available',
    sizeSet: 'tee',
    photos: ['prodigal-black-front-glow', 'prodigal-black-back-glow', 'prodigal-black-front', 'prodigal-black-back'],
    colors: [
      {
        name: 'Black',
        photos: ['prodigal-black-front-glow', 'prodigal-black-back-glow', 'prodigal-black-front', 'prodigal-black-back'],
      },
      { name: 'White', photos: ['prodigal-white-front', 'prodigal-white-back'] },
    ],
    bullets: ['Heavyweight boxy tee', 'Black and White'],
    featured: true,
  },
  {
    slug: 'portal-hat',
    name: 'PORTAL hat',
    category: 'hat',
    price: 1111,
    status: 'available',
    sizeSet: 'one',
    photos: ['portal-hat-front', 'portal-hat-reflective'],
    bullets: ['Unstructured 6 panel', 'Snapback, OSFA', 'Lightweight', 'Reflective print'],
    featured: true,
  },
  {
    slug: 'windmill-tee',
    name: 'WINDMILL tee',
    category: 'tee',
    price: 795,
    status: 'available',
    sizeSet: 'tee',
    photos: ['windmill-tee-front'],
    bullets: ['New heavyweight boxy tee'],
  },
  {
    slug: 'black-widow-tee',
    name: 'BLACK WIDOW tee',
    category: 'tee',
    price: 795,
    status: 'back-in-stock',
    sizeSet: 'tee',
    photos: ['blackwidow-tee-front', 'blackwidow-tee-back', 'blackwidow-tee-flatlay'],
    bullets: ['Barbed-wire heart front', 'Red PRAY FOR US back print'],
  },
  {
    slug: 'thorns-tee',
    name: 'THORNS tee',
    category: 'tee',
    price: 795,
    status: 'available',
    sizeSet: 'tee',
    photos: ['thorns-tee-front', 'thorns-tee-back'],
    bullets: ['Oval crown-of-thorns print', 'Small oval at the back neck'],
  },
  {
    slug: 'layeth-tee',
    name: 'LAYETH tee',
    category: 'tee',
    price: 795,
    status: 'available',
    sizeSet: 'tee',
    photos: ['layeth-tee-front', 'layeth-tee-back'],
    bullets: ['Cotton blend', 'Boxy', 'Worn print'],
  },
  {
    slug: 'monday-tee',
    name: 'MONDAY tee',
    category: 'tee',
    price: 795,
    status: 'available',
    sizeSet: 'tee',
    photos: ['monday-tee-front', 'monday-tee-back'],
    bullets: ['Cotton blend', 'Boxy', 'Worn print'],
  },
  {
    slug: 'praystation-tee',
    name: 'PRAYSTATION tee',
    category: 'tee',
    price: 795,
    status: 'available',
    sizeSet: 'tee',
    photos: ['praystation-tee-front', 'praystation-tee-back'],
    bullets: ['PFU front, console-logo back'],
  },
  {
    slug: 'nite-tee',
    name: 'NITE tee (Navy Blue)',
    category: 'tee',
    price: 795,
    status: 'back-in-stock',
    sizeSet: 'tee',
    photos: ['nite-tee-front', 'nite-tee-back'],
    bullets: ['Navy blue', 'Do you believe in divine intervention? back print'],
    bundleWith: 'day-tee',
  },
  {
    slug: 'day-tee',
    name: 'DAY tee (White)',
    category: 'tee',
    price: 795,
    status: 'available',
    sizeSet: 'tee',
    photos: [],
    bullets: ['White', 'Orange PRAY for US front print'],
    note: 'Photos coming soon.',
    bundleWith: 'nite-tee',
  },
  {
    slug: 'raplines-numero-uno-tee',
    name: 'Pray For Us x Raplines "NUMERO UNO" tee',
    category: 'tee',
    price: 795,
    status: 'preorder-closed',
    sizeSet: 'tee',
    photos: ['raplines-tee-front', 'raplines-tee-back'],
    bullets: ['Collab with Raplines Battle League'],
    note: 'Pre-order closed. Message us about leftovers.',
  },
  {
    slug: '444-tee',
    name: '444 tee',
    category: 'tee',
    price: 444,
    status: 'limited-sold-out',
    sizeSet: 'tee',
    photos: ['444-tee-front', '444-tee-back', '444-tee-flatlay'],
    bullets: ['Once a year only. No restocks.'],
    note: 'Sold once a year. Follow us for the next 444 drop.',
  },
  {
    slug: 'goodwill-hat',
    name: 'GOOD WILL hat',
    category: 'hat',
    price: 999,
    status: 'back-in-stock',
    sizeSet: 'one',
    photos: ['goodwill-hat-front', 'goodwill-hat-alt', 'goodwill-hat-back'],
    bullets: ['Camo', 'Embroidered thorn oval patch'],
  },
  {
    slug: 'isaiah-hat',
    name: 'ISAIAH hat',
    category: 'hat',
    price: 999,
    status: 'back-in-stock',
    sizeSet: 'one',
    photos: ['isaiah-hat-front', 'isaiah-hat-alt', 'isaiah-hat-back', 'isaiah-hat-pile'],
    bullets: ['Washed grey', 'Embroidered thorn oval patch'],
  },
  {
    slug: 'paris-hat',
    name: 'Paris hat',
    category: 'hat',
    price: 999,
    status: 'back-in-stock',
    sizeSet: 'one',
    photos: ['paris-hat-front', 'paris-hat-back'],
    bullets: ['Pink camo', 'Red thorn oval patch'],
  },
  {
    slug: 'fmj-hat',
    name: 'FMJ hat',
    category: 'hat',
    price: 999,
    status: 'back-in-stock',
    sizeSet: 'one',
    photos: ['fmj-hat-front'],
    bullets: ['Tan and olive camo', 'Embroidered thorn oval patch'],
  },
  {
    slug: 'larry-hat',
    name: 'LARRY hat',
    category: 'hat',
    price: 777,
    status: 'available',
    sizeSet: 'one',
    photos: ['larry-hat-front'],
    bullets: ['Trucker cap', '"Eternally Connected" patch'],
  },
  {
    slug: 'ambrose-keychain',
    name: 'AMBROSE keychain',
    category: 'accessory',
    price: 245,
    status: 'available',
    sizeSet: 'one',
    photos: ['ambrose-keychain'],
    bullets: ['Barbed-wire doves'],
  },
  {
    slug: 'year-one-stickers',
    name: 'YEAR ONE sticker pack',
    category: 'accessory',
    price: 135,
    status: 'available',
    sizeSet: 'one',
    photos: ['yearone-stickers', 'yearone-stickers-pile'],
    bullets: ['9 stickers', 'Weatherproof', 'Matte finish'],
  },
  {
    slug: 'thorns-stickers',
    name: 'THORNS sticker pack',
    category: 'accessory',
    price: 135,
    status: 'available',
    sizeSet: 'one',
    photos: ['thorns-stickers'],
    bullets: ['12 waterproof stickers', '3"x1.5"', 'Matte finish'],
  },
]

export const categories: { key: Category | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'tee', label: 'Tees' },
  { key: 'hoodie', label: 'Hoodie' },
  { key: 'hat', label: 'Hats' },
  { key: 'accessory', label: 'Extras' },
]

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

export const img = (name: string, size: 'sm' | 'lg' = 'sm') => `/img/${name}-${size}.webp`

export const peso = (n: number) => `₱${n.toLocaleString('en-PH')}`

export const LINKS = {
  messenger: 'https://m.me/61576716543998',
  facebook: 'https://www.facebook.com/profile.php?id=61576716543998',
  instagram: 'https://www.instagram.com/prayforusprayforus/',
  igHandle: '@prayforusprayforus',
}
