import { NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma, getUserByEmail } from "@/lib/prisma"

const updateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
})

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateSchema.parse(body)

    // Check if email is already taken by another user
    if (validatedData.email !== session.user.email) {
      const existingUser = await getUserByEmail(validatedData.email)

      if (existingUser && existingUser.userId !== session.user.id) {
        return NextResponse.json({ error: "Email is already in use" }, { status: 400 })
      }
    }

    // Update user
    await prisma.user.update({
      where: { userId: session.user.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Update error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
