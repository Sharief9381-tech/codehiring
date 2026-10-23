/**
 * AI client — tries Groq first, then OpenAI, then Gemini.
 * Priority: Groq (free, fast) → OpenAI → Gemini
 */

const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions"
const OPENAI_URL = "https://api.openai.com/v1/chat/completions"
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

const stripThink = (s: string) => s.replace(/<think>[\s\S]*?<\/think>/gi, "").trim()

async function callGemini(systemPrompt: string, userMessage: string, maxTokens: number): Promise<string> {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!key) throw new Error("No GEMINI_API_KEY")
  const body = {
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
  }
  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25000),
  })
  if (!res.ok) throw new Error(`Gemini ${res.status}`)
  const d = await res.json()
  return d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ""
}

export async function groqChat(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 800
): Promise<string> {
  // 1. Gemini 2.0 Flash
  try {
    const text = await callGemini(systemPrompt, userMessage, maxTokens)
    if (text) return text
  } catch {}

  // 2. OpenAI
  const openaiKey = process.env.OPENAI_API_KEY
  if (openaiKey) {
    try {
      const res = await fetch(OPENAI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMessage }],
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(25000),
      })
      if (res.ok) {
        const d = await res.json()
        const text = d.choices?.[0]?.message?.content?.trim() ?? ""
        if (text) return text
      }
    } catch {}
  }

  // 3. Groq (last resort)
  const groqKey = process.env.GROQ_API_KEY
  if (groqKey) {
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMessage }],
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(25000),
      })
      if (res.ok) {
        const d = await res.json()
        const text = stripThink(d.choices?.[0]?.message?.content ?? "")
        if (text) return text
      }
    } catch {}
  }

  throw new Error("No AI provider available. Set GEMINI_API_KEY, OPENAI_API_KEY, or GROQ_API_KEY.")
}

export function isGroqAvailable(): boolean {
  return !!(process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)
}
