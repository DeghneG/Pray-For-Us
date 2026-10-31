import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

const KEY = 'pfu-motion-paused'

interface MotionValue {
  paused: boolean
  /** Always-current copy of `paused` for use inside animation callbacks. */
  pausedRef: React.MutableRefObject<boolean>
  toggle: () => void
  /** Speed multiplier: gentler for people who asked their system to reduce motion. */
  factor: number
}

const MotionContext = createContext<MotionValue | null>(null)

export function MotionProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(() => {
    try {
      return localStorage.getItem(KEY) === '1'
    } catch {
      return false
    }
  })
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  const factor = useMemo(() => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.5 : 1
    } catch {
      return 1
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(KEY, paused ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [paused])

  const value = useMemo<MotionValue>(() => ({ paused, pausedRef, toggle: () => setPaused((p) => !p), factor }), [paused, factor])
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

export function useMotion() {
  const ctx = useContext(MotionContext)
  if (!ctx) throw new Error('useMotion must be used inside MotionProvider')
  return ctx
}
