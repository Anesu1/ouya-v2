"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ProcessingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const paymentIntent = searchParams.get("payment_intent")
    const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret")
    const redirectStatus = searchParams.get("redirect_status")

    if (redirectStatus === "succeeded" && paymentIntent) {
      // Redirect to success page
      router.push(`/checkout/success?payment_intent=${paymentIntent}`)
    } else if (redirectStatus === "failed") {
      // Redirect back to checkout with error
      router.push("/checkout?error=payment_failed")
    } else {
      // Unknown status, redirect to home
      router.push("/")
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-black mx-auto mb-4" />
        <p className="text-gray-600">Processing your payment...</p>
      </div>
    </div>
  )
}
