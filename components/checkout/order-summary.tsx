"use client"

import { useCart } from "@/components/cart/cart-context"
import { Separator } from "@/components/ui/separator"

interface OrderSummaryProps {
  shippingCost: number
}

export default function OrderSummary({ shippingCost }: OrderSummaryProps) {
  const { cart, total } = useCart()

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.variantId} className="flex justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
              {item.variantTitle && <p className="text-sm text-gray-500">{item.variantTitle}</p>}
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div className="text-sm font-medium text-gray-900">
              £{(Number.parseFloat(item.price) * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>£{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>£{shippingCost.toFixed(2)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-base font-medium">
          <span>Total</span>
          <span>£{(total + shippingCost).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
