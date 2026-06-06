import { DashboardHeader } from "@/components/dashboard/header"
import { RecruiterAnalytics } from "@/components/recruiter/recruiter-analytics"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Hiring Analytics"
        description="Track your recruitment metrics and hiring performance"
      />
      <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
        <RecruiterAnalytics />
      </div>
    </div>
  )
}
