import { createClient } from "next-sanity"
import imageUrlBuilder from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  apiVersion: "2023-05-03",
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
}

// Set up the client for fetching data
export const sanityClient = createClient(config)

// Helper function for generating image URLs
const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  // Check if source is valid before passing to builder
  if (!source) {
    console.warn("Invalid source provided to urlFor")
    return builder.image({})
  }
  return builder.image(source)
}

// Fetch all products
export async function getProducts() {
  return await sanityClient.fetch(`
    *[_type == "product"] {
      _id,
      title,
      handle,
      description,
      "descriptionHtml": pt::text(description),
      price,
      compareAtPrice,
      images[] {
        "url": asset->url,
        "altText": alt
      },
      variants[] {
        _key,
        title,
        price,
        compareAtPrice,
        weight,
        inStock,
        sku
      },
      collections[] -> slug.current,
      "createdAt": _createdAt,
      "featuredImage": images[0].asset->url,
      tags,
      vendor,
      fragranceNotes[]
    }
  `)
}

// Fetch a single product by its handle
export async function getProduct(handle: string) {
  return await sanityClient.fetch(
    `
    *[_type == "product" && handle.current == $handle][0] {
      _id,
      title,
      "handle": handle.current,
      description,
      "descriptionHtml": pt::text(description),
      price,
      compareAtPrice,
      images[] {
        "url": asset->url,
        "altText": alt
      },
      variants[] {
        _key,
        title,
        price,
        compareAtPrice,
        weight,
        inStock,
        sku
      },
      collections[]-> {
        "handle": slug.current,
        title,
        slug
      },
      "createdAt": _createdAt,
      "featuredImage": images[0].asset->url,
      tags,
      vendor,
      fragranceNotes[],
      burnTime,
      ingredients,
      dimensions,
      productDetails,
      shippinhInfo,
      careInstructions,
      sustainability,
      "relatedProducts": *[_type == "product" && _id != ^._id && count((collections[]->slug.current)[@ in ^.collections[]->slug.current]) > 0][0...4] {
        _id,
        title,
        "handle": handle.current,
        price,
        "featuredImage": images[0].asset->url,
        variants[]{
          _key,
          title,
          price,
          inStock
        }
      }
    }
  `,
    { handle },
  )
}

// Fetch all collections
export async function getCollections() {
  return await sanityClient.fetch(`
    *[_type == "collection"] {
      _id,
      title,
      "handle": slug.current,
      description,
      "products": *[_type == "product" && references(^._id)]._id,
      "image": image.asset->url,
      "featuredImage": featuredImage.asset->url,
      backgroundColor,
      textColor
    }
  `)
}

// Fetch a single collection by its handle
export async function getCollection(handle: string) {
  return await sanityClient.fetch(
    `
    *[_type == "collection" && slug.current == $handle][0] {
      _id,
      title,
      "handle": slug.current,
      description,
      "products": *[_type == "product" && references(^._id)] {
        _id,
        title,
        handle,
        description,
        price,
        compareAtPrice,
        "featuredImage": images[0].asset->url,
        "images": images[] {
          "url": asset->url,
          "altText": alt
        },
        variants[] {
          _key,
          title,
          price,
          compareAtPrice,
          weight,
          inStock,
          sku
        }
      },
      "image": image.asset->url,
      "featuredImage": featuredImage.asset->url,
      backgroundColor,
      textColor
    }
  `,
    { handle },
  )
}

export async function getAllCollections() {
  return await sanityClient.fetch(`
    *[_type == "allCollection"][0] {
        title,
        description,
    }
  `)
}

export async function getProductsByCollection(collectionSlug: string) {
  return await sanityClient.fetch(
    `
    *[_type == "collection" && slug.current == $collectionSlug][0] {
      title,
      description,
      "products": *[_type == "product" && references(^._id)] {
        _id,
        title,
        handle,
        description,
        price,
        compareAtPrice,
        "featuredImage": images[0].asset->url,
        variants[] {
          _key,
          title,
          price,
          inStock
        }
      }
    }
    `,
    { collectionSlug },
  )
}

// Fetch homepage content
export async function getHomepageContent() {
  return await sanityClient.fetch(`
    *[_type == "homepage"][0] {
      heroCarousel[] {
        title,
        description,
        "image": image.asset->url,
        link
      },
      featuredCollections[] -> {
        title,
        "handle": slug.current,
        description,
        "image": image.asset->url
      },
      brandStatement {
        heading,
        description
      },
      featuredStatement {
        heading,
        description
      },
      featuredProducts[] -> {
        _id,
        title,
        handle,
        "featuredImage": images[0].asset->url,
        price
      },
      perfectScent {
        heading,
          description,
           "image": image.asset->url,
        scents[] 
      }
    }
  `)
}

export async function getAllProducts() {
  return await sanityClient.fetch(`
    *[_type == "product"] {
      _id,
      title,
      handle,
      description,
      "descriptionHtml": pt::text(description),
      price,
      compareAtPrice,
      images[] {
        "url": asset->url,
        "altText": alt
      },
      variants[] {
        _key,
        title,
        price,
        compareAtPrice,
        weight,
        inStock,
        sku
      },
      "createdAt": _createdAt,
      "featuredImage": images[0].asset->url,
      tags,
      vendor,
      fragranceNotes[]
    }
  `)
}

export async function searchProducts(searchTerm: string) {
  const term = `*${searchTerm.toLowerCase()}*`

  return await sanityClient.fetch(
    `*[
      _type == "product" && (
        lower(title) match "*" + lower($term) + "*" || 
        lower(pt::text(description)) match "*" + lower($term) + "*" || 
        lower(vendor) match "*" + lower($term) + "*" ||
        lower($term) in tags[] ||
        lower($term) in fragranceNotes[]
      )
    ] {
      _id,
      title,
      handle,
      description,
      "descriptionHtml": pt::text(description),
      price,
      compareAtPrice,
      images[] {
        "url": asset->url,
        "altText": alt
      },
      variants[] {
        _key,
        title,
        price,
        compareAtPrice,
        weight,
        inStock,
        sku
      },
      "createdAt": _createdAt,
      "featuredImage": images[0].asset->url,
      tags,
      vendor,
      fragranceNotes[]
    }`,
    { term }
  )
}

export async function getNotification() {
  return await sanityClient.fetch(`
    *[_type == "notification" && isActive == true && startDate <= now() && endDate >= now()][0] {
      message,
      isActive,
      startDate,
      endDate
    }
  `)
}
