import { DashboardHeader } from "@/components/dashboard/header"
import { PlatformsPageClient } from "@/components/student/platforms-page-client"
import { getDemoStudent, serializeDemoDoc } from "@/lib/demo-db"
import { DEMO_STUDENT } from "@/lib/demo-user"

export const dynamic = 'force-dynamic'

export default async function PlatformsPage() {
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
        title="Platforms"
        description="Manage your connected coding platforms"
      />
      <div className="flex-1 p-6">
        <PlatformsPageClient student={student} />
      </div>
    </div>
  )
}
