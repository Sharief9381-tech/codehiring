import { getCurrentUser } from "@/lib/auth"
import { serializeUser } from "@/lib/serialize"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const user = await getCurrentUser()
  if (!user || (user.role !== "admin" && user.email !== "sharief9381@gmail.com")) {
    redirect("/login")
  }
  return <AdminShell user={serializeUser(user)} />
}
