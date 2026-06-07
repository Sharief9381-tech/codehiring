import { DashboardHeader } from "@/components/dashboard/header"
import { ShortlistManager } from "@/components/recruiter/shortlist-manager"

export const dynamic = 'force-dynamic'

export default function ShortlistsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Shortlists"
        description="Manage your candidate shortlists and interview pipeline"
      />
      <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
        <ShortlistManager />
      </div>
    </div>
  )
}
