"use client"

import { useState, useEffect } from "react"
import {
  BookOpen, Code2, Trophy, Star, Zap, CheckCircle2,
  Flame, Target, TrendingUp, ArrowRight, Sparkles,
  RefreshCw, Users, MessageCircle, Award, Brain,
  ChevronRight, ExternalLink, Heart, BookMarked,
} from "lucide-react"
import { FirstYearHub } from "@/components/student/first-year-hub"

// ── DATA ──────────────────────────────────────────────────────────────────────

const SOFT_SKILLS = [
  {
    id: "comm-basics", title: "Technical Communication Basics",
    desc: "How to explain code, ask good questions, write clear emails to teammates.",
    duration: "10 min", badge: "Communicator",
    steps: ["What is technical communication?", "How to ask a good question", "Writing clear commit messages", "Explaining your code to others"],
    videoUrl: "https://www.youtube.com/watch?v=zJFNHH4XKCE",
  },
  {
    id: "teamwork", title: "Working in a Dev Team",
    desc: "Git collaboration, code reviews, pair programming — what it's really like.",
    duration: "8 min", badge: "Team Player",
    steps: ["Git for teams: branches and PRs", "How code reviews work", "Pair programming basics", "Slack/Discord etiquette for devs"],
    videoUrl: "https://www.youtube.com/watch?v=MnUd31TvBoU",
  },
  {
    id: "growth-mindset", title: "Growth Mindset for Developers",
    desc: "Why debugging is learning. How to stay motivated when things are hard.",
    duration: "7 min", badge: "Growth Mindset",
    steps: ["Fixed vs growth mindset", "How to deal with imposter syndrome", "Celebrating small wins", "Building consistency over perfection"],
    videoUrl: "https://www.youtube.com/watch?v=_X0mgOOSpLU",
  },
  {
    id: "resume-basics", title: "Start Your Achievement Journal",
    desc: "Document what you build — not for jobs yet, just for self-awareness and growth.",
    duration: "5 min", badge: "Self-Aware",
    steps: ["Why document your journey?", "What counts as an achievement?", "Simple template: What I built today", "GitHub as your portfolio"],
    videoUrl: "https://www.youtube.com/watch?v=s-TZCBdJv5A",
  },
]

const MENTORSHIP_STORIES = [
  {
    name: "Priya S.", year: "Now at Google (SWE)",
    story: "I started in 1st year not knowing what a variable was. CS50 on YouTube changed everything. By 3rd year I had 3 internships. Start early, stay consistent.",
    tip: "Do CS50. Seriously. Just do it.",
    avatar: "PS",
  },
  {
    name: "Rahul M.", year: "Now at Swiggy (SDE-2)",
    story: "Failed my first coding interview badly in 2nd year. Instead of quitting, I started solving 1 LeetCode Easy per day. 200 days later I was getting calls from product companies.",
    tip: "1 problem per day beats 10 in one day.",
    avatar: "RM",
  },
  {
    name: "Anjali K.", year: "Placed at Infosys, now upskilling",
    story: "I focused on Python and web dev in first year instead of competitive programming. Built 2 projects that I showed in every interview. Projects > grades for placements.",
    tip: "Build something. Anything. Then build something better.",
    avatar: "AK",
  },
]

