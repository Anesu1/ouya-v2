import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { comparePasswords } from "@/lib/auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"

// Define authOptions as an exported constant
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user?.password) {
          throw new Error("Invalid credentials")
        }

        const isCorrectPassword = await comparePasswords(credentials.password, user.password)

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  // Disable debug in all environments to avoid the warning
  debug: false,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id
          token.email = user.email
          token.name = user.name
          token.role = user.role || "user"
          token.isAdmin = user.role === "admin"
        }
        return token
      } catch (error) {
        console.error("Error in JWT callback:", error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (token && session.user) {
          session.user.id = token.id as string
          session.user.role = token.role as string
          session.user.isAdmin = token.isAdmin as boolean
        }
        return session
      } catch (error) {
        console.error("Error in session callback:", error)
        return session
      }
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
