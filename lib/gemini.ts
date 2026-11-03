/**
 * Google Gemini AI client — key rotation support
 * Tries GEMINI_API_KEY first, falls back to GEMINI_API_KEY_2 on quota/error
 */

const GEMINI_MODEL = "gemini-3.5-flash"
const GEMINI_BASE  = "https://generativelanguage.googleapis.com/v1beta/models"

export async function geminiChat(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  maxTokens = 1000,
  temperature = 0.7
): Promise<string> {
  const keys = [
    process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].filter(Boolean) as string[]

  if (keys.length === 0) throw new Error("No GEMINI_API_KEY set")

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
    generationConfig: { maxOutputTokens: maxTokens, temperature },
  }
  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] }
  }

  let lastError: Error = new Error("No keys tried")

  for (const key of keys) {
    try {
      const res = await fetch(`${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(25000),
      })

      if (!res.ok) {
        const err = await res.text().catch(() => "")
        // On quota/rate limit try next key
        if (res.status === 429 || res.status === 403) {
          lastError = new Error(`Gemini ${res.status} (key rotated)`)
          continue
        }
        throw new Error(`Gemini ${res.status}: ${err.slice(0, 200)}`)
      }

      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ""
      if (!text) throw new Error("Gemini returned empty response")
      return text
    } catch (e: any) {
      lastError = e
      // Try next key on network/timeout errors too
    }
  }

  throw lastError
}
