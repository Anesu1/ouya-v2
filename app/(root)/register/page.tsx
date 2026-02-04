import RegisterForm from "@/components/auth/register-form"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register | Ouya Oenda",
  description: "Create a new Ouya Oenda account to shop premium handcrafted candles, track orders, and more.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/register",
  },
}

export default function RegisterPage({ searchParams }: { searchParams: { returnUrl?: string } }) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-light tracking-tight text-gray-900">Create a new account</h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            href={searchParams.returnUrl ? `/login?returnUrl=${encodeURIComponent(searchParams.returnUrl)}` : "/login"}
            className="font-medium text-black hover:text-gray-800"
          >
            login to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
