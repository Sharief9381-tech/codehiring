import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { CollegeLeaderboard } from "@/components/college/college-leaderboard"

export const dynamic = "force-dynamic"

export default async function CollegeLeaderboardPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "college") redirect("/login")

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Leaderboard"
        description="Top performing students ranked by coding activity"
      />
      <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
        <CollegeLeaderboard />
      </div>
    </div>
  )
}
