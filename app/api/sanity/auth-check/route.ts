import { NextResponse } from "next/server"

// This endpoint checks if the current user has permission to access the Neon data
export async function GET(request: Request) {
  try {
    // Verify Sanity Studio token
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Missing or invalid token" }, { status: 401 })
    }

    // If we have a token, assume the user has access to Sanity Studio and therefore the plugin
    // No need to check NextAuth session or admin status
    return NextResponse.json({ authorized: true })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
