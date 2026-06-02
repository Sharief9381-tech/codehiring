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
  let totalProblems = 0, highestRating = 0, githubContributions = 0, contests = 0
  const platforms: string[] = []

  Object.entries(student.linkedPlatforms || {}).forEach(([pid, data]: [string, any]) => {
    if (!data?.stats) return
    platforms.push(pid)
    const s = data.stats
    totalProblems += s.totalSolved || s.problemsSolved || 0
    if (pid === "github") githubContributions = s.totalContributions || 0
    const r = Math.max(s.rating || 0, s.currentRating || 0, s.highestRating || 0, s.contestRating || 0)
    if (r > highestRating) highestRating = r
    contests += s.contests?.length || s.contestsParticipated || s.attendedContestsCount || 0
  })

  return `Student Profile:
Name: ${student.name}
Branch: ${student.branch || "N/A"} | College: ${student.collegeCode || "N/A"} | Year: ${student.graduationYear || "N/A"}
Skills: ${(student.skills || []).join(", ") || "None listed"}
Platforms: ${platforms.join(", ") || "None connected"}
Problems Solved: ${totalProblems} | Highest Rating: ${highestRating}
GitHub Contributions: ${githubContributions} | Contests: ${contests}
Open to Work: ${student.isOpenToWork ? "Yes" : "No"}
LinkedIn: ${student.linkedinUrl ? "Added" : "Not added"}`
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

    const systemPrompt = `You are CodeTrack AI — a smart career advisor for software engineering students in India.
You have access to the student's coding profile below. Use it to give personalized, specific advice.
Be concise, friendly, and actionable. Use bullet points when listing items.
Focus on: placement preparation, coding improvement, career guidance, skill gaps, job matching.

${studentContext}`

    // Build messages array for multi-turn conversation
    const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-10), // keep last 10 messages for context
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
        max_tokens: 600,
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
