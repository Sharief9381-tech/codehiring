/**
 * Prompt Builder for Question Generation
 * Builds structured, type-specific prompts with RAG context injected.
 */

import type { QuestionRequest, RetrievedContext } from "./types"

// ── Format retrieved PYQs as context ─────────────────────────────────────────
function formatPYQContext(pyqs: any[]): string {
  if (!pyqs.length) return ""
  const examples = pyqs
    .filter(q => q.question)
    .slice(0, 5)
    .map((q, i) =>
      `Example ${i + 1} [${q.topic ?? "General"}, ${q.difficulty ?? "Medium"}]:\n` +
      `Q: ${q.question}\n` +
      (q.options ? `Options: ${q.options.join(" | ")}\n` : "") +
      (q.correct !== undefined ? `Answer: ${["A","B","C","D"][q.correct]}\n` : "")
    )
    .join("\n")
  return examples ? `REFERENCE QUESTIONS (style guide only — do NOT copy):\n${examples}` : ""
}

// ── Format pattern context ────────────────────────────────────────────────────
function formatPatternContext(patterns: any[]): string {
  if (!patterns.length) return ""
  const p = patterns[0]
  const lines = [
    p.notes ? `Exam notes: ${p.notes}` : "",
    p.topics?.length ? `Key topics tested: ${p.topics.join(", ")}` : "",
    p.difficulty ? `Difficulty level: ${p.difficulty}` : "",
  ].filter(Boolean)
  return lines.length ? `EXAM PATTERN CONTEXT:\n${lines.join("\n")}` : ""
}

// ── System prompt: CodeHiring QGen identity ───────────────────────────────────
function buildSystemPrompt(type: string): string {
  const identity = `You are CodeHiring QGen v1 — a specialized AI for generating authentic Indian campus placement test questions.
Your ONLY job is to generate high-quality ${type} questions that match real company exam patterns.`

  const rules = {
    aptitude: `
APTITUDE QUESTION RULES:
- Questions must match the exact style and difficulty of real Indian campus placement tests
- Topics must come from the provided list only
- Each question must be unique, solvable in 1-2 minutes
- Options must be plausible — avoid obviously wrong choices
- Explanation must show the exact calculation step-by-step
- Do NOT generate questions that require external data or tables unless provided`,

    communication: `
COMMUNICATION QUESTION RULES:
- Grammar questions must test practical English usage
- Vocabulary questions use Indian university level words
- Reading comprehension: provide a passage of 80-120 words, then ask 2-3 questions about it
- Para jumbles: provide exactly 5 sentences that form a coherent paragraph
- Error detection: underline the error in one of 4 parts of a sentence
- All questions must be solvable without external knowledge`,

    coding: `
CODING PROBLEM RULES:
- Problem statement must be clear and unambiguous
- Constraints must be specific numbers (e.g. 1 <= n <= 10^5)
- Example input MUST be plain numbers only — NO variable names, NO brackets
  GOOD: "2 7 11 15\\n9"   BAD: "nums=[2,7,11,15], target=9"
  GOOD: "5\\n1 2 3 4 5"   BAD: "[1,2,3,4,5]"
- Example output must exactly match what stdout should print
- Hints must be algorithmic (time complexity hints, approach hints)
- Each problem must have a unique title that describes the algorithm`,
  }

  return `${identity}\n${rules[type as keyof typeof rules] ?? rules.aptitude}`
}

// ── User prompt for aptitude/communication MCQ ────────────────────────────────
function buildMCQPrompt(req: QuestionRequest, ctx: RetrievedContext): string {
  const pyqCtx     = formatPYQContext([...ctx.pyqs, ...ctx.staticSamples])
  const patternCtx = formatPatternContext(ctx.patterns)

  return `Generate ${req.count} ${req.sectionName} MCQ questions for ${req.companyName} assessment.

${patternCtx}
${pyqCtx}

GENERATION PARAMETERS:
- Company: ${req.companyName}
- Section: ${req.sectionName}
- Topics: ${(req.liveTopics ?? req.topics).join(", ")}
- Difficulty: ${req.difficulty}
- Count: ${req.count}

OUTPUT FORMAT — Return ONLY this valid JSON array, nothing else:
[
  {
    "id": 1,
    "question": "complete question text",
    "options": ["option A", "option B", "option C", "option D"],
    "correct": 0,
    "explanation": "step-by-step solution",
    "topic": "topic name from the list above",
    "difficulty": "${req.difficulty}"
  }
]

IMPORTANT: Generate EXACTLY ${req.count} questions. Each must be unique. Return ONLY the JSON array.`
}

