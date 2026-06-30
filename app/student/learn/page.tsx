import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { serializeDocument } from "@/lib/serialize"
import { FirstYearFullHub } from "@/components/student/first-year-full-hub"
import { CareerHub } from "@/components/student/career-hub"

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
  const { password, ...safe } = doc as any
  const student = serializeDocument(safe)

  // Year 1: rich XP/gamification hub
  if (year === 1) {
    return <FirstYearFullHub student={student} />
  }

  // Years 2–4 (and unknown/0): content-rich career hub with year-appropriate sections
  return (
    <div className="flex-1 p-4 md:p-6 max-w-screen-xl mx-auto w-full">
      <CareerHub graduationYear={gy ? Number(gy) : undefined} student={student} />
    </div>
  )
}
