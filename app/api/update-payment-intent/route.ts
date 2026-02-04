import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { paymentIntentId, amount, shippingCost = 0, email, items } = body

    console.log("Update payment intent request:", { paymentIntentId, amount, shippingCost })

    // Validate required fields
    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment Intent ID is required" }, { status: 400 })
    }

    if (!amount || amount < 0) {
      return NextResponse.json({ error: "Valid amount is required" }, { status: 400 })
    }

    // Ensure shippingCost is a number
    const validShippingCost = typeof shippingCost === "number" ? shippingCost : Number.parseFloat(shippingCost) || 0

    // Calculate total amount including shipping
    const subtotal = Number.parseFloat(amount.toString())
    const totalAmount = subtotal + validShippingCost

    // Convert to pence for Stripe (multiply by 100 and round)
    const stripeAmount = Math.round(totalAmount * 100)

    console.log("Update amount calculation:", {
      subtotal,
      shippingCost: validShippingCost,
      totalAmount,
      stripeAmount,
      stripeAmountInPounds: stripeAmount / 100,
    })

    // Update the payment intent
    const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      amount: stripeAmount,
      metadata: {
        userId: session?.user?.id || "guest",
        email: email || session?.user?.email || "",
        cartItems: JSON.stringify(
          items?.map((item: any) => ({
            id: item.id,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })) || [],
        ),
        shippingCost: validShippingCost.toString(),
        subtotal: subtotal.toString(),
        totalAmount: totalAmount.toString(),
      },
      receipt_email: email || session?.user?.email || undefined,
    })

    console.log("Payment intent updated:", {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      amountInPounds: paymentIntent.amount / 100,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      success: true,
    })
  } catch (error) {
    console.error("Error updating payment intent:", error)

    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: "Stripe error", details: error.message, type: error.type }, { status: 400 })
    }

    return NextResponse.json(
      { error: "Error updating payment intent", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
