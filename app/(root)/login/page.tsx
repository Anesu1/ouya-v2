export const dynamic = "force-dynamic"

import LoginForm from "@/components/auth/login-form"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Ouya Oenda",
  description: "Login to your Ouya Oenda account to manage orders, update your profile, and more.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/login",
  },
}

export default function LoginPage({ searchParams }: { searchParams: { returnUrl?: string } }) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-light tracking-tight text-gray-900">Login to your account</h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            href={
              searchParams.returnUrl ? `/register?returnUrl=${encodeURIComponent(searchParams.returnUrl)}` : "/register"
            }
            className="font-medium text-black hover:text-gray-800"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
