/**
 * Company Hiring Pattern Fetcher
 * Uses RAG (web scraping + AI) to discover current hiring patterns.
 * Falls back to hardcoded accurate patterns for major companies.
 * Results cached in MongoDB for 7 days.
 */

import { getDatabase } from "@/lib/database"

const PATTERN_CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface SectionPattern {
  id:          string   // "quantitative" | "advanced-aptitude" | "verbal" | "basic-coding" | "advanced-coding"
  name:        string
  questions:   number
  timeMinutes: number
  difficulty:  string
  topics:      string[]
  isCoding:    boolean
}

export interface CompanyPattern {
  company:        string
  companyName:    string
  fetchedAt:      Date
  source:         string
  totalQuestions: number
  totalTime:      number
  sections:       SectionPattern[]
  notes:          string
}

// ── Hardcoded accurate patterns for major companies ───────────────────────────
// These are used as fallback when web fetch/AI extraction fails
const FALLBACK_PATTERNS: Record<string, Omit<CompanyPattern, "company"|"companyName"|"fetchedAt"|"source">> = {
  tcs: {
    totalQuestions: 85, totalTime: 190,
    sections: [
      { id:"quantitative", name:"Numerical Ability", questions:20, timeMinutes:40, difficulty:"Medium", topics:["Percentages","Time & Work","Speed & Distance","Profit & Loss","Number Series","Probability","Simple Interest"], isCoding:false },
      { id:"advanced-aptitude", name:"Reasoning Ability", questions:30, timeMinutes:50, difficulty:"Medium", topics:["Syllogisms","Blood Relations","Seating Arrangement","Coding-Decoding","Puzzles","Series","Directions"], isCoding:false },
      { id:"verbal", name:"Verbal Ability", questions:24, timeMinutes:30, difficulty:"Easy-Medium", topics:["Synonyms","Antonyms","Fill in the Blanks","Error Detection","Sentence Completion","Para Jumbles"], isCoding:false },
      { id:"basic-coding", name:"Programming Logic", questions:10, timeMinutes:20, difficulty:"Easy", topics:["Loops","Arrays","Strings","Basic Math","Pattern Printing"], isCoding:false },
      { id:"advanced-coding", name:"Coding", questions:1, timeMinutes:30, difficulty:"Medium", topics:["Arrays","Strings","Basic DP","Recursion","Sorting"], isCoding:true },
    ],
    notes:"No negative marking. Foundation section mandatory. Advanced section for Digital/Prime track.",
  },
  infosys: {
    totalQuestions: 65, totalTime: 95,
    sections: [
      { id:"quantitative", name:"Quantitative Aptitude", questions:15, timeMinutes:25, difficulty:"Medium", topics:["Ratios","Averages","Mixtures","Algebra","Geometry","Probability"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning", questions:15, timeMinutes:25, difficulty:"Medium", topics:["Puzzles","Series Completion","Directions","Analogy","Data Interpretation","Pseudocode"], isCoding:false },
      { id:"verbal", name:"Verbal Ability", questions:20, timeMinutes:20, difficulty:"Easy-Medium", topics:["Reading Comprehension","Grammar","Vocabulary","Error Correction"], isCoding:false },
      { id:"advanced-coding", name:"Coding", questions:2, timeMinutes:180, difficulty:"Medium", topics:["Arrays","Strings","Sorting","DP","Recursion","Trees","Hash Map"], isCoding:true },
    ],
    notes:"Separate 3-hour coding round. Sectional cutoffs apply.",
  },
  wipro: {
    totalQuestions: 55, totalTime: 60,
    sections: [
      { id:"quantitative", name:"Aptitude", questions:16, timeMinutes:16, difficulty:"Easy-Medium", topics:["Percentages","SI/CI","Mensuration","Time & Distance","Permutation & Combination"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning", questions:14, timeMinutes:14, difficulty:"Easy-Medium", topics:["Statement & Assumption","Course of Action","Analogy","Series","Directions"], isCoding:false },
      { id:"verbal", name:"Written Communication", questions:1, timeMinutes:20, difficulty:"Easy", topics:["Essay Writing"], isCoding:false },
      { id:"advanced-coding", name:"Coding", questions:1, timeMinutes:60, difficulty:"Easy-Medium", topics:["Arrays","Strings","Math","Sorting"], isCoding:true },
    ],
    notes:"Essay writing section. No sectional cutoffs.",
  },
  cognizant: {
    totalQuestions: 55, totalTime: 120,
    sections: [
      { id:"quantitative", name:"Aptitude + Reasoning + Verbal", questions:24, timeMinutes:45, difficulty:"Easy-Medium", topics:["Arithmetic","Algebra","Data Interpretation","Logical Reasoning","Grammar","Comprehension"], isCoding:false },
      { id:"advanced-aptitude", name:"Technical MCQ", questions:20, timeMinutes:30, difficulty:"Easy-Medium", topics:["C Programming","OOP","Data Structures","DBMS","OS","Networking"], isCoding:false },
      { id:"advanced-coding", name:"Coding", questions:2, timeMinutes:60, difficulty:"Easy-Medium", topics:["Arrays","Strings","Sorting","Hash Map","Basic DP"], isCoding:true },
    ],
    notes:"GenC Elevate track includes Technical MCQ section.",
  },
  hcl: {
    totalQuestions: 55, totalTime: 75,
    notes: "HCL TechBee / GET. No negative marking. Sectional time limits apply.",
    sections: [
      { id:"quantitative",    name:"Quantitative Ability",  questions:15, timeMinutes:20, difficulty:"Easy-Medium", topics:["Percentages","Time & Work","Speed & Distance","Averages","Number Series","Simple Interest","Profit & Loss","Ratio & Proportion"], isCoding:false },
      { id:"advanced-aptitude",name:"Logical Reasoning",   questions:15, timeMinutes:20, difficulty:"Easy-Medium", topics:["Blood Relations","Directions","Coding-Decoding","Series Completion","Analogies","Statement & Conclusion","Syllogisms","Puzzles"],   isCoding:false },
      { id:"verbal",          name:"Verbal Ability",        questions:15, timeMinutes:15, difficulty:"Easy",        topics:["Synonyms/Antonyms","Fill in the Blanks","Reading Comprehension","Error Detection","Sentence Completion","Idioms & Phrases"],    isCoding:false },
      { id:"basic-coding",    name:"Basic Programming",     questions:5,  timeMinutes:10, difficulty:"Easy",        topics:["Loops","Arrays","String Operations","Basic Math","Pattern Printing","Conditional Logic"],                                         isCoding:false },
      { id:"advanced-coding", name:"Coding",                questions:1,  timeMinutes:30, difficulty:"Easy-Medium", topics:["Arrays","Strings","Sorting","Basic Recursion","Math Problems","Hash Map"],                                                       isCoding:true  },
    ],
  },
  capgemini: {
    totalQuestions: 60, totalTime: 90,
    sections: [
      { id:"quantitative", name:"Quantitative Aptitude", questions:16, timeMinutes:16, difficulty:"Medium", topics:["Number System","Averages","Time-Work","Mensuration","Algebra"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning", questions:10, timeMinutes:10, difficulty:"Medium", topics:["Series","Analogy","Odd One Out","Matrix","Puzzle"], isCoding:false },
      { id:"verbal", name:"Verbal Ability", questions:10, timeMinutes:10, difficulty:"Easy", topics:["Fill Blanks","Error Correction","Reading Comprehension"], isCoding:false },
      { id:"basic-coding", name:"Pseudo Code", questions:5, timeMinutes:5, difficulty:"Easy", topics:["Algorithm Tracing","Code Completion","Array Logic"], isCoding:false },
      { id:"advanced-coding", name:"Coding", questions:1, timeMinutes:30, difficulty:"Medium", topics:["Binary Search","Sorting","Hash Map","Stack","Two Pointers"], isCoding:true },
    ],
    notes:"Essay round after technical test. Separate HR round.",
  },
  accenture: {
    totalQuestions: 90, totalTime: 90,
    sections: [
      { id:"quantitative", name:"Cognitive Ability", questions:90, timeMinutes:90, difficulty:"Medium", topics:["Data Interpretation","Number Systems","Profit/Loss","Ages","Percentages","Syllogisms","Puzzles","Reading Comprehension"], isCoding:false },
      { id:"advanced-coding", name:"Coding", questions:2, timeMinutes:45, difficulty:"Easy-Medium", topics:["Arrays","Strings","Basic loops","Sorting","Hash Map","Basic DP"], isCoding:true },
    ],
    notes:"Cognitive assessment is 90 questions mixed quant+logical+verbal. Separate coding round.",
  },
  amazon: {
    totalQuestions: 3, totalTime: 90,
    sections: [
      { id:"basic-coding", name:"Coding Round 1", questions:2, timeMinutes:75, difficulty:"Medium-Hard", topics:["Sliding Window","Two Pointers","Hash Map","Arrays","Priority Queue","BFS/DFS"], isCoding:true },
      { id:"advanced-coding", name:"Debugging/Work Simulation", questions:1, timeMinutes:15, difficulty:"Medium", topics:["Debugging","Code Fix","Work Simulation"], isCoding:true },
    ],
    notes:"Strong focus on Leadership Principles. Work simulation included.",
  },
  google: {
    totalQuestions: 2, totalTime: 60,
    sections: [
      { id:"advanced-coding", name:"Coding Screen", questions:2, timeMinutes:60, difficulty:"Hard", topics:["Dynamic Programming","Graph Algorithms","Tree DP","Bitmask DP","Topological Sort","Advanced Data Structures"], isCoding:true },
    ],
    notes:"Phone screen. Very hard. Focus on optimal solutions.",
  },
  microsoft: {
    totalQuestions: 3, totalTime: 90,
    sections: [
      { id:"basic-coding", name:"Coding Round 1", questions:2, timeMinutes:60, difficulty:"Medium", topics:["Arrays","Hash Map","String Manipulation","Binary Search","Stack","Tree DFS/BFS"], isCoding:true },
      { id:"advanced-coding", name:"Coding Round 2", questions:1, timeMinutes:30, difficulty:"Medium-Hard", topics:["Dynamic Programming","Recursion","Linked List","Graphs"], isCoding:true },
    ],
    notes:"Culture fit + technical rounds. Emphasis on code quality.",
  },
  deloitte: {
    totalQuestions: 50, totalTime: 80,
    sections: [
      { id:"quantitative", name:"Quantitative Aptitude", questions:20, timeMinutes:30, difficulty:"Medium", topics:["Data Tables","Charts","Business Math","Percentages","Ratios"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning", questions:15, timeMinutes:25, difficulty:"Medium", topics:["Deductive Reasoning","Abstract Patterns","Syllogisms","Sequences"], isCoding:false },
      { id:"verbal", name:"Verbal Ability", questions:15, timeMinutes:25, difficulty:"Medium", topics:["Critical Reasoning","Sentence Completion","Reading Comprehension"], isCoding:false },
    ],
    notes:"No coding round for consulting roles. Technical roles may have additional rounds.",
  },
  jpmorgan: {
    totalQuestions: 4, totalTime: 120,
    sections: [
      { id:"quantitative", name:"Quantitative Aptitude", questions:20, timeMinutes:30, difficulty:"Medium", topics:["Data Interpretation","Business Math","Percentages","Financial Concepts"], isCoding:false },
      { id:"advanced-coding", name:"Code for Good / OA Coding", questions:2, timeMinutes:75, difficulty:"Hard", topics:["Dynamic Programming","Graph Algorithms","Binary Search","Data Structures"], isCoding:true },
    ],
    notes:"Code for Good contest or OA coding challenge. Financial aptitude may be tested.",
  },
  // ── Additional IT Services ──────────────────────────────────────────────────
  "tech-mahindra": {
    totalQuestions: 50, totalTime: 60,
    sections: [
      { id:"quantitative",      name:"Aptitude",          questions:18, timeMinutes:18, difficulty:"Easy-Medium", topics:["Percentages","Time & Work","Speed & Distance","Number Series","Averages","Profit & Loss"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning", questions:18, timeMinutes:18, difficulty:"Easy-Medium", topics:["Coding-Decoding","Blood Relations","Directions","Series","Analogies","Statement & Conclusion"], isCoding:false },
      { id:"verbal",            name:"Verbal Ability",    questions:9,  timeMinutes:9,  difficulty:"Easy",        topics:["Synonyms","Antonyms","Fill in Blanks","Error Detection","Idioms"], isCoding:false },
      { id:"advanced-coding",   name:"Coding",            questions:1,  timeMinutes:45, difficulty:"Easy-Medium", topics:["Arrays","Strings","Sorting","Basic Recursion","Math Problems"], isCoding:true },
    ],
    notes:"SmartHire test. No negative marking. Online proctored.",
  },
  mphasis: {
    totalQuestions: 50, totalTime: 70,
    sections: [
      { id:"quantitative",      name:"Quantitative Aptitude", questions:15, timeMinutes:20, difficulty:"Easy-Medium", topics:["Percentages","Averages","Time & Work","Number Series","Algebra","Probability"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning",     questions:15, timeMinutes:20, difficulty:"Easy-Medium", topics:["Puzzles","Series","Blood Relations","Directions","Analogies"], isCoding:false },
      { id:"verbal",            name:"Verbal Ability",        questions:10, timeMinutes:15, difficulty:"Easy",        topics:["Comprehension","Grammar","Vocabulary","Sentence Correction"], isCoding:false },
      { id:"advanced-coding",   name:"Coding",               questions:2,  timeMinutes:60, difficulty:"Medium",      topics:["Arrays","Strings","Hash Map","Sorting","Basic DP"], isCoding:true },
    ],
    notes:"Mphasis hiring test. Good problem-solving focus.",
  },
  hexaware: {
    totalQuestions: 50, totalTime: 65,
    sections: [
      { id:"quantitative",      name:"Quantitative Aptitude", questions:15, timeMinutes:20, difficulty:"Easy-Medium", topics:["Percentages","Time & Work","Averages","Number Series","Profit & Loss"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning",     questions:15, timeMinutes:20, difficulty:"Easy-Medium", topics:["Series","Blood Relations","Directions","Puzzles","Syllogisms"], isCoding:false },
      { id:"verbal",            name:"English Ability",       questions:10, timeMinutes:15, difficulty:"Easy",        topics:["Grammar","Vocabulary","Comprehension","Error Detection"], isCoding:false },
      { id:"advanced-coding",   name:"Coding",               questions:2,  timeMinutes:60, difficulty:"Easy-Medium", topics:["Arrays","Strings","Sorting","Loops","Basic Math"], isCoding:true },
    ],
    notes:"Hexaware TechBee. Fresh graduate hiring test.",
  },
  ltimindtree: {
    totalQuestions: 55, totalTime: 75,
    sections: [
      { id:"quantitative",      name:"Quantitative Aptitude", questions:15, timeMinutes:20, difficulty:"Medium",      topics:["Percentages","Time & Work","Speed & Distance","Averages","Number Series","Probability"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning",     questions:15, timeMinutes:20, difficulty:"Medium",      topics:["Syllogisms","Puzzles","Series","Blood Relations","Seating Arrangement"], isCoding:false },
      { id:"verbal",            name:"Verbal Ability",        questions:10, timeMinutes:15, difficulty:"Easy-Medium", topics:["Reading Comprehension","Vocabulary","Grammar","Error Detection"], isCoding:false },
      { id:"basic-coding",      name:"Basic Coding",          questions:1,  timeMinutes:20, difficulty:"Easy",        topics:["Basic Arrays","String Operations","Simple Loops","Math Programs"], isCoding:true },
      { id:"advanced-coding",   name:"Advanced Coding",       questions:1,  timeMinutes:30, difficulty:"Medium",      topics:["Sorting","Hash Map","Recursion","Trees","Linked Lists"], isCoding:true },
    ],
    notes:"LTIMindtree campus. Sectional time limits. No negative marking.",
  },
  persistent: {
    totalQuestions: 55, totalTime: 70,
    sections: [
      { id:"quantitative",      name:"Quantitative Aptitude", questions:15, timeMinutes:20, difficulty:"Medium",      topics:["Percentages","Time & Work","Averages","Number Series","Algebra"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning",     questions:15, timeMinutes:20, difficulty:"Medium",      topics:["Puzzles","Series","Directions","Blood Relations","Syllogisms"], isCoding:false },
      { id:"verbal",            name:"Verbal Ability",        questions:10, timeMinutes:15, difficulty:"Easy-Medium", topics:["Reading Comprehension","Vocabulary","Grammar","Para Jumbles"], isCoding:false },
      { id:"advanced-coding",   name:"Coding",               questions:2,  timeMinutes:60, difficulty:"Medium",      topics:["Arrays","Hash Map","String Manipulation","Binary Search","DP"], isCoding:true },
    ],
    notes:"Persistent Systems campus. Medium difficulty. OOPs knowledge helpful.",
  },
  // ── Product companies ───────────────────────────────────────────────────────
  meta: {
    totalQuestions: 2, totalTime: 60,
    sections: [
      { id:"advanced-coding", name:"Coding Interview", questions:2, timeMinutes:60, difficulty:"Very Hard", topics:["Dynamic Programming","Graphs","Tree Algorithms","Sliding Window","Advanced DS","Recursion"], isCoding:true },
    ],
    notes:"System design + coding. Focus on scale and efficiency.",
  },
  apple: {
    totalQuestions: 2, totalTime: 60,
    sections: [
      { id:"advanced-coding", name:"Coding Assessment", questions:2, timeMinutes:60, difficulty:"Very Hard", topics:["System Design","Algorithms","Data Structures","Concurrency","Performance Optimization"], isCoding:true },
    ],
    notes:"Very hard. Focus on system design and low-level programming.",
  },
  adobe: {
    totalQuestions: 3, totalTime: 75,
    sections: [
      { id:"basic-coding",    name:"Coding Round 1",  questions:2, timeMinutes:60, difficulty:"Medium",      topics:["Arrays","Hash Map","String Manipulation","Sorting","Binary Search"], isCoding:true },
      { id:"advanced-coding", name:"Coding Round 2",  questions:1, timeMinutes:30, difficulty:"Medium-Hard", topics:["DP","Graphs","Trees","Greedy Algorithms"], isCoding:true },
    ],
    notes:"Adobe MTS hiring. Strong focus on DSA and problem solving.",
  },
  atlassian: {
    totalQuestions: 3, totalTime: 75,
    sections: [
      { id:"basic-coding",    name:"Coding Round 1",  questions:2, timeMinutes:60, difficulty:"Medium",      topics:["Arrays","Hash Map","Two Pointers","Binary Search","String Algorithms"], isCoding:true },
      { id:"advanced-coding", name:"Coding Round 2",  questions:1, timeMinutes:30, difficulty:"Medium-Hard", topics:["Graph BFS/DFS","Dynamic Programming","Trees","Sorting"], isCoding:true },
    ],
    notes:"Atlassian OA. Emphasis on code quality and edge cases.",
  },
  salesforce: {
    totalQuestions: 3, totalTime: 70,
    sections: [
      { id:"basic-coding",    name:"Coding Round 1",  questions:2, timeMinutes:60, difficulty:"Medium",      topics:["Arrays","Strings","Hash Map","Binary Search","Two Pointers"], isCoding:true },
      { id:"advanced-coding", name:"Coding Round 2",  questions:1, timeMinutes:30, difficulty:"Medium-Hard", topics:["Dynamic Programming","Graphs","Trees","Recursion"], isCoding:true },
    ],
    notes:"Salesforce Associate MTS. OA followed by interviews.",
  },
  qualcomm: {
    totalQuestions: 3, totalTime: 90,
    sections: [
      { id:"quantitative",    name:"Technical Aptitude",  questions:20, timeMinutes:30, difficulty:"Hard", topics:["Digital Electronics","Computer Architecture","Signal Processing","Probability","Algorithm Analysis"], isCoding:false },
      { id:"advanced-coding", name:"Coding",              questions:2,  timeMinutes:60, difficulty:"Hard", topics:["Arrays","Graphs","DP","Bit Manipulation","Optimization","Embedded C"], isCoding:true },
    ],
    notes:"Strong technical depth. Embedded systems knowledge an advantage.",
  },
  // ── Startups ────────────────────────────────────────────────────────────────
  flipkart: {
    totalQuestions: 3, totalTime: 90,
    sections: [
      { id:"basic-coding",    name:"Coding Round 1",  questions:2, timeMinutes:75, difficulty:"Medium-Hard", topics:["Arrays","Hash Map","Sliding Window","Two Pointers","BFS/DFS"], isCoding:true },
      { id:"advanced-coding", name:"Coding Round 2",  questions:1, timeMinutes:45, difficulty:"Hard",        topics:["Dynamic Programming","Graph Algorithms","Tree DP","Greedy"], isCoding:true },
    ],
    notes:"Flipkart SDE-1. Hackerearth OA platform. Strong DSA required.",
  },
  swiggy: {
    totalQuestions: 3, totalTime: 90,
    sections: [
      { id:"basic-coding",    name:"Coding Round 1",  questions:2, timeMinutes:60, difficulty:"Medium",      topics:["Arrays","Hash Map","Strings","Two Pointers","Sorting"], isCoding:true },
      { id:"advanced-coding", name:"Coding Round 2",  questions:1, timeMinutes:30, difficulty:"Hard",        topics:["Dynamic Programming","Graph Algorithms","Priority Queue"], isCoding:true },
    ],
    notes:"Swiggy SDE. Focus on practical problem-solving.",
  },
  zomato: {
    totalQuestions: 3, totalTime: 90,
    sections: [
      { id:"basic-coding",    name:"Coding Round 1",  questions:2, timeMinutes:60, difficulty:"Medium",      topics:["Arrays","Strings","Hash Map","Binary Search","Sorting"], isCoding:true },
      { id:"advanced-coding", name:"Coding Round 2",  questions:1, timeMinutes:30, difficulty:"Hard",        topics:["Dynamic Programming","Graphs","Trees","Greedy"], isCoding:true },
    ],
    notes:"Zomato SDE. HackerRank platform. Good aptitude helps too.",
  },
  razorpay: {
    totalQuestions: 3, totalTime: 90,
    sections: [
      { id:"basic-coding",    name:"Coding Round 1",  questions:2, timeMinutes:60, difficulty:"Medium-Hard", topics:["Arrays","Hash Map","Two Pointers","Binary Search","Strings"], isCoding:true },
      { id:"advanced-coding", name:"Coding Round 2",  questions:1, timeMinutes:45, difficulty:"Hard",        topics:["Dynamic Programming","Graph Algorithms","System Design","Concurrency"], isCoding:true },
    ],
    notes:"Razorpay SDE. Strong emphasis on backend/system design.",
  },
  freshworks: {
    totalQuestions: 55, totalTime: 75,
    sections: [
      { id:"quantitative",      name:"Aptitude",          questions:15, timeMinutes:15, difficulty:"Medium",      topics:["Percentages","Time & Work","Averages","Data Interpretation","Algebra"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning", questions:10, timeMinutes:10, difficulty:"Medium",      topics:["Puzzles","Series","Blood Relations","Directions"], isCoding:false },
      { id:"advanced-coding",   name:"Coding",            questions:2,  timeMinutes:60, difficulty:"Medium-Hard", topics:["Arrays","Hash Map","Sliding Window","Recursion","DP"], isCoding:true },
    ],
    notes:"Freshworks SDE OA. Good focus on product thinking + coding.",
  },
  zoho: {
    totalQuestions: 3, totalTime: 180,
    sections: [
      { id:"quantitative",      name:"Aptitude Test",         questions:30, timeMinutes:30,  difficulty:"Medium", topics:["Number System","Averages","Time-Work","Mensuration","Probability","Algebra"], isCoding:false },
      { id:"advanced-aptitude", name:"Technical MCQ",         questions:20, timeMinutes:30,  difficulty:"Medium", topics:["C Programming","Data Structures","OS","DBMS","Networks","OOP"], isCoding:false },
      { id:"advanced-coding",   name:"Programming Contest",   questions:3,  timeMinutes:120, difficulty:"Hard",   topics:["Complex Algorithms","DP","Graphs","Recursion","Math","String Algorithms"], isCoding:true },
    ],
    notes:"Very long test (3h). Multiple rounds. Logic-heavy. C programming preferred.",
  },
  // ── Consulting ──────────────────────────────────────────────────────────────
  pwc: {
    totalQuestions: 45, totalTime: 70,
    sections: [
      { id:"quantitative",      name:"Quantitative Aptitude", questions:20, timeMinutes:30, difficulty:"Medium", topics:["Data Interpretation","Business Math","Percentages","Ratios","Profit & Loss","Statistics"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning",     questions:15, timeMinutes:25, difficulty:"Medium", topics:["Diagrammatic Reasoning","Abstract Patterns","Sequences","Inductive Reasoning"], isCoding:false },
      { id:"verbal",            name:"Verbal Ability",        questions:10, timeMinutes:15, difficulty:"Medium", topics:["Reading Comprehension","True/False/Cannot Say","Grammar","Vocabulary"], isCoding:false },
    ],
    notes:"PwC Campus Assessment. No coding. Focus on analytical and verbal ability.",
  },
  kpmg: {
    totalQuestions: 50, totalTime: 75,
    sections: [
      { id:"quantitative",      name:"Quantitative Aptitude", questions:20, timeMinutes:30, difficulty:"Medium", topics:["Number Systems","Averages","Percentages","Data Interpretation","Algebra","Statistics"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning",     questions:15, timeMinutes:25, difficulty:"Medium", topics:["Seating Arrangement","Blood Relations","Coding-Decoding","Syllogisms","Puzzles"], isCoding:false },
      { id:"verbal",            name:"Verbal Ability",        questions:15, timeMinutes:20, difficulty:"Medium", topics:["Synonyms/Antonyms","Reading Comprehension","Fill in the Blanks","Error Detection"], isCoding:false },
    ],
    notes:"KPMG Graduate Hiring. No coding for most roles. Strong aptitude focus.",
  },
  ey: {
    totalQuestions: 45, totalTime: 70,
    sections: [
      { id:"quantitative",      name:"Quantitative Aptitude", questions:20, timeMinutes:30, difficulty:"Medium", topics:["Time & Work","Speed & Distance","Permutations","Probability","Data Interpretation"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning",     questions:15, timeMinutes:25, difficulty:"Medium", topics:["Visual Reasoning","Pattern Recognition","Logical Deduction","Critical Reasoning"], isCoding:false },
      { id:"verbal",            name:"Verbal Ability",        questions:10, timeMinutes:15, difficulty:"Medium", topics:["Para Jumbles","Reading Comprehension","Sentence Correction","Vocabulary"], isCoding:false },
    ],
    notes:"EY Campus Assessment. Global format. Strong verbal and reasoning.",
  },
  // ── BFSI ───────────────────────────────────────────────────────────────────
  "goldman-sachs": {
    totalQuestions: 3, totalTime: 90,
    sections: [
      { id:"quantitative",    name:"Quantitative Aptitude",  questions:20, timeMinutes:30, difficulty:"Hard", topics:["Probability","Statistics","Financial Math","Data Interpretation","Combinatorics"], isCoding:false },
      { id:"advanced-coding", name:"Coding Assessment",      questions:2,  timeMinutes:75, difficulty:"Hard", topics:["Dynamic Programming","Graph Algorithms","Binary Search","Advanced Data Structures","Math"], isCoding:true },
    ],
    notes:"Goldman Sachs OA. Very hard quant + DSA. HackerRank platform.",
  },
  "morgan-stanley": {
    totalQuestions: 3, totalTime: 90,
    sections: [
      { id:"quantitative",    name:"Quantitative Aptitude",  questions:20, timeMinutes:30, difficulty:"Hard", topics:["Data Interpretation","Financial Math","Statistics","Probability","Algebra"], isCoding:false },
      { id:"advanced-coding", name:"Coding Assessment",      questions:2,  timeMinutes:60, difficulty:"Hard", topics:["Dynamic Programming","Graph Algorithms","Trees","Hash Map","Sorting"], isCoding:true },
    ],
    notes:"Morgan Stanley campus. Competitive quant + coding. HackerRank.",
  },
  barclays: {
    totalQuestions: 50, totalTime: 75,
    sections: [
      { id:"quantitative",      name:"Numerical Reasoning",  questions:20, timeMinutes:25, difficulty:"Medium", topics:["Data Interpretation","Financial Math","Percentages","Ratios","Statistics"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning",    questions:20, timeMinutes:25, difficulty:"Medium", topics:["Deductive Reasoning","Abstract Patterns","Verbal Reasoning","Critical Thinking"], isCoding:false },
      { id:"verbal",            name:"Verbal Reasoning",     questions:10, timeMinutes:15, difficulty:"Medium", topics:["Reading Comprehension","True/False","Vocabulary","Grammar"], isCoding:false },
    ],
    notes:"Barclays Graduate Associate. Focus on numerical and logical reasoning.",
  },
  icici: {
    totalQuestions: 50, totalTime: 60,
    sections: [
      { id:"quantitative",      name:"Quantitative Aptitude", questions:20, timeMinutes:25, difficulty:"Easy-Medium", topics:["Data Interpretation","Arithmetic","Percentages","Ratios","Time & Work"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning",     questions:20, timeMinutes:20, difficulty:"Easy-Medium", topics:["Syllogisms","Blood Relations","Series","Directions","Puzzles"], isCoding:false },
      { id:"verbal",            name:"English Language",      questions:10, timeMinutes:15, difficulty:"Easy",        topics:["Grammar","Vocabulary","Reading Comprehension","Error Detection"], isCoding:false },
    ],
    notes:"ICICI Bank PO Tech. Standard banking aptitude pattern.",
  },
}

// ── Category-based fallback patterns (used for companies without specific fallback) ──
const CATEGORY_FALLBACKS: Record<string, Omit<CompanyPattern, "company"|"companyName"|"fetchedAt"|"source">> = {
  "IT Services": {
    totalQuestions: 55, totalTime: 75,
    sections: [
      { id:"quantitative", name:"Quantitative Aptitude", questions:15, timeMinutes:20, difficulty:"Easy-Medium", topics:["Percentages","Time & Work","Speed & Distance","Number Series","Averages","Profit & Loss"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning", questions:15, timeMinutes:20, difficulty:"Easy-Medium", topics:["Syllogisms","Blood Relations","Seating Arrangement","Coding-Decoding","Series","Puzzles"], isCoding:false },
      { id:"verbal", name:"Verbal Ability", questions:10, timeMinutes:15, difficulty:"Easy", topics:["Synonyms","Fill in the Blanks","Error Detection","Grammar","Vocabulary"], isCoding:false },
      { id:"basic-coding", name:"Basic Coding", questions:1, timeMinutes:20, difficulty:"Easy", topics:["Arrays","Strings","Loops","Basic Math"], isCoding:true },
      { id:"advanced-coding", name:"Advanced Coding", questions:1, timeMinutes:30, difficulty:"Medium", topics:["Sorting","Recursion","Hash Map","Trees"], isCoding:true },
    ],
    notes:"Standard IT services pattern. Easy to medium difficulty.",
  },
  "Product": {
    totalQuestions: 3, totalTime: 90,
    sections: [
      { id:"basic-coding", name:"Coding Round 1", questions:2, timeMinutes:75, difficulty:"Medium-Hard", topics:["Sliding Window","Two Pointers","Hash Map","BFS/DFS","Binary Search","Dynamic Programming"], isCoding:true },
      { id:"advanced-coding", name:"Coding Round 2", questions:1, timeMinutes:30, difficulty:"Hard", topics:["Advanced DP","Graph Algorithms","Tree DP","System Design"], isCoding:true },
    ],
    notes:"Pure coding focus. High difficulty. Emphasizes optimal solutions.",
  },
  "Startups": {
    totalQuestions: 3, totalTime: 90,
    sections: [
      { id:"basic-coding", name:"Coding Assessment", questions:2, timeMinutes:60, difficulty:"Medium", topics:["Arrays","Strings","Hash Map","BFS/DFS","Sorting","Two Pointers"], isCoding:true },
      { id:"advanced-coding", name:"Advanced Coding", questions:1, timeMinutes:30, difficulty:"Hard", topics:["Dynamic Programming","Graphs","Advanced Data Structures"], isCoding:true },
    ],
    notes:"Startup pattern: focus on practical coding skills.",
  },
  "Consulting": {
    totalQuestions: 50, totalTime: 80,
    sections: [
      { id:"quantitative", name:"Quantitative Aptitude", questions:20, timeMinutes:30, difficulty:"Medium", topics:["Data Interpretation","Business Math","Percentages","Ratios","Statistics"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning", questions:15, timeMinutes:25, difficulty:"Medium", topics:["Deductive Reasoning","Abstract Patterns","Syllogisms","Critical Reasoning"], isCoding:false },
      { id:"verbal", name:"Verbal Ability", questions:15, timeMinutes:25, difficulty:"Medium", topics:["Reading Comprehension","Sentence Correction","Critical Reasoning","Vocabulary"], isCoding:false },
    ],
    notes:"No coding for pure consulting roles. Focus on analytical ability.",
  },
  "BFSI": {
    totalQuestions: 55, totalTime: 90,
    sections: [
      { id:"quantitative", name:"Quantitative Aptitude", questions:20, timeMinutes:30, difficulty:"Medium", topics:["Data Interpretation","Financial Math","Percentages","Ratios","Statistics","Probability"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical Reasoning", questions:15, timeMinutes:25, difficulty:"Medium", topics:["Seating Arrangement","Blood Relations","Coding-Decoding","Syllogisms","Puzzles"], isCoding:false },
      { id:"basic-coding", name:"Technical/Coding", questions:2, timeMinutes:45, difficulty:"Medium", topics:["Arrays","Hash Map","Sorting","Graphs","Dynamic Programming"], isCoding:true },
    ],
    notes:"BFSI pattern. Financial aptitude important.",
  },
  "Core Engg": {
    totalQuestions: 80, totalTime: 120,
    sections: [
      { id:"quantitative", name:"Quantitative Aptitude", questions:25, timeMinutes:35, difficulty:"Medium", topics:["Mathematics","Physics","Engineering Math","Data Interpretation","Statistics"], isCoding:false },
      { id:"advanced-aptitude", name:"Technical Aptitude", questions:25, timeMinutes:35, difficulty:"Medium", topics:["Engineering Concepts","Technical MCQ","Domain Knowledge","Logical Reasoning"], isCoding:false },
      { id:"verbal", name:"Verbal Ability", questions:20, timeMinutes:25, difficulty:"Easy-Medium", topics:["Grammar","Comprehension","Vocabulary","Technical Communication"], isCoding:false },
      { id:"basic-coding", name:"Technical MCQ/Coding", questions:10, timeMinutes:25, difficulty:"Easy-Medium", topics:["Programming Basics","Algorithms","Data Structures"], isCoding:false },
    ],
    notes:"Core engineering pattern. Domain-specific technical knowledge tested.",
  },
  "Telecom": {
    totalQuestions: 55, totalTime: 90,
    sections: [
      { id:"quantitative", name:"Quantitative Aptitude", questions:20, timeMinutes:30, difficulty:"Medium", topics:["Bandwidth Calculations","Signal Math","Percentages","Data Analysis","Statistics"], isCoding:false },
      { id:"advanced-aptitude", name:"Technical + Logical", questions:20, timeMinutes:30, difficulty:"Medium", topics:["Networking Concepts","Logical Reasoning","Data Interpretation","Technical MCQ"], isCoding:false },
      { id:"basic-coding", name:"Coding", questions:2, timeMinutes:45, difficulty:"Medium", topics:["Arrays","Graphs","Network Routing","Algorithms"], isCoding:true },
    ],
    notes:"Telecom-specific technical knowledge. Network concepts important.",
  },
  "FMCG": {
    totalQuestions: 70, totalTime: 90,
    sections: [
      { id:"quantitative", name:"Quantitative Aptitude", questions:25, timeMinutes:35, difficulty:"Medium", topics:["Data Interpretation","Business Math","Market Analysis","Percentages","Ratios"], isCoding:false },
      { id:"advanced-aptitude", name:"Logical + Analytical", questions:25, timeMinutes:35, difficulty:"Medium", topics:["Data Analysis","Business Cases","Logical Reasoning","Abstract Patterns"], isCoding:false },
      { id:"verbal", name:"Verbal Ability", questions:20, timeMinutes:25, difficulty:"Medium", topics:["Reading Comprehension","Business Communication","Vocabulary","Grammar"], isCoding:false },
    ],
    notes:"FMCG pattern. Business aptitude and analytical skills focused.",
  },
  "Pharma": {
    totalQuestions: 60, totalTime: 90,
    sections: [
      { id:"quantitative", name:"Quantitative Aptitude", questions:20, timeMinutes:30, difficulty:"Medium", topics:["Data Analysis","Statistics","Mathematics","Scientific Calculations"], isCoding:false },
      { id:"advanced-aptitude", name:"Reasoning + Technical", questions:20, timeMinutes:30, difficulty:"Medium", topics:["Logical Reasoning","Scientific Knowledge","Data Interpretation","Problem Solving"], isCoding:false },
      { id:"verbal", name:"Verbal Ability", questions:20, timeMinutes:30, difficulty:"Easy-Medium", topics:["Reading Comprehension","Technical Writing","Grammar","Vocabulary"], isCoding:false },
    ],
    notes:"Pharma pattern. Scientific aptitude may be tested.",
  },
  "EV/Auto": {
    totalQuestions: 60, totalTime: 90,
    sections: [
      { id:"quantitative", name:"Technical + Math", questions:20, timeMinutes:30, difficulty:"Medium-Hard", topics:["Engineering Math","Physics","Data Analysis","Battery Calculations"], isCoding:false },
      { id:"advanced-aptitude", name:"Technical MCQ", questions:20, timeMinutes:30, difficulty:"Hard", topics:["Embedded Systems","Electronics","Automotive Engineering","Control Systems"], isCoding:false },
      { id:"advanced-coding", name:"Coding", questions:2, timeMinutes:45, difficulty:"Hard", topics:["Embedded C","Algorithms","Signal Processing","Optimization"], isCoding:true },
    ],
    notes:"EV/Auto pattern. Strong technical and engineering knowledge required.",
  },
  "Defence": {
    totalQuestions: 100, totalTime: 120,
    sections: [
      { id:"quantitative", name:"Mathematics", questions:30, timeMinutes:40, difficulty:"Hard", topics:["Engineering Mathematics","Physics","Signal Processing","Trigonometry"], isCoding:false },
      { id:"advanced-aptitude", name:"Technical + General", questions:40, timeMinutes:45, difficulty:"Hard", topics:["Technical Knowledge","Science","Engineering Concepts","Current Affairs"], isCoding:false },
      { id:"verbal", name:"English", questions:30, timeMinutes:35, difficulty:"Medium", topics:["Grammar","Comprehension","Vocabulary","Communication"], isCoding:false },
    ],
    notes:"Government/defence pattern. GATE-like technical depth. Physical tests may follow.",
  },
}

// ── Build pattern from sections in companies-data.ts ─────────────────────────
function buildPatternFromSections(
  company: string,
  companyName: string,
  sections: string[],
  category: string,
  duration: number,
  totalQuestions: number
): CompanyPattern {
  const categoryFallback = CATEGORY_FALLBACKS[category] ?? CATEGORY_FALLBACKS["IT Services"]

  // Filter category sections to only include what this company has
  const filteredSections = categoryFallback.sections.filter(s => sections.includes(s.id))

  // If no match, use all category sections
  const finalSections = filteredSections.length > 0 ? filteredSections : categoryFallback.sections

  return {
    company,
    companyName,
    fetchedAt: new Date(),
    source: "category-fallback",
    totalQuestions: totalQuestions || categoryFallback.totalQuestions,
    totalTime: duration || categoryFallback.totalTime,
    sections: finalSections,
    notes: categoryFallback.notes,
  }
}
async function fetchFromWeb(query: string): Promise<string> {
  const googleKey = process.env.GOOGLE_API_KEY
  const googleCx  = process.env.GOOGLE_SEARCH_CX
  let urls: string[] = []

  if (googleKey && googleCx) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${googleKey}&cx=${googleCx}&q=${encodeURIComponent(query)}&num=3`,
        { signal: AbortSignal.timeout(5000) }
      )
      if (res.ok) {
        const data = await res.json()
        urls = (data.items ?? []).map((i: any) => i.link as string).filter(Boolean)
      }
    } catch {}
  }

  // DuckDuckGo fallback
  if (!urls.length) {
    try {
      const res = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`,
        { signal: AbortSignal.timeout(4000) }
      )
      if (res.ok) {
        const d = await res.json()
        if (d.AbstractText) return d.AbstractText
        for (const t of d.RelatedTopics ?? []) {
          if (t.FirstURL) urls.push(t.FirstURL)
        }
      }
    } catch {}
  }

  // Fetch page content
  let combined = ""
  for (const url of urls.slice(0, 3)) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 Chrome/121.0.0.0 Safari/537.36" },
        signal: AbortSignal.timeout(6000),
      })
      if (!res.ok) continue
      const html = await res.text()
      const text = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s{3,}/g, "\n").trim().slice(0, 3000)
      if (/(section|question|aptitude|logical|verbal|coding|pattern)/i.test(text)) {
        combined += `\n[${new URL(url).hostname}]\n${text}\n`
      }
    } catch {}
    if (combined.length > 5000) break
  }
  return combined
}

// ── AI extraction ─────────────────────────────────────────────────────────────
async function extractWithAI(companyName: string, webContent: string): Promise<Partial<CompanyPattern> | null> {
  const groqKey   = process.env.GROQ_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY
  if (!groqKey && !openaiKey) return null
  if (!webContent.trim()) return null

  const prompt = `Extract the campus placement test pattern for ${companyName} from this content.
Return ONLY valid JSON with this exact structure (no markdown, no extra text):
{"totalQuestions":85,"totalTime":190,"sections":[{"id":"quantitative","name":"Numerical Ability","questions":20,"timeMinutes":40,"difficulty":"Medium","topics":["Percentages","Time & Work"],"isCoding":false}],"notes":"No negative marking"}

Section id must be one of: quantitative, advanced-aptitude, verbal, basic-coding, advanced-coding

CONTENT:
${webContent.slice(0, 3000)}`

  const tryAI = async (url: string, key: string, model: string) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], temperature: 0.1, max_tokens: 800 }),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return null
    const d = await res.json()
    const raw = d.choices?.[0]?.message?.content?.trim() ?? ""
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) return null
    return JSON.parse(match[0])
  }

  try {
    if (groqKey) {
      const data = await tryAI("https://api.groq.com/openai/v1/chat/completions", groqKey, "groq/compound-mini").catch(() => null)
      if (data?.sections?.length > 0) return data
    }
    if (openaiKey) {
      const data = await tryAI("https://api.openai.com/v1/chat/completions", openaiKey, "gpt-4o-mini").catch(() => null)
      if (data?.sections?.length > 0) return data
    }
  } catch {}
  return null
}

// ── Main: get company pattern with 7-day cache ────────────────────────────────
export async function getCompanyPattern(company: string, companyName: string): Promise<CompanyPattern | null> {
  // 1. Check MongoDB cache
  try {
    const db = await getDatabase()
    const cached = await db.collection("company_patterns").findOne({ company })
    if (cached && (Date.now() - new Date(cached.fetchedAt).getTime()) < PATTERN_CACHE_TTL) {
      return cached as unknown as CompanyPattern
    }
  } catch {}

  // 2. Try to fetch live data
  let liveData: Partial<CompanyPattern> | null = null
  try {
    const query = `${companyName} campus placement test pattern 2024 2025 sections questions time`
    const webContent = await fetchFromWeb(query)
    if (webContent) {
      liveData = await extractWithAI(companyName, webContent)
    }
  } catch {}

  // 3. Build final pattern: live data > specific fallback > category fallback
  const specificFallback = FALLBACK_PATTERNS[company]
  const pattern: CompanyPattern = {
    company,
    companyName,
    fetchedAt: new Date(),
    source: liveData?.sections?.length ? "web+ai" : specificFallback ? "fallback" : "category-fallback",
    totalQuestions: liveData?.totalQuestions ?? specificFallback?.totalQuestions ?? 60,
    totalTime:      liveData?.totalTime      ?? specificFallback?.totalTime      ?? 60,
    sections:       (liveData?.sections?.length ? liveData.sections : specificFallback?.sections) ?? [],
    notes:          liveData?.notes          ?? specificFallback?.notes          ?? "",
  }

  // 4. Cache in MongoDB
  try {
    const db = await getDatabase()
    await db.collection("company_patterns").updateOne(
      { company },
      { $set: { ...pattern, updatedAt: new Date() } },
      { upsert: true }
    )
  } catch {}

  return pattern.sections.length > 0 ? pattern : null
}

/**
 * Bulk seed patterns for all companies using category fallbacks.
 * Fast — no web fetch, just uses hardcoded accurate patterns.
 */
export async function seedAllCompanyPatterns(companies: Array<{ id: string; name: string; category: string; sections: string[]; duration: number; questions: number }>) {
  const db = await getDatabase()
  const col = db.collection("company_patterns")
  const ops = []

  for (const co of companies) {
    // Use specific fallback if available, else build from category
    const specificFallback = FALLBACK_PATTERNS[co.id]
    let pattern: CompanyPattern

    if (specificFallback) {
      pattern = {
        company: co.id, companyName: co.name, fetchedAt: new Date(), source: "fallback",
        totalQuestions: specificFallback.totalQuestions, totalTime: specificFallback.totalTime,
        sections: specificFallback.sections, notes: specificFallback.notes,
      }
    } else {
      pattern = buildPatternFromSections(co.id, co.name, co.sections, co.category, co.duration, co.questions)
    }

    ops.push({
      updateOne: {
        filter: { company: co.id },
        update: { $set: { ...pattern, updatedAt: new Date() } },
        upsert: true,
      },
    })
  }

  await col.bulkWrite(ops, { ordered: false })
  return ops.length
}

export function patternToSectionQty(pattern: CompanyPattern): Record<string, number> {
  return Object.fromEntries(pattern.sections.map(s => [s.id, s.questions]))
}

export function patternToTopicOverrides(pattern: CompanyPattern): Record<string, { topics: string[]; difficulty: string }> {
  return Object.fromEntries(
    pattern.sections
      .filter(s => s.topics?.length > 0)
      .map(s => [s.id, { topics: s.topics, difficulty: s.difficulty }])
  )
}
