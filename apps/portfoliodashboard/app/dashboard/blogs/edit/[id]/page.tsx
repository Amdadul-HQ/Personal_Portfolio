"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { CalendarIcon, ImagePlus, Loader2, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Switch } from "@workspace/ui/components/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { getSession } from "@/app/action/auth"

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  console.log(params)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [date, setDate] = useState<Date>()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [blog, setBlog] = useState<any>(null)
  const [imageChanged, setImageChanged] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [description, setDescription] = useState("")
  const [readingTime, setReadingTime] = useState("")
  const [topic, setTopic] = useState("")
  const [category, setCategory] = useState("")
  const [brand, setBrand] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)

  // Fetch blog data
  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${params?.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch blog")
        }
        const data = await response.json()
        const blogData = data.data
        setBlog(blogData)

        // Set form state
        setTitle(blogData.title || "")
        setShortDescription(blogData.shortDescription || "")
        setDescription(blogData.description || "")
        setReadingTime(blogData.readingTime || "")
        setTopic(blogData.topic || "")
        setCategory(blogData.category || "")
        setBrand(blogData.brand?.join(", ") || "")
        setIsFeatured(blogData.isFeatured || false)

        // Set the publish date
        if (blogData.publishDate) {
          setDate(new Date(blogData.publishDate))
        }

        // Set the image preview from the existing thumbnail
        if (blogData.thumbnail) {
          setImagePreview(blogData.thumbnail)
        }
      } catch (error) {
        console.error("Error fetching blog:", error)
        // toast({
        //   title: "Error",
        //   description: "Failed to fetch blog data. Please try again.",
        //   variant: "destructive",
        // })
      } finally {
        setIsFetching(false)
      }
    }

    fetchBlog()
  }, [params?.id])

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      setImageChanged(true)
    }
  }

  // Clear selected image
  const clearImage = () => {
    setImagePreview(null)
    setImageChanged(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create the blog data object
      const accessToken = await getSession()
      const blogData = {
        title,
        shortDescription,
        description,
        topic,
        readingTime,
        category,
        isFeatured,
        publishDate: date?.toISOString() || new Date().toISOString(),
        brand: brand
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
      }

      console.log("Submitting blog data:", blogData)

      // Create a new FormData object for the API request
      const apiFormData = new FormData()

      // Add the JSON data as a string in the 'data' field
      apiFormData.append("data", JSON.stringify(blogData))

      // If the image was changed, add the new file
      if (imageChanged) {
        const file = fileInputRef.current?.files?.[0]
        if (file) {
          apiFormData.append("file", file)
        } else if (imagePreview === null) {
          // If image was cleared but no new image was selected
          // toast({
          //   title: "Error",
          //   description: "Please select a thumbnail image",
          //   variant: "destructive",
          // })
          setIsLoading(false)
          return
        }
      }

       if(!accessToken){
        return
      }
      // Send data to API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/update/${params?.id}`, {
        method: "PATCH",
        body: apiFormData,
         headers:{
         Authorization: `${accessToken.token}`,   
        },
        credentials:"include"
        // Don't set Content-Type header, the browser will set it with the boundary
      })

      console.log(await response.json())
      // if (!response.ok) {
      //   throw new Error("Failed to update blog")
      // }

      // toast({
      //   title: "Blog updated",
      //   description: "Your blog post has been updated successfully.",
      // })

      router.push("/dashboard/blogs")
      router.refresh()
    } catch (error) {
      console.error("Error updating blog:", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to update blog post. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="mt-2 h-5 w-1/2" />
        </div>

        <Card className="border-green-200">
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-24 w-full" />
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-green-300 bg-green-50 p-8 text-center">
        <h3 className="mb-2 text-lg font-medium text-green-800">Blog not found</h3>
        <p className="mb-6 text-green-600">The blog post you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/dashboard/blogs")} className="bg-green-600 hover:bg-green-700">
          Back to Blogs
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Edit Blog</h1>
        <p className="text-green-600">Update your blog post details</p>
      </div>

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Blog Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-green-700">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title"
                  className="border-green-200 focus-visible:ring-green-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-green-700">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="border-green-200 focus:ring-green-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="career">Career</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription" className="text-green-700">
                Short Description
              </Label>
              <Textarea
                id="shortDescription"
                name="shortDescription"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Enter a brief description"
                className="border-green-200 focus-visible:ring-green-500"
                required
              />
            </div>

            {/* File Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="file" className="text-green-700">
                Thumbnail Image
              </Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      name="file"
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="border-green-200 focus-visible:ring-green-500"
                    />
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={clearImage}
                        className="flex-shrink-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear image</span>
                      </Button>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-green-600">
                    {imageChanged
                      ? "New image selected. Leave empty to keep current image."
                      : "Upload a new thumbnail image or leave empty to keep the current one"}
                  </p>
                </div>

                {/* Image Preview */}
                <div className="flex items-center justify-center">
                  {imagePreview ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-md border border-green-200">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Thumbnail preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 w-full flex-col items-center justify-center rounded-md border border-dashed border-green-300 bg-green-50">
                      <ImagePlus className="mb-2 h-10 w-10 text-green-400" />
                      <p className="text-sm text-green-600">No image selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="readingTime" className="text-green-700">
                  Reading Time
                </Label>
                <Input
                  id="readingTime"
                  name="readingTime"
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  placeholder="e.g. 5 min"
                  className="border-green-200 focus-visible:ring-green-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-green-700">
                  Topic
                </Label>
                <Input
                  id="topic"
                  name="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter topic"
                  className="border-green-200 focus-visible:ring-green-500"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="publishDate" className="text-green-700">
                  Publish Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="publishDate"
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start border-green-200 text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-green-700">
                  Brands/Tags (comma separated)
                </Label>
                <Input
                  id="brand"
                  name="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="React, Next.js, TypeScript"
                  className="border-green-200 focus-visible:ring-green-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-green-700">
                Full Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter the full blog content"
                className="min-h-[200px] border-green-200 focus-visible:ring-green-500"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isFeatured" name="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
              <Label htmlFor="isFeatured" className="text-green-700">
                Feature this blog post
              </Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/blogs")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Blog"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
