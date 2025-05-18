"use client"

import { useEffect } from "react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl">Something went wrong</CardTitle>
          <CardDescription className="mt-2">
            We encountered an error while processing your request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 overflow-auto max-h-32">
            {error.message || "An unexpected error occurred"}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default" className="w-full sm:w-auto">
            Try again
          </Button>
          <Button onClick={() => window.location.href = "/"} variant="outline" className="w-full sm:w-auto">
            Go to homepage
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
