export const dynamic = "force-dynamic"

import { sanityClient } from "@/lib/sanity"
import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Ouya Oenda",
  description: "Find answers to common questions about Ouya Oenda candles, shipping, returns, and more.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | Ouya Oenda",
    description: "Find answers to common questions about Ouya Oenda candles, shipping, returns, and more.",
    url: "/faq",
  },
}

export default async function FAQPage() {
  const query = `*[_type == "faq"] | order(_createdAt asc){
    question,
    answer
  }`

  const faqs = await sanityClient.fetch(query)

  if (!faqs || faqs.length === 0) {
    return <div>Error loading FAQs. Please try again later.</div>
  }

  // FAQ JSON-LD
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq: { question: string; answer: string }) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-8 text-center">Frequently Asked Questions</h1>

      <div className="space-y-8">
        {faqs.map((faq: { question: string; answer: string }, index: number) => (
          <div key={index} className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h2>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Still have questions? Please{" "}
          <a href="/contact" className="text-black font-medium hover:underline">
            contact us
          </a>{" "}
          and we'll be happy to help.
        </p>
      </div>
    </div>
  )
}
