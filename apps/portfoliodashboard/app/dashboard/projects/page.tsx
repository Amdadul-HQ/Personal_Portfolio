import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { ProjectCard } from "@/components/dashboard/project-card"
import { ProjectsPageSkeleton } from "@/components/dashboard/project-skeleton"

// Function to fetch projects from the API
async function getProjects() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    // if (!res.ok) {
    //   throw new Error("Failed to fetch projects")
    // }

    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Projects</h1>
          <p className="text-green-600">Manage your portfolio projects</p>
        </div>
        <Link href="/dashboard/projects/create">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> Create Project
          </Button>
        </Link>
      </div>

      <Suspense fallback={<ProjectsPageSkeleton />}>
        {projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project:any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-green-300 bg-green-50 p-8 text-center">
            <h3 className="mb-2 text-lg font-medium text-green-800">No projects found</h3>
            <p className="mb-6 text-green-600">Get started by creating your first project.</p>
            <Link href="/dashboard/projects/create">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" /> Create Project
              </Button>
            </Link>
          </div>
        )}
      </Suspense>
    </div>
  )
}
