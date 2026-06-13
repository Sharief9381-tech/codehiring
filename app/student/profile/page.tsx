import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { serializeDocument } from "@/lib/serialize"
import { ProfileClient } from "./profile-client"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "student") redirect("/login")

  // Fetch full document — all fields including bio, phone, location, etc.
  const student = await UserModel.findById(user._id as string)
  if (!student) redirect("/login")

  // Strip only the password, serialize everything else (ObjectIds, Dates → strings)
  const { password, ...safe } = student as any

  // Don't send the heavy base64 payload to the client — only metadata
  if (safe.resumeFile?.dataUri) {
    const { dataUri: _omit, ...fileMeta } = safe.resumeFile
    safe.resumeFile = fileMeta
  }

  return <ProfileClient initialUser={serializeDocument(safe)} />
}
