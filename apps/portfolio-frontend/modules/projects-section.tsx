"use client"

import { ProjectCard } from "@/components/ui/project-card"
import { Button } from "@workspace/ui/components/button"
import { useEffect, useState } from "react"

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR'; // Adjust based on your roles
  password: string;
}

export interface IProject {
  id: string;
  name: string;
  description: string;
  siteMockup: string;
  techonology: string[]; // Typo preserved if API returns it this way
  features: string[];
  services: string[];
  elements: number;
  totalCode: number;
  gitHubLink: string;
  liveLink: string;
  type: string;
  isFeatured: boolean;
  projectStartDate: string; // ISO date string
  projectEndDate: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: IUser;
}


export function ProjectsSection() {
    const [activeCategory, setActiveCategory] = useState("All")
  const [projects, setProjects] = useState<IProject[]>([])
  const [loading, setLoading] = useState(true)

  const categories = ["All", "Web Development", "Web Design", "Web Application", "Mobile Development"]

  const getProjects = async (category: string) => {
    setLoading(true)
    try {
      const queryParam = category !== "All" ? `?type=${encodeURIComponent(category)}` : ""
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects${queryParam}`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await res.json()
      setProjects(data.data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getProjects(activeCategory)
  }, [activeCategory])
  // Filter projects based on active category
  // const filteredProjects =
  //   activeCategory === "All" ? allProjects : allProjects.filter((project) => project.category === activeCategory)
  
  console.log(projects)
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

      {loading ? (
        <p className="text-center">Loading projects...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: IProject) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
