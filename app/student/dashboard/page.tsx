import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardClient } from "@/components/student/dashboard-client"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { serializeUser } from "@/lib/serialize"

export const dynamic = 'force-dynamic'

export default async function StudentDashboard() {
  const user = await getCurrentUser()
  if (!user || user.role !== "student") redirect("/login")

  // Fetch fresh student data from DB (includes linkedPlatforms, stats, etc.)
  const student = await UserModel.findById(user._id as string)
  if (!student) redirect("/login")

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Dashboard"
        description="Track your coding progress across all platforms"
      />
      <div className="flex-1 space-y-6 p-6">
        <DashboardClient student={serializeUser(student) as any} />
      </div>
    </div>
  )
}
