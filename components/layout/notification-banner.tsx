"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { sanityClient } from "@/lib/sanity"

export default function NotificationBanner() {
  const [notifications, setNotifications] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Fetch notifications from Sanity
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const query = `*[_type == "notification"]{ message }`
        const results = await sanityClient.fetch(query)
        const fetchedNotifications = results.map((item: { message: string }) => item.message)
        setNotifications(fetchedNotifications)
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }
    }

    fetchNotifications()
  }, [])

  // Auto-rotate notifications
  useEffect(() => {
    if (notifications.length === 0) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [notifications])

  if (!isVisible || notifications.length === 0) return null

  return (
    <div className="bg-black text-white py-3 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            className="text-sm font-medium text-center tracking-wider uppercase"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {notifications[currentIndex]}
          </motion.p>
        </AnimatePresence>
        <motion.button
          className="absolute right-4 text-white/80 hover:text-white transition-colors cursor-hover"
          onClick={() => setIsVisible(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={16} />
          <span className="sr-only">Close</span>
        </motion.button>
      </div>
    </div>
  )
}
