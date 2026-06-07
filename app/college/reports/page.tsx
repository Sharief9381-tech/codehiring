import { CollegeReports } from "@/components/college/college-reports"

export const dynamic = "force-dynamic"

export default function ReportsPage() {
  return (
    <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
      <CollegeReports />
    </div>
  )
}
