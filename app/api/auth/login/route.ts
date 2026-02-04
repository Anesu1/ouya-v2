import { NextResponse } from "next/server"
import { z } from "zod"
import { comparePasswords } from "@/lib/auth"
import { getUserByEmail } from "@/lib/db"
import { cookies } from "next/headers"
import { encode } from "next-auth/jwt"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // Find user by email
    const user = await getUserByEmail(validatedData.email)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 })
    }

    // Verify password
    const passwordValid = await comparePasswords(validatedData.password, user.password)

    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 })
    }

    // Create a JWT token similar to NextAuth
    const token = await encode({
      token: {
        id: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === "ADMIN",
      },
      secret: process.env.NEXTAUTH_SECRET || "fallback-secret-do-not-use-in-production",
    })

    // Set the token as a cookie
    cookies().set({
      name: "next-auth.session-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Login error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
