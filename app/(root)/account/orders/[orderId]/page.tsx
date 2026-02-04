import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import OrderDetails from "@/components/account/order-details"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Session } from "next-auth"

interface CustomSession extends Session {
  user?: {
    id: string
    email: string
    name?: string | null
  }
}

export const metadata = {
  title: "Order Details | Ouya Oenda",
  description: "View your order details",
}

export default async function OrderDetailsPage({
  params,
}: {
  params: { orderId: string }
}) {
  const session = (await getServerSession(authOptions)) as CustomSession

  if (!session || !session.user) {
    redirect("/login")
  }

  // Ensure params is awaited
  const orderId = await Promise.resolve(params.orderId)

  // Get the order
  const order = await prisma.order.findFirst({
    where: {
      orderId: orderId,
      userId: session.user.id,
    },
  })

  if (!order) {
    notFound()
  }

  // Get the order items
  const items = await prisma.orderItem.findMany({
    where: {
      orderId: orderId,
    },
  })

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/account/orders" className="flex items-center text-black hover:text-gray-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </div>

        <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-8">Order #{orderId}</h1>

        <OrderDetails order={order} items={items} />
      </div>
    </div>
  )
}
