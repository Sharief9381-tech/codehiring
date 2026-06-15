/**
 * POST /api/student/ai-chat
 * AI career chatbot for students — powered by Groq.
 * Maintains conversation context via messages array sent from client.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { groqChat, isGroqAvailable } from "@/lib/groq"

function buildStudentContext(student: any): string {
  const lp: Record<string, any> = student.linkedPlatforms || {}
  const platformLines: string[] = []
  let totalProblems = 0, highestRating = 0, githubContributions = 0, contests = 0

  for (const [pid, data] of Object.entries(lp)) {
    if (!data || typeof data !== "object") continue
    const s = (data as any).stats
    const uname = (data as any).username || ""
    if (!s) { platformLines.push(`${pid}: @${uname} (not synced)`); continue }

    const solved  = s.totalSolved || s.problemsSolved || s.completedExercises || 0
    const rating  = s.rating || s.currentRating || s.highestRating || 0
    const easy    = s.easySolved || s.easyCount || 0
    const medium  = s.mediumSolved || s.mediumCount || 0
    const hard    = s.hardSolved || s.hardCount || 0
    const gh      = s.totalContributions || 0
    const repos   = s.publicRepos || 0
    const badges  = s.badges?.length || 0
    const score   = s.codingScore || s.score || 0
    const streak  = s.currentStreak || 0
    const rank    = s.rank || s.globalRank || ""
    const stars   = s.stars || ""
    const cntst   = s.contests?.length || s.contestsParticipated || s.attendedContestsCount || 0

    totalProblems += solved
    if (pid === "github") githubContributions = gh
    if (rating > highestRating) highestRating = rating
    contests += cntst

    let line = `${pid.charAt(0).toUpperCase()+pid.slice(1)}: @${uname}`
    if (solved) line += ` | ${solved} solved`
    if (easy || medium || hard) line += ` (Easy:${easy} Med:${medium} Hard:${hard})`
    if (rating) line += ` | Rating:${rating}${rank ? " "+rank : ""}${stars ? " "+stars : ""}`
    if (cntst) line += ` | ${cntst} contests`
    if (pid === "github") line += ` | ${gh} contributions, ${repos} repos`
    if (badges) line += ` | ${badges} badges`
    if (score) line += ` | Score:${score}`
    if (streak) line += ` | Streak:${streak}d`
    platformLines.push(line)
  }

  // Achievements
  const achievements: string[] = []
  const savedAch: any[] = student.achievements || []
  if (savedAch.length > 0) {
    achievements.push(...savedAch.slice(0, 8).map((a: any) => a.title || a))
  }

  // Resume
  const hasResume = !!(student.resumeUrl || student.resumeFile?.fileName)
  const resumeInfo = hasResume
    ? `Resume: ${student.resumeFile?.fileName || student.resumeUrl} (uploaded)`
    : "Resume: Not uploaded"

  return `=== STUDENT FULL PROFILE ===
Name: ${student.name}
Email: ${student.email}
Branch: ${student.branch || "N/A"} | Degree: ${student.degree || "B.Tech"} | Graduation: ${student.graduationYear || "N/A"}
College: ${student.collegeName || student.collegeCode || "N/A"} (Code: ${student.collegeCode || "N/A"})
Roll No: ${student.rollNumber || "N/A"} | Location: ${student.location || "N/A"}
Bio: ${student.bio || "Not provided"}

Skills: ${(student.skills || []).join(", ") || "None listed"}
LinkedIn: ${student.linkedinUrl ? student.linkedinUrl : "Not added"}
GitHub URL: ${student.githubUrl || "Not added"}
Portfolio: ${student.portfolioUrl || "Not added"}
${resumeInfo}

Open to Work: ${student.isOpenToWork ? "YES" : "No"}
Placement Status: ${student.placementStatus || "searching"}

=== CODING STATS (${platformLines.length} platforms) ===
Total Problems Solved: ${totalProblems}
Highest Rating: ${highestRating || "N/A"}
GitHub Contributions: ${githubContributions}
Total Contests: ${contests}

Per Platform:
${platformLines.map(l => "  • " + l).join("\n") || "  No platforms connected"}

${achievements.length > 0 ? `=== ACHIEVEMENTS ===\n${achievements.map(a => "  🏆 " + a).join("\n")}` : ""}

=== SMART RESUME AI ANALYSIS ===
${student.smartResume?.analysis ? `ATS Score: ${student.smartResume.analysis.atsScore}/100
Recommended Roles: ${(student.smartResume.analysis.recommendedRoles || []).join(", ")}
Skills Found: ${(student.smartResume.analysis.skillsFound || []).slice(0, 8).join(", ")}` : "Not analysed yet"}
`
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    if (!isGroqAvailable()) {
      return NextResponse.json({ error: "AI not configured" }, { status: 503 })
    }

    const { message, history = [] } = await request.json()
    if (!message?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 })

    const student = await UserModel.findById(user._id as string)
    const studentContext = student ? buildStudentContext(student) : ""

    const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
    const systemPrompt = `You are CodeHiring AI — a smart, data-driven career advisor for software engineering students in India.
You have FULL access to the student's complete profile below including all platform stats, skills, achievements, resume analysis, and placement status.
Use the specific numbers and data from their profile to give personalised, accurate advice.
Be concise, friendly, and action-oriented. Use bullet points for lists. Mention specific stats when relevant.
Never say you "don't have access" — you have everything below.
Focus on: placement preparation, coding improvement, career guidance, skill gaps, job matching, company-specific prep.

${studentContext}`

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-12),
      { role: "user", content: message },
    ]

    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    if (!res.ok) throw new Error(`Groq error: ${res.status}`)
    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response."

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("AI chat error:", error)
    return NextResponse.json({ error: "AI temporarily unavailable" }, { status: 500 })
  }
}
