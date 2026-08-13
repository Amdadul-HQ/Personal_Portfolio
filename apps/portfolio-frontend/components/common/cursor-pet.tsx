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
// Site-wide cursor pet — a little green code-cat that chases the mouse
// everywhere, and announces each section (elements tagged with
// data-pet-section="name") as it becomes the current one on screen.
// ---------------------------------------------------------------------------

const IDLE_QUIPS = [
  "// meow there!",
  "debugging…",
  "npm run chase",
  "purr(); // 9 lives",
  "0 bugs found ✓",
  "git push --paws?!",
  "while(true) { follow() }",
  "sudo pet me",
  "catch (mouse) {}",
]

// How long an announcement bubble stays up
const ANNOUNCE_MS = 2600

// ---------------------------------------------------------------------------
// Voice intro — 5s after the pet first appears it introduces Amdadul out loud
// (Web Speech API, prettiest voice available) and pops up a profile card.
// ---------------------------------------------------------------------------

const INTRO_DELAY_MS = 5000
// If speech never plays (unsupported / autoplay-blocked) the card still shows this long
const INTRO_FALLBACK_MS = 16000
// Absolute watchdog once speech HAS started — if the browser loses the utterance
// without firing onend/onerror, the card must still close eventually
const INTRO_MAX_MS = 45000
const INTRO_CARD_W = 264

const PROFILE = {
  name: "Amdadul Haque Bhuiyan",
  role: "Software Engineer @ Digital Pylot",
  base: "Dhaka, Bangladesh",
  exp: "3+ yrs · Node.js · Next.js · TypeScript",
  now: "Building LeadPylot — multi-tenant CRM SaaS",
  mail: "amdadulhq.dev@gmail.com",
  status: "Available for work",
}

const INTRO_SPEECH =
  "Meow! I'm Amdadul's code cat. Meet Amdadul Haque Bhuiyan — a full-stack software engineer from Dhaka, Bangladesh, with three plus years in Node and Next J S. He's currently building Lead Pylot at Digital Pylot — and yes, he's available for work!"

// Ranked wishlist of known-pleasant voices, then any female English voice,
// then any English voice at all.
const VOICE_WISHLIST = [
  "microsoft aria",
  "microsoft jenny",
  "microsoft sonia",
  "microsoft libby",
  "samantha",
  "google uk english female",
  "google us english",
  "karen",
  "moira",
  "tessa",
  "microsoft zira",
  "victoria",
]

function pickPrettyVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"))
  for (const wish of VOICE_WISHLIST) {
    const match = english.find((v) => v.name.toLowerCase().includes(wish))
    if (match) return match
  }
  return english.find((v) => /female|woman/i.test(v.name)) ?? english[0] ?? voices[0]
}

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
  const [intro, setIntro] = useState<{ below: boolean } | null>(null)
  const [speaking, setSpeaking] = useState(false)

  const activeRef = useRef(false)
  const lastSectionRef = useRef<string | null>(null)
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bubbleUntil = useRef(0)
  const bubbleId = useRef(0)
  const introOpenRef = useRef(false)
  const introDoneRef = useRef(false)
  const introTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const keepAlive = useRef<ReturnType<typeof setInterval> | null>(null)
  const retryRef = useRef<(() => void) | null>(null)
  const voicesListenerRef = useRef<(() => void) | null>(null)

  const mx = useMotionValue(-80)
  const my = useMotionValue(-80)
  // Loose spring = the pet lags behind and "chases" the cursor
  const x = useSpring(mx, { stiffness: 110, damping: 13, mass: 0.7 })
  const y = useSpring(my, { stiffness: 110, damping: 13, mass: 0.7 })
  const vx = useVelocity(x)
  const rotate = useTransform(vx, [-1600, 1600], [-20, 20])
  const scaleX = useTransform(vx, (v) => 1 + Math.min(Math.abs(v) / 5000, 0.18))
  const pupilX = useTransform(vx, [-900, 900], [-2.5, 2.5])
  // Shift the profile card left when the pet is near the right viewport edge
  const cardShift = useTransform(x, (v) => {
    if (typeof window === "undefined") return 0
    return Math.min(0, window.innerWidth - 16 - INTRO_CARD_W - (v + 24))
  })

  const showBubble = (text: string) => {
    // The profile card has the floor — no quips while it's open
    if (introOpenRef.current) return
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
    setBubble({ text, id: ++bubbleId.current })
    bubbleUntil.current = Date.now() + ANNOUNCE_MS
    bubbleTimer.current = setTimeout(() => setBubble(null), ANNOUNCE_MS)
  }

  // --- intro helpers -------------------------------------------------------
  const clearIntroTimers = () => {
    introTimers.current.forEach(clearTimeout)
    introTimers.current = []
    if (keepAlive.current) clearInterval(keepAlive.current)
    keepAlive.current = null
  }

  const detachRetry = () => {
    if (retryRef.current) {
      window.removeEventListener("pointerdown", retryRef.current)
      window.removeEventListener("keydown", retryRef.current)
      retryRef.current = null
    }
  }

  const detachVoices = () => {
    if (voicesListenerRef.current && "speechSynthesis" in window) {
      window.speechSynthesis.removeEventListener("voiceschanged", voicesListenerRef.current)
      voicesListenerRef.current = null
    }
  }

  const closeIntro = () => {
    if (!introOpenRef.current) return
    introOpenRef.current = false
    introDoneRef.current = true
    clearIntroTimers()
    detachRetry()
    detachVoices()
    if ("speechSynthesis" in window) window.speechSynthesis.cancel()
    setSpeaking(false)
    setIntro(null)
    // Small grace period before idle quips resume
    bubbleUntil.current = Date.now() + 2000
  }

  const speakIntro = () => {
    const synth = window.speechSynthesis

    const speakNow = () => {
      const utter = new SpeechSynthesisUtterance(INTRO_SPEECH)
      const voice = pickPrettyVoice(synth.getVoices())
      if (voice) utter.voice = voice
      utter.rate = 1
      utter.pitch = 1.06
      utter.volume = 0.9

      utter.onstart = () => {
        // Speech drives the card lifetime from here on — but keep an absolute
        // watchdog in case the browser drops the utterance without any event
        clearIntroTimers()
        detachRetry()
        setSpeaking(true)
        introTimers.current.push(setTimeout(closeIntro, INTRO_MAX_MS))
        // Chrome silently stops long remote utterances — a pause/resume nudge keeps
        // them alive. Chromium-only: on Firefox/WebKit that same nudge can kill speech.
        if (/chrome|chromium|edg\//i.test(navigator.userAgent)) {
          keepAlive.current = setInterval(() => {
            if (synth.speaking && !synth.paused) {
              synth.pause()
              synth.resume()
            }
          }, 10000)
        }
      }

      const finish = () => {
        setSpeaking(false)
        if (keepAlive.current) clearInterval(keepAlive.current)
        keepAlive.current = null
        introTimers.current.push(setTimeout(closeIntro, 1400))
      }
      utter.onend = finish
      utter.onerror = (e) => {
        // Autoplay policy: audio needs a user gesture — retry on the first one
        if (e.error === "not-allowed" && !retryRef.current) {
          const retry = () => {
            detachRetry()
            if (introOpenRef.current) speakNow()
          }
          retryRef.current = retry
          window.addEventListener("pointerdown", retry, { once: true })
          window.addEventListener("keydown", retry, { once: true })
          return
        }
        finish()
      }

      synth.cancel() // never queue behind a stale utterance
      synth.speak(utter)
    }

    // Voices load async in most browsers — wait briefly, then go with what we have
    if (synth.getVoices().length > 0) {
      speakNow()
    } else {
      let spoke = false
      const onVoices = () => {
        if (spoke) return
        spoke = true
        synth.removeEventListener("voiceschanged", onVoices)
        voicesListenerRef.current = null
        // The intro may have closed (or the component unmounted) while we waited
        if (introOpenRef.current) speakNow()
      }
      voicesListenerRef.current = onVoices
      synth.addEventListener("voiceschanged", onVoices)
      introTimers.current.push(setTimeout(onVoices, 1500))
    }
  }

  const openIntro = () => {
    if (introDoneRef.current || introOpenRef.current) return
    introOpenRef.current = true
    // Near the top edge the card opens below the pet instead of above
    setIntro({ below: y.get() < 300 })
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
    setBubble(null)
    introTimers.current.push(setTimeout(closeIntro, INTRO_FALLBACK_MS))
    if ("speechSynthesis" in window) speakIntro()
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
      // Drop sections that client-side navigation removed, or they leak forever
      observed.forEach((el) => {
        if (!el.isConnected) {
          io.unobserve(el)
          observed.delete(el)
          intersecting.delete(el)
        }
      })
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

  // --- one-time voice intro + profile card, 5s after the pet first appears --
  useEffect(() => {
    if (!active || introDoneRef.current) return
    const t = setTimeout(openIntro, INTRO_DELAY_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  // While the card is open, flip it above/below the pet as the cursor nears the
  // top or bottom of the viewport (with hysteresis so it doesn't flap)
  useEffect(() => {
    if (!intro) return
    return y.on("change", (v) => {
      if (!intro.below && v < 260) setIntro({ below: true })
      else if (intro.below && v > 340) setIntro({ below: false })
    })
  }, [intro, y])

  // Teardown: never leave timers, listeners, or a talking robot behind
  useEffect(
    () => () => {
      introOpenRef.current = false // makes any cancel-triggered callbacks no-ops
      clearIntroTimers()
      detachRetry()
      detachVoices()
      if ("speechSynthesis" in window) window.speechSynthesis.cancel()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  if (!enabled) return null

  return (
    <motion.div
      style={{ x, y }}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.4 }}
      transition={{ duration: 0.25 }}
      className="pointer-events-none fixed left-0 top-0 z-[80]"
      aria-hidden="true"
    >
      {/* Intro profile card */}
      <AnimatePresence>
        {intro && (
          <motion.div
            style={{ x: cardShift, width: INTRO_CARD_W }}
            initial={{ opacity: 0, y: intro.below ? -8 : 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: intro.below ? -6 : 6, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`absolute left-6 overflow-hidden rounded-lg border border-green-500/40 bg-[#0d1117]/95 font-mono shadow-[0_0_24px_rgba(34,197,94,0.35)] backdrop-blur ${
              intro.below ? "top-14" : "bottom-14"
            }`}
          >
            <div className="flex items-center gap-1.5 border-b border-[#30363d] bg-[#161b22] px-2.5 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
              <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
              <span className="h-2 w-2 rounded-full bg-[#28c840]" />
              <span className="ml-1 truncate text-[10px] text-gray-400">amdadul.profile</span>
              {speaking && (
                <motion.span
                  className="ml-auto text-[10px] text-green-400"
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                >
                  🔊 speaking…
                </motion.span>
              )}
            </div>
            <motion.div
              className="space-y-1 px-3 py-2.5 text-[11px] leading-relaxed"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.35, delayChildren: 0.3 } } }}
            >
              {(
                [
                  ["$", "cat ./amdadul.json", "text-gray-500"],
                  ["name", PROFILE.name],
                  ["role", PROFILE.role],
                  ["base", `📍 ${PROFILE.base}`],
                  ["exp", PROFILE.exp],
                  ["now", PROFILE.now],
                  ["mail", PROFILE.mail],
                  ["status", `🟢 ${PROFILE.status}`],
                ] as [string, string, string?][]
              ).map(([k, v, cls]) => (
                <motion.p
                  key={k}
                  variants={{ hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0 } }}
                  className={`truncate ${cls ?? "text-gray-300"}`}
                >
                  <span className="text-green-500">{k === "$" ? "$ " : `${k}: `}</span>
                  {v}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Velocity tilt/stretch lives here so the speech bubble and profile card
          above stay level while the pet itself leans into the chase. */}
      <motion.div style={{ rotate, scaleX }}>
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
          className="overflow-visible drop-shadow-[0_0_14px_rgba(34,197,94,0.45)]"
        >
          <defs>
            <radialGradient id="petBody" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#15803d" />
            </radialGradient>
          </defs>

          {/* Tail — tall S-curve that idles with a slow sway, pulsing tip */}
          <motion.g
            className="origin-bottom-left [transform-box:fill-box]"
            animate={{ rotate: [-5, 6, -5] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M32.5 41 C40 42 44.5 36 42 30 C40.2 25.5 42.5 22 45.5 21.5"
              stroke="#22c55e"
              strokeWidth="3.4"
              strokeLinecap="round"
              fill="none"
            />
            <motion.circle
              cx="45.5"
              cy="21.5"
              r="2"
              fill="#4ade80"
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          </motion.g>

          {/* Sitting body */}
          <path
            d="M13.2 44 C11.5 34 15.5 27 23 27 C30.5 27 34.5 34 32.8 44 Z"
            fill="url(#petBody)"
            stroke="#22c55e"
            strokeOpacity="0.55"
          />

          {/* Ears (drawn behind the head so their bases tuck under it) */}
          <path d="M14.2 13.4 L10.5 1.5 L22 7.6 Z" fill="#22c55e" stroke="#15803d" strokeWidth="0.6" />
          <path d="M15.8 11.8 L12.6 4.4 L20.4 8.6 Z" fill="#14532d" />
          <path d="M31.8 13.4 L35.5 1.5 L24 7.6 Z" fill="#22c55e" stroke="#15803d" strokeWidth="0.6" />
          <path d="M30.2 11.8 L33.4 4.4 L25.6 8.6 Z" fill="#14532d" />

          {/* Head + tabby "M" + muzzle patch */}
          <ellipse cx="23" cy="21" rx="13" ry="11.5" fill="url(#petBody)" stroke="#22c55e" strokeOpacity="0.6" />
          <path
            d="M18 12 L19.2 15 M23 10.5 L23 14 M28 12 L26.8 15"
            stroke="#15803d"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeOpacity="0.75"
            fill="none"
          />
          <ellipse cx="23" cy="27.5" rx="6.2" ry="4" fill="#bbf7d0" fillOpacity="0.35" />

          {/* Whiskers */}
          <path
            d="M16.5 25.6 L7.6 23.4 M16.6 27.4 L7.8 29.2"
            stroke="#bbf7d0"
            strokeOpacity="0.85"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <path
            d="M29.5 25.6 L38.4 23.4 M29.4 27.4 L38.2 29.2"
            stroke="#bbf7d0"
            strokeOpacity="0.85"
            strokeWidth="0.9"
            strokeLinecap="round"
          />

          {/* Eyes (group blinks on a timer) */}
          <motion.g
            className="origin-center [transform-box:fill-box]"
            animate={{ scaleY: [1, 0.08, 1] }}
            transition={{ duration: 0.22, repeat: Infinity, repeatDelay: 3.4, times: [0, 0.5, 1] }}
          >
            <ellipse cx="17.5" cy="20" rx="4.8" ry="4.6" fill="#f8fffb" stroke="#14532d" strokeWidth="0.7" />
            <ellipse cx="28.5" cy="20" rx="4.8" ry="4.6" fill="#f8fffb" stroke="#14532d" strokeWidth="0.7" />
            {/* Slit pupils glance in the direction of travel */}
            <motion.ellipse style={{ x: pupilX }} cx="17.5" cy="20" rx="1.3" ry="3.5" fill="#0a0a0a" />
            <motion.ellipse style={{ x: pupilX }} cx="28.5" cy="20" rx="1.3" ry="3.5" fill="#0a0a0a" />
            <motion.circle style={{ x: pupilX }} cx="18.6" cy="18.1" r="1.05" fill="#fff" fillOpacity="0.95" />
            <motion.circle style={{ x: pupilX }} cx="29.6" cy="18.1" r="1.05" fill="#fff" fillOpacity="0.95" />
          </motion.g>

          {/* Nose */}
          <path d="M20.9 24.3 L25.1 24.3 L23 26.6 Z" fill="#052e16" />

          {/* Mouth: ω-muzzle at rest, opens while the intro voice plays */}
          {speaking ? (
            <motion.ellipse
              cx="23"
              cy="29.2"
              rx="2.6"
              fill="#052e16"
              animate={{ ry: [0.8, 2.4, 0.8] }}
              transition={{ duration: 0.32, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <path
              d="M23 26.6 v1.6 M23 28.2 Q20.9 30.6 19.1 28.2 M23 28.2 Q25.1 30.6 26.9 28.2"
              stroke="#052e16"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Sound waves while speaking (left side — the tail owns the right) */}
          {speaking && (
            <g>
              <motion.path
                d="M5.5 22 q-3.5 5 0 10"
                stroke="#4ade80"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <motion.path
                d="M2 20 q-5 7 0 14"
                stroke="#4ade80"
                strokeWidth="1.3"
                strokeLinecap="round"
                fill="none"
                animate={{ opacity: [0.15, 0.8, 0.15] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.25 }}
              />
            </g>
          )}

          {/* Collar + bell, paws, and the coder marking on the chest */}
          <path d="M15.4 30.9 Q23 35.6 30.6 30.9" stroke="#052e16" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="23" cy="35" r="1.6" fill="#4ade80" />
          <ellipse cx="17.5" cy="43.4" rx="3.4" ry="2.5" fill="#166534" />
          <ellipse cx="28.5" cy="43.4" rx="3.4" ry="2.5" fill="#166534" />
          <text x="23" y="41.4" textAnchor="middle" fontSize="5.2" fontFamily="monospace" fill="#bbf7d0" fontWeight="bold">
            {"</>"}
          </text>

          {/* --- Section outfits ------------------------------------------- */}
          {variant === "glasses" && (
            <g>
              <circle cx="17.5" cy="20" r="5.4" fill="none" stroke="#e5e7eb" strokeWidth="1.4" />
              <circle cx="28.5" cy="20" r="5.4" fill="none" stroke="#e5e7eb" strokeWidth="1.4" />
              <path d="M12.1 19.4 L8.6 17.4 M33.9 19.4 L37.4 17.4" stroke="#e5e7eb" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M22.7 20 h0.6" stroke="#e5e7eb" strokeWidth="1.4" />
            </g>
          )}
          {variant === "hardhat" && (
            <g>
              <path d="M15.5 12 Q23 2.4 30.5 12 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
              <rect x="13" y="11" width="20" height="3.2" rx="1.6" fill="#f59e0b" />
              <rect x="21" y="5" width="4" height="6.2" rx="1" fill="#fde68a" />
            </g>
          )}
          {variant === "gradcap" && (
            <g>
              <polygon points="23,5.5 33,10 23,14.5 13,10" fill="#1f2937" stroke="#4b5563" strokeWidth="0.8" />
              <rect x="19" y="12" width="8" height="3" rx="1" fill="#111827" />
              <path d="M23 10 L32 13.5 L32.5 18" stroke="#facc15" strokeWidth="1.2" fill="none" />
              <circle cx="32.5" cy="19" r="1.5" fill="#facc15" />
            </g>
          )}
          {/* Emoji props need an explicit fill — the root <svg fill="none"> would
              otherwise be inherited and the glyph renders invisible. */}
          {variant === "tool" && (
            <text x="7.5" y="45" textAnchor="middle" fontSize="10.5" fill="#fff" transform="rotate(-15 7.5 45)">
              🛠️
            </text>
          )}
          {variant === "pencil" && (
            <text x="7.5" y="45" textAnchor="middle" fontSize="10.5" fill="#fff" transform="rotate(-20 7.5 45)">
              ✏️
            </text>
          )}
          {variant === "mail" && (
            <text x="7.5" y="45" textAnchor="middle" fontSize="10.5" fill="#fff" transform="rotate(10 7.5 45)">
              📬
            </text>
          )}
        </svg>
      </motion.div>
      </motion.div>
    </motion.div>
  )
}
