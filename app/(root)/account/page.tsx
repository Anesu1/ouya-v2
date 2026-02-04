import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import AccountNav from "@/components/account/account-nav"
import AccountOverview from "@/components/account/account-overview"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Account | Ouya Oenda",
  description: "Manage your Ouya Oenda account, view orders, update profile, and manage addresses.",
  robots: {
    index: false,
    follow: true,
  },
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <AccountNav />
          </div>

          <div className="md:col-span-3">
            <AccountOverview user={session.user} />
          </div>
        </div>
      </div>
    </div>
  )
}