const RECOMMENDED_BOOKS = [
  { title: "The Pragmatic Programmer", author: "Hunt & Thomas", why: "Timeless advice on becoming a better developer. Read chapter by chapter.", url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/", tag: "Must Read" },
  { title: "Clean Code", author: "Robert C. Martin", why: "Learn to write code that other developers can read and understand.", url: "https://www.amazon.in/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882", tag: "Code Quality" },
  { title: "Grokking Algorithms", author: "Aditya Bhargava", why: "Best visual introduction to DSA. Perfect for 1st year. Fun to read.", url: "https://www.manning.com/books/grokking-algorithms", tag: "DSA Beginner" },
  { title: "You Don't Know JS", author: "Kyle Simpson", why: "Deep dive into JavaScript. Free on GitHub. Best JS book for beginners.", url: "https://github.com/getify/You-Dont-Know-JS", tag: "Free" },
  { title: "Automate the Boring Stuff", author: "Al Sweigart", why: "Python for real tasks. Free online. Great motivation because results are instant.", url: "https://automatetheboringstuff.com/", tag: "Free + Python" },
]

const RECOMMENDED_BLOGS = [
  { name: "GeeksforGeeks", desc: "Theory + code examples for every CS topic. Your go-to reference.", url: "https://www.geeksforgeeks.org/", tag: "Reference" },
  { name: "Dev.to", desc: "Developer community — read stories, tutorials, and career advice.", url: "https://dev.to/", tag: "Community" },
  { name: "FreeCodeCamp Blog", desc: "Long-form tutorials on web dev, Python, data science — all free.", url: "https://www.freecodecamp.org/news/", tag: "Tutorials" },
  { name: "Roadmap.sh", desc: "Visual learning roadmaps for every tech role. Know what to learn next.", url: "https://roadmap.sh/", tag: "Roadmaps" },
  { name: "CS50 Discourse", desc: "CS50's community forum — ask questions, get help from thousands of learners.", url: "https://cs50.stackexchange.com/", tag: "Community" },
  { name: "The Missing Semester (MIT)", desc: "Tools every developer needs — shell, git, editors. Free MIT course.", url: "https://missing.csail.mit.edu/", tag: "Free" },
]

const TOPIC_QUIZZES: Record<string, { q: string; opts: string[]; ans: number; explain: string }[]> = {
  python: [
    { q: "What is the output of: print(type(3.14))?", opts: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'double'>"], ans: 1, explain: "3.14 is a float literal in Python." },
    { q: "Which is used to define a function in Python?", opts: ["function", "def", "func", "define"], ans: 1, explain: "'def' keyword is used to define functions in Python." },
    { q: "What does len([1,2,3]) return?", opts: ["2", "3", "4", "Error"], ans: 1, explain: "len() returns the number of items — the list has 3 items." },
    { q: "Which loop runs a set number of times?", opts: ["while", "for", "do-while", "repeat"], ans: 1, explain: "'for' loop is typically used for a known number of iterations." },
  ],
  dsa: [
    { q: "What is the time complexity of binary search?", opts: ["O(n)", "O(log n)", "O(n²)", "O(1)"], ans: 1, explain: "Binary search halves the search space each step — O(log n)." },
    { q: "Which data structure uses LIFO?", opts: ["Queue", "Stack", "Array", "Linked List"], ans: 1, explain: "Stack follows Last In First Out (LIFO) principle." },
    { q: "Which is NOT a linear data structure?", opts: ["Array", "Tree", "Queue", "Linked List"], ans: 1, explain: "Trees are hierarchical (non-linear). Others are linear." },
    { q: "What does Big O notation measure?", opts: ["Memory only", "Time only", "Worst-case performance", "Best-case performance"], ans: 2, explain: "Big O describes the worst-case time/space complexity." },
  ],
  git: [
    { q: "Which command stages files for a commit?", opts: ["git commit", "git add", "git push", "git stage"], ans: 1, explain: "'git add' moves files to the staging area." },
    { q: "What does 'git push' do?", opts: ["Download code", "Upload local commits to remote", "Create a branch", "Merge branches"], ans: 1, explain: "git push uploads your local commits to the remote repository." },
    { q: "Which command creates a new branch?", opts: ["git branch new-branch", "git create branch", "git new branch", "git checkout new"], ans: 0, explain: "'git branch <name>' creates a new branch." },
    { q: "What is a 'merge conflict'?", opts: ["Git error", "Two branches changed the same lines", "Push failure", "Missing commit"], ans: 1, explain: "Merge conflicts occur when two branches modify the same lines differently." },
  ],
}

// ── Quiz Component ────────────────────────────────────────────────────────────
function TopicQuiz({ topic, onComplete }: { topic: string; onComplete: () => void }) {
  const qs = TOPIC_QUIZZES[topic] ?? []
  const [cur, setCur] = useState(0)
  const [sel, setSel] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = qs[cur]
  const choose = (i: number) => { if (answered) return; setSel(i); setAnswered(true); if (i === q.ans) setScore(s => s + 1) }
  const next = () => {
    if (cur + 1 < qs.length) { setCur(c => c+1); setSel(null); setAnswered(false) }
    else { setDone(true); onComplete() }
  }

  if (!qs.length) return null
  if (done) return (
    <div className="text-center py-6 space-y-3">
      <p className="text-3xl font-black" style={{ color: score >= 3 ? "#10b981" : "#f59e0b" }}>{score}/{qs.length}</p>
      <p className="text-sm font-semibold text-foreground">{score >= 3 ? "Great job! You know this topic well." : "Good attempt! Review the explanations and try again."}</p>
      <button onClick={() => { setCur(0); setSel(null); setAnswered(false); setScore(0); setDone(false) }}
        className="text-sm text-primary hover:underline flex items-center gap-1 mx-auto">
        <RefreshCw className="h-3.5 w-3.5" /> Retry quiz
      </button>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Question {cur+1}/{qs.length}</span>
        <span className="text-primary font-semibold">Score: {score}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((cur+1)/qs.length)*100}%` }} /></div>
      <div className="rounded-xl border border-border bg-card/50 p-4">
        <p className="text-sm font-medium text-foreground">{q.q}</p>
      </div>
      <div className="space-y-2">
        {q.opts.map((opt: string, i: number) => {
          let style: React.CSSProperties = { border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer" }
          if (answered) {
            if (i === q.ans) style = { border: "1px solid #10b981", background: "rgba(16,185,129,0.10)" }
            else if (i === sel) style = { border: "1px solid #ef4444", background: "rgba(239,68,68,0.10)", opacity: 0.8 }
            else style = { border: "1px solid var(--border)", background: "transparent", opacity: 0.45 }
          } else if (sel === i) style = { border: "1px solid #7c3aed", background: "rgba(124,58,237,0.12)", cursor: "pointer" }
          return (
            <button key={i} onClick={() => choose(i)} className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all" style={style}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold bg-white/5 text-muted-foreground">{["A","B","C","D"][i]}</span>
              <span className="text-sm text-foreground">{opt}</span>
              {answered && i === q.ans && <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto shrink-0" />}
            </button>
          )
        })}
      </div>
      {answered && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
          <p className="text-xs text-blue-400 font-semibold mb-1">Explanation</p>
          <p className="text-xs text-muted-foreground">{q.explain}</p>
        </div>
      )}
      {answered && (
        <button onClick={next} className="w-full h-10 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
          {cur+1 === qs.length ? "See Results" : "Next Question"} <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// ── Leaderboard ───────────────────────────────────────────────────────────────
function FirstYearLeaderboard() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch first-year students ranked by XP
    fetch("/api/student/first-year-leaderboard")
      .then(r => r.ok ? r.json() : { leaderboard: [] })
      .then(d => setData(d.leaderboard ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        Only 1st-year students — friendly competition, no pressure
      </p>
      {loading ? (
        <div className="flex justify-center py-8"><RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">
          <Trophy className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p>Be the first to earn XP and appear here!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((e: any, i: number) => (
            <div key={e.userId} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${e.isCurrentUser ? "border-violet-500/30 bg-violet-500/5" : "border-border bg-card/30"}`}>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black"
                style={{ background: i === 0 ? "#f59e0b20" : i === 1 ? "#94a3b820" : i === 2 ? "#b45309/20" : "rgba(255,255,255,0.05)", color: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#b45309" : "var(--muted-foreground)" }}>
                {i === 0 ? "1" : i === 1 ? "2" : i === 2 ? "3" : `${i+1}`}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{e.isCurrentUser ? "You" : e.userName}</p>
                <p className="text-[10px] text-muted-foreground">{e.completed} milestones · {e.streak} day streak</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black tabular-nums" style={{ color: "#f59e0b" }}>{e.totalXP} XP</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function FirstYearFullHub({ student }: { student: any }) {
  const [activeTab, setActiveTab] = useState("progress")
  const [standaloneMode, setStandaloneMode] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "")
      const validTabs = ["progress","learning","practice","challenges","resources","soft","quizzes","community","leaderboard","library","resume"]
      if (hash && validTabs.includes(hash)) {
        setActiveTab(hash)
        // Standalone mode: hide banner + tabs, show only content
        if (hash === "learning" || hash === "resume") setStandaloneMode(true)
      }
    }
  }, [])
  const [quizTopic, setQuizTopic] = useState<string | null>(null)
  const [completedSoftSkills, setCompletedSoftSkills] = useState<string[]>([])
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([])

  // Progress state
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([])
  const [completing, setCompleting] = useState<string | null>(null)
  const [dailyDone, setDailyDone] = useState(false)
  const [xpPop, setXpPop] = useState<string | null>(null)
  const [monthlySolved, setMonthlySolved] = useState(0)

  // Daily problem — rotates by day of year
  const DAILY_PROBLEMS = [
    { title: "Sum of Two Numbers",          desc: "Write a program that takes two numbers as input and prints their sum.", input: "5, 3", output: "8", explain: "Simply add the two numbers.", url: "https://leetcode.com/problems/two-sum/" },
    { title: "Reverse a String",            desc: "Write a function to reverse a given string without using built-in reverse.", input: '"hello"', output: '"olleh"', explain: "Use a loop from end to start.", url: "https://leetcode.com/problems/reverse-string/" },
    { title: "Find Maximum in Array",       desc: "Given an array of integers, find and return the largest element.", input: "[3, 7, 1, 9, 4]", output: "9", explain: "Iterate and track the max.", url: "https://leetcode.com/problems/find-maximum-in-array/" },
    { title: "Count Vowels",                desc: "Count the number of vowels (a, e, i, o, u) in a given string.", input: '"education"', output: "5", explain: "Check each character against vowels.", url: "https://leetcode.com/problems/count-vowel-substrings-of-a-string/" },
    { title: "Check Palindrome",            desc: "Determine if a given string reads the same forwards and backwards.", input: '"racecar"', output: "true", explain: "Compare string with its reverse.", url: "https://leetcode.com/problems/valid-palindrome/" },
    { title: "FizzBuzz",                    desc: "Print numbers 1 to N. For multiples of 3 print Fizz, for 5 print Buzz, for both print FizzBuzz.", input: "15", output: "1 2 Fizz 4 Buzz ... FizzBuzz", explain: "Use modulo % operator.", url: "https://leetcode.com/problems/fizz-buzz/" },
    { title: "Sum of Digits",               desc: "Given a number, compute the sum of its digits.", input: "1234", output: "10", explain: "Extract each digit using % and / operators.", url: "https://leetcode.com/problems/add-digits/" },
    { title: "Check Even or Odd",           desc: "Write a function that returns 'Even' if a number is even, 'Odd' otherwise.", input: "7", output: '"Odd"', explain: "A number is even if n % 2 === 0.", url: "https://leetcode.com/problems/number-of-even-and-odd-bits/" },
    { title: "Find Second Largest",         desc: "Find the second largest number in an array of integers.", input: "[4, 1, 7, 3, 9]", output: "7", explain: "Sort or use two variables to track top two.", url: "https://leetcode.com/problems/second-largest-digit-in-a-string/" },
    { title: "Count Occurrences",           desc: "Count how many times a given character appears in a string.", input: '"banana", "a"', output: "3", explain: "Loop through string and count matches.", url: "https://leetcode.com/problems/count-occurrences-in-text/" },
    { title: "Factorial of a Number",       desc: "Calculate the factorial of a given non-negative integer N.", input: "5", output: "120", explain: "Multiply N * (N-1) * ... * 1. Base case: 0! = 1.", url: "https://leetcode.com/problems/n-th-tribonacci-number/" },
    { title: "Print Fibonacci Sequence",    desc: "Print the first N numbers of the Fibonacci sequence.", input: "7", output: "0 1 1 2 3 5 8", explain: "Each number = sum of previous two.", url: "https://leetcode.com/problems/fibonacci-number/" },
    { title: "Check Prime Number",          desc: "Write a program to check if a given number is prime.", input: "17", output: "true", explain: "Check divisibility from 2 to sqrt(n).", url: "https://leetcode.com/problems/count-primes/" },
    { title: "Remove Duplicates from Array",desc: "Given an array, return a new array with all duplicate values removed.", input: "[1,2,2,3,3,4]", output: "[1,2,3,4]", explain: "Use a Set or check if element already seen.", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
    { title: "Swap Two Variables",          desc: "Swap two variables without using a third temporary variable.", input: "a=5, b=10", output: "a=10, b=5", explain: "Use arithmetic: a=a+b; b=a-b; a=a-b.", url: "https://leetcode.com/problems/swap-nodes-in-pairs/" },
    { title: "Linear Search",              desc: "Implement linear search: find the index of a target in an array.", input: "[4,2,8,1], target=8", output: "2", explain: "Iterate and check each element.", url: "https://leetcode.com/problems/search-insert-position/" },
    { title: "Reverse an Array",           desc: "Reverse the elements of an array in place.", input: "[1,2,3,4,5]", output: "[5,4,3,2,1]", explain: "Use two pointers from both ends.", url: "https://leetcode.com/problems/reverse-string/" },
    { title: "Sum of Array Elements",      desc: "Calculate the sum of all elements in an integer array.", input: "[1,2,3,4,5]", output: "15", explain: "Iterate with a running total variable.", url: "https://leetcode.com/problems/running-sum-of-1d-array/" },
    { title: "Count Words in a String",    desc: "Count the number of words in a given sentence.", input: '"Hello World Today"', output: "3", explain: "Split the string by spaces.", url: "https://leetcode.com/problems/number-of-words-in-a-sentence/" },
    { title: "Find GCD of Two Numbers",    desc: "Find the Greatest Common Divisor (GCD) of two integers.", input: "12, 8", output: "4", explain: "Use Euclidean algorithm: gcd(a,b) = gcd(b, a%b).", url: "https://leetcode.com/problems/find-greatest-common-divisor-of-array/" },
    { title: "Matrix Diagonal Sum",        desc: "Find the sum of both diagonals of an N×N matrix.", input: "[[1,2,3],[4,5,6],[7,8,9]]", output: "25", explain: "Add matrix[i][i] and matrix[i][n-1-i].", url: "https://leetcode.com/problems/matrix-diagonal-sum/" },
    { title: "Check Armstrong Number",     desc: "Check if a number is an Armstrong number (sum of digits^n = number).", input: "153", output: "true", explain: "153 = 1³ + 5³ + 3³ = 153.", url: "https://leetcode.com/problems/sum-of-digits-in-base-k/" },
    { title: "Binary to Decimal",          desc: "Convert a binary number (string) to its decimal equivalent.", input: '"1010"', output: "10", explain: "Multiply each bit by 2^position from right.", url: "https://leetcode.com/problems/convert-binary-number-in-a-linked-list-to-integer/" },
    { title: "Find Missing Number",        desc: "Given array 0 to N with one missing, find the missing number.", input: "[0,1,3,4]", output: "2", explain: "Sum 0..N = N*(N+1)/2. Subtract array sum.", url: "https://leetcode.com/problems/missing-number/" },
    { title: "Bubble Sort",                desc: "Implement bubble sort to sort an array of integers in ascending order.", input: "[64,34,25,12,22]", output: "[12,22,25,34,64]", explain: "Repeatedly swap adjacent elements if in wrong order.", url: "https://leetcode.com/problems/sort-an-array/" },
    { title: "Count Negative Numbers",     desc: "Count all negative numbers in a 2D grid.", input: "[[4,3,2],[1,-1,-2],[-3,-4,-5]]", output: "5", explain: "Iterate all elements, count where val < 0.", url: "https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/" },
    { title: "Power of Two",               desc: "Determine if a given integer is a power of two.", input: "16", output: "true", explain: "A power of 2 has only one bit set: n & (n-1) === 0.", url: "https://leetcode.com/problems/power-of-two/" },
    { title: "Reverse Words in a String",  desc: "Reverse the order of words in a sentence.", input: '"the sky is blue"', output: '"blue is sky the"', explain: "Split by space, reverse array, join.", url: "https://leetcode.com/problems/reverse-words-in-a-string/" },
    { title: "Find Duplicate Number",      desc: "Find the one duplicate number in an array containing n+1 integers in range [1,n].", input: "[1,3,4,2,2]", output: "2", explain: "Use a Set: first number seen twice is the answer.", url: "https://leetcode.com/problems/find-the-duplicate-number/" },
    { title: "Celsius to Fahrenheit",      desc: "Convert a temperature from Celsius to Fahrenheit.", input: "100", output: "212", explain: "Formula: F = C × 9/5 + 32.", url: "https://leetcode.com/problems/convert-the-temperature/" },
  ]
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const todayProblem = DAILY_PROBLEMS[dayOfYear % DAILY_PROBLEMS.length]

  const ROADMAP_STEPS = [
    { id: "py-basics",    title: "Learn Programming Basics",  color: "#3b82f6", xp: 50  },
    { id: "git-basics",   title: "Master Git & GitHub",       color: "#10b981", xp: 30  },
    { id: "web-basics",   title: "Web Dev Intro",             color: "#f59e0b", xp: 50  },
    { id: "arrays",       title: "DSA: Arrays & Strings",     color: "#8b5cf6", xp: 60  },
    { id: "lc-10",        title: "Solve 10 Easy Problems",    color: "#ef4444", xp: 100 },
    { id: "dsa-track",    title: "Start a DSA Course",        color: "#6366f1", xp: 40  },
    { id: "lc-25",        title: "Reach 25 Problems",         color: "#f59e0b", xp: 150 },
    { id: "project-1",    title: "Build Your First Project",  color: "#10b981", xp: 120 },
  ]

  useEffect(() => {
    fetch("/api/student/first-year-progress")
      .then(r => r.ok ? r.json() : { progress: null })
      .then(d => {
        if (d.progress) {
          setXp(d.progress.totalXP ?? 0)
          setStreak(d.progress.streak ?? 0)
          setCompletedMilestones(d.progress.completed ?? [])
          setMonthlySolved(d.progress.monthlyChallengesSolved ?? 0)
        }
      })
  }, [])

  const level = xp < 100 ? { name: "Seedling", icon: <Zap className="h-4 w-4 text-emerald-400" />, next: 100, color: "#10b981" }
    : xp < 300 ? { name: "Explorer", icon: <Target className="h-4 w-4 text-blue-400" />,   next: 300, color: "#3b82f6" }
    : xp < 600 ? { name: "Builder",  icon: <Code2 className="h-4 w-4 text-violet-400" />,  next: 600, color: "#8b5cf6" }
    : xp < 1000 ? { name: "Coder",   icon: <Star className="h-4 w-4 text-amber-400" />,    next: 1000, color: "#f59e0b" }
    : { name: "Developer", icon: <Trophy className="h-4 w-4 text-primary" />, next: 9999, color: "#7c3aed" }
  const levelPct = Math.min(Math.round((xp / level.next) * 100), 100)

  const showXpPop = (msg: string) => { setXpPop(msg); setTimeout(() => setXpPop(null), 2500) }

  const completeMilestone = async (id: string) => {
    if (completedMilestones.includes(id)) return
    setCompleting(id)
    try {
      const res = await fetch("/api/student/first-year-progress", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete-milestone", milestoneId: id }),
      })
      const data = await res.json()
      if (data.success) {
        setCompletedMilestones(p => [...p, id])
        setXp(data.newTotal)
        setStreak(data.newStreak)
        showXpPop(`+${data.xpGained} XP`)
      }
    } finally { setCompleting(null) }
  }

  const doDailyChallenge = async () => {
    const res = await fetch("/api/student/first-year-progress", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "daily-challenge" }),
    })
    const data = await res.json()
    if (data.alreadyDone) { setDailyDone(true); return }
    if (data.success) {
      setStreak(data.newStreak); setXp(data.totalXP)
      setMonthlySolved(m => m + 1); setDailyDone(true)
      showXpPop("+10 XP")
    }
  }

  const TABS = [
    { id: "progress",    label: "My Progress",  icon: <TrendingUp className="h-4 w-4" /> },
    { id: "practice",    label: "Practice",     icon: <Target className="h-4 w-4" /> },
    { id: "challenges",  label: "Challenges",   icon: <Code2 className="h-4 w-4" /> },
    { id: "soft",        label: "Soft Skills",  icon: <MessageCircle className="h-4 w-4" /> },
    { id: "community",   label: "Community",    icon: <Users className="h-4 w-4" /> },
  ]

  return (
    <div className="flex-1 p-4 md:p-6 max-w-screen-xl mx-auto w-full space-y-5">
      {/* Header — hidden in standalone mode */}
      {!standaloneMode && (
      <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/15 via-cyan-600/5 to-transparent p-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 shrink-0">
            <BookOpen className="h-5 w-5 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground">1st Year Learning Hub</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Build your foundation · No pressure · Just growth</p>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500/20 bg-blue-500/10 shrink-0">
            <span className="text-xs text-blue-400 font-semibold">Year 1</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">Grad {student.graduationYear}</span>
          </div>
        </div>
      </div>
      )}

      {/* Tabs — hidden in standalone mode */}
      {!standaloneMode && (
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          t.id === "practice" ? (
            <a key={t.id} href="/student/prep"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              style={{ background: "transparent", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
              {t.icon}{t.label}
            </a>
          ) : (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              style={activeTab === t.id
                ? { background: "rgba(124,58,237,0.20)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.35)" }
                : { background: "transparent", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
              {t.icon}{t.label}
            </button>
          )
        ))}
      </div>
      )}

      {/* XP pop toast */}
      {xpPop && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/20 text-amber-400 font-bold text-sm shadow-xl animate-bounce">
          <Zap className="h-4 w-4" />{xpPop}
        </div>
      )}

      {/* My Progress tab — dashboard layout */}
      {activeTab === "progress" && (
        <div className="space-y-5">
          {/* Welcome */}
          <div>
            <h2 className="text-2xl font-black text-foreground">Welcome back, {student.name?.split(" ")[0] ?? "Student"}!</h2>
            <p className="text-sm text-muted-foreground mt-0.5">You're on the right path. Keep going!</p>
          </div>

          {/* 4 stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Current Streak",   value: streak,                     sub: streak === 0 ? "Start today" : `${streak} days strong`,       color: "#10b981" },
              { label: "Problems Solved",  value: completedMilestones.filter(id => id.startsWith("lc")).length, sub: `+${monthlySolved} this month`, color: "#3b82f6" },
              { label: "Badges Earned",    value: Math.floor(xp / 100),       sub: `${Math.max(0, 6 - Math.floor(xp / 100))} to go`,             color: "#f59e0b" },
              { label: "Total Points",     value: xp,                         sub: "Points earned",                                               color: "#8b5cf6" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-border bg-card/50 p-4 flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-3xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Main 2-col layout */}
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            {/* LEFT column */}
            <div className="space-y-4">
              {/* Today's Challenge */}
              <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <p className="font-bold text-foreground">Today's Challenge</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/20">Easy</span>
                    <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-US", { weekday: "long" })}</span>
                  </div>
                </div>
                <div>
                  <p className="text-base font-black text-foreground">{todayProblem.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{todayProblem.desc}</p>
                </div>
                <div className="rounded-lg border border-border bg-black/20 p-3 text-xs font-mono space-y-1">
                  <p className="font-semibold text-muted-foreground text-[10px] mb-2">Example</p>
                  <p><span className="text-blue-400">Input:</span> <span className="text-foreground">{todayProblem.input}</span></p>
                  <p><span className="text-emerald-400">Output:</span> <span className="text-foreground">{todayProblem.output}</span></p>
                  <p className="text-muted-foreground pt-1 text-[10px]">{todayProblem.explain}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">Earn <span className="text-primary font-bold">10 points</span> · self-report when solved</p>
                  {dailyDone ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-semibold">
                      <CheckCircle2 className="h-4 w-4" /> Done today! +10 XP
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      <a href={todayProblem.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm border border-border text-foreground hover:border-primary/40 transition-all">
                        <ArrowRight className="h-4 w-4" /> Try Problem
                      </a>
                      <button onClick={doDailyChallenge}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-white transition-all"
                        style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)" }}>
                        <CheckCircle2 className="h-4 w-4" /> Mark as Solved
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Your Progress */}
              <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-primary/40 border-2 border-primary" />
                  <div>
                    <p className="font-bold text-foreground text-sm">Your Progress</p>
                    <p className="text-[10px] text-muted-foreground">
                      {level.name} · Week {Math.ceil((completedMilestones.length + 1) / 2)} : Fundamentals
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Challenge Progress</span>
                    <span className="font-semibold text-foreground">{completedMilestones.length} / {ROADMAP_STEPS.length}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.round((completedMilestones.length / ROADMAP_STEPS.length) * 100)}%`, background: "linear-gradient(90deg,#7c3aed,#10b981)" }} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">This Week's Topics</p>
                  {ROADMAP_STEPS.filter(s => !completedMilestones.includes(s.id)).slice(0, 3).map(step => (
                    <div key={step.id} className="flex items-center justify-between gap-3 py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full shrink-0" style={{ background: step.color }} />
                        <p className="text-xs text-muted-foreground">{step.title}</p>
                      </div>
                      <button onClick={() => completeMilestone(step.id)} disabled={completing === step.id}
                        className="text-[10px] px-2 py-0.5 rounded-lg border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-all">
                        {completing === step.id ? "..." : "Mark Done"}
                      </button>
                    </div>
                  ))}
                  {ROADMAP_STEPS.filter(s => !completedMilestones.includes(s.id)).length === 0 && (
                    <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> All milestones complete!
                    </p>
                  )}
                </div>
              </div>

              {/* Recommended Resources */}
              <div className="rounded-xl border border-border bg-card/50 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <BookMarked className="h-4 w-4 text-primary" />
                  <p className="font-bold text-foreground text-sm">Recommended Resources</p>
                </div>
                {[
                  { title: "CS50's Introduction to Computer Science", desc: "Harvard's legendary intro course — perfect for beginners", tag: "Video", duration: "Ongoing", url: "https://cs50.harvard.edu/x/" },
                  { title: "freeCodeCamp Python Tutorial", desc: "Comprehensive Python course — 4+ hours of content", tag: "Video", duration: "4 hours", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/" },
                  { title: "Git & GitHub Basics", desc: "A beginner-friendly introduction to version control and GitHub", tag: "Guide", duration: "15 min read", url: "https://skills.github.com/" },
                ].map(r => (
                  <div key={r.title} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border/50 hover:border-border transition-all">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground">{r.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{r.desc}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 font-semibold">{r.tag}</span>
                        <span className="text-[10px] text-muted-foreground">{r.duration}</span>
                      </div>
                    </div>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
                <button onClick={() => setActiveTab("resources")}
                  className="w-full py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
                  View All Resources
                </button>
              </div>
            </div>

            {/* RIGHT column */}
            <div className="space-y-4">
              {/* Streak card */}
              <div className="rounded-xl border border-border bg-card/50 p-5 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Flame className="h-4 w-4 text-amber-400" />
                  <p className="font-bold text-foreground text-sm">Streak</p>
                </div>
                <p className="text-5xl font-black tabular-nums text-amber-400">{streak}</p>
                <p className="text-xs text-muted-foreground">days</p>
                <p className="text-xs font-semibold text-foreground">{streak === 0 ? "Solve today's problem to start!" : streak === 1 ? "Great start! Come back tomorrow." : `${streak} day streak — keep it up!`}</p>
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/15 p-2 mt-2">
                  <p className="text-[10px] text-amber-400">
                    {dailyDone ? "Today's problem solved!" : "Solve today's problem to extend your streak"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{Math.max(0, 30 - streak)} days to 30-day badge</p>
                </div>
              </div>

              {/* Recent Badges */}
              <div className="rounded-xl border border-border bg-card/50 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <p className="font-bold text-foreground text-sm">Recent Badges</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "First",     color: "#ef4444", earned: xp > 0,    icon: <Star className="h-5 w-5" /> },
                    { label: "Week",      color: "#f59e0b", earned: streak >= 7, icon: <Flame className="h-5 w-5" /> },
                    { label: "Fortnight", color: "#10b981", earned: streak >= 14, icon: <Trophy className="h-5 w-5" /> },
                    { label: "Legend",    color: "#8b5cf6", earned: xp >= 500,  icon: <Zap className="h-5 w-5" /> },
                  ].map(b => (
                    <div key={b.label} className="flex flex-col items-center gap-1">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${b.earned ? "" : "opacity-25 grayscale"}`}
                        style={{ background: `${b.color}20`, border: `1px solid ${b.color}40`, color: b.color }}>
                        {b.icon}
                      </div>
                      <p className="text-[9px] text-muted-foreground">{b.label}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab("leaderboard")}
                  className="w-full py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
                  View All Badges
                </button>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl border border-border bg-card/50 p-5 space-y-2">
                <p className="font-bold text-foreground text-sm mb-3">Quick Actions</p>
                {[
                  { label: "View All Challenges", tab: "challenges", icon: <Code2 className="h-3.5 w-3.5" /> },
                  { label: "Learning Roadmap",    tab: "progress",   icon: <Target className="h-3.5 w-3.5" /> },
                  { label: "Community",           tab: "community",  icon: <Users className="h-3.5 w-3.5" /> },
                ].map(a => (
                  <button key={a.label} onClick={() => setActiveTab(a.tab)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all text-left">
                    {a.icon}{a.label}
                  </button>
                ))}
              </div>

              {/* Did you know */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs font-bold text-foreground mb-1">Did you know?</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Students who maintain a 7-day streak are 3x more likely to build lasting coding habits!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Learning Paths */}
      {activeTab === "learning" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Step-by-step learning paths with YouTube videos, courses, and cheatsheets for each topic.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Programming Basics — C", desc: "Variables, loops, functions, pointers, memory management", tags: ["C", "Beginner"], links: [
                { text: "GFG C Course", url: "https://www.geeksforgeeks.org/c-programming-language/", type: "course" },
                { text: "CS50x Harvard", url: "https://cs50.harvard.edu/x/2024/", type: "course" },
                { text: "Jenny's C Lectures", url: "https://www.youtube.com/playlist?list=PLdo5W4Nhv31a8UcMN9-35ghv8qyFWD9_S", type: "youtube" },
                { text: "C Cheatsheet", url: "https://www.geeksforgeeks.org/c-cheatsheet/", type: "notes" },
              ]},
              { label: "Programming Basics — Python", desc: "Syntax, OOP, data types, file handling, libraries", tags: ["Python", "Beginner"], links: [
                { text: "Python.org Tutorial", url: "https://docs.python.org/3/tutorial/", type: "course" },
                { text: "freeCodeCamp Python", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/", type: "course" },
                { text: "Python Full Course", url: "https://www.youtube.com/watch?v=t8pPdKYpowI", type: "youtube" },
                { text: "Python Cheatsheet", url: "https://www.pythoncheatsheet.org/", type: "notes" },
              ]},
              { label: "DSA Beginner Track", desc: "Arrays, Strings, Linked Lists, Stacks, Recursion", tags: ["Arrays", "DSA"], links: [
                { text: "GFG DSA Self-Paced", url: "https://www.geeksforgeeks.org/courses/dsa-self-paced", type: "course" },
                { text: "Abdul Bari Algorithms", url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O", type: "youtube" },
                { text: "Striver DSA Sheet", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz", type: "youtube" },
                { text: "DSA Cheatsheet GFG", url: "https://www.geeksforgeeks.org/top-algorithms-and-data-structures-for-competitive-programming/", type: "notes" },
              ]},
              { label: "Web Dev Basics", desc: "HTML, CSS, JavaScript — build your first webpage", tags: ["HTML", "CSS", "JS"], links: [
                { text: "freeCodeCamp Web", url: "https://www.freecodecamp.org/learn/responsive-web-design/", type: "course" },
                { text: "The Odin Project", url: "https://www.theodinproject.com/", type: "course" },
                { text: "Traversy HTML/CSS", url: "https://www.youtube.com/watch?v=UB1O30fR-EE", type: "youtube" },
                { text: "HTML Cheatsheet", url: "https://htmlcheatsheet.com/", type: "notes" },
              ]},
              { label: "Git & GitHub", desc: "Version control, branching, pull requests — essential skill", tags: ["Git", "GitHub"], links: [
                { text: "Git Handbook", url: "https://guides.github.com/introduction/git-handbook/", type: "course" },
                { text: "Git Crash Course", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", type: "youtube" },
                { text: "Kunal Kushwaha Git", url: "https://www.youtube.com/watch?v=apGV9Kg7ics", type: "youtube" },
                { text: "Git Cheatsheet", url: "https://training.github.com/downloads/github-git-cheat-sheet.pdf", type: "notes" },
              ]},
              { label: "CS50 — Intro to CS", desc: "Harvard's legendary free CS course — highly recommended", tags: ["CS Fundamentals"], links: [
                { text: "CS50x (Free)", url: "https://cs50.harvard.edu/x/2024/", type: "course" },
                { text: "CS50 Lecture 0", url: "https://www.youtube.com/watch?v=3LPJfIKxwWc", type: "youtube" },
                { text: "CS50 Playlist", url: "https://www.youtube.com/playlist?list=PLhQjrBD2T381WAHyx1pq-sBfykqMBI7V4", type: "youtube" },
                { text: "CS50 Notes", url: "https://cs50.ai/", type: "notes" },
              ]},
            ].map(item => (
              <div key={item.label} className="rounded-xl border border-border bg-card/40 flex flex-col gap-2.5 p-4">
                <p className="font-semibold text-sm text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map(tag => <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{tag}</span>)}
                </div>
                <div className="flex flex-wrap gap-2 pt-2 mt-auto border-t border-border/50">
                  {item.links.map(link => {
                    const isYT = link.type === "youtube"
                    const isNotes = link.type === "notes"
                    const btnColor = isYT ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                      : isNotes ? "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20"
                      : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    return (
                      <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${btnColor}`}>
                        {isYT && <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>}
                        {isNotes && <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>}
                        {!isYT && !isNotes && <ExternalLink className="h-3.5 w-3.5 shrink-0" />}
                        {link.text}
                      </a>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practice */}
      {activeTab === "practice" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">AI-powered practice tests — Aptitude, Coding/DSA, and Communication. Full quiz engine with instant explanations.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Aptitude",      desc: "Percentages, Profit & Loss, Time & Work, Probability, Data Interpretation and more.", color: "#f59e0b", href: "/student/prep" },
              { label: "Coding / DSA",  desc: "Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming — topic by topic.", color: "#6366f1", href: "/student/prep" },
              { label: "Communication", desc: "Grammar, Vocabulary, Reading Comprehension, Para Jumbles, Email Writing.", color: "#10b981", href: "/student/prep" },
            ].map(track => (
              <a key={track.label} href={track.href}
                className="group rounded-2xl border p-5 flex flex-col gap-3 transition-all hover:scale-[1.02] hover:shadow-xl"
                style={{ borderColor: `${track.color}30`, background: `${track.color}08` }}>
                <p className="font-bold text-base text-foreground">{track.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{track.desc}</p>
                <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: track.color }}>
                  Start <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Challenges */}
      {activeTab === "challenges" && (
        <div className="space-y-6">
          {/* Hero banner */}
          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 via-violet-500/5 to-transparent p-5">
            <p className="text-lg font-black text-foreground">Coding Challenges</p>
            <p className="text-xs text-muted-foreground mt-1">Real-world problems · Story series · Streak rewards · Skill badges</p>
          </div>

          {/* Real-world project challenges */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-violet-400" />Build Real Things — Project Challenges
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title:"Build a Calculator",      desc:"Build a calculator that handles +, -, ×, ÷ operations with keyboard input.",         badge:"Beginner",     color:"#3b82f6", url:"https://leetcode.com/problems/basic-calculator/" },
                { title:"Attendance Tracker",      desc:"Create a college attendance tracker that flags < 75% attendance.",                    badge:"Beginner",     color:"#10b981", url:"https://leetcode.com/problems/design-parking-system/" },
                { title:"Simple Chatbot",          desc:"Build a rule-based chatbot that replies to greetings, questions and goodbyes.",       badge:"Intermediate", color:"#8b5cf6", url:"https://leetcode.com/problems/design-hashmap/" },
                { title:"Weather Fetcher",         desc:"Use a free weather API to display temperature and conditions for any city.",          badge:"Intermediate", color:"#f59e0b", url:"https://open-meteo.com/en/docs" },
                { title:"Personal Portfolio Page", desc:"Build a clean portfolio page with your name, skills, and a project section.",        badge:"Beginner",     color:"#ec4899", url:"https://www.frontendmentor.io/challenges/personal-portfolio-webpage-449TFEOrBO" },
                { title:"Basic To-Do App",         desc:"Create a to-do app with add, complete, and delete functionality.",                   badge:"Beginner",     color:"#f97316", url:"https://leetcode.com/problems/design-hashmap/" },
              ].map(c => {
                const bColor = c.badge === "Beginner" ? "#10b981" : "#f59e0b"
                return (
                  <div key={c.title} className="rounded-xl border border-border bg-card/40 p-4 flex flex-col gap-3 hover:border-primary/30 transition-all group">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{c.title}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background:`${bColor}20`, color:bColor }}>{c.badge}</span>
                    </div>
                    <p className="text-xs text-muted-foreground flex-1">{c.desc}</p>
                    <a href={c.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                      style={{ background:`linear-gradient(135deg,${c.color},${c.color}cc)` }}>
                      <ExternalLink className="h-3.5 w-3.5" /> Try Challenge
                    </a>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Debugging challenges */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              <Code2 className="h-3.5 w-3.5 text-red-400" />Debug & Fix — Sharpen Your Eye
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title:"Fix the Loop Bug",       desc:'This code should print 1–10 but prints 0–9. Find and fix the off-by-one error.', snippet:"for i in range(0,10):\n  print(i)", fix:"range(1,11)", color:"#ef4444" },
                { title:"Output Prediction",      desc:'What does this print? Think before you run. "if 0: print(A) else: print(B)"',     snippet:'if 0:\n  print("A")\nelse:\n  print("B")', fix:'"B" — 0 is falsy', color:"#f59e0b" },
                { title:"Null Pointer Trap",       desc:"This code crashes. Identify why and write the fix.",                              snippet:"arr = None\nprint(arr[0])", fix:"Check arr is not None first", color:"#8b5cf6" },
              ].map(c => (
                <div key={c.title} className="rounded-xl border border-border bg-card/40 p-4 flex flex-col gap-3 hover:border-red-500/30 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:`${c.color}20`, color:c.color }}>Debug</span>
                    <p className="text-sm font-bold text-foreground">{c.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                  <div className="rounded-lg bg-black/20 border border-border p-2 font-mono text-xs text-emerald-400 whitespace-pre">{c.snippet}</div>
                  <details className="text-xs">
                    <summary className="cursor-pointer text-primary font-semibold hover:underline">Reveal Answer</summary>
                    <p className="mt-1 text-muted-foreground">{c.fix}</p>
                  </details>
                </div>
              ))}
            </div>
          </div>

          {/* Skill badge challenges */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              <Star className="h-3.5 w-3.5 text-amber-400" />Skill Badge Challenges — Earn Recognition
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { badge:"Array Pro",       desc:"Complete 5 array problems on LeetCode Easy",     color:"#3b82f6", earned: completedMilestones.length >= 2, url:"https://leetcode.com/tag/array/" },
                { badge:"Loop Master",     desc:"Solve 3 loop-based problems without hints",       color:"#10b981", earned: completedMilestones.length >= 3, url:"https://leetcode.com/problemset/?difficulty=EASY" },
                { badge:"String Wizard",   desc:"Complete 5 string manipulation problems",         color:"#8b5cf6", earned: completedMilestones.length >= 4, url:"https://leetcode.com/tag/string/" },
                { badge:"Git Committer",   desc:"Make 10 real commits on a GitHub project",       color:"#f59e0b", earned: completedMilestones.includes("git-basics"), url:"https://skills.github.com/" },
              ].map(b => (
                <div key={b.badge} className={`rounded-xl border p-4 flex flex-col gap-2 transition-all ${b.earned ? "border-emerald-500/30 bg-emerald-500/5" : "border-border bg-card/30 opacity-80"}`}>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background:`${b.color}20`, color:b.color }}>
                      <Trophy className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{b.badge}</p>
                      {b.earned && <span className="text-[9px] text-emerald-400 font-bold">EARNED</span>}
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{b.desc}</p>
                  {!b.earned && (
                    <a href={b.url} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-primary hover:underline flex items-center gap-1 font-semibold">
                      <ExternalLink className="h-3 w-3" /> Start earning
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Practice platforms */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-primary" />Daily Practice Platforms
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title:"LeetCode Easy",         difficulty:"Beginner",     color:"#f59e0b", url:"https://leetcode.com/problemset/?difficulty=EASY" },
                { title:"HackerRank Algorithms", difficulty:"Beginner",     color:"#10b981", url:"https://www.hackerrank.com/domains/algorithms" },
                { title:"GFG School Level",      difficulty:"Beginner",     color:"#3b82f6", url:"https://practice.geeksforgeeks.org/explore?difficulty%5B%5D=School" },
                { title:"LeetCode Daily",        difficulty:"Intermediate", color:"#8b5cf6", url:"https://leetcode.com/problemset/" },
                { title:"100 Days of Code",      difficulty:"Challenge",    color:"#ec4899", url:"https://www.100daysofcode.com/" },
                { title:"CodeChef Div4",         difficulty:"Intermediate", color:"#f97316", url:"https://www.codechef.com/contests" },
              ].map(c => {
                const diffColor = c.difficulty === "Beginner" ? "#10b981" : c.difficulty === "Intermediate" ? "#f59e0b" : "#ec4899"
                return (
                  <div key={c.title} className="rounded-xl border border-border bg-card/40 p-4 flex items-center justify-between gap-3 hover:border-primary/30 transition-all">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.title}</p>
                      <span className="text-[10px] font-bold" style={{ color:diffColor }}>{c.difficulty}</span>
                    </div>
                    <a href={c.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shrink-0"
                      style={{ background:`linear-gradient(135deg,#7c3aed,#6366f1)` }}>
                      <ExternalLink className="h-3 w-3" /> Open
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Resources */}
      {activeTab === "resources" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Curated courses, cheatsheets, and references — everything you need to build a solid foundation.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "CS50x Harvard",     type: "Course", color: "#ef4444", desc: "The world's best intro CS course. Free, beginner-friendly.",             url: "https://cs50.harvard.edu/x/" },
              { title: "freeCodeCamp",      type: "Course", color: "#10b981", desc: "Full web dev + Python curriculum, completely free.",                      url: "https://www.freecodecamp.org/" },
              { title: "The Odin Project",  type: "Course", color: "#f97316", desc: "Project-based full-stack web dev path. Build real things.",               url: "https://www.theodinproject.com/" },
              { title: "Kaggle Learn",      type: "ML",     color: "#06b6d4", desc: "Hands-on Python, ML, and data science micro-courses.",                    url: "https://www.kaggle.com/learn" },
              { title: "GFG DSA",           type: "DSA",    color: "#8b5cf6", desc: "Comprehensive DSA — theory, problems, and solutions.",                    url: "https://www.geeksforgeeks.org/data-structures/" },
              { title: "Python Cheatsheet", type: "Notes",  color: "#f59e0b", desc: "Quick reference for Python syntax and common patterns.",                  url: "https://www.pythoncheatsheet.org/" },
              { title: "Git Cheatsheet",    type: "Notes",  color: "#3b82f6", desc: "All essential git commands in one place. Bookmark this.",                 url: "https://education.github.com/git-cheat-sheet-education.pdf" },
              { title: "DBMS Notes GFG",    type: "Notes",  color: "#14b8a6", desc: "Database fundamentals — ER models, normalization, SQL.",                  url: "https://www.geeksforgeeks.org/dbms/" },
            ].map(r => (
              <div key={r.title} className="rounded-xl border border-border bg-card/40 p-4 flex flex-col gap-2.5 hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{r.title}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: `${r.color}20`, color: r.color }}>{r.type}</span>
                </div>
                <p className="text-xs text-muted-foreground flex-1">{r.desc}</p>
                <a href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold border border-border text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all">
                  <ExternalLink className="h-3.5 w-3.5" /> Open
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Soft Skills */}
      {activeTab === "soft" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Bite-sized modules on communication, teamwork, and growth mindset. Each takes under 10 minutes.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {SOFT_SKILLS.map(skill => {
              const done = completedSoftSkills.includes(skill.id)
              return (
                <div key={skill.id} className={`rounded-2xl border p-5 space-y-3 transition-all ${done ? "border-emerald-500/20 bg-emerald-500/5" : "border-border bg-card"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{skill.title}</p>
                        {done && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{skill.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">{skill.duration}</span>
                      {done && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">{skill.badge}</span>}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {skill.steps.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[9px] mt-0.5">{i+1}</span>
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <a href={skill.videoUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 transition-all">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      Watch
                    </a>
                    {!done && (
                      <button onClick={() => setCompletedSoftSkills(p => [...p, skill.id])}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                        <CheckCircle2 className="h-3 w-3" /> Mark Done
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Self-check quizzes */}
      {activeTab === "quizzes" && !quizTopic && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Short 4-question quizzes to check your understanding. Encouraging feedback — no pressure.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { id: "python", label: "Python Basics", icon: "PY", color: "#3b82f6", desc: "Variables, types, loops, functions" },
              { id: "dsa",    label: "DSA Intro",     icon: "DS", color: "#8b5cf6", desc: "Arrays, stacks, Big O basics" },
              { id: "git",    label: "Git & GitHub",  icon: "GH", color: "#10b981", desc: "Add, commit, push, branches" },
            ].map(q => {
              const done = completedQuizzes.includes(q.id)
              return (
                <button key={q.id} onClick={() => setQuizTopic(q.id)}
                  className="rounded-2xl border p-5 text-left transition-all hover:border-primary/30 hover:shadow-lg"
                  style={{ borderColor: done ? "#10b98130" : "var(--border)", background: done ? "rgba(16,185,129,0.05)" : "var(--card)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold"
                      style={{ background: `${q.color}15`, border: `1px solid ${q.color}30`, color: q.color }}>
                      {q.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{q.label}</p>
                      {done && <span className="text-[10px] text-emerald-400 font-semibold">Completed</span>}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{q.desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold" style={{ color: q.color }}>
                    {done ? <RefreshCw className="h-3 w-3" /> : <Brain className="h-3 w-3" />}
                    {done ? "Retake Quiz" : "Start Quiz"} <ChevronRight className="h-3 w-3" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
      {activeTab === "quizzes" && quizTopic && (
        <div className="max-w-lg mx-auto space-y-4">
          <button onClick={() => setQuizTopic(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="h-4 w-4 rotate-180" /> Back to topics
          </button>
          <div className="rounded-2xl border border-border bg-card p-5">
            <TopicQuiz topic={quizTopic} onComplete={() => { setCompletedQuizzes(p => p.includes(quizTopic) ? p : [...p, quizTopic]); setTimeout(() => setQuizTopic(null), 2000) }} />
          </div>
        </div>
      )}

      {/* Community + Mentorship */}
      {activeTab === "community" && (
        <div className="space-y-5">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
            <MessageCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Join the 1st Year Group Chat</p>
              <p className="text-xs text-muted-foreground mt-1">Ask questions, share victories, find study buddies. Moderated and encouraging.</p>
              <a href="https://discord.com/invite/DvYWXNr4yR" target="_blank" rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                Join Discord Community <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-400" />Senior Stories — How They Made It
            </p>
            <div className="space-y-3">
              {MENTORSHIP_STORIES.map(s => (
                <div key={s.name} className="rounded-xl border border-border bg-card/50 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-black">{s.avatar}</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground">{s.year}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{s.story}</p>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15">
                    <Star className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-300 font-medium">{s.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {activeTab === "leaderboard" && <FirstYearLeaderboard />}

      {/* Library */}
      {activeTab === "library" && (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-primary" />Recommended Books
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {RECOMMENDED_BOOKS.map(b => (
                <a key={b.title} href={b.url} target="_blank" rel="noopener noreferrer"
                  className="rounded-xl border border-border bg-card/50 p-4 hover:border-primary/30 hover:shadow-md transition-all group flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{b.title}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold shrink-0">{b.tag}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">by {b.author}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{b.why}</p>
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" />Recommended Blogs & Resources
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {RECOMMENDED_BLOGS.map(b => (
                <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer"
                  className="rounded-xl border border-border bg-card/50 p-4 hover:border-primary/30 hover:shadow-md transition-all group flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{b.name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-semibold shrink-0">{b.tag}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">{b.desc}</p>
                  <p className="text-[10px] text-primary font-semibold flex items-center gap-1">Open <ChevronRight className="h-3 w-3" /></p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
