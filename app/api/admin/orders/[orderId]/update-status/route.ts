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

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user?.email || !isUserAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId } = params
    const { status, trackingNumber, customerNote } = await request.json()

    // Update the order status
    await prisma.order.update({
      where: { orderId },
      data: {
        status,
        updatedAt: new Date(),
        // You would need to add these fields to your orders table in Prisma schema
        // trackingNumber: trackingNumber || null,
        // customerNote: customerNote || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ error: "Error updating order status" }, { status: 500 })
  }
}
