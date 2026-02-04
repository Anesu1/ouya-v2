import { getHomepageContent } from "@/lib/sanity"
import HeroCarousel from "@/components/home/hero-carousel"
import MoodSection from "@/components/home/mood-section"
import FeaturedProducts from "@/components/home/featured-products"
import NewsletterSection from "@/components/home/newsletter-section"
import CollectionsShowcase from "@/components/home/collections-showcase"
import type { Metadata } from "next"
import Script from "next/script"
import { generateOrganizationJsonLd } from "@/lib/seo"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Premium Home Fragrances & Scents | Ouya Oenda",
  description:
    "Discover our collection of premium handcrafted candles, luxury reed diffusers, and home fragrance products made with natural ingredients and essential oils.",
  keywords: [
    "handcrafted candles",
    "luxury reed diffusers",
    "premium home fragrances",
    "natural soy candles",
    "essential oil diffusers",
    "home scents",
    "aromatherapy products",
    "sustainable home fragrance",
    "eco-friendly candles",
    "luxury home scents",
    "Ouya Oenda",
    "gift sets",
    "scented collections",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Premium Home Fragrances & Scents | Ouya Oenda",
    description:
      "Discover our collection of premium handcrafted candles, luxury reed diffusers, and home fragrance products made with natural ingredients and essential oils.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ouya Oenda - Premium Home Fragrances & Scents",
      },
    ],
  },
}

export default async function Home() {
  // Fetch dynamic homepage content from Sanity
  const homepageContent = await getHomepageContent()
  const session = getServerSession(authOptions)

  // Organization JSON-LD


  return (
    <main>
    
      <MoodSection content={homepageContent} />
      {/* Pass the dynamic hero carousel data from Sanity */}

      {/* Brand Statement with dynamic content */}
      <section className="py-16 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-light mb-6 brand-statement">
            {homepageContent?.brandStatement?.heading || "Handcrafted with Care"}
          </h2>
          <p className="text-lg text-gray-300">
            {homepageContent?.brandStatement?.description ||
              "Every Ouya Oenda product is meticulously crafted using premium natural ingredients, essential oils, and sustainable materials for a luxurious home fragrance experience that transforms your space."}
          </p>
        </div>
      </section>

      <FeaturedProducts homepageContent={homepageContent} products={homepageContent?.featuredProducts || []} />
      <HeroCarousel slides={homepageContent?.heroCarousel || []} />

      <CollectionsShowcase collections={homepageContent?.featuredCollections || []} />
      <NewsletterSection />
    </main>
  )
}
