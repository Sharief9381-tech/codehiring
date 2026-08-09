/**
 * Company Coding Profiles
 * Defines exactly how each company structures their coding sections —
 * difficulty, patterns, constraints, time limits — based on real OA data.
 *
 * This is the "knowledge base" our model uses to generate authentic questions.
 */

export type CodingSection = {
  name: string
  description: string
  count: number           // number of problems
  timeMinutes: number     // time allowed
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed"
  patterns: string[]      // which algorithmic patterns appear
  constraints: {          // typical input size constraints
    arraySize: string
    stringLen: string
    treeNodes: string
    graphNodes: string
  }
  style: string[]         // stylistic rules for this section
  avoidPatterns: string[] // patterns that NEVER appear in this section
}

export type CompanyCodingProfile = {
  companyId: string
  companyName: string
  category: string
  sections: Record<string, CodingSection>
  globalStyle: string[]  // rules that apply across all sections
  realExamNotes: string  // notes from real candidates
}

export const COMPANY_CODING_PROFILES: Record<string, CompanyCodingProfile> = {

  tcs: {
    companyId: "tcs",
    companyName: "TCS NQT",
    category: "IT Services",
    globalStyle: [
      "Problems use standard input/output — no custom classes",
      "Always provide 2 clear examples with explanation",
      "Prefer problems solvable within 15-20 minutes",
      "Variable names are descriptive (not single-letter except loop counters)",
      "Output is always a single value: integer, string, boolean, or list",
    ],
    realExamNotes: "TCS NQT has two coding sections. Basic (Section 3) tests simple implementation. Advanced (Section 4) tests DSA — Trees, DP, Graphs. Both sections are solvable in Python/Java/C++.",
    sections: {
      "basic-coding": {
        name: "Basic Coding",
        description: "NQT Section 3 — Implementation-level problems",
        count: 1,
        timeMinutes: 20,
        difficulty: "Easy",
        patterns: [
          "Array Traversal", "String Manipulation", "Math Operations",
          "Counting / Frequency", "Two Pointers", "Simple Sorting",
          "Pattern Printing", "Number Properties", "Basic Recursion",
        ],
        constraints: { arraySize: "1 <= n <= 10^4", stringLen: "1 <= s.length <= 500", treeNodes: "N/A", graphNodes: "N/A" },
        style: [
          "No data structures beyond arrays and strings",
          "Single loop or nested loop solution is sufficient",
          "No external library functions needed",
          "Problem statement under 100 words",
          "Real-world scenario: e.g. counting, reversing, checking properties",
        ],
        avoidPatterns: ["Dynamic Programming", "Graphs", "Trees", "Backtracking", "Heaps"],
      },
      "advanced-coding": {
        name: "Advanced Coding",
        description: "NQT Section 4 — DSA-level problems",
        count: 1,
        timeMinutes: 30,
        difficulty: "Medium",
        patterns: [
          "Binary Search", "Sliding Window", "Hash Map / Hash Set",
          "Stack", "Queue", "Linked List", "Tree DFS", "Tree BFS",
          "Dynamic Programming (1D)", "Greedy", "Merge Sort",
        ],
        constraints: { arraySize: "1 <= n <= 10^5", stringLen: "1 <= s.length <= 10^4", treeNodes: "1 <= nodes <= 10^4", graphNodes: "N/A" },
        style: [
          "Optimal solution is O(n) or O(n log n)",
          "Brute force would TLE — must think of efficient approach",
          "One non-trivial data structure required",
          "2-3 examples covering edge cases",
          "Hints should guide toward the key insight",
        ],
        avoidPatterns: ["Graphs", "Backtracking", "Segment Trees", "Tries"],
      },
    },
  },

  infosys: {
    companyId: "infosys",
    companyName: "Infosys InfyTQ",
    category: "IT Services",
    globalStyle: [
      "Problems are Java/Python friendly",
      "Strong emphasis on OOP and clean code",
      "Usually involves real-world scenarios (bank, library, etc.)",
      "Edge cases explicitly mentioned in constraints",
    ],
    realExamNotes: "InfyTQ has one coding round with 2 problems. First is Easy (array/string), second is Medium (DP or Trees). Emphasis on correct output format.",
    sections: {
      "coding": {
        name: "Coding Assessment",
        description: "InfyTQ Coding Round — 2 problems",
        count: 2,
        timeMinutes: 45,
        difficulty: "Mixed",
        patterns: [
          "Sorting", "String Manipulation", "Array Operations",
          "Hash Map", "Stack", "Recursion", "Basic DP",
          "Binary Search", "Linked List", "Tree Traversal",
        ],
        constraints: { arraySize: "1 <= n <= 10^4", stringLen: "1 <= s.length <= 10^3", treeNodes: "1 <= nodes <= 500", graphNodes: "N/A" },
        style: [
          "Problem 1: Easy — solvable with simple loop",
          "Problem 2: Medium — requires one non-trivial insight",
          "Input via stdin, output to stdout",
          "Real-world framing: inventory, bank account, student records",
        ],
        avoidPatterns: ["Graphs", "Segment Trees", "Bitmasking", "Trie"],
      },
    },
  },

  wipro: {
    companyId: "wipro",
    companyName: "Wipro NLTH",
    category: "IT Services",
    globalStyle: [
      "Problems are straightforward implementation",
      "No advanced DSA required",
      "Prefer problems with clear step-by-step logic",
    ],
    realExamNotes: "Wipro NLTH has 1 coding problem. Very easy — pattern printing, array reversal, string operations. Designed for freshers with basic programming knowledge.",
    sections: {
      "coding": {
        name: "Coding",
        description: "NLTH Coding Round — 1 problem",
        count: 1,
        timeMinutes: 20,
        difficulty: "Easy",
        patterns: [
          "Array Reversal", "String Operations", "Pattern Printing",
          "Math Calculations", "Counting", "Simple Loops",
          "Number Conversion", "Character Operations",
        ],
        constraints: { arraySize: "1 <= n <= 100", stringLen: "1 <= s.length <= 100", treeNodes: "N/A", graphNodes: "N/A" },
        style: [
          "Beginner-level: no DSA knowledge required",
          "Solution is 5-20 lines of code",
          "Output a single line or simple array",
          "No edge cases beyond null/empty input",
        ],
        avoidPatterns: ["DP", "Trees", "Graphs", "Sorting algorithms", "Recursion"],
      },
    },
  },

  amazon: {
    companyId: "amazon",
    companyName: "Amazon OA",
    category: "Product",
    globalStyle: [
      "Problems inspired by Amazon's real services (delivery, warehouse, shopping)",
      "Always has at least one problem that tests optimal algorithm design",
      "Multiple test cases with large constraints — brute force WILL fail",
      "Clean problem statement, no ambiguity",
      "Leadership principles subtly embedded in problem framing",
    ],
    realExamNotes: "Amazon OA has 2 coding problems (90 min). Both are Medium-Hard. Common patterns: sliding window, heaps, graphs, DP. Also includes work simulation questions separately.",
    sections: {
      "coding": {
        name: "Online Assessment",
        description: "Amazon OA — 2 Hard problems",
        count: 2,
        timeMinutes: 90,
        difficulty: "Hard",
        patterns: [
          "Sliding Window", "Two Pointers", "Priority Queue / Heap",
          "BFS / DFS", "Dynamic Programming", "Binary Search on Answer",
          "Hash Map / Hash Set", "Interval Merging", "Greedy with Sorting",
          "Monotonic Stack", "String DP", "Tree DP",
        ],
        constraints: { arraySize: "1 <= n <= 10^5", stringLen: "1 <= s.length <= 10^5", treeNodes: "1 <= nodes <= 10^5", graphNodes: "1 <= V <= 10^4" },
        style: [
          "Amazon context: delivery routes, package sorting, warehouse robots",
          "Optimal solution must be O(n) or O(n log n)",
          "Include 3+ examples — at least one with edge case",
          "Follow-up hint in problem: 'Can you solve in O(n log n)?'",
          "Both problems are Medium-Hard, no Easy problems",
        ],
        avoidPatterns: ["Trivial loops", "Simple string reversal", "Pattern printing"],
      },
    },
  },

  google: {
    companyId: "google",
    companyName: "Google OA",
    category: "Product",
    globalStyle: [
      "Problems are elegant and mathematical",
      "Often have multiple valid approaches",
      "Constraints are very large — requires optimal solution",
      "Problem can be solved multiple ways (brute, better, optimal)",
      "No company-specific context — pure algorithmic problems",
    ],
    realExamNotes: "Google coding screen is 1 problem (60 min). Very Hard. Usually involves advanced DP, graph algorithms, or mathematical insight. Interviewers value clean, readable code.",
    sections: {
      "coding": {
        name: "Coding Screen",
        description: "Google SWE — 1 Very Hard problem",
        count: 1,
        timeMinutes: 60,
        difficulty: "Hard",
        patterns: [
          "Dynamic Programming (2D/Multi-state)", "Graph Algorithms",
          "Topological Sort", "Bellman-Ford", "Divide and Conquer",
          "Segment Tree / BIT", "String Algorithms (KMP, Z-function)",
          "Number Theory", "Combinatorics", "BFS on Implicit Graph",
          "Tree DP", "Bitmask DP",
        ],
        constraints: { arraySize: "1 <= n <= 10^6", stringLen: "1 <= s.length <= 10^6", treeNodes: "1 <= nodes <= 10^5", graphNodes: "1 <= V, E <= 10^5" },
        style: [
          "One elegant, non-trivial problem — no straightforward implementations",
          "Multiple approaches possible — brute O(n²), optimal O(n log n)",
          "Clean mathematical definition in problem statement",
          "3 examples: basic, medium complexity, edge case",
          "Emphasize: 'What is the time and space complexity of your solution?'",
        ],
        avoidPatterns: ["Trivial implementation", "Simple sorting", "Basic string ops"],
      },
    },
  },

  microsoft: {
    companyId: "microsoft",
    companyName: "Microsoft OA",
    category: "Product",
    globalStyle: [
      "Mix of implementation and algorithmic problems",
      "OOP design questions sometimes included",
      "Real-world Microsoft scenarios: file systems, Azure services",
      "Medium difficulty overall — not as hard as Google/Meta",
    ],
    realExamNotes: "Microsoft OA has 3 coding problems (90 min). 1 Easy + 2 Medium. Good balance of arrays, trees, and DP. Clean code is valued.",
    sections: {
      "coding": {
        name: "Online Assessment",
        description: "Microsoft SDE OA — 3 problems",
        count: 3,
        timeMinutes: 90,
        difficulty: "Mixed",
        patterns: [
          "Arrays & Hashing", "Two Pointers", "Sliding Window",
          "Binary Search", "Tree DFS/BFS", "Stack",
          "Dynamic Programming (1D/2D)", "Recursion", "Linked List",
          "String Manipulation", "Sorting",
        ],
        constraints: { arraySize: "1 <= n <= 10^5", stringLen: "1 <= s.length <= 10^4", treeNodes: "1 <= nodes <= 10^4", graphNodes: "1 <= V <= 5000" },
        style: [
          "Problem 1: Easy — warmup (15 min)",
          "Problem 2: Medium — core DSA (35 min)",
          "Problem 3: Medium-Hard — system/design thinking (40 min)",
          "Microsoft scenario: file paths, SQL queries, API design",
        ],
        avoidPatterns: ["Very Hard DP", "Segment Trees", "Advanced Graph Theory"],
      },
    },
  },

  cognizant: {
    companyId: "cognizant",
    companyName: "Cognizant GenC",
    category: "IT Services",
    globalStyle: [
      "Beginner-friendly problems",
      "Strong emphasis on implementation correctness",
      "Prefer problems that test basic programming constructs",
    ],
    realExamNotes: "Cognizant GenC has 1 coding problem. Very Easy level — array operations, string manipulation. Meant for freshers with <1 year experience.",
    sections: {
      "coding": {
        name: "Coding",
        description: "GenC Coding — 1 Easy problem",
        count: 1,
        timeMinutes: 20,
        difficulty: "Easy",
        patterns: [
          "Array Manipulation", "String Operations", "Basic Math",
          "Counting", "Sorting", "Simple Pattern", "Loop Logic",
        ],
        constraints: { arraySize: "1 <= n <= 1000", stringLen: "1 <= s.length <= 200", treeNodes: "N/A", graphNodes: "N/A" },
        style: [
          "Very beginner level — first year CS student should solve it",
          "Problem fits in 3-4 lines of explanation",
          "Standard I/O format",
          "No recursion, no data structures",
        ],
        avoidPatterns: ["DP", "Trees", "Graphs", "Recursion", "Backtracking", "Heaps"],
      },
    },
  },

  capgemini: {
    companyId: "capgemini",
    companyName: "Capgemini",
    category: "IT Services",
    globalStyle: [
      "Mix of pseudo-code and implementation problems",
      "Algorithm output tracing questions (what does this code print?)",
      "Implementation problems are Easy-Medium",
    ],
    realExamNotes: "Capgemini has pseudo-code questions (trace output) and 1-2 implementation problems. Medium difficulty with emphasis on understanding existing code.",
    sections: {
      "coding": {
        name: "Pseudo Code + Coding",
        description: "Capgemini Technical — 2 problems",
        count: 2,
        timeMinutes: 45,
        difficulty: "Mixed",
        patterns: [
          "Array Operations", "String Manipulation", "Sorting",
          "Binary Search", "Hash Map", "Stack", "Basic Recursion",
          "Math Operations", "Two Pointers",
        ],
        constraints: { arraySize: "1 <= n <= 10^4", stringLen: "1 <= s.length <= 500", treeNodes: "N/A", graphNodes: "N/A" },
        style: [
          "Problem 1: Easy — basic implementation",
          "Problem 2: Medium — slightly complex logic",
          "Hint: 'What is the output?' style questions are common",
          "Clean, modular solution preferred",
        ],
        avoidPatterns: ["Graphs", "Trees", "Advanced DP", "Segment Trees"],
      },
    },
  },

  accenture: {
    companyId: "accenture",
    companyName: "Accenture",
    category: "IT Services",
    globalStyle: [
      "Cognitive + technical combination",
      "Arrays, Strings, Linked Lists are most common",
      "No very hard algorithms",
    ],
    realExamNotes: "Accenture has 2 coding problems. First is Easy (arrays/strings). Second is Medium (linked list, stack, or basic DP).",
    sections: {
      "coding": {
        name: "Coding Assessment",
        description: "Accenture Technical — 2 problems",
        count: 2,
        timeMinutes: 45,
        difficulty: "Mixed",
        patterns: [
          "Array Manipulation", "String Processing", "Linked List",
          "Stack / Queue", "Binary Search", "Sorting", "Hash Map",
          "Basic DP", "Math", "Two Pointers",
        ],
        constraints: { arraySize: "1 <= n <= 10^4", stringLen: "1 <= s.length <= 1000", treeNodes: "1 <= nodes <= 500", graphNodes: "N/A" },
        style: [
          "Problem 1: Easy — direct implementation",
          "Problem 2: Medium — one data structure required",
          "Practical scenarios: employee records, transaction processing",
        ],
        avoidPatterns: ["Graphs", "Advanced Trees", "Complex DP", "Backtracking"],
      },
    },
  },

  flipkart: {
    companyId: "flipkart",
    companyName: "Flipkart SDE",
    category: "Startups",
    globalStyle: [
      "E-commerce inspired problems: products, carts, warehouses, deliveries",
      "Emphasis on scalable solutions",
      "System design thinking valued even in coding",
    ],
    realExamNotes: "Flipkart OA has 3 problems (90 min). 1 Easy + 2 Medium-Hard. Common: BFS/DFS, DP, Design questions. E-commerce framing.",
    sections: {
      "coding": {
        name: "SDE Online Assessment",
        description: "Flipkart SDE OA — 3 problems",
        count: 3,
        timeMinutes: 90,
        difficulty: "Hard",
        patterns: [
          "BFS / DFS", "Dynamic Programming", "Sliding Window",
          "Heap / Priority Queue", "Union Find", "Binary Search",
          "Hash Map", "Greedy", "Trie", "Segment Tree",
        ],
        constraints: { arraySize: "1 <= n <= 10^5", stringLen: "1 <= s.length <= 10^5", treeNodes: "1 <= nodes <= 10^5", graphNodes: "1 <= V <= 10^4" },
        style: [
          "Flipkart context: product catalog, delivery optimization, order tracking",
          "Problem 1: Easy (15 min), Problems 2-3: Medium-Hard (70 min total)",
          "Emphasize optimal time complexity",
        ],
        avoidPatterns: ["Trivial implementation", "Pattern printing"],
      },
    },
  },

  jpmorgan: {
    companyId: "jpmorgan",
    companyName: "JP Morgan",
    category: "BFSI",
    globalStyle: [
      "Financial domain problems: portfolios, transactions, risk",
      "Correctness over speed — edge cases matter",
      "Both CS fundamentals and finance logic tested",
    ],
    realExamNotes: "JP Morgan Code for Good / OA has 3 problems. Mix of Medium and Hard. Financial scenario framing. Strong emphasis on correctness and edge case handling.",
    sections: {
      "coding": {
        name: "Technology OA",
        description: "JP Morgan Code for Good — 3 problems",
        count: 3,
        timeMinutes: 90,
        difficulty: "Mixed",
        patterns: [
          "Arrays & Sorting", "Hash Map", "Dynamic Programming",
          "Sliding Window", "BFS / DFS", "Math & Statistics",
          "String Processing", "Binary Search", "Stack / Queue",
        ],
        constraints: { arraySize: "1 <= n <= 10^5", stringLen: "1 <= s.length <= 10^4", treeNodes: "N/A", graphNodes: "1 <= V <= 1000" },
        style: [
          "Financial framing: stock prices, transaction history, portfolio",
          "Problem 1: Easy-Medium (financial calculation)",
          "Problems 2-3: Medium-Hard (algorithmic optimization)",
          "Data validation and edge cases explicitly mentioned",
        ],
        avoidPatterns: ["Advanced graph algorithms", "Segment Trees"],
      },
    },
  },

  zoho: {
    companyId: "zoho",
    companyName: "Zoho",
    category: "Startups",
    globalStyle: [
      "Very long coding test — 3+ hours",
      "Multiple rounds of increasing difficulty",
      "Strong algorithmic depth required",
      "No hints — problem must be solved purely from statement",
    ],
    realExamNotes: "Zoho has a legendary programming contest (3-5 hours). Usually 6-8 problems starting from Easy and going to Very Hard. Emphasis on complete, working solutions.",
    sections: {
      "coding": {
        name: "Programming Contest",
        description: "Zoho Programming Contest — 6 problems",
        count: 6,
        timeMinutes: 180,
        difficulty: "Mixed",
        patterns: [
          "Implementation", "Sorting", "Binary Search", "Hash Map",
          "Recursion / Backtracking", "Dynamic Programming",
          "Graph BFS/DFS", "Tree Algorithms", "Math", "String Algorithms",
          "Greedy", "Divide & Conquer",
        ],
        constraints: { arraySize: "1 <= n <= 10^6", stringLen: "1 <= s.length <= 10^5", treeNodes: "1 <= nodes <= 10^5", graphNodes: "1 <= V <= 10^4" },
        style: [
          "Problems 1-2: Easy (30 min)",
          "Problems 3-4: Medium (60 min)",
          "Problems 5-6: Hard/Very Hard (90 min)",
          "Complete solutions required — partial credit is rare",
          "All programming languages allowed",
        ],
        avoidPatterns: [],
      },
    },
  },
}

