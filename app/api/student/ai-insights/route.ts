/**
 * GET /api/student/ai-insights
 * Returns AI-generated career insights for the logged-in student.
 * Tries Groq compound-mini first, falls back to OpenAI gpt-4o-mini.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"

const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions"
const OPENAI_URL = "https://api.openai.com/v1/chat/completions"

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
  const groqKey   = process.env.GROQ_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  // Try Groq first
  if (groqKey) {
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({ model: "groq/compound-mini", messages, max_tokens: maxTokens, temperature: 0.3 }),
        signal: AbortSignal.timeout(20000),
      })
      if (res.ok) {
        const d = await res.json()
        const content = d.choices?.[0]?.message?.content?.trim() ?? ""
        if (content) return content
      } else {
        console.error("Groq insights error:", res.status, await res.text())
      }
    } catch (e) {
      console.error("Groq insights fetch failed:", e)
    }
  }

  // Fallback to OpenAI
  if (openaiKey) {
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({ model: "gpt-4o-mini", messages, max_tokens: maxTokens, temperature: 0.3 }),
      signal: AbortSignal.timeout(20000),
    })
    if (res.ok) {
      const d = await res.json()
      return d.choices?.[0]?.message?.content?.trim() ?? ""
    }
  }

  throw new Error("No AI provider available")
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        available: false,
        message: "Add GROQ_API_KEY to .env to enable AI insights.",
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

    const raw = await callAI(messages, 500)

    // Extract JSON — strip any surrounding text
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error(`No JSON in response: ${raw.slice(0, 100)}`)

    const insights = JSON.parse(jsonMatch[0])

    // Ensure required fields
    insights.estimatedPlacementReadiness = Number(insights.estimatedPlacementReadiness) || 50
    insights.strengths   = insights.strengths   || []
    insights.improvements = insights.improvements || []
    insights.skillGaps   = insights.skillGaps   || []

    return NextResponse.json({ available: true, insights })
  } catch (error) {
    console.error("AI insights error:", error)
    return NextResponse.json({
      available: false,
      message: "AI insights temporarily unavailable",
    })
  }
}
