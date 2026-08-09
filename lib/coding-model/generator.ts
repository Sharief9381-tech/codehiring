/**
 * CodeHiring Coding Question Generator
 * Our platform's own model for generating company-authentic coding problems.
 *
 * Architecture:
 * 1. Company Profile → knows exactly what TCS basic-coding vs advanced-coding looks like
 * 2. Pattern Templates → parameterized problem skeletons for 50+ patterns
 * 3. RAG Retrieval → pulls similar problems from our 18,900-problem DB as examples
 * 4. AI Synthesis → Groq generates new problems using profile + templates + examples
 *
 * This is the "model" — it doesn't use generic AI prompts.
 * It uses structured knowledge about each company's specific OA format.
 */

import { getCompanyCodingProfile, type CodingSection } from "./company-profiles"
import { ALL_COMPANIES } from "@/lib/companies-data"

// ── Pattern Templates ─────────────────────────────────────────────────────────
// Each template defines the "shape" of a problem for a pattern.
// The AI fills in the specific numbers, context, and constraints.

const PATTERN_TEMPLATES: Record<string, {
  template: string
  constraints: string
  inputFormat: string
  outputFormat: string
  examples: string
}> = {
  "Array Traversal": {
    template: "Given an array of {n} integers, find {goal}. Return {return_type}.",
    constraints: "1 <= n <= {max_n}\n{element_range}",
    inputFormat: "First line: n. Second line: n space-separated integers.",
    outputFormat: "A single {return_type}.",
    examples: "Basic case + edge case (empty/single element)",
  },
  "Two Pointers": {
    template: "Given a sorted array, find {goal} using two pointers. Optimize for O(n) time.",
    constraints: "1 <= n <= {max_n}\nArray is sorted in non-decreasing order",
    inputFormat: "First line: n. Second line: n integers.",
    outputFormat: "{return_type}",
    examples: "Target found + target not found",
  },
  "Sliding Window": {
    template: "Given array/string of size n, find {goal} within a window of size k.",
    constraints: "1 <= k <= n <= {max_n}",
    inputFormat: "Array + window size k",
    outputFormat: "Maximum/minimum/count as per goal",
    examples: "Window slides fully + edge case k=1",
  },
  "Hash Map": {
    template: "Given {input}, find {goal} using O(1) lookups. Return {return_type}.",
    constraints: "1 <= n <= {max_n}\n{value_range}",
    inputFormat: "Array or string",
    outputFormat: "{return_type}",
    examples: "Element exists + element missing",
  },
  "Stack": {
    template: "Process a sequence of operations using a stack. {specific_scenario}.",
    constraints: "1 <= n <= {max_n}",
    inputFormat: "Sequence of characters/operations",
    outputFormat: "Boolean or processed result",
    examples: "Valid case + invalid case",
  },
  "Binary Search": {
    template: "Given sorted array, find {goal} efficiently in O(log n).",
    constraints: "1 <= n <= {max_n}\nAll elements unique, sorted ascending",
    inputFormat: "n, array, target",
    outputFormat: "Index or boolean",
    examples: "Element found at start/middle/end + not found",
  },
  "Tree DFS": {
    template: "Given a binary tree, find {goal} using depth-first traversal.",
    constraints: "1 <= nodes <= {max_nodes}\n{value_range}",
    inputFormat: "Root of binary tree",
    outputFormat: "{return_type}",
    examples: "Balanced tree + skewed tree",
  },
  "Tree BFS": {
    template: "Given a binary tree, return {goal} processing nodes level by level.",
    constraints: "0 <= nodes <= {max_nodes}",
    inputFormat: "Root of binary tree",
    outputFormat: "List or value",
    examples: "Full tree + single node",
  },
  "Dynamic Programming": {
    template: "Given {input}, find {goal} where optimal substructure applies. Count/maximize/minimize {objective}.",
    constraints: "1 <= n <= {max_n}\n{value_range}",
    inputFormat: "Array or parameters",
    outputFormat: "Integer (count/max/min)",
    examples: "Small case + larger case showing DP benefit",
  },
  "String Manipulation": {
    template: "Given string s, {operation} to produce {output_description}.",
    constraints: "1 <= s.length <= {max_len}\ns consists of {char_set}",
    inputFormat: "String s",
    outputFormat: "Modified string or count",
    examples: "Typical input + edge (empty/single char)",
  },
  "Sorting": {
    template: "Sort {data} according to {criterion}. Return the {result}.",
    constraints: "1 <= n <= {max_n}\n{value_range}",
    inputFormat: "Array of elements",
    outputFormat: "Sorted array or specific elements",
    examples: "Unsorted input + already sorted input",
  },
  "Linked List": {
    template: "Given a linked list, {operation}. Return the {result}.",
    constraints: "0 <= number of nodes <= {max_nodes}",
    inputFormat: "Head of linked list",
    outputFormat: "Modified head or value",
    examples: "Multi-node list + single node",
  },
  "Greedy": {
    template: "Given {input}, make locally optimal choices to achieve {global_goal}.",
    constraints: "1 <= n <= {max_n}",
    inputFormat: "Array or intervals",
    outputFormat: "Minimum count or maximum value",
    examples: "Greedy works + borderline case",
  },
  "BFS": {
    template: "Given a graph/grid, find {goal} using breadth-first search from {source}.",
    constraints: "1 <= nodes <= {max_nodes}\n{edge_constraints}",
    inputFormat: "Grid or adjacency list",
    outputFormat: "Distance, path, or count",
    examples: "Connected graph + disconnected component",
  },
  "DFS": {
    template: "Given a graph/grid, {operation} using depth-first traversal.",
    constraints: "1 <= nodes <= {max_nodes}",
    inputFormat: "Grid or adjacency list",
    outputFormat: "Boolean, count, or path",
    examples: "Path exists + path doesn't exist",
  },
  "Math Operations": {
    template: "Given {input}, compute {mathematical_property}. Return the result.",
    constraints: "0 <= {input} <= {max_val}",
    inputFormat: "Integer or array",
    outputFormat: "Integer or boolean",
    examples: "Typical value + boundary value",
  },
  "Recursion": {
    template: "Solve {problem} recursively. Base case: {base_case}. Recursive case: {recursive_case}.",
    constraints: "1 <= n <= {max_n}",
    inputFormat: "n or array",
    outputFormat: "{return_type}",
    examples: "Small n + medium n",
  },
}

