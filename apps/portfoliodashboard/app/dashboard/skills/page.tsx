import { Suspense } from "react"
import Link from "next/link"
import {  Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { SkillsTableSkeleton } from "@/components/dashboard/skills-table-skeleton"
import { SkillsTable } from "@/components/dashboard/skills-table"

// Function to fetch skills from the API

async function getSkills() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to fetch skills")
    }

    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching skills:", error)
    return []
  }
}

export default async function SkillsPage() {
  const skills = await getSkills()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Skills</h1>
          <p className="text-green-600">Manage your technical skills</p>
        </div>
        <Link href="/dashboard/skills/create">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> Add Skill
          </Button>
        </Link>
      </div>

      <Suspense fallback={<SkillsTableSkeleton />}>
        {skills.length > 0 ? (
          <SkillsTable skills={skills}/>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-green-300 bg-green-50 p-8 text-center">
            <h3 className="mb-2 text-lg font-medium text-green-800">No skills found</h3>
            <p className="mb-6 text-green-600">Get started by adding your first skill.</p>
            <Link href="/dashboard/skills/create">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" /> Add Skill
              </Button>
            </Link>
          </div>
        )}
      </Suspense>
    </div>
  )
}
