"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen, Code2, Briefcase, Trophy, Rocket,
  ExternalLink, Target, Brain, Zap, Search, Calendar,
  TrendingUp,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

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

interface Section {
  id: string
  title: string
  icon: React.ReactNode
  items?: ContentItem[]
  internships?: Internship[]
  skills?: SkillCard[]
}

interface SkillCard {
  name: string
  description: string
  category: string
  hot?: boolean
  learnUrl: string
  tags: string[]
}

// ── Trending skills ───────────────────────────────────────────────────────────

const trendingSkills: SkillCard[] = [
  // 🔥 Hottest
  { name: "Python", hot: true, category: "Language", description: "The #1 language for AI, data science, backend, and automation. Easiest to learn, hardest to master.", tags: ["AI/ML", "Backend", "Scripting"], learnUrl: "https://docs.python.org/3/tutorial/" },
  { name: "TypeScript", hot: true, category: "Language", description: "JavaScript with types. Used in every modern frontend and backend codebase. Recruiters love it.", tags: ["Frontend", "Backend", "In-demand"], learnUrl: "https://www.typescriptlang.org/docs/handbook/intro.html" },
  { name: "React", hot: true, category: "Frontend", description: "The most widely-used UI library. Powers Facebook, Instagram, Airbnb, and thousands of startups.", tags: ["Frontend", "UI", "Popular"], learnUrl: "https://react.dev/learn" },
  { name: "LLM / GenAI", hot: true, category: "AI/ML", description: "Build with GPT, Gemini, Claude. The most demanded skill in 2025 across product and research roles.", tags: ["AI", "GenAI", "Trending"], learnUrl: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/" },
  { name: "Next.js", hot: true, category: "Full Stack", description: "React-based full stack framework. Used by Vercel, TikTok, Notion. Best for modern web apps.", tags: ["Full Stack", "React", "SSR"], learnUrl: "https://nextjs.org/learn" },
  { name: "AWS", hot: true, category: "Cloud", description: "World's #1 cloud. EC2, S3, Lambda — knowing AWS is a must for any backend or DevOps role.", tags: ["Cloud", "DevOps", "MNC"], learnUrl: "https://aws.amazon.com/training/learn-about/cloud-essentials/" },
  { name: "Docker", hot: true, category: "DevOps", description: "Containerisation platform used by every company. Makes your apps run the same everywhere.", tags: ["DevOps", "Containers", "CI/CD"], learnUrl: "https://docs.docker.com/get-started/" },
  { name: "LangChain", hot: true, category: "AI/ML", description: "Framework for building LLM-powered apps — chatbots, RAG pipelines, AI agents. Exploding demand.", tags: ["AI", "LLM", "Agents"], learnUrl: "https://python.langchain.com/docs/get_started/introduction" },
  { name: "HuggingFace", hot: true, category: "AI/ML", description: "Open-source hub for pretrained ML models. Standard tool for NLP, CV, and speech research roles.", tags: ["AI", "NLP", "Models"], learnUrl: "https://huggingface.co/learn/nlp-course/chapter1/1" },
  { name: "Go (Golang)", hot: true, category: "Language", description: "Fast, simple, concurrent. Used at Google, Uber, Dropbox. Great for microservices and backend.", tags: ["Backend", "Microservices", "Google"], learnUrl: "https://go.dev/tour/welcome/1" },
  { name: "PostgreSQL", hot: true, category: "Database", description: "Most advanced open-source relational DB. Standard choice for startups and product companies.", tags: ["Database", "SQL", "Backend"], learnUrl: "https://www.postgresql.org/docs/current/tutorial.html" },
  { name: "Redis", hot: true, category: "Database", description: "In-memory data store for caching, sessions, queues. Found in virtually every scalable system.", tags: ["Database", "Caching", "Real-time"], learnUrl: "https://redis.io/docs/get-started/" },
  { name: "CI/CD", hot: true, category: "DevOps", description: "Automate build, test, deploy pipelines with GitHub Actions. Expected skill in every SDE role.", tags: ["DevOps", "Automation", "GitHub"], learnUrl: "https://docs.github.com/en/actions/learn-github-actions" },
  { name: "PyTorch", hot: true, category: "AI/ML", description: "Facebook's deep learning framework. Industry standard for research and production ML models.", tags: ["AI", "Deep Learning", "Research"], learnUrl: "https://pytorch.org/tutorials/beginner/basics/intro.html" },
  // Trending
  { name: "Data Structures", hot: false, category: "Core CS", description: "Foundation of every coding interview. Arrays, trees, graphs, heaps — master these to crack any OA.", tags: ["DSA", "Interviews", "Must Do"], learnUrl: "https://www.geeksforgeeks.org/data-structures/" },
  { name: "Algorithms", hot: false, category: "Core CS", description: "Sorting, searching, DP, greedy — the building blocks that interviewers test in every round.", tags: ["DSA", "LeetCode", "Must Do"], learnUrl: "https://neetcode.io/roadmap" },
  { name: "System Design", hot: false, category: "Core CS", description: "Design scalable systems like YouTube, WhatsApp. Critical for SDE-2+ and senior roles.", tags: ["Architecture", "HLD", "Senior"], learnUrl: "https://github.com/donnemartin/system-design-primer" },
  { name: "Node.js", hot: false, category: "Backend", description: "JavaScript on the server. Powers Netflix, LinkedIn, PayPal. Paired with Express for REST APIs.", tags: ["Backend", "JavaScript", "APIs"], learnUrl: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs" },
  { name: "Kubernetes", hot: false, category: "DevOps", description: "Container orchestration platform. Manages Docker containers at scale. Big tech standard.", tags: ["DevOps", "Containers", "Scale"], learnUrl: "https://kubernetes.io/docs/tutorials/kubernetes-basics/" },
  { name: "Flutter", hot: false, category: "Mobile", description: "Google's cross-platform UI toolkit. Build iOS and Android apps from a single codebase.", tags: ["Mobile", "Dart", "Cross-platform"], learnUrl: "https://docs.flutter.dev/get-started/codelab" },
  { name: "GraphQL", hot: false, category: "API", description: "Query language for APIs. More flexible than REST. Used by Facebook, GitHub, Shopify.", tags: ["API", "Frontend", "Backend"], learnUrl: "https://graphql.org/learn/" },
  { name: "Supabase", hot: false, category: "Database", description: "Open-source Firebase alternative. Postgres + auth + storage + realtime. Great for side projects.", tags: ["Database", "BaaS", "Startup"], learnUrl: "https://supabase.com/docs" },
  { name: "TensorFlow", hot: false, category: "AI/ML", description: "Google's ML framework. Widely used for production deployment of deep learning models.", tags: ["AI", "ML", "Google"], learnUrl: "https://www.tensorflow.org/tutorials" },
  { name: "Scikit-learn", hot: false, category: "AI/ML", description: "Python's go-to library for classical ML — regression, classification, clustering. Easy to start.", tags: ["AI", "ML", "Python"], learnUrl: "https://scikit-learn.org/stable/getting_started.html" },
  { name: "MongoDB", hot: false, category: "Database", description: "Leading NoSQL document database. Flexible schema, great for rapid prototyping and MERN apps.", tags: ["Database", "NoSQL", "MERN"], learnUrl: "https://learn.mongodb.com/learning-paths/introduction-to-mongodb" },
  { name: "React Native", hot: false, category: "Mobile", description: "Build native iOS and Android apps with React. Reuse web knowledge for mobile development.", tags: ["Mobile", "React", "Cross-platform"], learnUrl: "https://reactnative.dev/docs/getting-started" },
  { name: "Rust", hot: false, category: "Language", description: "Memory-safe systems language. Fastest-growing language in Stack Overflow surveys. Used at Mozilla, Discord.", tags: ["Systems", "Performance", "Safe"], learnUrl: "https://doc.rust-lang.org/book/" },
  { name: "OOP Concepts", hot: false, category: "Core CS", description: "Classes, inheritance, polymorphism, encapsulation. Core of every Java/Python/C++ interview.", tags: ["Core CS", "Interviews", "Fundamentals"], learnUrl: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/" },
  { name: "OS Concepts", hot: false, category: "Core CS", description: "Processes, threads, memory management, scheduling. Asked in every campus placement technical round.", tags: ["Core CS", "Placement", "Theory"], learnUrl: "https://www.geeksforgeeks.org/operating-systems/" },
  { name: "DBMS", hot: false, category: "Core CS", description: "ER models, normalization, SQL, transactions, indexing. Essential for backend and data engineering.", tags: ["Core CS", "SQL", "Placement"], learnUrl: "https://www.geeksforgeeks.org/dbms/" },
  { name: "Computer Networks", hot: false, category: "Core CS", description: "TCP/IP, HTTP, DNS, OSI model. Appears in every MNC placement test and cloud interviews.", tags: ["Core CS", "Networking", "Cloud"], learnUrl: "https://www.geeksforgeeks.org/computer-network-tutorials/" },
  { name: "Microservices", hot: false, category: "Architecture", description: "Build apps as small independent services. Dominant architecture at Amazon, Netflix, Uber.", tags: ["Backend", "Architecture", "Scale"], learnUrl: "https://microservices.io/patterns/microservices.html" },
]

// ── Internships: Startup → Unicorn → MNC ─────────────────────────────────────

const internships: Internship[] = [
  // Startups / Small
  {
    company: "Cutshort",
    logo: "CS",
    role: "Tech Intern — Vetted Startups",
    description: "AI-matched live internships at vetted Indian product companies and startups. No spam, quality roles only.",
    stipend: "Rs 10K-50K/month",
    deadline: "Ongoing",
    tags: ["Startup", "AI-matched", "India"],
    applyUrl: "https://cutshort.io/jobs?type=internship",
    tier: "startup",
  },
  {
    company: "Internshala",
    logo: "IN",
    role: "CS / Web Dev / ML / Android",
    description: "India's #1 internship platform. 1000+ live tech listings daily. Filter by role, stipend, remote and duration.",
    stipend: "Rs 5K-30K/month",
    deadline: "Ongoing",
    tags: ["All Roles", "Remote", "Fresher"],
    applyUrl: "https://internshala.com/internships/computer-science-internship/",
    tier: "startup",
  },
  {
    company: "Wellfound",
    logo: "WF",
    role: "Startup Intern — All Roles",
    description: "AngelList's job board — thousands of live startup internships in SWE, design, data, and product.",
    stipend: "Varies",
    deadline: "Ongoing",
    tags: ["Startup", "Global", "All Roles"],
    applyUrl: "https://wellfound.com/jobs?jobType=internship",
    tier: "startup",
  },
  // Unicorns
  {
    company: "Razorpay",
    logo: "RP",
    role: "SWE / ML / DevOps Intern",
    description: "India's top fintech unicorn. Work on payment infrastructure, ML fraud detection, and platform engineering.",
    stipend: "Rs 60K-1L/month",
    deadline: "Ongoing",
    tags: ["Fintech", "Unicorn", "PPO"],
    applyUrl: "https://razorpay.com/jobs/?team=engineering&type=intern",
    tier: "unicorn",
  },
  {
    company: "Swiggy",
    logo: "SW",
    role: "SDE / Data Science Intern",
    description: "Real-time logistics, ML demand forecasting, and consumer engineering at India's top delivery unicorn.",
    stipend: "Rs 50K-80K/month",
    deadline: "Ongoing",
    tags: ["SDE", "ML", "Unicorn"],
    applyUrl: "https://careers.swiggy.com/#/",
    tier: "unicorn",
  },
  {
    company: "Zomato",
    logo: "ZO",
    role: "Tech / Data Science Intern",
    description: "Build the future of food delivery. Live roles in backend, data science, and mobile at India's food-tech unicorn.",
    stipend: "Rs 50K-90K/month",
    deadline: "Ongoing",
    tags: ["Backend", "Mobile", "Unicorn"],
    applyUrl: "https://www.zomato.com/careers",
    tier: "unicorn",
  },
  {
    company: "CRED",
    logo: "CR",
    role: "SWE / Product Intern",
    description: "India's premium fintech for creditworthy users. Work on high-quality product and platform engineering.",
    stipend: "Rs 60K-1L/month",
    deadline: "Ongoing",
    tags: ["Fintech", "Product", "Unicorn"],
    applyUrl: "https://careers.cred.club/",
    tier: "unicorn",
  },
  {
    company: "Meesho",
    logo: "ME",
    role: "SDE / Data Intern",
    description: "India's social commerce unicorn. Work on supply chain, ML-powered recommendations, and seller tools.",
    stipend: "Rs 50K-80K/month",
    deadline: "Ongoing",
    tags: ["E-commerce", "ML", "Unicorn"],
    applyUrl: "https://meesho.io/careers",
    tier: "unicorn",
  },
  // MNCs
  {
    company: "Google",
    logo: "GO",
    role: "STEP / SWE Intern",
    description: "Google's engineering intern program. Work on products used by billions, with mentorship and strong PPO history.",
    stipend: "Rs 1.2L-2L/month",
    deadline: "Applications open Nov-Dec",
    tags: ["SWE", "MNC", "PPO"],
    applyUrl: "https://careers.google.com/jobs/results/?category=INTERNSHIP&employment_type=INTERN",
    tier: "mnc",
  },
  {
    company: "Microsoft",
    logo: "MS",
    role: "Software Engineer Intern",
    description: "Summer internship across SWE, data science, and PM. Strong PPO culture across India and global offices.",
    stipend: "Rs 1L-1.8L/month",
    deadline: "Applications open Oct-Jan",
    tags: ["SWE", "MNC", "PPO"],
    applyUrl: "https://careers.microsoft.com/students/us/en/job/internship",
    tier: "mnc",
  },
  {
    company: "Amazon",
    logo: "AZ",
    role: "SDE Intern",
    description: "Build features used by millions on Amazon's platform. Excellent PPO conversion and competitive stipend.",
    stipend: "Rs 90K-1.5L/month",
    deadline: "Applications open Aug-Oct",
    tags: ["SDE", "MNC", "PPO"],
    applyUrl: "https://www.amazon.jobs/en/job_categories/software-development?job_type%5B%5D=Internship",
    tier: "mnc",
  },
  {
    company: "Adobe",
    logo: "AD",
    role: "Software Development Intern",
    description: "Adobe India intern program — Creative Cloud, Document Cloud, and Experience Cloud product teams.",
    stipend: "Rs 80K-1.3L/month",
    deadline: "Applications open Nov-Feb",
    tags: ["SWE", "MNC", "Product"],
    applyUrl: "https://careers.adobe.com/us/en/search-results?keywords=intern",
    tier: "mnc",
  },
  {
    company: "Samsung R&D",
    logo: "SR",
    role: "Software Intern",
    description: "Samsung India R&D — Bangalore and Noida centers. Projects in mobile OS, AI/ML, IoT, and 5G.",
    stipend: "Rs 40K-70K/month",
    deadline: "Applications open Jan-Mar",
    tags: ["Mobile", "AI", "MNC"],
    applyUrl: "https://samsung.com/in/aboutsamsung/careers/",
    tier: "mnc",
  },
  {
    company: "LinkedIn",
    logo: "LI",
    role: "SWE / Data / PM Intern",
    description: "Browse all live intern listings across every company. Sort by recency for the freshest openings.",
    stipend: "Varies",
    deadline: "Ongoing",
    tags: ["All Companies", "Global", "Filter"],
    applyUrl: "https://www.linkedin.com/jobs/search/?keywords=software+engineer+intern&f_JT=I&sortBy=DD",
    tier: "mnc",
  },
  {
    company: "GirlScript SoC",
    logo: "GS",
    role: "Open Source Contributor",
    description: "India's largest student open source program. Contribute to live projects, earn points, get certificates.",
    stipend: "Goodies + Certificate",
    deadline: "Ongoing",
    tags: ["Open Source", "India", "GSSoC"],
    applyUrl: "https://gssoc.girlscript.tech/",
    tier: "startup",
  },
]

const tierLabel: Record<Internship["tier"], string> = {
  startup: "Startup",
  unicorn: "Unicorn",
  mnc: "MNC",
}

const tierColor: Record<Internship["tier"], string> = {
  startup: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  unicorn: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  mnc: "bg-amber-500/10 text-amber-600 border-amber-500/20",
}

// ── Year content ──────────────────────────────────────────────────────────────

const yearContent: Record<number, { label: string; emoji: string; tagline: string; color: string; sections: Section[] }> = {
  1: {
    label: "1st Year",
    emoji: "👨‍🎓",
    tagline: "Learn & Build Foundation",
    color: "from-blue-600 to-cyan-600",
    sections: [
      {
        id: "learning",
        title: "Learning Paths",
        icon: <BookOpen className="h-4 w-4" />,
        items: [
          {
            label: "Programming Basics — C",
            description: "Variables, loops, functions, pointers",
            tags: ["C", "Beginner"],
            links: [
              { text: "GFG C Course", url: "https://www.geeksforgeeks.org/c-programming-language/" },
              { text: "CS50x Harvard", url: "https://cs50.harvard.edu/x/2024/" },
            ],
          },
          {
            label: "Programming Basics — Python",
            description: "Syntax, OOP, data types, file handling",
            tags: ["Python", "Beginner"],
            links: [
              { text: "Python.org Tutorial", url: "https://docs.python.org/3/tutorial/" },
              { text: "freeCodeCamp Python", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/" },
            ],
          },
          {
            label: "DSA Beginner",
            description: "Arrays, Strings, Linked Lists, Stacks, Recursion",
            tags: ["Arrays", "DSA"],
            links: [
              { text: "GFG DSA Self-Paced", url: "https://www.geeksforgeeks.org/courses/dsa-self-paced" },
              { text: "CodeChef DSA Course", url: "https://www.codechef.com/learn/course/dsa" },
            ],
          },
          {
            label: "Web Dev Basics",
            description: "HTML, CSS, JavaScript — build your first webpage",
            tags: ["HTML", "CSS", "JS"],
            links: [
              { text: "freeCodeCamp Web", url: "https://www.freecodecamp.org/learn/responsive-web-design/" },
              { text: "The Odin Project", url: "https://www.theodinproject.com/paths/foundations/courses/foundations" },
            ],
          },
          {
            label: "AI/ML Basics",
            description: "Intro to ML, math foundations, Python for data",
            tags: ["Python", "NumPy", "Pandas"],
            links: [
              { text: "Kaggle Intro to ML", url: "https://www.kaggle.com/learn/intro-to-machine-learning" },
              { text: "Kaggle Python Course", url: "https://www.kaggle.com/learn/python" },
            ],
          },
        ],
      },
      {
        id: "practice",
        title: "Practice Problems",
        icon: <Code2 className="h-4 w-4" />,
        items: [
          {
            label: "LeetCode Easy",
            description: "Pre-filtered Easy problems to start solving today",
            tags: ["Easy", "Beginner"],
            links: [{ text: "Start Solving", url: "https://leetcode.com/problemset/?difficulty=EASY&page=1" }],
          },
          {
            label: "HackerRank Algorithms",
            description: "Beginner-friendly problems with guided hints",
            tags: ["HackerRank"],
            links: [{ text: "Easy Algorithms", url: "https://www.hackerrank.com/domains/algorithms?filters%5Bdifficulty%5D%5B%5D=easy" }],
          },
          {
            label: "GFG School Level",
            description: "School and basic level problems on GeeksforGeeks",
            tags: ["GFG", "School"],
            links: [{ text: "School Problems", url: "https://practice.geeksforgeeks.org/explore?difficulty%5B%5D=0&page=1" }],
          },
          {
            label: "LeetCode Daily",
            description: "One problem a day to build your streak",
            tags: ["Daily", "Streak"],
            links: [{ text: "Today's Problem", url: "https://leetcode.com/problemset/" }],
          },
        ],
      },
    ],
  },

  2: {
    label: "2nd Year",
    emoji: "👨‍💻",
    tagline: "Skill + Internship Mode",
    color: "from-violet-600 to-purple-600",
    sections: [
      {
        id: "skills",
        title: "Trending Skills",
        icon: <TrendingUp className="h-4 w-4" />,
        skills: trendingSkills,
      },
      {
        id: "internships",
        title: "Internships",
        icon: <Briefcase className="h-4 w-4" />,
        internships,
      },
    ],
  },

  3: {
    label: "3rd Year",
    emoji: "🎓",
    tagline: "Placement Preparation",
    color: "from-orange-600 to-amber-600",
    sections: [
      {
        id: "placement",
        title: "Placement Tools",
        icon: <Trophy className="h-4 w-4" />,
        items: [
          {
            label: "Company-wise Questions — GFG",
            description: "Interview questions sorted by company",
            tags: ["Amazon", "Google", "TCS"],
            links: [
              { text: "Amazon Prep", url: "https://www.geeksforgeeks.org/amazon-interview-preparation/" },
              { text: "Google Prep", url: "https://www.geeksforgeeks.org/google-interview-preparation/" },
              { text: "TCS NQT Prep", url: "https://www.geeksforgeeks.org/tcs-nqt-preparation/" },
            ],
          },
          {
            label: "LeetCode Company Tags",
            description: "Filter problems by the company that asked them",
            tags: ["LeetCode", "OA"],
            links: [
              { text: "Company Tags", url: "https://leetcode.com/company/" },
              { text: "LeetCode Mock", url: "https://leetcode.com/interview/" },
            ],
          },
          {
            label: "Mock Interviews",
            description: "Practice live mock interviews with peers or AI",
            tags: ["Mock", "Technical", "HR"],
            links: [
              { text: "Pramp Free Mock", url: "https://www.pramp.com/#/" },
              { text: "InterviewBit Mock", url: "https://www.interviewbit.com/mock-interview/" },
            ],
          },
          {
            label: "Aptitude Practice",
            description: "Quant, verbal, logical reasoning for placement tests",
            tags: ["Quant", "Verbal"],
            links: [
              { text: "IndiaBix Quant", url: "https://www.indiabix.com/aptitude/questions-and-answers/" },
              { text: "PrepInsta TCS", url: "https://prepinsta.com/tcs-nqt/" },
              { text: "PrepInsta Infosys", url: "https://prepinsta.com/infosys/" },
            ],
          },
          {
            label: "Resume Builder",
            description: "ATS-friendly, recruiter-approved templates",
            tags: ["Resume", "ATS"],
            links: [
              { text: "Resumake.io", url: "https://resumake.io/" },
              { text: "FlowCV", url: "https://flowcv.com/" },
              { text: "Overleaf LaTeX CV", url: "https://www.overleaf.com/gallery/tagged/cv" },
            ],
          },
        ],
      },
      {
        id: "dsa",
        title: "DSA & Interview",
        icon: <Brain className="h-4 w-4" />,
        items: [
          {
            label: "LeetCode Top 150",
            description: "The definitive 150 interview problems",
            tags: ["Top 150", "Must Do"],
            links: [{ text: "Study Plan", url: "https://leetcode.com/studyplan/top-interview-150/" }],
          },
          {
            label: "Neetcode 150",
            description: "150 curated problems with video solutions",
            tags: ["Neetcode", "Video"],
            links: [
              { text: "Neetcode Practice", url: "https://neetcode.io/practice" },
              { text: "Neetcode Roadmap", url: "https://neetcode.io/roadmap" },
            ],
          },
          {
            label: "System Design Basics",
            description: "Scalability, caching, load balancing for interviews",
            tags: ["System Design", "HLD"],
            links: [
              { text: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
              { text: "Gaurav Sen YT", url: "https://www.youtube.com/c/GauravSensei" },
            ],
          },
          {
            label: "GFG OA Questions",
            description: "Online assessment questions from campus placements",
            tags: ["OA", "Campus"],
            links: [{ text: "GFG OA Portal", url: "https://www.geeksforgeeks.org/online-assessment-questions/" }],
          },
        ],
      },
    ],
  },

  4: {
    label: "4th Year",
    emoji: "🏆",
    tagline: "Get Placed",
    color: "from-emerald-600 to-teal-600",
    sections: [
      {
        id: "jobs",
        title: "Job Openings",
        icon: <Rocket className="h-4 w-4" />,
        items: [
          {
            label: "SDE / Software Engineer",
            description: "Full-time SWE roles at product companies",
            tags: ["SDE", "Full-time"],
            links: [
              { text: "LinkedIn SDE Jobs", url: "https://www.linkedin.com/jobs/search/?keywords=software+engineer&f_JT=F&f_E=1%2C2" },
              { text: "Wellfound Startups", url: "https://wellfound.com/jobs?role=software-engineer" },
              { text: "Naukri Fresher IT", url: "https://www.naukri.com/fresher-software-engineer-jobs" },
            ],
          },
          {
            label: "Data Science / ML",
            description: "Data analyst, ML engineer, AI research openings",
            tags: ["Data", "ML"],
            links: [
              { text: "LinkedIn DS Jobs", url: "https://www.linkedin.com/jobs/search/?keywords=data+scientist+fresher&f_JT=F" },
              { text: "Kaggle Jobs", url: "https://www.kaggle.com/jobs" },
            ],
          },
          {
            label: "Campus Drives",
            description: "On-campus placement drives by top companies",
            tags: ["Campus", "On-site"],
            links: [
              { text: "CampusHire Drives", url: "https://www.campushire.in/drives" },
              { text: "Placement India", url: "https://www.placementindia.com/fresher-jobs.htm" },
            ],
          },
          {
            label: "Off-campus — Cutshort",
            description: "Vetted startup and product company roles",
            tags: ["Startup", "Product"],
            links: [
              { text: "Cutshort 0-1yr", url: "https://cutshort.io/jobs?type=fulltime&experience=0-1" },
              { text: "Instahyre Fresher", url: "https://www.instahyre.com/search-jobs/?experience=0" },
            ],
          },
          {
            label: "TCS / Infosys / Wipro",
            description: "Mass recruiters — fresher drives open year-round",
            tags: ["TCS", "Infosys", "Wipro"],
            links: [
              { text: "TCS NextStep", url: "https://nextstep.tcs.com/campus/" },
              { text: "Infosys InfyTQ", url: "https://www.infytq.com/" },
              { text: "Wipro NLTH", url: "https://nlth.wipro.com/" },
            ],
          },
        ],
      },
      {
        id: "ai",
        title: "AI-Powered Prep",
        icon: <Zap className="h-4 w-4" />,
        items: [
          {
            label: "AI Resume Scorer",
            description: "ATS score, keyword suggestions, instant feedback",
            tags: ["ATS", "Resume"],
            links: [
              { text: "Resume Worded", url: "https://resumeworded.com/score" },
              { text: "Jobscan Scanner", url: "https://www.jobscan.co/resume-scanner" },
            ],
          },
          {
            label: "AI Interview Prep",
            description: "Practice with AI mock interviews, get instant feedback",
            tags: ["Mock", "AI"],
            links: [
              { text: "Interviewing.io", url: "https://interviewing.io/" },
              { text: "Google Interview Warmup", url: "https://grow.google/certificates/interview-warmup/" },
            ],
          },
          {
            label: "Skill Gap Finder",
            description: "Find missing skills for your target role",
            tags: ["Skill Gap", "Upskill"],
            links: [
              { text: "Coursera Career Paths", url: "https://www.coursera.org/career-academy" },
              { text: "LinkedIn Skill Assess", url: "https://www.linkedin.com/skill-assessments/hub/quizzes/" },
            ],
          },
        ],
      },
    ],
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function detectYear(graduationYear: number): number {
  const now = new Date()
  const currentYear = now.getFullYear()
  const month = now.getMonth()
  const academicYear = month >= 6 ? currentYear : currentYear - 1
  const yearsLeft = graduationYear - academicYear
  const year = 5 - yearsLeft
  return Math.min(Math.max(year, 1), 4)
}

// ── Skills section ────────────────────────────────────────────────────────────

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
    <div className="col-span-full space-y-4">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="h-4 w-4 text-primary" />
        Most demanded skills by recruiters in 2025 — click any card to start learning
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map(skill => (
          <a
            key={skill.name}
            href={skill.learnUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-card border border-border p-4 flex flex-col gap-2.5 hover:border-primary/50 hover:shadow-md transition-all group"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {skill.hot && <span className="text-base shrink-0">🔥</span>}
                <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                  {skill.name}
                </p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Category badge */}
            <span className={`self-start text-[10px] px-2 py-0.5 rounded-full border font-medium ${categoryColor[skill.category] ?? "bg-secondary text-muted-foreground border-border"}`}>
              {skill.category}
            </span>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              {skill.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-auto pt-1 border-t border-border">
              {skill.tags.map(t => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

// ── Internship card ───────────────────────────────────────────────────────────

function InternCard({ intern }: { intern: Internship }) {
  return (
    <div className="rounded-xl bg-card border border-border flex flex-col hover:border-primary/40 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
          {intern.logo}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm truncate">{intern.company}</p>
          <p className="text-xs text-muted-foreground truncate">{intern.role}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium">
            Live
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${tierColor[intern.tier]}`}>
            {tierLabel[intern.tier]}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 gap-3 p-4">
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{intern.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {intern.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">{tag}</Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs border-t border-border pt-2">
          <span className="font-medium text-foreground">{intern.stipend}</span>
          <span className="flex items-center gap-1 text-muted-foreground ml-auto">
            <Calendar className="h-3 w-3" />
            {intern.deadline}
          </span>
        </div>

        <a
          href={intern.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary text-primary-foreground py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Apply Now
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface CareerHubProps {
  graduationYear?: number
}

export function CareerHub({ graduationYear }: CareerHubProps) {
  const [year, setYear] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState(0)
  const [search, setSearch] = useState("")

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

  if (!year) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
        Detecting your year...
      </div>
    )
  }

  const content = yearContent[year]
  const section = content.sections[activeSection]
  const isInternSection = !!section.internships
  const isSkillsSection = !!section.skills

  const filteredItems = (section.items ?? []).filter(item =>
    !search ||
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase()) ||
    item.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  const filteredInterns = (section.internships ?? []).filter(i =>
    !search ||
    i.company.toLowerCase().includes(search.toLowerCase()) ||
    i.role.toLowerCase().includes(search.toLowerCase()) ||
    i.description.toLowerCase().includes(search.toLowerCase()) ||
    i.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  const filteredSkills = (section.skills ?? []).filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className={`rounded-xl bg-gradient-to-r ${content.color} p-5 text-white`}>
        <div className="flex items-center gap-4">
          <span className="text-4xl">{content.emoji}</span>
          <div>
            <p className="font-bold text-2xl">{content.label} — {content.tagline}</p>
            <p className="text-white/70 text-base mt-0.5">Personalised based on your graduation year</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              className="w-full rounded-lg border border-white/20 bg-white/10 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
              placeholder="Search topics, companies, skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {content.sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setActiveSection(i); setSearch("") }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all whitespace-nowrap ${
                activeSection === i
                  ? "bg-white text-gray-900 border-white"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
            >
              {s.icon}
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isSkillsSection ? (
        <div className="grid">
          {filteredSkills.length === 0
            ? <p className="text-base text-muted-foreground text-center py-10">No skills match &quot;{search}&quot;</p>
            : <SkillsView skills={filteredSkills} />
          }
        </div>
      ) : isInternSection ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredInterns.length === 0
            ? <p className="text-base text-muted-foreground text-center py-10 col-span-full">No results for &quot;{search}&quot;</p>
            : filteredInterns.map(intern => <InternCard key={intern.company} intern={intern} />)
          }
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.length === 0
            ? <p className="text-base text-muted-foreground text-center py-10 col-span-full">No results for &quot;{search}&quot;</p>
            : filteredItems.map(item => (
              <div key={item.label} className="rounded-xl bg-card border border-border p-4 flex flex-col gap-2.5">
                <p className="text-base font-semibold">{item.label}</p>
                {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                {item.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">{tag}</Badge>
                    ))}
                  </div>
                )}
                {item.links && (
                  <div className="flex flex-wrap gap-3 pt-1 mt-auto">
                    {item.links.map(link => (
                      <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                        <ExternalLink className="h-3.5 w-3.5" />
                        {link.text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}
