"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ShoppingBag, Menu, X, User } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"
import CartModal from "@/components/cart/cart-modal"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import SearchModal from "@/components/search/search-modal"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { cart } = useCart()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const router = useRouter()

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      if (isUserMenuOpen && !target.closest("[data-user-menu]")) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isUserMenuOpen])

  // Determine if we're on the homepage
  const isHomePage = pathname === "/"

  return (
    <header
      className={`transition-all duration-300 sticky top-0 z-40 ${
        isScrolled || !isHomePage ? "bg-black text-white" : "bg-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile menu button */}
          <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex flex-1 w-max   items-center justify-center md:translate-x-[8%] lg:translate-x-[4%]">
            <Link href="/" className="flex items-center text-white">
              <span className="sr-only">Ouya Oenda</span>
              <span className="text-2xl font-semibold tracking-wider">Ouya Oenda</span>
            </Link>
          </div>

          {/* Icons */}
          <div className="flex isolate items-center gap-x-7 w-max ">
            <button
              className="text-white relative z-[10] hover:text-gray-300 transition-colors"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={20} />
              <span className="sr-only">Search</span>
            </button>
            {/* <Link
              href="/account/wishlist"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Heart size={20} />
              <span className="sr-only">Wishlist</span>
            </Link> */}
            <button
              className="text-white hover:text-gray-300 transition-colors relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </button>

            {/* User menu */}
            <div className="relative" data-user-menu>
              <button
                className="text-white hover:text-gray-300 transition-colors"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User size={20} />
                <span className="sr-only">Account</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                  {status === "authenticated" && session ? (
                    <>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      <Link
                        href="/account/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Wishlist
                      </Link>
                      <hr className="my-1" />
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          signOut({ callbackUrl: "/" })
                        }}
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          // Store current path for redirect after login
                          localStorage.setItem("loginReturnUrl", window.location.pathname + window.location.search)
                        }}
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Create account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black text-white shadow-lg z-50">
          <div className="px-4 py-6 space-y-6 divide-y divide-gray-800">
            <div className="space-y-4">
              <Link
                href="/collections/all"
                className="block text-base font-medium text-white tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                All Candles
              </Link>
            </div>
            <div className="pt-6">
              {status === "authenticated" && session ? (
                <>
                  <Link
                    href="/account"
                    className="block text-base font-medium text-white tracking-wide"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Account
                  </Link>
                  <Link
                    href="/account/wishlist"
                    className="block text-base font-medium text-white tracking-wide mt-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <button
                    className="block text-base font-medium text-white tracking-wide mt-4"
                    onClick={() => {
                      setIsMenuOpen(false)
                      signOut({ callbackUrl: "/" })
                    }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-base font-medium text-white tracking-wide"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="block text-base font-medium text-white tracking-wide mt-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} setIsOpen={setIsCartOpen} />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
    </header>
  )
}
