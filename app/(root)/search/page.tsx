import ProductGrid from "@/components/products/product-grid"
import type { Metadata } from "next"
import { getAllProducts, searchProducts } from "@/lib/sanity"

interface SearchPageProps {
  searchParams: { q?: string }
}

export async function getResults(){
  const products = getAllProducts()
  return products;
}

// export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
//   const searchTerm = searchParams.q || ""
//   return {
//     title: searchTerm ? `Search: ${searchTerm} | Ouya Oenda` : "Search | Ouya Oenda",
//     description: searchTerm
//       ? `Search results for "${searchTerm}" at Ouya Oenda. Find premium handcrafted candles that match your search.`
//       : "Search for premium handcrafted candles at Ouya Oenda.",
//     robots: {
//       index: false,
//       follow: true,
//     },
//     alternates: {
//       canonical: searchTerm ? `/search?q=${encodeURIComponent(searchTerm)}` : "/search",
//     },
//   }
// }

export default async function SearchPage({ searchParams }: SearchPageProps) {
   const searchTerm = searchParams.q?.trim() || ""

  const products = searchTerm
    ? await searchProducts(searchTerm)
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-light tracking-tight text-charcoal mb-4">
        {searchTerm ? `Search results for "${searchTerm}"` : "Search"}
      </h1>

      {searchTerm ? (
        <>
          <p className="text-charcoal-light mb-8">
            {products.length === 0
              ? "No products found. Try a different search term."
              : `Found ${products.length} product${products.length === 1 ? "" : "s"}.`}
          </p>

          <ProductGrid products={products} />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-charcoal-light">Enter a search term to find products.</p>
        </div>
      )}
    </div>
  )
}
