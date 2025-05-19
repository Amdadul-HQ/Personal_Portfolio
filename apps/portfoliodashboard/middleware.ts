import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {jwtDecode} from "jwt-decode"
// Define which routes are protected
const protectedRoutes = ["/dashboard"]

type Role = "ADMIN" | "USER" 

interface DecodedToken {
  role?: Role;
  [key: string]: unknown;
}

export function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => currentPath === route || currentPath.startsWith(`${route}/`))

  if (isProtectedRoute) {
    // Get the auth token from cookies
    const accessToken = request.cookies.get("accessToken")?.value

    // If there's no token, redirect to login
    if (!accessToken) {
      const url = new URL("/", request.url)
      return NextResponse.redirect(url)
    }

    try {
      // Decode the JWT token to get the user's role
      // Note: This is a simple decode, not a verification
      // In production, you should use a proper JWT library to verify the token

      const tokenPayload =  jwtDecode<DecodedToken>(accessToken);


      // Check if the user is an admin
      if (tokenPayload.role !== "ADMIN") {
        // If not admin, redirect to unauthorized page
        const url = new URL("/unauthorized", request.url)
        return NextResponse.redirect(url)
      }

      // If admin, allow access to the dashboard
    } catch (error) {
      // If token is invalid, redirect to login
      const url = new URL("/", request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
