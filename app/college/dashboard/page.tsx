import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { CollegeStats } from "@/components/college/college-stats"
import { TopPerformers } from "@/components/college/top-performers"
import { PlacementOverview } from "@/components/college/placement-overview"
import { DepartmentBreakdown } from "@/components/college/department-breakdown"
import { getCurrentUser } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export default async function CollegeDashboard() {
  const user = await getCurrentUser()
  if (!user || user.role !== "college") redirect("/login")

  const college = user as any

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="College Dashboard"
        description={`Welcome back, ${college.collegeName || college.name}`}
      />
      <div className="flex-1 space-y-6 p-6">
        <CollegeStats college={college} />
        <div className="grid gap-6 lg:grid-cols-2">
          <TopPerformers />
          <PlacementOverview />
        </div>
        <DepartmentBreakdown />
      </div>
    </div>
  )
}
