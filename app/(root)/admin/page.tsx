import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import AdminDashboard from "@/components/admin/dashboard"

export const metadata = {
  title: "Admin Dashboard | Ouya Oenda",
  description: "Admin dashboard for Ouya Oenda",
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  // Check if user is admin - you'll need to add an isAdmin field to your user model
  if (!session?.user || !isUserAdmin(session.user.email)) {
    redirect("/login?returnUrl=/admin")
  }

  return <AdminDashboard />
}

// Helper function to check if a user is an admin
// In a real application, this would check against a database field
function isUserAdmin(email: string): boolean {
  // List of admin emails - in production, this should come from your database
  const adminEmails = ["admin@example.com"]
  return adminEmails.includes(email)
}
