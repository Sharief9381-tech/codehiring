/**
 * POST /api/student/resume-upload
 * Accepts a PDF, DOC, DOCX, or TXT file (max 5 MB).
 * Stores the file as a base64 data-URI in MongoDB under `resumeFile`.
 * Also saves the original file name and mime type so the client can
 * reconstruct a downloadable blob URL.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"

const ALLOWED_EXTS = ["pdf", "doc", "docx", "txt"]
const MIME: Record<string, string> = {
  pdf:  "application/pdf",
  doc:  "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt:  "text/plain",
}
const MAX_BYTES = 5 * 1024 * 1024   // 5 MB

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
    if (!ALLOWED_EXTS.includes(ext)) {
      return NextResponse.json(
        { error: "Only PDF, DOC, DOCX, or TXT files are supported" },
        { status: 400 }
      )
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large — max 5 MB" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const mimeType = MIME[ext] ?? "application/octet-stream"
    const dataUri = `data:${mimeType};base64,${base64}`

    await UserModel.update(user._id as string, {
      resumeFile: {
        dataUri,
        fileName: file.name,
        mimeType,
        uploadedAt: new Date().toISOString(),
        sizeBytes: file.size,
      },
      // Clear any previously saved plain URL so both can coexist cleanly
      // (we keep resumeUrl for link mode)
    })

    return NextResponse.json({
      success: true,
      fileName: file.name,
      mimeType,
      sizeBytes: file.size,
    })
  } catch (err) {
    console.error("Resume upload error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/student/resume-upload
 * Removes the stored file from MongoDB.
 */
export async function DELETE() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    await UserModel.update(user._id as string, { resumeFile: null })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Failed to remove file" }, { status: 500 })
  }
}
