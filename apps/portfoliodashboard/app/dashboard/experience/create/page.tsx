"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, ImagePlus, Loader2, Plus, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import { getSession } from "@/app/action/auth"

export default function CreateExperiencePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Skills array
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")

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

  // Add skill
  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput("")
    }
  }

  // Remove skill
  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  // Handle key down for skill input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
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
        //   description: "Please select a company image",
        //   variant: "destructive",
        // })
        setIsLoading(false)
        return
      }

      if (!startDate || !endDate) {
        // toast({
        //   title: "Error",
        //   description: "Please select both start and end dates",
        //   variant: "destructive",
        // })
        setIsLoading(false)
        return
      }

      // Create the experience data object
      const experienceData = {
        role: formData.get("role") as string,
        company: formData.get("company") as string,
        description: formData.get("description") as string,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        skill: skills,
      }

      // Create a new FormData object for the API request
      const apiFormData = new FormData()

      // Add the file with the field name 'file' as expected by the API
      apiFormData.append("file", file)

      // Add the JSON data as a string in the 'data' field
      apiFormData.append("data", JSON.stringify(experienceData))

      if(!accessToken){
        return
      }

      // Send data to API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/experience/create`, {
        method: "POST",
        body: apiFormData,
         headers:{
         Authorization: `${accessToken.token}`,   
        },
        credentials:"include"
        // Don't set Content-Type header, the browser will set it with the boundary
      })
      console.log(await response.json())
    //   if (!response.ok) {
    //     throw new Error("Failed to create experience")
    //   }

    //   toast({
    //     title: "Experience added",
    //     description: "Your work experience has been added successfully.",
    //   })

      router.push("/dashboard/experience")
      router.refresh()
    } catch (error) {
      console.error("Error creating experience:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to add experience. Please try again.",
    //     variant: "destructive",
    //   })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Add Work Experience</h1>
        <p className="text-green-600">Fill in the details to add a new work experience</p>
      </div>

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Experience Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-green-700">
                  Role
                </Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="e.g. Senior Developer"
                  className="border-green-200 focus-visible:ring-green-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-green-700">
                  Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="e.g. Acme Inc."
                  className="border-green-200 focus-visible:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="file" className="text-green-700">
                Company Image
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
                  <p className="mt-1 text-xs text-green-600">Upload a company logo or image (JPG, PNG, WebP)</p>
                </div>

                {/* Image Preview */}
                <div className="flex items-center justify-center">
                  {imagePreview ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-md border border-green-200">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Company logo preview"
                        className="h-full w-full object-contain"
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

            <div className="space-y-2">
              <Label htmlFor="description" className="text-green-700">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your responsibilities and achievements"
                className="min-h-[120px] border-green-200 focus-visible:ring-green-500"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-green-700">
                  Start Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="startDate"
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start border-green-200 text-left font-normal",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-green-700">
                  End Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="endDate"
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start border-green-200 text-left font-normal",
                        !endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-green-700">
                Skills
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="skills"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. React, Node.js"
                  className="border-green-200 focus-visible:ring-green-500"
                />
                <Button type="button" onClick={addSkill} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} className="bg-green-100 text-green-700">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 rounded-full p-1 hover:bg-green-200"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {skill}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/experience")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Experience"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
