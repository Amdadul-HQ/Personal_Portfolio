import { redirect } from "next/navigation"
import { getSession } from "../action/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Activity, BookOpen, Briefcase, Code, FileCode, Users } from "lucide-react"

export default async function Dashboard() {
  const session = await getSession()
  if (!session) {
    redirect("/")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Dashboard Overview</h1>
        <p className="text-green-600">Welcome to your admin dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-green-700">Blogs</CardTitle>
            <BookOpen className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">12</div>
            <p className="text-sm text-green-600">Total blog posts</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-green-700">Projects</CardTitle>
            <Code className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">8</div>
            <p className="text-sm text-green-600">Total projects</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-green-700">Experience</CardTitle>
            <Briefcase className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">5</div>
            <p className="text-sm text-green-600">Work experiences</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-green-700">Skills</CardTitle>
            <FileCode className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">24</div>
            <p className="text-sm text-green-600">Total skills</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-green-700">Visitors</CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">1,234</div>
            <p className="text-sm text-green-600">Monthly visitors</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-green-700">Activity</CardTitle>
            <Activity className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">42</div>
            <p className="text-sm text-green-600">Actions this week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
