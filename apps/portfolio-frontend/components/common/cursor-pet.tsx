"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion"

// ---------------------------------------------------------------------------
// Site-wide cursor pet — a little green code-bug that chases the mouse
// everywhere, and announces each section (elements tagged with
// data-pet-section="name") as it becomes the current one on screen.
// ---------------------------------------------------------------------------

const IDLE_QUIPS = [
  "// hi there!",
  "debugging…",
  "npm run chase",
  "</>",
  "0 bugs found ✓",
  "git push --force?!",
  "while(true) { follow() }",
]

// How long an announcement bubble stays up
const ANNOUNCE_MS = 2600

// What the pet wears in each section/page (elements tagged data-pet-section)
type PetVariant = "classic" | "glasses" | "hardhat" | "gradcap" | "tool" | "pencil" | "mail"

const SECTION_VARIANTS: Record<string, PetVariant> = {
  home: "classic",
  "about-me": "glasses",
  about: "glasses",
  experience: "hardhat",
  skills: "gradcap",
  projects: "tool",
  blogs: "pencil",
  contact: "mail",
}

export default function CursorPet() {
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)
  const [bubble, setBubble] = useState<{ text: string; id: number } | null>(null)
  const [variant, setVariant] = useState<PetVariant>("classic")

  const activeRef = useRef(false)
  const lastSectionRef = useRef<string | null>(null)
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bubbleUntil = useRef(0)
  const bubbleId = useRef(0)

  const mx = useMotionValue(-80)
  const my = useMotionValue(-80)
  // Loose spring = the pet lags behind and "chases" the cursor
  const x = useSpring(mx, { stiffness: 110, damping: 13, mass: 0.7 })
  const y = useSpring(my, { stiffness: 110, damping: 13, mass: 0.7 })
  const vx = useVelocity(x)
  const rotate = useTransform(vx, [-1600, 1600], [-20, 20])
  const scaleX = useTransform(vx, (v) => 1 + Math.min(Math.abs(v) / 5000, 0.18))
  const pupilX = useTransform(vx, [-900, 900], [-2.5, 2.5])

  const showBubble = (text: string) => {
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
    setBubble({ text, id: ++bubbleId.current })
    bubbleUntil.current = Date.now() + ANNOUNCE_MS
    bubbleTimer.current = setTimeout(() => setBubble(null), ANNOUNCE_MS)
  }

  // --- cursor tracking -----------------------------------------------------
  useEffect(() => {
    // A mouse-driven pet only makes sense with a real pointer
    if (!window.matchMedia("(pointer: fine)").matches) return
    setEnabled(true)

    const onMove = (e: MouseEvent) => {
      // Fixed positioning → viewport coordinates, trailing below-right of the cursor
      mx.set(e.clientX + 22)
      my.set(e.clientY + 26)
      if (!activeRef.current) {
        activeRef.current = true
        setActive(true)
      }
    }
    const onLeave = () => {
      activeRef.current = false
      setActive(false)
    }

    window.addEventListener("mousemove", onMove)
    document.documentElement.addEventListener("mouseleave", onLeave)
    return () => {
      window.removeEventListener("mousemove", onMove)
      document.documentElement.removeEventListener("mouseleave", onLeave)
    }
  }, [mx, my])

  // --- section announcements ----------------------------------------------
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return

    // Which tagged sections currently cross the middle band of the viewport.
    // With sticky/stacked layouts several can intersect at once — the CURRENT
    // one is the last of them in DOM order (the one visually on top).
    const intersecting = new Set<Element>()
    const observed = new Set<Element>()

    const announceCurrent = () => {
      const all = Array.from(document.querySelectorAll("[data-pet-section]"))
      const current = all.filter((el) => intersecting.has(el)).pop()
      const name = current instanceof HTMLElement ? current.dataset.petSection : undefined
      if (name && name !== lastSectionRef.current) {
        lastSectionRef.current = name
        setVariant(SECTION_VARIANTS[name] ?? "classic")
        if (activeRef.current) showBubble(`📂 cd ./${name}`)
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target)
          else intersecting.delete(entry.target)
        }
        announceCurrent()
      },
      // "Middle band" of the viewport — a section is current while it crosses it
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    )

    const scan = () => {
      document.querySelectorAll("[data-pet-section]").forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el)
          io.observe(el)
        }
      })
    }
    scan()

    // Sections appear after client-side fetches and route changes — keep watching
    const mo = new MutationObserver(() => requestAnimationFrame(scan))
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  // --- occasional idle chatter ---------------------------------------------
  useEffect(() => {
    if (!active) return
    const interval = setInterval(() => {
      // Don't talk over a section announcement (or another quip) still on screen
      if (Date.now() > bubbleUntil.current) {
        showBubble(IDLE_QUIPS[Math.floor(Math.random() * IDLE_QUIPS.length)] ?? "</>")
      }
    }, 9000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  if (!enabled) return null

  return (
    <motion.div
      style={{ x, y, rotate, scaleX }}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.4 }}
      transition={{ duration: 0.25 }}
      className="pointer-events-none fixed left-0 top-0 z-[80]"
      aria-hidden="true"
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {bubble && (
          <motion.div
            key={bubble.id}
            initial={{ opacity: 0, y: 6, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.8 }}
            className="absolute -top-9 left-6 whitespace-nowrap rounded-md border border-green-500/40 bg-black/90 px-2 py-1 font-mono text-[11px] text-green-300 shadow-[0_0_12px_rgba(34,197,94,0.25)]"
          >
            {bubble.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle bob lives on an inner element so it doesn't fight the spring position.
          Re-keying by variant restarts it with a pop when the pet changes outfit. */}
      <motion.div
        key={variant}
        initial={{ scale: 0.6, y: -8 }}
        animate={{ scale: 1, y: [0, -4, 0] }}
        transition={{
          scale: { type: "spring", stiffness: 300, damping: 14 },
          y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <svg
          width="46"
          height="46"
          viewBox="0 0 46 46"
          fill="none"
          className="drop-shadow-[0_0_14px_rgba(34,197,94,0.45)]"
        >
          <defs>
            <radialGradient id="petBody" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#15803d" />
            </radialGradient>
          </defs>

          {/* Antenna */}
          <line x1="23" y1="10" x2="23" y2="4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
          <motion.circle
            cx="23"
            cy="3.5"
            r="2.5"
            fill="#4ade80"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />

          {/* Feet */}
          <circle cx="15" cy="42" r="3" fill="#166534" />
          <circle cx="31" cy="42" r="3" fill="#166534" />

          {/* Body */}
          <ellipse cx="23" cy="26" rx="16" ry="15" fill="url(#petBody)" />
          <ellipse cx="23" cy="26" rx="16" ry="15" stroke="#22c55e" strokeOpacity="0.6" />

          {/* Eyes (group blinks on a timer) */}
          <motion.g
            className="origin-center [transform-box:fill-box]"
            animate={{ scaleY: [1, 0.08, 1] }}
            transition={{ duration: 0.22, repeat: Infinity, repeatDelay: 3.4, times: [0, 0.5, 1] }}
          >
            <circle cx="17" cy="23" r="4.5" fill="#fff" />
            <circle cx="29" cy="23" r="4.5" fill="#fff" />
            {/* Pupils glance in the direction of travel */}
            <motion.circle style={{ x: pupilX }} cx="17" cy="23.5" r="2.2" fill="#0a0a0a" />
            <motion.circle style={{ x: pupilX }} cx="29" cy="23.5" r="2.2" fill="#0a0a0a" />
          </motion.g>

          {/* Smile + coder belly */}
          <path d="M19 31 Q23 34 27 31" stroke="#0a0a0a" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <text x="23" y="39" textAnchor="middle" fontSize="5.5" fontFamily="monospace" fill="#052e16" fontWeight="bold">
            {"</>"}
          </text>

          {/* --- Section outfits ------------------------------------------- */}
          {variant === "glasses" && (
            <g>
              <circle cx="17" cy="23" r="6" fill="none" stroke="#e5e7eb" strokeWidth="1.4" />
              <circle cx="29" cy="23" r="6" fill="none" stroke="#e5e7eb" strokeWidth="1.4" />
              <line x1="23" y1="23" x2="23" y2="23" stroke="#e5e7eb" strokeWidth="1.4" />
              <path d="M11 22 L8 20 M35 22 L38 20" stroke="#e5e7eb" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M22 23 h2" stroke="#e5e7eb" strokeWidth="1.4" />
            </g>
          )}
          {variant === "hardhat" && (
            <g>
              <path d="M12 15 Q23 3 34 15 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
              <rect x="9" y="14" width="28" height="3" rx="1.5" fill="#f59e0b" />
              <rect x="21" y="6" width="4" height="6" rx="1" fill="#fde68a" />
            </g>
          )}
          {variant === "gradcap" && (
            <g>
              <polygon points="23,3 36,9 23,15 10,9" fill="#1f2937" stroke="#4b5563" strokeWidth="0.8" />
              <rect x="18" y="11" width="10" height="3.5" rx="1" fill="#111827" />
              <path d="M23 9 L33 13 L33 18" stroke="#facc15" strokeWidth="1.2" fill="none" />
              <circle cx="33" cy="19" r="1.6" fill="#facc15" />
            </g>
          )}
          {variant === "tool" && (
            <text x="40" y="33" textAnchor="middle" fontSize="11" transform="rotate(15 40 33)">
              🛠️
            </text>
          )}
          {variant === "pencil" && (
            <text x="40" y="33" textAnchor="middle" fontSize="11" transform="rotate(20 40 33)">
              ✏️
            </text>
          )}
          {variant === "mail" && (
            <text x="40" y="33" textAnchor="middle" fontSize="11" transform="rotate(-10 40 33)">
              📬
            </text>
          )}
        </svg>
      </motion.div>
    </motion.div>
  )
}
