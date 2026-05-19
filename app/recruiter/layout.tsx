import React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DEMO_RECRUITER } from "@/lib/demo-user"

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar user={DEMO_RECRUITER} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
