import { DashboardHeader } from "@/components/dashboard/header"
import { PlacementTracker } from "@/components/college/placement-tracker"

export const dynamic = 'force-dynamic'

export default function PlacementsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Placement Tracking"
        description="Monitor and manage student placements and company interactions"
      />
      <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
        <PlacementTracker />
      </div>
    </div>
  )
}
