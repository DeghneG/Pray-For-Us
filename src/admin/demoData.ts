// Sample figures so the dashboard has something to show. None of this is real sales data.
import type { SavedOrder } from '../lib/order'

export const SAMPLE_ORDERS: SavedOrder[] = [
  {
    orderNo: 'DEMO-006',
    createdAt: '2026-10-31T02:10:00.000Z',
    status: 'new',
    customer: { name: 'Sample Customer', phone: '09XX XXX 0006', handle: 'sample.f', address: 'Makati City', notes: 'Gift wrap if possible' },
    items: [],
    subtotal: 1495,
    message: 'DAY N NITE set (DAY M, NITE M)',
  },
  {
    orderNo: 'DEMO-005',
    createdAt: '2026-10-30T11:42:00.000Z',
    status: 'confirmed',
    customer: { name: 'Sample Customer', phone: '09XX XXX 0005', handle: 'sample.e', address: 'Pasig City', notes: '' },
    items: [],
    subtotal: 1795,
    message: 'TUFF AS NAILZ hoodie, size L',
  },
  {
    orderNo: 'DEMO-004',
    createdAt: '2026-10-30T05:20:00.000Z',
    status: 'new',
    customer: { name: 'Sample Customer', phone: '09XX XXX 0004', handle: 'sample.d', address: 'Cebu City', notes: '' },
    items: [],
    subtotal: 999,
    message: 'GOOD WILL hat',
  },
  {
    orderNo: 'DEMO-003',
    createdAt: '2026-10-29T14:20:00.000Z',
    status: 'shipped',
    customer: { name: 'Sample Customer', phone: '09XX XXX 0003', handle: 'sample.c', address: 'Quezon City', notes: '' },
    items: [],
    subtotal: 2590,
    message: 'WINDMILL tee L + TUFF AS NAILZ hoodie M',
  },
  {
    orderNo: 'DEMO-002',
    createdAt: '2026-10-28T09:05:00.000Z',
    status: 'paid',
    customer: { name: 'Sample Customer', phone: '09XX XXX 0002', handle: 'sample.b', address: 'Davao City', notes: '' },
    items: [],
    subtotal: 1495,
    message: 'DAY N NITE set',
  },
  {
    orderNo: 'DEMO-001',
    createdAt: '2026-10-27T18:40:00.000Z',
    status: 'delivered',
    customer: { name: 'Sample Customer', phone: '09XX XXX 0001', handle: 'sample.a', address: 'Parañaque City', notes: 'Call before delivery' },
    items: [],
    subtotal: 795,
    message: 'Prodigal Son tee (Black) XL',
  },
]

/** Units sold this month, by product slug. Demo figures. */
export const SAMPLE_UNITS: Record<string, number> = {
  'prodigal-son-tee': 18,
  'windmill-tee': 14,
  'tuff-as-nailz-hoodie': 9,
  'black-widow-tee': 8,
  'goodwill-hat': 7,
  'year-one-stickers': 6,
  'thorns-tee': 5,
}

/** Orders per day over the last 7 days. Demo figures. */
export const SAMPLE_WEEK = [
  { day: 'Sat', orders: 2 },
  { day: 'Sun', orders: 5 },
  { day: 'Mon', orders: 3 },
  { day: 'Tue', orders: 6 },
  { day: 'Wed', orders: 4 },
  { day: 'Thu', orders: 8 },
  { day: 'Fri', orders: 5 },
]

/** Where messages about orders come from. Demo figures. */
export const SAMPLE_SOURCES = [
  { name: 'Facebook page', share: 58 },
  { name: 'Instagram', share: 24 },
  { name: 'Website', share: 18 },
]
