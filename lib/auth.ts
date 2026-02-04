import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { prisma } from "@/lib/prisma"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export async function createUser(name: string, email: string, password: string) {
  const hashedPassword = await hashPassword(password)
  const userId = uuidv4()

  return await prisma.user.create({
    data: {
      userId,
      name,
      email,
      password: hashedPassword,
      role: "USER", // Default role
    },
  })
}

export async function createSession(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const sessionToken = uuidv4()
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Expires in 30 days

    await prisma.session.create({
      data: {
        sessionToken,
        userId,
        expires,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error creating session:", error)
    return { success: false, error: "Failed to create session" }
  }
}

export async function logout(): Promise<void> {
  // This is a placeholder for logout logic
  // In a real implementation, you would invalidate the session
  console.log("User logged out")
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await comparePasswords(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.userId,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = user.role
        token.isAdmin = user.role === "ADMIN"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.isAdmin = token.isAdmin as boolean
        session.user.email = token.email as string
      }
      return session
    },
  },
}
