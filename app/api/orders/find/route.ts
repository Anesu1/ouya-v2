import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")
    const paymentIntent = searchParams.get("paymentIntent")

    if (!orderId && !paymentIntent) {
      return NextResponse.json({ error: "Missing orderId or paymentIntent parameter" }, { status: 400 })
    }

    let order
    if (orderId) {
      order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: true,
        },
      })
    } else if (paymentIntent) {
      order = await prisma.order.findFirst({
        where: { paymentIntentId: paymentIntent },
        include: {
          items: true,
        },
      })
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Convert cents to pounds for display
    const formattedOrder = {
      ...order,
      total: order.total / 100,
      shippingCost: order.shippingCost / 100,
      items: order.items.map((item) => ({
        ...item,
        price: item.price / 100,
      })),
    }

    return NextResponse.json(formattedOrder)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
