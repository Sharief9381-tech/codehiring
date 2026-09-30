import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(join(__dirname, "../.env"), "utf8")
for (const line of env.split("\n")) {
  const eq = line.indexOf("="); if (eq < 0 || line.trim().startsWith("#")) continue
  const k = line.slice(0, eq).trim(), v = line.slice(eq + 1).trim()
  if (k && !process.env[k]) process.env[k] = v
}

const GROQ_KEY = process.env.GROQ_API_KEY
const models = ["openai/gpt-oss-20b", "openai/gpt-oss-120b", "qwen/qwen3.8-27b"]

for (const model of models) {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: 'Return only this JSON: [{"id":1,"question":"What is 2+2?","options":["3","4","5","6"],"correct":1}]' }],
        max_tokens: 100, temperature: 0.1,
      }),
      signal: AbortSignal.timeout(15000),
    })
    const d = await res.json()
    const text = d.choices?.[0]?.message?.content?.trim()
    console.log(`${model}: HTTP ${res.status} | ${text ? text.slice(0, 80) : JSON.stringify(d.error?.message ?? d).slice(0, 80)}`)
  } catch (e) {
    console.log(`${model}: ERROR - ${e.message}`)
  }
}
