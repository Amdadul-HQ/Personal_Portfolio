"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { formatDateRange } from "@/utils/function/durationFunction"

// Type definition for a single experience (shape returned by GET /api/experience)
interface ExperienceItem {
  id: string
  company: string
  companyImage: string
  description: string
  startDate: string
  endDate: string
  skill: string[]
  role: string
}

// ---------------------------------------------------------------------------
// Syntax palette (One Dark-ish, strings kept green to match the site brand)
// ---------------------------------------------------------------------------
const SYNTAX = {
  keyword: "#c678dd",
  variable: "#61afef",
  property: "#e06c75",
  string: "#98c379",
  punctuation: "#6b7280",
  comment: "#5c6370",
  lineNumber: "#3b4048",
}

const toCamelCase = (s: string) =>
  s
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w[0]?.toUpperCase() + w.slice(1).toLowerCase()))
    .join("")

const toFileName = (s: string) =>
  s
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .join("-")
    .toLowerCase() + ".ts"

// Split the description paragraph into sentence-per-line JSDoc comments
const toSentences = (text: string): string[] =>
  text
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

// ---------------------------------------------------------------------------
// Floating background glyphs
// ---------------------------------------------------------------------------
const GLYPHS: { symbol: string; top: string; left: string; size: string; duration: number; delay: number }[] = [
  { symbol: "</>", top: "8%", left: "6%", size: "text-5xl", duration: 11, delay: 0 },
  { symbol: "{ }", top: "22%", left: "88%", size: "text-6xl", duration: 13, delay: 1.2 },
  { symbol: "=>", top: "48%", left: "4%", size: "text-4xl", duration: 9, delay: 0.6 },
  { symbol: "git", top: "64%", left: "92%", size: "text-5xl", duration: 12, delay: 2 },
  { symbol: "()", top: "82%", left: "8%", size: "text-6xl", duration: 14, delay: 0.3 },
  { symbol: ";", top: "12%", left: "55%", size: "text-7xl", duration: 10, delay: 1.8 },
  { symbol: "npm", top: "90%", left: "70%", size: "text-4xl", duration: 12, delay: 2.4 },
]

