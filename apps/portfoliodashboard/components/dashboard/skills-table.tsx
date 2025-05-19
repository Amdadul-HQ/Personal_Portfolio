"use client"

import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@workspace/ui/components/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { Badge } from "@workspace/ui/components/badge"
import { DeleteDialog } from "@/components/dashboard/delete-dialog"

type Skill = {
  id: string
  name: string
  field: string
  image: string
}

type SkillsTableProps = {
  skills: Skill[]
}

export function SkillsTable({ skills }: SkillsTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const router = useRouter()

  const getFieldColor = (field: string) => {
    switch (field) {
      case "FRONTEND":
        return "bg-blue-100 text-blue-700"
      case "BACKEND":
        return "bg-purple-100 text-purple-700"
      case "DEVOPS":
        return "bg-orange-100 text-orange-700"
      case "TOOL":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-green-100 text-green-700"
    }
  }

  const handleDelete = async () => {
    if (!selectedSkill) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills/${selectedSkill.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete skill")
      }

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error("Error deleting skill:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to delete skill. Please try again.",
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
              <TableHead className="w-[80px]">Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Field</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((skill) => (
              <TableRow key={skill.id}>
                <TableCell>
                  <div className="h-10 w-10 overflow-hidden rounded-md">
                    <img
                      src={skill.image || "/placeholder.svg?height=40&width=40"}
                      alt={skill.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell>
                  <Badge className={getFieldColor(skill.field)}>{skill.field}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600" asChild>
                      <Link href={`/dashboard/skills/edit/${skill.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-600"
                      onClick={() => {
                        setSelectedSkill(skill)
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

      {selectedSkill && (
        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Delete Skill"
          description={`Are you sure you want to delete "${selectedSkill.name}"? This action cannot be undone.`}
          itemName={selectedSkill.name}
        />
      )}
    </>
  )
}
