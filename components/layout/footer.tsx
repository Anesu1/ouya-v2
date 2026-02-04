"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Instagram } from "lucide-react"

export default function Footer() {
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
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-sm font-medium tracking-wider uppercase">Shop</h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link href="/collections/all" className="text-gray-300 hover:text-white transition-colors">
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wider uppercase">Customer Service</h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wider uppercase">Connect</h3>
            <div className="flex space-x-6 mt-6">
              <a
                target="_blank"
                href="https://www.instagram.com/ouyaoendacollection/"
                className="text-gray-300 hover:text-white transition-colors"
                rel="noreferrer"
              >
                <span className="sr-only">Instagram</span>
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Ouya Oenda. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
