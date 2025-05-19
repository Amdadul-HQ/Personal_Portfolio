import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ExperienceTable } from "@/components/dashboard/experience-table"
import { ExperienceTableSkeleton } from "@/components/dashboard/experience-table-skeleton"

// Function to fetch experiences from the API
async function getExperiences() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/experiences`, {
      method:"GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    // if (!res.ok) {
    //   throw new Error("Failed to fetch experiences")
    // }

    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching experiences:", error)
    return []
  }
}

export default async function ExperiencePage() {
  const experiences = await getExperiences()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Experience</h1>
          <p className="text-green-600">Manage your work experience</p>
        </div>
        <Link href="/dashboard/experience/create">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> Add Experience
          </Button>
        </Link>
      </div>

      <Suspense fallback={<ExperienceTableSkeleton />}>
        {experiences.length > 0 ? (
          <ExperienceTable experiences={experiences} />
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-green-300 bg-green-50 p-8 text-center">
            <h3 className="mb-2 text-lg font-medium text-green-800">No experience entries found</h3>
            <p className="mb-6 text-green-600">Get started by adding your work experience.</p>
            <Link href="/dashboard/experience/create">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" /> Add Experience
              </Button>
            </Link>
          </div>
        )}
      </Suspense>
    </div>
  )
}
