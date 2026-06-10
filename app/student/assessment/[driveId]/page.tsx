import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { StudentAssessmentClient } from "@/components/student/assessment-client"

export const dynamic = "force-dynamic"

export default async function StudentAssessmentPage({ params }: { params: Promise<{ driveId: string }> }) {
  const user = await getCurrentUser()
  if (!user || user.role !== "student") redirect("/login")
  const { driveId } = await params
  return <StudentAssessmentClient driveId={driveId} />
}
