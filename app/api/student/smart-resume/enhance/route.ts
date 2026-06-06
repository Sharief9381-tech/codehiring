/**
 * POST /api/student/smart-resume/enhance
 * Enhances a single work experience description using AI.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { groqChat, isGroqAvailable } from "@/lib/groq"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    if (!isGroqAvailable()) return NextResponse.json({ error: "AI service not configured" }, { status: 503 })

    const { title, company, description } = await req.json()
    if (!title || !company) return NextResponse.json({ error: "Job title and company are required" }, { status: 400 })

    const systemPrompt = `You are an expert resume writer. Rewrite the given work experience description to be:
- Strong and impactful with action verbs
- Quantified with metrics where possible (use realistic estimates if not provided)  
- ATS-optimized with relevant keywords
- 3-4 bullet points maximum
- Each bullet starting with a strong past-tense action verb

Return ONLY the enhanced description as plain text bullet points (using • character), no JSON, no explanation.`

    const userMsg = `Role: ${title} at ${company}
Current description: ${description || "Not provided - create from scratch based on the role"}`

    const enhanced = await groqChat(systemPrompt, userMsg, 400)
    return NextResponse.json({ success: true, enhanced: enhanced.trim() })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Enhancement failed" }, { status: 500 })
  }
}
