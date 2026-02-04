"use client"

import type React from "react"
import { useState } from "react"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe. Please try again.")
      }

      setIsSuccess(true)
      setMessage(data.message || "Thank you for subscribing!")
      setEmail("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to subscribe. Please try again.")
      setIsSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 border-t border-gray-100 bg-black text-white">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-4xl font-light mb-8 tracking-tight">Join Our Community</h2>
        <p className="text-lg text-gray-300 mb-10 tracking-wide">
          Subscribe to our newsletter for exclusive offers, new product launches, and styling inspiration.
        </p>

        {isSuccess ? (
          <div className="bg-white text-black p-6 rounded-md">
            <p className="text-lg">{message || "Thank you for subscribing!"}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-grow px-4 py-3 border border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-black px-8 py-3 font-medium tracking-wider uppercase hover:bg-gray-200 transition-colors disabled:bg-gray-400"
              >
                {isSubmitting ? "Subscribing..." : "Sign Up"}
              </button>
            </div>
            {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
          </form>
        )}

        <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-8">
          <a href="/contact" className="text-base font-medium tracking-wider uppercase hover:underline text-white">
            Support
          </a>
        
        </div>
      </div>
    </section>
  )
}
