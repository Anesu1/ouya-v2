"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Star, Loader2, Trash2, AlertCircle, Check } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"

type Review = {
  id: number
  userId: string
  productId: string
  rating: number
  title: string
  content: string
  isVerified: boolean
  createdAt: string
  user: {
    name: string
    id: string
  }
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isWritingReview, setIsWritingReview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    content: "",
  })
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Update the fetchReviews function to include better error handling and logging
  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      console.log(`Fetching reviews for product: ${productId}`)
      const response = await fetch(`/api/products/${productId}/reviews`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error response: ${response.status} ${errorText}`)
        throw new Error(`Failed to fetch reviews: ${response.status}`)
      }

      const data = await response.json()
      console.log(`Received ${data.reviews?.length || 0} reviews`)
      setReviews(data.reviews || [])
    } catch (err) {
      console.error("Error fetching reviews:", err)
      setError("Failed to load reviews. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user) {
      setError("You must be logged in to submit a review")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit review")
      }

      const data = await response.json()

      // Refresh reviews instead of manually adding to ensure we get the complete data
      await fetchReviews()

      // Reset form
      setNewReview({
        rating: 5,
        title: "",
        content: "",
      })

      // Show success message
      setSuccessMessage("Your review has been submitted successfully!")

      // Close form after a delay
      setTimeout(() => {
        setIsWritingReview(false)
        setSuccessMessage(null)
      }, 2000)
    } catch (err) {
      console.error("Error submitting review:", err)
      setError(err instanceof Error ? err.message : "Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId: number) => {
    if (!session?.user) {
      setError("You must be logged in to delete a review")
      return
    }

    try {
      setIsDeleting(reviewId)
      setError(null)

      const response = await fetch(`/api/products/${productId}/reviews/${reviewId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete review")
      }

      // Remove the deleted review from state
      setReviews(reviews.filter((review) => review.id !== reviewId))
      setSuccessMessage("Review deleted successfully!")

      setTimeout(() => {
        setSuccessMessage(null)
      }, 2000)
    } catch (err) {
      console.error("Error deleting review:", err)
      setError(err instanceof Error ? err.message : "Failed to delete review. Please try again.")
    } finally {
      setIsDeleting(null)
    }
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-5 w-5 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>,
      )
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />)
    }

    return stars
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-medium mb-8">Customer Reviews</h2>

      <div className="flex items-center mb-8">
        <div className="flex items-center">{renderStars(averageRating)}</div>
        <p className="ml-2 text-sm text-gray-700">
          {averageRating.toFixed(1)} out of 5 ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
        </p>
      </div>

      {/* Success message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center"
        >
          <Check className="h-5 w-5 mr-2" />
          {successMessage}
        </motion.div>
      )}

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center"
        >
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </motion.div>
      )}

      {!isWritingReview ? (
        <button
          onClick={() => {
            if (!session?.user) {
              setError("You must be logged in to write a review")
              return
            }
            setIsWritingReview(true)
            setError(null)
          }}
          className="mb-8 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Write a review
        </button>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmitReview}
          className="mb-12 bg-gray-50 p-6 rounded-lg shadow-sm"
        >
          <h3 className="text-lg font-medium mb-4">Write a Review</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setNewReview((prev) => ({ ...prev, rating }))}
                  className="mr-1"
                >
                  <Star
                    className={`h-6 w-6 ${
                      rating <= newReview.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="review-title"
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              placeholder="Summarize your review"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-1">
              Review
            </label>
            <textarea
              id="review-content"
              value={newReview.content}
              onChange={(e) => setNewReview((prev) => ({ ...prev, content: e.target.value }))}
              rows={4}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              placeholder="Write your review here"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsWritingReview(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </motion.form>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 border-t border-gray-200">
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-8 border-t border-gray-200 pt-8">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              className="flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="flex items-center">{renderStars(review.rating)}</div>
                  <h4 className="ml-2 text-sm font-medium text-gray-900">{review.title}</h4>
                </div>

                {/* Delete button - only visible to review author */}
                {session?.user?.id === review.user.id && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    disabled={isDeleting === review.id}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete review"
                  >
                    {isDeleting === review.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>{review.user.name}</span>
                <span className="mx-2">•</span>
                <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                {review.isVerified && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-green-600">Verified Purchase</span>
                  </>
                )}
              </div>

              <p className="text-gray-600">{review.content}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
