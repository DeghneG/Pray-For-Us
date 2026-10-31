import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import { BUNDLE, getProduct, peso } from '../data/products'

export interface BagItem {
  key: string
  slug: string
  size: string
  color?: string
  qty: number
}

type Action =
  | { type: 'add'; item: Omit<BagItem, 'key' | 'qty'>; qty?: number }
  | { type: 'setQty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }

const STORAGE_KEY = 'pfu-bag'

const makeKey = (i: Omit<BagItem, 'key' | 'qty'>) => [i.slug, i.size, i.color ?? ''].join('|')

function reducer(state: BagItem[], action: Action): BagItem[] {
  switch (action.type) {
    case 'add': {
      const key = makeKey(action.item)
      const qty = action.qty ?? 1
      const found = state.find((i) => i.key === key)
      if (found) return state.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + qty, 20) } : i))
      return [...state, { ...action.item, key, qty }]
    }
    case 'setQty':
      return state
        .map((i) => (i.key === action.key ? { ...i, qty: Math.max(0, Math.min(action.qty, 20)) } : i))
        .filter((i) => i.qty > 0)
    case 'remove':
      return state.filter((i) => i.key !== action.key)
    case 'clear':
      return []
  }
}

function load(): BagItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as BagItem[]
    return parsed.filter((i) => getProduct(i.slug))
  } catch {
    return []
  }
}

export interface Totals {
  lines: { item: BagItem; name: string; unit: number; total: number }[]
  discount: number
  pairs: number
  subtotal: number
  count: number
}

export function computeTotals(items: BagItem[]): Totals {
  const lines = items.map((item) => {
    const p = getProduct(item.slug)!
    return { item, name: p.name, unit: p.price, total: p.price * item.qty }
  })
  const dayQty = items.filter((i) => i.slug === BUNDLE.slugs[0]).reduce((n, i) => n + i.qty, 0)
  const niteQty = items.filter((i) => i.slug === BUNDLE.slugs[1]).reduce((n, i) => n + i.qty, 0)
  const pairs = Math.min(dayQty, niteQty)
  const discount = pairs * (BUNDLE.singlePrice * 2 - BUNDLE.pairPrice)
  const gross = lines.reduce((n, l) => n + l.total, 0)
  return {
    lines,
    discount,
    pairs,
    subtotal: gross - discount,
    count: items.reduce((n, i) => n + i.qty, 0),
  }
}

interface BagContextValue {
  items: BagItem[]
  totals: Totals
  open: boolean
  setOpen: (v: boolean) => void
  add: (item: Omit<BagItem, 'key' | 'qty'>, qty?: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
}

const BagContext = createContext<BagContextValue | null>(null)

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, undefined, load)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* storage can be unavailable in private windows; the bag still works for the session */
    }
  }, [items])

  const value = useMemo<BagContextValue>(
    () => ({
      items,
      totals: computeTotals(items),
      open,
      setOpen,
      add: (item, qty) => {
        dispatch({ type: 'add', item, qty })
        setOpen(true)
      },
      setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
    }),
    [items, open],
  )

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>
}

export function useBag() {
  const ctx = useContext(BagContext)
  if (!ctx) throw new Error('useBag must be used inside BagProvider')
  return ctx
}

export { peso }
