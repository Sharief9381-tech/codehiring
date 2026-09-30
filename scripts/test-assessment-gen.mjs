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
const MODEL = "qwen/qwen3.8-27b"

const prompt = `Generate 3 MCQ questions for Xoriant Quantitative Aptitude test.
Topics: Percentages, Time & Work, Speed & Distance
Difficulty: Easy-Medium

Return ONLY valid JSON array:
[{"id":1,"question":"...","options":["A","B","C","D"],"correct":0,"explanation":"...","topic":"...","difficulty":"Easy-Medium"}]`

const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({ model: MODEL, messages: [{ role: "user", content: prompt }], max_tokens: 1000, temperature: 0.7 }),
  signal: AbortSignal.timeout(30000),
})
const d = await res.json()
const text = d.choices?.[0]?.message?.content?.trim()
console.log("Status:", res.status)
console.log("Response:", text?.slice(0, 500))
if (text) {
  try {
    const cleaned = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
    const parsed = JSON.parse(cleaned)
    console.log("\n✅ Parsed", parsed.length, "questions")
    console.log("Q1:", parsed[0]?.question?.slice(0, 60))
  } catch (e) { console.log("Parse error:", e.message) }
}
