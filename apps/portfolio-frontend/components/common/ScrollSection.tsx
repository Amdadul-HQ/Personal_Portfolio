"use client"

import { useLocomotiveScroll } from "@/providers/LocomotiveScrollProvider"
import { useRef, type ReactNode } from "react"

interface ScrollSectionProps {
  children: ReactNode
  id?: string
  className?: string
  speed?: number
  direction?: "horizontal" | "vertical"
  sticky?: boolean
}

export const ScrollSection = ({
  children,
  id,
  className = "",
  speed = 1,
  direction = "vertical",
  sticky = false,
}: ScrollSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scroll } = useLocomotiveScroll()

  // You can add additional functionality here if needed
  // For example, triggering animations when a section comes into view

  return (
    <section
      id={id}
      ref={sectionRef}
      className={className}
      data-scroll
      data-scroll-speed={speed}
      data-scroll-direction={direction}
      data-scroll-sticky={sticky ? true : undefined}
    >
      {children}
    </section>
  )
}
