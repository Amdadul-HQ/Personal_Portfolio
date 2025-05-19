"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { getSession } from "@/app/action/auth"

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageChanged, setImageChanged] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("")
  const [liveLink, setLiveLink] = useState("")
  const [gitHubLink, setGitHubLink] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [elements, setElements] = useState("")
  const [totalCode, setTotalCode] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)

  // Arrays for features, services, and technologies
  const [features, setFeatures] = useState<string[]>([])
  const [featureInput, setFeatureInput] = useState("")

  const [services, setServices] = useState<string[]>([])
  const [serviceInput, setServiceInput] = useState("")

  const [technologies, setTechnologies] = useState<string[]>([])
  const [technologyInput, setTechnologyInput] = useState("")

  // Fetch project data
  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${params?.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch project")
        }
        const data = await response.json()
        const projectData = data.data

        // Set form state
        setName(projectData.name || "")
        setDescription(projectData.description || "")
        setType(projectData.type || "")
        setLiveLink(projectData.liveLink || "")
        setGitHubLink(projectData.gitHubLink || "")
        setElements(projectData.elements?.toString() || "")
        setTotalCode(projectData.totalCode?.toString() || "")
        setIsFeatured(projectData.isFeatured || false)

        // Set arrays
        setFeatures(projectData.features || [])
        setServices(projectData.services || [])
        setTechnologies(projectData.techonology || [])

        // Set dates
        if (projectData.projectStartDate) {
          setStartDate(new Date(projectData.projectStartDate))
        }
        if (projectData.projectEndDate) {
          setEndDate(new Date(projectData.projectEndDate))
        }

        // Set image preview
        if (projectData.siteMockup) {
          setImagePreview(projectData.siteMockup)
        }
      } catch (error) {
        console.error("Error fetching project:", error)
        // toast({
        //   title: "Error",
        //   description: "Failed to fetch project data. Please try again.",
        //   variant: "destructive",
        // })
      } finally {
        setIsFetching(false)
      }
    }

    fetchProject()
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
      const accessToken = await getSession()
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
        name,
        description,
        type,
        liveLink,
        gitHubLink,
        projectStartDate: startDate.toISOString(),
        projectEndDate: endDate.toISOString(),
        elements: Number.parseInt(elements) || 0,
        totalCode: Number.parseInt(totalCode) || 0,
        isFeatured,
        features,
        services,
        techonology: technologies,
      }

      // Create a new FormData object for the API request
      const apiFormData = new FormData()

      // Add the JSON data as a string in the 'data' field
      apiFormData.append("data", JSON.stringify(projectData))

      // If the image was changed, add the new file
      if (imageChanged) {
        const file = fileInputRef.current?.files?.[0]
        if (file) {
          apiFormData.append("file", file)
        } else if (imagePreview === null) {
          // If image was cleared but no new image was selected
        //   toast({
        //     title: "Error",
        //     description: "Please select a site mockup image",
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/update/${params?.id}`, {
        method: "PATCH",
        body: apiFormData,
         headers:{
         Authorization: `${accessToken.token}`,   
        },
        credentials:"include"
        // Don't set Content-Type header, the browser will set it with the boundary
      })

    //   if (!response.ok) {
    //     throw new Error("Failed to update project")
    //   }

    //   toast({
    //     title: "Project updated",
    //     description: "Your project has been updated successfully.",
    //   })

      router.push("/dashboard/projects")
      router.refresh()
    } catch (error) {
      console.error("Error updating project:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to update project. Please try again.",
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Edit Project</h1>
        <p className="text-green-600">Update your project details</p>
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter project name"
                  className="border-green-200 focus-visible:ring-green-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-green-700">
                  Project Type
                </Label>
                <Select value={type} onValueChange={setType}>
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
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
                  value={gitHubLink}
                  onChange={(e) => setGitHubLink(e.target.value)}
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
                      : "Upload a new mockup image or leave empty to keep the current one"}
                  </p>
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
                      <p className="text-sm text-green-600">No image selected</p>
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
                  value={elements}
                  onChange={(e) => setElements(e.target.value)}
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
                  value={totalCode}
                  onChange={(e) => setTotalCode(e.target.value)}
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
              <Switch id="isFeatured" name="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
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
                    Updating...
                  </>
                ) : (
                  "Update Project"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
