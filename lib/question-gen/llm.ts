/**
 * LLM Caller for Question Generation
 * Priority: Gemini (3 keys, high token budget for thinking models) → Groq → OpenAI
 */

const OPENAI_URL = "https://api.openai.com/v1/chat/completions"
const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions"
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent"

// Gemini 3.5-flash is a "thinking" model — it uses thinking tokens BEFORE generating output.
// Thinking tokens: ~500-800 per call. So for 8 questions × 400 tokens = 3200 output tokens needed.
// Total required: 800 (think) + 3200 (output) = 4000 minimum. Set to 8000 for safety.
const GEMINI_MIN_TOKENS = 8000

export interface LLMResponse {
  content: string
  model:   string
}

const stripThink = (s: string) => s.replace(/<think>[\s\S]*?<\/think>/gi, "").trim()

async function callGemini(messages: { role: string; content: string }[], key: string): Promise<string> {
  let systemInstruction: string | undefined
  const contents: { role: string; parts: { text: string }[] }[] = []
  for (const m of messages) {
    if (m.role === "system") { systemInstruction = m.content }
    else { contents.push({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }) }
  }

  const body: any = {
    contents,
    generationConfig: {
      maxOutputTokens: GEMINI_MIN_TOKENS,  // high budget for thinking + output
      temperature: 0.7,
    },
  }
  if (systemInstruction) body.systemInstruction = { parts: [{ text: systemInstruction }] }

  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(45000),  // longer timeout for thinking models
  })

  if (!res.ok) {
    const status = res.status
    if (status === 503 || status === 429) throw new Error(`Gemini ${status} overload`)
    throw new Error(`Gemini ${status}`)
  }

  const d = await res.json()
  const candidate = d.candidates?.[0]
  const finishReason = candidate?.finishReason
  const text = candidate?.content?.parts?.[0]?.text?.trim() ?? ""

  if (!text) {
    const thoughtTokens = d.usageMetadata?.thoughtsTokenCount ?? 0
    throw new Error(`Gemini empty (finish: ${finishReason}, think: ${thoughtTokens})`)
  }

  // If still truncated despite high token budget, repair JSON
  if (finishReason === "MAX_TOKENS" && text.includes("[")) {
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
  _maxTokens = 4000  // ignored — we use GEMINI_MIN_TOKENS for Gemini
): Promise<LLMResponse> {
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
      const text = await callGemini(messages, key)
      if (text.length > 20) return { content: text, model: "gemini-3.5-flash" }
    } catch (e: any) {
      console.warn(`Gemini key failed: ${e.message?.slice(0, 60)}`)
      continue
    }
  }

  // 2. Groq — fast, free fallback
  const groqKey = process.env.GROQ_API_KEY
  if (groqKey) {
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages,
          temperature: 0.7,
          max_tokens: 8000,
        }),
        signal: AbortSignal.timeout(35000),
      })
      if (res.ok) {
        const d = await res.json()
        const text = stripThink(d.choices?.[0]?.message?.content?.trim() ?? "")
        if (text.length > 20) return { content: text, model: "openai/gpt-oss-20b" }
      }
    } catch {}
  }

  // 3. OpenAI
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

  throw new Error("No AI provider available. Set GEMINI_API_KEY, OPENAI_API_KEY, or GROQ_API_KEY.")
}
