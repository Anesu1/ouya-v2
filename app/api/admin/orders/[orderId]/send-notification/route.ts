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
    const { type, trackingNumber, customerNote } = await request.json()

    // Get the order
    const order = await prisma.order.findUnique({
      where: { orderId },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { userId: order.userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // In a real application, you would send an email here
    // For now, we'll just log the information
    console.log(`Sending ${type} notification to ${user.email} for order ${orderId}`)
    console.log(`Tracking number: ${trackingNumber || "N/A"}`)
    console.log(`Customer note: ${customerNote || "N/A"}`)

    // Example of how you might send an email using a service like SendGrid or Nodemailer
    // await sendEmail({
    //   to: user.email,
    //   subject: `Your order ${orderId} has been shipped`,
    //   text: `Your order has been shipped. ${trackingNumber ? `Tracking number: ${trackingNumber}` : ''} ${customerNote ? `\n\nNote: ${customerNote}` : ''}`,
    //   html: `<p>Your order has been shipped.</p> ${trackingNumber ? `<p>Tracking number: ${trackingNumber}</p>` : ''} ${customerNote ? `<p>Note: ${customerNote}</p>` : ''}`,
    // })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ error: "Error sending notification" }, { status: 500 })
  }
}
