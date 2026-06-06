import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { AnalyticsDashboard } from "@/components/student/analytics-dashboard"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { serializeUser } from "@/lib/serialize"

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "student") redirect("/login")

  const student = await UserModel.findById(user._id as string)
  if (!student) redirect("/login")

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Analytics"
        description="Detailed insights into your coding progress and performance"
      />
      <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
        <AnalyticsDashboard student={serializeUser(student) as any} />
      </div>
    </div>
  )
}
