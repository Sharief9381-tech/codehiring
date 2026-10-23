/**
 * GET /api/student/ai-insights
 * Returns AI-generated career insights for the logged-in student.
 * AI order: Gemini 2.0 Flash → OpenAI gpt-4o-mini → Groq qwen3.6-27b
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"

const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions"
const OPENAI_URL = "https://api.openai.com/v1/chat/completions"
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

function buildStudentSummary(student: any): string {
  const platforms = Object.keys(student.linkedPlatforms || {})
  let totalProblems = 0, highestRating = 0, githubContributions = 0, contests = 0

  Object.entries(student.linkedPlatforms || {}).forEach(([pid, data]: [string, any]) => {
    if (!data?.stats) return
    const s = data.stats
    totalProblems += s.totalSolved || s.problemsSolved || 0
    if (pid === "github") githubContributions = s.totalContributions || 0
    const r = Math.max(s.rating || 0, s.currentRating || 0, s.highestRating || 0, s.contestRating || 0)
    if (r > highestRating) highestRating = r
    contests += s.contests?.length || s.contestsParticipated || s.attendedContestsCount || 0
  })

  return [
    `Student: ${student.name}`,
    `Branch: ${student.branch || "N/A"}, Graduation: ${student.graduationYear || "N/A"}`,
    `Skills: ${(student.skills || []).join(", ") || "None listed"}`,
    `Platforms: ${platforms.join(", ") || "None"}`,
    `Total Problems Solved: ${totalProblems}`,
    `Highest Rating: ${highestRating || "N/A"}`,
    `GitHub Contributions: ${githubContributions}`,
    `Contests: ${contests}`,
    `Open to Work: ${student.isOpenToWork ? "Yes" : "No"}`,
  ].join("\n")
}

async function callAI(messages: any[], maxTokens: number): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY
  const groqKey   = process.env.GROQ_API_KEY

  const stripThink = (s: string) => s.replace(/<think>[\s\S]*?<\/think>/gi, "").trim()

  // 1. Gemini 2.0 Flash
  if (geminiKey) {
    try {
      // Convert messages to Gemini format
      const systemMsg = messages.find(m => m.role === "system")
      const userMsg   = messages.find(m => m.role === "user")
      const body: any = {
        contents: [{ role: "user", parts: [{ text: userMsg?.content ?? "" }] }],
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.3 },
      }
      if (systemMsg) body.systemInstruction = { parts: [{ text: systemMsg.content }] }

      const res = await fetch(`${GEMINI_URL}?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20000),
      })
      if (res.ok) {
        const d = await res.json()
        const content = d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ""
        if (content) return content
      } else {
        console.error("Gemini insights error:", res.status, await res.text().catch(() => ""))
      }
    } catch (e) {
      console.error("Gemini insights failed:", e)
    }
  }

  // 2. OpenAI
  if (openaiKey) {
    try {
      const res = await fetch(OPENAI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({ model: "gpt-4o-mini", messages, max_tokens: maxTokens, temperature: 0.3 }),
        signal: AbortSignal.timeout(20000),
      })
      if (res.ok) {
        const d = await res.json()
        const content = d.choices?.[0]?.message?.content?.trim() ?? ""
        if (content) return content
      }
    } catch (e) {
      console.error("OpenAI insights failed:", e)
    }
  }

  // 3. Groq
  if (groqKey) {
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({ model: "openai/gpt-oss-20b", messages, max_tokens: maxTokens, temperature: 0.3 }),
        signal: AbortSignal.timeout(20000),
      })
      if (res.ok) {
        const d = await res.json()
        const content = stripThink(d.choices?.[0]?.message?.content?.trim() ?? "")
        if (content) return content
      } else {
        console.error("Groq insights error:", res.status, await res.text().catch(() => ""))
      }
    } catch (e) {
      console.error("Groq insights fetch failed:", e)
    }
  }

  throw new Error("No AI provider available")
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const hasAI = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY ||
                     process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY)
    if (!hasAI) {
      return NextResponse.json({
        available: false,
        message: "Set GEMINI_API_KEY, GROQ_API_KEY, or OPENAI_API_KEY to enable AI insights.",
      })
    }

    const student = await UserModel.findById(user._id as string).catch(() => null)
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const summary = buildStudentSummary(student)

    const messages = [
      {
        role: "system",
        content: `You are a career advisor for software engineering students in India.
Analyze the student profile and return ONLY a valid JSON object — no markdown, no explanation, no extra text.
Use exactly this structure:
{
  "overallAssessment": "2-3 sentence summary",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "placementTip": "One specific actionable tip",
  "skillGaps": ["gap 1", "gap 2"],
  "estimatedPlacementReadiness": 75
}`,
      },
      { role: "user", content: summary },
    ]

    const raw = await callAI(messages, 600)

    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error(`No JSON in response: ${raw.slice(0, 100)}`)

    const insights = JSON.parse(jsonMatch[0])
    insights.estimatedPlacementReadiness = Number(insights.estimatedPlacementReadiness) || 50
    insights.strengths    = insights.strengths    || []
    insights.improvements = insights.improvements || []
    insights.skillGaps    = insights.skillGaps    || []

    return NextResponse.json({ available: true, insights })
  } catch (error) {
    console.error("AI insights error:", error)
    return NextResponse.json({
      available: false,
      message: "AI insights temporarily unavailable",
    })
  }
}
