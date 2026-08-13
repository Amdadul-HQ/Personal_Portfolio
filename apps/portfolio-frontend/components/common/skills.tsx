"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

interface RawSkill {
  name: string;
  image: string;
  field: string;
}

interface Skill {
  name: string;
  icon: string;
}

interface SkillCategory {
  field: string;
  command: string;
  skills: Skill[];
}

// Display order for skill categories, regardless of DB insertion order.
const FIELD_ORDER = ['PROGRAMMING_LANGUAGE', 'FRONTEND', 'BACKEND', 'DEVOPS', 'TOOL'];

// Terminal directory name per category (the "$ ls ./<dir>" line)
const FIELD_DIRS: Record<string, string> = {
  PROGRAMMING_LANGUAGE: 'languages',
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  DEVOPS: 'devops',
  TOOL: 'tools',
};

const transformSkills = (dbSkills: RawSkill[]): SkillCategory[] => {
  if (!Array.isArray(dbSkills)) return [];
  const grouped: Record<string, Skill[]> = {};

  for (const skill of dbSkills) {
    const field = skill.field.toUpperCase();
    if (!grouped[field]) {
      grouped[field] = [];
    }
    grouped[field].push({ name: skill.name, icon: skill.image });
  }

  return FIELD_ORDER.filter((field) => grouped[field]?.length).map((field) => ({
    field,
    command: `ls ./${FIELD_DIRS[field] ?? field.toLowerCase()}`,
    skills: grouped[field] as Skill[],
  }));
};

const Prompt = () => (
  <>
    <span className="text-green-400">~/skills</span>
    <span className="text-gray-500"> $ </span>
  </>
)

export default function Skills() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills`)
        const data = await response.json()
        setCategories(transformSkills(data.data))
      } catch (error) {
        console.error("Error fetching skills:", error)
      }
    }
    fetchSkills()
  }, [])

  const totalSkills = categories.reduce((n, c) => n + c.skills.length, 0)

  return (
    <section className="w-full min-h-screen bg-[#0F1012] py-20 px-4 sm:px-6 md:px-12 lg:px-16 rounded-t-[80px]">
      <div className="max-w-6xl mx-auto">
        {/* Heading — same style family as the experience section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold tracking-wider text-green-600">SKILLS</h2>
          <p className="mt-3 font-mono text-sm text-green-500/70">
            <Prompt />
            cat stack.config.ts
            <motion.span
              className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-green-500"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            />
          </p>
        </motion.div>

        {/* One big terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.55 }}
          className="overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117]/95 font-mono shadow-xl backdrop-blur"
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-3 border-b border-[#30363d] bg-[#161b22] px-4 py-2.5">
            <span className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </span>
            <span className="text-xs text-gray-400">skills.sh — ~/skills</span>
            <span className="ml-auto rounded-full border border-green-500/30 bg-green-500/10 px-3 py-0.5 text-xs text-green-400">
              {totalSkills} installed
            </span>
          </div>

          {/* Terminal body */}
          <div className="space-y-7 px-4 py-6 sm:px-6">
            {categories.map((category, catIndex) => (
              <motion.div
                key={category.field}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: 0.06 * catIndex }}
              >
                {/* Command line */}
                <p className="mb-3 text-sm">
                  <Prompt />
                  <span className="text-gray-200">{category.command}</span>
                </p>

                {/* "Output" — the skill chips */}
                <div className="flex flex-wrap gap-2.5 pl-2 sm:pl-6">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.25, delay: 0.03 * skillIndex }}
                      whileHover={{ y: -3, scale: 1.04 }}
                      className="inline-flex cursor-default items-center gap-2 rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-sm text-gray-200 transition-[border-color,box-shadow] duration-200 hover:border-green-500/60 hover:shadow-[0_0_16px_-4px_rgba(34,197,94,0.5)]"
                    >
                      <span className="relative h-[18px] w-[18px]">
                        <Image src={skill.icon || "/placeholder.svg"} alt={skill.name} fill className="object-contain" />
                      </span>
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Closing lines */}
            {categories.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="space-y-1 text-sm"
              >
                <p>
                  <Prompt />
                  <span className="text-gray-200">npm audit</span>
                </p>
                <p className="pl-2 text-green-400 sm:pl-6">found 0 vulnerabilities ✓ — always learning, always shipping</p>
                <p>
                  <Prompt />
                  <motion.span
                    className="inline-block h-4 w-2 translate-y-0.5 bg-green-500"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                  />
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
