"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Switch } from "@workspace/ui/components/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
import { cn } from "@workspace/ui/lib/utils"

type CreateBlogModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function CreateBlogModal({ isOpen, onClose }: CreateBlogModalProps) {
  const [date, setDate] = useState<Date>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-green-800">Create New Blog Post</DialogTitle>
          <DialogDescription>Fill in the details to create a new blog post.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-green-700">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter blog title"
                className="border-green-200 focus-visible:ring-green-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-green-700">
                Category
              </Label>
              <Select>
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
              placeholder="Enter a brief description"
              className="border-green-200 focus-visible:ring-green-500"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="thumbnail" className="text-green-700">
                Thumbnail URL
              </Label>
              <Input
                id="thumbnail"
                placeholder="Enter image URL"
                className="border-green-200 focus-visible:ring-green-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="readingTime" className="text-green-700">
                Reading Time
              </Label>
              <Input
                id="readingTime"
                placeholder="e.g. 5 min"
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
              <Label htmlFor="topic" className="text-green-700">
                Topic
              </Label>
              <Input
                id="topic"
                placeholder="Enter topic"
                className="border-green-200 focus-visible:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-green-700">
              Full Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter the full blog content"
              className="min-h-[200px] border-green-200 focus-visible:ring-green-500"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isFeatured" />
            <Label htmlFor="isFeatured" className="text-green-700">
              Feature this blog post
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Create Blog
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
