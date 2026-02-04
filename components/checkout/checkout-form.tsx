"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { useCart } from "@/components/cart/cart-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import ShippingOptions from "./shipping-options"
import OrderSummary from "./order-summary"
import PaymentSuccessModal from "./payment-success-modal"

interface CheckoutFormProps {
  clientSecret: string
  onShippingCostChange: (cost: number) => void
}

// Common countries for the select dropdown
const countries = [
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "LU", name: "Luxembourg" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "HK", name: "Hong Kong" },
  { code: "NZ", name: "New Zealand" },
]

export default function CheckoutForm({ clientSecret, onShippingCostChange }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { cart, total, clearCart } = useCart()
  const router = useRouter()
  const { data: session } = useSession()

  const [isLoading, setIsLoading] = useState(false)
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false)
  const [message, setMessage] = useState("")
  const [shippingCost, setShippingCost] = useState(0)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "GB",
  })

  // Calculate total cost (cart total + shipping)
  const totalCost = total + shippingCost

  // Refs to track the last values sent to prevent duplicate calls
  const lastUpdateRef = useRef<{
    shippingCost: number
    email: string
    total: number
  } | null>(null)

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Extract payment intent ID from client secret
  useEffect(() => {
    if (clientSecret) {
      const piId = clientSecret.split("_secret_")[0]
      setPaymentIntentId(piId)
    }
  }, [clientSecret])

  // Update parent component when shipping cost changes
  useEffect(() => {
    onShippingCostChange(shippingCost)
  }, [shippingCost])

  // Debounced update payment intent function
  const debouncedUpdatePaymentIntent = useCallback((newShippingCost: number, email: string, cartTotal: number) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      updatePaymentIntent(newShippingCost, email, cartTotal)
    }, 1000) // Increased debounce time to 1 second
  }, []) // Remove dependencies to prevent recreation

  // Update payment intent when shipping cost or email changes
  const updatePaymentIntent = useCallback(
    async (newShippingCost: number, email: string, cartTotal: number) => {
      if (!paymentIntentId) {
        console.log("No payment intent ID available")
        return
      }

      // Check if values have actually changed
      const currentValues = {
        shippingCost: newShippingCost,
        email: email,
        total: cartTotal,
      }

      if (
        lastUpdateRef.current &&
        lastUpdateRef.current.shippingCost === currentValues.shippingCost &&
        lastUpdateRef.current.email === currentValues.email &&
        lastUpdateRef.current.total === currentValues.total
      ) {
        console.log("No changes detected, skipping update")
        return
      }

      // Don't update if email is empty (wait for user to enter it)
      if (!email.trim()) {
        console.log("Email is empty, skipping update")
        return
      }

      setIsUpdatingPayment(true)
      try {
        console.log("Updating payment intent with:", {
          amount: cartTotal,
          shippingCost: newShippingCost,
          totalAmount: cartTotal + newShippingCost,
        })

        const response = await fetch("/api/update-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId,
            amount: cartTotal, // Send cart subtotal
            shippingCost: newShippingCost,
            email,
            items: cart,
          }),
        })

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response")
        }

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `HTTP error! status: ${response.status}`)
        }

        // Update the last sent values
        lastUpdateRef.current = currentValues
        console.log("Payment intent updated successfully")
      } catch (error) {
        console.error("Error updating payment intent:", error)
        toast.error("Failed to update payment details. Please try again.")
      } finally {
        setIsUpdatingPayment(false)
      }
    },
    [paymentIntentId], // Only depend on paymentIntentId
  )

  const handleShippingCostChange = useCallback(
    (cost: number) => {
      setShippingCost(cost)

      // Use debounced update if we have email and payment intent
      if (shippingAddress.email.trim() && paymentIntentId) {
        debouncedUpdatePaymentIntent(cost, shippingAddress.email, total)
      }
    },
    [shippingAddress.email, paymentIntentId, total, debouncedUpdatePaymentIntent],
  )

  const handleAddressChange = useCallback(
    (field: string, value: string) => {
      setShippingAddress((prev) => {
        const updated = {
          ...prev,
          [field]: value,
        }

        // Use debounced update when email changes and has valid value
        if (field === "email" && value.trim() && paymentIntentId) {
          debouncedUpdatePaymentIntent(shippingCost, value, total)
        }

        return updated
      })
    },
    [paymentIntentId, shippingCost, total, debouncedUpdatePaymentIntent],
  )

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const createOrder = async (paymentIntentId: string) => {
    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId,
          items: cart,
          shippingAddress,
          shippingCost,
          total: totalCost,
          userId: session?.user?.id || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create order")
      }

      const data = await response.json()
      return data.order
    } catch (error) {
      console.error("Error creating order:", error)
      throw error
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    router.push("/")
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setMessage("")

    // Validate shipping address
    const requiredFields = ["firstName", "lastName", "email", "address", "city", "postalCode"]
    const missingFields = requiredFields.filter((field) => !shippingAddress[field as keyof typeof shippingAddress])

    if (missingFields.length > 0) {
      setMessage(`Please fill in all required fields: ${missingFields.join(", ")}`)
      setIsLoading(false)
      return
    }

    try {
      // Clear any pending debounced updates
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Ensure payment intent is updated with latest details before confirming
      if (paymentIntentId && shippingAddress.email.trim()) {
        await updatePaymentIntent(shippingCost, shippingAddress.email, total)
      }

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/processing`,
          receipt_email: shippingAddress.email,
        },
        redirect: "if_required",
      })

      if (error) {
        setMessage(error.message || "An unexpected error occurred.")
        toast.error(error.message || "Payment failed")
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Create the order
        const order = await createOrder(paymentIntent.id)

        // Prepare order data for modal
        const modalOrderData = {
          orderId: order.id,
          total: totalCost,
          email: shippingAddress.email,
          items: cart.map((item) => ({
            name: item.title, // Use title instead of name
            quantity: item.quantity,
            price: item.price,
          })),
        }

        setOrderData(modalOrderData)

        // Clear the cart
        clearCart()

        // Show success modal
        setShowSuccessModal(true)

        // Show success toast
        toast.success("Payment successful! Order created.")

        // Also redirect to success page as backup after a delay
        setTimeout(() => {
          if (!showSuccessModal) {
            router.push(`/checkout/success?order_id=${order.id}`)
          }
        }, 5000)
      } else {
        setMessage("Payment processing failed. Please try again.")
        toast.error("Payment processing failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
      setMessage("An error occurred while processing your payment.")
      toast.error("An error occurred while processing your payment")
    }

    setIsLoading(false)
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Address */}
            <div>
              <h2 className="text-xl font-medium mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={shippingAddress.firstName}
                    onChange={(e) => handleAddressChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={shippingAddress.lastName}
                    onChange={(e) => handleAddressChange("lastName", e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => handleAddressChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={shippingAddress.phone}
                    onChange={(e) => handleAddressChange("phone", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) => handleAddressChange("address", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={shippingAddress.country}
                    onValueChange={(value) => handleAddressChange("country", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Shipping Options */}
            <ShippingOptions onShippingCostChange={handleShippingCostChange} country={shippingAddress.country} />

            <Separator />

            {/* Payment */}
            <div>
              <h2 className="text-xl font-medium mb-6">Payment</h2>
              {isUpdatingPayment && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="text-sm text-blue-700">Updating payment details...</span>
                  </div>
                </div>
              )}
              <PaymentElement />
            </div>

            {message && <div className="text-red-600 text-sm mt-4">{message}</div>}

            <Button
              type="submit"
              disabled={!stripe || isLoading || isUpdatingPayment}
              className="w-full bg-black text-white hover:bg-gray-800 py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay £${totalCost.toFixed(2)}`
              )}
            </Button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary shippingCost={shippingCost} />
        </div>
      </div>

      {/* Success Modal */}
      {orderData && (
        <PaymentSuccessModal isOpen={showSuccessModal} onClose={handleSuccessModalClose} orderData={orderData} />
      )}
    </>
  )
}
