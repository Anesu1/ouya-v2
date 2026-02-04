// Shopify Storefront API integration

type ShopifyImage = {
  url: string
  altText?: string
}

export type ShopifyProduct = {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: ShopifyImage[]
  variants: {
    id: string
    title: string
    price: string
    compareAtPrice: string | null
    availableForSale: boolean
  }[]
}

// Update the shopifyFetch function to include better error handling and logging

interface ShopifyFetchProps {
  query: string
  variables?: Record<string, any>
  cache?: RequestCache
}

// Replace the shopifyFetch function with this improved version:
export async function shopifyFetch({
  query,
  variables = {},
  cache = "force-cache",
}: ShopifyFetchProps): Promise<{ status: number; body: any }> {
  try {
    if (!process.env.SHOPIFY_STORE_DOMAIN) {
      console.error("Missing SHOPIFY_STORE_DOMAIN environment variable")
      throw new Error("Configuration error: Missing SHOPIFY_STORE_DOMAIN")
    }

    if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      console.error("Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable")
      throw new Error("Configuration error: Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN")
    }

    const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache,
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`Shopify API error: ${res.status} ${text}`)
      throw new Error(`Shopify API error: ${res.status}`)
    }

    const body = await res.json()

    if (body.errors) {
      console.error("Shopify GraphQL errors:", body.errors)
      throw new Error(`Shopify GraphQL errors: ${body.errors.map((e) => e.message).join(", ")}`)
    }

    return {
      status: res.status,
      body,
    }
  } catch (error) {
    console.error("Error fetching from Shopify:", error)
    throw new Error(`Error fetching from Shopify: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

const getAllProductsQuery = `
query GetAllProducts {
  products(first: 12, sortKey: BEST_SELLING) {
    edges {
      node {
        id
        title
        handle
        description
        descriptionHtml
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  }
}
`

const getProductQuery = `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
    }
  }
`

const getCollectionsQuery = `
  query GetCollections {
    collections(first: 10) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`

const getCollectionQuery = `
  query GetCollection($handle: String!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
      image {
        url
        altText
      }
    }
  }
`

function reshapeProducts(edges: any[]) {
  return edges.map(({ node }: any) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    priceRange: node.priceRange,
    compareAtPriceRange: node.compareAtPriceRange,
    images: node.images.edges.map(({ node: imageNode }: any) => ({
      url: imageNode.url,
      altText: imageNode.altText || node.title,
    })),
    variants: node.variants.edges.map(({ node: variantNode }: any) => ({
      id: variantNode.id,
      title: variantNode.title,
      price: variantNode.price.amount,
      compareAtPrice: variantNode.compareAtPrice?.amount || null,
      availableForSale: variantNode.availableForSale,
    })),
  }))
}

function reshapeProduct(product: any) {
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    priceRange: product.priceRange,
    compareAtPriceRange: product.compareAtPriceRange,
    images: product.images.edges.map(({ node }: any) => ({
      url: node.url,
      altText: node.altText || product.title,
    })),
    variants: product.variants.edges.map(({ node: variantNode }: any) => ({
      id: variantNode.id,
      title: variantNode.title,
      price: variantNode.price.amount,
      compareAtPrice: variantNode.compareAtPrice?.amount || null,
      availableForSale: variantNode.availableForSale,
    })),
  }
}

// Update the getAllProducts function to handle errors better:
export async function getAllProducts() {
  try {
    const { body } = await shopifyFetch({
      query: getAllProductsQuery,
    })

    return reshapeProducts(body.data.products.edges)
  } catch (error) {
    console.error("Error getting all products:", error)
    // Return an empty array instead of throwing to prevent page crashes
    return []
  }
}

// Update other functions to include better error handling
export async function getProduct(handle: string) {
  try {
    const { body } = await shopifyFetch({
      query: getProductQuery,
      variables: { handle },
    })

    if (!body.data.product) {
      throw new Error(`Product not found: ${handle}`)
    }

    return reshapeProduct(body.data.product)
  } catch (error) {
    console.error(`Error getting product ${handle}:`, error)
    return null
  }
}

export async function createCheckout(lineItems: any[]) {
  const response = await shopifyFetch({
    query: `
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }
    `,
    variables: {
      input: {
        lineItems,
      },
    },
  })

  if (response.error || response.body?.data?.checkoutCreate?.checkoutUserErrors?.length > 0) {
    console.error("Error creating checkout:", response.error || response.body?.data?.checkoutCreate?.checkoutUserErrors)
    return null
  }

  return response.body.data.checkoutCreate.checkout
}

export async function getCollections() {
  try {
    const { body } = await shopifyFetch({
      query: getCollectionsQuery,
    })

    return body.data.collections.edges.map(({ node }: any) => node)
  } catch (error) {
    console.error("Error getting collections:", error)
    return []
  }
}

export async function getCollection(handle: string) {
  try {
    const { body } = await shopifyFetch({
      query: getCollectionQuery,
      variables: { handle },
    })

    if (!body.data.collection) {
      throw new Error(`Collection not found: ${handle}`)
    }

    return {
      ...body.data.collection,
      products: reshapeProducts(body.data.collection.products.edges),
    }
  } catch (error) {
    console.error(`Error getting collection ${handle}:`, error)
    return null
  }
}

// Debug function to test Shopify connection
export async function testShopifyConnection() {
  try {
    const result = await getAllProducts()
    console.log(`Successfully fetched ${result.length} products from Shopify`)
    return true
  } catch (error) {
    console.error("Failed to connect to Shopify:", error)
    return false
  }
}
