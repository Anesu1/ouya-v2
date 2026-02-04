import { NextResponse } from "next/server"
import { getAllProducts, testShopifyConnection } from "@/lib/shopify"

export async function GET() {
  try {
    // Test the connection
    const isConnected = await testShopifyConnection()

    if (!isConnected) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to connect to Shopify",
        },
        { status: 500 },
      )
    }

    // Fetch products to verify data
    const products = await getAllProducts()

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Shopify",
      productCount: products.length,
      sampleProducts: products.slice(0, 3), // Return first 3 products as sample
    })
  } catch (error) {
    console.error("Shopify debug error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error testing Shopify connection",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
