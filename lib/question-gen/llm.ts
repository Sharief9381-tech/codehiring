/**
 * LLM Caller for Question Generation
 * Priority order:
 * 1. gemini-3.8-flash with KEY4 (new key, less quota used)
 * 2. gemini-3.5-flash with all 4 keys (rotation)
 * 3. Groq fallback
 * 4. OpenAI fallback
 */

const OPENAI_URL   = "https://api.openai.com/v1/chat/completions"
const GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions"
const GEMINI_38    = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent"
const GEMINI_35    = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent"

// Both 3.5 and 3.8 are thinking models — need high token budget
// Thinking uses ~500-800 tokens before content generation begins
const GEMINI_TOKENS = 8000

export interface LLMResponse {
  content: string
  model:   string
}

const stripThink = (s: string) => s.replace(/<think>[\s\S]*?<\/think>/gi, "").trim()

async function callGeminiModel(
  url: string,
  messages: { role: string; content: string }[],
  key: string
): Promise<string> {
  let systemInstruction: string | undefined
  const contents: { role: string; parts: { text: string }[] }[] = []
  for (const m of messages) {
    if (m.role === "system") { systemInstruction = m.content }
    else { contents.push({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }) }
  }

  const body: any = {
    contents,
    generationConfig: { maxOutputTokens: GEMINI_TOKENS, temperature: 0.7 },
  }
  if (systemInstruction) body.systemInstruction = { parts: [{ text: systemInstruction }] }

  const res = await fetch(`${url}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(45000),
  })

  if (!res.ok) {
    const status = res.status
    if (status === 503 || status === 429) throw new Error(`Gemini ${status} overload`)
    if (status === 404) throw new Error(`Gemini ${status} model not found`)
    throw new Error(`Gemini ${status}`)
  }

  const d = await res.json()
  const candidate = d.candidates?.[0]
  const text = candidate?.content?.parts?.[0]?.text?.trim() ?? ""

  if (!text) {
    const reason = candidate?.finishReason
    const thinkTokens = d.usageMetadata?.thoughtsTokenCount ?? 0
    throw new Error(`Gemini empty (finish: ${reason}, think: ${thinkTokens})`)
  }

  // Repair truncated JSON if needed
  if (candidate?.finishReason === "MAX_TOKENS" && text.includes("[")) {
    return repairTruncatedJSON(text)
  }

  return text
}

function repairTruncatedJSON(text: string): string {
  const startIdx = text.indexOf("[")
  if (startIdx === -1) return text
  const content = text.slice(startIdx)
  const complete: string[] = []
  let depth = 0, start = -1, inStr = false, esc = false

  for (let i = 0; i < content.length; i++) {
    const c = content[i]
    if (esc) { esc = false; continue }
    if (c === "\\") { esc = true; continue }
    if (c === '"') { inStr = !inStr; continue }
    if (inStr) continue
    if (c === "{") { if (depth === 0) start = i; depth++ }
    else if (c === "}") {
      depth--
      if (depth === 0 && start !== -1) { complete.push(content.slice(start, i + 1)); start = -1 }
    }
  }
  return complete.length > 0 ? "[" + complete.join(",") + "]" : text
}

export async function callLLM(
  system: string,
  user:   string,
  _maxTokens = 4000
): Promise<LLMResponse> {
  const messages = [
    { role: "system" as const, content: system },
    { role: "user"   as const, content: user   },
  ]

  const key1 = process.env.GEMINI_API_KEY   || process.env.GOOGLE_API_KEY || ""
  const key2 = process.env.GEMINI_API_KEY_2 || ""
  const key3 = process.env.GEMINI_API_KEY_3 || ""
  const key4 = process.env.GEMINI_API_KEY_4 || ""

  // ── 1. Gemini 3.8-flash KEY4 → 3.5-flash KEY4,3,2,1 ─────────────────────
  // Try gemini-3.8-flash with KEY4 first
  if (key4) {
    try {
      const text = await callGeminiModel(GEMINI_38, messages, key4)
      if (text.length > 20) return { content: text, model: "gemini-3.8-flash" }
    } catch (e: any) {
      console.warn("gemini-3.8-flash K4:", e.message?.slice(0, 60))
    }
  }

  // Try gemini-3.5-flash KEY4 → KEY3 → KEY2 → KEY1
  for (const [key, label] of [[key4, "K4"], [key3, "K3"], [key2, "K2"], [key1, "K1"]] as [string, string][]) {
    if (!key) continue
    try {
      const text = await callGeminiModel(GEMINI_35, messages, key)
      if (text.length > 20) return { content: text, model: `gemini-3.5-flash-${label}` }
    } catch (e: any) {
      console.warn(`gemini-3.5-flash ${label}:`, e.message?.slice(0, 60))
    }
  }

  // ── 2. OpenAI ──────────────────────────────────────────────────────────────
  const openaiKey = process.env.OPENAI_API_KEY
  if (openaiKey) {
    try {
      const res = await fetch(OPENAI_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openaiKey}` },
        body:    JSON.stringify({ model: "gpt-4o-mini", messages, temperature: 0.7, max_tokens: 8000 }),
        signal:  AbortSignal.timeout(30000),
      })
      if (res.ok) {
        const d    = await res.json()
        const text = d.choices?.[0]?.message?.content?.trim() ?? ""
        if (text.length > 20) return { content: text, model: "gpt-4o-mini" }
      }
    } catch {}
  }

  // ── 3. Groq — last resort ─────────────────────────────────────────────────
  const groqKey = process.env.GROQ_API_KEY
  if (groqKey) {
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
        body: JSON.stringify({ model: "openai/gpt-oss-20b", messages, temperature: 0.7, max_tokens: 8000 }),
        signal: AbortSignal.timeout(35000),
      })
      if (res.ok) {
        const d = await res.json()
        const text = stripThink(d.choices?.[0]?.message?.content?.trim() ?? "")
        if (text.length > 20) return { content: text, model: "openai/gpt-oss-20b" }
      }
    } catch {}
  }

  throw new Error("No AI provider available.")
}
