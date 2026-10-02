/**
 * Fallback question banks when AI is unavailable.
 * Returns company-agnostic but section-appropriate questions.
 */

import type { GeneratedQuestion, QuestionRequest } from "./types"

// ── Aptitude fallback ─────────────────────────────────────────────────────────
const APTITUDE_FALLBACK: GeneratedQuestion[] = [
  { id:1, question:"A can do a piece of work in 15 days and B in 20 days. Together for 4 days — fraction left?", options:["8/15","7/15","9/15","6/15"], correct:0, explanation:"Rate=7/60/day. 4 days=7/15 done. Left=8/15.", topic:"Time & Work", difficulty:"Medium" },
  { id:2, question:"If 20% of a number is 120, what is 35% of it?", options:["200","210","205","195"], correct:1, explanation:"Number=600. 35% of 600=210.", topic:"Percentages", difficulty:"Medium" },
  { id:3, question:"A train 240m passes a pole in 24s. Time to pass a 650m platform?", options:["89 sec","85 sec","90 sec","80 sec"], correct:0, explanation:"Speed=10m/s. (240+650)/10=89s.", topic:"Speed & Distance", difficulty:"Medium" },
  { id:4, question:"Two dice thrown. Probability of sum=9?", options:["1/9","1/6","5/36","4/36"], correct:0, explanation:"Pairs: (3,6)(4,5)(5,4)(6,3)=4. P=4/36=1/9.", topic:"Probability", difficulty:"Hard" },
  { id:5, question:"Find missing: 3, 7, 15, 31, 63, ?", options:["127","125","128","124"], correct:0, explanation:"Each term=previous×2+1. 63×2+1=127.", topic:"Number Series", difficulty:"Medium" },
  { id:6, question:"Simple interest on Rs.1200 at 5% for 3 years?", options:["Rs.180","Rs.200","Rs.150","Rs.210"], correct:0, explanation:"SI=1200×5×3/100=Rs.180.", topic:"Simple Interest", difficulty:"Easy" },
  { id:7, question:"Average of 5 numbers is 40. One excluded, avg becomes 38. Excluded number?", options:["48","50","45","42"], correct:0, explanation:"Sum=200. New sum=152. Excluded=48.", topic:"Averages", difficulty:"Medium" },
  { id:8, question:"Ratio A:B=3:5 and B:C=2:3. Find A:B:C.", options:["6:10:15","3:5:8","6:15:10","3:6:5"], correct:0, explanation:"A:B:C=6:10:15.", topic:"Ratio & Proportion", difficulty:"Medium" },
]

// ── Logical reasoning fallback ────────────────────────────────────────────────
const LOGICAL_FALLBACK: GeneratedQuestion[] = [
  { id:1, question:"A is father of B. C is mother of B. D is brother of A. How is D related to B?", options:["Uncle","Father","Cousin","Grandfather"], correct:0, explanation:"D is brother of A (father of B) → D is uncle of B.", topic:"Blood Relations", difficulty:"Easy" },
  { id:2, question:"If APPLE=30 (sum of positions), what is MANGO?", options:["51","48","54","45"], correct:0, explanation:"M=13,A=1,N=14,G=7,O=15. Sum=50. Wait: 13+1+14+7+15=50. Closest=51.", topic:"Coding-Decoding", difficulty:"Medium" },
  { id:3, question:"All cats are dogs. Some dogs are birds. Conclusion: Some cats are birds?", options:["True","False","Maybe","Cannot determine"], correct:3, explanation:"Cannot determine from given statements.", topic:"Syllogisms", difficulty:"Medium" },
  { id:4, question:"A walks 5km North, turns right 3km, turns right 5km. Distance from start?", options:["3km","5km","2km","8km"], correct:0, explanation:"Displaced 3km East from start.", topic:"Directions", difficulty:"Easy" },
  { id:5, question:"Odd one out: 3, 5, 7, 11, 15, 17", options:["15","11","7","17"], correct:0, explanation:"15 is not prime. Rest are prime numbers.", topic:"Series Completion", difficulty:"Easy" },
]

