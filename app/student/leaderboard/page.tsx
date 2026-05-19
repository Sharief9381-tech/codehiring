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
      <div className="flex-1 p-6">
        <LeaderboardClient />
      </div>
    </div>
  )
}
