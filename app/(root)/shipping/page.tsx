import { sanityClient } from "@/lib/sanity"
import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Shipping Information | Ouya Oenda",
  description: "Learn about our shipping policies, delivery times, and shipping costs for Ouya Oenda candles.",
  alternates: {
    canonical: "/shipping",
  },
  openGraph: {
    title: "Shipping Information | Ouya Oenda",
    description: "Learn about our shipping policies, delivery times, and shipping costs for Ouya Oenda candles.",
    url: "/shipping",
  },
}

export default async function ShippingPage() {
  const query = `*[_type == "shippingInfo"][0]{
    title,
    domesticShipping,
    domesticRates,
    internationalShipping,
    orderProcessing,
    trackingInfo,
    shippingRestrictions
  }`

  const shippingData = await sanityClient.fetch(query)

  if (!shippingData) {
    return <div>Error loading Shipping Information. Please try again later.</div>
  }

  // Shipping page JSON-LD
  const shippingJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: shippingData.title || "Shipping Information",
    description: "Learn about our shipping policies, delivery times, and shipping costs for Ouya Oenda candles.",
    mainEntity: {
      "@type": "Article",
      headline: shippingData.title || "Shipping Information",
      description: "Shipping policies and information for Ouya Oenda candles",
      author: {
        "@type": "Organization",
        name: "Ouya Oenda",
      },
      publisher: {
        "@type": "Organization",
        name: "Ouya Oenda",
        logo: {
          "@type": "ImageObject",
          url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ouyaoenda.com"}/logo.png`,
        },
      },
    },
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Script
        id="shipping-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shippingJsonLd) }}
      />
      <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-8">{shippingData.title}</h1>

      <div className="prose prose-lg">
        <h2>Domestic Shipping</h2>
        <p>{shippingData.domesticShipping}</p>

        <table className="min-w-full divide-y divide-gray-200 my-6">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shipping Method
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estimated Delivery
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shippingData.domesticRates.map((rate: any, index: number) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rate.method}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rate.deliveryTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rate.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>International Shipping</h2>
        <p>{shippingData.internationalShipping}</p>

        <h2>Order Processing</h2>
        <p>{shippingData.orderProcessing}</p>

        <h2>Tracking Your Order</h2>
        <p>{shippingData.trackingInfo}</p>

        <h2>Shipping Restrictions</h2>
        <p>{shippingData.shippingRestrictions}</p>
      </div>

      <div className="mt-12 border-t border-gray-200 pt-8">
        <p className="text-gray-600">
          If you have any questions about shipping, please{" "}
          <a href="/contact" className="text-black font-medium hover:underline">
            contact us
          </a>
          .
        </p>
      </div>
    </div>
  )
}
