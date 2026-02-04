export interface ProductVariant {
  id: string
  title: string
  price: number
  compareAtPrice?: number
  weight: number // in grams
  inStock: boolean
  sku: string
}

export interface ProductImage {
  url: string
  altText: string
}

export interface Product {
  _id: string
  handle: {
    current: string
  }
  title: string
  description: string
  descriptionHtml: string
  price: number
  compareAtPrice?: number
  images: ProductImage[]
  variants: ProductVariant[]
  collections: string[]
  createdAt: string
  featuredImage: string
  tags: string[]
  vendor: string
  fragranceNotes?: string[]
  ratings?: number // Added rating for products
  reviews?: string[] // Added reviews for products
  shippingInfo?: string // Added shipping information
  careInstructions?: string // Added care instructions for products
}

export interface Collection {
  id: string
  handle: string
  title: string
  description: string
  products: string[] // Product IDs
  image?: string
  featuredImage?: string // Added featured image for collection display
  backgroundColor?: string // Added background color for styling
  textColor?: string // Added text color for styling
}

// Add this helper function at the top of the file
function safeJsonParse(jsonString: string, fallback: any = {}) {
  try {
    return typeof jsonString === "string" ? JSON.parse(jsonString) : fallback
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return fallback
  }
}

// Product data
export const products: Product[] = [
  {
    _id: "prod_01",
    handle: { current: "102g-candle" },
    title: "102g Candle",
    description: "A warm, romantic fragrance with hints of amber and rose, perfect for intimate evenings.",
    descriptionHtml:
      "<p>A warm, romantic fragrance with hints of amber and rose, perfect for intimate evenings.</p><p>Made with 100% natural soy wax and premium fragrance oils for a clean, long-lasting burn.</p>",
    price: 24.99,
    compareAtPrice: 29.99,
    images: [
      {
        url: "/images/products/mina-nawe-1.png",
        altText: "Ouya Oenda Mina Nawe collection featuring candles and reed diffuser",
      },
      {
        url: "/images/products/mina-nawe-2.png",
        altText: "Ouya Oenda Mina Nawe candle top view with cork lid",
      },
      {
        url: "/images/products/mina-nawe-3.png",
        altText: "Ouya Oenda Mina Nawe candle with heart light backdrop",
      },
      {
        url: "/images/products/mina-nawe-4.png",
        altText: "Ouya Oenda Mina Nawe candle with heart light backdrop",
      },
    ],
    variants: [
      {
        id: "var_01",
        title: "102g Candle",
        price: 24.99,
        compareAtPrice: 29.99,
        weight: 102,
        inStock: true,
        sku: "OO-MN-102",
      },
      {
        id: "var_02",
        title: "200g Candle",
        price: 39.99,
        compareAtPrice: 45.99,
        weight: 200,
        inStock: true,
        sku: "OO-MN-200",
      },
      {
        id: "var_03",
        title: "120ml Reed Diffuser",
        price: 32.99,
        compareAtPrice: 37.99,
        weight: 120,
        inStock: true,
        sku: "OO-MN-RD",
      },
      {
        id: "var_04",
        title: "582g Candle",
        price: 69.99,
        compareAtPrice: 79.99,
        weight: 582,
        inStock: true,
        sku: "OO-MN-582",
      },
    ],
    collections: ["all", "scented", "red", "bestsellers"],
    createdAt: "2025-01-15T00:00:00Z",
    featuredImage: "/images/products/mina-nawe-2.png",
    tags: ["romantic", "amber", "rose", "red collection"],
    vendor: "Ouya Oenda",
    fragranceNotes: ["Raspberries", "Black Tea", "Amber"],
  },
  {
    _id: "prod_02",
    handle: { current: "582g-candle" },
    title: "582g Candle",
    description: "A refreshing blend of pine, cedar, and earthy notes that evokes a peaceful walk through the forest.",
    descriptionHtml:
      "<p>A refreshing blend of pine, cedar, and earthy notes that evokes a peaceful walk through the forest.</p><p>Made with 100% natural soy wax and premium fragrance oils for a clean, long-lasting burn.</p>",
    price: 24.99,
    compareAtPrice: 29.99,
    images: [
      {
        url: "/images/products/mina-nawe-5.png",
        altText: "Ouya Oenda Mina Nawe collection featuring candles and reed diffuser",
      },
      {
        url: "/images/products/mina-nawe-6.png",
        altText: "Ouya Oenda Mina Nawe collection featuring candles and reed diffuser",
      },
    ],
    variants: [
      {
        id: "var_05",
        title: "102g Candle",
        price: 24.99,
        compareAtPrice: 29.99,
        weight: 102,
        inStock: true,
        sku: "OO-FW-102",
      },
      {
        id: "var_06",
        title: "200g Candle",
        price: 39.99,
        compareAtPrice: 45.99,
        weight: 200,
        inStock: true,
        sku: "OO-FW-200",
      },
      {
        id: "var_07",
        title: "120ml Reed Diffuser",
        price: 32.99,
        compareAtPrice: 37.99,
        weight: 120,
        inStock: true,
        sku: "OO-FW-RD",
      },
    ],
    collections: ["all", "scented", "green"],
    createdAt: "2025-01-20T00:00:00Z",
    featuredImage: "/images/products/mina-nawe-5.png",
    tags: ["fresh", "woody", "green collection"],
    vendor: "Ouya Oenda",
    fragranceNotes: ["Pine", "Cedar", "Sandalwood"],
  },
  {
    _id: "prod_03",
    handle: { current: "120ml-diffuser" },
    title: "120ml Diffuser",
    description:
      "An elegant floral fragrance with jasmine, ylang-ylang, and a hint of vanilla for a sophisticated ambiance.",
    descriptionHtml:
      "<p>An elegant floral fragrance with jasmine, ylang-ylang, and a hint of vanilla for a sophisticated ambiance.</p><p>Made with 100% natural soy wax and premium fragrance oils for a clean, long-lasting burn.</p>",
    price: 24.99,
    compareAtPrice: 29.99,
    images: [
      {
        url: "/images/products/mina-nawe-7.png",
        altText: "Ouya Oenda Mina Nawe collection featuring candles and reed diffuser",
      },
    ],
    variants: [
      {
        id: "var_08",
        title: "102g Candle",
        price: 24.99,
        compareAtPrice: 29.99,
        weight: 102,
        inStock: true,
        sku: "OO-MJ-102",
      },
      {
        id: "var_09",
        title: "200g Candle",
        price: 39.99,
        compareAtPrice: 45.99,
        weight: 200,
        inStock: true,
        sku: "OO-MJ-200",
      },
      {
        id: "var_10",
        title: "120ml Reed Diffuser",
        price: 32.99,
        compareAtPrice: 37.99,
        weight: 120,
        inStock: true,
        sku: "OO-MJ-RD",
      },
    ],
    collections: ["all", "scented", "blue", "bestsellers"],
    createdAt: "2025-01-25T00:00:00Z",
    featuredImage: "/images/products/mina-nawe-7.png",
    tags: ["floral", "elegant", "blue collection"],
    vendor: "Ouya Oenda",
    fragranceNotes: ["Jasmine", "Ylang-Ylang", "Black Tea", "Vanilla"],
  },
]

