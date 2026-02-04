import { getCollection } from "@/lib/sanity"
import ProductGrid from "@/components/products/product-grid"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { generateCollectionMetadata, generateBreadcrumbJsonLd, generateCollectionJsonLd } from "@/lib/seo"
import Script from "next/script"

interface CollectionPageProps {
  params: {
    handle: string
  }
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const collection = await getCollection(params.handle)

  if (!collection) {
    return {
      title: "Collection Not Found | Ouya Oenda",
      description: "The collection you're looking for doesn't exist.",
    }
  }

  // Determine if this is a specific product type collection
  const isCandles = params.handle.includes("candle") || collection.title.toLowerCase().includes("candle")
  const isDiffusers = params.handle.includes("diffuser") || collection.title.toLowerCase().includes("diffuser")

  // Create a more descriptive collection description based on product type
  let enhancedDescription = collection.description
  if (!enhancedDescription) {
    if (isCandles) {
      enhancedDescription = `Explore our ${collection.title} collection of premium handcrafted candles made with natural soy wax and essential oils.`
    } else if (isDiffusers) {
      enhancedDescription = `Discover our ${collection.title} collection of luxury reed diffusers crafted with premium fragrance oils for long-lasting scent.`
    } else {
      enhancedDescription = `Browse our ${collection.title} collection of premium home fragrances including candles, diffusers, and scented products.`
    }
  }

  return generateCollectionMetadata({
    title: `${collection.title} | Ouya Oenda`,
    description: enhancedDescription,
    handle: params.handle,
    image: collection.image,
    products: collection.products || [],
  })
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const collection = await getCollection(params.handle)

  if (!collection) {
    notFound()
  }

  // Generate breadcrumb structured data
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Collections", url: "/collections/all" },
    { name: collection.title, url: `/collections/${params.handle}` },
  ])

  // Collection JSON-LD
  const collectionJsonLd = generateCollectionJsonLd({
    title: collection.title,
    description: collection.description || `Explore our ${collection.title} collection of premium home fragrances.`,
    handle: params.handle,
    products: collection.products || [],
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="collection-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-8">{collection.title}</h1>

      {collection.description && (
        <div className="mb-8">
          <p className="text-gray-600">{collection.description}</p>
        </div>
      )}

      <ProductGrid products={collection.products} />
    </div>
  )
}
