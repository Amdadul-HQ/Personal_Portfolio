"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Briefcase, ChevronLeft, ChevronRight, Code, FileCode, Home, LogOut, Menu, User } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { logout } from "@/app/action/auth"
import { cn } from "@workspace/ui/lib/utils"

type SidebarProps = {
  user?: {
    name?: string
    email?: string
    role?: string
  }
}

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false)
    }
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Blogs", href: "/dashboard/blogs", icon: BookOpen },
    { name: "Projects", href: "/dashboard/projects", icon: Code },
    { name: "Experience", href: "/dashboard/experience", icon: Briefcase },
    { name: "Skills", href: "/dashboard/skills", icon: FileCode },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50 lg:hidden" onClick={toggleSidebar}>
        <Menu className="h-6 w-6 text-green-700" />
      </Button>

      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={isMobile ? { x: -280 } : false}
          animate={
            isMobile ? { x: isMobileOpen ? 0 : -280 } : { width: isCollapsed ? 80 : 280, transition: { duration: 0.3 } }
          }
        //   exit={isMobile ? { x: -280 } : false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-green-200 bg-white shadow-lg lg:relative",
            isMobile ? "w-[280px]" : isCollapsed ? "w-20" : "w-[280px]",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-green-200 px-4">
            {!isCollapsed && !isMobile && <h2 className="text-xl font-bold text-green-800">Admin Panel</h2>}
            {isMobile && <h2 className="text-xl font-bold text-green-800">Admin Panel</h2>}
            {!isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
                {isCollapsed ? (
                  <ChevronRight className="h-5 w-5 text-green-700" />
                ) : (
                  <ChevronLeft className="h-5 w-5 text-green-700" />
                )}
              </Button>
            )}
          </div>

          {/* User Profile */}
          <div
            className={cn(
              "flex items-center border-b border-green-200 p-4",
              isCollapsed && !isMobile ? "justify-center" : "space-x-3",
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
              <User className="h-5 w-5" />
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="overflow-hidden">
                <p className="truncate font-medium text-green-800">{user?.name || "Admin User"}</p>
                <p className="truncate text-xs text-green-600">{user?.email || "admin@example.com"}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMobileSidebar}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 transition-colors",
                        isActive
                          ? "bg-green-100 text-green-800"
                          : "text-green-600 hover:bg-green-50 hover:text-green-700",
                        isCollapsed && !isMobile ? "justify-center px-0" : "",
                      )}
                    >
                      <Icon className={cn("h-5 w-5", isCollapsed && !isMobile ? "mx-0" : "mr-3")} />
                      {(!isCollapsed || isMobile) && <span>{item.name}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="border-t border-green-200 p-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                "w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700",
                isCollapsed && !isMobile ? "justify-center px-0" : "",
              )}
            >
              <LogOut className={cn("h-5 w-5", isCollapsed && !isMobile ? "mx-0" : "mr-3")} />
              {(!isCollapsed || isMobile) && <span>Logout</span>}
            </Button>
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  )
}
