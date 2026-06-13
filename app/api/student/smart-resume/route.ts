import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { groqChat } from "@/lib/groq"

// ── helpers ───────────────────────────────────────────────────────────────────

/** Very lightweight PDF text extractor — reads raw bytes and pulls ASCII text runs */
function extractTextFromPDF(buffer: Buffer): string {
  const raw = buffer.toString("latin1")
  // grab printable ASCII runs of length ≥ 4
  const runs = raw.match(/[\x20-\x7E]{4,}/g) ?? []
  return runs.join(" ").replace(/\s{2,}/g, " ").trim()
}

/** Strip control chars from plain-text / DOCX xml blobs */
function cleanText(text: string): string {
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ").replace(/\s{2,}/g, " ").trim()
}

// ── GET — return saved smart resume ──────────────────────────────────────────

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const doc = await UserModel.findById(user._id as string)
    return NextResponse.json({
      smartResume: (doc as any)?.smartResume ?? null,
    })
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

// ── POST — upload + analyse ───────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    // Check if request is multipart (file upload) or JSON (re-analyse stored file)
    const contentType = request.headers.get("content-type") ?? ""
    let rawText = ""
    let fileName = "resume"

    if (contentType.includes("application/json")) {
      // Re-analyse the stored resumeFile from MongoDB
      const doc = await UserModel.findById(user._id as string)
      const resumeFile = (doc as any)?.resumeFile
      if (!resumeFile?.dataUri) {
        return NextResponse.json({ error: "No uploaded resume found. Please upload a file first." }, { status: 400 })
      }

      const ext = resumeFile.fileName?.split(".").pop()?.toLowerCase() ?? ""
      const base64 = resumeFile.dataUri.replace(/^data:[^;]+;base64,/, "")
      const buffer = Buffer.from(base64, "base64")
      fileName = resumeFile.fileName ?? "resume"

      if (ext === "txt") {
        rawText = buffer.toString("utf-8")
      } else if (ext === "pdf") {
        rawText = extractTextFromPDF(buffer)
      } else {
        rawText = cleanText(buffer.toString("utf-8"))
      }
    } else {
      // Standard file upload
      const formData = await request.formData()
      const file = formData.get("file") as File | null
      if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 })

      const ext = file.name.split(".").pop()?.toLowerCase()
      if (!ext || !["pdf", "doc", "docx", "txt"].includes(ext)) {
        return NextResponse.json({ error: "Only PDF, DOC, DOCX, or TXT files are supported" }, { status: 400 })
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 400 })
      }

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      fileName = file.name

      if (ext === "txt") {
        rawText = buffer.toString("utf-8")
      } else if (ext === "pdf") {
        rawText = extractTextFromPDF(buffer)
      } else {
        rawText = cleanText(buffer.toString("utf-8"))
      }
    }

    if (rawText.length < 50) {
      return NextResponse.json({
        error: "Could not extract enough text from the file. Try a text-based PDF or a .txt version.",
      }, { status: 422 })
    }

    // Also enrich with platform stats for better analysis
    const doc = await UserModel.findById(user._id as string)
    const platforms = Object.entries((doc as any)?.linkedPlatforms ?? {})
      .filter(([, v]: any) => v?.username)
      .map(([pid, pd]: any) => {
        const s = pd.stats ?? {}
        const solved = s.totalSolved ?? s.problemsSolved ?? 0
        const rating = s.rating ?? s.currentRating ?? 0
        return `${pid}: @${pd.username}${solved ? ` (${solved} solved)` : ""}${rating ? ` rating ${rating}` : ""}`
      }).join(", ")

    const profileContext = platforms
      ? `\nStudent's coding platforms: ${platforms}`
      : ""

    // Limit input to Groq to avoid token overflow
    const truncated = rawText.slice(0, 5000) + profileContext

    const systemPrompt = `You are an expert resume coach and ATS specialist. 
Analyse the resume text provided and return a JSON object with this exact shape:
{
  "summary": "2-3 sentence professional summary",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3"],
  "atsScore": <number 0-100>,
  "atsKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "enhancedSummary": "polished, ATS-optimised professional summary paragraph (4-6 sentences)",
  "skillsFound": ["skill1", "skill2", ...],
  "recommendedRoles": ["role 1", "role 2", "role 3"],
  "sections": {
    "contact": <true|false>,
    "education": <true|false>,
    "experience": <true|false>,
    "projects": <true|false>,
    "skills": <true|false>,
    "certifications": <true|false>
  }
}
Return ONLY valid JSON, no markdown, no explanation.`

    const aiResponse = await groqChat(systemPrompt, truncated, 1400)

    let analysis: Record<string, any>
    try {
      const cleaned = aiResponse.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "").trim()
      analysis = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: "AI returned invalid JSON. Please try again." }, { status: 500 })
    }

    const smartResume = {
      analysis,
      originalFileName: fileName,
      analyzedAt: new Date().toISOString(),
      sharedWithCollege: (doc as any)?.smartResume?.sharedWithCollege ?? false,
      sharedWithRecruiters: (doc as any)?.smartResume?.sharedWithRecruiters ?? false,
    }

    await UserModel.update(user._id as string, { smartResume })

    return NextResponse.json({ success: true, smartResume })
  } catch (err) {
    console.error("Smart resume error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    )
  }
}

// ── PATCH — update sharing settings ──────────────────────────────────────────

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { sharedWithCollege, sharedWithRecruiters } = await request.json()

    const doc = await UserModel.findById(user._id as string)
    const existing = (doc as any)?.smartResume
    if (!existing) return NextResponse.json({ error: "No smart resume found" }, { status: 404 })

    const updated = {
      ...existing,
      ...(sharedWithCollege !== undefined && { sharedWithCollege }),
      ...(sharedWithRecruiters !== undefined && { sharedWithRecruiters }),
    }

    await UserModel.update(user._id as string, { smartResume: updated })
    return NextResponse.json({ success: true, smartResume: updated })
  } catch {
    return NextResponse.json({ error: "Failed to update sharing" }, { status: 500 })
  }
}