// ---------------------------------------------------------------------------
// One rendered "line of code" with its gutter number
// ---------------------------------------------------------------------------
function CodeLine({ number, children, indent = 0 }: { number: number; children: React.ReactNode; indent?: number }) {
  return (
    <div className="flex items-start">
      <span
        className="w-8 shrink-0 select-none pr-3 text-right text-xs leading-6 sm:text-sm"
        style={{ color: SYNTAX.lineNumber }}
      >
        {number}
      </span>
      <span className="min-w-0 flex-1 text-xs leading-6 sm:text-sm" style={{ paddingLeft: indent * 14 }}>
        {children}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// One experience, rendered as a code editor window on the git timeline
// ---------------------------------------------------------------------------
function EditorCard({ experience, index }: { experience: ExperienceItem; index: number }) {
  const isCurrent = new Date(experience.endDate) > new Date()
  const varName = toCamelCase(experience.role)
  const sentences = toSentences(experience.description)

  let line = 0
  const next = () => ++line

  return (
    <div className="relative mb-20 pl-12 last:mb-0 md:pl-16">
      {/* Commit node on the git graph */}
      <div className="absolute left-4 top-9 z-10 -translate-x-1/2">
        {isCurrent && (
          <motion.span
            className="absolute inset-0 rounded-full bg-green-500"
            animate={{ scale: [1, 2.1], opacity: [0.45, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span className="relative block h-4 w-4 rounded-full border-2 border-green-500 bg-black shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
      </div>

      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.55, delay: 0.08 * Math.min(index, 3) }}
        whileHover={{ y: -5 }}
        className="group overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117]/95 font-mono shadow-xl backdrop-blur transition-[border-color,box-shadow] duration-300 hover:border-green-500/60 hover:shadow-[0_0_30px_-8px_rgba(34,197,94,0.4)]"
      >
        {/* Editor title bar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[#30363d] bg-[#161b22] px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </span>

          <span className="flex min-w-0 items-center gap-2 rounded-md border border-[#30363d] bg-[#0d1117] px-2.5 py-1">
            <Image
              src={experience.companyImage || "/placeholder.svg"}
              alt={experience.company}
              width={16}
              height={16}
              className="h-4 w-4 rounded-sm"
            />
            <span className="truncate text-xs text-gray-300">{toFileName(experience.role)}</span>
            <span className="truncate text-xs text-gray-600">— {experience.company}</span>
          </span>

          <span className="ml-auto rounded-full border border-green-500/30 bg-green-500/10 px-3 py-0.5 text-xs text-green-400">
            {formatDateRange(experience.startDate, experience.endDate)}
          </span>
        </div>

        {/* Code body */}
        <div className="overflow-x-hidden px-3 py-4 sm:px-4">
          <CodeLine number={next()}>
            <span style={{ color: SYNTAX.comment }}>/**</span>
          </CodeLine>
          {sentences.map((sentence, i) => (
            <CodeLine key={i} number={next()}>
              <span className="italic" style={{ color: SYNTAX.comment }}>
                {" "}* {sentence}
              </span>
            </CodeLine>
          ))}
          <CodeLine number={next()}>
            <span style={{ color: SYNTAX.comment }}>{" "}*/</span>
          </CodeLine>

          <CodeLine number={next()}>
            <span style={{ color: SYNTAX.keyword }}>const</span>{" "}
            <span style={{ color: SYNTAX.variable }}>{varName}</span>{" "}
            <span style={{ color: SYNTAX.punctuation }}>= {"{"}</span>
          </CodeLine>

          <CodeLine number={next()} indent={1}>
            <span style={{ color: SYNTAX.property }}>company</span>
            <span style={{ color: SYNTAX.punctuation }}>: </span>
            <span style={{ color: SYNTAX.string }}>&quot;{experience.company}&quot;</span>
            <span style={{ color: SYNTAX.punctuation }}>,</span>
          </CodeLine>

          <CodeLine number={next()} indent={1}>
            <span style={{ color: SYNTAX.property }}>role</span>
            <span style={{ color: SYNTAX.punctuation }}>: </span>
            <span style={{ color: SYNTAX.string }}>&quot;{experience.role}&quot;</span>
            <span style={{ color: SYNTAX.punctuation }}>,</span>
          </CodeLine>

          {isCurrent && (
            <CodeLine number={next()} indent={1}>
              <span style={{ color: SYNTAX.property }}>status</span>
              <span style={{ color: SYNTAX.punctuation }}>: </span>
              <span style={{ color: SYNTAX.string }}>&quot;shipping 🚀&quot;</span>
              <span style={{ color: SYNTAX.punctuation }}>,</span>
            </CodeLine>
          )}

          <CodeLine number={next()} indent={1}>
            <span style={{ color: SYNTAX.property }}>stack</span>
            <span style={{ color: SYNTAX.punctuation }}>: [</span>
            {experience.skill.map((tech, i) => (
              <span key={i} className="inline-block">
                <span
                  className="cursor-default rounded px-0.5 transition-colors duration-200 hover:bg-green-500/15"
                  style={{ color: SYNTAX.string }}
                >
                  &quot;{tech}&quot;
                </span>
                {i < experience.skill.length - 1 && <span style={{ color: SYNTAX.punctuation }}>, </span>}
              </span>
            ))}
            <span style={{ color: SYNTAX.punctuation }}>],</span>
          </CodeLine>

          <CodeLine number={next()}>
            <span style={{ color: SYNTAX.punctuation }}>{"}"}</span>
          </CodeLine>

          <CodeLine number={next()}>
            <span style={{ color: SYNTAX.keyword }}>export default</span>{" "}
            <span style={{ color: SYNTAX.variable }}>{varName}</span>
          </CodeLine>
        </div>
      </motion.article>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------
export default function Experience(): React.ReactElement {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([])

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/experience`)
        const data = await response.json()
        setExperiences(data.data || [])
      } catch (error) {
        console.error("Error fetching experience:", error)
      }
    }
    fetchExperiences()
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden rounded-t-[80px] bg-[#000] px-4 py-24 sm:px-6 lg:px-8">
      {/* Floating code glyphs */}
      {GLYPHS.map((g, i) => (
        <motion.span
          key={i}
          className={`pointer-events-none absolute z-0 select-none font-mono font-bold text-green-500/[0.06] ${g.size}`}
          style={{ top: g.top, left: g.left }}
          animate={{ y: [0, -22, 0], rotate: [0, 4, 0] }}
          transition={{ duration: g.duration, delay: g.delay, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          {g.symbol}
        </motion.span>
      ))}

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold tracking-wider text-green-600">EXPERIENCE</h2>
          <p className="mt-3 font-mono text-sm text-green-500/70">
            <span className="text-green-400">~/career</span>
            <span className="text-gray-500"> $ </span>
            git log --graph --author=&quot;amdadul&quot;
            <motion.span
              className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-green-500"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            />
          </p>
        </motion.div>

        <div className="relative ml-4 md:ml-8">
          {/* Dashed git-graph line */}
          <div className="absolute bottom-0 left-4 top-0 w-px border-l border-dashed border-green-600/40" />

          {experiences.map((experience, index) => (
            <EditorCard key={experience.id ?? index} experience={experience} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
