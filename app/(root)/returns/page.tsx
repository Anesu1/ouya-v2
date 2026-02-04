import { sanityClient } from "@/lib/sanity"
import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Returns & Exchanges | Ouya Oenda",
  description:
    "Learn about our return and exchange policies for Ouya Oenda candles. Easy returns within 30 days of purchase.",
  alternates: {
    canonical: "/returns",
  },
  openGraph: {
    title: "Returns & Exchanges | Ouya Oenda",
    description:
      "Learn about our return and exchange policies for Ouya Oenda candles. Easy returns within 30 days of purchase.",
    url: "/returns",
  },
}

export default async function ReturnsPage() {
  const query = `*[_type == "returns"][0]{
    title,
    returnPolicy,
    eligibleItems,
    nonReturnableItems,
    exchangePolicy,
    refundProcess,
    returnShipping,
    howToReturn
  }`

  const returnsData = await sanityClient.fetch(query)

  if (!returnsData) {
    return <div>Error loading Returns & Exchanges information. Please try again later.</div>
  }

  // Returns page JSON-LD
  const returnsJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: returnsData.title || "Returns & Exchanges",
    description: "Return and exchange policies for Ouya Oenda candles",
    mainEntity: {
      "@type": "Article",
      headline: returnsData.title || "Returns & Exchanges",
      description: "Return and exchange policies for Ouya Oenda candles",
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
        id="returns-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(returnsJsonLd) }}
      />
      <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-8">{returnsData.title}</h1>

      <div className="prose prose-lg">
        <h2>Return Policy</h2>
        <p>{returnsData.returnPolicy}</p>

        <h3>Eligible Items</h3>
        <p>To be eligible for a return, your item must be:</p>
        <ul>
          {returnsData.eligibleItems.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h3>Non-Returnable Items</h3>
        <p>The following items cannot be returned:</p>
        <ul>
          {returnsData.nonReturnableItems.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2>Exchange Policy</h2>
        <p>{returnsData.exchangePolicy}</p>

        <h2>Refund Process</h2>
        <p>{returnsData.refundProcess}</p>

        <h2>Return Shipping</h2>
        <p>{returnsData.returnShipping}</p>

        <h2>How to Initiate a Return</h2>
        <ol>
          {returnsData.howToReturn.map((step: string, index: number) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="mt-12 border-t border-gray-200 pt-8">
        <p className="text-gray-600">
          If you have any questions about our return policy, please{" "}
          <a href="/contact" className="text-black font-medium hover:underline">
            contact us
          </a>
          .
        </p>
      </div>
    </div>
  )
}
