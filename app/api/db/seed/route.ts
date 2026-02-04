import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    // Check if admin user exists
    const adminUser = await prisma.user.findFirst({
      where: { email: "admin@example.com" },
    })

    let adminUserId = adminUser?.userId

    // Create admin user if it doesn't exist
    if (!adminUser) {
      const hashedPassword = await hashPassword("password123")
      const userId = uuidv4()

      const newAdmin = await prisma.user.create({
        data: {
          userId,
          name: "Admin User",
          email: "admin@example.com",
          password: hashedPassword,
        },
      })

      adminUserId = newAdmin.userId
      console.log("✅ Admin user created")
    }

    // Add sample reviews if none exist
    const reviewCount = await prisma.review.count()
    if (reviewCount === 0 && adminUserId) {
      console.log("Adding sample reviews...")

      // Add reviews for the first product
      await prisma.review.createMany({
        data: [
          {
            userId: adminUserId,
            productId: "prod_01",
            rating: 5,
            title: "Amazing scent!",
            content:
              "This candle has the most wonderful fragrance. It fills the entire room with a warm, inviting scent.",
            isVerified: true,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          },
          {
            userId: adminUserId,
            productId: "prod_01",
            rating: 4,
            title: "Great quality",
            content: "Burns evenly and lasts a long time. The scent is pleasant but could be a bit stronger.",
            isVerified: true,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          },
          {
            userId: adminUserId,
            productId: "prod_02",
            rating: 5,
            title: "Perfect gift!",
            content: "I bought this as a gift and they loved it. The packaging is beautiful and the scent is amazing.",
            isVerified: true,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          },
        ],
      })

      console.log("✅ Sample reviews added")
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error) {
    console.error("Seeding error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
