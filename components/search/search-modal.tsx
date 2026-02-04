"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, Search, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {  getSearchSuggestions } from "@/lib/search"
import type { Product } from "@/lib/products"
import { searchProducts } from "@/lib/sanity"

interface SearchModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function SearchModal({ isOpen, setIsOpen }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
   const [isHovering, setIsHovering] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches))
      } catch (e) {
        console.error("Failed to parse recent searches", e)
      }
    }
  }, [])

  // Handle search and suggestions
  useEffect(() =>  {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setIsLoading(true)
        // Get search results
        const results = await searchProducts(searchTerm)
        setSearchResults(results)

        // Get search suggestions
        const termSuggestions = await getSearchSuggestions(searchTerm)
        setSuggestions(termSuggestions)

        setIsLoading(false)
      } else {
        setSearchResults([])
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  // Close modal when pressing escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, setIsOpen])

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchTerm.trim().length >= 2) {
      // Save to recent searches
      const updatedSearches = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5)

      setRecentSearches(updatedSearches)
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))

      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
      setIsOpen(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)

    // Save to recent searches
    const updatedSearches = [suggestion, ...recentSearches.filter((s) => s !== suggestion)].slice(0, 5)
    setRecentSearches(updatedSearches)
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))

    // Navigate to search results page
    router.push(`/search?q=${encodeURIComponent(suggestion)}`)
    setIsOpen(false)
  }

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term)
    // Move this term to the top of recent searches
    const updatedSearches = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5)

    setRecentSearches(updatedSearches)
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-charcoal bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            className="absolute inset-x-0 top-0 bg-white shadow-lg"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="container mx-auto max-w-4xl px-4 py-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-charcoal">Search Products</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-cream rounded-full transition-colors"
                  aria-label="Close search"
                >
                  <X size={24} className="text-charcoal" />
                </button>
              </div>

              <form onSubmit={handleSearch} className="relative mb-6">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for candles, fragrances, collections..."
                    className="w-full py-3 pl-12 text-black pr-4 border-b-2 border-charcoal focus:outline-none focus:border-gold text-lg transition-colors"
                    autoComplete="off"
                  />
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-charcoal-light" size={24} />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-charcoal-light hover:text-charcoal transition-colors"
                      aria-label="Clear search"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </form>

              <div className="max-h-[60vh] overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin h-8 w-8 text-gold" />
                  </div>
                ) : searchTerm.length >= 2 ? (
                  <div>
                    {suggestions.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-black mb-3">Suggestions</h3>
                        <div className="flex flex-wrap gap-2">
                          {suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1.5 bg-cream text-black hover:bg-cream-dark rounded-full text-sm transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.length > 0 ? (
                      <div>
                        <h3 className="text-sm font-medium text-charcoal-light mb-4">
                          {searchResults.length} results for "{searchTerm}"
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          {searchResults.map((product) => (
                           <Link href={`/products/${product.handle.current}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg">
          <div className="w-full h-full transition-transform duration-500 group-hover:scale-105 min-h-[300px] lg:min-h-[400px]">
            <Image
              src={product.featuredImage || product.images?.[0]?.url || "/placeholder.svg"}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
              priority={true}
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
                          ))}
                        </div>
                        <div className="mt-6 text-center">
                          <button onClick={handleSearch} className="text-gold font-medium hover:underline">
                            View all results
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-charcoal-light">No results found for "{searchTerm}"</p>
                        <p className="text-sm text-charcoal-light mt-2">
                          Try a different search term or browse our collections
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {recentSearches.length > 0 && (
                      <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-medium text-charcoal-light">Recent Searches</h3>
                          <button
                            onClick={clearRecentSearches}
                            className="text-xs text-charcoal-light hover:text-charcoal"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((term, index) => (
                            <button
                              key={index}
                              onClick={() => handleRecentSearchClick(term)}
                              className="px-3 py-1.5 bg-cream hover:bg-cream-dark rounded-full text-sm transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium text-charcoal-light mb-4">Popular Collections</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Link
                          href="/collections/red"
                          onClick={() => setIsOpen(false)}
                          className="group relative aspect-video rounded-lg overflow-hidden"
                        >
                          <Image src="/images/red-collection.png" alt="Red Collection" fill className="object-cover" />
                          <div className="absolute inset-0 bg-charcoal bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                            <span className="text-white font-medium">Red Collection</span>
                          </div>
                        </Link>
                        <Link
                          href="/collections/bestsellers"
                          onClick={() => setIsOpen(false)}
                          className="group relative aspect-video rounded-lg overflow-hidden"
                        >
                          <Image
                            src="/images/products/mina-nawe-2.png"
                            alt="Bestsellers"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-charcoal bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                            <span className="text-white font-medium">Bestsellers</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