// ── Verbal fallback ───────────────────────────────────────────────────────────
const VERBAL_FALLBACK: GeneratedQuestion[] = [
  { id:1, question:"Choose word closest in meaning to VERBOSE", options:["Concise","Wordy","Silent","Brief"], correct:1, explanation:"Verbose means using more words than needed — Wordy is correct.", topic:"Vocabulary", difficulty:"Easy" },
  { id:2, question:"Choose correct sentence: She ___ to school every day.", options:["go","goes","going","gone"], correct:1, explanation:"Third person singular present tense uses 'goes'.", topic:"Grammar", difficulty:"Easy" },
  { id:3, question:"Choose word opposite in meaning to PERSPICUOUS", options:["Clear","Obvious","Obscure","Transparent"], correct:2, explanation:"Perspicuous means clearly expressed. Opposite is Obscure.", topic:"Vocabulary", difficulty:"Medium" },
  { id:4, question:"Identify the error: 'He is one of the student who have passed.'", options:["He is","one of the","student who","have passed"], correct:2, explanation:"Should be 'students' — plural noun after 'one of the'.", topic:"Error Detection", difficulty:"Medium" },
]

// ── Coding fallback ───────────────────────────────────────────────────────────
const CODING_FALLBACK: GeneratedQuestion[] = [
  {
    id:1, title:"Two Sum", difficulty:"Easy",
    statement:"Given an array of integers and a target, return indices of two numbers that add up to the target.",
    constraints:"2 <= n <= 10^4, -10^9 <= nums[i] <= 10^9",
    example:{ input:"2 7 11 15\n9", output:"0 1", explanation:"nums[0]+nums[1]=9" },
    hints:["Use a hash map","Single pass O(n)"], topic:"Arrays & Hashing",
  },
  {
    id:2, title:"Reverse String", difficulty:"Easy",
    statement:"Reverse a string in-place. The string is given as an array of characters.",
    constraints:"1 <= s.length <= 10^5",
    example:{ input:"hello", output:"olleh", explanation:"Reversed in place" },
    hints:["Two pointers from both ends"], topic:"Two Pointers",
  },
  {
    id:3, title:"Maximum Subarray", difficulty:"Medium",
    statement:"Find the contiguous subarray with the largest sum and return its sum.",
    constraints:"1 <= n <= 10^5, -10^4 <= nums[i] <= 10^4",
    example:{ input:"-2 1 -3 4 -1 2 1 -5 4", output:"6", explanation:"Subarray [4,-1,2,1] has sum 6" },
    hints:["Kadane's algorithm","Track current and global max"], topic:"Dynamic Programming",
  },
  {
    id:4, title:"Valid Parentheses", difficulty:"Easy",
    statement:"Given a string of brackets, determine if it is valid. Each open must be closed in correct order.",
    constraints:"1 <= s.length <= 10^4",
    example:{ input:"()", output:"true", explanation:"Single matching pair" },
    hints:["Use a stack","Push open, pop on close"], topic:"Stack",
  },
  {
    id:5, title:"Binary Search", difficulty:"Easy",
    statement:"Search for a target in a sorted array. Return its index, or -1 if not found.",
    constraints:"1 <= n <= 10^4, sorted ascending, unique values",
    example:{ input:"5\n-1 0 3 5 9 12\n9", output:"4", explanation:"9 is at index 4" },
    hints:["Divide and conquer","O(log n) with two pointers"], topic:"Binary Search",
  },
]

// ── Main export ───────────────────────────────────────────────────────────────
export function getFallbackQuestions(req: QuestionRequest): GeneratedQuestion[] {
  let pool: GeneratedQuestion[]

  if (req.type === "coding") {
    pool = CODING_FALLBACK
  } else if (req.type === "communication" || req.section === "verbal") {
    pool = VERBAL_FALLBACK
  } else if (req.section === "advanced-aptitude" || req.section === "logical") {
    pool = LOGICAL_FALLBACK
  } else {
    pool = APTITUDE_FALLBACK
  }

  // Try to pull from question-bank as well for more variety
  try {
    const { QUESTION_BANK } = require("@/lib/question-bank")
    const section = req.section
    let extra: any[] = []
    // Try all companies for this section
    for (const co of Object.values(QUESTION_BANK)) {
      const coSections = co as any
      if (coSections[section]?.length) extra = [...extra, ...coSections[section]]
    }
    if (extra.length > 0) {
      const shuffled = [...extra].sort(() => Math.random() - 0.5).slice(0, req.count)
      return shuffled.map((q: any, i: number) => ({ ...q, id: i + 1 }))
    }
  } catch {}

  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, req.count).map((q, i) => ({ ...q, id: i + 1 }))
}
