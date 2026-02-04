import type { Metadata } from "next"

// Base metadata that will be used across the site
export const baseMetadata = {
  title: {
    default: "Ouya Oenda | Premium Home Fragrances & Scents",
    template: "%s | Ouya Oenda",
  },
  description:
    "Discover our collection of premium handcrafted candles, luxury reed diffusers, and home fragrance products made with natural ingredients and essential oils",
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
  authors: [{ name: "Ouya Oenda" }],
  creator: "Ouya Oenda",
  publisher: "Ouya Oenda",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ouyaoenda.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ouya Oenda",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ouya Oenda - Premium Home Fragrances & Scents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@ouyaoenda",
    site: "@ouyaoenda",
    images: ["/images/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: "/",
  },
}

// Helper function to generate product metadata
export function generateProductMetadata({
  title,
  description,
  handle,
  images,
  price,
  availability = "in stock",
  productType = "candle",
  tags = [],
}: {
  title: string
  description: string
  handle: string
  images: string[]
  price: number
  availability?: string
  productType?: string
  tags?: string[]
}): Metadata {
  const formattedPrice = (price / 100).toFixed(2)
  const productKeywords = [
    title.toLowerCase(),
    productType.toLowerCase(),
    ...tags.map((tag) => tag.toLowerCase()),
    "home fragrance",
    "Ouya Oenda",
    "premium scents",
  ].filter(Boolean)

  return {
    title,
    description,
    keywords: productKeywords,
    alternates: {
      canonical: `/products/${handle}`,
    },
    openGraph: {
      type: "product",
      title,
      description,
      url: `/products/${handle}`,
      images: images.map((src) => ({
        url: src,
        width: 800,
        height: 800,
        alt: title,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [images[0]],
    },
    other: {
      "product:price:amount": formattedPrice,
      "product:price:currency": "GBP",
      "product:availability": availability,
      "product:category": productType,
    },
  }
}

// Helper function to generate collection metadata
export function generateCollectionMetadata({
  title,
  description,
  handle,
  image,
  products = [],
}: {
  title: string
  description: string
  handle: string
  image?: string
  products?: any[]
}): Metadata {
  // Generate collection-specific keywords
  const collectionKeywords = [
    title.toLowerCase(),
    "collection",
    "Ouya Oenda",
    "home fragrances",
    "premium scents",
    ...products
      .slice(0, 5)
      .map((product) => product?.title?.toLowerCase() || "")
      .filter(Boolean),
  ]

  // Enhanced description that mentions product types
  const enhancedDescription =
    description ||
    `Explore our ${title} collection featuring premium handcrafted candles, luxury reed diffusers, and home fragrance products.`

  return {
    title,
    description: enhancedDescription,
    keywords: collectionKeywords,
    alternates: {
      canonical: `/collections/${handle}`,
    },
    openGraph: {
      type: "website",
      title,
      description: enhancedDescription,
      url: `/collections/${handle}`,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: enhancedDescription,
      images: image ? [image] : undefined,
    },
  }
}

// Helper function to generate JSON-LD structured data for products
export function generateProductJsonLd({
  title,
  description,
  handle,
  images,
  price,
  sku,
  brand = "Ouya Oenda",
  availability = "https://schema.org/InStock",
  reviewCount = 0,
  reviewRating = 0,
  productType = "candle",
  category = "",
}: {
  title: string
  description: string
  handle: string
  images: string[]
  price: number
  sku: string
  brand?: string
  availability?: string
  reviewCount?: number
  reviewRating?: number
  productType?: string
  category?: string
}) {
  const formattedPrice = (price / 100).toFixed(2)

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description,
    image: images,
    sku,
    mpn: sku,
    category:
      category ||
      (productType === "candle" ? "Home & Garden > Decor > Candles" : "Home & Garden > Decor > Home Fragrance"),
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ouyaoenda.com"}/products/${handle}`,
      priceCurrency: "GBP",
      price: formattedPrice,
      availability,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
      seller: {
        "@type": "Organization",
        name: "Ouya Oenda",
      },
    },
  }

  // Add review data if available
  if (reviewCount > 0 && reviewRating > 0) {
    return {
      ...productJsonLd,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: reviewRating.toString(),
        reviewCount: reviewCount.toString(),
        bestRating: "5",
        worstRating: "1",
      },
    }
  }

  return productJsonLd
}

// Helper function to generate breadcrumb JSON-LD
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ouyaoenda.com"}${item.url}`,
    })),
  }
}

// Helper function to generate organization JSON-LD
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ouya Oenda",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://ouyaoenda.com",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ouyaoenda.com"}/logo.png`,
    description:
      "Premium handcrafted candles, luxury reed diffusers, and home fragrance products made with natural ingredients and essential oils.",
    sameAs: [
      "https://www.facebook.com/ouyaoenda",
      "https://www.instagram.com/ouyaoenda",
      "https://twitter.com/ouyaoenda",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-555-5555",
      contactType: "customer service",
      email: "support@ouyaoenda.com",
      availableLanguage: "English",
    },
  }
}

// Helper function to generate collection JSON-LD
export function generateCollectionJsonLd({
  title,
  description,
  handle,
  products = [],
}: {
  title: string
  description: string
  handle: string
  products: any[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description:
      description || `Explore our ${title} collection of premium home fragrances including candles and diffusers.`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ouyaoenda.com"}/collections/${handle}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.title,
          url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ouyaoenda.com"}/products/${product.handle}`,
          image: product.images?.[0],
        },
      })),
    },
  }
}

// Helper function to generate FAQ JSON-LD
export function generateFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

// Helper function to generate local business JSON-LD
export function generateLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Ouya Oenda",
    image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ouyaoenda.com"}/logo.png`,
    "@id": process.env.NEXT_PUBLIC_SITE_URL || "https://ouyaoenda.com",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://ouyaoenda.com",
    telephone: "+1-555-555-5555",
    priceRange: "££",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Fragrance Lane",
      addressLocality: "London",
      postalCode: "SW1A 1AA",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.5074,
      longitude: 0.1278,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/ouyaoenda",
      "https://www.instagram.com/ouyaoenda",
      "https://twitter.com/ouyaoenda",
    ],
  }
}
