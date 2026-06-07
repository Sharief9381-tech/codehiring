import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { serializeUser } from "@/lib/serialize"
import { DashboardHeader } from "@/components/dashboard/header"
import { CollegeDashboardTabs } from "@/components/college/college-dashboard-tabs"

export const dynamic = "force-dynamic"

export default async function CollegeDashboard() {
  const user = await getCurrentUser()
  if (!user || user.role !== "college") redirect("/login")
  const college = serializeUser(user) as any
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Dashboard"
        description={`${college.collegeName || college.name} — overview and analytics`}
      />
      <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
        <CollegeDashboardTabs college={college} />
      </div>
    </div>
  )
}
