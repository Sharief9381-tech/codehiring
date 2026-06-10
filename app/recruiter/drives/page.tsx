import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { RecruiterDrivesClient } from "@/components/recruiter/drives-client"

export const dynamic = "force-dynamic"

export default async function RecruiterDrivesPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "recruiter") redirect("/login")
  return (
    <div className="flex flex-col">
      <DashboardHeader title="Hiring Drives" description="Manage your end-to-end recruitment drives" />
      <div className="flex-1 p-4 md:p-6 max-w-screen-xl mx-auto w-full">
        <RecruiterDrivesClient />
      </div>
    </div>
  )
}
