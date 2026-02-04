import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// This endpoint updates the status of a specific order
export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  try {
    // Verify Sanity Studio token
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Missing or invalid token" }, { status: 401 })
    }

    const { orderId } = params
    const { status } = await request.json()

    // Validate status
    const validStatuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 })
    }

    // Update the order status
    await prisma.order.update({
      where: {
        orderId: orderId,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
