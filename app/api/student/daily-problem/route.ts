/**
 * GET /api/student/daily-problem
 * Returns today's AI-generated coding problem.
 * Difficulty progresses Basic → Intermediate → Advanced based on day-of-year.
 * Cached in DB by date so all users get the same problem and API is called once/day.
 */
import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

// Difficulty progression: first 90 days Basic, next 120 Intermediate, rest Advanced
function getDifficulty(dayOfYear: number): { level: string; color: string } {
  const d = dayOfYear % 365
  if (d < 90)  return { level: "Basic",        color: "#10b981" }
  if (d < 210) return { level: "Intermediate", color: "#f59e0b" }
  return              { level: "Advanced",      color: "#ef4444" }
}

// Topic rotation — 30 topics, cycles every 30 days
const TOPICS = [
  "Variables, data types and basic I/O",
  "Arithmetic and logical operators",
  "Conditionals (if/else/switch)",
  "Loops (for, while, do-while)",
  "Functions and recursion basics",
  "Arrays and array operations",
  "Strings and string manipulation",
  "Searching (linear and binary search)",
  "Sorting (bubble, selection, insertion)",
  "2D arrays and matrices",
  "Linked Lists",
  "Stacks",
  "Queues",
  "Hashing and Hash Maps",
  "Two Pointers technique",
  "Sliding Window technique",
  "Prefix Sum",
  "Recursion and backtracking",
  "Binary Trees and Tree traversal",
  "Binary Search Trees",
  "Graph representation and BFS",
  "Graph DFS and connectivity",
  "Greedy algorithms",
  "Dynamic Programming (1D)",
  "Dynamic Programming (2D)",
  "Bit Manipulation",
  "Heaps and Priority Queues",
  "Tries",
  "Union Find / Disjoint Set",
  "Segment Trees and advanced data structures",
]

function getTodayKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

function getDayOfYear(): number {
  const now   = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / 86400000)
}

async function generateWithOpenAI(topic: string, difficulty: string, dayOfYear: number): Promise<any> {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error("No OPENAI_API_KEY")

  const prompt = `Generate a complete coding problem for a CS student's daily challenge.

Topic: ${topic}
Difficulty: ${difficulty}
Day seed: ${dayOfYear}

Return ONLY a valid JSON object, no markdown:
{
  "title": "Short problem title (5-8 words)",
  "desc": "Clear 2-3 sentence problem description explaining what to do",
  "inputFormat": "Describe the input format (e.g. 'A single string s on one line')",
  "outputFormat": "Describe the output format (e.g. 'Print true or false')",
  "constraints": ["1 <= len(s) <= 1000", "s contains only lowercase letters", "Time limit: 1 second"],
  "input": "Example input value",
  "output": "Expected output for the example",
  "explain": "One sentence explaining how to arrive at the output",
  "difficulty": "${difficulty}",
  "topic": "${topic}",
  "hint": "One helpful hint without giving away the solution"
}`

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    }),
  })

  if (!res.ok) throw new Error(`OpenAI ${res.status}`)
  const data  = await res.json()
  const raw   = data.choices?.[0]?.message?.content?.trim() ?? ""
  const clean = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
  return JSON.parse(clean)
}

