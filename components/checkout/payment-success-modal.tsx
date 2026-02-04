"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Package, Mail, CreditCard } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface PaymentSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  orderData: {
    orderId: string
    total: number
    email: string
    items: Array<{
      name: string
      quantity: number
      price: number
    }>
  }
}

export default function PaymentSuccessModal({ isOpen, onClose, orderData }: PaymentSuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100"
            >
              <CheckCircle className="h-8 w-8 text-green-600" />
            </motion.div>
          </div>
          <DialogTitle className="text-2xl font-semibold text-gray-900">Payment Successful!</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Confetti Animation */}
          <AnimatePresence>
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-green-500 rounded-full"
                    initial={{
                      x: Math.random() * 400,
                      y: -10,
                      rotate: 0,
                    }}
                    animate={{
                      y: 500,
                      rotate: 360,
                    }}
                    transition={{
                      duration: 3,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-900">Order #{orderData.orderId}</span>
            </div>

            <div className="space-y-2">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-gray-900">£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="flex justify-between font-semibold">
              <span>Total Paid</span>
              <span>£{orderData.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Confirmation Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                Confirmation sent to <span className="font-medium">{orderData.email}</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Payment processed securely via Stripe</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href={`/account/orders/${orderData.orderId}`} className="block">
              <Button className="w-full bg-black text-white hover:bg-gray-800">View Order Details</Button>
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/collections/all">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>

              <Button variant="outline" onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
