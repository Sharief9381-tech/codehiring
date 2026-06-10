"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  BookOpen, Code2, Briefcase, Trophy, Rocket,
  ExternalLink, Brain, Zap, Calendar,
  TrendingUp, Building2, Globe, MapPin, IndianRupee, Loader2, Clock, Target, Sparkles, FileText,
} from "lucide-react"
import { SmartResume } from "@/components/student/smart-resume"

// -- Types ---------------------------------------------------------------------

interface ContentItem {
  label: string
  description?: string
  links?: { text: string; url: string }[]
  tags?: string[]
}

interface Internship {
  company: string
  logo: string
  role: string
  description: string
  stipend: string
  deadline: string
  tags: string[]
  applyUrl: string
  tier: "startup" | "unicorn" | "mnc"
}

interface SkillCard {
  name: string
  description: string
  category: string
  hot?: boolean
  learnUrl: string
  tags: string[]
}

interface LiveJob {
  _id: string
  title: string
  companyName: string
  location: string
  salary: string
  type: string
  description: string
  skills: string[]
  deadline?: string
  applyUrl?: string
  postedByRole?: "recruiter" | "college"
  recruiterName: string
  createdAt: string
}

interface Section {
  id: string
  title: string
  icon: React.ReactNode
  items?: ContentItem[]
  internships?: Internship[]
  skills?: SkillCard[]
  liveJobs?: true
  smartResume?: true
}

// -- Internship data -----------------------------------------------------------

const tierLabel: Record<Internship["tier"], string> = {
  startup: "Startup", unicorn: "Unicorn", mnc: "MNC",
}
const tierColor: Record<Internship["tier"], string> = {
  startup: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  unicorn: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  mnc: "bg-amber-500/10 text-amber-600 border-amber-500/20",
}

const internships: Internship[] = [
  { company: "Internshala", logo: "IN", role: "CS / Web Dev / ML / Android", description: "India's #1 internship platform. 1000+ live tech internships daily. Filter by role, stipend, remote, and duration.", stipend: "Rs 5K-30K/month", deadline: "Ongoing", tags: ["All Roles", "Remote", "Fresher"], applyUrl: "https://internshala.com/internships/computer-science-internship/", tier: "startup" },
  { company: "Cutshort", logo: "CS", role: "Tech Intern · Vetted Startups", description: "AI-matched live internships at vetted Indian product companies and startups. No spam, quality roles only.", stipend: "Rs 10K-50K/month", deadline: "Ongoing", tags: ["Startup", "AI-matched", "India"], applyUrl: "https://cutshort.io/jobs?type=internship", tier: "startup" },
  { company: "Wellfound", logo: "WF", role: "Startup Intern · All Roles", description: "AngelList's job board with thousands of live startup internships in SWE, design, data, and product.", stipend: "Varies", deadline: "Ongoing", tags: ["Startup", "Global", "All Roles"], applyUrl: "https://wellfound.com/jobs?jobType=internship", tier: "startup" },
  { company: "GirlScript SoC", logo: "GS", role: "Open Source Contributor", description: "India's largest student open source program. Contribute to live projects, earn points, get certificates.", stipend: "Goodies + Certificate", deadline: "Ongoing", tags: ["Open Source", "India", "GSSoC"], applyUrl: "https://gssoc.girlscript.tech/", tier: "startup" },
  { company: "Razorpay", logo: "RP", role: "SWE / ML / DevOps Intern", description: "India's top fintech unicorn. Work on payment infrastructure, ML fraud detection, and platform engineering.", stipend: "Rs 60K-1L/month", deadline: "Ongoing", tags: ["Fintech", "Unicorn", "PPO"], applyUrl: "https://razorpay.com/jobs/?team=engineering&type=intern", tier: "unicorn" },
  { company: "Swiggy", logo: "SW", role: "SDE / Data Science Intern", description: "Real-time logistics, ML demand forecasting, and consumer engineering at India's top delivery unicorn.", stipend: "Rs 50K-80K/month", deadline: "Ongoing", tags: ["SDE", "ML", "Unicorn"], applyUrl: "https://careers.swiggy.com/#/", tier: "unicorn" },
  { company: "Zomato", logo: "ZO", role: "Tech / Data Science Intern", description: "Build the future of food delivery. Live roles in backend, data science, and mobile at India's food-tech unicorn.", stipend: "Rs 50K-90K/month", deadline: "Ongoing", tags: ["Backend", "Mobile", "Unicorn"], applyUrl: "https://www.zomato.com/careers", tier: "unicorn" },
  { company: "CRED", logo: "CR", role: "SWE / Product Intern", description: "India's premium fintech for creditworthy users. Work on high-quality product and platform engineering.", stipend: "Rs 60K-1L/month", deadline: "Ongoing", tags: ["Fintech", "Product", "Unicorn"], applyUrl: "https://careers.cred.club/", tier: "unicorn" },
  { company: "Meesho", logo: "ME", role: "SDE / Data Intern", description: "India's social commerce unicorn. Work on supply chain, ML-powered recommendations, and seller tools.", stipend: "Rs 50K-80K/month", deadline: "Ongoing", tags: ["E-commerce", "ML", "Unicorn"], applyUrl: "https://meesho.io/careers", tier: "unicorn" },
  { company: "Google", logo: "GO", role: "STEP / SWE Intern", description: "Google's engineering intern program. Work on products used by billions, with mentorship and strong PPO history.", stipend: "Rs 1.2L-2L/month", deadline: "Applications open Nov-Dec", tags: ["SWE", "MNC", "PPO"], applyUrl: "https://careers.google.com/jobs/results/?category=INTERNSHIP&employment_type=INTERN", tier: "mnc" },
  { company: "Microsoft", logo: "MS", role: "Software Engineer Intern", description: "Summer internship across SWE, data science, and PM. Strong PPO culture across India and global offices.", stipend: "Rs 1L-1.8L/month", deadline: "Applications open Oct-Jan", tags: ["SWE", "MNC", "PPO"], applyUrl: "https://careers.microsoft.com/students/us/en/job/internship", tier: "mnc" },
  { company: "Amazon", logo: "AZ", role: "SDE Intern", description: "Build features used by millions on Amazon's platform. Excellent PPO conversion and competitive stipend.", stipend: "Rs 90K-1.5L/month", deadline: "Applications open Aug-Oct", tags: ["SDE", "MNC", "PPO"], applyUrl: "https://www.amazon.jobs/en/job_categories/software-development?job_type%5B%5D=Internship", tier: "mnc" },
  { company: "Adobe", logo: "AD", role: "Software Development Intern", description: "Adobe India intern program · Creative Cloud, Document Cloud, and Experience Cloud product teams.", stipend: "Rs 80K-1.3L/month", deadline: "Applications open Nov-Feb", tags: ["SWE", "MNC", "Product"], applyUrl: "https://careers.adobe.com/us/en/search-results?keywords=intern", tier: "mnc" },
  { company: "LinkedIn", logo: "LI", role: "SWE / Data / PM Intern", description: "Browse all live intern listings across every company. Sort by recency for the freshest openings.", stipend: "Varies", deadline: "Ongoing", tags: ["All Companies", "Global", "Filter"], applyUrl: "https://www.linkedin.com/jobs/search/?keywords=software+engineer+intern&f_JT=I&sortBy=DD", tier: "mnc" },
]

