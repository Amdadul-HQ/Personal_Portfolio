"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { login } from "@/app/action/auth"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    try {
      const result = await login(formData)

      if (result.success) {
        // toast({
        //   title: "Login successful",
        //   description: "Redirecting to dashboard...",
        //   variant: "default",
        // })
        router.push("/dashboard")
        router.refresh()
      } else {
        // toast({
        //   title: "Login failed",
        //   description: result.error || "Please check your credentials and try again",
        //   variant: "destructive",
        // })
      }
    } catch (error) {
    //   toast({
    //     title: "Something went wrong",
    //     description: "Please try again later",
    //     variant: "destructive",
    //   })
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-green-800">Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-green-700">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="border-green-200 focus-visible:ring-green-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-green-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="border-green-200 focus-visible:ring-green-500 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-green-600 hover:text-green-800"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="authSecret" className="text-green-700">
              Auth Secret
            </Label>
            <Input
              id="authSecret"
              name="authSecret"
              type="text"
              required
              className="border-green-200 focus-visible:ring-green-500"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

