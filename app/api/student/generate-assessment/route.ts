/**
 * POST /api/student/generate-assessment
 * Body: { company: string, section: string, count: number }
 * Generates real assessment questions via OpenAI (GPT-4o-mini) with Groq fallback.
 */
import { NextResponse } from "next/server"
import { getPYQContext } from "@/lib/question-bank"

const GROQ_API    = "https://api.groq.com/openai/v1/chat/completions"
const OPENAI_API  = "https://api.openai.com/v1/chat/completions"

async function callAI(prompt: string, maxTokens = 6000): Promise<string> {
  // Try OpenAI first
  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch(OPENAI_API, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: maxTokens,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const content = data.choices?.[0]?.message?.content?.trim() ?? ""
        if (content) return content
      }
    } catch {}
  }

  // Fallback to Groq
  if (process.env.GROQ_API_KEY) {
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
        max_tokens: maxTokens,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      return data.choices?.[0]?.message?.content?.trim() ?? ""
    }
  }

  throw new Error("No AI provider available")
}

import { ALL_COMPANIES } from "@/lib/companies-data"

// Build company patterns dynamically from ALL_COMPANIES + specific overrides
function buildCompanyPattern(companyId: string) {
  const co = ALL_COMPANIES.find(c => c.id === companyId)
  if (!co) return null

  // Category-level defaults
  const catDefaults: Record<string, any> = {
    "IT Services": {
      quantitative: { topics: ["Percentages","Profit & Loss","Time & Work","Speed & Distance","Number Series","Averages"], difficulty: "Medium" },
      logical: { topics: ["Syllogisms","Blood Relations","Seating Arrangement","Coding-Decoding","Series Completion","Directions"], difficulty: "Medium" },
      verbal: { topics: ["Reading Comprehension","Sentence Correction","Fill in the Blanks","Para Jumbles","Vocabulary"], difficulty: "Easy-Medium" },
      coding: { topics: ["Arrays","Strings","Sorting","Recursion","Basic DP","Math Problems"], difficulty: "Easy-Medium", lang: "Any" },
    },
    "Product": {
      coding: { topics: ["Arrays & Hashing","Two Pointers","Sliding Window","Binary Search","Trees","Graphs","Dynamic Programming","Stack & Queue"], difficulty: "Hard", lang: "Any" },
      logical: { topics: ["Problem Solving","Abstract Reasoning","Algorithmic Thinking","Pattern Recognition"], difficulty: "Medium" },
      quantitative: { topics: ["Number Theory","Probability","Statistics","Algebra","Data Interpretation"], difficulty: "Hard" },
    },
    "Startups": {
      coding: { topics: ["Arrays","Strings","Hash Maps","Trees","Graphs","System Design","Greedy","DP"], difficulty: "Hard", lang: "Any" },
      logical: { topics: ["Problem Solving","Abstract Reasoning","Critical Thinking","Situational Judgment"], difficulty: "Medium" },
      quantitative: { topics: ["Data Interpretation","Business Math","Probability","Statistics"], difficulty: "Medium" },
      verbal: { topics: ["Communication","Reading Comprehension","Grammar","Vocabulary"], difficulty: "Medium" },
    },
    "Consulting": {
      quantitative: { topics: ["Data Tables","Charts & Graphs","Business Math","Percentages","Ratios","Market Sizing"], difficulty: "Medium-Hard" },
      logical: { topics: ["Deductive Reasoning","Inductive Reasoning","Abstract Patterns","Syllogisms","Critical Reasoning"], difficulty: "Medium-Hard" },
      verbal: { topics: ["Reading Comprehension","True/False/Cannot Say","Grammar","Vocabulary","Sentence Completion"], difficulty: "Medium" },
      coding: { topics: ["Basic Algorithms","Data Structures","SQL","Python Scripting","Statistical Computing"], difficulty: "Medium", lang: "Python/R" },
    },
    "BFSI": {
      quantitative: { topics: ["Financial Math","Data Interpretation","Statistics","Probability","Algebra"], difficulty: "Medium" },
      logical: { topics: ["Logical Deduction","Seating Arrangement","Blood Relations","Puzzles","Critical Reasoning"], difficulty: "Medium" },
      verbal: { topics: ["Reading Comprehension","Grammar","Vocabulary","Error Detection","Para Jumbles"], difficulty: "Medium" },
      coding: { topics: ["Arrays","Dynamic Programming","Graphs","String Manipulation","System Design","Database Concepts"], difficulty: "Hard", lang: "Java/Python" },
    },
    "Core Engg": {
      quantitative: { topics: ["Engineering Math","Mechanics","Thermodynamics Basics","Electrical Circuits","Data Interpretation"], difficulty: "Medium" },
      logical: { topics: ["Technical Reasoning","Spatial Reasoning","Abstract Patterns","Mechanical Reasoning","Series"], difficulty: "Medium" },
      verbal: { topics: ["Technical English","Reading Comprehension","Vocabulary","Grammar"], difficulty: "Easy" },
      coding: { topics: ["C Programming","Data Structures","Algorithms","Embedded Systems","System Programming"], difficulty: "Medium", lang: "C/C++" },
    },
    "Telecom": {
      quantitative: { topics: ["Signal Processing Basics","Network Math","Data Interpretation","Statistics","Algebra"], difficulty: "Medium" },
      logical: { topics: ["Logical Reasoning","Network Diagrams","Pattern Recognition","Technical Aptitude"], difficulty: "Medium" },
      verbal: { topics: ["Technical Communication","Reading Comprehension","Grammar"], difficulty: "Easy-Medium" },
      coding: { topics: ["Network Programming","C/C++ Algorithms","Data Structures","Protocol Implementation"], difficulty: "Medium-Hard", lang: "C/C++" },
    },
    "FMCG": {
      quantitative: { topics: ["Market Sizing","Business Math","Data Interpretation","Statistics","Probability"], difficulty: "Hard" },
      logical: { topics: ["Case Studies","Deductive Reasoning","Abstract Patterns","Situational Judgment"], difficulty: "Hard" },
      verbal: { topics: ["Business Communication","Reading Comprehension","Critical Analysis","Vocabulary"], difficulty: "Hard" },
    },
    "Pharma": {
      quantitative: { topics: ["Statistics","Data Interpretation","Business Math","Scientific Calculations"], difficulty: "Medium" },
      logical: { topics: ["Logical Reasoning","Analytical Thinking","Case Analysis","Deduction"], difficulty: "Medium" },
      verbal: { topics: ["Technical English","Reading Comprehension","Scientific Vocabulary","Grammar"], difficulty: "Medium" },
    },
    "EV/Auto": {
      coding: { topics: ["Embedded Systems","C/C++ Programming","Data Structures","Algorithms","Real-time Systems"], difficulty: "Hard", lang: "C/C++" },
      logical: { topics: ["Technical Aptitude","Problem Solving","Systems Thinking","Debugging Logic"], difficulty: "Hard" },
    },
    "Defence": {
      quantitative: { topics: ["Engineering Mathematics","Physics Calculations","Statistics","Data Interpretation"], difficulty: "Hard" },
      logical: { topics: ["Technical Reasoning","Spatial Intelligence","Pattern Recognition","Analytical Thinking"], difficulty: "Hard" },
      verbal: { topics: ["English Proficiency","Reading Comprehension","Technical Communication"], difficulty: "Medium" },
    },
  }

  const cat = co.category || "IT Services"
  const defaults = catDefaults[cat] || catDefaults["IT Services"]

  const sections: Record<string, any> = {}
  for (const sectionId of co.sections) {
    const def = defaults[sectionId]
    if (def) {
      sections[sectionId] = {
        name: { quantitative:"Quantitative Aptitude", logical:"Logical Reasoning", verbal:"Verbal Ability", coding:"Coding Assessment" }[sectionId] || sectionId,
        ...def,
      }
    }
  }

  return { name: co.desc || co.name, sections }
}

