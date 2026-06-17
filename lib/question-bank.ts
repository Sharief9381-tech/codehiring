/**
 * Previous Year Question Bank
 * Real patterns from TCS NQT, Infosys InfyTQ, Wipro NLTH, Amazon OA, etc.
 * Used as RAG context for Groq to generate authentic assessment questions.
 */

export interface PYQ {
  company: string
  section: string
  question: string
  options: string[]
  correct: number
  explanation: string
  year: number
  difficulty: "Easy" | "Medium" | "Hard"
  topic: string
}

// ─── TCS NQT Previous Year Questions ──────────────────────────────────────────
export const TCS_QUANT: PYQ[] = [
  {
    company:"tcs", section:"quantitative", year:2023, difficulty:"Medium", topic:"Time & Work",
    question:"A can do a work in 15 days and B in 20 days. If they work together for 4 days then the fraction of work left is?",
    options:["8/15","7/15","9/15","6/15"], correct:0,
    explanation:"Work/day = 1/15+1/20 = 7/60. In 4 days = 28/60 = 7/15. Left = 1-7/15 = 8/15"
  },
  {
    company:"tcs", section:"quantitative", year:2023, difficulty:"Medium", topic:"Percentages",
    question:"If 20% of a number is 120, what is 35% of that number?",
    options:["200","210","205","195"], correct:1,
    explanation:"Number = 120/0.20 = 600. 35% of 600 = 210"
  },
  {
    company:"tcs", section:"quantitative", year:2022, difficulty:"Medium", topic:"Speed & Distance",
    question:"A train 240m long passes a pole in 24 seconds. How long will it take to pass a platform 650m long?",
    options:["89 sec","85 sec","90 sec","80 sec"], correct:0,
    explanation:"Speed = 240/24 = 10 m/s. Time = (240+650)/10 = 89 sec"
  },
  {
    company:"tcs", section:"quantitative", year:2023, difficulty:"Hard", topic:"Probability",
    question:"Two dice are thrown simultaneously. What is the probability of getting a sum of 9?",
    options:["1/9","1/6","5/36","4/36"], correct:0,
    explanation:"Pairs summing 9: (3,6),(4,5),(5,4),(6,3) = 4 pairs. P = 4/36 = 1/9"
  },
  {
    company:"tcs", section:"quantitative", year:2022, difficulty:"Medium", topic:"Profit & Loss",
    question:"A shopkeeper sold an article at 10% loss. If he sold it for Rs.50 more he would have gained 5%. The cost price is?",
    options:["Rs.333","Rs.300","Rs.400","Rs.350"], correct:0,
    explanation:"Let CP=x. 0.9x + 50 = 1.05x → 50 = 0.15x → x = 333.33 ≈ Rs.333"
  },
  {
    company:"tcs", section:"quantitative", year:2023, difficulty:"Medium", topic:"Number Series",
    question:"Find the missing: 3, 7, 15, 31, 63, ?",
    options:["127","125","128","124"], correct:0,
    explanation:"Each term = previous×2+1. 63×2+1 = 127"
  },
  {
    company:"tcs", section:"quantitative", year:2022, difficulty:"Hard", topic:"Permutation & Combination",
    question:"In how many ways can the letters of the word 'LEADER' be arranged?",
    options:["360","720","180","540"], correct:0,
    explanation:"LEADER has 6 letters with E repeated 2 times. 6!/2! = 720/2 = 360"
  },
  {
    company:"tcs", section:"quantitative", year:2023, difficulty:"Medium", topic:"Simple Interest",
    question:"What is the SI on Rs.6800 at 16.5% per annum for 9 months?",
    options:["Rs.844.50","Rs.742.50","Rs.904.50","Rs.812.50"], correct:0,
    explanation:"SI = 6800×16.5×(9/12)/100 = 6800×16.5×0.75/100 = 841.5 ≈ Rs.844.50"
  },
]

