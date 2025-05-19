import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { BlogCard } from "@/components/dashboard/blog-card"
import { BlogsPageSkeleton } from "@/components/dashboard/blogs-page-skeleton"

// Function to fetch blogs from the API
async function getBlogs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    // if (!res.ok) {
    //   throw new Error("Failed to fetch blogs")
    // }

    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return []
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs()
  console.log(blogs)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Blogs</h1>
          <p className="text-green-600">Manage your blog posts</p>
        </div>
        <Link href="/dashboard/blogs/create">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> Create Blog
          </Button>
        </Link>
      </div>

      <Suspense fallback={<BlogsPageSkeleton />}>
        {blogs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog:any) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-green-300 bg-green-50 p-8 text-center">
            <h3 className="mb-2 text-lg font-medium text-green-800">No blogs found</h3>
            <p className="mb-6 text-green-600">Get started by creating your first blog post.</p>
            <Link href="/dashboard/blogs/create">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" /> Create Blog
              </Button>
            </Link>
          </div>
        )}
      </Suspense>
    </div>
  )
}
