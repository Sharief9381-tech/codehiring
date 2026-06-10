import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { DriveDetailClient } from "@/components/recruiter/drive-detail-client"

export const dynamic = "force-dynamic"

export default async function DriveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "recruiter" && user.role !== "admin")) redirect("/login")
  const { id } = await params
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Drive Details"
        description="Manage applicants, assessments, and hiring pipeline"
        backLink={{ href: "/recruiter/drives", label: "All Drives" }}
      />
      <div className="flex-1 p-4 md:p-6 max-w-screen-xl mx-auto w-full">
        <DriveDetailClient driveId={id} />
      </div>
    </div>
  )
}
