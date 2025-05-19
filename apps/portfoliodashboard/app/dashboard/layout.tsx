import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getSession } from "../action/auth"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { jwtDecode } from "jwt-decode"

type Role = "ADMIN" | "USER" 
interface DecodedToken {
  role?: Role;
  [key: string]: unknown;
}
export default async function DashboardLayout({ children }: { children: ReactNode }) {

  const accessToken = await getSession()

  if(!accessToken){
    redirect("/")
  }
  const tokenPayload =  jwtDecode<DecodedToken>(accessToken.token);

  if (!tokenPayload) {
    redirect("/")
  }

  // Check for ADMIN role
  if (tokenPayload?.role !== "ADMIN") {
    redirect("/unauthorized")
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-green-100">
      <DashboardSidebar user={tokenPayload} />
      <div className="flex-1 overflow-auto">
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
