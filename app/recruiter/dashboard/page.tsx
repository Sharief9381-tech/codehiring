import { DashboardHeader } from "@/components/dashboard/header"
import { RecruiterStats } from "@/components/recruiter/recruiter-stats"
import { RecommendedCandidates } from "@/components/recruiter/recommended-candidates"
import { RecentShortlists } from "@/components/recruiter/recent-shortlists"
import { HiringPipeline } from "@/components/recruiter/hiring-pipeline"
import { DEMO_RECRUITER } from "@/lib/demo-user"

export const dynamic = 'force-dynamic'

export default function RecruiterDashboard() {
  const recruiter = DEMO_RECRUITER

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Recruiter Dashboard"
        description={`Welcome back, ${recruiter.name} from ${recruiter.companyName}`}
      />
      <div className="flex-1 space-y-6 p-6">
        <RecruiterStats />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecommendedCandidates />
          </div>
          <RecentShortlists />
        </div>
        <HiringPipeline />
      </div>
    </div>
  )
}
