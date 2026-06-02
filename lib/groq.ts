/**
 * Groq AI client — uses llama-3.1-8b-instant (free, fast)
 * Get your free key at https://console.groq.com
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama-3.1-8b-instant"

export async function groqChat(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 800
): Promise<string> {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error("GROQ_API_KEY not set")

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq API error: ${res.status} — ${err}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ""
}

export function isGroqAvailable(): boolean {
  return !!process.env.GROQ_API_KEY
}
