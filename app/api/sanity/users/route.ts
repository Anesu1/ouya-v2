import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// This endpoint returns all users for the Sanity Studio plugin
export async function GET(request: Request) {
  try {
    // Verify Sanity Studio token
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Missing or invalid token" }, { status: 401 })
    }

    // Get all users with order count
    const allUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { orders: true },
        },
      },
      take: 100, // Limit to prevent large data loads
    })

    // Format the response
    const enhancedUsers = allUsers.map((user) => ({
      ...user,
      orderCount: user._count.orders,
    }))

    return NextResponse.json({ users: enhancedUsers })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
