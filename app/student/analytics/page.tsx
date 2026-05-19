import { DashboardHeader } from "@/components/dashboard/header"
import { AnalyticsDashboard } from "@/components/student/analytics-dashboard"
import { getDemoStudent, serializeDemoDoc } from "@/lib/demo-db"
import { DEMO_STUDENT } from "@/lib/demo-user"

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  let student: any = DEMO_STUDENT
  try {
    const doc = await getDemoStudent()
    if (doc) student = serializeDemoDoc(doc)
  } catch (e) {
    console.error("Failed to load demo student:", e)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Analytics"
        description="Detailed insights into your coding progress and performance"
      />
      <div className="flex-1 p-6">
        <AnalyticsDashboard student={student} />
      </div>
    </div>
  )
}
