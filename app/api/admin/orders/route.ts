import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// Helper function to check if a user is an admin
function isUserAdmin(email: string): boolean {
  // List of admin emails - in production, this should come from your database
  const adminEmails = ["admin@example.com"]
  return adminEmails.includes(email)
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user?.email || !isUserAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all orders
    const allOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    })

    return NextResponse.json({ orders: allOrders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
