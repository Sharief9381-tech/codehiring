/**
 * LLM Caller for Question Generation
 * Priority: Groq (free, fast) → OpenAI → Gemini (fallback)
 */

const OPENAI_URL = "https://api.openai.com/v1/chat/completions"
const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions"
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

export interface LLMResponse {
  content: string
  model:   string
}

const stripThink = (s: string) => s.replace(/<think>[\s\S]*?<\/think>/gi, "").trim()

async function callGemini(messages: { role: string; content: string }[], maxTokens: number): Promise<string> {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!key) throw new Error("No GEMINI_API_KEY")

  let systemInstruction: string | undefined
  const contents: { role: string; parts: { text: string }[] }[] = []
  for (const m of messages) {
    if (m.role === "system") { systemInstruction = m.content }
    else { contents.push({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }) }
  }

  const body: any = {
    contents,
    generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
  }
  if (systemInstruction) body.systemInstruction = { parts: [{ text: systemInstruction }] }

  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25000),
  })
  if (!res.ok) throw new Error(`Gemini ${res.status}`)
  const d = await res.json()
  const text = d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ""
  if (!text) throw new Error("Gemini empty response")
  return text
}

export async function callLLM(
  system: string,
  user:   string,
  maxTokens = 4000
): Promise<LLMResponse> {
  const messages = [
    { role: "system" as const, content: system },
    { role: "user"   as const, content: user   },
  ]

  // 1. Gemini 2.0 Flash
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (geminiKey) {
    try {
      const text = await callGemini(messages, maxTokens)
      if (text.length > 20) return { content: text, model: "gemini-2.0-flash" }
    } catch {}
  }

  // 2. OpenAI
  const openaiKey = process.env.OPENAI_API_KEY
  if (openaiKey) {
    try {
      const res = await fetch(OPENAI_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openaiKey}` },
        body:    JSON.stringify({ model: "gpt-4o-mini", messages, temperature: 0.7, max_tokens: maxTokens }),
        signal:  AbortSignal.timeout(25000),
      })
      if (res.ok) {
        const d    = await res.json()
        const text = d.choices?.[0]?.message?.content?.trim() ?? ""
        if (text.length > 20) return { content: text, model: "gpt-4o-mini" }
      }
    } catch {}
  }

  // 3. Groq (last resort)
  const groqKey = process.env.GROQ_API_KEY
  if (groqKey) {
    try {
      const res = await fetch(GROQ_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
        body:    JSON.stringify({ model: "qwen/qwen3.6-27b", messages, temperature: 0.7, max_tokens: maxTokens }),
        signal:  AbortSignal.timeout(30000),
      })
      if (res.ok) {
        const d    = await res.json()
        const text = stripThink(d.choices?.[0]?.message?.content?.trim() ?? "")
        if (text.length > 20) return { content: text, model: "qwen/qwen3.6-27b" }
      }
    } catch {}
  }

  throw new Error("No AI provider available. Set GEMINI_API_KEY, OPENAI_API_KEY, or GROQ_API_KEY.")
}
