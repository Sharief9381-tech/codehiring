"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminBlog } from "@/components/admin/admin-blog"

export function AdminShell({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <>
      <AdminSidebar user={user} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "blog"
        ? <AdminBlog />
        : <AdminDashboard />
      }
    </>
  )
}
