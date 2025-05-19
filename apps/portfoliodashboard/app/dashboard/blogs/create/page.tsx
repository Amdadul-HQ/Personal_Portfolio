"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
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
import { cn } from "@workspace/ui/lib/utils"
import { getSession } from "@/app/action/auth"

export default function CreateBlogPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date>()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  // Clear selected image
  const clearImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formEl = e.currentTarget
      const formData = new FormData(formEl)
      const accessToken = await getSession()

      // Get the file from the form
      const file = fileInputRef.current?.files?.[0]

      if (!file) {
        // toast({
        //   title: "Error",
        //   description: "Please select a thumbnail image",
        //   variant: "destructive",
        // })
        setIsLoading(false)
        return
      }

      // Create the blog data object
      const blogData = {
        title: formData.get("title"),
        shortDescription: formData.get("shortDescription"),
        description: formData.get("description"),
        topic: formData.get("topic"),
        readingTime: formData.get("readingTime"),
        category: formData.get("category"),
        isFeatured: formData.get("isFeatured") === "on",
        publishDate: date?.toISOString() || new Date().toISOString(),
        brand:
          formData
            .get("brand")
            ?.toString()
            .split(",")
            .map((item) => item.trim()) || [],
      }

      // Create a new FormData object for the API request
      const apiFormData = new FormData()

      // Add the file with the field name 'file' as expected by the API
      apiFormData.append("file", file)

      // Add the JSON data as a string in the 'data' field
      apiFormData.append("data", JSON.stringify(blogData))

      if(!accessToken){
        return
      }

      // Send data to API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/create`, {
        method: "POST",
        body: apiFormData,
        headers:{
         Authorization: `${accessToken.token}`,   
        },
        // Don't set Content-Type header, the browser will set it with the boundary
        credentials:"include"
      })

      // if (!response.ok) {
      //   throw new Error("Failed to create blog")
      // }

    //   toast({
    //     title: "Blog created",
    //     description: "Your blog post has been created successfully.",
    //   })

      router.push("/dashboard/blogs")
      router.refresh()
    } catch (error) {
      console.error("Error creating blog:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to create blog post. Please try again.",
    //     variant: "destructive",
    //   })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Create New Blog</h1>
        <p className="text-green-600">Fill in the details to create a new blog post</p>
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
                  placeholder="Enter blog title"
                  className="border-green-200 focus-visible:ring-green-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-green-700">
                  Category
                </Label>
                <Select name="category">
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
                      required
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
                    Upload a thumbnail image for your blog post (JPG, PNG, WebP)
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
                      <p className="text-sm text-green-600">Image preview will appear here</p>
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
                placeholder="Enter the full blog content"
                className="min-h-[200px] border-green-200 focus-visible:ring-green-500"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isFeatured" name="isFeatured" />
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
                    Creating...
                  </>
                ) : (
                  "Create Blog"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
