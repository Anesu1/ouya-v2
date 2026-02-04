import { prisma } from "./prisma"

// Helper functions for common database operations
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  })
}

export async function getUserByUserId(userId: string) {
  return await prisma.user.findUnique({
    where: { userId },
  })
}

export async function getSessionByToken(token: string) {
  return await prisma.session.findUnique({
    where: { sessionToken: token },
  })
}

export async function getWishlistByUserId(userId: string) {
  return await prisma.wishlist.findMany({
    where: { userId },
  })
}

export async function getOrdersByUserId(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: { items: true },
  })
}

export async function getAddressesByUserId(userId: string) {
  return await prisma.address.findMany({
    where: { userId },
  })
}

export async function getReviewsByProductId(productId: string) {
  return await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true, userId: true } } },
  })
}

// Export the prisma client as db for backward compatibility
export const db = prisma
