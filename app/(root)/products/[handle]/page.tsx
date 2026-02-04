import { getProduct } from "@/lib/sanity"
import ProductDetails from "@/components/products/product-details"
import type { Metadata } from "next"
import { generateProductMetadata, generateProductJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo"
import Script from "next/script"
import { notFound } from "next/navigation"



export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  const productType = product.productType || (product.title?.toLowerCase().includes("diffuser") ? "diffuser" : "candle")

  let category = ""
  if (productType === "diffuser") {
    category = "Home & Garden > Decor > Home Fragrance > Diffusers"
  } else if (productType === "candle") {
    category = "Home & Garden > Decor > Candles"
  } else {
    category = "Home & Garden > Decor > Home Fragrance"
  }

  const productJsonLd = generateProductJsonLd({
    title: product.title,
    description:
      product.description || `Discover the ${product.title} from Ouya Oenda's premium home fragrance collection.`,
    handle,
    images: product.images || ["/images/product-placeholder.jpg"],
    price: product.price || 0,
    sku: product.sku || handle,
    availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    reviewCount: product.reviewCount || 0,
    reviewRating: product.reviewRating || 0,
    productType,
    category,
  })

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Products", url: "/collections/all" },
    { name: product.title, url: `/products/${handle}` },
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetails product={product} />

      <div className="mt-16 border-t border-gray-200 pt-16">{/*    <ProductReviews productId={product._id} /> */}</div>

      <div className="mt-24 border-t border-gray-200 pt-16">
        <h2 className="text-2xl font-medium mb-8">You may also like</h2>
        {/* <RelatedProducts relatedProducts={relatedProducts} /> */}
      </div>
    </div>
  )
}
