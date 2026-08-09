/**
 * POST /api/admin/seed-problems
 * Generates and stores 100 coding problems per company in MongoDB.
 * Runs one company per request — call in a loop from the seeder script.
 * Protected by SEED_SECRET env var.
 *
 * Body: { company: string, secret: string, batchSize?: number }
 * Returns: { company, generated, total, skipped, errors }
 */

import { NextResponse } from "next/server"
import { ALL_COMPANIES } from "@/lib/companies-data"
import {
  getCompanyProblemsCollection,
  countProblemsForCompany,
} from "@/lib/models/company-problem"

// ── AI caller ────────────────────────────────────────────────────────────────

const GROQ_API   = "https://api.groq.com/openai/v1/chat/completions"
const OPENAI_API = "https://api.openai.com/v1/chat/completions"

async function callAI(prompt: string, maxTokens = 8000): Promise<string> {
  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch(OPENAI_API, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.9,
          max_tokens: maxTokens,
        }),
      })
      if (res.ok) {
        const d = await res.json()
        const t = d.choices?.[0]?.message?.content?.trim()
        if (t) return t
      }
    } catch {}
  }

  if (process.env.GROQ_API_KEY) {
    const res = await fetch(GROQ_API, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
        max_tokens: maxTokens,
      }),
    })
    if (res.ok) {
      const d = await res.json()
      return d.choices?.[0]?.message?.content?.trim() ?? ""
    }
  }
  throw new Error("No AI provider available")
}

// ── Problem batch definitions ────────────────────────────────────────────────

