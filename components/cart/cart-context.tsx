"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"

type CartItem = {
  id: string
  title: string
  price: string
  image: string
  variantId: string
  variantTitle?: string
  quantity: number
}

type CartContextType = {
  cart: CartItem[]
  total: number
  addToCart: (item: CartItem) => void
  updateQuantity: (variantId: string, quantity: number) => void
  removeFromCart: (variantId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [total, setTotal] = useState<number>(0)
  const { data: session } = useSession()

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
        calculateTotal(parsedCart)
      } catch (e) {
        console.error("Failed to parse cart from localStorage")
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Calculate total price
  const calculateTotal = (items: CartItem[]): void => {
    const newTotal = items.reduce((sum, item) => {
      return sum + Number.parseFloat(item.price) * item.quantity
    }, 0)
    setTotal(newTotal)
  }

  // Add item to cart
  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex((item) => item.variantId === newItem.variantId)

      let updatedItems

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        updatedItems = [...prevCart]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
        }
      } else {
        // Add new item if it doesn't exist
        updatedItems = [...prevCart, newItem]
      }

      calculateTotal(updatedItems)
      return updatedItems
    })
  }

  // Update item quantity
  const updateQuantity = (variantId: string, quantity: number) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.map((item) => (item.variantId === variantId ? { ...item, quantity } : item))

      calculateTotal(updatedItems)
      return updatedItems
    })
  }

  // Remove item from cart
  const removeFromCart = (variantId: string) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.filter((item) => item.variantId !== variantId)
      calculateTotal(updatedItems)
      return updatedItems
    })
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
    setTotal(0)
  }

  return (
    <CartContext.Provider value={{ cart, total, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
