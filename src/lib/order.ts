import { BUNDLE, LINKS, peso } from '../data/products'
import type { BagItem, Totals } from './bag'

export interface Customer {
  name: string
  phone: string
  handle: string
  address: string
  notes: string
}

export interface SavedOrder {
  orderNo: string
  createdAt: string
  status: 'new' | 'confirmed' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  customer: Customer
  items: BagItem[]
  subtotal: number
  message: string
}

const ORDERS_KEY = 'pfu-orders'
const COUNTER_KEY = 'pfu-order-counter'

export function buildMessage(totals: Totals, orderNo?: string, customer?: Customer) {
  const lines = totals.lines.map((l) => {
    const detail = [l.item.color, l.item.size].filter(Boolean).join(' / ')
    return `${l.item.qty}x ${l.name}${detail ? ` - ${detail}` : ''} - ${peso(l.total)}`
  })
  if (totals.pairs > 0) lines.push(`${BUNDLE.name} set discount (${totals.pairs}x): -${peso(totals.discount)}`)
  const parts = [
    `Hi Pray For Us!${orderNo ? ` Order ${orderNo}.` : ''} I'd like to order:`,
    ...lines,
    `Subtotal: ${peso(totals.subtotal)} + shipping fee`,
  ]
  if (customer) {
    parts.push('', `Name: ${customer.name}`, `Phone: ${customer.phone}`)
    if (customer.handle) parts.push(`Messenger/IG: ${customer.handle}`)
    if (customer.address) parts.push(`Address: ${customer.address}`)
    if (customer.notes) parts.push(`Notes: ${customer.notes}`)
  } else {
    parts.push('', "Name / address / contact: (I'll send here)")
  }
  return parts.join('\n')
}

export function loadOrders(): SavedOrder[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) ?? '[]') as SavedOrder[]
  } catch {
    return []
  }
}

export function saveOrder(
  partial: Omit<SavedOrder, 'orderNo' | 'createdAt' | 'status' | 'message'>,
  makeMessage: (orderNo: string) => string,
): SavedOrder {
  let n = 1
  try {
    n = Number(localStorage.getItem(COUNTER_KEY) ?? '0') + 1
    localStorage.setItem(COUNTER_KEY, String(n))
  } catch {
    /* ignore */
  }
  const orderNo = `PFU-${String(n).padStart(6, '0')}`
  const order: SavedOrder = {
    ...partial,
    orderNo,
    message: makeMessage(orderNo),
    createdAt: new Date().toISOString(),
    status: 'new',
  }
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...loadOrders()]))
  } catch {
    /* ignore */
  }
  return order
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function openMessenger() {
  window.open(LINKS.messenger, '_blank', 'noopener')
}
