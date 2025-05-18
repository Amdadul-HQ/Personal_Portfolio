"use client"

import { ProjectCard } from "@/components/ui/project-card"
import { Button } from "@workspace/ui/components/button"
import { useState } from "react"
import essentialharvest from '../assets/projects/eh1.png'
import janvry from '../assets/projects/janvry.png'
import cursify from '../assets/projects/cursify.png'

// Sample project data - in a real portfolio, this would come from a CMS or database
const allProjects = [
  {
    slug: "janvry-studio-3d-website-development",
    title: "E-commerce Website",
    description:
      "A fully responsive e-commerce platform with product filtering, cart functionality, and payment integration.",
    image: essentialharvest,
    category: "Web Development",
    technologies: ["React", "Next.js", "Tailwind CSS", "Stripe"],
    demoUrl: "#",
    codeUrl: "#",
  },
  {
    slug: "2",
    title: "Portfolio Website",
    description: "A personal portfolio website showcasing my projects and skills with a modern, minimalist design.",
    image: janvry,
    category: "Web Design",
    technologies: ["HTML", "CSS", "JavaScript", "GSAP"],
    demoUrl: "#",
    codeUrl: "#",
  },
  {
    slug: "3",
    title: "Task Management App",
    description:
      "A productivity application for managing tasks, projects, and team collaboration with real-time updates.",
    image: cursify,
    category: "Web Application",
    technologies: ["React", "Firebase", "Material UI", "Redux"],
    demoUrl: "#",
    codeUrl: "#",
  },
  {
    slug: "4",
    title: "Mobile Fitness App",
    description: "A cross-platform mobile application for tracking workouts, nutrition, and fitness progress.",
    image: essentialharvest,
    category: "Mobile Development",
    technologies: ["React Native", "Expo", "Firebase", "Redux"],
    demoUrl: "#",
    codeUrl: "#",
  },
  {
    slug: "5",
    title: "Blog Platform",
    description: "A content management system for publishing articles and blog posts with user authentication.",
    image: janvry,
    category: "Web Development",
    technologies: ["Next.js", "MongoDB", "Tailwind CSS", "NextAuth"],
    demoUrl: "#",
    codeUrl: "#",
  },
  {
    slug: "6",
    title: "Weather Dashboard",
    description: "A weather application that provides real-time weather data and forecasts for locations worldwide.",
    image: cursify,
    category: "Web Application",
    technologies: ["JavaScript", "OpenWeather API", "Chart.js", "CSS"],
    demoUrl: "#",
    codeUrl: "#",
  },
]

// Get unique categories from projects
const categories = ["All", ...new Set(allProjects.map((project) => project.category))]

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("All")

  // Filter projects based on active category
  const filteredProjects =
    activeCategory === "All" ? allProjects : allProjects.filter((project) => project.category === activeCategory)

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className="mb-2"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
