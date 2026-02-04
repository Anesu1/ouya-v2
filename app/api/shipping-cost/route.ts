import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return a default shipping cost
    // In a real application, this would calculate based on location, weight, etc.
    return NextResponse.json({
      cost: 4.99,
      currency: "GBP",
    })
  } catch (error) {
    console.error("Error fetching shipping cost:", error)
    return NextResponse.json({ error: "Failed to calculate shipping cost" }, { status: 500 })
  }
}
