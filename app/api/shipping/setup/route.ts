import { NextResponse } from "next/server"
import { setupShippingData } from "../../../../scripts/setup-shipping-data"

export async function POST() {
  try {
    await setupShippingData()

    return NextResponse.json({
      success: true,
      message: "Shipping zones and methods have been successfully created in Sanity",
    })
  } catch (error) {
    console.error("Error setting up shipping data:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to setup shipping data",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