// Companies that share similar profiles — used for fallback
export const CATEGORY_DEFAULT_PROFILES: Record<string, Partial<CodingSection>> = {
  "IT Services": {
    difficulty: "Easy",
    count: 1,
    timeMinutes: 20,
    patterns: ["Array Traversal", "String Manipulation", "Basic Math", "Sorting", "Hash Map"],
    constraints: { arraySize: "1 <= n <= 10^4", stringLen: "1 <= s.length <= 500", treeNodes: "N/A", graphNodes: "N/A" },
    style: ["Beginner-friendly", "Standard I/O", "Single data structure max"],
    avoidPatterns: ["Graphs", "Complex DP", "Segment Trees", "Tries"],
  },
  "Product": {
    difficulty: "Hard",
    count: 2,
    timeMinutes: 90,
    patterns: ["Dynamic Programming", "Graphs", "Sliding Window", "Binary Search", "Heap"],
    constraints: { arraySize: "1 <= n <= 10^5", stringLen: "1 <= s.length <= 10^5", treeNodes: "1 <= nodes <= 10^5", graphNodes: "1 <= V <= 10^4" },
    style: ["Optimal O(n log n) required", "Real-world framing", "Multiple examples"],
    avoidPatterns: ["Trivial implementation"],
  },
  "Startups": {
    difficulty: "Hard",
    count: 3,
    timeMinutes: 90,
    patterns: ["BFS/DFS", "DP", "Heap", "Sliding Window", "Hash Map"],
    constraints: { arraySize: "1 <= n <= 10^5", stringLen: "1 <= s.length <= 10^5", treeNodes: "1 <= nodes <= 10^4", graphNodes: "1 <= V <= 10^4" },
    style: ["Product-context framing", "Optimal solution required"],
    avoidPatterns: [],
  },
  "BFSI": {
    difficulty: "Mixed",
    count: 3,
    timeMinutes: 90,
    patterns: ["Arrays", "Sorting", "Hash Map", "DP", "Math"],
    constraints: { arraySize: "1 <= n <= 10^5", stringLen: "1 <= s.length <= 10^4", treeNodes: "N/A", graphNodes: "1 <= V <= 1000" },
    style: ["Financial framing", "Edge case emphasis"],
    avoidPatterns: ["Segment Trees", "Trie"],
  },
  "Consulting": {
    difficulty: "Easy",
    count: 1,
    timeMinutes: 30,
    patterns: ["Array Operations", "Sorting", "String Manipulation", "Basic Math"],
    constraints: { arraySize: "1 <= n <= 1000", stringLen: "1 <= s.length <= 200", treeNodes: "N/A", graphNodes: "N/A" },
    style: ["Beginner level", "Clear step-by-step logic"],
    avoidPatterns: ["DP", "Trees", "Graphs"],
  },
  "Core Engg": {
    difficulty: "Medium",
    count: 2,
    timeMinutes: 60,
    patterns: ["Bit Manipulation", "Arrays", "Sorting", "Math", "C-style operations"],
    constraints: { arraySize: "1 <= n <= 10^5", stringLen: "1 <= s.length <= 1000", treeNodes: "N/A", graphNodes: "N/A" },
    style: ["Low-level thinking", "C/C++ compatible patterns"],
    avoidPatterns: ["High-level design patterns"],
  },
}

/** Get a company's coding profile. Falls back to category default if not defined. */
export function getCompanyCodingProfile(companyId: string, category: string): CompanyCodingProfile | null {
  if (COMPANY_CODING_PROFILES[companyId]) {
    return COMPANY_CODING_PROFILES[companyId]
  }

  // Build a default profile from category
  const catDefault = CATEGORY_DEFAULT_PROFILES[category] ?? CATEGORY_DEFAULT_PROFILES["IT Services"]
  return {
    companyId,
    companyName: companyId,
    category,
    globalStyle: catDefault.style ?? [],
    realExamNotes: `${category} company coding assessment`,
    sections: {
      coding: {
        name: "Coding Assessment",
        description: `${category} standard coding round`,
        count: catDefault.count ?? 2,
        timeMinutes: catDefault.timeMinutes ?? 60,
        difficulty: catDefault.difficulty as any ?? "Medium",
        patterns: catDefault.patterns ?? [],
        constraints: catDefault.constraints ?? { arraySize: "1 <= n <= 10^4", stringLen: "1 <= s.length <= 500", treeNodes: "N/A", graphNodes: "N/A" },
        style: catDefault.style ?? [],
        avoidPatterns: catDefault.avoidPatterns ?? [],
      },
    },
  }
}
