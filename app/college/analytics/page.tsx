import { DashboardHeader } from "@/components/dashboard/header"
import { BatchAnalytics } from "@/components/college/batch-analytics"
import { DEMO_COLLEGE } from "@/lib/demo-user"
import { serializeUser } from "@/lib/serialize"

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const college = serializeUser(DEMO_COLLEGE)

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="College Analytics"
        description={`Performance analytics for ${(college as any).collegeName || 'your college'} students`}
      />
      <div className="flex-1 p-6">
        <BatchAnalytics college={college} />
      </div>
    </div>
  )
}