// Collection data
export const collections: Collection[] = [
  {
    id: "col_01",
    handle: "all",
    title: "All Candles",
    description: "Our complete collection of premium handcrafted candles.",
    products: ["prod_01", "prod_02", "prod_03", "prod_04"],
    image: "/images/products/mina-nawe-1.png",
    featuredImage: "/images/products/mina-nawe-6.png",
    backgroundColor: "#f8f8f8",
    textColor: "#000000",
  },
  {
    id: "col_02",
    handle: "scented",
    title: "Scented Candles",
    description: "Luxurious scented candles made with premium fragrance oils.",
    products: ["prod_01", "prod_02", "prod_03", "prod_04"],
    image: "/images/products/mina-nawe-3.png",
    featuredImage: "/images/products/mina-nawe-3.png",
    backgroundColor: "#f5f0e6",
    textColor: "#000000",
  },
  {
    id: "col_03",
    handle: "red",
    title: "Red Collection",
    description: "Bold and passionate scents for an intimate atmosphere.",
    products: ["prod_01"],
    image: "/images/red-collection.png",
    featuredImage: "/images/red-collection-logo.png",
    backgroundColor: "#1a1a1a",
    textColor: "#ffffff",
  },
  {
    id: "col_04",
    handle: "bestsellers",
    title: "Bestsellers",
    description: "Our most loved candles and fragrances.",
    products: ["prod_01", "prod_03"],
    image: "/images/products/mina-nawe-3.png",
    featuredImage: "/images/products/mina-nawe-2.png",
    backgroundColor: "#ffffff",
    textColor: "#000000",
  },
  {
    id: "col_05",
    handle: "green",
    title: "Green Collection",
    description: "Fresh, natural scents inspired by forest botanicals.",
    products: ["prod_02"],
    image: "/images/green-collection.png",
    featuredImage: "/images/notes/sandalwood.png",
    backgroundColor: "#1a1a1a",
    textColor: "#ffffff",
  },
  {
    id: "col_06",
    handle: "blue",
    title: "Blue Collection",
    description: "Calming ocean-inspired fragrances for relaxation.",
    products: ["prod_03"],
    image: "/images/blue-collection.png",
    featuredImage: "/images/notes/black-tea.png",
    backgroundColor: "#1a1a1a",
    textColor: "#ffffff",
  },
  {
    id: "col_07",
    handle: "yellow",
    title: "Yellow Collection",
    description: "Bright, uplifting scents to energize your space.",
    products: ["prod_04"],
    image: "/images/yellow-collection.png",
    featuredImage: "/images/notes/raspberries.png",
    backgroundColor: "#1a1a1a",
    textColor: "#ffffff",
  },
]

// Helper functions
export function getAllProducts(): Product[] {
  return products
}

export function getProduct(handle: string): Product | null {
  return products.find((product) => product.handle.current === handle) || null
}

export function getCollection(handle: string): Collection | null {
  return collections.find((collection) => collection.handle === handle) || null
}

export function getProductsByCollection(collectionHandle: string): Product[] {
  const collection = getCollection(collectionHandle)
  if (!collection) return []

  return collection.products
    .map((productId) => products.find((product) => product._id === productId))
    .filter((product): product is Product => product !== undefined)
}

export function getRelatedProducts(currentProductId: string, limit = 3): Product[] {
  // Get products that aren't the current one
  const otherProducts = products.filter((product) => product._id !== currentProductId)

  // For now, just return random products since we don't have many
  return otherProducts.slice(0, limit)
}

export function getAllCollections(): Collection[] {
  return collections
}

export function getFragranceNotes(): string[] {
  // Extract all unique fragrance notes from products
  const allNotes = products
    .flatMap((product) => product.fragranceNotes || [])
    .filter((note, index, self) => self.indexOf(note) === index)

  return allNotes
}
