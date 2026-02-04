"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader2, X, ShoppingBag, AlertCircle } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"
import { motion } from "framer-motion"

type WishlistItem = {
  id: number
  productId: string
  variantId: string
  product: {
    title: string
    handle: string
    price: string
    image: string
  }
}

export default function WishlistItems({ userId }: { userId: string }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionInProgress, setActionInProgress] = useState<number | null>(null)
  const { addToCart } = useCart()

  const fetchWishlist = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/account/wishlist`)

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist")
      }

      const data = await response.json()
      setItems(data.items)
    } catch (err) {
      setError("Failed to load wishlist. Please try again later.")
      console.error("Error fetching wishlist:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const handleRemoveItem = async (itemId: number) => {
    try {
      setActionInProgress(itemId)
      const response = await fetch(`/api/account/wishlist/${itemId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove item")
      }

      // Remove item from state
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
    } catch (err) {
      console.error("Error removing item:", err)
      setError("Failed to remove item. Please try again.")
    } finally {
      setActionInProgress(null)
    }
  }

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      setActionInProgress(item.id)

      addToCart({
        id: item.productId,
        title: item.product.title,
        price: item.product.price,
        image: item.product.image,
        variantId: item.variantId,
        quantity: 1,
      })

      // Optional: Remove from wishlist after adding to cart
      // await handleRemoveItem(item.id);
    } catch (err) {
      console.error("Error adding to cart:", err)
      setError("Failed to add item to cart. Please try again.")
    } finally {
      setActionInProgress(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Your wishlist is empty</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Save items you love to your wishlist.</p>
          </div>
          <div className="mt-5">
            <Link
              href="/collections/all"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Start shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul className="divide-y divide-gray-200">
        {items.map((item) => (
          <li key={item.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.title}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      <Link href={`/products/${item.product.handle}`} className="hover:underline">
                        {item.product.title}
                      </Link>
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">£{item.product.price}</p>
                  </div>
                  <div className="flex space-x-4">
                    <motion.button
                      onClick={() => handleAddToCart(item)}
                      className="text-black hover:text-gray-500"
                      aria-label="Add to cart"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={actionInProgress === item.id}
                    >
                      {actionInProgress === item.id ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <ShoppingBag size={20} />
                      )}
                    </motion.button>
                    <motion.button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-gray-500"
                      aria-label="Remove from wishlist"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={actionInProgress === item.id}
                    >
                      {actionInProgress === item.id ? <Loader2 size={20} className="animate-spin" /> : <X size={20} />}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
