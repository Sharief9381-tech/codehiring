import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { PlatformsPageClient } from "@/components/student/platforms-page-client"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { serializeUser } from "@/lib/serialize"

export const dynamic = 'force-dynamic'

export default async function PlatformsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "student") redirect("/login")

  const student = await UserModel.findById(user._id as string)
  if (!student) redirect("/login")

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Platforms"
        description="Manage and sync your connected coding platforms"
        backLink={{ href: "/student/dashboard", label: "Back to Dashboard" }}
      />
      <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
        <PlatformsPageClient student={serializeUser(student)} />
      </div>
    </div>
  )
}
