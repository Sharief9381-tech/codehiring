import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { CareerHub } from "@/components/student/career-hub"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { serializeUser } from "@/lib/serialize"

export const dynamic = 'force-dynamic'

export default async function JobsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "student") redirect("/login")

  const student = await UserModel.findById(user._id as string)
  const graduationYear = (user as any).graduationYear as number | undefined

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Career Hub"
        description="On-campus drives, off-campus opportunities and your roadmap"
      />
      <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
        <CareerHub graduationYear={graduationYear} student={serializeUser(student!) as any} />
      </div>
    </div>
  )
}
