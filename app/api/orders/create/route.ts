import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { paymentIntentId, items, shippingAddress, shippingCost, total, userId } = body

    // Validate required fields
    if (!paymentIntentId || !items || !shippingAddress || total === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate a unique order ID
    const orderId = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`

    // Create the order
    const order = await prisma.order.create({
      data: {
        orderId,
        userId: userId || session?.user?.id || "guest",
        total: Math.round(total * 100), // Store in cents
        status: "confirmed",
        shippingCarrier: "standard",
        shippingCost: Math.round(shippingCost * 100), // Store in cents
        shippingName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        shippingAddressLine1: shippingAddress.address,
        shippingAddressLine2: "",
        shippingCity: shippingAddress.city,
        shippingState: "",
        shippingPostalCode: shippingAddress.postalCode,
        shippingCountry: shippingAddress.country,
        shippingPhone: shippingAddress.phone || "",
        items: {
          create: items.map((item: any) => ({
            productId: item.id || "unknown-product",
            variantId: item.variantId || "default-variant",
            title: item.title,
            quantity: item.quantity,
            price: Math.round(Number.parseFloat(item.price) * 100 * item.quantity), // Store price in cents
            image: item.image || "/placeholder.svg",
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json({
      order: {
        id: order.orderId,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
      },
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
