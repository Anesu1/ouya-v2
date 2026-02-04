"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import ProductGrid from "@/components/products/product-grid"
import FilterSidebar from "@/components/products/filter-sidebar"
import SearchProductsInput from "@/components/products/search-products-input"
import { Filter, X, ChevronDown } from "lucide-react"

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

type FilterState = {
  search: string
  collection: string[]
  priceRange: [number, number] | null
  fragranceNotes: string[]
  productType: string[]
}

export default function FilterableProductsView({
  initialProducts,
}: {
  initialProducts: Product[]
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [sortOption, setSortOption] = useState("featured")

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get("q") || "",
    collection: searchParams.getAll("collection"),
    priceRange:
      searchParams.has("minPrice") && searchParams.has("maxPrice")
        ? [Number.parseInt(searchParams.get("minPrice") || "0"), Number.parseInt(searchParams.get("maxPrice") || "100")]
        : null,
    fragranceNotes: searchParams.getAll("note"),
    productType: searchParams.getAll("type"),
  })

  // Extract all available values for filters from products
  const allCollections = Array.from(new Set(initialProducts.flatMap((product) => product.collections || [])))
  const allFragranceNotes = Array.from(new Set(initialProducts.flatMap((product) => product.fragranceNotes || [])))
  const allProductTypes = Array.from(
    new Set(initialProducts.flatMap((product) => product.variants.map((variant) => variant.title))),
  )

  // Add a check to ensure there are products before calculating min/max prices
  const minPrice = initialProducts.length > 0 ? Math.min(...initialProducts.map((product) => product.price)) : 0
  const maxPrice = initialProducts.length > 0 ? Math.max(...initialProducts.map((product) => product.price)) : 100

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.search) params.set("q", filters.search)
    filters.collection.forEach((c) => params.append("collection", c))
    if (filters.priceRange) {
      params.set("minPrice", filters.priceRange[0].toString())
      params.set("maxPrice", filters.priceRange[1].toString())
    }
    filters.fragranceNotes.forEach((n) => params.append("note", n))
    filters.productType.forEach((t) => params.append("type", t))

    // Count active filters
    let count = 0
    if (filters.search) count++
    count += filters.collection.length
    if (filters.priceRange) count++
    count += filters.fragranceNotes.length
    count += filters.productType.length
    setActiveFiltersCount(count)

    const url = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.replaceState({}, "", url)
  }, [filters])

  // Apply filters when they change
  useEffect(() => {
    let result = [...initialProducts]

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(searchTerm))) ||
          (product.fragranceNotes && product.fragranceNotes.some((note) => note.toLowerCase().includes(searchTerm))),
      )
    }

    // Apply collection filter
    if (filters.collection.length > 0) {
      result = result.filter((product) =>
        filters.collection.some((c) => product.collections && product.collections.includes(c)),
      )
    }

    // Apply price range filter
    if (filters.priceRange) {
      result = result.filter(
        (product) => product.price >= filters.priceRange![0] && product.price <= filters.priceRange![1],
      )
    }

    // Apply fragrance notes filter
    if (filters.fragranceNotes.length > 0) {
      result = result.filter((product) =>
        filters.fragranceNotes.some((note) => product.fragranceNotes && product.fragranceNotes.includes(note)),
      )
    }

    // Apply product type filter
    if (filters.productType.length > 0) {
      result = result.filter((product) =>
        filters.productType.some((type) => product.variants.some((variant) => variant.title === type)),
      )
    }

    // Apply sorting
    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortOption === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    setFilteredProducts(result)
  }, [filters, initialProducts, sortOption])

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handleSearchChange = (term: string) => {
    setFilters((prev) => ({ ...prev, search: term }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: "",
      collection: [],
      priceRange: null,
      fragranceNotes: [],
      productType: [],
    })
    setSortOption("featured")
  }

  const toggleFilterSidebar = () => {
    setIsFilterSidebarOpen(!isFilterSidebarOpen)
  }

  return (
    <div>
      <div className="flex flex-col space-y-4">
        {/* Mobile filter button */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <button
            onClick={toggleFilterSidebar}
            className="flex items-center text-black bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50"
          >
            <Filter size={18} className="mr-2" />
            Filter & Sort
            {activeFiltersCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-black text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button onClick={clearAllFilters} className="text-sm text-black hover:underline">
              Clear all
            </button>
          )}
        </div>

        {/* Main content area with sidebar and products */}
        <div className="flex flex-row">
          {/* Filter sidebar - Desktop (hidden on mobile) */}
          <div className="hidden lg:block w-64 mr-8 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              collections={allCollections}
              fragranceNotes={allFragranceNotes}
              productTypes={allProductTypes}
              minPrice={minPrice}
              maxPrice={maxPrice}
              sortOption={sortOption}
              onSortChange={setSortOption}
            />
          </div>

          {/* Filter sidebar - Mobile (hidden on desktop, shown when open) */}
          <AnimatePresence>
            {isFilterSidebarOpen && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFilterSidebarOpen(false)}
                />
                <motion.div
                  className="fixed inset-y-0 left-0 max-w-full flex z-50"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative w-screen max-w-md">
                    <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">Filters & Sorting</h2>
                        <button
                          className="text-gray-400 hover:text-gray-500"
                          onClick={() => setIsFilterSidebarOpen(false)}
                        >
                          <X size={24} />
                        </button>
                      </div>
                      <div className="flex-1 p-4">
                        <FilterSidebar
                          filters={filters}
                          onFilterChange={handleFilterChange}
                          onClearAll={clearAllFilters}
                          collections={allCollections}
                          fragranceNotes={allFragranceNotes}
                          productTypes={allProductTypes}
                          minPrice={minPrice}
                          maxPrice={maxPrice}
                          sortOption={sortOption}
                          onSortChange={setSortOption}
                        />
                      </div>
                      <div className="p-4 border-t border-gray-200">
                        <button
                          type="button"
                          className="w-full bg-black text-white py-2 px-4 rounded-md font-medium"
                          onClick={() => setIsFilterSidebarOpen(false)}
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main content - Search and Products */}
          <div className="flex-grow">
            {/* Search bar */}
            <div className="mb-8">
              <SearchProductsInput value={filters.search} onChange={handleSearchChange} />
            </div>

            {/* Sort dropdown (desktop) */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <div className="text-sm text-gray-500">Showing {filteredProducts.length} products</div>

              <div className="flex items-center">
                <label htmlFor="desktop-sort" className="mr-2 text-sm font-medium text-gray-700">
                  Sort by
                </label>
                <div className="relative">
                  <select
                    id="desktop-sort"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Active filters display */}
            {activeFiltersCount > 0 && (
              <div className="mb-6 hidden lg:block">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-gray-700">Active filters:</span>

                  {filters.search && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      Search: {filters.search}
                      <button
                        onClick={() => handleFilterChange({ search: "" })}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}

                  {filters.collection.map((collection) => (
                    <span
                      key={collection}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {collection}
                      <button
                        onClick={() =>
                          handleFilterChange({
                            collection: filters.collection.filter((c) => c !== collection),
                          })
                        }
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}

                  {filters.priceRange && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      £{filters.priceRange[0]} - £{filters.priceRange[1]}
                      <button
                        onClick={() => handleFilterChange({ priceRange: null })}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}

                  {filters.fragranceNotes.map((note) => (
                    <span
                      key={note}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {note}
                      <button
                        onClick={() =>
                          handleFilterChange({
                            fragranceNotes: filters.fragranceNotes.filter((n) => n !== note),
                          })
                        }
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}

                  {filters.productType.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {type}
                      <button
                        onClick={() =>
                          handleFilterChange({
                            productType: filters.productType.filter((t) => t !== type),
                          })
                        }
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}

                  <button onClick={clearAllFilters} className="text-black hover:underline text-sm">
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* No results message */}
            {filteredProducts.length === 0 ? (
              <div className="min-h-[400px] flex flex-col items-center justify-center">
                <p className="text-lg text-gray-600 mb-4">No products match your filters</p>
                <button onClick={clearAllFilters} className="bg-black text-white px-6 py-2 rounded">
                  Clear all filters
                </button>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
