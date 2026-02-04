import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import NotificationBanner from "@/components/layout/notification-banner"
import type React from "react"

export default function layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <NotificationBanner />
      <Header />
      {children}
      <Footer />
    </div>
  )
}
