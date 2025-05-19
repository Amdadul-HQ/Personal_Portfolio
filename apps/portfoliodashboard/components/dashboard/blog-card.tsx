'use client'
import { format } from "date-fns"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DeleteDialog } from "./delete-dialog"

type BlogCardProps = {
  blog: {
    id: string
    title: string
    shortDescription: string
    thumbnail: string
    publishDate: string | Date
    category: string
    isFeatured: boolean
    readingTime: string
  }
}

export function BlogCard({ blog }: BlogCardProps) {

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${blog.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete blog")
      }

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error("Error deleting blog:", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to delete blog post. Please try again.",
      //   variant: "destructive",
      // })
      throw error // Re-throw to be caught by the DeleteDialog
    }
  }
  return (
    <>
    <Card className="group overflow-hidden border-green-200 transition-all duration-300 hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img
          src={blog.thumbnail || "/placeholder.svg"}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {blog.isFeatured && (
          <Badge className="absolute right-2 top-2 bg-green-600 text-white hover:bg-green-700">Featured</Badge>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-green-200 text-green-700">
            {blog.category}
          </Badge>
          <span className="text-xs text-green-600">{blog.readingTime} read</span>
        </div>
        <CardTitle className="line-clamp-1 text-lg text-green-800">{blog.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-green-600">{blog.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-xs text-green-500">Published on {format(new Date(blog.publishDate), "MMMM d, yyyy")}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
          <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700" asChild>
            <Link href={`/dashboard/blogs/edit/${blog.id}`}>
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
        </CardFooter>
    </Card>
     <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${blog.title}"? This action cannot be undone.`}
        itemName={blog.title}
      />
    </>
  )
}
