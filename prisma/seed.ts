import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/auth"
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seed...")

  // Create a test user
  const hashedPassword = await hashPassword("password123")
  const userId = uuidv4()

  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      userId,
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
    },
  })

  console.log(`Created user: ${user.name} (${user.email})`)

  // Create a test address
  const address = await prisma.address.create({
    data: {
      userId: user.userId,
      name: "Home",
      addressLine1: "123 Main St",
      city: "Anytown",
      state: "CA",
      postalCode: "12345",
      country: "USA",
      phone: "555-123-4567",
      isDefault: true,
    },
  })

  console.log(`Created address: ${address.name} for ${user.name}`)

  // Create a test order
  const orderId = uuidv4().substring(0, 8)

  const order = await prisma.order.create({
    data: {
      orderId,
      userId: user.userId,
      total: 9999, // $99.99
      status: "processing",
      shippingName: user.name,
      shippingAddressLine1: address.addressLine1,
      shippingCity: address.city,
      shippingState: address.state,
      shippingPostalCode: address.postalCode,
      shippingCountry: address.country,
      shippingPhone: address.phone,
    },
  })

  console.log(`Created order: ${order.orderId} for ${user.name}`)

  // Create order items
  const orderItem = await prisma.orderItem.create({
    data: {
      orderId: order.orderId,
      productId: "prod_123",
      variantId: "var_456",
      title: "Sample Product",
      quantity: 1,
      price: 9999, // $99.99
      image: "https://example.com/sample-product.jpg",
    },
  })

  console.log(`Created order item: ${orderItem.title} for order ${order.orderId}`)

  // Create a wishlist item
  const wishlistItem = await prisma.wishlist.create({
    data: {
      userId: user.userId,
      productId: "prod_789",
      variantId: "var_012",
    },
  })

  console.log(`Created wishlist item for product ${wishlistItem.productId}`)

  // Create a review
  const review = await prisma.review.create({
    data: {
      userId: user.userId,
      productId: "prod_123",
      rating: 5,
      title: "Great product!",
      content: "This is an amazing product. I highly recommend it!",
      isVerified: true,
    },
  })

  console.log(`Created review: "${review.title}" for product ${review.productId}`)

  console.log("Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
