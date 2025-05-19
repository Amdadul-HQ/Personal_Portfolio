"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ImagePlus, Loader2, X } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { getSession } from "@/app/action/auth"

export default function EditSkillPage() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageChanged, setImageChanged] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [name, setName] = useState("")
  const [field, setField] = useState("")

  // Fetch skill data
  useEffect(() => {
    async function fetchSkill() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills/${params?.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch skill")
        }
        const data = await response.json()
        const skillData = data.data

        // Set form state
        setName(skillData.name || "")
        setField(skillData.field || "")

        // Set image preview
        if (skillData.image) {
          setImagePreview(skillData.image)
        }
      } catch (error) {
        console.error("Error fetching skill:", error)
        // toast({
        //   title: "Error",
        //   description: "Failed to fetch skill data. Please try again.",
        //   variant: "destructive",
        // })
      } finally {
        setIsFetching(false)
      }
    }

    fetchSkill()
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
        const accessToken = await getSession()
      // Create the skill data object
      const skillData = {
        name,
        field,
      }

      // Create a new FormData object for the API request
      const apiFormData = new FormData()

      // Add the JSON data as a string in the 'data' field
      apiFormData.append("data", JSON.stringify(skillData))

      // If the image was changed, add the new file
      if (imageChanged) {
        const file = fileInputRef.current?.files?.[0]
        if (file) {
          apiFormData.append("file", file)
        } else if (imagePreview === null) {
          // If image was cleared but no new image was selected
        //   toast({
        //     title: "Error",
        //     description: "Please select a skill icon",
        //     variant: "destructive",
        //   })
          setIsLoading(false)
          return
        }
      }
      if(!accessToken){
      return
     }

      // Send data to API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills/update/${params?.id}`, {
        method: "PATCH",
        body: apiFormData,
        headers:{
         Authorization: `${accessToken.token}`,   
        },
        credentials:"include"
        // Don't set Content-Type header, the browser will set it with the boundary
      })

      console.log(await response.json())

    //   if (!response.ok) {
    //     throw new Error("Failed to update skill")
    //   }

    //   toast({
    //     title: "Skill updated",
    //     description: "Your skill has been updated successfully.",
    //   })

      router.push("/dashboard/skills")
      router.refresh()
    } catch (error) {
      console.error("Error updating skill:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to update skill. Please try again.",
    //     variant: "destructive",
    //   })
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
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
              <div className="flex justify-end space-x-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Edit Skill</h1>
        <p className="text-green-600">Update your skill details</p>
      </div>

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Skill Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-green-700">
                Skill Name
              </Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. React, Node.js, Docker"
                className="border-green-200 focus-visible:ring-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field" className="text-green-700">
                Field
              </Label>
              <Select value={field} onValueChange={setField} required>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FRONTEND">Frontend</SelectItem>
                  <SelectItem value="BACKEND">Backend</SelectItem>
                  <SelectItem value="DEVOPS">DevOps</SelectItem>
                  <SelectItem value="TOOL">Tool</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="file" className="text-green-700">
                Skill Icon
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
                      : "Upload a new icon or leave empty to keep the current one"}
                  </p>
                </div>

                {/* Image Preview */}
                <div className="flex items-center justify-center">
                  {imagePreview ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-md border border-green-200">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Skill icon preview"
                        className="h-full w-full object-contain"
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

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/skills")}
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
                  "Update Skill"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
