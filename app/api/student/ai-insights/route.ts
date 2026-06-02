/**
 * GET /api/student/ai-insights
 * Returns AI-generated career insights for the logged-in student.
 * Uses Groq llama-3.1-8b-instant. Falls back gracefully if key not set.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { groqChat, isGroqAvailable } from "@/lib/groq"

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

  return `
Student: ${student.name}
Branch: ${student.branch || "N/A"}, Year: ${student.graduationYear || "N/A"}
College Code: ${student.collegeCode || "N/A"}
Skills: ${(student.skills || []).join(", ") || "None listed"}
Connected Platforms: ${platforms.join(", ") || "None"}
Total Problems Solved: ${totalProblems}
Highest Rating: ${highestRating}
GitHub Contributions: ${githubContributions}
Contests Participated: ${contests}
Open to Work: ${student.isOpenToWork ? "Yes" : "No"}
LinkedIn: ${student.linkedinUrl ? "Added" : "Not added"}
  `.trim()
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const student = await UserModel.findById(user._id as string)
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 })

    if (!isGroqAvailable()) {
      return NextResponse.json({
        available: false,
        message: "Add GROQ_API_KEY to .env.local to enable AI insights (free at console.groq.com)",
      })
    }

    const summary = buildStudentSummary(student)

    const systemPrompt = `You are a career advisor for software engineering students in India. 
Analyze the student's coding profile and give concise, actionable career insights.
Be specific, encouraging but honest. Focus on placement readiness.
Respond in JSON with this exact structure:
{
  "overallAssessment": "2-3 sentence summary of the student's profile strength",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3"],
  "placementTip": "One specific actionable tip to improve placement chances",
  "skillGaps": ["skill gap 1", "skill gap 2"],
  "estimatedPlacementReadiness": 75
}`

    const raw = await groqChat(systemPrompt, summary, 600)

    // Parse JSON from response
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("Invalid AI response format")

    const insights = JSON.parse(jsonMatch[0])

    return NextResponse.json({ available: true, insights })
  } catch (error) {
    console.error("AI insights error:", error)
    return NextResponse.json({
      available: false,
      message: "AI insights temporarily unavailable",
    })
  }
}
