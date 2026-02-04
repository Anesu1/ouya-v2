"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface FragranceNotesProps {
  notes: string[]
}

export default function FragranceNotes({ notes }: FragranceNotesProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!notes || notes.length === 0) {
    return null
  }

  // Map notes to their corresponding images
  const noteImages: Record<string, string> = {
    Raspberries: "/images/notes/raspberries.png",
    "Black Tea": "/images/notes/black-tea.png",
    Sandalwood: "/images/notes/sandalwood.png",
  }

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <button
        className="flex justify-between items-center w-full py-3 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-lg font-medium">Fragrance Notes</span>
        <ChevronDown size={20} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="py-4 grid grid-cols-2 md:grid-cols-3 gap-6">
              {notes.map((note) => (
                <motion.div
                  key={note}
                  className="flex flex-col items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3 shadow-md">
                    <Image
                      src={noteImages[note] || "/placeholder.svg?height=200&width=200"}
                      alt={note}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-10 transition-opacity"></div>
                  </div>
                  <span className="text-sm font-medium">{note}</span>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    {note === "Raspberries" && "Sweet, fruity, and slightly tart"}
                    {note === "Black Tea" && "Rich, warm, and aromatic"}
                    {note === "Sandalwood" && "Woody, creamy, and exotic"}
                    {!["Raspberries", "Black Tea", "Sandalwood"].includes(note) && "Natural fragrance note"}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
