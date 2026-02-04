import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import AdminOrderDetails from "@/components/admin/order-details"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Order Details | Admin Dashboard",
  description: "View and manage order details",
}

// Helper function to check if a user is an admin
function isUserAdmin(email: string): boolean {
  // List of admin emails - in production, this should come from your database
  const adminEmails = ["admin@example.com"]
  return adminEmails.includes(email)
}

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: { orderId: string }
}) {
  const session = await getServerSession(authOptions)

  // Check if user is admin
  if (!session?.user || !isUserAdmin(session.user.email)) {
    redirect("/login?returnUrl=/admin")
  }

  // Get the order
  const order = await prisma.order.findFirst({
    where: {
      orderId: params.orderId,
    },
  })

  if (!order) {
    notFound()
  }

  // Get the order items
  const items = await prisma.orderItem.findMany({
    where: {
      orderId: params.orderId,
    },
  })

  // Get user information
  const user = await prisma.user.findFirst({
    where: {
      userId: order.userId,
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/admin" className="flex items-center text-black hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-semibold mb-8">Order #{params.orderId}</h1>

      <AdminOrderDetails order={order} items={items} user={user} />
    </div>
  )
}
