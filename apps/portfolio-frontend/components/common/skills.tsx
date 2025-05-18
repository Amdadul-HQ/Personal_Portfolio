"use client"

import { motion } from "framer-motion"
import Image from "next/image"

// Import all your SVG assets
import html from "../../assets/html.svg"
import css from "../../assets/css.svg"
import js from "../../assets/js.svg"
import react from "../../assets/react.svg"
import express from "../../assets/express.svg"
import figma from "../../assets/figma.svg"
import framer from "../../assets/framer.svg"
import github from "../../assets/github.svg"
import mongo from "../../assets/mongo.svg"
import mysql from "../../assets/mysql.svg"
import next from "../../assets/next.svg"
import node from "../../assets/node.svg"
import npm from "../../assets/npm.svg"
import postgresql from "../../assets/postgresql.svg"
import postman from "../../assets/postman.svg"
import redux from "../../assets/redux.svg"
import tailwind from "../../assets/tailwind.svg"
import typescript from "../../assets/typescript.svg"

// Define skill categories with their respective skills
const skillCategories = [
  {
    title: "Front-End Development :",
    skills: [
      { name: "JavaScript", icon: js },
      { name: "React js", icon: react },
      { name: "Next js", icon: next },
      { name: "HTML", icon: html },
      { name: "CSS", icon: css },
      { name: "Tailwind CSS", icon: tailwind },
      { name: "TypeScript", icon: typescript },
      { name: "Redux", icon: redux },
      { name: "Framer Motion", icon: framer },
    ],
  },
  {
    title: "Back-End Development :",
    skills: [
      { name: "Node js", icon: node },
      { name: "Express js", icon: express },
      { name: "Mongo db", icon: mongo },
      { name: "MySQL", icon: mysql },
      { name: "PostgreSQL", icon: postgresql },
    ],
  },
  {
    title: "Tools :",
    skills: [
      { name: "GitHub", icon: github },
      { name: "Git", icon: github },
      { name: "npm", icon: npm },
      { name: "Postman", icon: postman },
      { name: "Figma", icon: figma },
    ],
  },
]

export default function Skills() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-100px" }}
      variants={containerVariants}
      className="w-full min-h-screen bg-[#0F1012] py-20 px-6 md:px-12 lg:px-16 rounded-t-[80px]"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={titleVariants} className="mb-12">
          <h2 className="text-4xl font-bold text-white flex items-center gap-2">
            Skills
            <span className="bg-green-500 h-8 w-8 flex items-center justify-center rounded-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-black"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          </h2>
        </motion.div>

        <div className="space-y-12">
          {skillCategories.map((category, index) => (
            <motion.div key={index} variants={categoryVariants} className="space-y-4">
              <h3 className="text-xl md:text-2xl font-medium text-white">{category.title}</h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skillIndex}
                    variants={skillVariants}
                    whileHover={{ scale: 1.05 }}
                    className="bg-[#1A1A1A] rounded-full px-5 py-2.5 flex items-center gap-2 transition-all duration-300 hover:bg-[#252525]"
                  >
                    <div className="w-5 h-5 relative">
                      <Image src={skill.icon || "/placeholder.svg"} alt={skill.name} fill className="object-contain" />
                    </div>
                    <span className="text-gray-200 text-sm md:text-base">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
