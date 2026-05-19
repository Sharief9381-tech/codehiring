import { DashboardHeader } from "@/components/dashboard/header"
import { StudentsTable } from "@/components/college/students-table"

export const dynamic = 'force-dynamic'

export default async function StudentsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Students"
        description="View and manage registered students"
      />
      <div className="flex-1 p-6">
        <StudentsTable />
      </div>
    </div>
  )
}
