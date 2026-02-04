import { NextResponse } from "next/server"
import { calculateCartWeight } from "@/lib/shipping"
import { calculateShippingOptionsFromSanity } from "@/lib/sanity-shipping"
import { z } from "zod"

// Updated schema to be more flexible with cart items
const shippingRequestSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      variantId: z.string(),
      quantity: z.number().int().positive(),
      weight: z.number().optional(), // in grams
    }),
  ),
  destination: z.string().min(2).max(2), // country code
  subtotal: z.number().nonnegative(), // cart subtotal in dollars
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Log the incoming request body for debugging
    console.log("Shipping calculation request:", JSON.stringify(body, null, 2))

    const validatedData = shippingRequestSchema.parse(body)

    // Calculate cart weight
    const cartWeight = calculateCartWeight(validatedData.items)

    console.log(`Calculated cart weight: ${cartWeight}g for ${validatedData.items.length} items`)

    // Calculate shipping options from Sanity
    const shippingOptions = await calculateShippingOptionsFromSanity(
      cartWeight,
      validatedData.destination,
      validatedData.subtotal,
    )

    // If no shipping options found, return a helpful error with empty array
    if (shippingOptions.length === 0) {
      console.warn(`No shipping options available for destination: ${validatedData.destination}`)
      return NextResponse.json(
        {
          shippingOptions: [],
          error: `No shipping options available for ${validatedData.destination}`,
          cartWeight,
          destination: validatedData.destination,
        },
        { status: 200 },
      ) // Using 200 status to avoid triggering error handling in the frontend
    }

    console.log(`Returning ${shippingOptions.length} shipping options`)

    return NextResponse.json({
      shippingOptions,
      cartWeight,
      destination: validatedData.destination,
    })
  } catch (error) {
    console.error("Error calculating shipping:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: error.errors,
          shippingOptions: [],
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: "An unexpected error occurred while calculating shipping",
        details: error.message,
        shippingOptions: [],
      },
      { status: 500 },
    )
  }
}
