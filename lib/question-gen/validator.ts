/**
 * Output Validator for Question Generation
 * Parses LLM output, validates schema, deduplicates, fills missing fields.
 */

import type { MCQQuestion, CodingQuestion, GeneratedQuestion, QuestionRequest } from "./types"

// ── Strip think tags (qwen model adds these sometimes) ────────────────────────
export function stripThinkTags(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim()
}

// ── Extract JSON from LLM output (handles markdown code blocks) ───────────────
export function extractJSON(raw: string): string {
  const cleaned = stripThinkTags(raw)
  // Strip markdown code fences
  const stripped = cleaned
    .replace(/^```(?:json)?\s*/im, "")
    .replace(/\s*```\s*$/im, "")
    .trim()

  // Find the JSON array
  const startIdx = stripped.indexOf("[")
  const endIdx   = stripped.lastIndexOf("]")
  if (startIdx !== -1 && endIdx > startIdx) {
    return stripped.slice(startIdx, endIdx + 1)
  }
  return stripped
}

// ── Validate and normalize a single MCQ question ──────────────────────────────
function validateMCQ(q: any, idx: number, req: QuestionRequest): MCQQuestion | null {
  if (!q || typeof q !== "object") return null
  if (!q.question || typeof q.question !== "string" || q.question.trim().length < 10) return null
  if (!Array.isArray(q.options) || q.options.length < 2) return null

  // Normalize options to exactly 4
  const options = q.options.slice(0, 4).map((o: any) => String(o ?? "").trim())
  while (options.length < 4) options.push(`Option ${options.length + 1}`)

  // Normalize correct index
  let correct = Number(q.correct ?? 0)
  if (isNaN(correct) || correct < 0 || correct >= options.length) correct = 0

  return {
    id:          idx + 1,
    question:    q.question.trim(),
    options,
    correct,
    explanation: q.explanation ?? "See solution.",
    topic:       q.topic ?? req.topics[0] ?? req.sectionName,
    difficulty:  q.difficulty ?? req.difficulty,
    ...(q.passage ? { passage: String(q.passage) } : {}),
  }
}

// ── Validate and normalize a coding question ──────────────────────────────────
function validateCoding(q: any, idx: number, req: QuestionRequest): CodingQuestion | null {
  if (!q || typeof q !== "object") return null
  if (!q.title || !q.statement) return null

  // Clean stdin input (remove variable names, brackets)
  const cleanStdin = (s: string): string => {
    if (!s) return ""
    if (/^[\d\s\-+.\n]+$/.test(s.trim())) return s.trim()
    // Extract numbers from arrays like [2,7,11,15]
    const arrays = s.match(/\[([^\]]*)\]/g)
    const parts: string[] = []
    if (arrays) {
      for (const arr of arrays) {
        const nums = arr.replace(/[\[\]]/g, "").split(",").map((x: string) => x.trim()).filter(Boolean)
        parts.push(nums.join(" "))
      }
    }
    const standalones = s.replace(/\[([^\]]*)\]/g, "").match(/-?\d+(\.\d+)?/g)
    if (standalones) parts.push(...standalones)
    return parts.join("\n").trim() || s.trim()
  }

  const example = q.example ?? q.examples?.[0] ?? {}

  return {
    id:          idx + 1,
    title:       q.title.trim(),
    difficulty:  q.difficulty ?? req.difficulty,
    statement:   q.statement.trim(),
    constraints: q.constraints ?? "1 <= n <= 10^4",
    example: {
      input:       cleanStdin(example.input ?? example.stdin ?? ""),
      output:      String(example.output ?? example.expected ?? "").trim(),
      explanation: example.explanation ?? "",
    },
    hints:  Array.isArray(q.hints) ? q.hints.slice(0, 3) : [],
    topic:  q.topic ?? req.topics[0] ?? "Algorithms",
  }
}

// ── Deduplicate by question text / title ──────────────────────────────────────
function deduplicate(questions: GeneratedQuestion[]): GeneratedQuestion[] {
  const seen = new Set<string>()
  return questions.filter(q => {
    const key = ("question" in q ? q.question : q.title).toLowerCase().slice(0, 50)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ── Main validator ────────────────────────────────────────────────────────────
export function validateOutput(
  raw: string,
  req: QuestionRequest
): GeneratedQuestion[] {
  try {
    const json    = extractJSON(raw)
    const parsed  = JSON.parse(json)
    const arr     = Array.isArray(parsed) ? parsed : (parsed.questions ?? [])

    const validated: GeneratedQuestion[] = []

    for (let i = 0; i < arr.length; i++) {
      const q = arr[i]
      if (req.type === "coding") {
        const v = validateCoding(q, validated.length, req)
        if (v) validated.push(v)
      } else {
        const v = validateMCQ(q, validated.length, req)
        if (v) validated.push(v)
      }
    }

    const deduped = deduplicate(validated)
    return deduped.slice(0, req.count)
  } catch {
    return []
  }
}
