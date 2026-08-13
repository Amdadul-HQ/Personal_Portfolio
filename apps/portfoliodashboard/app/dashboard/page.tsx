import { redirect } from "next/navigation"
import { getSession } from "../action/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { BookOpen, Briefcase, Code, FileCode } from "lucide-react"

async function getCount(path: string): Promise<number> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${path}`, {
      cache: "no-store",
    })
    if (!res.ok) {
      return 0
    }
    const data = await res.json()
    // Paginated endpoints (blogs, projects) report meta.total; the rest return plain arrays
    if (data.meta?.total !== undefined) {
      return data.meta.total
    }
    return Array.isArray(data.data) ? data.data.length : 0
  } catch (error) {
    console.error(`Error fetching ${path} count:`, error)
    return 0
  }
}

export default async function Dashboard() {
  const session = await getSession()
  if (!session) {
    redirect("/")
  }

  const [blogCount, projectCount, experienceCount, skillCount] = await Promise.all([
    getCount("blogs?limit=1"),
    getCount("projects?limit=1"),
    getCount("experience"),
    getCount("skills"),
  ])

  const stats = [
    { title: "Blogs", value: blogCount, description: "Total blog posts", icon: BookOpen },
    { title: "Projects", value: projectCount, description: "Total projects", icon: Code },
    { title: "Experience", value: experienceCount, description: "Work experiences", icon: Briefcase },
    { title: "Skills", value: skillCount, description: "Total skills", icon: FileCode },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Dashboard Overview</h1>
        <p className="text-green-600">Welcome to your admin dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-green-700">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{stat.value}</div>
              <p className="text-sm text-green-600">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
