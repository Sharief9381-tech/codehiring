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
      <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
        <StudentsTable />
      </div>
    </div>
  )
}