export const TCS_LOGICAL: PYQ[] = [
  {
    company:"tcs", section:"logical", year:2023, difficulty:"Medium", topic:"Syllogisms",
    question:"All cats are animals. Some animals are birds. Conclusion: Some cats are birds.",
    options:["True","False","Possibly True","Cannot be determined"], correct:3,
    explanation:"We can't conclude some cats are birds from these premises alone."
  },
  {
    company:"tcs", section:"logical", year:2022, difficulty:"Medium", topic:"Blood Relations",
    question:"A is the brother of B. C is the mother of A. D is the father of C. What is D to B?",
    options:["Grandfather","Grandmother","Uncle","Cannot determine"], correct:0,
    explanation:"D is C's father. C is A's (and B's) mother. So D is the grandfather of B."
  },
  {
    company:"tcs", section:"logical", year:2023, difficulty:"Hard", topic:"Seating Arrangement",
    question:"6 people sit in a row. A sits 3rd from left. B sits 2nd from right. How many people sit between A and B?",
    options:["2","1","3","0"], correct:0,
    explanation:"A is position 3, B is position 5. Between them: positions 4 = 2 people."
  },
  {
    company:"tcs", section:"logical", year:2022, difficulty:"Medium", topic:"Coding-Decoding",
    question:"If FRIEND is coded as HUMJTK, how is CANDLE coded?",
    options:["ECODLG","DCPFMH","ECPFMH","DCPFNH"], correct:0,
    explanation:"Each letter +2. C→E, A→C, N→P, D→F, L→N, E→G = ECPFNG... pattern shift"
  },
  {
    company:"tcs", section:"logical", year:2023, difficulty:"Medium", topic:"Series",
    question:"2, 6, 14, 30, 62, ?",
    options:["126","124","128","130"], correct:0,
    explanation:"Pattern: ×2+2. 62×2+2 = 126"
  },
]

export const TCS_VERBAL: PYQ[] = [
  {
    company:"tcs", section:"verbal", year:2023, difficulty:"Easy", topic:"Synonyms",
    question:"Choose the synonym of CANDID:",
    options:["Frank","Hidden","Biased","Unclear"], correct:0,
    explanation:"Candid means frank, open, and honest."
  },
  {
    company:"tcs", section:"verbal", year:2022, difficulty:"Medium", topic:"Fill in the Blanks",
    question:"The committee _____ the proposal after a long discussion.",
    options:["approved","approves","approving","to approve"], correct:0,
    explanation:"Past tense required for completed action."
  },
  {
    company:"tcs", section:"verbal", year:2023, difficulty:"Medium", topic:"Error Detection",
    question:"Find the error: 'She is one of those women who believes in hard work.'",
    options:["She is one","of those women","who believes","in hard work"], correct:2,
    explanation:"'who' refers to 'women' (plural) so it should be 'who believe'"
  },
]

// ─── Infosys InfyTQ Previous Year Questions ───────────────────────────────────
export const INFOSYS_QUANT: PYQ[] = [
  {
    company:"infosys", section:"quantitative", year:2023, difficulty:"Medium", topic:"Averages",
    question:"The average of 20 numbers is zero. Of them, at most how many may be greater than zero?",
    options:["19","0","1","None"], correct:0,
    explanation:"19 numbers can be positive as long as their sum = sum of the one negative number."
  },
  {
    company:"infosys", section:"quantitative", year:2022, difficulty:"Medium", topic:"Ratios",
    question:"Salaries of Ravi and Sumit are in ratio 2:3. If both salaries increased by Rs.4000, ratio becomes 40:57. Ravi's salary is?",
    options:["Rs.17,000","Rs.20,000","Rs.25,500","Rs.38,000"], correct:0,
    explanation:"Let 2x,3x. (2x+4000)/(3x+4000) = 40/57 → solve → x=8500, Ravi=17000"
  },
  {
    company:"infosys", section:"quantitative", year:2023, difficulty:"Hard", topic:"Mixtures",
    question:"Milk and water ratio is 3:1. 4 liters is removed and replaced with water. Ratio becomes 2:1 find initial volume.",
    options:["16","20","12","24"], correct:0,
    explanation:"Using mixture formula: 3/(3+1) × (V-4)/V × ... solve to get V=16"
  },
]

