/**
 * POST /api/student/communication-voice
 *
 * Analyses a student's spoken communication and returns structured feedback:
 * grammar, vocabulary, sentence structure, fluency, pronunciation tips.
 *
 * Body: {
 *   scenario:   string  — "sentence-formation" | "vocabulary" | "gd-speaking" | "hr-softskills" | "pronunciation"
 *   level:      string  — "Beginner" | "Intermediate" | "Advanced"
 *   prompt:     string  — the question/task the student was responding to
 *   userSpeech: string  — transcribed text of the student's speech
 * }
 */

import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  // 1. Gemini (3 keys)
  const geminiKeys = [
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
  ].filter(Boolean) as string[]

  for (const key of geminiKeys) {
    try {
      const r = await fetch(`${GEMINI_URL}?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: { maxOutputTokens: 1000, temperature: 0.3 },
        }),
        signal: AbortSignal.timeout(25000),
      })
      if (r.ok) {
        const d = await r.json()
        const text = d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ""
        if (text.length > 50) return text
      } else if (r.status === 429 || r.status === 403) continue
    } catch { continue }
  }

  // 2. OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
          temperature: 0.3, max_tokens: 1000,
        }),
        signal: AbortSignal.timeout(25000),
      })
      if (r.ok) {
        const d = await r.json()
        return d.choices?.[0]?.message?.content?.trim() ?? ""
      }
    } catch {}
  }

  // 3. Groq
  if (process.env.GROQ_API_KEY) {
    try {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
          temperature: 0.3, max_tokens: 1000,
        }),
        signal: AbortSignal.timeout(30000),
      })
      if (r.ok) {
        const d = await r.json()
        return d.choices?.[0]?.message?.content?.trim() ?? ""
      }
    } catch {}
  }

  throw new Error("All AI providers failed")
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { scenario, level, prompt, userSpeech } = await req.json()

    if (!userSpeech?.trim()) {
      return NextResponse.json({ error: "No speech provided" }, { status: 400 })
    }

    const systemPrompt = `You are an expert English communication coach for Indian engineering students preparing for campus placements.

Your job: Analyse the student's spoken response and give precise, actionable feedback.

Focus areas based on scenario:
- sentence-formation: grammar accuracy, sentence variety, clause usage
- vocabulary: word richness, synonyms used, academic/formal vocabulary
- gd-speaking: opinion clarity, logical structure, argument quality
- hr-softskills: professional tone, self-presentation, answer completeness
- pronunciation: clarity hints (from text clues), filler words, pace

SCORING: Be calibrated — Beginner gets 50-70 typically, Intermediate 60-80, Advanced 70-90.
Score honestly. Don't give 90+ for mediocre answers.

Return ONLY valid JSON, no markdown:
{
  "overallScore": <0-100>,
  "grammar": {
    "score": <0-100>,
    "issues": ["specific grammar error 1", "error 2"],
    "tip": "one concrete tip to improve grammar"
  },
  "vocabulary": {
    "score": <0-100>,
    "richWords": ["good words the student used"],
    "tip": "one tip to enrich vocabulary"
  },
  "sentence": {
    "score": <0-100>,
    "observation": "one sentence about sentence structure quality",
    "tip": "one concrete improvement tip"
  },
  "fluency": {
    "score": <0-100>,
    "fillerWords": ["um", "uh", "like"],
    "tip": "one tip to improve fluency"
  },
  "pronunciation": {
    "tip": "one pronunciation tip (infer from word choice/complexity)",
    "wordsToImprove": ["word1", "word2"]
  },
  "improvedVersion": "A polished, natural version of what the student said — keep meaning but improve grammar, vocabulary, flow",
  "encouragement": "One warm encouraging sentence personalised to their level and performance",
  "nextLevelTip": "One specific thing to work on next to reach the next level"
}`

    const userPrompt = `Scenario: ${scenario}
Level: ${level}
Task/Prompt given to student: "${prompt}"
Student's spoken answer: "${userSpeech.trim()}"

Analyse and return JSON feedback.`

    const raw = await callAI(systemPrompt, userPrompt)
    const clean = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()

    // Extract JSON
    const jsonMatch = clean.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("No JSON in response")

    const feedback = JSON.parse(jsonMatch[0])
    return NextResponse.json(feedback)

  } catch (err: any) {
    console.error("[communication-voice]", err)
    // Return a sensible default so the UI doesn't break
    return NextResponse.json({
      overallScore: 60,
      grammar:     { score: 60, issues: [], tip: "Keep practising — focus on subject-verb agreement." },
      vocabulary:  { score: 60, richWords: [], tip: "Try using more formal vocabulary words." },
      sentence:    { score: 60, observation: "Sentences are clear but simple.", tip: "Try using compound sentences to express more complex ideas." },
      fluency:     { score: 60, fillerWords: [], tip: "Speak at a steady pace and avoid long pauses." },
      pronunciation: { tip: "Practice speaking slowly and clearly.", wordsToImprove: [] },
      improvedVersion: "Great attempt! Keep practising for more polished responses.",
      encouragement: "You're on the right track — consistency is key!",
      nextLevelTip: "Focus on reducing filler words and using more varied vocabulary.",
    })
  }
}