// 100 problems = 10 batches × 10 problems each
// Each batch targets different patterns to ensure full coverage
const PATTERN_BATCHES: Record<string, string[][]> = {
  "Product": [
    ["Two Pointers", "Sliding Window", "Hash Map", "Stack", "Queue"],
    ["Binary Search", "Merge Sort", "Quick Select", "Heap", "Trie"],
    ["BFS", "DFS", "Topological Sort", "Union Find", "Shortest Path"],
    ["Dynamic Programming", "Memoization", "Tabulation", "Greedy", "Divide and Conquer"],
    ["Tree DFS", "Tree BFS", "BST Operations", "Segment Tree", "Binary Indexed Tree"],
    ["Linked List", "Two Pointer LL", "Fast-Slow Pointer", "Reverse LL", "Cycle Detection"],
    ["Backtracking", "Permutations", "Subsets", "Combinations", "N-Queens"],
    ["String Manipulation", "KMP Pattern", "Rabin Karp", "Palindrome", "Anagram"],
    ["Bit Manipulation", "XOR Tricks", "Bit Counting", "Power of Two", "Bitmasking"],
    ["Math & Number Theory", "Prime Sieve", "GCD/LCM", "Modular Arithmetic", "Probability"],
  ],
  "IT Services": [
    ["Array Traversal", "Two Pointers", "Sorting", "Binary Search", "Hash Map"],
    ["String Manipulation", "Palindrome", "Anagram", "String Compression", "Pattern Matching"],
    ["Stack", "Queue", "Min Stack", "Balanced Brackets", "Evaluate Expression"],
    ["Linked List", "Reverse LL", "Merge Sorted LL", "Cycle Detection", "Middle Node"],
    ["Tree DFS", "Tree BFS", "Inorder Traversal", "Level Order", "Path Sum"],
    ["Dynamic Programming", "Fibonacci", "Climbing Stairs", "House Robber", "LCS"],
    ["Math", "Factorial", "Fibonacci", "GCD", "Prime Check"],
    ["Bit Manipulation", "Count Bits", "Single Number", "Power of Two", "XOR"],
    ["Greedy", "Activity Selection", "Fractional Knapsack", "Interval Scheduling", "Gas Station"],
    ["Recursion", "Tower of Hanoi", "Permutations", "Subsets", "Generate Parentheses"],
  ],
  "Startups": [
    ["Sliding Window", "Two Pointers", "Hash Map", "Prefix Sum", "Counting"],
    ["BFS", "DFS", "Graph Cycle", "Connected Components", "Flood Fill"],
    ["Dynamic Programming", "LIS", "LCS", "Edit Distance", "Knapsack"],
    ["Heap", "Priority Queue", "Top K Elements", "Median Stream", "Merge K Lists"],
    ["Design", "LRU Cache", "LFU Cache", "Rate Limiter", "Time-Based Store"],
    ["Binary Search", "Rotated Array", "Search Matrix", "Find Peak", "Capacity Planning"],
    ["Tree", "BST", "Trie", "Segment Tree", "Range Query"],
    ["String", "Longest Substring", "Regex Matching", "Word Break", "String Encoding"],
    ["Math", "Probability", "Combinatorics", "Number Theory", "Geometry"],
    ["Backtracking", "Combination Sum", "Sudoku", "Word Search", "Knight Tour"],
  ],
  "BFSI": [
    ["Arrays", "Sorting", "Binary Search", "Two Pointers", "Sliding Window"],
    ["Dynamic Programming", "Stock Trading", "Max Profit", "Transaction Limits", "Portfolio"],
    ["Graphs", "BFS", "DFS", "Shortest Path", "Network Flow"],
    ["String Processing", "Transaction Parsing", "Data Validation", "Format Conversion", "Encoding"],
    ["Math & Finance", "Compound Interest", "Probability", "Statistics", "Risk Calculation"],
    ["Design", "System Design", "Database Design", "Cache", "Queue Systems"],
    ["Trees", "BST", "Heap", "Priority Queue", "Order Book"],
    ["Hash Map", "Frequency Count", "Grouping", "Aggregation", "Deduplication"],
    ["Recursion", "Backtracking", "Permutations", "Combinations", "Subset Sum"],
    ["Bit Manipulation", "Bit Tricks", "Number Systems", "Overflow Detection", "Fast Math"],
  ],
  "Consulting": [
    ["Arrays", "Sorting", "Searching", "Frequency Count", "Statistics"],
    ["String", "Parsing", "Formatting", "Validation", "Transformation"],
    ["Math", "Percentages", "Ratios", "Averages", "Business Calculations"],
    ["Data Structures", "Stack", "Queue", "HashMap", "LinkedList"],
    ["Basic DP", "Memoization", "Simple Greedy", "Optimization", "Decision Trees"],
    ["Sorting Algorithms", "Merge Sort", "Quick Sort", "Count Sort", "Radix Sort"],
    ["Matrix Operations", "2D Array", "Spiral", "Rotation", "Transpose"],
    ["Recursion", "Divide & Conquer", "Fibonacci", "Factorial", "Power"],
    ["Graph Basics", "BFS", "DFS", "Connected Components", "Topological Sort"],
    ["Number Theory", "Prime", "GCD", "LCM", "Modular Arithmetic"],
  ],
  "Core Engg": [
    ["Bit Manipulation", "Bitwise Ops", "Shift Operations", "Flags", "Bitmask"],
    ["Arrays and Pointers", "Memory Simulation", "Buffer Operations", "Circular Array", "Ring Buffer"],
    ["Sorting and Searching", "Binary Search", "Merge Sort", "Quick Sort", "Heap Sort"],
    ["String Processing", "Tokenization", "Parsing", "Pattern Matching", "Encoding"],
    ["Data Structures", "Linked List", "Stack", "Queue", "Tree"],
    ["Math", "Integer Overflow", "Fixed Point Arithmetic", "Precision", "Number Conversion"],
    ["Recursion", "Tail Recursion", "Divide and Conquer", "Memoization", "Iteration"],
    ["Graph Algorithms", "BFS", "DFS", "Shortest Path", "MST"],
    ["Dynamic Programming", "Subsequence", "Knapsack", "Coin Change", "Path Count"],
    ["System Patterns", "Producer Consumer", "State Machine", "Event Driven", "Rate Limiting"],
  ],
  "Telecom": [
    ["Arrays", "Sorting", "Binary Search", "Two Pointers", "Sliding Window"],
    ["Graphs", "BFS", "DFS", "Network Routing", "Shortest Path"],
    ["String Processing", "Protocol Parsing", "Data Encoding", "Network Packets", "Format Conversion"],
    ["Math and Statistics", "Bandwidth Calculation", "Frequency", "Error Rate", "Signal Math"],
    ["Data Structures", "Stack", "Queue", "Hash Map", "Priority Queue"],
    ["Dynamic Programming", "Optimization", "Path Finding", "Load Balancing", "Routing"],
    ["Bit Manipulation", "Bit Packing", "Checksums", "Error Detection", "Bitmask"],
    ["Design", "Network Topology", "Fault Tolerance", "Caching", "Queue Systems"],
    ["Recursion", "Tree Traversal", "Hierarchical Structures", "Divide and Conquer", "Backtracking"],
    ["Number Theory", "Binary Arithmetic", "Number Conversion", "Modular Math", "Hash Functions"],
  ],
  "FMCG": [
    ["Arrays", "Sorting", "Searching", "Data Analysis", "Statistics"],
    ["String", "Parsing", "Formatting", "Product SKU", "Category Processing"],
    ["Math", "Business Calculations", "Market Share", "Growth Rate", "Revenue Optimization"],
    ["Hash Map", "Frequency Count", "Sales Grouping", "Category Aggregation", "Inventory"],
    ["Dynamic Programming", "Profit Optimization", "Resource Allocation", "Planning", "Scheduling"],
    ["Greedy", "Route Optimization", "Stock Management", "Cost Minimization", "Delivery Planning"],
    ["Priority Queue", "Sales Ranking", "Product Sorting", "Market Ordering", "Heap"],
    ["Graph Basics", "Supply Chain", "Distribution Network", "Logistics Routing", "BFS"],
    ["Data Structures", "Stack", "Queue", "LinkedList", "Sets"],
    ["Recursion", "Category Hierarchies", "Product Trees", "Divide and Conquer", "Tree Traversal"],
  ],
  "Pharma": [
    ["Arrays", "Data Analysis", "Statistics", "Sorting", "Searching"],
    ["String", "Molecular Sequences", "Drug Names", "Pattern Matching", "Encoding"],
    ["Math and Statistics", "Dosage Calculations", "Probability", "Distribution", "Sampling"],
    ["Hash Map", "Drug Interactions", "Patient Records", "Medication Tracking", "Lookup"],
    ["Dynamic Programming", "Treatment Optimization", "Dosage Scheduling", "Cost Analysis", "Resource Allocation"],
    ["Graph Algorithms", "Interaction Networks", "Pathway Analysis", "BFS", "DFS"],
    ["Priority Queue", "Patient Triage", "Drug Efficacy Ranking", "Sorting", "Heap"],
    ["Binary Search", "Clinical Search", "Patient Lookup", "Drug Database", "Index"],
    ["Recursion", "Classification Trees", "Decision Trees", "Divide and Conquer", "Backtracking"],
    ["Simulation", "Clinical Trial Simulation", "Patient Flow", "Treatment Paths", "Monte Carlo"],
  ],
  "EV/Auto": [
    ["Bit Manipulation", "Embedded Systems", "Flag Registers", "Bitmask", "Protocol Bits"],
    ["Graphs", "Route Optimization", "Charging Network", "BFS Dijkstra", "Path Planning"],
    ["Arrays", "Sensor Data", "Battery Cells", "Temperature Array", "Voltage Readings"],
    ["Dynamic Programming", "Range Optimization", "Energy Management", "Route Planning", "Scheduling"],
    ["Math", "Battery Calculations", "Energy Conversion", "Physics Formulas", "Efficiency"],
    ["Simulation", "Driving Simulation", "Battery Drain", "Charge Cycles", "Vehicle Dynamics"],
    ["Binary Search", "Threshold Detection", "Optimal Speed", "Charging Level", "Sensor Calibration"],
    ["Stack and Queue", "Command Queue", "Event Processing", "Real Time Systems", "FIFO LIFO"],
    ["String", "CAN Bus Messages", "Protocol Parsing", "Diagnostic Codes", "Data Logging"],
    ["Recursion", "Circuit Analysis", "System Hierarchy", "Component Trees", "Divide and Conquer"],
  ],
  "Defence": [
    ["Math", "Engineering Calculations", "Physics", "Signal Processing", "Trigonometry"],
    ["Arrays", "Sensor Data", "Radar Processing", "Target Tracking", "Telemetry"],
    ["Graphs", "Network Topology", "Mission Planning", "Route Optimization", "Communication Links"],
    ["Dynamic Programming", "Resource Allocation", "Mission Optimization", "Logistics", "Scheduling"],
    ["Bit Manipulation", "Binary Protocols", "Data Encoding", "Security", "Checksums"],
    ["String", "Command Processing", "Code Decoding", "Protocol Parsing", "Log Analysis"],
    ["Priority Queue", "Mission Criticality", "Resource Ranking", "Timeline", "Heap"],
    ["Binary Search", "Target Acquisition", "Signal Detection", "Range Finding", "Optimal Parameters"],
    ["Simulation", "Ballistics Simulation", "Navigation", "Systems Testing", "Scenario Planning"],
    ["Recursion", "Hierarchical Systems", "Tree Structures", "Divide and Conquer", "Decision Trees"],
  ],
  "Default": [
    ["Arrays", "Two Pointers", "Sliding Window", "Prefix Sum", "Hash Map"],
    ["Strings", "Palindrome", "Anagram", "Reversal", "Parsing"],
    ["Sorting", "Binary Search", "Merge", "Quick Sort", "Counting Sort"],
    ["Linked List", "Reversal", "Cycle", "Merge", "Nth From End"],
    ["Trees", "BFS", "DFS", "BST", "Path Sum"],
    ["Dynamic Programming", "Fibonacci", "LCS", "Knapsack", "Coin Change"],
    ["Graphs", "BFS", "DFS", "Connected Components", "Topological Sort"],
    ["Stack & Queue", "Min Stack", "Brackets", "Monotonic Stack", "Sliding Window Max"],
    ["Math", "Prime", "GCD", "Bit Manipulation", "Number Theory"],
    ["Backtracking", "Subsets", "Permutations", "Combinations", "N-Queens"],
  ],
}

