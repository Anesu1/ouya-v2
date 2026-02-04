"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch order")
        }

        const data = await response.json()
        setOrder(data.order)
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    )
  }

  if (!orderId) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-8">We couldn't find the order you're looking for.</p>
        <Link href="/">
          <motion.span
            className="inline-block bg-black text-white px-8 py-3 font-medium tracking-wider uppercase hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Return to Home
          </motion.span>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6"
        >
          <CheckCircle className="h-8 w-8 text-green-600" />
        </motion.div>
        <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-4">Thank You for Your Order!</h1>
        <p className="text-gray-600">Your order #{orderId} has been confirmed and will be shipped soon.</p>
      </div>

      {order && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-medium mb-4">Order Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Status:</span>
              <span className="capitalize">{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span>£{(order.total / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <p className="text-gray-600 mb-6">
          We've sent a confirmation email to your email address with all the details of your order.
        </p>
        <Link href="/account/orders">
          <motion.span
            className="inline-block bg-black text-white px-8 py-3 font-medium tracking-wider uppercase hover:bg-gray-800 transition-colors mr-4"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            View Order History
          </motion.span>
        </Link>
        <Link href="/collections/all">
          <motion.span
            className="inline-block bg-white text-black border border-black px-8 py-3 font-medium tracking-wider uppercase hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Continue Shopping
          </motion.span>
        </Link>
      </div>
    </div>
  )
}