// Specific overrides for companies with well-known unique patterns
const COMPANY_OVERRIDES: Record<string, any> = {
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
      quantitative: { name: "Numerical Reasoning", topics: ["Data Tables", "Charts", "Business Math", "Percentages", "Ratios"], difficulty: "Medium" },
      logical: { name: "Logical Reasoning", topics: ["Deductive", "Inductive", "Abstract patterns", "Syllogisms"], difficulty: "Medium" },
      verbal: { name: "Verbal Reasoning", topics: ["Comprehension", "Critical Reasoning", "Sentence Completion"], difficulty: "Medium" },
    },
  },
  pwc: {
    name: "PwC Campus Assessment",
    sections: {
      quantitative: { name: "Numerical Reasoning", topics: ["Data Interpretation", "Business Math", "Percentages", "Ratios", "Profit & Loss"], difficulty: "Medium" },
      logical: { name: "Logical Reasoning", topics: ["Diagrammatic reasoning", "Abstract patterns", "Sequences", "Inductive reasoning"], difficulty: "Medium" },
      verbal: { name: "Verbal Reasoning", topics: ["Reading Comprehension", "True/False/Cannot Say", "Grammar", "Vocabulary"], difficulty: "Medium" },
    },
  },
  kpmg: {
    name: "KPMG Graduate Hiring",
    sections: {
      quantitative: { name: "Numerical Aptitude", topics: ["Number Systems", "Averages", "Percentages", "Data Interpretation", "Algebra"], difficulty: "Medium" },
      logical: { name: "Logical Reasoning", topics: ["Seating Arrangement", "Blood Relations", "Coding-Decoding", "Syllogisms", "Puzzles"], difficulty: "Medium" },
      verbal: { name: "Verbal Ability", topics: ["Synonyms/Antonyms", "Reading Comprehension", "Fill in the Blanks", "Error Detection"], difficulty: "Medium" },
    },
  },
  ey: {
    name: "EY Campus Assessment",
    sections: {
      quantitative: { name: "Quantitative Aptitude", topics: ["Time & Work", "Speed & Distance", "Permutations", "Probability", "Data Interpretation"], difficulty: "Medium" },
      logical: { name: "Reasoning", topics: ["Visual reasoning", "Pattern recognition", "Logical deduction", "Critical reasoning"], difficulty: "Medium" },
      verbal: { name: "Verbal Ability", topics: ["Para Jumbles", "Reading Comprehension", "Sentence Correction", "Vocabulary"], difficulty: "Medium" },
    },
  },
  adobe: {
    name: "Adobe Online Assessment",
    sections: {
      coding: { name: "Coding Assessment", topics: ["Dynamic Programming", "Trees & Graphs", "Sliding Window", "Two Pointers", "Arrays & Hashing", "Stack & Queue", "Recursion"], difficulty: "Hard", lang: "C++/Java/Python" },
      logical: { name: "Cognitive", topics: ["Problem Solving", "Abstract Reasoning", "Pattern Recognition"], difficulty: "Medium" },
    },
  },
  oracle: {
    name: "Oracle OA",
    sections: {
      coding: { name: "Coding Rounds", topics: ["Binary Search", "Dynamic Programming", "Trees", "Graphs", "Arrays", "String Manipulation", "Sorting Algorithms", "System Design concepts"], difficulty: "Hard", lang: "Java/C++" },
      quantitative: { name: "Aptitude", topics: ["Number Systems", "Arithmetic", "Data Interpretation", "Algebra"], difficulty: "Medium" },
    },
  },
  atlassian: {
    name: "Atlassian Coding Assessment",
    sections: {
      coding: { name: "Coding Assessment", topics: ["Graph Algorithms", "Dynamic Programming", "String Manipulation", "Binary Trees", "Heap & Priority Queue", "Backtracking", "Greedy Algorithms"], difficulty: "Hard", lang: "Any" },
      logical: { name: "Cognitive", topics: ["Problem Decomposition", "System Thinking", "Abstract Reasoning"], difficulty: "Medium" },
    },
  },
  salesforce: {
    name: "Salesforce OA",
    sections: {
      coding: { name: "Coding Assessment", topics: ["Arrays & Strings", "OOP Design", "Database Concepts", "REST API Design", "Algorithms", "Data Structures"], difficulty: "Hard", lang: "Java/Python" },
      logical: { name: "Cognitive", topics: ["Logical Reasoning", "Problem Solving", "Technical Aptitude"], difficulty: "Medium" },
    },
  },
  qualcomm: {
    name: "Qualcomm Technical Assessment",
    sections: {
      coding: { name: "Coding Rounds", topics: ["Bit Manipulation", "Dynamic Programming", "Graphs", "Trees", "System Level Programming", "Arrays", "Recursion"], difficulty: "Hard", lang: "C/C++" },
      quantitative: { name: "Technical Aptitude", topics: ["Computer Architecture", "Digital Logic", "Probability", "Linear Algebra basics", "Number Systems"], difficulty: "Hard" },
    },
  },
  hcl: {
    name: "HCL Graduate Engineer Trainee",
    sections: {
      quantitative: { name: "Quantitative Aptitude", topics: ["Percentages", "Simple & Compound Interest", "Time & Work", "Mensuration", "Number Series"], difficulty: "Easy-Medium" },
      logical: { name: "Logical Reasoning", topics: ["Series Completion", "Coding-Decoding", "Direction Sense", "Statement & Conclusion"], difficulty: "Easy" },
      verbal: { name: "English", topics: ["Synonyms/Antonyms", "Fill in the Blanks", "Reading Comprehension", "Sentence Arrangement"], difficulty: "Easy" },
      coding: { name: "Coding", topics: ["Array operations", "String reversal", "Pattern printing", "Basic sorting"], difficulty: "Easy", lang: "C/Java" },
    },
  },
  "tech-mahindra": {
    name: "Tech Mahindra SmartHire",
    sections: {
      quantitative: { name: "Quantitative Aptitude", topics: ["Arithmetic", "Number Systems", "Averages", "Ratios", "Time & Work"], difficulty: "Easy-Medium" },
      logical: { name: "Logical Reasoning", topics: ["Puzzles", "Syllogisms", "Number Analogy", "Direction Problems"], difficulty: "Easy" },
      verbal: { name: "Verbal", topics: ["Grammar", "Vocabulary", "Comprehension", "Error Identification"], difficulty: "Easy" },
      coding: { name: "Coding", topics: ["Basic algorithms", "Array manipulation", "Recursion basics", "Math programs"], difficulty: "Easy", lang: "Any" },
    },
  },
}

