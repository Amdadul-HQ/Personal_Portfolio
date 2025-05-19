"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { logout } from "@/app/action/auth"

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await logout()

    router.push("/")
    router.refresh()
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  )
}
