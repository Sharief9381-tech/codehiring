import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardClient } from "@/components/student/dashboard-client"
import { getDemoStudent, serializeDemoDoc } from "@/lib/demo-db"
import { DEMO_STUDENT } from "@/lib/demo-user"

export const dynamic = 'force-dynamic'

export default async function StudentDashboard() {
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
        title="Dashboard"
        description="Track your coding progress across all platforms"
      />
      <div className="flex-1 space-y-6 p-6">
        <DashboardClient student={student} />
      </div>
    </div>
  )
}
