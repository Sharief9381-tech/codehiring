/**
 * LLM Caller for Question Generation
 * Priority: Gemini (3 keys with rotation) → OpenAI → Groq
 */

const OPENAI_URL = "https://api.openai.com/v1/chat/completions"
const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions"
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent"

export interface LLMResponse {
  content: string
  model:   string
}

const stripThink = (s: string) => s.replace(/<think>[\s\S]*?<\/think>/gi, "").trim()

async function callGemini(messages: { role: string; content: string }[], maxTokens: number, key: string): Promise<string> {
  let systemInstruction: string | undefined
  const contents: { role: string; parts: { text: string }[] }[] = []
  for (const m of messages) {
    if (m.role === "system") { systemInstruction = m.content }
    else { contents.push({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }) }
  }

  const body: any = {
    contents,
    // Cap at 8192 — Gemini free tier limit
    generationConfig: { maxOutputTokens: Math.min(maxTokens, 8192), temperature: 0.7 },
  }
  if (systemInstruction) body.systemInstruction = { parts: [{ text: systemInstruction }] }

  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(35000),
  })
  if (!res.ok) throw new Error(`Gemini ${res.status}`)
  const d = await res.json()

  // Check for finish reason — if STOP or MAX_TOKENS, use what we got
  const candidate = d.candidates?.[0]
  const finishReason = candidate?.finishReason
  const text = candidate?.content?.parts?.[0]?.text?.trim() ?? ""

  if (!text) throw new Error("Gemini empty response")

  // If truncated due to token limit, try to fix the JSON by appending closing brackets
  if (finishReason === "MAX_TOKENS" && text.includes("[")) {
    return repairTruncatedJSON(text)
  }

  return text
}

// Attempt to repair truncated JSON arrays from token cutoffs
function repairTruncatedJSON(text: string): string {
  const startIdx = text.indexOf("[")
  if (startIdx === -1) return text

  let content = text.slice(startIdx)

  // Count complete objects — find all complete {...} within the array
  const completeObjects: string[] = []
  let depth = 0
  let objStart = -1
  let inStr = false
  let escape = false

  for (let i = 0; i < content.length; i++) {
    const c = content[i]
    if (escape) { escape = false; continue }
    if (c === "\\") { escape = true; continue }
    if (c === '"') { inStr = !inStr; continue }
    if (inStr) continue

    if (c === "{") {
      if (depth === 0) objStart = i
      depth++
    } else if (c === "}") {
      depth--
      if (depth === 0 && objStart !== -1) {
        completeObjects.push(content.slice(objStart, i + 1))
        objStart = -1
      }
    }
  }

  if (completeObjects.length === 0) return text
  return "[" + completeObjects.join(",") + "]"
}

export async function callLLM(
  system: string,
  user:   string,
  maxTokens = 4000
): Promise<LLMResponse> {
  // Each MCQ needs ~300-400 tokens; each coding problem ~400-500 tokens
  // Ensure we request enough tokens for the full output
  const effectiveTokens = Math.max(maxTokens, 6000)

  const messages = [
    { role: "system" as const, content: system },
    { role: "user"   as const, content: user   },
  ]

  // 1. Gemini — try all 3 keys with rotation
  const geminiKeys = [
    process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].filter(Boolean) as string[]

  for (const key of geminiKeys) {
    try {
      const text = await callGemini(messages, effectiveTokens, key)
      if (text.length > 20) return { content: text, model: "gemini-3.5-flash" }
    } catch (e: any) {
      if (e.message?.includes("429") || e.message?.includes("403")) continue
      continue
    }
  }

  // 2. OpenAI
  const openaiKey = process.env.OPENAI_API_KEY
  if (openaiKey) {
    try {
      const res = await fetch(OPENAI_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openaiKey}` },
        body:    JSON.stringify({ model: "gpt-4o-mini", messages, temperature: 0.7, max_tokens: effectiveTokens }),
        signal:  AbortSignal.timeout(30000),
      })
      if (res.ok) {
        const d    = await res.json()
        const text = d.choices?.[0]?.message?.content?.trim() ?? ""
        if (text.length > 20) return { content: text, model: "gpt-4o-mini" }
      }
    } catch {}
  }

  // 3. Groq
  const groqKey = process.env.GROQ_API_KEY
  if (groqKey) {
    try {
      const res = await fetch(GROQ_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
        body:    JSON.stringify({ model: "openai/gpt-oss-20b", messages, temperature: 0.7, max_tokens: Math.min(effectiveTokens, 4000) }),
        signal:  AbortSignal.timeout(35000),
      })
      if (res.ok) {
        const d    = await res.json()
        const text = stripThink(d.choices?.[0]?.message?.content?.trim() ?? "")
        if (text.length > 20) return { content: text, model: "openai/gpt-oss-20b" }
      }
    } catch {}
  }

  throw new Error("No AI provider available. Set GEMINI_API_KEY, OPENAI_API_KEY, or GROQ_API_KEY.")
}
