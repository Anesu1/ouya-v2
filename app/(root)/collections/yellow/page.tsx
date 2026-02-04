export const dynamic = "force-dynamic"

import { getProductsByCollection } from "@/lib/sanity"
import ProductGrid from "@/components/products/product-grid"
import EmptyCollection from "@/components/empty-collection"

export default async function RedCollectionPage() {
  const collection = await getProductsByCollection("yellow-collection")

  if (!collection) {
    return <EmptyCollection collectionName="Yellow Collection" />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light tracking-tight text-charcoal mb-4">{collection.title}</h1>
        <p className="text-lg text-charcoal-light max-w-2xl mx-auto">{collection.description}</p>
      </div>

      {collection.products.length > 0 ? (
        <ProductGrid products={collection.products} />
      ) : (
        <div className="text-center py-12">
          <p className="text-charcoal-light">No products found in this collection.</p>
        </div>
      )}
    </div>
  )
}