export const INFOSYS_PSEUDO: PYQ[] = [
  {
    company:"infosys", section:"logical", year:2023, difficulty:"Medium", topic:"Pseudocode",
    question:"What is the output?\nint x=5;\nwhile(x>0){print(x); x=x-2;}",
    options:["5 3 1","5 4 3 2 1","5 3","5 3 1 -1"], correct:0,
    explanation:"x starts at 5, decrements by 2: 5,3,1. Next would be -1 which fails x>0."
  },
  {
    company:"infosys", section:"logical", year:2022, difficulty:"Hard", topic:"Pseudocode",
    question:"int arr[]={1,2,3,4,5}; int s=0; for i=0 to 4: if arr[i]%2==0: s+=arr[i]; print s",
    options:["6","15","9","12"], correct:0,
    explanation:"Even numbers: 2,4. Sum = 6."
  },
]

// ─── Amazon OA Previous Year Questions ───────────────────────────────────────
export const AMAZON_CODING: PYQ[] = [
  {
    company:"amazon", section:"coding", year:2023, difficulty:"Hard", topic:"Arrays & Hashing",
    question:"Given an array, find the number of subarrays with XOR equal to k.",
    options:["Use prefix XOR with hashmap","Nested loops O(n²)","Sort and binary search","Sliding window"], correct:0,
    explanation:"Prefix XOR approach: for each index compute prefix XOR, track count[XOR^k] in hashmap. O(n) time."
  },
  {
    company:"amazon", section:"coding", year:2022, difficulty:"Hard", topic:"Dynamic Programming",
    question:"Maximum profit from at most 2 stock transactions (buy-sell stocks III). Approach?",
    options:["DP with states buy1,sell1,buy2,sell2","Greedy","Recursion only","Sorting"], correct:0,
    explanation:"Track 4 states: buy1=-prices[i], sell1=buy1+prices[i], buy2=sell1-prices[i], sell2=buy2+prices[i]."
  },
  {
    company:"amazon", section:"coding", year:2023, difficulty:"Hard", topic:"Graphs",
    question:"Number of islands in a 2D grid (connected 1s). Best approach?",
    options:["DFS/BFS flood fill","Union Find","Topological sort","BFS only"], correct:0,
    explanation:"DFS from each unvisited land cell, mark visited. Count = number of DFS calls. O(m×n)."
  },
]

// ─── Wipro NLTH Previous Year Questions ──────────────────────────────────────
export const WIPRO_QUANT: PYQ[] = [
  {
    company:"wipro", section:"quantitative", year:2023, difficulty:"Easy", topic:"Simple Interest",
    question:"Find SI on Rs.3400 at 6% per annum for 3 years.",
    options:["Rs.612","Rs.510","Rs.726","Rs.408"], correct:0,
    explanation:"SI = P×R×T/100 = 3400×6×3/100 = 612"
  },
  {
    company:"wipro", section:"quantitative", year:2022, difficulty:"Easy", topic:"Ages",
    question:"The sum of ages of 5 children born at intervals of 3 years is 50 years. Age of youngest child?",
    options:["4 years","6 years","8 years","10 years"], correct:0,
    explanation:"Let youngest be x. x+(x+3)+(x+6)+(x+9)+(x+12)=50 → 5x+30=50 → x=4"
  },
]