// Unified pattern lookup: override first, then dynamic from ALL_COMPANIES
function getCompanyPattern(companyId: string) {
  return COMPANY_OVERRIDES[companyId] ?? buildCompanyPattern(companyId)
}

export async function POST(req: Request) {
  let company = "", section = "", count = 5
  try {
    const body = await req.json()
    company = body.company ?? ""
    section = body.section ?? ""
    count   = body.count ?? 5

    const pattern = getCompanyPattern(company)
    if (!pattern) return NextResponse.json({ error: "Unknown company" }, { status: 400 })

    const sectionData = pattern.sections[section]
    if (!sectionData) return NextResponse.json({ error: "Unknown section" }, { status: 400 })

    if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY) {
      return NextResponse.json({ questions: getFallbackQuestions(company, section, count) })
    }

    // -- Step 1: For coding sections, use the company-specific AI model first ---
    if (section === "coding") {
      try {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
        const codingRes = await fetch(`${baseUrl}/api/student/company-coding-ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company, count, difficulty: sectionData.difficulty }),
          signal: AbortSignal.timeout(20000),
        })
        if (codingRes.ok) {
          const codingData = await codingRes.json()
          if (codingData.questions?.length > 0) {
            return NextResponse.json({
              questions: codingData.questions,
              company: pattern.name,
              section: sectionData.name,
              source: codingData.source,
              style: codingData.style,
            })
          }
        }
      } catch (codingErr) {
        console.error("company-coding-ai error:", codingErr)
      }
    }

    // -- Step 2: Try live web scraping -------------------------------------------
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
        // Partial scrape - use what we got and generate the rest
        if (scrapeData.questions?.length > 0) {
        }
      }
    } catch (scrapeErr) {
    }

    // -- Step 2: AI generation (OpenAI primary, Groq fallback) ----------------
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
- Create NEW problems inspired by the previous year patterns above - do NOT repeat them

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
- Questions must feel like REAL ${pattern.name} exam questions - study the PYQ style above carefully
- Match the same difficulty, topic distribution, and question style as the PYQs
- Each question has exactly 4 options (A,B,C,D) with one correct answer
- Include detailed step-by-step explanation for the correct answer (like the PYQs above)
- Cover different topics from the list above
- Create NEW questions inspired by the PYQ patterns - do NOT repeat them verbatim

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

    try {
      const raw = await callAI(prompt, 6000)
      const json = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
      const parsed = JSON.parse(json)
      const questions = Array.isArray(parsed) ? parsed : parsed.questions ?? parsed
      if (!Array.isArray(questions) || questions.length === 0) throw new Error("No questions array")
      return NextResponse.json({ questions, company: pattern.name, section: sectionData.name })
    } catch (aiErr) {
      console.error("AI generation error:", aiErr)
      return NextResponse.json({ questions: getFallbackQuestions(company, section, count) })
    }
  } catch (err) {
    console.error("generate-assessment error:", err)
    return NextResponse.json({ questions: getFallbackQuestions(company, section, count) })
  }
}

// Static coding fallback problems for each company
const CODING_FALLBACKS: Record<string, Array<{title:string; difficulty:string; statement:string; constraints:string; example:{input:string;output:string;explanation:string}; hints:string[]; topic:string}>> = {
  amazon: [
    { title:"Two Sum", difficulty:"Medium", topic:"Arrays & Hashing", constraints:"2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9", statement:"Given array nums and integer target, return indices of two numbers that add up to target.", example:{input:"nums=[2,7,11,15], target=9",output:"[0,1]",explanation:"nums[0]+nums[1]=9"}, hints:["Use a hash map","Store each value as you iterate"] },
    { title:"Maximum Subarray", difficulty:"Medium", topic:"Dynamic Programming", constraints:"1 <= nums.length <= 10^5", statement:"Find contiguous subarray with largest sum and return its sum.", example:{input:"nums=[-2,1,-3,4,-1,2,1,-5,4]",output:"6",explanation:"[4,-1,2,1] has the largest sum"}, hints:["Kadane's algorithm","Track current and global max"] },
    { title:"Number of Islands", difficulty:"Medium", topic:"Graphs", constraints:"1<=m,n<=300", statement:"Given 2D binary grid, count number of islands. An island is surrounded by water and formed by connecting adjacent 1s.", example:{input:'grid=[["1","1","0"],["0","1","0"],["0","0","1"]]',output:"2",explanation:"Two separate groups of 1s"}, hints:["Use BFS or DFS","Mark visited cells"] },
  ],
  microsoft: [
    { title:"Valid Parentheses", difficulty:"Easy", topic:"Stack", constraints:"1 <= s.length <= 10^4", statement:"Given string with '()[]{}', determine if the input string is valid.", example:{input:'s="()[]{}"',output:"true",explanation:"Each open bracket closed in correct order"}, hints:["Use a stack","Match each closing bracket with top of stack"] },
    { title:"Longest Substring Without Repeating", difficulty:"Medium", topic:"Sliding Window", constraints:"0 <= s.length <= 5*10^4", statement:"Find length of longest substring without repeating characters.", example:{input:'s="abcabcbb"',output:"3",explanation:"Substring 'abc'"}, hints:["Sliding window with a set","Shrink window on duplicate"] },
    { title:"Binary Tree Level Order Traversal", difficulty:"Medium", topic:"Trees", constraints:"0 to 2000 nodes", statement:"Return level order traversal of binary tree node values.", example:{input:"root=[3,9,20,null,null,15,7]",output:"[[3],[9,20],[15,7]]",explanation:"BFS level by level"}, hints:["Use a queue","Process all nodes at current level before moving to next"] },
  ],
  google: [
    { title:"Course Schedule II", difficulty:"Hard", topic:"Graphs / Topological Sort", constraints:"1 <= numCourses <= 2000", statement:"Return the order to finish all courses given prerequisites. Return empty if impossible.", example:{input:"numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]",output:"[0,1,2,3]",explanation:"Topological order"}, hints:["Topological sort via BFS (Kahn's algorithm)","Detect cycle using in-degree array"] },
    { title:"Trapping Rain Water", difficulty:"Hard", topic:"Two Pointers", constraints:"n == height.length, 0 <= height[i] <= 10^5", statement:"Given elevation map, compute how much water it can trap.", example:{input:"height=[0,1,0,2,1,0,1,3,2,1,2,1]",output:"6",explanation:"Trapped water between bars"}, hints:["Use two pointers from both ends","Track max height from left and right"] },
    { title:"Word Ladder", difficulty:"Hard", topic:"BFS / Graphs", constraints:"1 <= beginWord.length <= 10, 1 <= wordList.length <= 5000", statement:"Return length of shortest transformation sequence from beginWord to endWord, each step changing one letter.", example:{input:'beginWord="hit",endWord="cog",wordList=["hot","dot","dog","lot","log","cog"]',output:"5",explanation:"hit->hot->dot->dog->cog"}, hints:["BFS from beginWord","Build adjacency by changing each character"] },
  ],
  adobe: [
    { title:"Merge Intervals", difficulty:"Medium", topic:"Sorting / Intervals", constraints:"1 <= intervals.length <= 10^4", statement:"Merge all overlapping intervals.", example:{input:"intervals=[[1,3],[2,6],[8,10],[15,18]]",output:"[[1,6],[8,10],[15,18]]",explanation:"[1,3] and [2,6] overlap"}, hints:["Sort by start time","Merge if current start <= previous end"] },
    { title:"LRU Cache", difficulty:"Medium", topic:"Design / Hash Map", constraints:"1 <= capacity <= 3000", statement:"Design LRU cache with get(key) and put(key,value) operations, both O(1).", example:{input:"capacity=2; put(1,1); put(2,2); get(1)->1; put(3,3); get(2)->-1",output:"-1",explanation:"2 was evicted as LRU"}, hints:["Use OrderedDict or doubly linked list + hashmap","Move accessed key to front"] },
    { title:"Decode Ways", difficulty:"Medium", topic:"Dynamic Programming", constraints:"1 <= s.length <= 100", statement:"Count ways to decode a string of digits where A=1...Z=26.", example:{input:'s="12"',output:"2",explanation:"AB or L"}, hints:["DP with dp[i] = ways to decode s[:i]","Check single and double digit at each step"] },
  ],
  oracle: [
    { title:"Search in Rotated Sorted Array", difficulty:"Medium", topic:"Binary Search", constraints:"1 <= nums.length <= 5000, All unique", statement:"Search target in rotated sorted array in O(log n).", example:{input:"nums=[4,5,6,7,0,1,2], target=0",output:"4",explanation:"Index of 0"}, hints:["Modified binary search","Determine which half is sorted"] },
    { title:"Word Break", difficulty:"Medium", topic:"Dynamic Programming", constraints:"1 <= s.length <= 300", statement:"Return true if string s can be segmented into words from dictionary.", example:{input:'s="leetcode", wordDict=["leet","code"]',output:"true",explanation:"leet+code"}, hints:["DP: dp[i] = can s[:i] be segmented","Try all prefix splits"] },
    { title:"Flatten Binary Tree to Linked List", difficulty:"Medium", topic:"Trees", constraints:"0 to 2000 nodes", statement:"Flatten binary tree to linked list in-place using right pointers in preorder.", example:{input:"root=[1,2,5,3,4,null,6]",output:"[1,null,2,null,3,null,4,null,5,null,6]",explanation:"Preorder flattening"}, hints:["Recursive: flatten left, then right, then attach","Morris traversal approach"] },
  ],
  atlassian: [
    { title:"Top K Frequent Elements", difficulty:"Medium", topic:"Heap / Bucket Sort", constraints:"1 <= nums.length <= 10^5, k is valid", statement:"Return the k most frequent elements in any order.", example:{input:"nums=[1,1,1,2,2,3], k=2",output:"[1,2]",explanation:"1 appears 3 times, 2 appears 2 times"}, hints:["Build frequency map","Use a min-heap of size k or bucket sort"] },
    { title:"Pacific Atlantic Water Flow", difficulty:"Medium", topic:"BFS Multi-source", constraints:"1 <= m, n <= 200", statement:"Return cells that can flow to both Pacific (top/left) and Atlantic (bottom/right).", example:{input:"heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",output:"[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",explanation:"Cells reachable to both oceans"}, hints:["BFS from both ocean borders","Track reachability separately then intersect"] },
    { title:"Minimum Window Substring", difficulty:"Hard", topic:"Sliding Window", constraints:"1<=s.length,t.length<=10^5", statement:"Return minimum window substring of s containing all characters of t.", example:{input:'s="ADOBECODEBANC", t="ABC"',output:"BANC",explanation:"Smallest window containing A, B, C"}, hints:["Sliding window with character counts","Expand right, shrink left when all chars covered"] },
  ],
  salesforce: [
    { title:"Group Anagrams", difficulty:"Medium", topic:"Hash Map", constraints:"1 <= strs.length <= 10^4", statement:"Group strings that are anagrams together.", example:{input:'strs=["eat","tea","tan","ate","nat","bat"]',output:'[["bat"],["nat","tan"],["ate","eat","tea"]]',explanation:"Anagrams grouped"}, hints:["Sort each string as key","Use sorted string as hash map key"] },
    { title:"Find All Anagrams in a String", difficulty:"Medium", topic:"Sliding Window", constraints:"1 <= s.length, p.length <= 3*10^4", statement:"Return start indices of p's anagrams in s.", example:{input:'s="cbaebabacd", p="abc"',output:"[0,6]",explanation:"Substrings starting at 0 and 6 are anagrams of abc"}, hints:["Fixed-size sliding window of len(p)","Compare character frequency arrays"] },
    { title:"Design HashMap", difficulty:"Easy", topic:"Design / Hash Map", constraints:"0 <= key, value <= 10^6", statement:"Implement HashMap without built-in hash table libraries. Support put, get, remove.", example:{input:"put(1,1); put(2,2); get(1)->1; remove(2); get(2)->-1",output:"-1",explanation:"2 was removed"}, hints:["Use array of buckets with chaining","Handle collisions with linked list per bucket"] },
  ],
  qualcomm: [
    { title:"Single Number", difficulty:"Easy", topic:"Bit Manipulation", constraints:"1 <= nums.length <= 3*10^4", statement:"Every element appears twice except one. Find the single one in O(n) time, O(1) space.", example:{input:"nums=[4,1,2,1,2]",output:"4",explanation:"4 appears once"}, hints:["XOR of a number with itself is 0","XOR all elements together"] },
    { title:"Reverse Bits", difficulty:"Easy", topic:"Bit Manipulation", constraints:"Input is 32-bit unsigned integer", statement:"Reverse bits of given 32-bit unsigned integer.", example:{input:"n=00000010100101000001111010011100",output:"964176192",explanation:"Bit reversal"}, hints:["Process bit by bit","Use bit shifting and OR operations"] },
    { title:"Counting Bits", difficulty:"Easy", topic:"Dynamic Programming / Bit", constraints:"0 <= n <= 10^5", statement:"Return array where ans[i] is count of 1s in binary representation of i, for i in [0,n].", example:{input:"n=5",output:"[0,1,1,2,1,2]",explanation:"Bit counts for 0 through 5"}, hints:["dp[i] = dp[i>>1] + (i & 1)","Use previously computed values"] },
  ],
  deloitte: [
    { title:"Two Sum", difficulty:"Easy", topic:"Arrays", constraints:"2 <= nums.length <= 10^4", statement:"Return indices of two numbers that add up to target.", example:{input:"nums=[2,7,11,15], target=9",output:"[0,1]",explanation:"2+7=9"}, hints:["Hash map for O(n) solution"] },
    { title:"Valid Parentheses", difficulty:"Easy", topic:"Stack", constraints:"1 <= s.length <= 10^4", statement:"Determine if bracket string is valid.", example:{input:'s="()[]{}"',output:"true",explanation:"All brackets matched"}, hints:["Use a stack"] },
  ],
  pwc: [
    { title:"Fibonacci Number", difficulty:"Easy", topic:"Dynamic Programming", constraints:"0 <= n <= 30", statement:"Return nth Fibonacci number. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).", example:{input:"n=4",output:"3",explanation:"F(4)=3"}, hints:["Bottom-up DP or memoization"] },
    { title:"Palindrome Number", difficulty:"Easy", topic:"Math", constraints:"-2^31 <= x <= 2^31-1", statement:"Return true if integer reads same forward and backward.", example:{input:"x=121",output:"true",explanation:"121 reversed is 121"}, hints:["Convert to string","Or reverse mathematically"] },
  ],
  kpmg: [
    { title:"Missing Number", difficulty:"Easy", topic:"Math / XOR", constraints:"n == nums.length, 1 <= n <= 10^4", statement:"Array of n distinct numbers in [0,n]. Return the missing number.", example:{input:"nums=[3,0,1]",output:"2",explanation:"2 is missing"}, hints:["Sum formula: n*(n+1)/2 minus array sum","Or XOR approach"] },
    { title:"Climbing Stairs", difficulty:"Easy", topic:"Dynamic Programming", constraints:"1 <= n <= 45", statement:"Count distinct ways to climb n stairs (1 or 2 steps at a time).", example:{input:"n=3",output:"3",explanation:"1+1+1, 1+2, 2+1"}, hints:["Fibonacci-like DP"] },
  ],
  ey: [
    { title:"Remove Duplicates from Sorted Array", difficulty:"Easy", topic:"Two Pointers", constraints:"1 <= nums.length <= 3*10^4", statement:"Remove duplicates in-place from sorted array. Return count of unique elements.", example:{input:"nums=[1,1,2]",output:"2",explanation:"First 2 elements are unique"}, hints:["Two pointer: slow and fast"] },
    { title:"Best Time to Buy and Sell Stock", difficulty:"Easy", topic:"Greedy", constraints:"1 <= prices.length <= 10^5", statement:"Find maximum profit from one buy and one sell. Return 0 if no profit.", example:{input:"prices=[7,1,5,3,6,4]",output:"5",explanation:"Buy at 1, sell at 6"}, hints:["Track minimum price seen so far","Update max profit at each step"] },
  ],
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
    // Use static fallback coding problems if available for this company
    const staticCoding = CODING_FALLBACKS[company] ?? CODING_FALLBACKS["amazon"] ?? []
    if (staticCoding.length > 0) {
      const shuffled = [...staticCoding].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, Math.min(count, shuffled.length)).map((q, i) => ({
        ...q,
        id: i + 1,
      }))
    }
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
