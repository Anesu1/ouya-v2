import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/auth/session-provider"
import { CartProvider } from "@/components/cart/cart-context"
import ToastProvider from "@/components/ui/toast-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ouya Commerce",
  description: "Premium fragrance e-commerce platform",
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <CartProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {children}
              <ToastProvider />
            </ThemeProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
