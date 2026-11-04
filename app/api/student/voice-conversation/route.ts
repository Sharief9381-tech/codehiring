/**
 * POST /api/student/voice-conversation
 *
 * Natural conversation AI for everyday English practice.
 * Responds conversationally, gently corrects grammar woven into replies.
 *
 * Body: {
 *   userText: string          — what the student just said
 *   history:  { role, content }[]  — last N messages for context
 * }
 */

import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

const SYSTEM_PROMPT = `You are a friendly English conversation partner for Indian engineering students. Your job is to have NATURAL, FLOWING conversations on any everyday topic.

RULES:
1. Keep replies SHORT — 2 to 4 sentences maximum. This is a spoken voice conversation, not an essay.
2. Sound natural, warm, and friendly — like a friend, not a teacher.
3. If the student makes a grammar mistake, gently model the correct version ONCE in your reply — never lecture them. 
   Example: if they say "I am went to market", you naturally say "Oh nice, you went to the market! What did you buy?"
4. Ask one follow-up question to keep the conversation going.
5. Topics: anything — daily life, movies, food, college, friends, dreams, news, opinions. Stay positive and safe.
6. If the student seems hesitant, encourage them warmly.
7. DO NOT evaluate, score, or give formal feedback. Just CONVERSE.
8. Speak in simple, clear English — no jargon, no slang they won't understand.
9. Occasionally introduce a new word naturally: "That sounds fascinating — 'fascinating' means really interesting by the way!"
10. Max 60 words per response. Keep it punchy for voice.`

async function callAI(history: any[], userText: string): Promise<string> {
  const geminiKeys = [
    process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].filter(Boolean) as string[]

  // Build Gemini contents (alternating user/model)
  const contents: any[] = []
  for (const m of history) {
    contents.push({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })
  }
  contents.push({ role: "user", parts: [{ text: userText }] })

  for (const key of geminiKeys) {
    try {
      const r = await fetch(`${GEMINI_URL}?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 200, temperature: 0.85 },
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

  // OpenAI fallback
  if (process.env.OPENAI_API_KEY) {
    try {
      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
        { role: "user", content: userText },
      ]
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: "gpt-4o-mini", messages, temperature: 0.85, max_tokens: 200 }),
        signal: AbortSignal.timeout(20000),
      })
      if (r.ok) {
        const d = await r.json()
        return d.choices?.[0]?.message?.content?.trim() ?? ""
      }
    } catch {}
  }

  // Groq fallback
  if (process.env.GROQ_API_KEY) {
    try {
      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
        { role: "user", content: userText },
      ]
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({ model: "llama-3.1-8b-instant", messages, temperature: 0.85, max_tokens: 200 }),
        signal: AbortSignal.timeout(25000),
      })
      if (r.ok) {
        const d = await r.json()
        return d.choices?.[0]?.message?.content?.trim() ?? ""
      }
    } catch {}
  }

  return "That's really interesting! Tell me more about that."
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { userText, history = [] } = await req.json()
    if (!userText?.trim()) return NextResponse.json({ error: "No text provided" }, { status: 400 })

    const reply = await callAI(history, userText.trim())
    return NextResponse.json({ reply })

  } catch (err: any) {
    console.error("[voice-conversation]", err)
    return NextResponse.json({ reply: "Sorry, could you say that again?" })
  }
}
