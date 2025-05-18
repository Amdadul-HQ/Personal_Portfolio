"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import LocomotiveScroll from "locomotive-scroll"
import "locomotive-scroll/dist/locomotive-scroll.css"

interface LocomotiveScrollContextType {
  scroll: LocomotiveScroll | null
  isReady: boolean
}

const LocomotiveScrollContext = createContext<LocomotiveScrollContextType>({
  scroll: null,
  isReady: false,
})

export const useLocomotiveScroll = () => useContext(LocomotiveScrollContext)

interface LocomotiveScrollProviderProps {
  children: ReactNode
  options?: any
}

export const LocomotiveScrollProvider = ({ children, options = {} }: LocomotiveScrollProviderProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scroll, setScroll] = useState<LocomotiveScroll | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize locomotive-scroll
    const locomotiveScroll = new LocomotiveScroll({
      el: containerRef.current,
      smooth: true,
      smartphone: {
        smooth: true,
      },
      tablet: {
        smooth: true,
      },
      ...options,
    })

    // Set the scroll instance
    setScroll(locomotiveScroll)
    setIsReady(true)

    // Update scroll on page resize
    const handleResize = () => {
      locomotiveScroll.update()
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      locomotiveScroll.destroy()
      setScroll(null)
      setIsReady(false)
    }
  }, [options])

  return (
    <LocomotiveScrollContext.Provider value={{ scroll, isReady }}>
      <div data-scroll-container ref={containerRef}>
        {children}
      </div>
    </LocomotiveScrollContext.Provider>
  )
}
