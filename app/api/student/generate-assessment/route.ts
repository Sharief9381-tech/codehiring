/**
 * POST /api/student/generate-assessment
 * Generates company-specific assessment questions.
 *
 * Uses real PYQ bank + company patterns directly (no vector index needed).
 * Each company's sections use ACTUAL topic distributions, question counts,
 * and difficulty levels from real hiring data.
 *
 * Body: {
 *   company:    string   — company id e.g. "tcs"
 *   section:    string   — section id e.g. "quantitative"
 *   count:      number   — number of questions
 *   topics?:    string[] — topic overrides (from live pattern API)
 *   difficulty? string   — difficulty override
 * }
 */

import { NextResponse } from "next/server"
import { generateQuestions } from "@/lib/question-gen"
import { ALL_COMPANIES } from "@/lib/companies-data"
import { QUESTION_BANK, type PYQ } from "@/lib/question-bank"

// ── Real company patterns — exact data from placement prep resources ──────────
// Each entry matches what students actually face in campus hiring
const COMPANY_PATTERNS: Record<string, {
  difficulty: string
  sections: Record<string, {
    name: string
    count: number
    difficulty: string
    topics: string[]
  }>
}> = {
  tcs: {
    difficulty: "Medium",
    sections: {
      "quantitative":      { name:"Numerical Ability",        count:20, difficulty:"Medium",     topics:["Percentages","Time & Work","Speed & Distance","Profit & Loss","Probability","Simple Interest","Number Series","Permutation & Combination","Averages","Ratio & Proportion"] },
      "advanced-aptitude": { name:"Reasoning Ability",        count:30, difficulty:"Medium",     topics:["Syllogisms","Blood Relations","Seating Arrangement","Coding-Decoding","Puzzles","Series Completion","Direction Sense","Analogy","Input-Output","Statement & Conclusion"] },
      "verbal":            { name:"Verbal Ability",            count:24, difficulty:"Easy-Medium",topics:["Synonyms","Antonyms","Fill in the Blanks","Error Detection","Sentence Completion","Para Jumbles","Reading Comprehension","Idioms & Phrases"] },
      "basic-coding":      { name:"Programming Logic (MCQ)",  count:10, difficulty:"Easy",       topics:["Loops","Arrays","Strings","Basic Math","Pattern Printing","Conditional Logic","Output-Based Questions"] },
      "advanced-coding":   { name:"Coding",                   count:1,  difficulty:"Medium",     topics:["Arrays","Strings","Basic Dynamic Programming","Recursion","Sorting","Hash Map","Two Pointers"] },
    },
  },
  infosys: {
    difficulty: "Medium",
    sections: {
      "quantitative":      { name:"Quantitative Aptitude", count:15, difficulty:"Medium",     topics:["Ratios","Averages","Mixtures","Algebra","Geometry","Probability","Time-Speed-Distance","Percentages","Data Interpretation"] },
      "advanced-aptitude": { name:"Logical Reasoning",     count:15, difficulty:"Medium",     topics:["Puzzles","Series Completion","Directions","Analogy","Data Interpretation","Pseudocode Analysis","Odd One Out","Clocks & Calendars"] },
      "verbal":            { name:"Verbal Ability",         count:20, difficulty:"Easy-Medium",topics:["Reading Comprehension","Grammar","Vocabulary","Error Correction","Para Completion","Sentence Rearrangement"] },
      "advanced-coding":   { name:"Coding",                 count:2,  difficulty:"Medium",     topics:["Arrays","Strings","Sorting","Dynamic Programming","Recursion","Trees","Hash Map","Stack","Queue"] },
    },
  },
  wipro: {
    difficulty: "Easy-Medium",
    sections: {
      "quantitative":      { name:"Aptitude",           count:16, difficulty:"Easy-Medium",topics:["Percentages","Simple & Compound Interest","Mensuration","Time & Distance","Permutation & Combination","Profit & Loss","Number System","Averages"] },
      "advanced-aptitude": { name:"Logical Reasoning",  count:14, difficulty:"Easy-Medium",topics:["Statement & Assumption","Course of Action","Analogy","Series Completion","Directions","Blood Relations","Coding-Decoding","Odd One Out"] },
      "verbal":            { name:"Verbal",              count:15, difficulty:"Easy",       topics:["Synonyms","Antonyms","Reading Comprehension","Fill in the Blanks","Error Correction","Sentence Improvement"] },
      "advanced-coding":   { name:"Coding",              count:1,  difficulty:"Easy-Medium",topics:["Arrays","Strings","Math Problems","Sorting","Recursion","Pattern Printing"] },
    },
  },
  cognizant: {
    difficulty: "Easy-Medium",
    sections: {
      "quantitative":      { name:"Aptitude + Reasoning + Verbal",count:24, difficulty:"Easy-Medium",topics:["Arithmetic","Algebra","Data Interpretation","Logical Reasoning","Grammar","Comprehension","HCF & LCM","Percentages","Time-Work-Distance"] },
      "advanced-aptitude": { name:"Technical MCQ",               count:20, difficulty:"Easy-Medium",topics:["C Programming","OOP Concepts","Data Structures","DBMS","Operating Systems","Networking","Algorithms","Python Basics"] },
      "advanced-coding":   { name:"Coding",                       count:2,  difficulty:"Easy-Medium",topics:["Arrays","Strings","Sorting","Hash Map","Basic Dynamic Programming","Stack","Queue","Recursion"] },
    },
  },
  capgemini: {
    difficulty: "Medium",
    sections: {
      "quantitative":      { name:"Quantitative Aptitude", count:16, difficulty:"Medium",     topics:["Number System","Averages","Time & Work","Mensuration","Algebra","Percentages","Ratio & Proportion","Simple Interest"] },
      "advanced-aptitude": { name:"Logical Reasoning",     count:10, difficulty:"Medium",     topics:["Series","Analogy","Odd One Out","Matrix Reasoning","Puzzles","Syllogisms","Coding-Decoding","Directions"] },
      "verbal":            { name:"Verbal Ability",         count:10, difficulty:"Easy",       topics:["Fill in the Blanks","Error Correction","Reading Comprehension","Synonyms","Antonyms","Para Jumbles"] },
      "basic-coding":      { name:"Pseudo Code",            count:5,  difficulty:"Easy",       topics:["Algorithm Tracing","Code Output Prediction","Array Logic","Loop Analysis","Function Output"] },
      "advanced-coding":   { name:"Coding",                 count:1,  difficulty:"Medium",     topics:["Binary Search","Sorting","Hash Map","Stack","Two Pointers","String Manipulation"] },
    },
  },
  accenture: {
    difficulty: "Medium",
    sections: {
      "quantitative":      { name:"Cognitive Ability",         count:50, difficulty:"Medium",     topics:["Percentages","Time & Work","Speed & Distance","Profit & Loss","Number Series","Averages","SI/CI","Ratios","Data Interpretation","Permutation & Combination"] },
      "advanced-aptitude": { name:"Cognitive & Technical",     count:40, difficulty:"Medium",     topics:["Syllogisms","Blood Relations","Seating Arrangement","Coding-Decoding","Pseudocode","C Output","OOP","DBMS","Networking","OS Concepts"] },
    },
  },
  hcl: {
    difficulty: "Easy-Medium",
    sections: {
      "quantitative":      { name:"Quantitative Ability",  count:15, difficulty:"Easy-Medium",topics:["Percentages","Time & Work","Speed & Distance","Averages","Number Series","Simple Interest","Profit & Loss","Ratio & Proportion"] },
      "advanced-aptitude": { name:"Logical Reasoning",     count:15, difficulty:"Easy-Medium",topics:["Blood Relations","Directions","Coding-Decoding","Series Completion","Analogies","Statement & Conclusion","Syllogisms","Puzzles"] },
      "verbal":            { name:"Verbal Ability",         count:15, difficulty:"Easy",       topics:["Synonyms","Antonyms","Fill in the Blanks","Reading Comprehension","Error Detection","Sentence Completion","Idioms & Phrases"] },
      "basic-coding":      { name:"Basic Programming MCQ", count:5,  difficulty:"Easy",       topics:["Loops","Arrays","String Operations","Basic Math","Pattern Printing","Conditional Logic"] },
      "advanced-coding":   { name:"Coding",                 count:1,  difficulty:"Easy-Medium",topics:["Arrays","Strings","Sorting","Basic Recursion","Math Problems","Hash Map"] },
    },
  },
  "tech-mahindra": {
    difficulty: "Easy",
    sections: {
      "quantitative":      { name:"Aptitude",           count:15, difficulty:"Easy",tops:["Percentages","Time & Work","Profit & Loss","Averages","Ratios","SI/CI","Number System"] } as any,
      "advanced-aptitude": { name:"Reasoning",          count:15, difficulty:"Easy",topics:["Series","Blood Relations","Directions","Coding-Decoding","Syllogisms","Analogy","Puzzles"] },
      "verbal":            { name:"Verbal",              count:15, difficulty:"Easy",topics:["Synonyms","Antonyms","Reading Comprehension","Error Correction","Fill in the Blanks"] },
      "advanced-coding":   { name:"Coding",              count:1,  difficulty:"Easy",topics:["Arrays","Strings","Basic Math","Loops","Sorting"] },
    },
  },
  deloitte: {
    difficulty: "Medium",
    sections: {
      "quantitative":      { name:"Aptitude",          count:15, difficulty:"Medium",     topics:["Percentages","Time & Work","Data Interpretation","Profit & Loss","Number Series","Ratios","Averages"] },
      "advanced-aptitude": { name:"Logical Reasoning", count:15, difficulty:"Medium",     topics:["Syllogisms","Puzzles","Blood Relations","Seating Arrangement","Coding-Decoding","Statement & Assumption","Data Sufficiency"] },
      "verbal":            { name:"Verbal Ability",    count:20, difficulty:"Easy-Medium",topics:["Reading Comprehension","Vocabulary","Grammar","Para Jumbles","Error Detection","Fill in the Blanks"] },
    },
  },
  amazon: {
    difficulty: "Hard",
    sections: {
      "advanced-coding": { name:"Coding Round",       count:2,  difficulty:"Hard",topics:["Arrays","Hash Map","Dynamic Programming","Graphs","Trees","Binary Search","Sliding Window","Stack","Two Pointers","Priority Queue"] },
      "logical":         { name:"Work Simulation",    count:7,  difficulty:"Medium",topics:["Leadership Principles","Situational Judgment","Behavioral Scenarios","Work Style Assessment","Problem Solving","Team Dynamics"] },
    },
  },
  microsoft: {
    difficulty: "Hard",
    sections: {
      "advanced-coding": { name:"Coding Assessment",  count:3,  difficulty:"Hard",topics:["Arrays","Graphs","Trees","Dynamic Programming","Binary Search","Hash Map","String Algorithms","Recursion","Two Pointers"] },
      "logical":         { name:"Problem Solving",    count:8,  difficulty:"Medium",topics:["Logical Reasoning","Pattern Recognition","Spatial Reasoning","Numerical Reasoning","Verbal Reasoning"] },
    },
  },
  google: {
    difficulty: "Very Hard",
    sections: {
      "advanced-coding": { name:"Coding Screen",      count:2,  difficulty:"Hard",topics:["Graphs","Dynamic Programming","Binary Search","Trees","Advanced Algorithms","Bit Manipulation","Mathematical Optimization","Segment Trees"] },
    },
  },
  adobe: {
    difficulty: "Hard",
    sections: {
      "advanced-coding": { name:"Coding Assessment",  count:3,  difficulty:"Hard",topics:["Arrays","Strings","Trees","Dynamic Programming","Graphs","Binary Search","Stack","Recursion"] },
      "logical":         { name:"Aptitude",           count:15, difficulty:"Medium",topics:["Logical Reasoning","Quantitative Aptitude","Data Interpretation","Verbal Ability"] },
    },
  },
  oracle: {
    difficulty: "Hard",
    sections: {
      "quantitative":    { name:"Aptitude",           count:20, difficulty:"Medium",topics:["Quantitative Aptitude","Data Interpretation","Number Series","Ratios","Time & Work","Percentages"] },
      "advanced-coding": { name:"Coding",             count:3,  difficulty:"Hard",topics:["Arrays","Trees","Dynamic Programming","Graphs","Hash Map","Binary Search","Stack","String Algorithms"] },
    },
  },
  atlassian: {
    difficulty: "Hard",
    sections: {
      "advanced-coding": { name:"Coding Assessment",  count:3,  difficulty:"Hard",topics:["Arrays","Hash Map","Graphs","Trees","Recursion","Dynamic Programming","Two Pointers"] },
      "logical":         { name:"Aptitude",           count:10, difficulty:"Medium",topics:["Logical Reasoning","Quantitative Aptitude","Verbal Ability","Pattern Recognition"] },
    },
  },
}

