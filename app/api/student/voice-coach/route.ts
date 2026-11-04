import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

const GEMINI_URL  = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
const OPENAI_URL  = "https://api.openai.com/v1/chat/completions"
const GROQ_URL    = "https://api.groq.com/openai/v1/chat/completions"
const GROQ_MODEL  = "llama-3.1-8b-instant"

// ── Multi-provider AI caller — Gemini → OpenAI → Groq ────────────────────────
async function callAI(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 600,
  temperature = 0.5
): Promise<string> {
  const geminiKeys = [
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
  ].filter(Boolean) as string[]

  // 1. Try Gemini
  for (const key of geminiKeys) {
    try {
      const r = await fetch(`${GEMINI_URL}?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: { maxOutputTokens: maxTokens, temperature },
        }),
        signal: AbortSignal.timeout(20000),
      })
      if (r.ok) {
        const d = await r.json()
        const text = d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ""
        if (text.length > 5) return text
      } else if (r.status === 429 || r.status === 403) continue
    } catch { continue }
  }

  // 2. OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const r = await fetch(OPENAI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
          max_tokens: maxTokens, temperature,
        }),
        signal: AbortSignal.timeout(20000),
      })
      if (r.ok) {
        const d = await r.json()
        const text = d.choices?.[0]?.message?.content?.trim() ?? ""
        if (text.length > 5) return text
      }
    } catch {}
  }

  // 3. Groq
  if (process.env.GROQ_API_KEY) {
    try {
      const r = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
          max_tokens: maxTokens, temperature,
        }),
        signal: AbortSignal.timeout(25000),
      })
      if (r.ok) {
        const d = await r.json()
        return d.choices?.[0]?.message?.content?.trim() ?? ""
      }
    } catch {}
  }

  throw new Error("All AI providers failed")
}

// ── Multi-provider conversation caller (for interview mode) ──────────────────
async function callAIConversation(
  messages: { role: string; content: string }[],
  maxTokens = 200,
  temperature = 0.7
): Promise<string> {
  const system = messages.find(m => m.role === "system")?.content ?? ""
  const history = messages.filter(m => m.role !== "system")
  const last = history[history.length - 1]?.content ?? ""
  const historyPrompt = history.slice(0, -1).map(m => `${m.role === "user" ? "Student" : "Interviewer"}: ${m.content}`).join("\n")
  const userPrompt = historyPrompt ? `${historyPrompt}\nStudent: ${last}` : last

  return callAI(system, userPrompt, maxTokens, temperature)
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const body = await request.json()
    const { mode, scenario, question, userSpeech, conversationHistory } = body

    if (!userSpeech && mode !== "get-question") {
      return NextResponse.json({ error: "No speech input provided" }, { status: 400 })
    }

    // ── Mode: get a question ────────────────────────────────────────────────
    if (mode === "get-question") {
      const scenarioMap: Record<string, string> = {
        hr:        "Generate one HR interview question for a fresh engineering graduate. One sentence only.",
        technical: "Generate one technical interview question for a CS/IT student about concepts (not code). One sentence.",
        gd:        "Give one group discussion topic for engineering students. One sentence.",
        english:   "Give one spoken English practice prompt — describe something, narrate, or share an opinion. One sentence.",
      }
      const prompt = scenarioMap[scenario] ?? scenarioMap.hr
      try {
        const text = await callAI("You generate interview questions. Reply with ONLY the question, nothing else.", prompt, 100, 0.8)
        return NextResponse.json({ question: text || "Tell me about yourself." })
      } catch {
        return NextResponse.json({ question: "Tell me about yourself and your strengths." })
      }
    }

    // ── Mode: practice feedback ─────────────────────────────────────────────
    if (mode === "practice") {
      const systemPrompt = `You are an expert communication coach for engineering students.
Analyse the student's spoken answer and return ONLY valid JSON:
{
  "overallScore": <0-100>,
  "grammar":    { "score": <0-100>, "issues": ["issue1"], "tip": "tip" },
  "fluency":    { "score": <0-100>, "fillerWords": ["um","uh"], "tip": "tip" },
  "content":    { "score": <0-100>, "relevance": "comment", "tip": "tip" },
  "confidence": { "score": <0-100>, "observation": "comment", "tip": "tip" },
  "improvedVersion": "polished version of the student's answer",
  "encouragement": "one warm encouraging sentence"
}`
      const userPrompt = `Question: "${question}"\nStudent answer: "${userSpeech}"\n\nAnalyse and return JSON.`
      try {
        const raw = await callAI(systemPrompt, userPrompt, 600, 0.3)
        const match = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").match(/\{[\s\S]*\}/)
        if (match) return NextResponse.json(JSON.parse(match[0]))
      } catch {}
      // Fallback
      return NextResponse.json({
        overallScore: 60,
        grammar:    { score: 60, issues: [], tip: "Focus on subject-verb agreement." },
        fluency:    { score: 60, fillerWords: [], tip: "Reduce pause words." },
        content:    { score: 60, relevance: "Relevant", tip: "Add specific examples." },
        confidence: { score: 60, observation: "Good effort", tip: "Speak with more conviction." },
        improvedVersion: userSpeech,
        encouragement: "Good attempt — keep practising!",
      })
    }

    // ── Mode: mock interview conversation ───────────────────────────────────
    if (mode === "interview") {
      const systemPrompt = `You are conducting a ${scenario === "hr" ? "HR" : scenario === "technical" ? "technical" : "communication"} interview for an engineering student. Keep replies to 2-3 sentences. Ask natural follow-up questions. Be professional but encouraging. After 8 exchanges give a brief summary.`
      const messages = [
        { role: "system", content: systemPrompt },
        ...(conversationHistory ?? []),
        { role: "user", content: userSpeech },
      ]
      try {
        const reply = await callAIConversation(messages, 200, 0.7)
        return NextResponse.json({ reply: reply || "Could you elaborate on that?", role: "assistant" })
      } catch {
        return NextResponse.json({ reply: "That's interesting. Could you tell me more?", role: "assistant" })
      }
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 })
  } catch (err) {
    console.error("Voice coach error:", err)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
