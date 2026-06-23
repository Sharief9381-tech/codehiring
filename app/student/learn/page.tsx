import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { serializeDocument } from "@/lib/serialize"
import { FirstYearFullHub } from "@/components/student/first-year-full-hub"

export const dynamic = "force-dynamic"

function detectYear(graduationYear?: number | string): number {
  if (!graduationYear) return 0
  const gy = Number(graduationYear)
  if (isNaN(gy)) return 0
  const now = new Date()
  const cur = now.getFullYear()
  const academicYear = now.getMonth() >= 6 ? cur : cur - 1
  const yearsLeft = gy - academicYear
  if (yearsLeft <= 0 || yearsLeft > 5) return 0
  return Math.min(Math.max(5 - yearsLeft, 1), 4)
}

export default async function LearnPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "student") redirect("/login")

  const doc = await UserModel.findById(user._id as string)
  if (!doc) redirect("/login")

  const gy = (doc as any).graduationYear
  const year = detectYear(gy)

  // Only 1st-year students should see this hub
  // Years 2-4 (and unknown) get redirected to dashboard
  if (year !== 1) redirect("/student/dashboard")

  const { password, ...safe } = doc as any
  return <FirstYearFullHub student={serializeDocument(safe)} />
}
