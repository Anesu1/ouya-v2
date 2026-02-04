import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = headers()
  const sig = headersList.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Update order status to paid
        await prisma.order.updateMany({
          where: {
            paymentIntentId: paymentIntent.id,
          },
          data: {
            status: "paid",
            updatedAt: new Date(),
          },
        })

        console.log(`Payment succeeded for payment intent: ${paymentIntent.id}`)
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent

        // Update order status to failed
        await prisma.order.updateMany({
          where: {
            paymentIntentId: failedPayment.id,
          },
          data: {
            status: "failed",
            updatedAt: new Date(),
          },
        })

        console.log(`Payment failed for payment intent: ${failedPayment.id}`)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
