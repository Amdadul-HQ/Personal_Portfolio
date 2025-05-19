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
import { Switch } from "@workspace/ui/components/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import { getSession } from "@/app/action/auth"

export default function CreateProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Arrays for features, services, and technologies
  const [features, setFeatures] = useState<string[]>([])
  const [featureInput, setFeatureInput] = useState("")

  const [services, setServices] = useState<string[]>([])
  const [serviceInput, setServiceInput] = useState("")

  const [technologies, setTechnologies] = useState<string[]>([])
  const [technologyInput, setTechnologyInput] = useState("")

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

  // Add item to array
  const addItem = (
    item: string,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>,
    setInput: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (item.trim() && !array.includes(item.trim())) {
      setArray([...array, item.trim()])
      setInput("")
    }
  }

  // Remove item from array
  const removeItem = (item: string, array: string[], setArray: React.Dispatch<React.SetStateAction<string[]>>) => {
    setArray(array.filter((i) => i !== item))
  }

  // Handle key down for input fields
  const handleKeyDown = (
    e: React.KeyboardEvent,
    input: string,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>,
    setInput: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addItem(input, array, setArray, setInput)
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
        //   description: "Please select a site mockup image",
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

      // Create the project data object
      const projectData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        type: formData.get("type") as string,
        liveLink: formData.get("liveLink") as string,
        gitHubLink: formData.get("gitHubLink") as string,
        projectStartDate: startDate.toISOString(),
        projectEndDate: endDate.toISOString(),
        elements: Number.parseInt(formData.get("elements") as string) || 0,
        totalCode: Number.parseInt(formData.get("totalCode") as string) || 0,
        isFeatured: formData.get("isFeatured") === "on",
        features,
        services,
        techonology: technologies,
      }

      // Create a new FormData object for the API request
      const apiFormData = new FormData()

      // Add the file with the field name 'file' as expected by the API
      apiFormData.append("file", file)

      // Add the JSON data as a string in the 'data' field
      apiFormData.append("data", JSON.stringify(projectData))

      if(!accessToken){
        return
      }

      // Send data to API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/create`, {
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
    //     throw new Error("Failed to create project")
    //   }

    //   toast({
    //     title: "Project created",
    //     description: "Your project has been created successfully.",
    //   })

      router.push("/dashboard/projects")
      router.refresh()
    } catch (error) {
      console.error("Error creating project:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to create project. Please try again.",
    //     variant: "destructive",
    //   })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Create New Project</h1>
        <p className="text-green-600">Fill in the details to add a new project to your portfolio</p>
      </div>

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-green-700">
                  Project Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter project name"
                  className="border-green-200 focus-visible:ring-green-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-green-700">
                  Project Type
                </Label>
                <Select name="type">
                  <SelectTrigger className="border-green-200 focus:ring-green-500">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web Application">Web Application</SelectItem>
                    <SelectItem value="Mobile App">Mobile App</SelectItem>
                    <SelectItem value="Desktop Application">Desktop Application</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-green-700">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter project description"
                className="border-green-200 focus-visible:ring-green-500"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="liveLink" className="text-green-700">
                  Live Link
                </Label>
                <Input
                  id="liveLink"
                  name="liveLink"
                  placeholder="https://example.com"
                  className="border-green-200 focus-visible:ring-green-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gitHubLink" className="text-green-700">
                  GitHub Link
                </Label>
                <Input
                  id="gitHubLink"
                  name="gitHubLink"
                  placeholder="https://github.com/username/repo"
                  className="border-green-200 focus-visible:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="file" className="text-green-700">
                Site Mockup Image
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
                  <p className="mt-1 text-xs text-green-600">Upload a mockup image for your project (JPG, PNG, WebP)</p>
                </div>

                {/* Image Preview */}
                <div className="flex items-center justify-center">
                  {imagePreview ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-md border border-green-200">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Mockup preview"
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
                <Label htmlFor="projectStartDate" className="text-green-700">
                  Start Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="projectStartDate"
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
                <Label htmlFor="projectEndDate" className="text-green-700">
                  End Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="projectEndDate"
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="elements" className="text-green-700">
                  Elements
                </Label>
                <Input
                  id="elements"
                  name="elements"
                  type="number"
                  placeholder="Number of elements"
                  className="border-green-200 focus-visible:ring-green-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalCode" className="text-green-700">
                  Total Code
                </Label>
                <Input
                  id="totalCode"
                  name="totalCode"
                  type="number"
                  placeholder="Lines of code"
                  className="border-green-200 focus-visible:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label htmlFor="features" className="text-green-700">
                Features
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="features"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, featureInput, features, setFeatures, setFeatureInput)}
                  placeholder="e.g. User Authentication"
                  className="border-green-200 focus-visible:ring-green-500"
                />
                <Button
                  type="button"
                  onClick={() => addItem(featureInput, features, setFeatures, setFeatureInput)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {features.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <Badge key={index} className="bg-green-100 text-green-700">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeItem(feature, features, setFeatures)}
                        className="ml-1 rounded-full p-1 hover:bg-green-200"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {feature}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Services */}
            <div className="space-y-2">
              <Label htmlFor="services" className="text-green-700">
                Services
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="services"
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, serviceInput, services, setServices, setServiceInput)}
                  placeholder="e.g. Frontend Development"
                  className="border-green-200 focus-visible:ring-green-500"
                />
                <Button
                  type="button"
                  onClick={() => addItem(serviceInput, services, setServices, setServiceInput)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {services.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {services.map((service, index) => (
                    <Badge key={index} className="bg-green-100 text-green-700">
                      {service}
                      <button
                        type="button"
                        onClick={() => removeItem(service, services, setServices)}
                        className="ml-1 rounded-full p-1 hover:bg-green-200"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {service}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <Label htmlFor="technologies" className="text-green-700">
                Technologies
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="technologies"
                  value={technologyInput}
                  onChange={(e) => setTechnologyInput(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, technologyInput, technologies, setTechnologies, setTechnologyInput)
                  }
                  placeholder="e.g. React, Node.js"
                  className="border-green-200 focus-visible:ring-green-500"
                />
                <Button
                  type="button"
                  onClick={() => addItem(technologyInput, technologies, setTechnologies, setTechnologyInput)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {technologies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {technologies.map((technology, index) => (
                    <Badge key={index} className="bg-green-100 text-green-700">
                      {technology}
                      <button
                        type="button"
                        onClick={() => removeItem(technology, technologies, setTechnologies)}
                        className="ml-1 rounded-full p-1 hover:bg-green-200"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {technology}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isFeatured" name="isFeatured" />
              <Label htmlFor="isFeatured" className="text-green-700">
                Feature this project
              </Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/projects")}
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
                  "Create Project"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
