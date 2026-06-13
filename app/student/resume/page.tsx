import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { serializeDocument } from "@/lib/serialize"
import { ResumeClient } from "./resume-client"

export const dynamic = "force-dynamic"

export default async function ResumePage({
  searchParams,
}: {
  searchParams: { analyze?: string }
}) {
  const user = await getCurrentUser()
  if (!user || user.role !== "student") redirect("/login")

  const doc = await UserModel.findById(user._id as string)
  if (!doc) redirect("/login")

  const { password, ...safe } = doc as any

  // Don't send base64 payload — only metadata
  if (safe.resumeFile?.dataUri) {
    const { dataUri: _omit, ...fileMeta } = safe.resumeFile
    safe.resumeFile = fileMeta
  }

  const autoAnalyze = searchParams?.analyze === "1"

  return <ResumeClient student={serializeDocument(safe)} autoAnalyze={autoAnalyze} />
}
