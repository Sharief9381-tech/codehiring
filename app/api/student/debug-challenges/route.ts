/**
 * GET  /api/student/debug-challenges?lang=Python
 * Returns 3 AI-generated "find and fix the bug" challenges in the chosen language.
 * Basic → Intermediate → Advanced curriculum, infinite progression.
 *
 * POST ?action=refresh  — force regeneration
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase } from "@/lib/database"

const COLLECTION = "debug_challenges"

const CURRICULUM = [
  // Basic
  { id:"variables",     label:"Variables & Types",       difficulty:"Basic",        color:"#10b981", prompt:"Variable assignment bugs: using variable before assignment, wrong type conversion, NameError, shadowing built-ins." },
  { id:"operators",     label:"Operators & Expressions", difficulty:"Basic",        color:"#10b981", prompt:"Operator precedence bugs, wrong division type, = vs == confusion, wrong logical operator." },
  { id:"conditionals",  label:"Conditionals",            difficulty:"Basic",        color:"#10b981", prompt:"if/else logic bugs: wrong comparison, = instead of ==, incorrect truthy/falsy, unreachable branch." },
  { id:"loops",         label:"Loops",                   difficulty:"Basic",        color:"#10b981", prompt:"Loop bugs: off-by-one, wrong while condition causing infinite loop, loop variable misuse, break/continue misplaced." },
  { id:"functions",     label:"Functions",               difficulty:"Basic",        color:"#10b981", prompt:"Function bugs: missing return, wrong default argument, returning inside loop too early, scope confusion." },
  // Intermediate
  { id:"arrays",        label:"Arrays / Lists",          difficulty:"Intermediate", color:"#3b82f6", prompt:"Array/List bugs: off-by-one in indexing/slicing, mutating while iterating, wrong append/push, shallow copy." },
  { id:"strings",       label:"Strings",                 difficulty:"Intermediate", color:"#3b82f6", prompt:"String bugs: wrong slice range, incorrect split/join, format error, immutability causing no-op." },
  { id:"hashing",       label:"Hashing / Maps",          difficulty:"Intermediate", color:"#3b82f6", prompt:"HashMap/Dict bugs: missing key handling, iterating and modifying, incorrect counting, wrong default value." },
  { id:"matrix",        label:"Matrix / 2D Arrays",      difficulty:"Intermediate", color:"#f59e0b", prompt:"2D array bugs: wrong row/col index order, incorrect nested loop bounds, off-by-one in traversal." },
  { id:"linked-list",   label:"Linked List",             difficulty:"Intermediate", color:"#f59e0b", prompt:"Linked list bugs: wrong next pointer, losing head reference, skipping nodes on delete, null pointer." },
  { id:"stack",         label:"Stack",                   difficulty:"Intermediate", color:"#f59e0b", prompt:"Stack bugs: popping empty stack, wrong parentheses matching, incorrect peek, wrong LIFO usage." },
  { id:"queue",         label:"Queue",                   difficulty:"Intermediate", color:"#f59e0b", prompt:"Queue bugs: dequeue from empty, wrong index update, incorrect front/rear pointer, FIFO order bug." },
  { id:"recursion",     label:"Recursion",               difficulty:"Intermediate", color:"#f59e0b", prompt:"Recursion bugs: missing/wrong base case, incorrect recursive argument, wrong return value, stack overflow." },
  { id:"sorting",       label:"Sorting",                 difficulty:"Intermediate", color:"#f59e0b", prompt:"Sorting bugs: wrong comparison direction, off-by-one in inner loop, incorrect merge step, wrong comparator." },
  { id:"binary-search", label:"Binary Search",           difficulty:"Intermediate", color:"#f59e0b", prompt:"Binary search bugs: wrong mid calculation, incorrect boundary update, infinite loop." },
  { id:"two-pointers",  label:"Two Pointers",            difficulty:"Intermediate", color:"#8b5cf6", prompt:"Two pointer bugs: wrong pointer movement, off-by-one in condition, not handling duplicates." },
  { id:"sliding-window",label:"Sliding Window",          difficulty:"Intermediate", color:"#8b5cf6", prompt:"Sliding window bugs: wrong window size, not shrinking when constraint violated, off-by-one in result." },
  { id:"tree",          label:"Binary Tree",             difficulty:"Intermediate", color:"#f59e0b", prompt:"Tree bugs: wrong traversal order, missing null check, incorrect height recursion, wrong leaf detection." },
  { id:"graph",         label:"Graph / BFS / DFS",       difficulty:"Intermediate", color:"#f59e0b", prompt:"Graph bugs: missing visited set, wrong adjacency access, BFS queue vs DFS stack confusion." },
  // Advanced
  { id:"greedy",        label:"Greedy Algorithms",       difficulty:"Advanced",     color:"#ef4444", prompt:"Greedy bugs: wrong sort key, incorrect greedy choice, missing edge case, interval overlap logic error." },
  { id:"dp",            label:"Dynamic Programming",     difficulty:"Advanced",     color:"#ef4444", prompt:"DP bugs: wrong base case, incorrect state transition, index off-by-one, memoization key error." },
  { id:"backtracking",  label:"Backtracking",            difficulty:"Advanced",     color:"#ef4444", prompt:"Backtracking bugs: not restoring state, wrong pruning condition, missing base case, duplicates in result." },
  { id:"bit-manip",     label:"Bit Manipulation",        difficulty:"Advanced",     color:"#ef4444", prompt:"Bit bugs: wrong shift amount, operator precedence, not masking result, incorrect power-of-two check." },
  { id:"heap",          label:"Heap / Priority Queue",   difficulty:"Advanced",     color:"#ef4444", prompt:"Heap bugs: wrong heap type (min vs max), incorrect push args, not handling empty heap." },
  { id:"trie",          label:"Trie",                    difficulty:"Advanced",     color:"#ef4444", prompt:"Trie bugs: wrong children key, missing end-of-word flag, incorrect prefix check." },
  { id:"union-find",    label:"Union Find (DSU)",        difficulty:"Advanced",     color:"#ef4444", prompt:"DSU bugs: wrong parent init, missing path compression, union by rank error." },
  { id:"segment-tree",  label:"Segment Tree",            difficulty:"Advanced",     color:"#8b5cf6", prompt:"Segment tree bugs: 0-indexed vs 1-indexed mix, wrong range bounds, incorrect build/update." },
  { id:"system-design", label:"System Design Concepts",  difficulty:"Expert",       color:"#8b5cf6", prompt:"Pseudocode bugs in LRU cache, rate limiter, load balancer, consistent hashing." },
]

const CHALLENGES_PER_TOPIC = 3

function getTopicInfo(debugSolved: number) {
  const topicIndex    = Math.floor(debugSolved / CHALLENGES_PER_TOPIC) % CURRICULUM.length
  const solvedInTopic = debugSolved % CHALLENGES_PER_TOPIC
  return { topic: CURRICULUM[topicIndex], topicIndex, solvedInTopic }
}

function buildPrompt(topic: typeof CURRICULUM[0], lang: string, ts: string): string {
  const isBasic   = topic.difficulty === "Basic"
  const codeLines = isBasic ? "5-10" : "10-20"
  const xp        = isBasic ? 15 : topic.difficulty === "Intermediate" ? 25 : topic.difficulty === "Advanced" ? 40 : 50

  return `You are generating ${lang} debugging challenges for CS students learning "${topic.label}".
Difficulty: ${topic.difficulty}
Bug focus: ${topic.prompt}

Generate exactly 3 UNIQUE "find and fix the bug" challenges written in ${lang}.
Each shows realistic ${lang} code with ONE subtle but educational bug.

STRICT rules:
- type = "fix" always
- ALL code must be valid ${lang} syntax
- fullCode = ${codeLines} complete lines with one bug
- snippet = 2-4 lines showing the bug area
- answer = short description of the bug (under 10 words)
- answerAlternatives = 3-5 acceptable phrasings
- explanation = 2-3 sentences: bug, why wrong, how to fix
- ids: "ai-${ts}-1", "ai-${ts}-2", "ai-${ts}-3"

Return ONLY a valid JSON array, no markdown or explanation outside it:
[
  {
    "id": "ai-${ts}-1",
    "type": "fix",
    "title": "Short title",
    "desc": "Find and fix the bug in this ${lang} code.",
    "fullCode": "${lang} code here",
    "snippet": "buggy lines here",
    "answer": "bug in under 10 words",
    "answerAlternatives": ["alt1","alt2","alt3"],
    "explanation": "The bug is X. It causes Y. Fix by Z.",
    "badge": "${topic.difficulty}",
    "color": "${topic.color}",
    "xp": ${xp}
  }
]`
}

async function generateWithOpenAI(topic: typeof CURRICULUM[0], lang: string, seed: number): Promise<any[]> {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error("No OPENAI_API_KEY")
  const langKey = lang.toLowerCase().replace(/[^a-z0-9]/g, "")
  const ts      = `${langKey}-${Date.now() + seed}`

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: buildPrompt(topic, lang, ts) }],
      temperature: 0.85,
      max_tokens: 3000,
    }),
  })
  if (!res.ok) throw new Error(`OpenAI ${res.status}`)
  const data  = await res.json()
  const raw   = data.choices?.[0]?.message?.content?.trim() ?? ""
  const clean = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
  const parsed = JSON.parse(clean)
  return Array.isArray(parsed) ? parsed.slice(0, 3) : []
}

async function generateWithGroq(topic: typeof CURRICULUM[0], lang: string, seed: number): Promise<any[]> {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error("No GROQ_API_KEY")
  const langKey = lang.toLowerCase().replace(/[^a-z0-9]/g, "")
  const ts      = `${langKey}-${Date.now() + seed}`

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: buildPrompt(topic, lang, ts) }],
      temperature: 0.85,
      max_tokens: 2500,
    }),
  })
  if (!res.ok) throw new Error(`Groq ${res.status}`)
  const data  = await res.json()
  const raw   = data.choices?.[0]?.message?.content?.trim() ?? ""
  const clean = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
  const parsed = JSON.parse(clean)
  return Array.isArray(parsed) ? parsed.slice(0, 3) : []
}

function getFallback(topic: typeof CURRICULUM[0], lang: string): any[] {
  const isBasic = topic.difficulty === "Basic"
  const xp      = isBasic ? 15 : topic.difficulty === "Intermediate" ? 25 : 40
  const langKey = lang.toLowerCase().replace(/[^a-z0-9]/g, "")
  const ts      = `${langKey}-${Date.now()}`

  // Language-aware basic fallbacks
  const isPython = lang === "Python"
  const isJS     = lang === "JavaScript" || lang === "TypeScript"
  const isJava   = lang === "Java"

  let code1: string, snip1: string
  if (isPython) {
    code1 = "def find_max(arr):\n    if len(arr) == 0:\n        return None\n    max_val = arr[0]\n    for i in range(1, len(arr) + 1):  # bug\n        if arr[i] > max_val:\n            max_val = arr[i]\n    return max_val\n\nprint(find_max([3, 7, 1, 9]))"
    snip1 = "for i in range(1, len(arr) + 1):  # bug\n    if arr[i] > max_val:"
  } else if (isJS) {
    code1 = "function findMax(arr) {\n  if (arr.length === 0) return null;\n  let max = arr[0];\n  for (let i = 1; i <= arr.length; i++) {  // bug\n    if (arr[i] > max) max = arr[i];\n  }\n  return max;\n}\nconsole.log(findMax([3, 7, 1, 9]));"
    snip1 = "for (let i = 1; i <= arr.length; i++) {  // bug"
  } else if (isJava) {
    code1 = "public static int findMax(int[] arr) {\n    if (arr.length == 0) return -1;\n    int max = arr[0];\n    for (int i = 1; i <= arr.length; i++) {  // bug\n        if (arr[i] > max) max = arr[i];\n    }\n    return max;\n}"
    snip1 = "for (int i = 1; i <= arr.length; i++) {  // bug"
  } else {
    code1 = `# ${lang} - find_max bug\ndef find_max(arr):\n    max_val = arr[0]\n    for i in range(1, len(arr) + 1):  # bug\n        if arr[i] > max_val:\n            max_val = arr[i]\n    return max_val`
    snip1 = `for i in range(1, len(arr) + 1):  # bug`
  }

  return [
    {
      id: `fb-${ts}-1`, type: "fix",
      title: `${topic.label}: Off-by-One`,
      desc: `Find and fix the bug in this ${lang} code.`,
      fullCode: code1, snippet: snip1,
      answer: "loop goes one past end of array",
      answerAlternatives: ["off by one", "index out of bounds", "should be < length not <=", "last index is length-1"],
      explanation: `The loop condition uses <= arr.length (or len(arr)+1) which accesses an index that doesn't exist. Change to < arr.length (or range(1, len(arr))).`,
      badge: topic.difficulty, color: topic.color, xp,
    },
    {
      id: `fb-${ts}-2`, type: "fix",
      title: `${topic.label}: Wrong Condition`,
      desc: `Find and fix the bug in this ${lang} code.`,
      fullCode: isPython
        ? "def count_evens(nums):\n    count = 0\n    for num in nums:\n        if num % 2 == 1:  # bug\n            count += 1\n    return count\n\nprint(count_evens([1, 2, 3, 4, 6]))  # should be 3"
        : `function countEvens(nums) {\n  let count = 0;\n  for (const num of nums) {\n    if (num % 2 === 1) {  // bug\n      count++;\n    }\n  }\n  return count;\n}\nconsole.log(countEvens([1,2,3,4,6]));  // should be 3`,
      snippet: isPython ? "if num % 2 == 1:  # bug" : "if (num % 2 === 1) {  // bug",
      answer: "condition checks odd not even",
      answerAlternatives: ["should be == 0", "wrong modulo check", "1 should be 0", "checks odd instead of even"],
      explanation: "num % 2 == 1 is true for odd numbers. To count evens, the condition should be num % 2 == 0.",
      badge: topic.difficulty, color: topic.color, xp,
    },
    {
      id: `fb-${ts}-3`, type: "fix",
      title: `${topic.label}: Missing Edge Case`,
      desc: `Find and fix the bug in this ${lang} code.`,
      fullCode: isPython
        ? "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:  # bug\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nprint(binary_search([1, 3, 5, 7], 7))  # should return 3"
        : `function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {  // bug\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    else if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\nconsole.log(binarySearch([1,3,5,7], 7));  // should return 3`,
      snippet: isPython ? "while left < right:  # bug" : "while (left < right) {  // bug",
      answer: "should be left <= right",
      answerAlternatives: ["< should be <=", "misses last element", "wrong while condition", "= missing in condition"],
      explanation: "When left == right there is still one element to check. Using < misses it. The fix is while left <= right.",
      badge: topic.difficulty, color: topic.color, xp,
    },
  ]
}

function sanitize(c: any) {
  const { answer, answerAlternatives, ...safe } = c
  return safe
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const db  = await getDatabase()
    const uid = user._id?.toString() ?? ""

    const { searchParams } = new URL(req.url)
    const lang    = (searchParams.get("lang") || "Python").trim()
    const langKey = lang.toLowerCase().replace(/[^a-z0-9]/g, "")

    const progress     = await db.collection("first_year_progress").findOne({ userId: uid })
    const completedIds: string[] = progress?.completedChallenges ?? []

    // Count completions for this specific language
    const debugSolved = completedIds.filter((id: string) =>
      id.startsWith(`ai-${langKey}-`) || id.startsWith(`fb-${langKey}-`)
    ).length

    const { topic, topicIndex, solvedInTopic } = getTopicInfo(debugSolved)
    const cacheKey = `${topic.id}-${langKey}-v3`

    // Use cache if same topic + language
    const cached = await db.collection(COLLECTION).findOne({ userId: uid })
    if (cached?.challenges?.length > 0 && cached.cacheKey === cacheKey) {
      const active = (cached.challenges as any[]).filter(c => !completedIds.includes(c.id))
      if (active.length >= 3) {
        return NextResponse.json({
          challenges: active.slice(0, 3).map(sanitize),
          topic: topic.label, lang,
          topicIndex, totalTopics: CURRICULUM.length,
          solvedInTopic, debugSolved,
        })
      }
    }

    // Generate fresh
    let challenges: any[] = []
    const seed = Math.floor(Math.random() * 100000)
    try {
      challenges = await generateWithOpenAI(topic, lang, seed)
    } catch {
      try {
        challenges = await generateWithGroq(topic, lang, seed)
      } catch {
        challenges = getFallback(topic, lang)
      }
    }
    if (challenges.length < 3) challenges = getFallback(topic, lang)

    await db.collection(COLLECTION).updateOne(
      { userId: uid },
      { $set: { userId: uid, challenges, cacheKey, topicId: topic.id, lang, generatedAt: new Date() } },
      { upsert: true }
    )

    const active = challenges.filter((c: any) => !completedIds.includes(c.id))
    return NextResponse.json({
      challenges: active.slice(0, 3).map(sanitize),
      topic: topic.label, lang,
      topicIndex, totalTopics: CURRICULUM.length,
      solvedInTopic, debugSolved,
    })
  } catch (err) {
    console.error("debug-challenges GET:", err)
    return NextResponse.json({ error: "Failed to load challenges" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    if (searchParams.get("action") !== "refresh") {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }

    const db  = await getDatabase()
    const uid = user._id?.toString() ?? ""
    await db.collection(COLLECTION).deleteOne({ userId: uid })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
