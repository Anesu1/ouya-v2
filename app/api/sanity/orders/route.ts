import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// This endpoint returns all orders for the Sanity Studio plugin
export async function GET(request: Request) {
  try {
    // Verify Sanity Studio token
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Missing or invalid token" }, { status: 401 })
    }

    // Get all orders with basic user information
    const allOrders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100, // Limit to prevent large data loads
    })

    // Enhance orders with user information
    const enhancedOrders = await Promise.all(
      allOrders.map(async (order) => {
        // Get user information for each order
        const user = await prisma.user.findFirst({
          where: {
            userId: order.userId,
          },
          select: {
            name: true,
            email: true,
          },
        })

        return {
          ...order,
          shippingEmail: user?.email,
        }
      }),
    )

    return NextResponse.json({ orders: enhancedOrders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
