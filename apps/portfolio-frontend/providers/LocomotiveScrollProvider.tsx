"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type LocomotiveScroll from "locomotive-scroll"
import "locomotive-scroll/locomotive-scroll.css"

interface LocomotiveScrollContextType {
  scroll: LocomotiveScroll | null
  isReady: boolean
}

const LocomotiveScrollContext = createContext<LocomotiveScrollContextType>({
  scroll: null,
  isReady: false,
})

export const useLocomotiveScroll = () => useContext(LocomotiveScrollContext)

/**
 * Locomotive Scroll v5 (built on Lenis).
 *
 * Unlike v4, this keeps NATIVE scrolling — so `position: sticky` (ScrollStack),
 * framer-motion's `useScroll`, and `window.scrollY` listeners all keep working.
 * It only smooths the wheel/scroll into a liquid lerp, and enables the
 * `data-scroll` / `data-scroll-speed` parallax attributes site-wide.
 */
export const LocomotiveScrollProvider = ({ children }: { children: ReactNode }) => {
  const [scroll, setScroll] = useState<LocomotiveScroll | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let instance: LocomotiveScroll | null = null
    let cancelled = false

    // Dynamic import keeps the library strictly client-side.
    import("locomotive-scroll").then(({ default: LocomotiveScrollV5 }) => {
      if (cancelled) return
      instance = new LocomotiveScrollV5({
        lenisOptions: {
          lerp: 0.08, // lower = more liquid drift (0.1 is default)
          smoothWheel: true,
          wheelMultiplier: 1,
        },
      })
      setScroll(instance)
      setIsReady(true)
    })

    return () => {
      cancelled = true
      instance?.destroy()
      setScroll(null)
      setIsReady(false)
    }
  }, [])

  return (
    <LocomotiveScrollContext.Provider value={{ scroll, isReady }}>
      {children}
    </LocomotiveScrollContext.Provider>
  )
}
