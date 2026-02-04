import { type Product } from "@/lib/products"
import { getAllProducts } from "./sanity"

/**
 * Search products by term
 * @param searchTerm The search term to look for
 * @returns Array of matching products
 */
export async function searchProducts(searchTerm: string): Promise<Product[]> {
  const products = await getAllProducts()
  const term = searchTerm.toLowerCase().trim()

  if (!term) return []

  return products.filter((product) => {
    // Search in title
    if (product.title.toLowerCase().includes(term)) return true

    // Search in description
    if (product.description?.toLowerCase().includes(term)) return true

    // Search in tags
    if (product.tags?.some((tag) => tag.toLowerCase().includes(term))) return true

    // Search in collections
    if (product.collections?.some((collection) => collection.toLowerCase().includes(term))) return true

    // Search in fragrance notes
    if (product.fragranceNotes?.some((note) => note.toLowerCase().includes(term))) return true

    // Search in variants
    if (product.variants?.some((variant) => variant.title.toLowerCase().includes(term))) return true

    return false
  })
}

/**
 * Get search suggestions based on a partial search term
 * @param partialTerm The partial search term
 * @param limit Maximum number of suggestions to return
 * @returns Array of search suggestions
 */
export async function getSearchSuggestions(partialTerm: string, limit = 5): Promise<string[]> {
  const products = await getAllProducts()
  const term = partialTerm.toLowerCase().trim()

  if (!term || term.length < 2) return []

  const suggestions = new Set<string>()

  // Add product titles
  products.forEach((product) => {
    if (product.title.toLowerCase().includes(term)) {
      suggestions.add(product.title)
    }
  })

  // Add fragrance notes
  products.forEach((product) => {
    product.fragranceNotes?.forEach((note) => {
      if (note.toLowerCase().includes(term)) {
        suggestions.add(note)
      }
    })
  })

  // Add collections
  products.forEach((product) => {
    product.collections?.forEach((collection) => {
      if (collection.toLowerCase().includes(term)) {
        const formattedCollection =
          collection.charAt(0).toUpperCase() + collection.slice(1) + " Collection"
        suggestions.add(formattedCollection)
      }
    })
  })

  // Add tags
  products.forEach((product) => {
    product.tags?.forEach((tag) => {
      if (tag.toLowerCase().includes(term)) {
        suggestions.add(tag)
      }
    })
  })

  return Array.from(suggestions).slice(0, limit)
}
