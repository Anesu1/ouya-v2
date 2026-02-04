"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"
import { motion } from "framer-motion"

interface ProductCardProps {
  product: any
  featured?: boolean
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null)
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Use the first variant by default
    const defaultVariant = product.variants?.[0]
    if (!defaultVariant) return

    addToCart({
      id: product._id,
      title: product.title,
      price: defaultVariant.price.toString(),
      image: product.featuredImage || product.images?.[0]?.url || "/placeholder.svg",
      variantId: defaultVariant._key,
      variantTitle: defaultVariant.title !== "Default Title" ? defaultVariant.title : undefined,
      quantity: 1,
    })
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      if (isWishlisted && wishlistItemId) {
        // Remove from wishlist
        const response = await fetch(`/api/account/wishlist/${wishlistItemId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to remove from wishlist")
        }

        setIsWishlisted(false)
        setWishlistItemId(null)
      } else {
        // Add to wishlist
        const response = await fetch("/api/account/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product._id,
            variantId: product.variants?.[0]?._key,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to add to wishlist")
        }

        const data = await response.json()
        setWishlistItemId(data.id)
        setIsWishlisted(true)
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    }
  }

  // Get price information
  const price = product.price
  const compareAtPrice = product.compareAtPrice

  return (
    <motion.div
      className={`group relative ${featured ? "featured-product" : ""}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${product.handle.current}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg">
          <div className="w-full h-full transition-transform duration-500 group-hover:scale-105 min-h-[300px] lg:min-h-[400px]">
            <Image
              src={product.featuredImage || product.images?.[0]?.url || "/placeholder.svg"}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
              priority={featured}
            />
          </div>

          {/* Collection tag */}
          {product.collections && product.collections.some((col: any) => col.handle === "red") && (
            <div className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded">Red Collection</div>
          )}

          {/* Quick action buttons */}
          <div
            className={`absolute bottom-4 right-4 flex space-x-2 transition-opacity duration-300 ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
          >
           

            {/* <motion.button
              onClick={handleToggleWishlist}
              className="bg-black p-3 rounded-full shadow-md hover:bg-gray-800 transition-colors z-10 text-white"
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={18} className={isWishlisted ? "fill-white" : ""} />
            </motion.button> */}
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="text-base font-medium">{product.title}</h3>
          <div className="flex items-center">
            <p className="text-base font-medium">£{price.toFixed(2)}</p>
            {compareAtPrice && <p className="ml-2 text-sm text-gray-500 line-through">£{compareAtPrice.toFixed(2)}</p>}
          </div>

          {/* Fragrance Notes Preview */}
          {product.fragranceNotes && product.fragranceNotes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.fragranceNotes.slice(0, 3).map((note: string) => (
                <span key={note} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {note}
                </span>
              ))}
              {product.fragranceNotes.length > 3 && (
                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  +{product.fragranceNotes.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
