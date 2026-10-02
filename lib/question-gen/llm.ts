/**
 * LLM Caller for Question Generation
 * Tries OpenAI first, falls back to Groq qwen/qwen3.8-27b.
 */

const OPENAI_URL = "https://api.openai.com/v1/chat/completions"
const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions"

export interface LLMResponse {
  content: string
  model:   string
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

  // Try OpenAI first (best quality, but may have no credits)
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
        const text = d.choices?.[0]?.message?.content?.trim()
        if (text && text.length > 20) return { content: text, model: "gpt-4o-mini" }
      }
    } catch {}
  }

  // Groq: qwen/qwen3.8-27b (free, works well for structured JSON)
  const groqKey = process.env.GROQ_API_KEY
  if (groqKey) {
    const res = await fetch(GROQ_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
      body:    JSON.stringify({
        model:       "qwen/qwen3.8-27b",
        messages,
        temperature: 0.7,
        max_tokens:  maxTokens,
      }),
      signal: AbortSignal.timeout(30000),
    })
    if (res.ok) {
      const d    = await res.json()
      const text = d.choices?.[0]?.message?.content?.trim()
      if (text && text.length > 20) return { content: text, model: "qwen/qwen3.8-27b" }
    }
    const err = await res.text().catch(() => "unknown")
    throw new Error(`Groq API error: ${err.slice(0, 100)}`)
  }

  throw new Error("No AI provider configured (set GROQ_API_KEY or OPENAI_API_KEY)")
}