// ── System Prompt Builder ─────────────────────────────────────────────────────

export function buildModelPrompt(
  section: CodingSection,
  companyName: string,
  category: string,
  realExamNotes: string,
  globalStyle: string[],
  ragExamples: string,
  batchPatterns: string[],
  count: number,
): string {
  const patternTemplates = batchPatterns
    .filter(p => PATTERN_TEMPLATES[p])
    .map(p => `${p}:\n  ${PATTERN_TEMPLATES[p].template}\n  Output: ${PATTERN_TEMPLATES[p].outputFormat}`)
    .join("\n\n")

  const avoidList = section.avoidPatterns.length > 0
    ? `\nDO NOT use these patterns (they never appear in ${companyName}): ${section.avoidPatterns.join(", ")}`
    : ""

  return `You are the CodeHiring AI Coding Model — trained specifically to generate ${companyName} coding assessment problems.

## COMPANY INTELLIGENCE
- Company: ${companyName} (${category})
- Section: ${section.name}
- Real exam info: ${realExamNotes}
- Section difficulty: ${section.difficulty}
- Time limit: ${section.timeMinutes} minutes for ${section.count} problem(s)
- Typical constraints: Array n=${section.constraints.arraySize}, String=${section.constraints.stringLen}

## SECTION STYLE RULES
${section.style.map(s => `- ${s}`).join("\n")}

## GLOBAL COMPANY STYLE
${globalStyle.map(s => `- ${s}`).join("\n")}
${avoidList}

## PROBLEM PATTERNS TO USE FOR THIS BATCH
${batchPatterns.map((p, i) => `${i + 1}. ${p}`).join("\n")}

## PROBLEM SHAPE TEMPLATES (use these as structure guides)
${patternTemplates || "Use standard problem templates for the given patterns"}

${ragExamples ? `## REAL ${companyName.toUpperCase()} PROBLEMS FROM OUR DATABASE (use as style reference only — do NOT copy)\n${ragExamples}` : ""}

## OUTPUT REQUIREMENT
Generate exactly ${count} problems. Return ONLY a valid JSON array. No markdown. No explanation. No code blocks.

Schema for each problem:
{
  "title": "Clear descriptive title",
  "difficulty": "${section.difficulty === "Mixed" ? "Easy|Medium|Hard" : section.difficulty}",
  "pattern": "Pattern name from the list above",
  "topic": "Specific algorithm/concept",
  "statement": "Complete problem statement — what is given, what to return, all constraints mentioned inline",
  "constraints": "n == nums.length\\n${section.constraints.arraySize}\\n${section.constraints.stringLen !== "N/A" ? section.constraints.stringLen : ""}",
  "examples": [
    {"input": "exact input values", "output": "exact correct output", "explanation": "step-by-step reasoning"},
    {"input": "different input", "output": "correct output", "explanation": "why this output"}
  ],
  "hints": ["Key algorithmic insight", "Edge case to watch"],
  "functionSignature": "def solveProblem(self, ...) -> returnType:",
  "tags": ["${companyName.toLowerCase().replace(/\s+/g, "-")}", "pattern-name", "difficulty"]
}`
}

// ── RAG Example Formatter ─────────────────────────────────────────────────────

export function formatRAGExamples(problems: any[], limit = 4): string {
  if (!problems || problems.length === 0) return ""

  return problems.slice(0, limit).map((p, i) => `
Example ${i + 1} [${p.difficulty} | ${p.pattern}]:
Title: ${p.title}
Problem: ${(p.statement ?? p.desc ?? "").slice(0, 200)}${(p.statement ?? p.desc ?? "").length > 200 ? "..." : ""}
Sample: Input: ${p.examples?.[0]?.input ?? "N/A"} → Output: ${p.examples?.[0]?.output ?? "N/A"}
`.trim()).join("\n\n")
}

// ── Pattern Rotation ──────────────────────────────────────────────────────────

/**
 * Pick patterns for this batch, ensuring variety across multiple calls.
 * Uses the section's allowed patterns, rotating through them.
 */
export function selectBatchPatterns(
  section: CodingSection,
  batchIndex: number,
  batchSize: number
): string[] {
  const available = section.patterns.filter(
    p => !section.avoidPatterns.includes(p)
  )
  if (available.length === 0) return section.patterns.slice(0, batchSize)

  // Rotate through patterns ensuring even distribution
  const startIdx = (batchIndex * batchSize) % available.length
  const patterns: string[] = []
  for (let i = 0; i < batchSize; i++) {
    patterns.push(available[(startIdx + i) % available.length])
  }
  return [...new Set(patterns)] // deduplicate
}

// ── Difficulty Distributor ────────────────────────────────────────────────────

export function getDifficultyForBatch(
  sectionDifficulty: string,
  batchIndex: number,
  totalBatches: number
): string {
  if (sectionDifficulty !== "Mixed") return sectionDifficulty

  // For mixed sections, distribute: first 40% Easy, 40% Medium, 20% Hard
  const pct = batchIndex / totalBatches
  if (pct < 0.4) return "Easy"
  if (pct < 0.8) return "Medium"
  return "Hard"
}