function getBatches(category: string) {
  return PATTERN_BATCHES[category] ?? PATTERN_BATCHES["Default"]
}

// ── Prompt builder ────────────────────────────────────────────────────────────

function buildBatchPrompt(
  companyName: string,
  category: string,
  patterns: string[],
  batchNum: number,
  totalBatches: number,
  existingTitles: string[]
): string {
  const difficultyMap: Record<string, string> = {
    "Product": "2 Easy, 4 Medium, 4 Hard",
    "IT Services": "5 Easy, 4 Medium, 1 Hard",
    "Startups": "2 Easy, 5 Medium, 3 Hard",
    "BFSI": "3 Easy, 5 Medium, 2 Hard",
    "Consulting": "6 Easy, 3 Medium, 1 Hard",
    "Core Engg": "3 Easy, 5 Medium, 2 Hard",
    "Default": "4 Easy, 4 Medium, 2 Hard",
  }
  const diffDist = difficultyMap[category] ?? difficultyMap["Default"]

  const avoidList = existingTitles.length > 0
    ? `\nAVOID these already-generated titles (do not repeat): ${existingTitles.slice(-20).join(", ")}`
    : ""

  return `You are generating coding problems for ${companyName}'s campus hiring online assessment.

${avoidList}

BATCH ${batchNum} of ${totalBatches}. Generate exactly 10 problems.

TARGET PATTERNS: ${patterns.join(", ")}
DIFFICULTY DISTRIBUTION: ${diffDist}
COMPANY CONTEXT: ${companyName} is a ${category} company. Problems must feel authentic to their real OA.

RULES:
1. Each problem must cover a DIFFERENT pattern from the list above
2. Real ${companyName} OA style: appropriate difficulty, realistic constraints, clear statement
3. At least 2 examples per problem with CORRECT input/output
4. Hints should guide toward the optimal approach
5. Problems must be original — not copied from LeetCode, but inspired by real patterns

Return ONLY valid JSON array (no markdown, no code blocks):
[
  {
    "title": "Clear problem title",
    "difficulty": "Easy|Medium|Hard",
    "pattern": "Pattern name from the list",
    "topic": "Specific algorithm/data structure",
    "statement": "Full problem statement — what is given, what to return, all edge cases",
    "constraints": "n == nums.length\\n1 <= n <= 10^5\\n-10^9 <= nums[i] <= 10^9",
    "examples": [
      { "input": "nums = [1,2,3], target = 4", "output": "true", "explanation": "1+3=4" },
      { "input": "nums = [1,2], target = 10", "output": "false", "explanation": "No pair sums to 10" }
    ],
    "hints": ["Use a hash set to track complements", "Iterate once — O(n) time possible"],
    "tags": ["arrays", "hashing", "easy"]
  }
]`
}

// ── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const body = await req.json()
  const secret = body.secret ?? ""
  const companyId: string = body.company ?? ""
  const targetCount = Math.min(body.targetCount ?? 100, 100)

  // Auth check
  if (secret !== process.env.SEED_SECRET && secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!companyId) {
    return NextResponse.json({ error: "company required" }, { status: 400 })
  }

  const co = ALL_COMPANIES.find(c => c.id === companyId)
  if (!co) return NextResponse.json({ error: "Unknown company" }, { status: 400 })

  const col = await getCompanyProblemsCollection()
  const existing = await countProblemsForCompany(companyId)

  if (existing >= targetCount) {
    return NextResponse.json({
      company: companyId,
      generated: 0,
      total: existing,
      skipped: true,
      message: `Already has ${existing} problems`,
    })
  }

  const needed = targetCount - existing
  const batches = getBatches(co.category)
  const batchSize = 10
  const batchesNeeded = Math.ceil(needed / batchSize)

  // Fetch existing titles to avoid duplicates
  const existingDocs = await col
    .find({ company: companyId }, { projection: { title: 1 } })
    .toArray()
  const existingTitles = existingDocs.map(d => d.title)

  let generated = 0
  const errors: string[] = []
  const batchId = `batch_${Date.now()}`

  for (let i = 0; i < batchesNeeded; i++) {
    const batchPatterns = batches[i % batches.length]
    const prompt = buildBatchPrompt(
      co.name,
      co.category,
      batchPatterns,
      i + 1,
      batchesNeeded,
      [...existingTitles]
    )

    try {
      const raw = await callAI(prompt, 6000)
      const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
      const parsed: any[] = JSON.parse(cleaned)

      if (!Array.isArray(parsed)) throw new Error("Expected array")

      const docs = parsed.slice(0, batchSize).map(p => ({
        company: co.id,
        companyName: co.name,
        category: co.category,
        title: p.title ?? "Untitled",
        difficulty: (["Easy","Medium","Hard"].includes(p.difficulty) ? p.difficulty : "Medium") as any,
        pattern: p.pattern ?? batchPatterns[0],
        topic: p.topic ?? p.pattern ?? "",
        statement: p.statement ?? p.description ?? "",
        constraints: p.constraints ?? "",
        examples: Array.isArray(p.examples) ? p.examples : [],
        hints: Array.isArray(p.hints) ? p.hints : [],
        tags: Array.isArray(p.tags) ? p.tags : [co.id, p.difficulty?.toLowerCase() ?? "medium"],
        createdAt: new Date(),
        generatedBy: "groq" as const,
        batchId,
      }))

      // Dedup within this batch
      const newTitles = new Set(existingTitles)
      const deduped = docs.filter(d => {
        if (newTitles.has(d.title)) return false
        newTitles.add(d.title)
        return true
      })

      if (deduped.length > 0) {
        await col.insertMany(deduped, { ordered: false }).catch(() => {})
        existingTitles.push(...deduped.map(d => d.title))
        generated += deduped.length
      }

      // Small delay to respect rate limits
      await new Promise(r => setTimeout(r, 500))

    } catch (err: any) {
      errors.push(`Batch ${i + 1}: ${err.message}`)
    }

    if (generated >= needed) break
  }

  const total = await countProblemsForCompany(companyId)
  return NextResponse.json({ company: companyId, generated, total, errors, batchId })
}

// GET — check progress for all companies
export async function GET(req: Request) {
  const url = new URL(req.url)
  const secret = url.searchParams.get("secret") ?? ""

  if (secret !== process.env.SEED_SECRET && secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { getGenerationProgress } = await import("@/lib/models/company-problem")
  const progress = await getGenerationProgress()

  const total = Object.values(progress).reduce((a, b) => a + b, 0)
  const companiesComplete = Object.values(progress).filter(n => n >= 100).length
  const companiesPending = ALL_COMPANIES.filter(c => (progress[c.id] ?? 0) < 100).map(c => ({
    id: c.id,
    name: c.name,
    count: progress[c.id] ?? 0,
    needed: Math.max(0, 100 - (progress[c.id] ?? 0)),
  }))

  return NextResponse.json({
    totalProblems: total,
    targetProblems: ALL_COMPANIES.length * 100,
    companiesComplete,
    companiesTotal: ALL_COMPANIES.length,
    percentComplete: Math.round((total / (ALL_COMPANIES.length * 100)) * 100),
    companiesPending: companiesPending.slice(0, 20),
  })
}
