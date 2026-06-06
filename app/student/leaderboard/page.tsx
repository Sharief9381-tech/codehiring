import { DashboardHeader } from "@/components/dashboard/header"
import { LeaderboardClient } from "@/components/student/leaderboard-client"

export const dynamic = "force-dynamic"

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Leaderboard"
        description="See how you rank globally and within your college"
      />
      <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
        <LeaderboardClient />
      </div>
    </div>
  )
}