// ── User prompt for verbal/communication (may include passages) ───────────────
function buildVerbalPrompt(req: QuestionRequest, ctx: RetrievedContext): string {
  const pyqCtx     = formatPYQContext([...ctx.pyqs, ...ctx.staticSamples])
  const patternCtx = formatPatternContext(ctx.patterns)

  return `Generate ${req.count} Verbal Ability / Communication questions for ${req.companyName} assessment.

${patternCtx}
${pyqCtx}

GENERATION PARAMETERS:
- Company: ${req.companyName}
- Topics: ${(req.liveTopics ?? req.topics).join(", ")}
- Difficulty: ${req.difficulty}
- Count: ${req.count}

Mix the question types across the topics. For Reading Comprehension questions, include a "passage" field.

OUTPUT FORMAT — Return ONLY this valid JSON array:
[
  {
    "id": 1,
    "question": "question text",
    "passage": "short passage (only for reading comprehension, else omit this field)",
    "options": ["option A", "option B", "option C", "option D"],
    "correct": 0,
    "explanation": "explanation",
    "topic": "topic name",
    "difficulty": "${req.difficulty}"
  }
]

Return ONLY the JSON array. No markdown, no explanation text.`
}

// ── User prompt for coding problems ──────────────────────────────────────────
function buildCodingPrompt(req: QuestionRequest, ctx: RetrievedContext): string {
  const pyqCtx     = formatPYQContext(ctx.pyqs)
  const patternCtx = formatPatternContext(ctx.patterns)

  return `Generate ${req.count} coding problem(s) for ${req.companyName} ${req.sectionName}.

${patternCtx}
${pyqCtx}

GENERATION PARAMETERS:
- Company: ${req.companyName}
- Section: ${req.sectionName}
- Topics: ${(req.liveTopics ?? req.topics).join(", ")}
- Difficulty: ${req.difficulty}
- Count: ${req.count}

CRITICAL: example.input must be PLAIN NUMBERS ONLY (stdin format):
  CORRECT: "2 7 11 15\\n9"       (array on line 1, target on line 2)
  CORRECT: "5\\n1 3 2 4 6"       (n on line 1, array on line 2)
  WRONG:   "nums=[2,7,11,15]"    (never use variable names)
  WRONG:   "[1,2,3,4]"           (never use brackets)

OUTPUT FORMAT — Return ONLY this valid JSON array:
[
  {
    "id": 1,
    "title": "Problem Title",
    "difficulty": "${req.difficulty}",
    "statement": "full problem statement with context",
    "constraints": "1 <= n <= 10^4, specific constraint",
    "example": {
      "input": "plain numbers stdin e.g. 4\\n2 7 11 15\\n9",
      "output": "exact stdout output e.g. 0 1",
      "explanation": "brief explanation"
    },
    "hints": ["algorithmic hint 1", "complexity hint"],
    "topic": "topic name"
  }
]

Return ONLY the JSON array.`
}

// ── Main export ───────────────────────────────────────────────────────────────
export function buildPrompts(req: QuestionRequest, ctx: RetrievedContext): {
  system: string
  user:   string
} {
  const type = req.type

  const system = buildSystemPrompt(type)
  let user: string

  if (type === "coding") {
    user = buildCodingPrompt(req, ctx)
  } else if (type === "communication" || req.section === "verbal") {
    user = buildVerbalPrompt(req, ctx)
  } else {
    user = buildMCQPrompt(req, ctx)
  }

  return { system, user }
}
