import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Schema for review validation
const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  content: z.string().min(10, "Review must be at least 10 characters").max(1000),
})

// GET handler to fetch reviews for a product
export async function GET(request: Request, { params }: { params: { productId: string } }) {
  try {
    const { productId } = params

    // Get all reviews for the product with user information
    const productReviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            userId: true,
          },
        },
      },
    })

    // Format the reviews for the response
    const reviewsWithUserInfo = productReviews.map((review) => ({
      id: review.id,
      userId: review.userId,
      productId: review.productId,
      rating: review.rating,
      title: review.title || "",
      content: review.content || "",
      isVerified: review.isVerified,
      createdAt: review.createdAt,
      user: {
        name: review.user?.name || "Anonymous",
        id: review.user?.userId || review.userId,
      },
    }))

    return NextResponse.json({ reviews: reviewsWithUserInfo })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

// POST handler to create a new review
export async function POST(request: Request, { params }: { params: { productId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId } = params
    const body = await request.json()

    // Validate review data
    try {
      reviewSchema.parse(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json({ error: validationError.errors[0].message }, { status: 400 })
      }
      return NextResponse.json({ error: "Invalid review data" }, { status: 400 })
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 })
    }

    // Create the review
    const newReview = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating: body.rating,
        title: body.title,
        content: body.content,
        isVerified: false, // Set to true if you can verify the purchase
      },
      include: {
        user: {
          select: {
            name: true,
            userId: true,
          },
        },
      },
    })

    // Format the response
    const reviewWithUser = {
      ...newReview,
      user: {
        name: newReview.user?.name || session.user.name || "Anonymous",
        id: newReview.user?.userId || session.user.id,
      },
    }

    return NextResponse.json({ review: reviewWithUser })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
