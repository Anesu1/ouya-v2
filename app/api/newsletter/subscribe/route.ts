import { NextResponse } from "next/server"
import mailchimp from "@mailchimp/mailchimp_marketing"

// Initialize Mailchimp client
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX, // e.g., "us1"
})

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    try {
      // Add member to list
      const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID as string, {
        email_address: email,
        status: "subscribed",
      })

      return NextResponse.json({
        success: true,
        message: "Successfully subscribed to the newsletter",
        id: response.id,
      })
    } catch (err: any) {
      // Handle Mailchimp specific errors
      if (err.response && err.response.body) {
        const { title, detail, status } = err.response.body

        // Handle already subscribed case
        if (title === "Member Exists") {
          return NextResponse.json({
            success: true,
            message: "You're already subscribed to our newsletter!",
          })
        }

        console.error("Mailchimp error:", { title, detail, status })
        return NextResponse.json({ error: detail || "Error subscribing to newsletter" }, { status: status || 500 })
      }

      throw err
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Failed to subscribe to newsletter" }, { status: 500 })
  }
}
