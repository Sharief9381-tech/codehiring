import React from "react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { getCurrentUser } from "@/lib/auth"
import { serializeUser } from "@/lib/serialize"

export const dynamic = 'force-dynamic'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "student")) redirect("/login")

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar user={serializeUser(user) as any} />
      <main className="min-h-[calc(100vh-56px)]">
        {children}
      </main>
    </div>
  )
}