// Static fallback pool — used if OpenAI fails
const FALLBACK_POOL = [
  // Basic
  { title: "Sum of Two Numbers",          desc: "Write a program that takes two numbers and prints their sum.", input: "5, 3", output: "8", explain: "Simply add the two numbers.", difficulty:"Basic", topic:"Arithmetic", hint:"Use the + operator." },
  { title: "Reverse a String",            desc: "Reverse a given string without using built-in reverse.", input: '"hello"', output: '"olleh"', explain: "Loop from end to start.", difficulty:"Basic", topic:"Strings", hint:"Use a loop or two pointers." },
  { title: "Check Palindrome",            desc: "Check if a string reads the same forwards and backwards.", input: '"racecar"', output: "true", explain: "Compare with its reverse.", difficulty:"Basic", topic:"Strings", hint:"Compare first and last characters." },
  { title: "FizzBuzz",                    desc: "Print 1 to N. Multiples of 3: Fizz. Multiples of 5: Buzz. Both: FizzBuzz.", input: "15", output: "1 2 Fizz 4 Buzz...FizzBuzz", explain: "Use % operator.", difficulty:"Basic", topic:"Loops", hint:"Check % 15 first, then % 3, then % 5." },
  { title: "Factorial",                   desc: "Compute the factorial of a given non-negative integer.", input: "5", output: "120", explain: "5! = 5×4×3×2×1 = 120.", difficulty:"Basic", topic:"Recursion", hint:"Use a loop or recursion." },
  { title: "Count Vowels",                desc: "Count the number of vowels in a string.", input: '"education"', output: "5", explain: "Check each char against vowels.", difficulty:"Basic", topic:"Strings", hint:"Loop through each character." },
  { title: "Check Even or Odd",           desc: "Return 'Even' if a number is even, 'Odd' otherwise.", input: "7", output: '"Odd"', explain: "n % 2 == 0 means even.", difficulty:"Basic", topic:"Operators", hint:"Use the modulo operator." },
  { title: "Fibonacci Sequence",          desc: "Print the first N Fibonacci numbers.", input: "7", output: "0 1 1 2 3 5 8", explain: "Each term = sum of previous two.", difficulty:"Basic", topic:"Loops", hint:"Use two variables to track previous two terms." },
  { title: "Sum of Digits",               desc: "Compute the sum of all digits of a number.", input: "1234", output: "10", explain: "1+2+3+4 = 10.", difficulty:"Basic", topic:"Operators", hint:"Use % 10 to extract last digit." },
  { title: "Check Prime",                 desc: "Check if a given number is prime.", input: "17", output: "true", explain: "No factor between 2 and sqrt(17).", difficulty:"Basic", topic:"Loops", hint:"Only check divisors up to sqrt(n)." },
  // Intermediate
  { title: "Find Missing Number",         desc: "Array has n-1 integers from 1 to n. Find the missing one.", input: "[1,2,4,5]", output: "3", explain: "Sum(1..n) - sum(array) = missing.", difficulty:"Intermediate", topic:"Arrays", hint:"Use the sum formula n*(n+1)/2." },
  { title: "Two Sum",                     desc: "Find two numbers in array that add up to target. Return their indices.", input: "[2,7,11,15], target=9", output: "[0,1]", explain: "2+7=9, indices 0 and 1.", difficulty:"Intermediate", topic:"Hashing", hint:"Use a hash map to store complements." },
  { title: "Valid Parentheses",           desc: "Check if a string of brackets is valid (every open has matching close).", input: '"()[]{}"', output: "true", explain: "Use a stack to match brackets.", difficulty:"Intermediate", topic:"Stacks", hint:"Push opening brackets, pop on closing." },
  { title: "Reverse Linked List",         desc: "Reverse a singly linked list.", input: "1->2->3->4->5", output: "5->4->3->2->1", explain: "Iteratively reverse next pointers.", difficulty:"Intermediate", topic:"Linked Lists", hint:"Use three pointers: prev, curr, next." },
  { title: "Maximum Subarray",            desc: "Find the contiguous subarray with the largest sum (Kadane's algorithm).", input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6", explain: "[4,-1,2,1] has sum 6.", difficulty:"Intermediate", topic:"Arrays", hint:"Track current sum and max sum." },
  { title: "Binary Search",              desc: "Implement binary search to find target's index in sorted array.", input: "[1,3,5,7,9,11], target=7", output: "3", explain: "7 is at index 3.", difficulty:"Intermediate", topic:"Binary Search", hint:"Use left and right pointers, check mid." },
  { title: "Move Zeroes",                desc: "Move all zeros in array to end, maintaining relative order of non-zeros.", input: "[0,1,0,3,12]", output: "[1,3,12,0,0]", explain: "Shift non-zeros left, fill rest with zeros.", difficulty:"Intermediate", topic:"Two Pointers", hint:"Use a write pointer for non-zero elements." },
  { title: "Merge Two Sorted Arrays",    desc: "Merge two sorted arrays into one sorted array.", input: "[1,3,5], [2,4,6]", output: "[1,2,3,4,5,6]", explain: "Compare front elements, take smaller.", difficulty:"Intermediate", topic:"Sorting", hint:"Use two pointers, one per array." },
  { title: "Count Islands",              desc: "Count number of islands in a 2D grid of 1s (land) and 0s (water).", input: "[[1,1,0],[0,1,0],[0,0,1]]", output: "2", explain: "Connected 1s form one island.", difficulty:"Intermediate", topic:"Graphs", hint:"Use BFS or DFS from each unvisited land cell." },
  { title: "Longest Common Prefix",      desc: "Find the longest common prefix string among an array of strings.", input: '["flower","flow","flight"]', output: '"fl"', explain: "All share 'fl' at the start.", difficulty:"Intermediate", topic:"Strings", hint:"Compare character by character across all strings." },
  // Advanced
  { title: "LRU Cache",                  desc: "Design a data structure for Least Recently Used cache with get and put in O(1).", input: "capacity=2, put(1,1),put(2,2),get(1),put(3,3),get(2)", output: "1, -1", explain: "Key 2 was evicted when 3 was added.", difficulty:"Advanced", topic:"Hashing", hint:"Use a hashmap + doubly linked list." },
  { title: "Word Break",                 desc: "Check if string can be segmented into words from a dictionary.", input: 's="leetcode", words=["leet","code"]', output: "true", explain: '"leetcode" = "leet" + "code".', difficulty:"Advanced", topic:"Dynamic Programming", hint:"Use DP: dp[i] = true if s[0..i] can be segmented." },
  { title: "N-Queens",                   desc: "Place N queens on an N×N board so no two queens attack each other. Return all solutions.", input: "N=4", output: "2 solutions", explain: "Queens cannot share row, column, or diagonal.", difficulty:"Advanced", topic:"Backtracking", hint:"Use backtracking with row-by-row placement." },
  { title: "Serialize Binary Tree",      desc: "Design encode/decode functions for a binary tree to/from a string.", input: "Tree: 1,2,3,null,null,4,5", output: "Encoded then decoded = original tree", explain: "Use preorder traversal with null markers.", difficulty:"Advanced", topic:"Trees", hint:"BFS or preorder with null markers." },
  { title: "Trapping Rain Water",        desc: "Given heights, compute how much water is trapped after raining.", input: "[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explain: "Water fills gaps between taller bars.", difficulty:"Advanced", topic:"Two Pointers", hint:"Use left and right max arrays or two pointers." },
]

export async function GET() {
  try {
    const db       = await getDatabase()
    const todayKey = getTodayKey()
    const dayOfYear = getDayOfYear()

    // Check cache — same problem for all users today
    const cached = await db.collection("daily_problems").findOne({ dateKey: todayKey })
    // Only use cache if it has the new fields (inputFormat etc.)
    if (cached?.problem && cached.problem.inputFormat) {
      return NextResponse.json({ problem: cached.problem, fromCache: true })
    }

    const { level, color } = getDifficulty(dayOfYear)
    const topic = TOPICS[dayOfYear % TOPICS.length]

    // Try OpenAI first
    let problem: any = null
    try {
      problem = await generateWithOpenAI(topic, level, dayOfYear)
      problem.difficulty = level
      problem.color      = color
      problem.topic      = topic
    } catch {
      // Fallback to static pool — pick by day
      const fallback = FALLBACK_POOL[dayOfYear % FALLBACK_POOL.length]
      problem = { ...fallback, color }
    }

    // Cache it for today
    await db.collection("daily_problems").updateOne(
      { dateKey: todayKey },
      { $set: { dateKey: todayKey, problem, generatedAt: new Date() } },
      { upsert: true }
    )

    return NextResponse.json({ problem, fromCache: false })
  } catch (err) {
    console.error("daily-problem GET:", err)
    // Return a fallback without DB
    const dayOfYear = getDayOfYear()
    const { level, color } = getDifficulty(dayOfYear)
    const fallback = FALLBACK_POOL[dayOfYear % FALLBACK_POOL.length]
    return NextResponse.json({ problem: { ...fallback, color, difficulty: level } })
  }
}
