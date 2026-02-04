import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// This endpoint returns details for a specific order
export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  try {
    // Verify Sanity Studio token
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Missing or invalid token" }, { status: 401 })
    }

    const { orderId } = params

    // Get the order
    const order = await prisma.order.findFirst({
      where: {
        orderId: orderId,
      },
    })

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Get the order items
    const items = await prisma.orderItem.findMany({
      where: {
        orderId: orderId,
      },
    })

    // Get user information
    const user = await prisma.user.findFirst({
      where: {
        userId: order.userId,
      },
      select: {
        name: true,
        email: true,
      },
    })

    return NextResponse.json({
      order: {
        ...order,
        items,
        user,
      },
    })
  } catch (error) {
    console.error("Error fetching order details:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
