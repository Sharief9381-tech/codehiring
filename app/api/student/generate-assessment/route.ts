/**
 * POST /api/student/generate-assessment
 * Body: { company: string, section: string, count: number }
 * Generates real assessment questions via Groq for a specific company pattern.
 */
import { NextResponse } from "next/server"
import { getPYQContext } from "@/lib/question-bank"

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions"

const COMPANY_PATTERNS: Record<string, any> = {
  tcs: {
    name: "TCS NQT",
    sections: {
      quantitative: { name: "Quantitative Aptitude", topics: ["Percentages", "Profit & Loss", "Time & Work", "Speed & Distance", "Probability", "Number Series"], difficulty: "Medium" },
      logical: { name: "Logical Reasoning", topics: ["Syllogisms", "Blood Relations", "Seating Arrangement", "Coding-Decoding", "Data Sufficiency"], difficulty: "Medium" },
      verbal: { name: "Verbal Ability", topics: ["Reading Comprehension", "Sentence Correction", "Fill in the Blanks", "Para Jumbles", "Vocabulary"], difficulty: "Easy-Medium" },
      coding: { name: "Basic Coding", topics: ["Simple loops", "Arrays", "String manipulation", "Basic math"], difficulty: "Easy", lang: "Any" },
    },
  },
  infosys: {
    name: "Infosys InfyTQ",
    sections: {
      quantitative: { name: "Quantitative Aptitude", topics: ["Ratios", "Averages", "Mixtures", "Algebra", "Geometry"], difficulty: "Medium" },
      logical: { name: "Logical Reasoning", topics: ["Puzzles", "Series Completion", "Directions", "Analogy"], difficulty: "Medium" },
      verbal: { name: "Verbal Ability", topics: ["Error Detection", "Idioms", "Comprehension", "Word Meaning"], difficulty: "Medium" },
      coding: { name: "Coding", topics: ["Sorting", "String ops", "Basic DP", "Recursion"], difficulty: "Medium", lang: "Java/Python" },
    },
  },
  wipro: {
    name: "Wipro NLTH",
    sections: {
      quantitative: { name: "Quantitative", topics: ["Simple Interest", "Permutation & Combination", "Mensuration", "Time & Distance"], difficulty: "Easy-Medium" },
      logical: { name: "Logical", topics: ["Visual Reasoning", "Statement & Assumption", "Course of Action"], difficulty: "Easy-Medium" },
      verbal: { name: "English", topics: ["Synonyms/Antonyms", "Sentence Rearrangement", "Cloze Test"], difficulty: "Easy" },
      coding: { name: "Coding", topics: ["Patterns", "Arrays", "Math"], difficulty: "Easy", lang: "Any" },
    },
  },
  accenture: {
    name: "Accenture Cognitive",
    sections: {
      quantitative: { name: "Quantitative", topics: ["Data Interpretation", "Number Systems", "Profit/Loss", "Ages"], difficulty: "Medium" },
      logical: { name: "Analytical", topics: ["Critical Reasoning", "Logical Deduction", "Input-Output"], difficulty: "Medium" },
      verbal: { name: "Verbal", topics: ["Reading Comprehension", "Grammar", "Vocabulary"], difficulty: "Medium" },
      coding: { name: "Coding", topics: ["Arrays", "Strings", "Linked Lists"], difficulty: "Medium", lang: "C++/Java/Python" },
    },
  },
  amazon: {
    name: "Amazon OA",
    sections: {
      coding: { name: "Coding Assessment", topics: ["Arrays & Hashing", "Two Pointers", "Sliding Window", "Binary Search", "Graphs", "DP"], difficulty: "Hard" },
      logical: { name: "Work Style Survey", topics: ["Leadership Principles", "Situational Judgment", "Behavioral"], difficulty: "N/A" },
    },
  },
  google: {
    name: "Google Coding Screen",
    sections: {
      coding: { name: "Coding Interview", topics: ["Graph traversal", "Dynamic Programming", "System Design", "String manipulation", "Tree algorithms"], difficulty: "Very Hard" },
    },
  },
  microsoft: {
    name: "Microsoft OA",
    sections: {
      coding: { name: "Coding Assessment", topics: ["Arrays", "Binary Trees", "Dynamic Programming", "Recursion", "OOP Design"], difficulty: "Hard" },
      logical: { name: "Cognitive", topics: ["Abstract Reasoning", "Logical Sequences", "Problem Solving"], difficulty: "Medium" },
    },
  },
  cognizant: {
    name: "Cognizant GenC",
    sections: {
      quantitative: { name: "Quantitative Aptitude", topics: ["Arithmetic", "Algebra", "Data Interpretation"], difficulty: "Easy-Medium" },
      logical: { name: "Reasoning", topics: ["Puzzles", "Sequences", "Directions"], difficulty: "Easy" },
      verbal: { name: "English", topics: ["Grammar", "Comprehension", "Vocabulary"], difficulty: "Easy" },
      coding: { name: "Coding", topics: ["Basic programs", "String operations", "Array manipulation"], difficulty: "Easy", lang: "Any" },
    },
  },
  capgemini: {
    name: "Capgemini Test",
    sections: {
      quantitative: { name: "Quantitative", topics: ["Number System", "Averages", "Time-Work", "Mensuration"], difficulty: "Medium" },
      logical: { name: "Reasoning", topics: ["Series", "Analogy", "Odd One Out", "Matrix"], difficulty: "Medium" },
      verbal: { name: "Verbal", topics: ["Fill Blanks", "Error Correction", "Reading"], difficulty: "Easy" },
      coding: { name: "Pseudo Code", topics: ["Algorithm output tracing", "Code completion"], difficulty: "Medium" },
    },
  },
  deloitte: {
    name: "Deloitte Assessment",
    sections: {
      quantitative: { name: "Numerical Reasoning", topics: ["Data Tables", "Charts", "Business Math"], difficulty: "Medium" },
      logical: { name: "Logical Reasoning", topics: ["Deductive", "Inductive", "Abstract patterns"], difficulty: "Medium" },
      verbal: { name: "Verbal Reasoning", topics: ["Comprehension", "Critical Reasoning"], difficulty: "Medium" },
    },
  },
}

