"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@workspace/ui/components/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { DeleteDialog } from "@/components/dashboard/delete-dialog"
import { getSession } from "@/app/action/auth"

type Experience = {
  id: string
  role: string
  companyImage: string
  company: string
  description: string
  skill: string[]
  startDate: string | Date
  endDate: string | Date
}

type ExperienceTableProps = {
  experiences: Experience[]
}

export function ExperienceTable({ experiences }: ExperienceTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    if (!selectedExperience) return
    const accessToken = await getSession()
         if(!accessToken){
          return
        }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/experience/${selectedExperience.id}`, {
        method: "DELETE",
        headers:{
         Authorization: `${accessToken.token}`,   
        },
        credentials:"include"
      })


      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error("Error deleting experience:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to delete experience. Please try again.",
    //     variant: "destructive",
    //   })
      throw error // Re-throw to be caught by the DeleteDialog
    }
  }

  return (
    <>
      <div className="rounded-md border border-green-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((exp) => (
              <TableRow key={exp.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 overflow-hidden rounded-md">
                      <img
                        src={exp.companyImage || "/placeholder.svg"}
                        alt={exp.company}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="font-medium">{exp.company}</span>
                  </div>
                </TableCell>
                <TableCell>{exp.role}</TableCell>
                <TableCell>
                  {format(new Date(exp.startDate), "MMM yyyy")} - {format(new Date(exp.endDate), "MMM yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {exp.skill.slice(0, 3).map((skill, i) => (
                      <span key={i} className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        {skill}
                      </span>
                    ))}
                    {exp.skill.length > 3 && (
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        +{exp.skill.length - 3}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600" asChild>
                      <Link href={`/dashboard/experience/edit/${exp.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-600"
                      onClick={() => {
                        setSelectedExperience(exp)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedExperience && (
        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Delete Experience"
          description={`Are you sure you want to delete "${selectedExperience.role} at ${selectedExperience.company}"? This action cannot be undone.`}
          itemName={`${selectedExperience.role} at ${selectedExperience.company}`}
        />
      )}
    </>
  )
}
