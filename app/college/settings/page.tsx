import { DashboardHeader } from "@/components/dashboard/header"
import { RecruiterAccess } from "@/components/college/recruiter-access"

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Settings & Access Control"
        description="Manage recruiter access and college settings"
      />
      <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
        <RecruiterAccess />
      </div>
    </div>
  )
}
