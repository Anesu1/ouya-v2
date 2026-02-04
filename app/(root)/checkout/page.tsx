"use client"

import { useState, useEffect } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useCart } from "@/components/cart/cart-context"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import CheckoutForm from "@/components/checkout/checkout-form"
import { Loader2 } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const { cart, total } = useCart()
  const router = useRouter()
  const { data: session } = useSession()
  const [clientSecret, setClientSecret] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [shippingCost, setShippingCost] = useState(4.99)

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
      router.push("/")
      return
    }

    // Only create payment intent if we don't already have one
    if (clientSecret) {
      setIsLoading(false)
      return
    }

    // Create payment intent
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true)

        // Calculate the correct total (cart total + shipping)
        const totalAmount = total + shippingCost

        console.log("Creating payment intent with:", {
          items: cart,
          amount: total, // Send cart subtotal
          shippingCost: shippingCost,
          totalAmount: totalAmount, // This is for logging
          email: session?.user?.email || "",
        })

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cart,
            amount: total, // Cart subtotal only
            shippingCost: shippingCost,
            email: session?.user?.email || "",
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error("Error creating payment intent:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    createPaymentIntent()
  }, [cart, total, shippingCost, session?.user?.email])

  const handleShippingCostChange = (cost: number) => {
    setShippingCost(cost)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Setting up your checkout...</p>
        </div>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Unable to load checkout. Please try again.</p>
        </div>
      </div>
    )
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} onShippingCostChange={handleShippingCostChange} />
        </Elements>
      </div>
    </div>
  )
}
