import { NextResponse } from "next/server"

export async function GET() {
  // Check if Mailchimp environment variables are set
  const hasMailchimpConfig =
    process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_SERVER_PREFIX && process.env.MAILCHIMP_AUDIENCE_ID

  return NextResponse.json({
    configured: !!hasMailchimpConfig,
    message: hasMailchimpConfig ? "Mailchimp is properly configured" : "Mailchimp environment variables are missing",
  })
}
