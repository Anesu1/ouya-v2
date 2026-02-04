"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import ProductCard from "@/components/products/product-card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/lib/products"

interface FeaturedProductsProps {
  products: Product[]
  homepageContent: any
}

export default function FeaturedProducts({ products, homepageContent }: FeaturedProductsProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  const containerRef = useRef<HTMLDivElement>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  if (!products || products.length === 0) {
    return (
      <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl font-light tracking-tight text-gray-900 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {homepageContent?.featuredStatement?.heading || "Featured Candles"}
          </motion.h2>
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="text-gray-500">No products available at the moment. Please check back later.</p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex justify-between items-end mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <h2 className="text-3xl font-light tracking-tight text-gray-900">
              {" "}
              {homepageContent?.featuredStatement?.heading || "Featured Candles"}
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl">
              {homepageContent?.featuredStatement?.description ||
                "Discover our handcrafted collection of premium candles and reed diffusers, made with natural ingredients and unique fragrance blends."}
            </p>
          </div>
          <Link
            href="/collections/all"
            className="group flex items-center text-sm font-medium tracking-wider uppercase border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors cursor-hover"
          >
            View All
            <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {products.slice(0, 4).map((product, index) => (
            <motion.div key={index} variants={itemVariants} custom={index}>
              <ProductCard product={product} featured={true} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
