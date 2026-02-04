"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Collection } from "@/lib/products"

interface CollectionsShowcaseProps {
  collections: Collection[]
}

export default function CollectionsShowcase({ collections }: CollectionsShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  })

  // Filter out the "all" collection and only show specific collections
  const displayCollections = collections.filter(
    (collection) => !["all", "scented", "unscented"].includes(collection.handle),
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  if (!displayCollections || displayCollections.length === 0) {
    return null
  }

  const activeCollection = displayCollections[activeIndex]

  return (
    <section
      ref={ref}
      className="py-24 overflow-hidden"
      style={{
        backgroundColor: activeCollection?.backgroundColor || "#1a1a1a",
        color: activeCollection?.textColor || "#ffffff",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col md:flex-row gap-12"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Left side - Collection info */}
          <motion.div className="md:w-1/2" variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">Our Collections</h2>
            <p className="text-lg mb-10 opacity-80">
              Explore our carefully curated collections, each with its own unique character and mood.
            </p>

            <div className="space-y-6 mb-8">
              {displayCollections.map((collection, index) => (
                <button
                  key={collection.id}
                  className={`block text-left transition-all ${
                    index === activeIndex ? "text-xl font-medium" : "text-base opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  {collection.title}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCollection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <p className="mb-6">{activeCollection.description}</p>
                <Link
                  href={`/collections/${activeCollection.handle}`}
                  className="group inline-flex items-center border-b border-current pb-1 transition-all hover:opacity-80"
                >
                  Explore {activeCollection.title}
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right side - Collection image */}
          <motion.div className="md:w-1/2 relative" variants={itemVariants}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCollection.id}
                className="aspect-square relative overflow-hidden rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={
                    activeCollection.featuredImage || activeCollection.image || "/placeholder.svg?height=600&width=600"
                  }
                  alt={activeCollection.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