// -- Trending skills -----------------------------------------------------------

const trendingSkills: SkillCard[] = [
  { name: "Python", hot: true, category: "Language", description: "The #1 language for AI, data science, backend, and automation. Easiest to learn, hardest to master.", tags: ["AI/ML", "Backend", "Scripting"], learnUrl: "https://docs.python.org/3/tutorial/" },
  { name: "TypeScript", hot: true, category: "Language", description: "JavaScript with types. Used in every modern frontend and backend codebase. Recruiters love it.", tags: ["Frontend", "Backend", "In-demand"], learnUrl: "https://www.typescriptlang.org/docs/handbook/intro.html" },
  { name: "React", hot: true, category: "Frontend", description: "The most widely-used UI library. Powers Facebook, Instagram, Airbnb, and thousands of startups.", tags: ["Frontend", "UI", "Popular"], learnUrl: "https://react.dev/learn" },
  { name: "LLM / GenAI", hot: true, category: "AI/ML", description: "Build with GPT, Gemini, Claude. The most demanded skill in 2025 across product and research roles.", tags: ["AI", "GenAI", "Trending"], learnUrl: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/" },
  { name: "Next.js", hot: true, category: "Full Stack", description: "React-based full stack framework. Used by Vercel, TikTok, Notion. Best for modern web apps.", tags: ["Full Stack", "React", "SSR"], learnUrl: "https://nextjs.org/learn" },
  { name: "AWS", hot: true, category: "Cloud", description: "World's #1 cloud. EC2, S3, Lambda · knowing AWS is a must for any backend or DevOps role.", tags: ["Cloud", "DevOps", "MNC"], learnUrl: "https://aws.amazon.com/training/learn-about/cloud-essentials/" },
  { name: "Docker", hot: true, category: "DevOps", description: "Containerisation platform used by every company. Makes your apps run the same everywhere.", tags: ["DevOps", "Containers", "CI/CD"], learnUrl: "https://docs.docker.com/get-started/" },
  { name: "LangChain", hot: true, category: "AI/ML", description: "Framework for building LLM-powered apps · chatbots, RAG pipelines, AI agents. Exploding demand.", tags: ["AI", "LLM", "Agents"], learnUrl: "https://python.langchain.com/docs/get_started/introduction" },
  { name: "HuggingFace", hot: true, category: "AI/ML", description: "Open-source hub for pretrained ML models. Standard tool for NLP, CV, and speech research roles.", tags: ["AI", "NLP", "Models"], learnUrl: "https://huggingface.co/learn/nlp-course/chapter1/1" },
  { name: "Go (Golang)", hot: true, category: "Language", description: "Fast, simple, concurrent. Used at Google, Uber, Dropbox. Great for microservices and backend.", tags: ["Backend", "Microservices", "Google"], learnUrl: "https://go.dev/tour/welcome/1" },
  { name: "PostgreSQL", hot: true, category: "Database", description: "Most advanced open-source relational DB. Standard choice for startups and product companies.", tags: ["Database", "SQL", "Backend"], learnUrl: "https://www.postgresql.org/docs/current/tutorial.html" },
  { name: "Redis", hot: true, category: "Database", description: "In-memory data store for caching, sessions, queues. Found in virtually every scalable system.", tags: ["Database", "Caching", "Real-time"], learnUrl: "https://redis.io/docs/get-started/" },
  { name: "CI/CD", hot: true, category: "DevOps", description: "Automate build, test, deploy pipelines with GitHub Actions. Expected skill in every SDE role.", tags: ["DevOps", "Automation", "GitHub"], learnUrl: "https://docs.github.com/en/actions/learn-github-actions" },
  { name: "PyTorch", hot: true, category: "AI/ML", description: "Facebook's deep learning framework. Industry standard for research and production ML models.", tags: ["AI", "Deep Learning", "Research"], learnUrl: "https://pytorch.org/tutorials/beginner/basics/intro.html" },
  { name: "Data Structures", hot: false, category: "Core CS", description: "Foundation of every coding interview. Arrays, trees, graphs, heaps · master these to crack any OA.", tags: ["DSA", "Interviews", "Must Do"], learnUrl: "https://www.geeksforgeeks.org/data-structures/" },
  { name: "Algorithms", hot: false, category: "Core CS", description: "Sorting, searching, DP, greedy · the building blocks that interviewers test in every round.", tags: ["DSA", "LeetCode", "Must Do"], learnUrl: "https://neetcode.io/roadmap" },
  { name: "System Design", hot: false, category: "Core CS", description: "Design scalable systems like YouTube, WhatsApp. Critical for SDE-2+ and senior roles.", tags: ["Architecture", "HLD", "Senior"], learnUrl: "https://github.com/donnemartin/system-design-primer" },
  { name: "Node.js", hot: false, category: "Backend", description: "JavaScript on the server. Powers Netflix, LinkedIn, PayPal. Paired with Express for REST APIs.", tags: ["Backend", "JavaScript", "APIs"], learnUrl: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs" },
  { name: "Kubernetes", hot: false, category: "DevOps", description: "Container orchestration platform. Manages Docker containers at scale. Big tech standard.", tags: ["DevOps", "Containers", "Scale"], learnUrl: "https://kubernetes.io/docs/tutorials/kubernetes-basics/" },
  { name: "Flutter", hot: false, category: "Mobile", description: "Google's cross-platform UI toolkit. Build iOS and Android apps from a single codebase.", tags: ["Mobile", "Dart", "Cross-platform"], learnUrl: "https://docs.flutter.dev/get-started/codelab" },
  { name: "GraphQL", hot: false, category: "API", description: "Query language for APIs. More flexible than REST. Used by Facebook, GitHub, Shopify.", tags: ["API", "Frontend", "Backend"], learnUrl: "https://graphql.org/learn/" },
  { name: "Supabase", hot: false, category: "Database", description: "Open-source Firebase alternative. Postgres + auth + storage + realtime. Great for side projects.", tags: ["Database", "BaaS", "Startup"], learnUrl: "https://supabase.com/docs" },
  { name: "TensorFlow", hot: false, category: "AI/ML", description: "Google's ML framework. Widely used for production deployment of deep learning models.", tags: ["AI", "ML", "Google"], learnUrl: "https://www.tensorflow.org/tutorials" },
  { name: "MongoDB", hot: false, category: "Database", description: "Leading NoSQL document database. Flexible schema, great for rapid prototyping and MERN apps.", tags: ["Database", "NoSQL", "MERN"], learnUrl: "https://learn.mongodb.com/learning-paths/introduction-to-mongodb" },
  { name: "OOP Concepts", hot: false, category: "Core CS", description: "Classes, inheritance, polymorphism, encapsulation. Core of every Java/Python/C++ interview.", tags: ["Core CS", "Interviews", "Fundamentals"], learnUrl: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/" },
  { name: "OS Concepts", hot: false, category: "Core CS", description: "Processes, threads, memory management, scheduling. Asked in every campus placement technical round.", tags: ["Core CS", "Placement", "Theory"], learnUrl: "https://www.geeksforgeeks.org/operating-systems/" },
  { name: "DBMS", hot: false, category: "Core CS", description: "ER models, normalization, SQL, transactions, indexing. Essential for backend and data engineering.", tags: ["Core CS", "SQL", "Placement"], learnUrl: "https://www.geeksforgeeks.org/dbms/" },
  { name: "Computer Networks", hot: false, category: "Core CS", description: "TCP/IP, HTTP, DNS, OSI model. Appears in every MNC placement test and cloud interviews.", tags: ["Core CS", "Networking", "Cloud"], learnUrl: "https://www.geeksforgeeks.org/computer-network-tutorials/" },
  { name: "Microservices", hot: false, category: "Architecture", description: "Build apps as small independent services. Dominant architecture at Amazon, Netflix, Uber.", tags: ["Backend", "Architecture", "Scale"], learnUrl: "https://microservices.io/patterns/microservices.html" },
  { name: "React Native", hot: false, category: "Mobile", description: "Build native iOS and Android apps with React. Reuse web knowledge for mobile development.", tags: ["Mobile", "React", "Cross-platform"], learnUrl: "https://reactnative.dev/docs/getting-started" },
  { name: "Rust", hot: false, category: "Language", description: "Memory-safe systems language. Fastest-growing in Stack Overflow surveys. Used at Mozilla, Discord.", tags: ["Systems", "Performance", "Safe"], learnUrl: "https://doc.rust-lang.org/book/" },
]

// -- Year content --------------------------------------------------------------

const yearContent: Record<number, { label: string; emoji: string; tagline: string; color: string; sections: Section[] }> = {
  1: {
    label: "1st Year", emoji: "🌱", tagline: "Learn & Build Foundation", color: "from-blue-600 to-cyan-600",
    sections: [
      {
        id: "learning", title: "Learning Paths", icon: <BookOpen className="h-4 w-4" />,
        items: [
          { label: "Programming Basics · C", description: "Variables, loops, functions, pointers", tags: ["C", "Beginner"], links: [{ text: "GFG C Course", url: "https://www.geeksforgeeks.org/c-programming-language/" }, { text: "CS50x Harvard", url: "https://cs50.harvard.edu/x/2024/" }] },
          { label: "Programming Basics · Python", description: "Syntax, OOP, data types, file handling", tags: ["Python", "Beginner"], links: [{ text: "Python.org Tutorial", url: "https://docs.python.org/3/tutorial/" }, { text: "freeCodeCamp Python", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/" }] },
          { label: "DSA Beginner", description: "Arrays, Strings, Linked Lists, Stacks, Recursion", tags: ["Arrays", "DSA"], links: [{ text: "GFG DSA Self-Paced", url: "https://www.geeksforgeeks.org/courses/dsa-self-paced" }, { text: "CodeChef DSA Course", url: "https://www.codechef.com/learn/course/dsa" }] },
          { label: "Web Dev Basics", description: "HTML, CSS, JavaScript · build your first webpage", tags: ["HTML", "CSS", "JS"], links: [{ text: "freeCodeCamp Web", url: "https://www.freecodecamp.org/learn/responsive-web-design/" }, { text: "The Odin Project", url: "https://www.theodinproject.com/paths/foundations/courses/foundations" }] },
          { label: "AI/ML Basics", description: "Intro to ML, math foundations, Python for data", tags: ["Python", "NumPy", "Pandas"], links: [{ text: "Kaggle Intro to ML", url: "https://www.kaggle.com/learn/intro-to-machine-learning" }, { text: "Kaggle Python Course", url: "https://www.kaggle.com/learn/python" }] },
        ],
      },
      {
        id: "practice", title: "Practice Problems", icon: <Code2 className="h-4 w-4" />,
        items: [
          { label: "LeetCode Easy", description: "Pre-filtered Easy problems to start solving today", tags: ["Easy", "Beginner"], links: [{ text: "Start Solving", url: "https://leetcode.com/problemset/?difficulty=EASY&page=1" }] },
          { label: "HackerRank Algorithms", description: "Beginner-friendly problems with guided hints", tags: ["HackerRank"], links: [{ text: "Easy Algorithms", url: "https://www.hackerrank.com/domains/algorithms?filters%5Bdifficulty%5D%5B%5D=easy" }] },
          { label: "GFG School Level", description: "School and basic level problems on GeeksforGeeks", tags: ["GFG", "School"], links: [{ text: "School Problems", url: "https://practice.geeksforgeeks.org/explore?difficulty%5B%5D=0&page=1" }] },
          { label: "LeetCode Daily", description: "One problem a day to build your streak", tags: ["Daily", "Streak"], links: [{ text: "Today's Problem", url: "https://leetcode.com/problemset/" }] },
        ],
      },
      { id: "smart-resume", title: "Smart Resume", icon: <Sparkles className="h-4 w-4" />, smartResume: true },
    ],
  },
  2: {
    label: "2nd Year", emoji: "📘", tagline: "Skill + Internship Mode", color: "from-violet-600 to-purple-600",
    sections: [
      {
        id: "skills", title: "Trending Skills", icon: <TrendingUp className="h-4 w-4" />,
        skills: trendingSkills,
      },
      {
        id: "internships", title: "Internships", icon: <Briefcase className="h-4 w-4" />,
        internships,
      },
      { id: "smart-resume", title: "Smart Resume", icon: <Sparkles className="h-4 w-4" />, smartResume: true },
    ],
  },
  3: {
    label: "3rd Year", emoji: "📘", tagline: "Placement Preparation", color: "from-orange-600 to-amber-600",
    sections: [
      {
        id: "placement", title: "Placement Tools", icon: <Trophy className="h-4 w-4" />,
        items: [
          { label: "Company-wise Questions · GFG", description: "Interview questions sorted by company", tags: ["Amazon", "Google", "TCS"], links: [{ text: "Amazon Prep", url: "https://www.geeksforgeeks.org/amazon-interview-preparation/" }, { text: "Google Prep", url: "https://www.geeksforgeeks.org/google-interview-preparation/" }, { text: "TCS NQT Prep", url: "https://www.geeksforgeeks.org/tcs-nqt-preparation/" }] },
          { label: "LeetCode Company Tags", description: "Filter problems by the company that asked them", tags: ["LeetCode", "OA"], links: [{ text: "Company Tags", url: "https://leetcode.com/company/" }, { text: "LeetCode Mock", url: "https://leetcode.com/interview/" }] },
          { label: "Mock Interviews", description: "Practice live mock interviews with peers or AI", tags: ["Mock", "Technical", "HR"], links: [{ text: "Pramp Free Mock", url: "https://www.pramp.com/#/" }, { text: "InterviewBit Mock", url: "https://www.interviewbit.com/mock-interview/" }] },
          { label: "Aptitude Practice", description: "Quant, verbal, logical reasoning for placement tests", tags: ["Quant", "Verbal"], links: [{ text: "IndiaBix Quant", url: "https://www.indiabix.com/aptitude/questions-and-answers/" }, { text: "PrepInsta TCS", url: "https://prepinsta.com/tcs-nqt/" }, { text: "PrepInsta Infosys", url: "https://prepinsta.com/infosys/" }] },
          { label: "Resume Builder", description: "ATS-friendly, recruiter-approved templates", tags: ["Resume", "ATS"], links: [{ text: "Resumake.io", url: "https://resumake.io/" }, { text: "FlowCV", url: "https://flowcv.com/" }, { text: "Overleaf LaTeX CV", url: "https://www.overleaf.com/gallery/tagged/cv" }] },
        ],
      },
      {
        id: "dsa", title: "DSA & Interview", icon: <Brain className="h-4 w-4" />,
        items: [
          { label: "LeetCode Top 150", description: "The definitive 150 interview problems", tags: ["Top 150", "Must Do"], links: [{ text: "Study Plan", url: "https://leetcode.com/studyplan/top-interview-150/" }] },
          { label: "Neetcode 150", description: "150 curated problems with video solutions", tags: ["Neetcode", "Video"], links: [{ text: "Neetcode Practice", url: "https://neetcode.io/practice" }, { text: "Neetcode Roadmap", url: "https://neetcode.io/roadmap" }] },
          { label: "System Design Basics", description: "Scalability, caching, load balancing for interviews", tags: ["System Design", "HLD"], links: [{ text: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" }, { text: "Gaurav Sen YT", url: "https://www.youtube.com/c/GauravSensei" }] },
          { label: "GFG OA Questions", description: "Online assessment questions from campus placements", tags: ["OA", "Campus"], links: [{ text: "GFG OA Portal", url: "https://www.geeksforgeeks.org/online-assessment-questions/" }] },
        ],
      },
      { id: "smart-resume", title: "Smart Resume", icon: <Sparkles className="h-4 w-4" />, smartResume: true },
    ],
  },
  4: {
    label: "4th Year", emoji: "🏆", tagline: "Get Placed", color: "from-emerald-600 to-teal-600",
    sections: [
      {
        id: "ai", title: "AI-Powered Prep", icon: <Zap className="h-4 w-4" />,
        items: [
          { label: "AI Resume Scorer", description: "ATS score, keyword suggestions, instant feedback", tags: ["ATS", "Resume"], links: [{ text: "Resume Worded", url: "https://resumeworded.com/score" }] },
          { label: "AI Interview Prep", description: "Practice with AI mock interviews, get instant feedback", tags: ["Mock", "AI"], links: [{ text: "Interviewing.io", url: "https://interviewing.io/" }] },
          { label: "Skill Gap Finder", description: "Find missing skills for your target role", tags: ["Skill Gap", "Upskill"], links: [{ text: "Coursera Career Paths", url: "https://www.coursera.org/career-academy" }] },
        ],
      },
      { id: "smart-resume", title: "Smart Resume", icon: <Sparkles className="h-4 w-4" />, smartResume: true },
    ],
  },
}
// -- Helpers -------------------------------------------------------------------

function detectYear(graduationYear: number): number {
  const now = new Date()
  const currentYear = now.getFullYear()
  const month = now.getMonth() // 0-indexed; 4 = May
  const academicYear = month >= 4 ? currentYear : currentYear - 1
  const yearsLeft = graduationYear - academicYear
  const year = 5 - yearsLeft
  return Math.min(Math.max(year, 1), 4)
}

// -- Skills view ---------------------------------------------------------------

function SkillsView({ skills }: { skills: SkillCard[] }) {
  const categoryColor: Record<string, string> = {
    "Language":    "bg-violet-500/10 text-violet-600 border-violet-500/20",
    "Frontend":    "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Full Stack":  "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    "Backend":     "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    "AI/ML":       "bg-orange-500/10 text-orange-600 border-orange-500/20",
    "Cloud":       "bg-sky-500/10 text-sky-600 border-sky-500/20",
    "DevOps":      "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Database":    "bg-teal-500/10 text-teal-600 border-teal-500/20",
    "Mobile":      "bg-pink-500/10 text-pink-600 border-pink-500/20",
    "Core CS":     "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "API":         "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "Architecture":"bg-rose-500/10 text-rose-600 border-rose-500/20",
  }
  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="h-4 w-4 text-primary" />
        Most demanded skills in 2025 · click any card to start learning
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map(skill => (
          <a key={skill.name} href={skill.learnUrl} target="_blank" rel="noopener noreferrer"
            className="rounded-xl bg-card border border-border p-4 flex flex-col gap-2.5 hover:border-primary/50 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {skill.hot && <span className="text-base shrink-0">🔥</span>}
                <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{skill.name}</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className={`self-start text-[10px] px-2 py-0.5 rounded-full border font-medium ${categoryColor[skill.category] ?? "bg-secondary text-muted-foreground border-border"}`}>
              {skill.category}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">{skill.description}</p>
            <div className="flex flex-wrap gap-1 mt-auto pt-1 border-t border-border">
              {skill.tags.map(t => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{t}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

// -- Internship card -----------------------------------------------------------

function InternCard({ intern }: { intern: Internship }) {
  return (
    <div className="rounded-xl bg-card border border-border flex flex-col hover:border-primary/40 hover:shadow-md transition-all">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
          {intern.logo}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm truncate">{intern.company}</p>
          <p className="text-xs text-muted-foreground truncate">{intern.role}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium">Live</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${tierColor[intern.tier]}`}>{tierLabel[intern.tier]}</span>
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-3 p-4">
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{intern.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {intern.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">{tag}</Badge>)}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs border-t border-border pt-2">
          <span className="font-medium text-foreground">{intern.stipend}</span>
          <span className="flex items-center gap-1 text-muted-foreground ml-auto">
            <Calendar className="h-3 w-3" />{intern.deadline}
          </span>
        </div>
        <a href={intern.applyUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary text-primary-foreground py-2 text-sm font-semibold hover:opacity-90 transition-opacity">
          Apply Now <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}

// -- Live job card -------------------------------------------------------------

function LiveJobCard({ job, type }: { job: LiveJob; type: "on" | "off" }) {
  return (
    <div className="rounded-xl bg-card border border-border flex flex-col hover:border-primary/40 hover:shadow-md transition-all">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
          {job.companyName?.slice(0,2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm truncate">{job.title}</p>
          <p className="text-xs text-muted-foreground truncate">{job.companyName}</p>
        </div>
        <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border font-medium ${
          type === "on" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"
        }`}>{type === "on" ? "On-Campus" : "Off-Campus"}</span>
      </div>
      <div className="flex flex-col flex-1 gap-3 p-4">
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">{job.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {(job.skills || []).slice(0,4).map((t: string) => (
            <Badge key={t} variant="secondary" className="text-xs px-2 py-0.5">{t}</Badge>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs border-t border-border pt-2">
          {job.salary && <span className="font-medium text-foreground">{job.salary}</span>}
          {job.location && <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" />{job.location}</span>}
          {job.deadline && <span className="flex items-center gap-1 text-muted-foreground ml-auto"><Calendar className="h-3 w-3" />{new Date(job.deadline).toLocaleDateString()}</span>}
        </div>
        <a href="/student/jobs" className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary text-primary-foreground py-2 text-sm font-semibold hover:opacity-90 transition-opacity">
          Apply on CodeHiring
        </a>
      </div>
    </div>
  )
}

function LiveJobsGrid({ jobs, loading, type, search }: { jobs: LiveJob[]; loading: boolean; type: "on" | "off"; search: string }) {
  const today = new Date()
  const liveJobs = jobs.filter(job => {
    if (!job.deadline) return true
    return new Date(job.deadline) >= today
  })

  if (loading) return (
    <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
      <Loader2 className="h-4 w-4 animate-spin" /> Loading jobs...
    </div>
  )
  if (liveJobs.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground text-sm gap-2">
      <Briefcase className="h-8 w-8 opacity-30" />
      <p>{search ? `No results for "${search}"` : type === "on" ? "No active campus jobs right now" : "No live jobs right now"}</p>
      <p className="text-xs opacity-70">{type === "on" ? "Your college has not posted any active jobs" : "Check back soon for new postings"}</p>
    </div>
  )
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {liveJobs.map(job => <LiveJobCard key={job._id} job={job} type={type} />)}
    </div>
  )
}

// -- Main component ------------------------------------------------------------

interface CareerHubProps {
  graduationYear?: number
  student?: any
}

export function CareerHub({ graduationYear, student }: CareerHubProps) {
  const [hubTab, setHubTab] = useState<"drives" | "roadmap">("drives")
  const [year, setYear] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState(0)
  const [jobTab, setJobTab] = useState<"on" | "off">("on")
  const [onCampusJobs, setOnCampusJobs] = useState<LiveJob[]>([])
  const [offCampusJobs, setOffCampusJobs] = useState<LiveJob[]>([])
  const [jobsLoading, setJobsLoading] = useState(false)

  useEffect(() => {
    const fetchYear = async () => {
      if (graduationYear) { setYear(detectYear(graduationYear)); return }
      try {
        const res = await fetch("/api/auth/user", { credentials: "include", cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          const gy = data.user?.graduationYear
          if (gy) { setYear(detectYear(Number(gy))); return }
        }
      } catch { /* ignore */ }
      setYear(1)
    }
    fetchYear()
  }, [graduationYear])

  useEffect(() => {
    const s = year ? yearContent[year]?.sections[activeSection] : null
    if (!s?.liveJobs) return
    setJobsLoading(true)
    fetch("/api/student/campus-jobs", { credentials: "include" })
      .then(r => r.json())
      .then(data => { setOnCampusJobs(data.onCampus ?? []); setOffCampusJobs(data.offCampus ?? []) })
      .catch(() => {})
      .finally(() => setJobsLoading(false))
  }, [year, activeSection])

  if (!year) return (
    <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
      Detecting your year...
    </div>
  )

  const content = yearContent[year]
  const section = content.sections[activeSection]
  const isInternSection = !!section.internships
  const isSkillsSection = !!section.skills
  const isLiveJobsSection = !!section.liveJobs
  const isSmartResumeSection = !!section.smartResume

  return (
    <div className="space-y-4">
      {/* Top-level tab: Drives | Roadmap */}
      <div className="flex gap-1 border-b border-border pb-px">
        {[
          { id: "drives",  label: "Hiring Drives" },
          { id: "roadmap", label: "Career Roadmap" },
        ].map(t => (
          <button key={t.id} onClick={() => setHubTab(t.id as any)}
            className={`px-5 py-2 text-sm font-semibold border-b-2 -mb-px transition-all ${
              hubTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* DRIVES TAB · on-campus + off-campus */}
      {hubTab === "drives" && (
        <StudentDrivesInline student={student} />
      )}

      {/* ROADMAP TAB · existing career hub content */}
      {hubTab === "roadmap" && (
      <div className="space-y-4">
      {/* Banner */}
      <div className={`rounded-xl bg-gradient-to-r ${content.color} p-5 text-white`}>
        {/* Title */}
        <div className="flex items-center gap-4">
          <span className="text-4xl">{content.emoji}</span>
          <div>
            <p className="font-bold text-2xl">{content.label} — {content.tagline}</p>
            <p className="text-white/70 text-sm mt-0.5">
              {graduationYear
                ? `Graduating ${graduationYear} · Year ${year} detected automatically`
                : "Set your graduation year in profile for personalised content"}
            </p>
          </div>
        </div>

        {/* Section nav tabs */}
        <div className="flex items-center gap-1 mt-4 border-t border-white/10 pt-3">
          {content.sections.map((s, i) => (
            <button key={s.id} onClick={() => setActiveSection(i)}
              className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap ${activeSection === i ? "text-white" : "text-white/50 hover:text-white/80"}`}>
              {s.icon}
              {s.title}
              {activeSection === i && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isSmartResumeSection ? (
        <SmartResume />
      ) : isSkillsSection ? (
        <SkillsView skills={section.skills ?? []} />
      ) : isLiveJobsSection ? (
        <div className="space-y-4">
          {/* On / Off Campus buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setJobTab("on")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                jobTab === "on"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-background text-muted-foreground border-border hover:border-blue-400 hover:text-foreground"
              }`}
            >
              <Building2 className="h-4 w-4" />
              On Campus
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${jobTab === "on" ? "bg-white/20" : "bg-secondary"}`}>
                {onCampusJobs.length}
              </span>
            </button>
            <button
              onClick={() => setJobTab("off")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                jobTab === "off"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-background text-muted-foreground border-border hover:border-emerald-400 hover:text-foreground"
              }`}
            >
              <Globe className="h-4 w-4" />
              Off Campus
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${jobTab === "off" ? "bg-white/20" : "bg-secondary"}`}>
                {offCampusJobs.length}
              </span>
            </button>
            <p className="text-xs text-muted-foreground ml-1">
              {jobTab === "on" ? "Posted by your college" : "Posted by recruiters"}
            </p>
          </div>

          {jobTab === "on" ? (
            <LiveJobsGrid jobs={onCampusJobs} loading={jobsLoading} type="on" search="" />
          ) : (
            <div className="space-y-2">
              {jobsLoading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading jobs...
                </div>
              ) : offCampusJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground text-sm gap-2">
                  <Briefcase className="h-8 w-8 opacity-30" />
                  <p>No off-campus jobs posted yet</p>
                  <p className="text-xs opacity-70">Recruiters haven't posted any jobs on this platform yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Posted by Recruiters on this Platform</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {offCampusJobs.filter(j => !j.deadline || new Date(j.deadline) >= new Date()).map(job => <LiveJobCard key={job._id} job={job} type="off" />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : isInternSection ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(section.internships ?? []).map(intern => <InternCard key={intern.company} intern={intern} />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(section.items ?? []).map(item => {
            const isOnCampusItem  = item.label.includes("On-Campus") || item.label.startsWith("🏫")
            const isOffCampusItem = item.label.includes("Off-Campus") || item.label.startsWith("🌐")
            const cleanLabel = item.label
              .replace(/^[🏫🌐]\s*/, "")
              .replace(/^On-Campus\s*[—–-]\s*/i, "")
              .replace(/^Off-Campus\s*[—–-]\s*/i, "")
            return (
              <div key={item.label} className={`rounded-xl bg-card border flex flex-col gap-2.5 p-4 ${
                isOnCampusItem ? "border-l-4 border-l-emerald-500 border-border" :
                isOffCampusItem ? "border-l-4 border-l-blue-500 border-border" :
                "border-border"}`}>
                <div className="flex items-start gap-2">
                  {isOnCampusItem && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">ON-CAMPUS</span>}
                  {isOffCampusItem && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">OFF-CAMPUS</span>}
                  <p className="text-base font-semibold">{cleanLabel}</p>
                </div>
                {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                {item.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">{tag}</Badge>)}
                  </div>
                )}
                {item.links && (
                  <div className="flex flex-wrap gap-3 pt-1 mt-auto">
                    {item.links.map(link => (
                      <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                        <ExternalLink className="h-3.5 w-3.5" />{link.text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
    )} {/* end roadmap tab */}
    </div>
  )
}

// -- Inline drives for Career Hub ----------------------------------------------
function StudentDrivesInline({ student }: { student?: any }) {
  const [drives, setDrives]          = useState<any[]>([])
  const [myDrives, setMyDrives]      = useState<any[]>([])
  const [onCampusJobs, setOnCampus]  = useState<any[]>([])
  const [offCampusJobs, setOffCampus]= useState<any[]>([])
  const [loading, setLoading]        = useState(true)
  const [applying, setApplying]      = useState<string | null>(null)
  const [applied, setApplied]        = useState<Set<string>>(new Set())
  const [driveTab, setDriveTab]      = useState<"campus" | "offcampus" | "livejobs" | "mine">("campus")

  useEffect(() => {
    Promise.all([
      fetch("/api/drives").then(r => r.ok ? r.json() : { drives: [] }),
      fetch("/api/student/my-drives").then(r => r.ok ? r.json() : { drives: [] }),
      fetch("/api/student/campus-jobs").then(r => r.ok ? r.json() : { onCampus: [], offCampus: [] }),
    ]).then(([avail, mine, jobs]) => {
      setDrives(avail.drives || [])
      const myList = mine.drives || []
      setMyDrives(myList)
      setApplied(new Set(myList.map((d: any) => d._id)))
      setOnCampus(jobs.onCampus || [])
      setOffCampus(jobs.offCampus || [])
    }).finally(() => setLoading(false))
  }, [])

  function isOnCampus(drive: any) {
    if (!student?.collegeCode) return false
    return drive.postedByRole === "college" ||
      drive.collegeCode === student.collegeCode ||
      drive.eligibility?.collegeCodes?.includes(student.collegeCode)
  }

  async function applyToDrive(driveId: string) {
    setApplying(driveId)
    try {
      const res = await fetch(`/api/drives/${driveId}/apply`, { method: "POST" })
      const data = await res.json()
      if (res.ok) { toast("Application submitted!"); setApplied(prev => new Set([...prev, driveId])) }
      else if (data.alreadyApplied) setApplied(prev => new Set([...prev, driveId]))
      else toast(data.error || "Failed")
    } catch {}
    setApplying(null)
  }

  const campusDrives = drives.filter(d => isOnCampus(d))
  const offDrives    = drives.filter(d => !isOnCampus(d))
  const filtered     = driveTab === "campus" ? campusDrives : driveTab === "offcampus" ? offDrives : []

  return (
    <div className="space-y-4">
      <div className="flex gap-1 border-b border-border pb-px">
        {[
          { id: "campus",    label: `On-Campus (${campusDrives.length})` },
          { id: "offcampus", label: `Off-Campus (${offDrives.length})` },
          { id: "livejobs",  label: "Live Jobs" },
          { id: "mine",      label: `My Applications (${myDrives.length})` },
        ].map(t => (
          <button key={t.id} onClick={() => setDriveTab(t.id as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-all ${
              driveTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/></div>}

      {/* Live Jobs tab */}
      {!loading && driveTab === "livejobs" && (
        <div className="space-y-5">
          {/* On-Campus Live Jobs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">ON-CAMPUS</span>
              <span className="text-xs text-muted-foreground">Posted by your college / campus recruiters</span>
            </div>
            {onCampusJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No on-campus jobs posted yet</p>
            ) : (
              <div className="space-y-2">
                {onCampusJobs.map((job: any) => (
                  <div key={job._id} className="rounded-xl border border-emerald-500/15 bg-card p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-sm font-black text-emerald-600 dark:text-emerald-400 shrink-0">
                      {job.companyName?.slice(0,2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm">{job.title}</p>
                      <p className="text-xs text-primary">{job.companyName} Â· {job.type} Â· {job.location}</p>
                      {job.salary && <p className="text-xs text-muted-foreground mt-0.5">{job.salary}</p>}
                    </div>
                    <a href="/student/jobs">Apply â†’</a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Off-Campus Live Jobs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">OFF-CAMPUS</span>
              <span className="text-xs text-muted-foreground">Open to all â€” posted by recruiters</span>
            </div>
            {offCampusJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No off-campus jobs posted yet</p>
            ) : (
              <div className="space-y-2">
                {offCampusJobs.map((job: any) => (
                  <div key={job._id} className="rounded-xl border border-blue-500/15 bg-card p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-sm font-black text-blue-600 dark:text-blue-400 shrink-0">
                      {job.companyName?.slice(0,2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm">{job.title}</p>
                      <p className="text-xs text-primary">{job.companyName} Â· {job.type} Â· {job.location}</p>
                      {job.salary && <p className="text-xs text-muted-foreground mt-0.5">{job.salary}</p>}
                    </div>
                    <a href="/student/jobs">Apply â†’</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Applications */}
      {!loading && driveTab === "mine" && (
        myDrives.length === 0
          ? <div className="text-center py-16 rounded-2xl border border-dashed border-border"><p className="text-sm text-muted-foreground">No applications yet</p></div>
          : <div className="space-y-3">
              {myDrives.map((d: any) => (
                <div key={d._id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary shrink-0">
                    {d.companyName?.slice(0,2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-sm">{d.title}</p>
                    <p className="text-xs text-primary">{d.companyName} · {d.type}</p>
                    {d.assessmentScore != null && <p className="text-xs mt-1 text-violet-500 font-bold">Score: {d.assessmentScore}%{d.assessmentRank ? ` · Rank #${d.assessmentRank}` : ""}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      d.myStatus === "shortlisted" ? "bg-emerald-500/10 text-emerald-500" :
                      d.myStatus === "rejected"    ? "bg-red-500/10 text-red-500" :
                      d.myStatus === "offer_sent"  ? "bg-amber-500/10 text-amber-500" :
                      "bg-blue-500/10 text-blue-500"}`}>
                      {d.myStatus === "applied" ? "Applied" : d.myStatus === "shortlisted" ? "Shortlisted ?" : d.myStatus === "rejected" ? "Not Selected" : d.myStatus === "offer_sent" ? "Offer Sent →" : d.myStatus}
                    </span>
                    {d.status === "assessment" && d.assessmentId && d.myStatus === "applied" && (
                      <a href={`/student/assessment/${d._id}`} className="text-[10px] text-violet-500 hover:underline font-bold">Take Assessment ?</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
      )}

      {/* On-Campus / Off-Campus */}
      {!loading && (driveTab === "campus" || driveTab === "offcampus") && (
        filtered.length === 0
          ? <div className="text-center py-16 rounded-2xl border border-dashed border-border">
              <Building2 className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3"/>
              <p className="text-sm text-muted-foreground">
                {driveTab === "campus" ? "No on-campus drives from your college yet" : "No off-campus drives available"}
              </p>
            </div>
          : <div className="space-y-3">
              {filtered.map((drive: any, i: number) => {
                const isApplied = applied.has(drive._id)
                const deadline  = drive.applicationDeadline ? new Date(drive.applicationDeadline) : null
                const past      = deadline && deadline < new Date()
                const campus    = isOnCampus(drive)
                return (
                  <div key={drive._id} className={`rounded-xl border bg-card p-4 hover:border-primary/20 transition-all ${campus ? "border-emerald-500/15" : "border-border"}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary shrink-0">
                        {drive.companyName?.slice(0,2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-foreground text-sm">{drive.title}</p>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${campus ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-blue-500/10 text-blue-500"}`}>
                                {campus ? "ON-CAMPUS" : "OFF-CAMPUS"}
                              </span>
                            </div>
                            <p className="text-xs text-primary">{drive.companyName}</p>
                          </div>
                          {isApplied
                            ? <span className="text-[10px] font-bold text-emerald-500 shrink-0">? Applied</span>
                            : !past && drive.status === "active"
                            ? <button onClick={() => applyToDrive(drive._id)} disabled={applying === drive._id}
                                className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1">
                                {applying === drive._id ? <Loader2 className="h-3 w-3 animate-spin"/> : null}
                                Apply
                              </button>
                            : null}
                        </div>
                        <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground mt-1.5">
                          <span>{drive.type} · {drive.location}</span>
                          {drive.salary && <span>{drive.salary}</span>}
                          {deadline && <span className={past ? "text-red-500" : ""}>{past ? "Closed" : `Due ${deadline.toLocaleDateString()}`}</span>}
                        </div>
                        {drive.status === "assessment" && isApplied && (
                          <a href={`/student/assessment/${drive._id}`}
                            className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-violet-500 hover:underline">
                            <FileText className="h-3 w-3"/>Take Assessment ?
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
      )}
    </div>
  )
}

