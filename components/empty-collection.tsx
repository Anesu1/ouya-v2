import Link from "next/link"
import { ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyCollectionProps {
  collectionName: string
}

export default function EmptyCollection({ collectionName }: EmptyCollectionProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-amber-50 p-6 rounded-full mb-6">
        <ShoppingBag className="h-12 w-12 text-amber-500" />
      </div>
      <h2 className="text-2xl font-medium text-charcoal mb-3">No products found</h2>
      <p className="text-charcoal-light max-w-md mb-8">
        We couldn't find any products in the {collectionName}. Check back soon as we're constantly updating our
        collections.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline">
          <Link href="/collections/all">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse other collections
          </Link>
        </Button>
        <Button asChild>
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    </div>
  )
}
