import React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DEMO_STUDENT } from "@/lib/demo-user"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar user={DEMO_STUDENT} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
