/**
 * Google Gemini AI client
 * Uses the Gemini 2.0 Flash model via the Generative Language REST API.
 * Set GEMINI_API_KEY or GOOGLE_API_KEY in your environment.
 */

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

export async function geminiChat(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  maxTokens = 1000,
  temperature = 0.7
): Promise<string> {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!key) throw new Error("No GEMINI_API_KEY set")

  // Convert messages to Gemini format
  // System messages become a system instruction; user/assistant alternate as contents
  let systemInstruction: string | undefined
  const contents: { role: string; parts: { text: string }[] }[] = []

  for (const msg of messages) {
    if (msg.role === "system") {
      systemInstruction = msg.content
    } else {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })
    }
  }

  const body: any = {
    contents,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature,
    },
  }

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] }
  }

  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25000),
  })

  if (!res.ok) {
    const err = await res.text().catch(() => "")
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 200)}`)
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ""
  if (!text) throw new Error("Gemini returned empty response")
  return text
}
