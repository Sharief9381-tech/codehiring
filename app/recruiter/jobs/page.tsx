import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { JobPostings } from "@/components/recruiter/job-postings"

export const dynamic = 'force-dynamic'

export default async function JobsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "recruiter") redirect("/login")

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Job Postings"
        description="Manage your job postings and track applications"
      />
      <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
        <JobPostings />
      </div>
    </div>
  )
}
