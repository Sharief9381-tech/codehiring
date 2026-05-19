import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const dynamic = 'force-dynamic'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminDashboard />
    </div>
  )
}
