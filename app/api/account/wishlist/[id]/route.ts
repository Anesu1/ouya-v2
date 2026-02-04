import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 })
    }

    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    if (!wishlistItem) {
      return new NextResponse("Wishlist item not found", { status: 404 })
    }

    await prisma.wishlist.delete({
      where: { id: id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[WISHLIST_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
