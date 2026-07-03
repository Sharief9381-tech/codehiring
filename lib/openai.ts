/**
 * OpenAI client — GPT-4o-mini for fast, cost-effective question generation
 * Set OPENAI_API_KEY in .env
 */

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
const MODEL = "gpt-4o-mini"

export async function openaiChat(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 4000
): Promise<string> {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error("OPENAI_API_KEY not set")

  const res = await fetch(OPENAI_API_URL, {
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
    throw new Error(`OpenAI API error: ${res.status} — ${err}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ""
}

export function isOpenAIAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY
}
