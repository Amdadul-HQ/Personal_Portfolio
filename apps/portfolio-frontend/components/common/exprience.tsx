"use client"

import { useRef } from "react"
import { motion, useScroll } from "framer-motion"
import reactIcon from "../../assets/react.svg"
import NextIcon from "../../assets/next.svg"
import Image from "next/image"

const experiences = [
  {
    title: "Next.js Developer",
    company: "Tridebits Technologies",
    description:
      "Worked as a Next.js developer at Tridebits Technologies since Jan 2025. Developed and maintained the 4 Dynamci website templates and internal applications. Implemented SEO best practices and improved website performance.",
    icon: NextIcon,
    technologies: ["Next js"],
    duration: "Jan 2025 - Present",
  },
  {
    title: "Full Stack Mern Developer",
    company: "Sinss Digital Marketing Studio",
    description:
      "Currently working as a full-stack developer at Sinss Digital Marketing Studio since Dec 2023. Developed e-commerce, CRM, and project management applications using the MERN stack, Next.js, PostgreSQL, and MySQL. Designed and developed over 8 websites as the sole developer.",
    icon: reactIcon,
    technologies: ["MERN", "PostgreSQL", "MySQL"],
    duration: "Dec 2023 - Dec 2024",
  },
]

export default function Experience() {
  const containerRef = useRef(null)

  return (
    <section className="min-h-screen bg-[#000] py-24 px-4 sm:px-6 lg:px-8 rounded-t-[80px]">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-green-600 mb-16 tracking-wider"
        >
          EXPERIENCE
        </motion.h2>

        <div ref={containerRef} className="relative ml-4 md:ml-8">
          {/* Timeline vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-600/30" />

          {experiences.map((experience, index) => (
            <TimelineItem key={index} experience={experience} index={index} isLast={index === experiences.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ experience, index, isLast }) {
  const itemRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "center center"],
  })

  return (
    <div ref={itemRef} className="relative mb-24 last:mb-0 pl-12 md:pl-16">
      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute left-4 -translate-x-1/2 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center z-10"
        style={{
          top: "2rem",
        }}
      >
        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
          <Image src={experience.icon || "/placeholder.svg"} alt="" className="w-3 h-3" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gray-900/40 rounded-xl p-6 border border-gray-800 hover:border-green-600/50 transition-all duration-300"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div>
            <h3 className="text-2xl font-medium text-white">{experience.title}</h3>
            <p className="text-white/50">{experience.company}</p>
          </div>
          <div className="md:ml-auto">
            <span className="text-sm text-white/50 bg-gray-800 px-3 py-1 rounded-full">{experience.duration}</span>
          </div>
        </div>

        <p className="leading-relaxed text-white mb-4">{experience.description}</p>

        <div className="flex flex-wrap gap-2">
          {experience.technologies.map((tech, techIndex) => (
            <motion.span
              key={techIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + techIndex * 0.1 }}
              className="inline-flex text-[#000] items-center px-4 py-1.5 rounded-full text-sm font-bold bg-green-300 hover:bg-gray-300 cursor-pointer transition-colors duration-300"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
