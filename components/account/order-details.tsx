"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

type Order = {
  id: number
  orderId: string
  total: number
  status: string
  createdAt: string
  shippingCarrier: string
  shippingCost: number
  shippingName: string
  shippingAddressLine1: string
  shippingAddressLine2: string | null
  shippingCity: string
  shippingState: string
  shippingPostalCode: string
  shippingCountry: string
  shippingPhone: string
}

type OrderItem = {
  id: number
  title: string
  quantity: number
  price: number
  image: string
  productId: string
}

export default function OrderDetails({
  order,
  items,
}: {
  order: Order
  items: OrderItem[]
}) {
  const [isReorderLoading, setIsReorderLoading] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "paid":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleReorder = async () => {
    setIsReorderLoading(true)

    try {
      // Implementation would add all items to cart
      // This is a placeholder for now
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to cart page
      window.location.href = "/cart"
    } catch (error) {
      console.error("Error reordering:", error)
    } finally {
      setIsReorderLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Order Summary</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              order.status,
            )}`}
          >
            {order.status}
          </span>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Order ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.orderId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
              <dd className="mt-1 text-sm text-gray-900">£{(order.total / 100).toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Payment</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.status === "paid" ? "Paid" : "Pending"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Shipping Carrier</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {order.shippingCarrier} (£
                {(order.shippingCost / 100).toFixed(2)})
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Shipping Details</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Delivery information</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <p>{order.shippingName}</p>
                <p>{order.shippingAddressLine1}</p>
                {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
                <p>
                  {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
                </p>
                <p>{order.shippingCountry}</p>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Contact Information</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <p>Phone: {order.shippingPhone}</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Items purchased in this order</p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          <Link href={`/products/${item.productId}`} className="hover:underline">
                            {item.title}
                          </Link>
                        </h4>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">£{(item.price / 100).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <motion.button
          onClick={handleReorder}
          disabled={isReorderLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isReorderLoading ? "Adding to cart..." : "Buy Again"}
        </motion.button>

        <Link
          href={`/account/orders/${order.orderId}/invoice`}
          className="text-sm font-medium text-black hover:text-gray-700"
        >
          View Invoice
        </Link>
      </div>
    </div>
  )
}