// ── Get company-specific PYQ examples as prompt context ──────────────────────
function getPYQContext(company: string, section: string): string {
  // Direct match
  let pyqs: PYQ[] = QUESTION_BANK[company]?.[section] ?? []

  // Section aliases — TCS logical = advanced-aptitude
  if (pyqs.length === 0 && section === "advanced-aptitude") {
    pyqs = QUESTION_BANK[company]?.["logical"] ?? QUESTION_BANK["tcs"]?.["logical"] ?? []
  }
  if (pyqs.length === 0 && section === "verbal") {
    pyqs = QUESTION_BANK[company]?.["verbal"] ?? QUESTION_BANK["tcs"]?.["verbal"] ?? []
  }
  if (pyqs.length === 0) {
    // Cross-company fallback for same section
    pyqs = QUESTION_BANK["tcs"]?.[section] ?? []
  }

  if (pyqs.length === 0) return ""

  const samples = [...pyqs].sort(() => Math.random() - 0.5).slice(0, 4)
  return `\nREAL PREVIOUS YEAR QUESTIONS FROM ${company.toUpperCase()} (style reference — do NOT copy verbatim):\n` +
    samples.map((q, i) =>
      `Q${i+1} [${q.year}, ${q.difficulty}, ${q.topic}]:\n${q.question}\n` +
      `Options: ${q.options.map((o,j)=>`${["A","B","C","D"][j]}) ${o}`).join(" | ")}\n` +
      `Correct: ${["A","B","C","D"][q.correct]} | Explanation: ${q.explanation}`
    ).join("\n\n") +
    `\n\nGenerate NEW questions of the SAME style, difficulty, and topic distribution. Fresh questions only - no repetition.`
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const company  = String(body.company  ?? "")
    const section  = String(body.section  ?? "")
    const liveTopics: string[] | undefined = body.topics?.length ? body.topics : undefined

    if (!company) return NextResponse.json({ error: "company required" }, { status: 400 })
    if (!section) return NextResponse.json({ error: "section required" }, { status: 400 })

    // Resolve company name
    const companyEntry = ALL_COMPANIES.find(c => c.id === company)
    const companyName  = companyEntry?.name ?? company.toUpperCase()

    // Get company-specific section pattern
    const companyPattern = COMPANY_PATTERNS[company]
    const sectionPattern = companyPattern?.sections[section]

    // Resolve count, difficulty, topics — company-specific first
    const defaultCount = sectionPattern?.count
      ?? (section.includes("coding") ? 2 : 12)
    const count = Math.min(Number(body.count ?? defaultCount), 50)

    const difficulty = String(body.difficulty ?? sectionPattern?.difficulty ?? companyPattern?.difficulty ?? "Medium")
    const topics     = liveTopics ?? sectionPattern?.topics ?? getDefaultTopics(section)
    const sectionName = sectionPattern?.name ?? getSectionName(section)

    // Build PYQ context for the AI prompt
    const pyqContext = getPYQContext(company, section)

    // Generate via pipeline — passes pyqContext as extra context
    const result = await generateQuestions({
      company,
      companyName,
      section,
      sectionName,
      count,
      difficulty,
      topics,
      liveTopics,
      pyqContext, // injected directly into prompt
    })

    return NextResponse.json({
      questions: result.questions,
      company:   result.company,
      section:   result.section,
      source:    result.source,
      model:     result.model,
      count:     result.questions.length,
      pattern:   sectionPattern ? { topics, difficulty, count } : undefined,
    })

  } catch (err: any) {
    console.error("generate-assessment error:", err)
    return NextResponse.json({ error: "Failed to generate questions", detail: err.message }, { status: 500 })
  }
}

