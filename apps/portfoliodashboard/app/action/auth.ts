"use server"

import { cookies } from "next/headers"

// Call the real API endpoint for authentication
export async function login(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const authSecret = formData.get("authSecret") as string

    // Validate required fields
    if (!email || !password || !authSecret) {
      return {
        success: false,
        error: "Email, password, and auth secret are required",
      }
    }

    // Call the API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        authSecret,
      }),
      cache: "no-store",
    })

    const data = await response.json()


    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Authentication failed",
      }
    }

    // The API sets the refreshToken as a cookie automatically
    // We need to set the accessToken as a cookie on the client
    (await cookies()).set("accessToken", data.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function logout() {
  (await cookies()).delete("accessToken")
  ;(await cookies()).delete("refeshToken") // Also delete the refresh token set by the API
  return { success: true }
}

export async function getSession() {
  const token = (await cookies()).get("accessToken")?.value

  if (!token) {
    return null
  }

  try {
    // In a real implementation, you would decode and verify the JWT
    // For now, we'll assume the token is valid if it exists
    // You might want to add JWT verification logic here

    return {
      isAuthenticated: true,
      // You can add more user info here if needed
    }
  } catch (error) {
    (await cookies()).delete("accessToken")
    return null
  }
}