export async function POST(req: Request) {
  let company = "", section = "", count = 5
  try {
    const body = await req.json()
    company = body.company ?? ""
    section = body.section ?? ""
    count   = body.count ?? 5

    const pattern = COMPANY_PATTERNS[company]
    if (!pattern) return NextResponse.json({ error: "Unknown company" }, { status: 400 })

    const sectionData = pattern.sections[section]
    if (!sectionData) return NextResponse.json({ error: "Unknown section" }, { status: 400 })

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ questions: getFallbackQuestions(company, section, count) })
    }

    // ── Step 1: Try live web scraping first ───────────────────────────────────
    try {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
      const scrapeRes = await fetch(`${baseUrl}/api/student/scrape-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, section, count }),
        signal: AbortSignal.timeout(15000),
      })
      if (scrapeRes.ok) {
        const scrapeData = await scrapeRes.json()
        if (scrapeData.questions?.length >= count) {
          return NextResponse.json({
            questions: scrapeData.questions,
            company: pattern.name,
            section: sectionData.name,
            source: "scraped",
          })
        }
        // Partial scrape — use what we got and generate the rest
        if (scrapeData.questions?.length > 0) {
        }
      }
    } catch (scrapeErr) {
    }

    // ── Step 2: Groq generation with PYQ context ──────────────────────────────
    const isCoding = section === "coding"
    const topicsList = sectionData.topics.join(", ")
    const pyqContext = getPYQContext(company, section, 5)

    const prompt = isCoding
      ? `You are creating a ${pattern.name} coding assessment based on real previous year patterns.

${pyqContext}

Company: ${pattern.name}
Topics: ${topicsList}
Difficulty: ${sectionData.difficulty}

Rules:
- Each problem must feel like a REAL ${pattern.name} OA question
- Include problem statement, constraints, example input/output
- Match difficulty exactly: ${sectionData.difficulty}
- Create NEW problems inspired by the previous year patterns above — do NOT repeat them

Return ONLY valid JSON array (no markdown, no explanation):
[
  {
    "id": 1,
    "title": "Problem title",
    "difficulty": "${sectionData.difficulty}",
    "statement": "Full problem statement with constraints...",
    "constraints": "1 ≤ n ≤ 10^5, etc.",
    "example": { "input": "...", "output": "...", "explanation": "..." },
    "hints": ["hint 1", "hint 2"],
    "topic": "topic name"
  }
]`
      : `You are creating a ${pattern.name} ${sectionData.name} test based on real previous year question patterns.

${pyqContext}

Company: ${pattern.name}
Section: ${sectionData.name}
Topics to cover: ${topicsList}
Difficulty: ${sectionData.difficulty}
Count needed: ${count}

Rules:
- Questions must feel like REAL ${pattern.name} exam questions — study the PYQ style above carefully
- Match the same difficulty, topic distribution, and question style as the PYQs
- Each question has exactly 4 options (A,B,C,D) with one correct answer
- Include detailed step-by-step explanation for the correct answer (like the PYQs above)
- Cover different topics from the list above
- Create NEW questions inspired by the PYQ patterns — do NOT repeat them verbatim

Return ONLY valid JSON array (no markdown, no explanation):
[
  {
    "id": 1,
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Step-by-step explanation showing how to arrive at the correct answer",
    "topic": "topic name",
    "difficulty": "${sectionData.difficulty}"
  }
]`

    const res = await fetch(GROQ_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 6000,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("Groq API error:", res.status, errText)
      return NextResponse.json({ questions: getFallbackQuestions(company, section, count) })
    }

    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content?.trim() ?? ""
    const json = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()

    try {
      const parsed = JSON.parse(json)
      const questions = Array.isArray(parsed) ? parsed : parsed.questions ?? parsed
      if (!Array.isArray(questions) || questions.length === 0) throw new Error("No questions array")
      return NextResponse.json({ questions, company: pattern.name, section: sectionData.name })
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr, "raw:", raw.slice(0, 300))
      return NextResponse.json({ questions: getFallbackQuestions(company, section, count) })
    }
  } catch (err) {
    console.error("generate-assessment error:", err)
    return NextResponse.json({ questions: getFallbackQuestions(company, section, count) })
  }
}

function getFallbackQuestions(company: string, section: string, count: number) {
  // Import question bank and return real PYQs as fallback
  const { QUESTION_BANK } = require("@/lib/question-bank")
  const bank = QUESTION_BANK[company]?.[section] ?? QUESTION_BANK["tcs"]?.[section] ?? []

  if (bank.length > 0) {
    // Shuffle and return requested count of real PYQs
    const shuffled = [...bank].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, shuffled.length)).map((q: any, i: number) => ({
      ...q,
      id: i + 1,
    }))
  }

  const isCoding = section === "coding"
  if (isCoding) {
    return Array.from({ length: Math.min(count, 2) }, (_, i) => ({
      id: i + 1,
      title: i === 0 ? "Two Sum" : "Reverse String",
      difficulty: "Medium",
      statement: i === 0
        ? "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
        : "Write a function that reverses a string.",
      constraints: "1 ≤ nums.length ≤ 10^4",
      example: { input: i === 0 ? "nums = [2,7,11,15], target = 9" : 's = ["h","e","l","l","o"]', output: i === 0 ? "[0,1]" : '["o","l","l","e","h"]', explanation: "" },
      hints: ["Think about using a hash map"],
      topic: i === 0 ? "Arrays & Hashing" : "Two Pointers",
    }))
  }
  return Array.from({ length: Math.min(count, 3) }, (_, i) => ({
    id: i + 1,
    question: ["A train travels 360 km in 4 hrs. Speed in m/s?", "20% of a number is 80. Find 35%.", "Next: 2,6,12,20,30,?"][i],
    options: [["25 m/s","20 m/s","30 m/s","15 m/s"],["120","140","160","180"],["40","42","44","46"]][i],
    correct: [0,1,1][i],
    explanation: ["Speed=360/4=90km/h=25m/s","80/0.2=400;400×0.35=140","n(n+1): 30+12=42"][i],
    topic: ["Speed & Distance","Percentages","Number Series"][i],
    difficulty: "Medium",
  }))
}
