import { getAllProducts, getCollections } from "@/lib/sanity"

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ouyaoenda.com"

  // Get all products from Sanity
  const products = await getAllProducts()
  const productUrls = products.map((product) => {
    // Determine product type for better changefreq and priority
    const productType =
      product.productType || (product.title?.toLowerCase().includes("diffuser") ? "diffuser" : "candle")

    // Featured or new products get higher priority
    const isFeatured = product.featured || product.isNew

    return {
      url: `${baseUrl}/products/${product.handle?.current || product.handle}`,
      lastModified: new Date(product.updatedAt || product._updatedAt || product.createdAt || new Date()),
      changeFrequency: isFeatured ? "daily" : "weekly",
      priority: isFeatured ? 0.9 : 0.8,
    }
  })

  // Get all collections from Sanity
  const collections = await getCollections()
  const collectionUrls = collections.map((collection) => {
    // Main collections get higher priority
    const isMainCollection = ["all", "candles", "diffusers", "bestsellers", "new"].includes(collection.handle)

    return {
      url: `${baseUrl}/collections/${collection.handle}`,
      lastModified: new Date(collection.updatedAt || collection._updatedAt || new Date()),
      changeFrequency: isMainCollection ? "daily" : "weekly",
      priority: isMainCollection ? 0.9 : 0.7,
    }
  })

  // Static pages with appropriate priorities
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/collections/all`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]

  return [...staticPages, ...productUrls, ...collectionUrls]
}
