import ProductCard from "./product-card"

interface RelatedProductsProps {
  relatedProducts: any[]
}

export default function RelatedProducts({ relatedProducts }: RelatedProductsProps) {
  if (!relatedProducts || relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {relatedProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
