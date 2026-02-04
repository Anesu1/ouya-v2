"use client"

import { motion } from "framer-motion"
import ProductCard from "@/components/products/product-card"

// Update the Product type to match Sanity's structure
type Product = {
  _id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  price: number
  compareAtPrice?: number
  images: { url: string; altText: string }[]
  variants: {
    _key: string
    title: string
    price: number
    compareAtPrice?: number
    weight: number
    inStock: boolean
    sku: string
  }[]
  collections: string[]
  createdAt: string
  featuredImage: string
  tags: string[]
  vendor: string
  fragranceNotes?: string[]
}

interface ProductGridProps {
  products: any
  columns?: number
}

export default function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  // Animation variants for staggered grid items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          We couldn't find any products matching your criteria. Please check back later or try different filters.
        </p>
      </div>
    )
  }

  // Determine grid columns based on prop or default
  const gridCols =
    {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ",
    }[columns] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 "

  return (
    <motion.div
      className={`grid ${gridCols} gap-x-6 gap-y-10`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product, index) => (
        <motion.div key={index} variants={itemVariants} custom={index} className="h-full">
          <ProductCard product={product} featured={index < 4} />
        </motion.div>
      ))}
    </motion.div>
  )
}
