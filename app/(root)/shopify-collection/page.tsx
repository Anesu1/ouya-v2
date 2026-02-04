import ShopifyCollection from "@/components/shopify/shopify-collection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopify Collection | Ouya Oenda",
  description: "Browse our Shopify collection of premium home fragrances.",
};

export default function ShopifyCollectionPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-8">
        Our Collection
      </h1>

      <p className="text-gray-600 mb-8">
        Discover our curated selection of premium home fragrances, handcrafted
        candles, and luxury reed diffusers.
      </p>

      <ShopifyCollection
        collectionId="677459460441"
        domain="i2zhw1-yp.myshopify.com"
        storefrontAccessToken="d60527deb542a695bb1fb4f7db838dcc"
        moneyFormat="%C2%A3%7B%7Bamount%7D%7D"
        className="min-h-[400px]"
      />
    </div>
  );
}