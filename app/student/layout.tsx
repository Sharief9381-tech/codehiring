import React from "react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { getCurrentUser } from "@/lib/auth"
import { serializeUser } from "@/lib/serialize"

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user || user.role !== "student") {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar user={serializeUser(user)} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
