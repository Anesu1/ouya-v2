import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  addressLine1: z.string().min(3, "Address must be at least 3 characters"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(5, "Phone number is required"),
  isDefault: z.boolean().optional(),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get addresses for the user
    const userAddresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    })

    return NextResponse.json({ addresses: userAddresses })
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = addressSchema.parse(body)

    // If this is the first address or marked as default, update all other addresses to not be default
    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      })
    }

    // Create new address
    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        name: validatedData.name,
        addressLine1: validatedData.addressLine1,
        addressLine2: validatedData.addressLine2,
        city: validatedData.city,
        state: validatedData.state,
        postalCode: validatedData.postalCode,
        country: validatedData.country,
        phone: validatedData.phone,
        isDefault: validatedData.isDefault || false,
      },
    })

    return NextResponse.json({ success: true, address })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating address:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
