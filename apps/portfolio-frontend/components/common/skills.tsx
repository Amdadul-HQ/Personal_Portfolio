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
  label: string;
  skills: Skill[];
}

// Display order for skill categories, regardless of DB insertion order.
const FIELD_ORDER = ['PROGRAMMING_LANGUAGE', 'FRONTEND', 'BACKEND', 'DEVOPS', 'TOOL'];

// Friendly display name per category
const FIELD_LABELS: Record<string, string> = {
  PROGRAMMING_LANGUAGE: 'Languages',
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DEVOPS: 'DevOps',
  TOOL: 'Tools',
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
    label: FIELD_LABELS[field] ?? field,
    skills: grouped[field] as Skill[],
  }));
};

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
          <p className="mt-3 text-sm text-gray-400">The stack I build and ship with, day to day.</p>
        </motion.div>

        {/* One big terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.55 }}
          className="overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117]/95 shadow-xl backdrop-blur"
        >
          {/* Window title bar */}
          <div className="flex items-center gap-3 border-b border-[#30363d] bg-[#161b22] px-4 py-2.5">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </span>
            <span className="font-mono text-xs text-gray-400">skills</span>
            <span className="ml-auto rounded-full border border-green-500/30 bg-green-500/10 px-3 py-0.5 text-xs text-green-400">
              {totalSkills} skills
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
                {/* Category label */}
                <p className="mb-3 text-sm font-semibold text-gray-300">
                  <span className="mr-2 text-green-500">▸</span>
                  {category.label}
                </p>

                <div className="flex flex-wrap gap-2.5 pl-1 sm:pl-4">
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

          </div>
        </motion.div>
      </div>
    </section>
  )
}