function getSectionName(section: string): string {
  const map: Record<string, string> = {
    "quantitative":      "Quantitative Aptitude",
    "advanced-aptitude": "Logical Reasoning",
    "verbal":            "Verbal Ability",
    "basic-coding":      "Basic Coding",
    "advanced-coding":   "Advanced Coding",
    "logical":           "Logical Reasoning",
    "coding":            "Coding",
  }
  return map[section] ?? section
}

function getDefaultTopics(section: string): string[] {
  const map: Record<string, string[]> = {
    "quantitative":      ["Percentages","Time & Work","Speed & Distance","Averages","Number Series","Profit & Loss","Probability"],
    "advanced-aptitude": ["Syllogisms","Blood Relations","Seating Arrangement","Coding-Decoding","Puzzles","Directions","Series"],
    "verbal":            ["Reading Comprehension","Vocabulary","Grammar","Para Jumbles","Error Detection","Idioms & Phrases"],
    "basic-coding":      ["Arrays","Strings","Basic Math","Pattern Printing","Loops","Conditional Logic"],
    "advanced-coding":   ["Binary Search","Hash Map","Sliding Window","Trees","Dynamic Programming","Graphs","Stack"],
    "logical":           ["Syllogisms","Blood Relations","Directions","Series","Analogies","Coding-Decoding"],
    "coding":            ["Arrays","Strings","Sorting","Recursion","Hash Map","Two Pointers"],
  }
  return map[section] ?? ["General"]
}
