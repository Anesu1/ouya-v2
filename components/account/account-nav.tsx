"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { User, Package, Heart, MapPin, LogOut, Settings } from "lucide-react"

const navItems = [
  { name: "Account Overview", href: "/account", icon: User },
  { name: "Orders", href: "/account/orders", icon: Package },
  { name: "Wishlist", href: "/account/wishlist", icon: Heart },
  { name: "Addresses", href: "/account/addresses", icon: MapPin },
  { name: "Settings", href: "/account/settings", icon: Settings },
]

export default function AccountNav() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
  }

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive ? "bg-black text-white" : "text-gray-700 hover:text-black hover:bg-gray-50"
            }`}
          >
            <Icon
              className={`mr-3 h-5 w-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-black"}`}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        )
      })}

      <button
        onClick={handleLogout}
        className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-black hover:bg-gray-50"
      >
        <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-black" aria-hidden="true" />
        Sign out
      </button>
    </nav>
  )
}
