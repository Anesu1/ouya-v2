import { getAllCollections, getAllProducts } from "@/lib/sanity"
import type { Metadata } from "next"
import ProductGrid from "@/components/products/product-grid"

export const metadata: Metadata = {
  title: "All Candles | Ouya Oenda",
  description: "Explore our collection of premium handcrafted candles",
}

export const revalidate = 10 // Revalidate every 60 seconds

export default async function AllProductsPage() {
  // Fetch all products
  const products = await getAllProducts()
  const content = await getAllCollections()

  if (!products) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-4">{content?.title || "All Collection"}</h1>
        <p className="text-gray-600"> {content?.description || "No content available at the moment."}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-4">
        {content?.title ? content?.title : "The Collections"}
      </h1>

      <div className="mb-8">
        <p className="text-gray-600">
          {content?.description
            ? content?.description
            : "Discover our collection of premium handcrafted candles, made with natural soy wax and essential oils for a clean, long-lasting burn."}
        </p>
      </div>

      {/* Simply display all products in a grid without filtering */}
      {Array.isArray(products) && products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products available at the moment. Please check back later.</p>
        </div>
      )}
    </div>
  )
}
