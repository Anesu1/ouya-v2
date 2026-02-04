import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const { orderId } = params

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if user has access to this order
    if (order.userId && session?.user?.id !== order.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Convert cents back to pounds for display
    const orderWithPounds = {
      ...order,
      total: order.total / 100,
      shippingCost: order.shippingCost / 100,
      items: order.items.map((item: any) => ({
        ...item,
        price: item.price / 100,
      })),
    }

    return NextResponse.json({ order: orderWithPounds })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}
