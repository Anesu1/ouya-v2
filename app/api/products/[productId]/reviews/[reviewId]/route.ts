import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// DELETE handler to remove a review
export async function DELETE(request: Request, { params }: { params: { productId: string; reviewId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reviewId } = params
    const reviewIdNum = Number.parseInt(reviewId)

    if (isNaN(reviewIdNum)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 })
    }

    // Find the review first to check ownership
    const review = await prisma.review.findUnique({
      where: { id: reviewIdNum },
    })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Check if the user is the owner of the review
    if (review.userId !== session.user.id) {
      return NextResponse.json({ error: "You can only delete your own reviews" }, { status: 403 })
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewIdNum },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}

// PUT handler to update a review
export async function PUT(request: Request, { params }: { params: { productId: string; reviewId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reviewId } = params
    const reviewIdNum = Number.parseInt(reviewId)

    if (isNaN(reviewIdNum)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 })
    }

    const body = await request.json()

    // Find the review first to check ownership
    const review = await prisma.review.findUnique({
      where: { id: reviewIdNum },
    })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Check if the user is the owner of the review
    if (review.userId !== session.user.id) {
      return NextResponse.json({ error: "You can only update your own reviews" }, { status: 403 })
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: { id: reviewIdNum },
      data: {
        rating: body.rating || review.rating,
        title: body.title || review.title,
        content: body.content || review.content,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ review: updatedReview })
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}
