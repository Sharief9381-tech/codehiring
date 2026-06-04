import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { CareerHub } from "@/components/student/career-hub"
import { getCurrentUser } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export default async function JobsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "student") redirect("/login")

  const graduationYear = (user as any).graduationYear as number | undefined

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Career Hub"
        description="Personalized career roadmap based on your year"
      />
      <div className="flex-1 p-6">
        <CareerHub graduationYear={graduationYear} />
      </div>
    </div>
  )
}
