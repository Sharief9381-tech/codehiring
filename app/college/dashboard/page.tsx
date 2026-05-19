import { DashboardHeader } from "@/components/dashboard/header"
import { CollegeStats } from "@/components/college/college-stats"
import { TopPerformers } from "@/components/college/top-performers"
import { PlacementOverview } from "@/components/college/placement-overview"
import { DepartmentBreakdown } from "@/components/college/department-breakdown"
import { DEMO_COLLEGE } from "@/lib/demo-user"

export const dynamic = 'force-dynamic'

export default function CollegeDashboard() {
  const college = DEMO_COLLEGE

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="College Dashboard"
        description={`Welcome back, ${college.collegeName}`}
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
