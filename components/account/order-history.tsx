"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Loader2 } from "lucide-react"

type Order = {
  id: number
  orderId: string
  total: number
  status: string
  createdAt: string
  items: {
    id: number
    title: string
    quantity: number
    price: number
    image: string
  }[]
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

export default function OrderHistory({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/account/orders?userId=${userId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }

        const data = await response.json()
        setOrders(data.orders)
      } catch (err) {
        setError("Failed to load order history. Please try again later.")
        console.error("Error fetching orders:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [userId])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">No orders yet</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>You haven't placed any orders yet.</p>
          </div>
          <div className="mt-5">
            <Link
              href="/collections/all"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Start shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order.orderId} className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order #{order.orderId}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Placed{" "}
                {formatDistanceToNow(new Date(order.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {order.status}
              </span>
              <p className="mt-1 text-sm font-medium text-gray-900">Total: £{(order.total / 100).toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {order.items.map((item) => (
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
                        <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm font-medium text-gray-900">${(item.price / 100).toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
            <div className="flex justify-between">
              <Link
                href={`/account/orders/${order.orderId}`}
                className="text-sm font-medium text-black hover:text-gray-700"
              >
                View order details
              </Link>
              <button
                className="text-sm font-medium text-black hover:text-gray-700"
                onClick={() => {
                  // Implement reorder functionality
                  console.log("Reorder:", order.orderId)
                }}
              >
                Buy again
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