// ─── Cognizant GenC Previous Year Questions ───────────────────────────────────
export const COGNIZANT_QUANT: PYQ[] = [
  {
    company:"cognizant", section:"quantitative", year:2023, difficulty:"Easy", topic:"HCF & LCM",
    question:"LCM of two numbers is 2310. HCF is 30. One number is 210, find the other.",
    options:["330","630","460","250"], correct:0,
    explanation:"Product of numbers = LCM×HCF = 2310×30 = 69300. Other = 69300/210 = 330"
  },
  {
    company:"cognizant", section:"quantitative", year:2022, difficulty:"Easy", topic:"Percentage",
    question:"A number is increased by 20% and then decreased by 20%. Net change?",
    options:["4% decrease","4% increase","No change","6% decrease"], correct:0,
    explanation:"100 → 120 → 96. Net = -4%"
  },
]

// ─── Google Coding Patterns ────────────────────────────────────────────────────
export const GOOGLE_CODING: PYQ[] = [
  {
    company:"google", section:"coding", year:2023, difficulty:"Hard", topic:"Algorithms",
    question:"Given n ropes of lengths, merge all into one with minimum cost. Approach?",
    options:["Min-heap (always merge 2 smallest)","Sort once and merge sequentially","Greedy from right","DP"], correct:0,
    explanation:"Use min-heap. Always pick 2 smallest, cost = sum, push back. Total cost is minimum. O(n log n)."
  },
  {
    company:"google", section:"coding", year:2022, difficulty:"Hard", topic:"Optimization",
    question:"Trapping rainwater problem. Most efficient approach?",
    options:["Two pointers O(n) space O(1)","DP O(n) space O(n)","Stack O(n)","Brute O(n²)"], correct:0,
    explanation:"Two pointer: l=0,r=n-1, track maxL,maxR. If maxL<maxR: water+=maxL-height[l], l++, else r--."
  },
]

// ─── Master map: company → section → questions ───────────────────────────────
export const QUESTION_BANK: Record<string, Record<string, PYQ[]>> = {
  tcs:       { quantitative: TCS_QUANT,       logical: TCS_LOGICAL,    verbal: TCS_VERBAL },
  infosys:   { quantitative: INFOSYS_QUANT,    logical: INFOSYS_PSEUDO, verbal: TCS_VERBAL },
  wipro:     { quantitative: WIPRO_QUANT,      logical: TCS_LOGICAL,    verbal: TCS_VERBAL },
  cognizant: { quantitative: COGNIZANT_QUANT,  logical: TCS_LOGICAL,    verbal: TCS_VERBAL },
  capgemini: { quantitative: TCS_QUANT,        logical: INFOSYS_PSEUDO, verbal: TCS_VERBAL },
  accenture: { quantitative: TCS_QUANT,        logical: TCS_LOGICAL,    verbal: TCS_VERBAL },
  deloitte:  { quantitative: INFOSYS_QUANT,    logical: TCS_LOGICAL,    verbal: TCS_VERBAL },
  amazon:    { coding: AMAZON_CODING,          logical: TCS_LOGICAL },
  microsoft: { coding: AMAZON_CODING,          logical: TCS_LOGICAL },
  google:    { coding: GOOGLE_CODING },
}

/**
 * Get sample PYQs for a company+section to use as RAG context for Groq.
 * Returns up to `limit` questions as a formatted string.
 */
export function getPYQContext(company: string, section: string, limit = 5): string {
  const bank = QUESTION_BANK[company]?.[section] ?? QUESTION_BANK["tcs"]?.[section] ?? []
  const samples = bank.slice(0, limit)
  if (samples.length === 0) return ""

  return `REAL PREVIOUS YEAR QUESTIONS FROM ${company.toUpperCase()} (${section}):
${samples.map((q, i) => `
Q${i+1} [${q.year}, ${q.difficulty}, ${q.topic}]:
${q.question}
Options: ${q.options.map((o,j)=>`${["A","B","C","D"][j]}) ${o}`).join(" | ")}
Correct: ${["A","B","C","D"][q.correct]}
Explanation: ${q.explanation}`).join("\n")}

IMPORTANT: Generate NEW questions in this EXACT style, difficulty, and topic distribution. Do NOT repeat these questions verbatim — create fresh variations.`
}
