"use client"

import type React from "react"

import { CartProvider } from "@/components/cart/cart-context"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import type { Session } from "next-auth"

interface ClientProvidersProps {
  children: React.ReactNode
  session: Session | null
}

export function ClientProviders({ children, session }: ClientProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
