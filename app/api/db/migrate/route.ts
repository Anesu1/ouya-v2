import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // With Prisma, migrations are typically handled via the Prisma CLI
    // This endpoint can be used for other initialization tasks

    // Check database connection
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({ success: true, message: "Database connection successful" })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json({ error: "Failed to connect to database" }, { status: 500 })
  }
}
