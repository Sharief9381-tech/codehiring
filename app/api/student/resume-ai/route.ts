/**
 * POST /api/student/resume-ai
 * Accepts the student's profile + resumeUrl / uploaded file and returns
 * AI-powered suggestions: job role fit, gaps, improvements, template recommendation.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { groqChat, isGroqAvailable } from "@/lib/groq"

/** Lightweight PDF text extractor */
function extractPDFText(buf: Buffer): string {
  const raw = buf.toString("latin1")
  const runs = raw.match(/[\x20-\x7E]{4,}/g) ?? []
  return runs.join(" ").replace(/\s{2,}/g, " ").trim()
}

function cleanText(text: string): string {
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ").replace(/\s{2,}/g, " ").trim()
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const doc = await UserModel.findById(user._id as string)
    if (!doc) return NextResponse.json({ error: "User not found" }, { status: 404 })

    if (!isGroqAvailable()) {
      return NextResponse.json({ error: "AI service not available" }, { status: 503 })
    }

    const student = doc as any

    // Build a rich profile summary for the AI
    const platforms = Object.entries(student.linkedPlatforms ?? {})
      .filter(([, v]: any) => v?.username)
      .map(([pid, pd]: any) => {
        const s = pd.stats ?? {}
        const solved = s.totalSolved ?? s.problemsSolved ?? 0
        const rating = s.rating ?? s.currentRating ?? 0
        return `${pid}: @${pd.username}${solved ? ` (${solved} solved)` : ""}${rating ? ` rating ${rating}` : ""}`
      })
      .join(", ")

    // Extract text from uploaded file if present
    let resumeText = ""
    if (student.resumeFile?.dataUri) {
      try {
        const base64 = student.resumeFile.dataUri.replace(/^data:[^;]+;base64,/, "")
        const buf = Buffer.from(base64, "base64")
        const mime: string = student.resumeFile.mimeType ?? ""
        if (mime === "text/plain") {
          resumeText = buf.toString("utf-8")
        } else if (mime === "application/pdf") {
          resumeText = extractPDFText(buf)
        } else {
          resumeText = cleanText(buf.toString("utf-8"))
        }
        resumeText = resumeText.slice(0, 3000)
      } catch { /* ignore extraction errors */ }
    }

    const profileSummary = `
Name: ${student.name}
Branch: ${student.branch ?? "N/A"} | Degree: ${student.degree ?? "B.Tech"} | Graduation: ${student.graduationYear ?? "N/A"}
Skills: ${(student.skills ?? []).join(", ") || "none listed"}
Coding Platforms: ${platforms || "none connected"}
Resume URL: ${student.resumeUrl ?? "not provided"}
Uploaded Resume File: ${student.resumeFile?.fileName ?? "none"}
Bio: ${student.bio ?? "none"}
Open to Work: ${student.isOpenToWork ? "yes" : "no"}
${resumeText ? `\nResume Content (extracted):\n${resumeText}` : ""}
`.trim()

    const systemPrompt = `You are an expert technical recruiter and career coach specialising in software engineering roles.
Analyse the student profile below and return a JSON object with this EXACT shape:
{
  "overallScore": <number 0-100, resume + profile quality>,
  "topRoles": [
    { "role": "Software Engineer", "match": 85, "reason": "one sentence" },
    { "role": "Backend Developer", "match": 78, "reason": "one sentence" },
    { "role": "Full Stack Developer", "match": 70, "reason": "one sentence" }
  ],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "gaps": ["gap 1", "gap 2", "gap 3"],
  "suggestions": [
    { "priority": "high", "action": "specific actionable suggestion" },
    { "priority": "high", "action": "specific actionable suggestion" },
    { "priority": "medium", "action": "specific actionable suggestion" },
    { "priority": "medium", "action": "specific actionable suggestion" },
    { "priority": "low", "action": "specific actionable suggestion" }
  ],
  "templateRecommendation": {
    "name": "one of: Technical, Minimal, Creative, Executive",
    "reason": "one sentence why this template suits them"
  },
  "atsKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "summary": "2-3 sentence personalised career summary the student can paste into their resume"
}
Return ONLY valid JSON, no markdown fences, no extra text.`

    const aiRaw = await groqChat(systemPrompt, profileSummary, 1400)

    let result: Record<string, any>
    try {
      const cleaned = aiRaw.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "").trim()
      result = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: "AI returned invalid response. Please try again." }, { status: 500 })
    }

    return NextResponse.json({ success: true, analysis: result })
  } catch (err) {
    console.error("Resume AI error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    )
  }
}
