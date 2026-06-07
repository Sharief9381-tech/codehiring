import { PlacementDrives } from "@/components/college/placement-drives"

export const dynamic = "force-dynamic"

export default function DrivesPage() {
  return (
    <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
      <PlacementDrives />
    </div>
  )
}
