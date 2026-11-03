/**
 * Company Assessment Patterns — Single Source of Truth
 * Used by both generate-assessment API and company-pattern fallback.
 * Reflects real 2024-2025 campus hiring data with Hard difficulty for aptitude.
 */

export interface SectionConfig {
  name:        string
  count:       number
  timeMinutes: number
  difficulty:  string
  topics:      string[]
  isCoding:    boolean
}

export interface CompanyConfig {
  difficulty:  string
  totalTime:   number
  sections:    Record<string, SectionConfig>
  notes:       string
}

export const COMPANY_ASSESSMENT_PATTERNS: Record<string, CompanyConfig> = {
  tcs: {
    difficulty: "Medium-Hard", totalTime: 190,
    notes: "No negative marking. Digital/Prime track has harder coding section.",
    sections: {
      "quantitative":      { name:"Numerical Ability",       count:20, timeMinutes:40, difficulty:"Hard",        isCoding:false, topics:["Percentages","Time & Work","Speed & Distance","Profit & Loss","Probability","Simple Interest","Number Series","Permutation & Combination","Averages","Ratio & Proportion"] },
      "advanced-aptitude": { name:"Reasoning Ability",       count:30, timeMinutes:50, difficulty:"Medium-Hard", isCoding:false, topics:["Syllogisms","Blood Relations","Seating Arrangement","Coding-Decoding","Puzzles","Series Completion","Direction Sense","Analogy","Input-Output","Statement & Conclusion"] },
      "verbal":            { name:"Verbal Ability",           count:24, timeMinutes:30, difficulty:"Medium",      isCoding:false, topics:["Synonyms","Antonyms","Fill in the Blanks","Error Detection","Sentence Completion","Para Jumbles","Reading Comprehension","Idioms & Phrases"] },
      "basic-coding":      { name:"Programming Logic (MCQ)", count:10, timeMinutes:20, difficulty:"Medium",      isCoding:false, topics:["Loops","Arrays","Strings","Basic Math","Pattern Printing","Conditional Logic","Output-Based Questions"] },
      "advanced-coding":   { name:"Coding",                  count:1,  timeMinutes:30, difficulty:"Medium-Hard", isCoding:true,  topics:["Arrays","Strings","Basic Dynamic Programming","Recursion","Sorting","Hash Map","Two Pointers"] },
    },
  },
  infosys: {
    difficulty: "Medium-Hard", totalTime: 250,
    notes: "Separate 3-hour coding round. Sectional cutoffs apply.",
    sections: {
      "quantitative":      { name:"Quantitative Aptitude", count:15, timeMinutes:25, difficulty:"Hard",        isCoding:false, topics:["Ratios","Averages","Mixtures","Algebra","Geometry","Probability","Time-Speed-Distance","Percentages","Data Interpretation"] },
      "advanced-aptitude": { name:"Logical Reasoning",     count:15, timeMinutes:25, difficulty:"Medium-Hard", isCoding:false, topics:["Puzzles","Series Completion","Directions","Analogy","Data Interpretation","Pseudocode Analysis","Odd One Out","Clocks & Calendars"] },
      "verbal":            { name:"Verbal Ability",         count:20, timeMinutes:20, difficulty:"Medium",      isCoding:false, topics:["Reading Comprehension","Grammar","Vocabulary","Error Correction","Para Completion","Sentence Rearrangement"] },
      "advanced-coding":   { name:"Coding",                 count:2,  timeMinutes:180,difficulty:"Hard",        isCoding:true,  topics:["Arrays","Strings","Sorting","Dynamic Programming","Recursion","Trees","Hash Map","Stack","Queue"] },
    },
  },
  wipro: {
    difficulty: "Medium", totalTime: 60,
    notes: "No sectional cutoffs. Essay writing section included.",
    sections: {
      "quantitative":      { name:"Aptitude",          count:16, timeMinutes:16, difficulty:"Medium-Hard", isCoding:false, topics:["Percentages","Simple & Compound Interest","Mensuration","Time & Distance","Permutation & Combination","Profit & Loss","Number System","Averages"] },
      "advanced-aptitude": { name:"Logical Reasoning", count:14, timeMinutes:14, difficulty:"Medium",      isCoding:false, topics:["Statement & Assumption","Course of Action","Analogy","Series Completion","Directions","Blood Relations","Coding-Decoding","Odd One Out"] },
      "verbal":            { name:"Verbal",             count:15, timeMinutes:15, difficulty:"Medium",      isCoding:false, topics:["Synonyms","Antonyms","Reading Comprehension","Fill in the Blanks","Error Correction","Sentence Improvement"] },
      "advanced-coding":   { name:"Coding",             count:1,  timeMinutes:60, difficulty:"Medium",      isCoding:true,  topics:["Arrays","Strings","Math Problems","Sorting","Recursion","Pattern Printing"] },
    },
  },
  cognizant: {
    difficulty: "Medium", totalTime: 120,
    notes: "GenC Elevate track includes Technical MCQ section.",
    sections: {
      "quantitative":      { name:"Aptitude + Reasoning + Verbal", count:24, timeMinutes:45, difficulty:"Medium-Hard", isCoding:false, topics:["Arithmetic","Algebra","Data Interpretation","Logical Reasoning","Grammar","Comprehension","HCF & LCM","Percentages","Time-Work-Distance"] },
      "advanced-aptitude": { name:"Technical MCQ",                 count:20, timeMinutes:30, difficulty:"Medium",      isCoding:false, topics:["C Programming","OOP Concepts","Data Structures","DBMS","Operating Systems","Networking","Algorithms","Python Basics"] },
      "advanced-coding":   { name:"Coding",                        count:2,  timeMinutes:60, difficulty:"Medium-Hard", isCoding:true,  topics:["Arrays","Strings","Sorting","Hash Map","Basic Dynamic Programming","Stack","Queue","Recursion"] },
    },
  },
  capgemini: {
    difficulty: "Medium-Hard", totalTime: 90,
    notes: "Essay round after technical test.",
    sections: {
      "quantitative":      { name:"Quantitative Aptitude", count:16, timeMinutes:16, difficulty:"Hard",        isCoding:false, topics:["Number System","Averages","Time & Work","Mensuration","Algebra","Percentages","Ratio & Proportion","Simple Interest"] },
      "advanced-aptitude": { name:"Logical Reasoning",     count:10, timeMinutes:10, difficulty:"Medium-Hard", isCoding:false, topics:["Series","Analogy","Odd One Out","Matrix Reasoning","Puzzles","Syllogisms","Coding-Decoding","Directions"] },
      "verbal":            { name:"Verbal Ability",         count:10, timeMinutes:10, difficulty:"Medium",      isCoding:false, topics:["Fill in the Blanks","Error Correction","Reading Comprehension","Synonyms","Antonyms","Para Jumbles"] },
      "basic-coding":      { name:"Pseudo Code",            count:5,  timeMinutes:5,  difficulty:"Medium",      isCoding:false, topics:["Algorithm Tracing","Code Output Prediction","Array Logic","Loop Analysis","Function Output"] },
      "advanced-coding":   { name:"Coding",                 count:1,  timeMinutes:30, difficulty:"Medium-Hard", isCoding:true,  topics:["Binary Search","Sorting","Hash Map","Stack","Two Pointers","String Manipulation"] },
    },
  },
  accenture: {
    difficulty: "Medium-Hard", totalTime: 90,
    notes: "Cognitive test covers both aptitude and technical reasoning.",
    sections: {
      "quantitative":      { name:"Cognitive Ability",     count:50, timeMinutes:50, difficulty:"Hard",        isCoding:false, topics:["Percentages","Time & Work","Speed & Distance","Profit & Loss","Number Series","Averages","SI/CI","Ratios","Data Interpretation","Permutation & Combination"] },
      "advanced-aptitude": { name:"Cognitive & Technical", count:40, timeMinutes:40, difficulty:"Medium-Hard", isCoding:false, topics:["Syllogisms","Blood Relations","Seating Arrangement","Coding-Decoding","Pseudocode","C Output","OOP","DBMS","Networking","OS Concepts"] },
    },
  },
  hcl: {
    difficulty: "Medium", totalTime: 75,
    notes: "No negative marking. Sectional time limits apply.",
    sections: {
      "quantitative":      { name:"Quantitative Ability",  count:15, timeMinutes:20, difficulty:"Medium-Hard", isCoding:false, topics:["Percentages","Time & Work","Speed & Distance","Averages","Number Series","Simple Interest","Profit & Loss","Ratio & Proportion"] },
      "advanced-aptitude": { name:"Logical Reasoning",     count:15, timeMinutes:20, difficulty:"Medium",      isCoding:false, topics:["Blood Relations","Directions","Coding-Decoding","Series Completion","Analogies","Statement & Conclusion","Syllogisms","Puzzles"] },
      "verbal":            { name:"Verbal Ability",         count:15, timeMinutes:15, difficulty:"Medium",      isCoding:false, topics:["Synonyms","Antonyms","Fill in the Blanks","Reading Comprehension","Error Detection","Sentence Completion","Idioms & Phrases"] },
      "basic-coding":      { name:"Basic Programming MCQ", count:5,  timeMinutes:10, difficulty:"Medium",      isCoding:false, topics:["Loops","Arrays","String Operations","Basic Math","Pattern Printing","Conditional Logic"] },
      "advanced-coding":   { name:"Coding",                 count:1,  timeMinutes:30, difficulty:"Medium-Hard", isCoding:true,  topics:["Arrays","Strings","Sorting","Basic Recursion","Math Problems","Hash Map"] },
    },
  },
  "tech-mahindra": {
    difficulty: "Medium", totalTime: 60,
    notes: "No negative marking.",
    sections: {
      "quantitative":      { name:"Aptitude",          count:15, timeMinutes:15, difficulty:"Medium",      isCoding:false, topics:["Percentages","Time & Work","Profit & Loss","Averages","Ratios","SI/CI","Number System"] },
      "advanced-aptitude": { name:"Reasoning",         count:15, timeMinutes:15, difficulty:"Medium",      isCoding:false, topics:["Series","Blood Relations","Directions","Coding-Decoding","Syllogisms","Analogy","Puzzles"] },
      "verbal":            { name:"Verbal",             count:15, timeMinutes:15, difficulty:"Medium",      isCoding:false, topics:["Synonyms","Antonyms","Reading Comprehension","Error Correction","Fill in the Blanks"] },
      "advanced-coding":   { name:"Coding",             count:1,  timeMinutes:60, difficulty:"Medium",      isCoding:true,  topics:["Arrays","Strings","Basic Math","Loops","Sorting"] },
    },
  },
  deloitte: {
    difficulty: "Medium-Hard", totalTime: 80,
    notes: "Aptitude + Reasoning + Verbal in one go. No coding round typically.",
    sections: {
      "quantitative":      { name:"Aptitude",          count:15, timeMinutes:25, difficulty:"Hard",        isCoding:false, topics:["Percentages","Time & Work","Data Interpretation","Profit & Loss","Number Series","Ratios","Averages"] },
      "advanced-aptitude": { name:"Logical Reasoning", count:15, timeMinutes:25, difficulty:"Medium-Hard", isCoding:false, topics:["Syllogisms","Puzzles","Blood Relations","Seating Arrangement","Coding-Decoding","Statement & Assumption","Data Sufficiency"] },
      "verbal":            { name:"Verbal Ability",     count:20, timeMinutes:20, difficulty:"Medium",      isCoding:false, topics:["Reading Comprehension","Vocabulary","Grammar","Para Jumbles","Error Detection","Fill in the Blanks"] },
    },
  },
  amazon: {
    difficulty: "Hard", totalTime: 105,
    notes: "OA typically 2 coding + 7 work simulation questions. Focus on DSA.",
    sections: {
      "advanced-coding": { name:"Coding Round",    count:2, timeMinutes:90, difficulty:"Hard",        isCoding:true,  topics:["Arrays","Hash Map","Dynamic Programming","Graphs","Trees","Binary Search","Sliding Window","Stack","Two Pointers","Priority Queue"] },
      "logical":         { name:"Work Simulation", count:7, timeMinutes:15, difficulty:"Medium-Hard", isCoding:false, topics:["Leadership Principles","Situational Judgment","Behavioral Scenarios","Work Style Assessment","Problem Solving","Team Dynamics"] },
    },
  },
  microsoft: {
    difficulty: "Hard", totalTime: 90,
    notes: "Coding assessment followed by multiple interview rounds.",
    sections: {
      "advanced-coding": { name:"Coding Assessment", count:3, timeMinutes:75, difficulty:"Hard",   isCoding:true,  topics:["Arrays","Graphs","Trees","Dynamic Programming","Binary Search","Hash Map","String Algorithms","Recursion","Two Pointers"] },
      "logical":         { name:"Problem Solving",   count:8, timeMinutes:15, difficulty:"Hard",   isCoding:false, topics:["Logical Reasoning","Pattern Recognition","Spatial Reasoning","Numerical Reasoning","Verbal Reasoning"] },
    },
  },
  google: {
    difficulty: "Very Hard", totalTime: 60,
    notes: "Focus on algorithmic efficiency and optimal solutions.",
    sections: {
      "advanced-coding": { name:"Coding Screen", count:2, timeMinutes:60, difficulty:"Hard", isCoding:true, topics:["Graphs","Dynamic Programming","Binary Search","Trees","Advanced Algorithms","Bit Manipulation","Mathematical Optimization","Segment Trees"] },
    },
  },
  adobe: {
    difficulty: "Hard", totalTime: 75,
    notes: "Coding + aptitude combo. Focus on data structures.",
    sections: {
      "advanced-coding": { name:"Coding Assessment", count:3,  timeMinutes:60, difficulty:"Hard", isCoding:true,  topics:["Arrays","Strings","Trees","Dynamic Programming","Graphs","Binary Search","Stack","Recursion"] },
      "logical":         { name:"Aptitude",           count:15, timeMinutes:15, difficulty:"Hard", isCoding:false, topics:["Logical Reasoning","Quantitative Aptitude","Data Interpretation","Verbal Ability"] },
    },
  },
  oracle: {
    difficulty: "Hard", totalTime: 90,
    notes: "Technical aptitude + coding. Strong focus on algorithms.",
    sections: {
      "quantitative":    { name:"Aptitude", count:20, timeMinutes:30, difficulty:"Hard", isCoding:false, topics:["Quantitative Aptitude","Data Interpretation","Number Series","Ratios","Time & Work","Percentages"] },
      "advanced-coding": { name:"Coding",   count:3,  timeMinutes:60, difficulty:"Hard", isCoding:true,  topics:["Arrays","Trees","Dynamic Programming","Graphs","Hash Map","Binary Search","Stack","String Algorithms"] },
    },
  },
  atlassian: {
    difficulty: "Hard", totalTime: 75,
    notes: "Values-based + technical coding.",
    sections: {
      "advanced-coding": { name:"Coding Assessment", count:3,  timeMinutes:60, difficulty:"Hard", isCoding:true,  topics:["Arrays","Hash Map","Graphs","Trees","Recursion","Dynamic Programming","Two Pointers"] },
      "logical":         { name:"Aptitude",           count:10, timeMinutes:15, difficulty:"Hard", isCoding:false, topics:["Logical Reasoning","Quantitative Aptitude","Verbal Ability","Pattern Recognition"] },
    },
  },
  salesforce: {
    difficulty: "Hard", totalTime: 70,
    notes: "OA + technical interview rounds.",
    sections: {
      "advanced-coding": { name:"Coding Assessment", count:3, timeMinutes:60, difficulty:"Hard", isCoding:true, topics:["Arrays","Hash Map","Trees","Dynamic Programming","Graphs","Binary Search"] },
      "logical":         { name:"Aptitude",           count:8, timeMinutes:10, difficulty:"Hard", isCoding:false, topics:["Logical Reasoning","Quantitative Aptitude","Verbal Ability"] },
    },
  },
  qualcomm: {
    difficulty: "Hard", totalTime: 90,
    notes: "Strong focus on CS fundamentals + algorithms.",
    sections: {
      "quantitative":    { name:"Aptitude", count:20, timeMinutes:30, difficulty:"Hard", isCoding:false, topics:["Quantitative Aptitude","Data Interpretation","Logical Reasoning","Number Series"] },
      "advanced-coding": { name:"Coding",   count:3,  timeMinutes:60, difficulty:"Hard", isCoding:true,  topics:["Arrays","Trees","Dynamic Programming","Graphs","Binary Search","Bit Manipulation"] },
    },
  },
}

/**
 * Get section config for a company — used by generate-assessment and company-pattern APIs
 */
export function getCompanySectionConfig(company: string, section: string): SectionConfig | null {
  return COMPANY_ASSESSMENT_PATTERNS[company]?.sections[section] ?? null
}

/**
 * Convert COMPANY_ASSESSMENT_PATTERNS to CompanyPattern format for the pattern API
 */
export function getPatternForCompany(company: string, companyName: string): {
  totalQuestions: number
  totalTime: number
  sections: Array<{
    id: string; name: string; questions: number; timeMinutes: number
    difficulty: string; topics: string[]; isCoding: boolean
  }>
  notes: string
} | null {
  const p = COMPANY_ASSESSMENT_PATTERNS[company]
  if (!p) return null

  const sections = Object.entries(p.sections).map(([id, s]) => ({
    id,
    name:        s.name,
    questions:   s.count,
    timeMinutes: s.timeMinutes,
    difficulty:  s.difficulty,
    topics:      s.topics,
    isCoding:    s.isCoding,
  }))

  return {
    totalQuestions: sections.reduce((sum, s) => sum + s.questions, 0),
    totalTime:      p.totalTime,
    sections,
    notes:          p.notes,
  }
}
