export interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  productId: string
  variantId: string
  title: string
  quantity: number
  price: number
  image: string
}

export interface CartItem {
  id: string
  title: string
  price: string
  image: string
  variantId: string
  variantTitle?: string
  quantity: number
}
