import { type NextRequest, NextResponse } from "next/server"
import { sanityClient } from "@/lib/sanity"

export async function GET(request: NextRequest) {
  try {
    console.log("Shipping API called")

    const { searchParams } = new URL(request.url)
    const country = searchParams.get("country") || "GB"

    console.log("Country:", country)

    // Test Sanity connection first
    try {
      const testQuery = await sanityClient.fetch(`*[_type == "shippingZone"][0...1]`)
      console.log("Sanity connection test:", testQuery)
    } catch (sanityError) {
      console.error("Sanity connection error:", sanityError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: sanityError.message,
        },
        { status: 500 },
      )
    }

    // Query shipping methods for the specific country or default zone
    const shippingMethods = await sanityClient.fetch(
      `
      *[
        _type == "shippingMethod" && 
        (
          zone->countries[] match $country ||
          zone->isDefault == true
        )
      ] {
        _id,
        name,
        carrier,
        description,
        icon,
        basePrice,
        freeShippingThreshold,
        estimatedDelivery,
        weightSurcharges,
        zone-> {
          _id,
          name,
          countries,
          isDefault
        }
      } | order(basePrice asc)
    `,
      { country },
    )

    console.log("Shipping methods found:", shippingMethods.length)

    // If no methods found for specific country, get default zone methods
    if (shippingMethods.length === 0) {
      console.log("No methods for country, trying default zone")

      const defaultMethods = await sanityClient.fetch(`
        *[
          _type == "shippingMethod" && 
          zone->isDefault == true
        ] {
          _id,
          name,
          carrier,
          description,
          icon,
          basePrice,
          freeShippingThreshold,
          estimatedDelivery,
          weightSurcharges,
          zone-> {
            _id,
            name,
            countries,
            isDefault
          }
        } | order(basePrice asc)
      `)

      console.log("Default methods found:", defaultMethods.length)
      return NextResponse.json(defaultMethods)
    }

    return NextResponse.json(shippingMethods)
  } catch (error) {
    console.error("Error fetching shipping methods:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch shipping methods",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
