"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ChevronDown,
  Heart,
  Check,
  ShoppingBag,
  Leaf,
  Shield,
  Truck,
  AlertCircle,
  Share2,
} from "lucide-react"
import { useCart } from "@/components/cart/cart-context"
import { motion, AnimatePresence } from "framer-motion"
import FragranceNotes from "@/components/products/fragrance-notes"
import { PortableText } from "@portabletext/react"

export default function ProductDetails({ product }: { product: any }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null,
  )
  const [quantity, setQuantity] = useState(1)
  const [activeSection, setActiveSection] = useState<string | null>("details")
  const { addToCart } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const galleryRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [shareClicked, setShareClicked] = useState(false)

  // Filter out fragrance note images from the product images
  const productImages = product.images || []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const handleAddToCart = () => {
    if (!selectedVariant) {
      setError("Please select a product variant")
      return
    }

    try {
      addToCart({
        id: product._id,
        title: product.title,
        price: selectedVariant.price.toString(),
        image: productImages[0]?.url || "/placeholder.svg",
        variantId: selectedVariant._key,
        variantTitle: selectedVariant.title !== "Default Title" ? selectedVariant.title : null,
        quantity,
      })

      // Show added to cart confirmation
      setAddedToCart(true)

      // Reset after 3 seconds
      setTimeout(() => {
        setAddedToCart(false)
      }, 3000)
    } catch (error) {
      console.error("Error adding to cart:", error)
      setError("Failed to add item to cart. Please try again.")

      // Clear error after 3 seconds
      setTimeout(() => {
        setError(null)
      }, 3000)
    }
  }

  // Add a function to handle adding to wishlist
  const handleToggleWishlist = async () => {
    try {
      if (isInWishlist) {
        // Remove from wishlist logic would go here
        setIsInWishlist(false)
      } else {
        // Add to wishlist
        const response = await fetch("/api/account/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product._id,
            variantId: selectedVariant?._key,
          }),
        })

        if (response.ok) {
          setIsInWishlist(true)
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    }
  }

  // Set a fallback price if no variant is selected
  const price = selectedVariant?.price || product.price
  const compareAtPrice = selectedVariant?.compareAtPrice || product.compareAtPrice

  // Calculate savings percentage
  const savingsAmount = compareAtPrice ? (compareAtPrice - price).toFixed(2) : null
  const savingsPercentage = compareAtPrice ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : null

  // Check if the selected variant is a reed diffuser
  const isReedDiffuser = selectedVariant?.title.toLowerCase().includes("reed diffuser")

  // Reset quantity when variant changes
  useEffect(() => {
    setQuantity(1)
  }, [selectedVariant])

  // Add keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevImage()
      } else if (e.key === "ArrowRight") {
        nextImage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  // Generate breadcrumb path
  const breadcrumbPath = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections/all" },
  ]

  // Add collection to breadcrumb if available
  if (product.collections && product.collections.length > 0) {
    breadcrumbPath.push({
      name: product.collections[0].title,
      href: `/collections/${product.collections[0].handle}`,
    })
  }

  breadcrumbPath.push({
    name: product.title,
    href: `/products/${product.handle}`,
  })

  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-sm mb-6 text-gray-500">
        {breadcrumbPath.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
            {index === breadcrumbPath.length - 1 ? (
              <span className="text-gray-900">{item.name}</span>
            ) : (
              <Link href={item.href} className="hover:text-black">
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {error && (
        <motion.div
          className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="relative">
          <div className="sticky top-24">
            <div
              ref={galleryRef}
              className="aspect-square overflow-hidden bg-gray-50 w-full h-[300px] lg:h-[500px] relative rounded-lg"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  <Image
                    src={productImages[currentImageIndex]?.url || "/placeholder.svg"}
                    alt={productImages[currentImageIndex]?.altText || product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              {productImages.length > 1 && (
                <>
                  <motion.button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors text-black"
                    onClick={prevImage}
                    aria-label="Previous image"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                  <motion.button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors text-black"
                    onClick={nextImage}
                    aria-label="Next image"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                </>
              )}

              {/* Collection Badge */}
              {product.collections && product.collections.some((col) => col.handle === "red") && (
                <div className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1.5 rounded-full">
                  Red Collection
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {productImages.map((image, index) => (
                  <motion.button
                    key={index}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${
                      index === currentImageIndex ? "ring-2 ring-black" : "ring-1 ring-gray-200"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`View image ${index + 1}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.altText || `Product thumbnail ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div>
          {/* Sustainability Badge */}
          {product.sustainability && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 mb-4">
              <Leaf className="h-4 w-4 mr-1" />
              <span>{product.sustainability}</span>
            </div>
          )}

          <motion.h1
            className="text-3xl font-medium tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {product.title}
          </motion.h1>

          {/* Ratings */}
          {/* <div className="flex items-center mt-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">4.0/5</span>
            <span className="ml-2 text-sm text-gray-600">(24 reviews)</span>
          </div> */}

          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-baseline">
              <p className="text-3xl font-medium">£{price.toFixed(2)}</p>
              {compareAtPrice && (
                <>
                  <span className="ml-3 text-xl text-gray-500 line-through">£{compareAtPrice.toFixed(2)}</span>
                  <span className="ml-3 text-sm font-medium text-green-600">
                    Save £{savingsAmount} ({savingsPercentage}%)
                  </span>
                </>
              )}
            </div>
          </motion.div>

          {selectedVariant && (
            <p className={`text-sm mt-1 ${selectedVariant.inStock ? "text-green-600" : "text-red-600"}`}>
              {selectedVariant.inStock ? "In stock" : "Out of stock"}
            </p>
          )}

          {selectedVariant && <p className="text-sm text-gray-500 mt-2">SKU: {selectedVariant.sku}</p>}

          {/* Product Description */}
          <motion.div
            className="mt-6 prose prose-sm text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {product.description ? (
              <PortableText value={product.description} />
            ) : (
              <p>{product.descriptionHtml || "No description available"}</p>
            )}
          </motion.div>

          {/* Variant Selection */}
          {product.variants && product.variants.length > 1 && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">Options</h2>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant._key}
                    className={`px-4 py-2 border rounded-md text-sm ${
                      selectedVariant?._key === variant._key
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-600"
                    } ${!variant.inStock ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => variant.inStock && setSelectedVariant(variant)}
                    disabled={!variant.inStock}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Key Features */}
          <motion.div
            className="mt-6 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {product.ingredients && (
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">{product.ingredients}</span>
              </div>
            )}
            {product.burnTime && (
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">{product.burnTime}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">{product.dimensions}</span>
              </div>
            )}
          </motion.div>

          {/* Quantity Selector */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">Quantity</h2>
            <div className="flex items-center border border-gray-300 rounded-md w-fit">
              <motion.button
                className="p-3 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={decrementQuantity}
                aria-label="Decrease quantity"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </motion.button>
              <span className="px-4 py-2 text-center w-12">{quantity}</span>
              <motion.button
                className="p-3 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={incrementQuantity}
                aria-label="Increase quantity"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus size={16} />
              </motion.button>
            </div>
          </motion.div>

          {/* Shipping & Returns Info */}
          <motion.div
            className="mt-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium">Free delivery by Apr 16 - Apr 17</p>
                <p className="text-xs text-gray-500">Express delivery available</p>
              </div>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium">Free 30-day returns</p>
                <p className="text-xs text-gray-500">1-year warranty</p>
              </div>
            </div>
          </motion.div>

          {/* Add to Cart Button */}
          <motion.div
            className="mt-8 flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.button
              className="flex-1 bg-black text-white py-4 px-6 font-medium tracking-wider uppercase hover:bg-gray-800 transition-colors rounded-md relative overflow-hidden flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={!selectedVariant || !selectedVariant.inStock || addedToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-green-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Check className="mr-2" size={18} />
                    Added to Bag
                  </motion.div>
                ) : null}
              </AnimatePresence>
              <ShoppingBag className={`mr-2 h-5 w-5 ${addedToCart ? "opacity-0" : ""}`} />
              <span className={addedToCart ? "opacity-0" : ""}>
                {selectedVariant && !selectedVariant.inStock ? "Out of Stock" : "Add to Bag"}
              </span>
            </motion.button>

          

            <motion.button
              className="p-4 border border-gray-300 rounded-md hover:border-gray-900 transition-colors"
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: product.title,
                      text: product.description ? product.description[0]?.children?.[0]?.text : product.title,
                      url: window.location.href,
                    })
                    .catch((err) => console.error("Error sharing:", err))
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  setShareClicked(true)
                  setTimeout(() => setShareClicked(false), 2000)
                }
              }}
              aria-label="Share product"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {shareClicked ? <Check size={20} /> : <Share2 size={20} />}
            </motion.button>
          </motion.div>

          {/* Buy Now, Pay Later */}
          <motion.div
            className="mt-6 p-4 bg-gray-50 rounded-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            <p className="text-sm flex items-center">
              <span className="font-medium">Buy now, pay later.</span>
              <Link href="#" className="ml-1 text-black underline">
                Learn more
              </Link>
            </p>
          </motion.div>

          {/* Fragrance Notes Section */}
          {product.fragranceNotes && product.fragranceNotes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <FragranceNotes notes={product.fragranceNotes} />
            </motion.div>
          )}

          {/* Additional Information */}

          <motion.div
            className="mt-10 border-t border-gray-200 pt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="space-y-4">
              {product.productDetails && (
                <>
                  {" "}
                  <button
                    className="flex justify-between items-center w-full py-3 text-left border-b border-gray-100"
                    onClick={() => toggleSection("details")}
                  >
                    <span className="font-medium">Product Details</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${activeSection === "details" ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeSection === "details" && (
                      <motion.div
                        className="py-3 text-sm text-gray-600"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="mb-2">{product.productDetails}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {product.shippingInfo && (
                <>
                  <button
                    className="flex justify-between items-center w-full py-3 text-left border-b border-gray-100"
                    onClick={() => toggleSection("shipping")}
                  >
                    <span className="font-medium">Shipping & Returns</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${activeSection === "shipping" ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeSection === "shipping" && (
                      <motion.div
                        className="py-3 text-sm text-gray-600"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="mb-2">{product.shippingInfo}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {product.careInstructions && (
                <button
                  className="flex justify-between items-center w-full py-3 text-left border-b border-gray-100"
                  onClick={() => toggleSection("care")}
                >
                  <span className="font-medium">Care Instructions</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${activeSection === "care" ? "rotate-180" : ""}`}
                  />
                </button>
              )}

              <AnimatePresence>
                {activeSection === "care" && (
                  <motion.div
                    className="py-3 text-sm text-gray-600"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {product?.careInstructions ? <p>{product?.careInstructions}</p> : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
