import React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { serializeUser } from "@/lib/serialize"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "admin" && user.email !== "sharief9381@gmail.com")) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar user={serializeUser(user)} />
      <main className="min-h-[calc(100vh-56px)]">
        {children}
      </main>
    </div>
  )
}
