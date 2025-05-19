"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Edit, ExternalLink, Github, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { DeleteDialog } from "@/components/dashboard/delete-dialog"

type ProjectCardProps = {
  project: {
    id: string
    name: string
    description: string
    type: string
    liveLink: string
    gitHubLink: string
    siteMockup: string
    projectStartDate: string | Date
    projectEndDate: string | Date
    isFeatured: boolean
    techonology?: string[]
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${project.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error("Error deleting project:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to delete project. Please try again.",
    //     variant: "destructive",
    //   })
      throw error // Re-throw to be caught by the DeleteDialog
    }
  }

  return (
    <>
      <Card className="group overflow-hidden border-green-200 transition-all duration-300 hover:shadow-md">
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.siteMockup || "/placeholder.svg"}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {project.isFeatured && (
            <Badge className="absolute right-2 top-2 bg-green-600 text-white hover:bg-green-700">Featured</Badge>
          )}
        </div>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-green-200 text-green-700">
              {project.type}
            </Badge>
          </div>
          <CardTitle className="line-clamp-1 text-lg text-green-800">{project.name}</CardTitle>
          <CardDescription className="line-clamp-2 text-green-600">{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="mb-2 flex flex-wrap gap-1">
            {project.techonology?.slice(0, 3).map((tech, i) => (
              <Badge key={i} variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                {tech}
              </Badge>
            ))}
            {project.techonology && project.techonology.length > 3 && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                +{project.techonology.length - 3}
              </Badge>
            )}
          </div>
          <p className="text-xs text-green-500">
            {format(new Date(project.projectStartDate), "MMM yyyy")} -{" "}
            {format(new Date(project.projectEndDate), "MMM yyyy")}
          </p>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-between gap-2 p-4 pt-0">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700" asChild>
              <Link href={`/dashboard/projects/edit/${project.id}`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" asChild>
              <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Live
              </a>
            </Button>
            <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-700" asChild>
              <a href={project.gitHubLink} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> Code
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        description={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        itemName={project.name}
      />
    </>
  )
}
