import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// This endpoint returns details for a specific user
export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    // Verify Sanity Studio token
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Missing or invalid token" }, { status: 401 })
    }

    const { userId } = params

    // Get the user
    const user = await prisma.user.findFirst({
      where: {
        userId: userId,
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Get user's orders
    const userOrders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get user's addresses
    const userAddresses = await prisma.address.findMany({
      where: {
        userId: userId,
      },
    })

    return NextResponse.json({
      user: {
        ...user,
        orders: userOrders,
        addresses: userAddresses,
      },
    })
  } catch (error) {
    console.error("Error fetching user details:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
