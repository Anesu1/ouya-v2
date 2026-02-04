import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import type { Session } from "next-auth"

interface CustomSession extends Session {
  user: {
    id: string
    email: string
    name: string
  }
}

export async function GET(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all orders for the user with items
    const userOrders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    })

    return NextResponse.json({ orders: userOrders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
