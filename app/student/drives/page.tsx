import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function StudentDrivesPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "student") redirect("/login")
  // Drives are now part of Career Hub
  redirect("/student/jobs")
}
