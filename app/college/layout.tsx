import React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DEMO_COLLEGE } from "@/lib/demo-user"

export default function CollegeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar user={DEMO_COLLEGE} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
