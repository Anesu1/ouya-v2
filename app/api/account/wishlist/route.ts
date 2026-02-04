import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { getProduct } from "@/lib/products"
import type { Session } from "next-auth"

interface CustomSession extends Session {
  user: {
    id: string
    email: string
    name: string
  }
}

const wishlistSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get wishlist items for the user
    const items = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      orderBy: { addedAt: "desc" },
    })

    // For each item, fetch the product details from our product library
    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        // Fetch product from our product library
        const product = getProduct(item.productId)

        if (!product) {
          console.error(`Product not found for ID: ${item.productId}`)
          return {
            ...item,
            product: {
              title: "Product not found",
              handle: "",
              price: "0.00",
              image: "/placeholder.svg",
            },
          }
        }

        return {
          ...item,
          product: {
            title: product.title,
            handle: product.handle,
            price: typeof product.price === "number" ? product.price.toFixed(2) : "0.00",
            image: product.featuredImage || product.images[0]?.url || "/placeholder.svg",
          },
        }
      }),
    )

    return NextResponse.json({ items: itemsWithProducts })
  } catch (error) {
    console.error("[WISHLIST_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { productId, variantId } = body

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 })
    }

    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlist.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
        ...(variantId && { variantId }),
      },
    })

    if (existingItem) {
      return new NextResponse("Item already in wishlist", { status: 400 })
    }

    // Add item to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productId,
        variantId: variantId || null,
      },
    })

    return NextResponse.json(wishlistItem)
  } catch (error) {
    console.error("[WISHLIST_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
