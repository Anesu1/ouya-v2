import { NextResponse } from "next/server"
import { getShippingMethodsForCountry } from "@/lib/sanity-shipping"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get("country") || "GB"

    console.log("Fetching shipping methods for country:", country)

    const methods = await getShippingMethodsForCountry(country)

    // Transform to include zone information for frontend
    const methodsWithZone = methods.map((method) => ({
      ...method,
      zone: {
        _id: method.zone._ref,
        name: "Zone", // We could fetch the actual zone name if needed
        countries: [],
        isDefault: false,
      },
    }))

    console.log(`Found ${methodsWithZone.length} shipping methods for country ${country}`)

    return NextResponse.json(methodsWithZone)
  } catch (error) {
    console.error("Error fetching shipping methods:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch shipping methods",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
