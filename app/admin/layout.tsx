import React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "admin" && user.email !== "sharief9381@gmail.com")) {
    redirect("/login")
  }
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
