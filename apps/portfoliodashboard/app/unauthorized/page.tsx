import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4 text-center">
      <div className="mb-6 rounded-full bg-red-100 p-4">
        <ShieldAlert className="h-12 w-12 text-red-600" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-red-600">Access Denied</h1>
      <p className="mb-6 max-w-md text-green-800">
        You don't have permission to access this page. Only administrators can access the dashboard.
      </p>
      <Button asChild className="bg-green-600 hover:bg-green-700">
        <Link href="/">Return to Login</Link>
      </Button>
    </div>
  )
}
