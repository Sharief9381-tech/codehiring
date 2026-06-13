/**
 * GET /api/student/resume-download
 * Streams the stored base64 resume back as a downloadable file.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const doc = await UserModel.findById(user._id as string)
    const resumeFile = (doc as any)?.resumeFile
    if (!resumeFile?.dataUri) {
      return NextResponse.json({ error: "No uploaded resume found" }, { status: 404 })
    }

    // Strip the data URI prefix → pure base64
    const base64 = resumeFile.dataUri.replace(/^data:[^;]+;base64,/, "")
    const buffer = Buffer.from(base64, "base64")

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": resumeFile.mimeType ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${resumeFile.fileName ?? "resume"}"`,
        "Content-Length": String(buffer.length),
      },
    })
  } catch (err) {
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
