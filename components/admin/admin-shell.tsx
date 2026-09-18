"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminBlog } from "@/components/admin/admin-blog"
import { AdminPYQ } from "@/components/admin/admin-pyq"

export function AdminShell({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <>
      <AdminSidebar user={user} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {activeTab === "blog" ? <AdminBlog />
         : activeTab === "pyq" ? <AdminPYQ />
         : <AdminDashboard />}
      </div>
    </>
  )
}
