"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  BookOpen, Code2, Briefcase, Trophy,
  ExternalLink, Brain, Zap, Calendar,
  TrendingUp, Building2, Globe, MapPin, Loader2, Target, Sparkles, FileText,
  CheckCircle2,
} from "lucide-react"
import { SmartResume } from "@/components/student/smart-resume"

// -- Types ---------------------------------------------------------------------

interface ContentItem {
  label: string
  description?: string
  links?: { text: string; url: string; type?: "youtube" | "notes" | "course" | "practice" }[]
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
  courseUrl?: string   // additional course link
  videoUrl?: string    // YouTube link
  notesUrl?: string    // cheatsheet/notes link
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
  { name: "Python", hot: true, category: "Language", description: "The #1 language for AI, data science, backend, and automation. Easiest to learn, hardest to master.", tags: ["AI/ML", "Backend", "Scripting"], learnUrl: "https://docs.python.org/3/tutorial/", videoUrl: "https://www.youtube.com/watch?v=t8pPdKYpowI", notesUrl: "https://www.pythoncheatsheet.org/" },
  { name: "TypeScript", hot: true, category: "Language", description: "JavaScript with types. Used in every modern frontend and backend codebase. Recruiters love it.", tags: ["Frontend", "Backend", "In-demand"], learnUrl: "https://www.typescriptlang.org/docs/handbook/intro.html", videoUrl: "https://www.youtube.com/watch?v=30LWjhZzg50", notesUrl: "https://quickref.me/typescript.html" },
  { name: "React", hot: true, category: "Frontend", description: "The most widely-used UI library. Powers Facebook, Instagram, Airbnb, and thousands of startups.", tags: ["Frontend", "UI", "Popular"], learnUrl: "https://react.dev/learn", videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk", notesUrl: "https://devhints.io/react" },
  { name: "LLM / GenAI", hot: true, category: "AI/ML", description: "Build with GPT, Gemini, Claude. The most demanded skill in 2025 across product and research roles.", tags: ["AI", "GenAI", "Trending"], learnUrl: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", videoUrl: "https://www.youtube.com/watch?v=c-g6epk3fFE", notesUrl: "https://platform.openai.com/docs/quickstart" },
  { name: "Next.js", hot: true, category: "Full Stack", description: "React-based full stack framework. Used by Vercel, TikTok, Notion. Best for modern web apps.", tags: ["Full Stack", "React", "SSR"], learnUrl: "https://nextjs.org/learn", videoUrl: "https://www.youtube.com/watch?v=wm5gMKuwSYk", notesUrl: "https://nextjs.org/docs" },
  { name: "AWS", hot: true, category: "Cloud", description: "World's #1 cloud. EC2, S3, Lambda — knowing AWS is a must for any backend or DevOps role.", tags: ["Cloud", "DevOps", "MNC"], learnUrl: "https://aws.amazon.com/training/learn-about/cloud-essentials/", videoUrl: "https://www.youtube.com/watch?v=ubCNZFXx8F8", notesUrl: "https://aws.amazon.com/getting-started/hands-on/" },
  { name: "Docker", hot: true, category: "DevOps", description: "Containerisation platform used by every company. Makes your apps run the same everywhere.", tags: ["DevOps", "Containers", "CI/CD"], learnUrl: "https://docs.docker.com/get-started/", videoUrl: "https://www.youtube.com/watch?v=3c-iBn73dDE", notesUrl: "https://quickref.me/docker.html" },
  { name: "LangChain", hot: true, category: "AI/ML", description: "Framework for building LLM-powered apps — chatbots, RAG pipelines, AI agents. Exploding demand.", tags: ["AI", "LLM", "Agents"], learnUrl: "https://python.langchain.com/docs/get_started/introduction", videoUrl: "https://www.youtube.com/watch?v=lG7Uxts9SXs", notesUrl: "https://python.langchain.com/docs/expression_language/cookbook/" },
  { name: "HuggingFace", hot: true, category: "AI/ML", description: "Open-source hub for pretrained ML models. Standard tool for NLP, CV, and speech research roles.", tags: ["AI", "NLP", "Models"], learnUrl: "https://huggingface.co/learn/nlp-course/chapter1/1", videoUrl: "https://www.youtube.com/watch?v=QEaBAZQCtwE", notesUrl: "https://huggingface.co/docs/transformers/index" },
  { name: "Go (Golang)", hot: true, category: "Language", description: "Fast, simple, concurrent. Used at Google, Uber, Dropbox. Great for microservices and backend.", tags: ["Backend", "Microservices", "Google"], learnUrl: "https://go.dev/tour/welcome/1", videoUrl: "https://www.youtube.com/watch?v=yyUHQIec83I", notesUrl: "https://quickref.me/go.html" },
  { name: "PostgreSQL", hot: true, category: "Database", description: "Most advanced open-source relational DB. Standard choice for startups and product companies.", tags: ["Database", "SQL", "Backend"], learnUrl: "https://www.postgresql.org/docs/current/tutorial.html", videoUrl: "https://www.youtube.com/watch?v=qw--VYLpxG4", notesUrl: "https://quickref.me/postgres.html" },
  { name: "Redis", hot: true, category: "Database", description: "In-memory data store for caching, sessions, queues. Found in virtually every scalable system.", tags: ["Database", "Caching", "Real-time"], learnUrl: "https://redis.io/docs/get-started/", videoUrl: "https://www.youtube.com/watch?v=jgpVdJB2sKQ", notesUrl: "https://quickref.me/redis.html" },
  { name: "CI/CD", hot: true, category: "DevOps", description: "Automate build, test, deploy pipelines with GitHub Actions. Expected skill in every SDE role.", tags: ["DevOps", "Automation", "GitHub"], learnUrl: "https://docs.github.com/en/actions/learn-github-actions", videoUrl: "https://www.youtube.com/watch?v=R8_veQiYBjI", notesUrl: "https://docs.github.com/en/actions/reference" },
  { name: "PyTorch", hot: true, category: "AI/ML", description: "Facebook's deep learning framework. Industry standard for research and production ML models.", tags: ["AI", "Deep Learning", "Research"], learnUrl: "https://pytorch.org/tutorials/beginner/basics/intro.html", videoUrl: "https://www.youtube.com/watch?v=c36lUUr864M", notesUrl: "https://pytorch.org/docs/stable/index.html" },
  { name: "Data Structures", hot: false, category: "Core CS", description: "Foundation of every coding interview. Arrays, trees, graphs, heaps — master these to crack any OA.", tags: ["DSA", "Interviews", "Must Do"], learnUrl: "https://www.geeksforgeeks.org/data-structures/", videoUrl: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O", notesUrl: "https://www.geeksforgeeks.org/top-algorithms-and-data-structures-for-competitive-programming/" },
  { name: "Algorithms", hot: false, category: "Core CS", description: "Sorting, searching, DP, greedy — the building blocks that interviewers test in every round.", tags: ["DSA", "LeetCode", "Must Do"], learnUrl: "https://neetcode.io/roadmap", videoUrl: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz", notesUrl: "https://cp-algorithms.com/" },
  { name: "System Design", hot: false, category: "Core CS", description: "Design scalable systems like YouTube, WhatsApp. Critical for SDE-2+ and senior roles.", tags: ["Architecture", "HLD", "Senior"], learnUrl: "https://github.com/donnemartin/system-design-primer", videoUrl: "https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX", notesUrl: "https://github.com/donnemartin/system-design-primer" },
  { name: "Node.js", hot: false, category: "Backend", description: "JavaScript on the server. Powers Netflix, LinkedIn, PayPal. Paired with Express for REST APIs.", tags: ["Backend", "JavaScript", "APIs"], learnUrl: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs", videoUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE", notesUrl: "https://nodejs.org/en/docs/" },
  { name: "Kubernetes", hot: false, category: "DevOps", description: "Container orchestration platform. Manages Docker containers at scale. Big tech standard.", tags: ["DevOps", "Containers", "Scale"], learnUrl: "https://kubernetes.io/docs/tutorials/kubernetes-basics/", videoUrl: "https://www.youtube.com/watch?v=X48VuDVv0do", notesUrl: "https://kubernetes.io/docs/reference/kubectl/cheatsheet/" },
  { name: "Flutter", hot: false, category: "Mobile", description: "Google's cross-platform UI toolkit. Build iOS and Android apps from a single codebase.", tags: ["Mobile", "Dart", "Cross-platform"], learnUrl: "https://docs.flutter.dev/get-started/codelab", videoUrl: "https://www.youtube.com/watch?v=1ukSR1GRtMU", notesUrl: "https://devhints.io/flutter" },
  { name: "GraphQL", hot: false, category: "API", description: "Query language for APIs. More flexible than REST. Used by Facebook, GitHub, Shopify.", tags: ["API", "Frontend", "Backend"], learnUrl: "https://graphql.org/learn/", videoUrl: "https://www.youtube.com/watch?v=ed8SzALpx1Q", notesUrl: "https://devhints.io/graphql" },
  { name: "Supabase", hot: false, category: "Database", description: "Open-source Firebase alternative. Postgres + auth + storage + realtime. Great for side projects.", tags: ["Database", "BaaS", "Startup"], learnUrl: "https://supabase.com/docs", videoUrl: "https://www.youtube.com/watch?v=dU7GwCOgvNY", notesUrl: "https://supabase.com/docs/guides/getting-started" },
  { name: "TensorFlow", hot: false, category: "AI/ML", description: "Google's ML framework. Widely used for production deployment of deep learning models.", tags: ["AI", "ML", "Google"], learnUrl: "https://www.tensorflow.org/tutorials", videoUrl: "https://www.youtube.com/watch?v=tPYj3fFJGjk", notesUrl: "https://www.tensorflow.org/api_docs" },
  { name: "MongoDB", hot: false, category: "Database", description: "Leading NoSQL document database. Flexible schema, great for rapid prototyping and MERN apps.", tags: ["Database", "NoSQL", "MERN"], learnUrl: "https://learn.mongodb.com/learning-paths/introduction-to-mongodb", videoUrl: "https://www.youtube.com/watch?v=ExcRbA7fy_A", notesUrl: "https://www.mongodb.com/docs/manual/" },
  { name: "OOP Concepts", hot: false, category: "Core CS", description: "Classes, inheritance, polymorphism, encapsulation. Core of every Java/Python/C++ interview.", tags: ["Core CS", "Interviews", "Fundamentals"], learnUrl: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/", videoUrl: "https://www.youtube.com/watch?v=m_MQYyJpIjg", notesUrl: "https://www.geeksforgeeks.org/oops-object-oriented-design/" },
  { name: "OS Concepts", hot: false, category: "Core CS", description: "Processes, threads, memory management, scheduling. Asked in every campus placement technical round.", tags: ["Core CS", "Placement", "Theory"], learnUrl: "https://www.geeksforgeeks.org/operating-systems/", videoUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O", notesUrl: "https://www.geeksforgeeks.org/operating-systems/" },
  { name: "DBMS", hot: false, category: "Core CS", description: "ER models, normalization, SQL, transactions, indexing. Essential for backend and data engineering.", tags: ["Core CS", "SQL", "Placement"], learnUrl: "https://www.geeksforgeeks.org/dbms/", videoUrl: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y", notesUrl: "https://www.geeksforgeeks.org/sql-cheat-sheet/" },
  { name: "Computer Networks", hot: false, category: "Core CS", description: "TCP/IP, HTTP, DNS, OSI model. Appears in every MNC placement test and cloud interviews.", tags: ["Core CS", "Networking", "Cloud"], learnUrl: "https://www.geeksforgeeks.org/computer-network-tutorials/", videoUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx", notesUrl: "https://www.geeksforgeeks.org/computer-network-tutorials/" },
  { name: "Microservices", hot: false, category: "Architecture", description: "Build apps as small independent services. Dominant architecture at Amazon, Netflix, Uber.", tags: ["Backend", "Architecture", "Scale"], learnUrl: "https://microservices.io/patterns/microservices.html", videoUrl: "https://www.youtube.com/watch?v=y8IQb4ofjDo", notesUrl: "https://microservices.io/patterns/index.html" },
  { name: "React Native", hot: false, category: "Mobile", description: "Build native iOS and Android apps with React. Reuse web knowledge for mobile development.", tags: ["Mobile", "React", "Cross-platform"], learnUrl: "https://reactnative.dev/docs/getting-started", videoUrl: "https://www.youtube.com/watch?v=0-S5a0eXPoc", notesUrl: "https://devhints.io/react" },
  { name: "Rust", hot: false, category: "Language", description: "Memory-safe systems language. Fastest-growing in Stack Overflow surveys. Used at Mozilla, Discord.", tags: ["Systems", "Performance", "Safe"], learnUrl: "https://doc.rust-lang.org/book/", videoUrl: "https://www.youtube.com/watch?v=ygL_xcavzQ4", notesUrl: "https://quickref.me/rust.html" },
  // Additional skills
  { name: "Vue.js", hot: false, category: "Frontend", description: "Progressive JS framework. Used at GitLab, Alibaba. Easier learning curve than React for beginners.", tags: ["Frontend", "JavaScript", "Popular"], learnUrl: "https://vuejs.org/guide/introduction.html" },
  { name: "Angular", hot: false, category: "Frontend", description: "Google's enterprise frontend framework. Used heavily in banking and MNC projects.", tags: ["Frontend", "TypeScript", "Enterprise"], learnUrl: "https://angular.io/start" },
  { name: "Spring Boot", hot: false, category: "Backend", description: "Java framework for REST APIs. Standard in enterprise India — TCS, Infosys, Wipro projects.", tags: ["Backend", "Java", "Enterprise"], learnUrl: "https://spring.io/quickstart" },
  { name: "Java", hot: false, category: "Language", description: "Most-used enterprise language. Required for Android, Spring Boot, and most MNC placement tests.", tags: ["Language", "Android", "Enterprise"], learnUrl: "https://dev.java/learn/" },
  { name: "C++", hot: false, category: "Language", description: "Fastest language for competitive programming. Used in game engines, trading systems, embedded.", tags: ["Language", "CP", "Systems"], learnUrl: "https://www.learncpp.com/" },
  { name: "Kotlin", hot: false, category: "Mobile", description: "Modern Android development language. Fully interoperable with Java, more concise and safe.", tags: ["Mobile", "Android", "JVM"], learnUrl: "https://developer.android.com/kotlin/first" },
  { name: "Swift", hot: false, category: "Mobile", description: "Apple's iOS/macOS language. Required for native iOS app development.", tags: ["Mobile", "iOS", "Apple"], learnUrl: "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/" },
  { name: "Django", hot: false, category: "Backend", description: "Python web framework. Powers Instagram, Pinterest. Great for rapid full-stack development.", tags: ["Backend", "Python", "Web"], learnUrl: "https://docs.djangoproject.com/en/stable/intro/tutorial01/" },
  { name: "FastAPI", hot: true, category: "Backend", description: "Modern Python API framework. Fastest-growing backend tool — ideal for AI/ML API serving.", tags: ["Backend", "Python", "AI APIs"], learnUrl: "https://fastapi.tiangolo.com/tutorial/" },
  { name: "Express.js", hot: false, category: "Backend", description: "Minimal Node.js framework. Most popular choice for building REST APIs in JavaScript.", tags: ["Backend", "Node.js", "REST"], learnUrl: "https://expressjs.com/en/starter/installing.html" },
  { name: "Tailwind CSS", hot: true, category: "Frontend", description: "Utility-first CSS framework. Fastest way to build beautiful UIs. Used in most modern projects.", tags: ["Frontend", "CSS", "UI"], learnUrl: "https://tailwindcss.com/docs/utility-first" },
  { name: "Figma", hot: false, category: "Frontend", description: "Industry-standard UI/UX design tool. Required for frontend roles — know the basics.", tags: ["Design", "UI/UX", "Frontend"], learnUrl: "https://www.figma.com/resource-library/getting-started-in-figma/" },
  { name: "Git", hot: false, category: "DevOps", description: "Version control — essential for every developer. Know branching, merging, pull requests.", tags: ["DevOps", "Essential", "Beginner"], learnUrl: "https://git-scm.com/book/en/v2" },
  { name: "Linux / Bash", hot: false, category: "DevOps", description: "Command line skills are expected in every SDE role. Know file ops, scripts, process management.", tags: ["DevOps", "Linux", "Scripting"], learnUrl: "https://linuxjourney.com/" },
  { name: "Terraform", hot: false, category: "Cloud", description: "Infrastructure as Code. Define cloud infra with code. High demand in DevOps and SRE roles.", tags: ["Cloud", "IaC", "DevOps"], learnUrl: "https://developer.hashicorp.com/terraform/tutorials/aws-get-started" },
  { name: "Azure", hot: false, category: "Cloud", description: "Microsoft's cloud platform. Dominant in enterprise. AZ-900 is an easy entry certification.", tags: ["Cloud", "Microsoft", "Enterprise"], learnUrl: "https://learn.microsoft.com/en-us/azure/fundamentals/" },
  { name: "GCP", hot: false, category: "Cloud", description: "Google Cloud Platform. Strong in AI/ML workloads. Used heavily at Google and tech companies.", tags: ["Cloud", "Google", "AI/ML"], learnUrl: "https://cloud.google.com/free/docs/free-cloud-features" },
  { name: "Elasticsearch", hot: false, category: "Database", description: "Search and analytics engine. Used by every major product for search, logging, and monitoring.", tags: ["Database", "Search", "Analytics"], learnUrl: "https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html" },
  { name: "Kafka", hot: false, category: "Architecture", description: "Distributed event streaming. Powers real-time data pipelines at LinkedIn, Uber, Netflix.", tags: ["Architecture", "Streaming", "Backend"], learnUrl: "https://kafka.apache.org/quickstart" },
  { name: "gRPC", hot: false, category: "API", description: "High-performance RPC framework by Google. Used for microservice communication at scale.", tags: ["API", "Backend", "Microservices"], learnUrl: "https://grpc.io/docs/languages/python/quickstart/" },
  { name: "OpenAI API", hot: true, category: "AI/ML", description: "Build GPT-4, DALL-E, Whisper integrations. Must-know for any AI product role in 2025.", tags: ["AI", "LLM", "API"], learnUrl: "https://platform.openai.com/docs/quickstart" },
  { name: "Pandas", hot: false, category: "AI/ML", description: "Python data analysis library. Foundation for any data science or data engineering role.", tags: ["AI/ML", "Python", "Data"], learnUrl: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/" },
  { name: "NumPy", hot: false, category: "AI/ML", description: "Numerical computing in Python. Used in every ML pipeline — arrays, matrices, linear algebra.", tags: ["AI/ML", "Python", "Math"], learnUrl: "https://numpy.org/learn/" },
  { name: "Scikit-learn", hot: false, category: "AI/ML", description: "Classical ML library. Regression, classification, clustering. Quick to learn, widely used.", tags: ["AI/ML", "ML", "Python"], learnUrl: "https://scikit-learn.org/stable/tutorial/basic/tutorial.html" },
  { name: "OpenCV", hot: false, category: "AI/ML", description: "Computer vision library. Used in face detection, object tracking, medical imaging.", tags: ["AI/ML", "Vision", "Python"], learnUrl: "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html" },
  { name: "SQL", hot: false, category: "Database", description: "Structured Query Language — asked in every technical interview. Joins, indexes, aggregations.", tags: ["Database", "Interviews", "Essential"], learnUrl: "https://sqlzoo.net/wiki/SQL_Tutorial" },
  { name: "Firebase", hot: false, category: "Database", description: "Google's BaaS — real-time database, auth, hosting. Great for building MVPs fast.", tags: ["Database", "BaaS", "Mobile"], learnUrl: "https://firebase.google.com/docs/guides" },
  { name: "Prisma", hot: false, category: "Database", description: "Modern TypeScript ORM. Used with PostgreSQL/MySQL. Best developer experience for DB access.", tags: ["Database", "TypeScript", "ORM"], learnUrl: "https://www.prisma.io/docs/getting-started" },
  { name: "WebSockets", hot: false, category: "Backend", description: "Real-time bidirectional communication. Used in chat, trading platforms, live dashboards.", tags: ["Backend", "Real-time", "API"], learnUrl: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" },
  { name: "Three.js", hot: false, category: "Frontend", description: "3D graphics in the browser. Used in product showcases, games, data visualisations.", tags: ["Frontend", "3D", "WebGL"], learnUrl: "https://threejs.org/docs/#manual/en/introduction/Installation" },
  { name: "Solidity", hot: false, category: "Language", description: "Smart contract language for Ethereum/Polygon. Required for Web3 and blockchain developer roles.", tags: ["Web3", "Blockchain", "Crypto"], learnUrl: "https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html" },
  { name: "R", hot: false, category: "Language", description: "Statistical computing language. Used in data science, bioinformatics, and research roles.", tags: ["Data Science", "Statistics", "Research"], learnUrl: "https://www.r-project.org/about.html" },
  { name: "Julia", hot: false, category: "Language", description: "High-performance scientific computing. Growing in ML research and quantitative finance.", tags: ["Language", "Scientific", "HPC"], learnUrl: "https://julialang.org/learning/" },
  { name: "Power BI", hot: false, category: "Database", description: "Microsoft BI tool. Needed for data analyst roles in MNCs. Create dashboards from SQL/Excel.", tags: ["Analytics", "BI", "MNC"], learnUrl: "https://learn.microsoft.com/en-us/power-bi/fundamentals/power-bi-overview" },
  { name: "Tableau", hot: false, category: "Database", description: "Industry-leading data viz tool. Valued in data analyst and business intelligence roles.", tags: ["Analytics", "BI", "Visualisation"], learnUrl: "https://www.tableau.com/learn/training" },
  { name: "Ansible", hot: false, category: "DevOps", description: "IT automation tool. Automate server config, deployments. Used heavily in ops and SRE teams.", tags: ["DevOps", "Automation", "SRE"], learnUrl: "https://docs.ansible.com/ansible/latest/getting_started/" },
  { name: "Prometheus + Grafana", hot: false, category: "DevOps", description: "Monitoring and alerting stack. Every production system uses these. DevOps must-know.", tags: ["DevOps", "Monitoring", "SRE"], learnUrl: "https://prometheus.io/docs/introduction/overview/" },
  { name: "Nginx", hot: false, category: "Backend", description: "High-performance web server and reverse proxy. Used in every production backend deployment.", tags: ["Backend", "Infra", "DevOps"], learnUrl: "https://nginx.org/en/docs/beginners_guide.html" },
]

// -- Year content --------------------------------------------------------------

const yearContent: Record<number, { label: string; emoji: string; tagline: string; color: string; sections: Section[] }> = {
  1: {
    label: "1st Year", emoji: "🌱", tagline: "Learn & Build Foundation", color: "from-blue-600 to-cyan-600",
    sections: [
      {
        id: "learning", title: "Learning Paths", icon: <BookOpen className="h-4 w-4" />,
        items: [
          { label: "Programming Basics — C", description: "Variables, loops, functions, pointers, memory management", tags: ["C", "Beginner"], links: [
            { text: "GFG C Course", url: "https://www.geeksforgeeks.org/c-programming-language/", type: "course" },
            { text: "CS50x Harvard", url: "https://cs50.harvard.edu/x/2024/", type: "course" },
            { text: "Jenny's C Lectures", url: "https://www.youtube.com/playlist?list=PLdo5W4Nhv31a8UcMN9-35ghv8qyFWD9_S", type: "youtube" },
            { text: "Neso Academy C", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRggZZgYpPC8eTgMi9QQBDiS", type: "youtube" },
            { text: "C Cheatsheet (GFG)", url: "https://www.geeksforgeeks.org/c-cheatsheet/", type: "notes" },
            { text: "C Quick Notes", url: "https://quickref.me/c.html", type: "notes" },
          ]},
          { label: "Programming Basics — Python", description: "Syntax, OOP, data types, file handling, libraries", tags: ["Python", "Beginner"], links: [
            { text: "Python.org Tutorial", url: "https://docs.python.org/3/tutorial/", type: "course" },
            { text: "freeCodeCamp Python", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/", type: "course" },
            { text: "TechWorld Python Full Course", url: "https://www.youtube.com/watch?v=t8pPdKYpowI", type: "youtube" },
            { text: "Corey Schafer Python", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU", type: "youtube" },
            { text: "Python Cheatsheet", url: "https://www.pythoncheatsheet.org/", type: "notes" },
            { text: "Python Quick Ref", url: "https://quickref.me/python.html", type: "notes" },
          ]},
          { label: "DSA Beginner Track", description: "Arrays, Strings, Linked Lists, Stacks, Recursion — step by step", tags: ["Arrays", "DSA"], links: [
            { text: "GFG DSA Self-Paced", url: "https://www.geeksforgeeks.org/courses/dsa-self-paced", type: "course" },
            { text: "CodeChef DSA Course", url: "https://www.codechef.com/learn/course/dsa", type: "course" },
            { text: "Abdul Bari Algorithms", url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O", type: "youtube" },
            { text: "Striver DSA Sheet", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz", type: "youtube" },
            { text: "DSA Notes PDF (Apna College)", url: "https://www.apnacollege.in/notes", type: "notes" },
            { text: "DSA Cheatsheet (GFG)", url: "https://www.geeksforgeeks.org/top-algorithms-and-data-structures-for-competitive-programming/", type: "notes" },
          ]},
          { label: "Web Dev Basics", description: "HTML, CSS, JavaScript — build your first webpage from scratch", tags: ["HTML", "CSS", "JS"], links: [
            { text: "freeCodeCamp Web", url: "https://www.freecodecamp.org/learn/responsive-web-design/", type: "course" },
            { text: "The Odin Project", url: "https://www.theodinproject.com/paths/foundations/courses/foundations", type: "course" },
            { text: "Traversy Media HTML/CSS", url: "https://www.youtube.com/watch?v=UB1O30fR-EE", type: "youtube" },
            { text: "JavaScript Full Course", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", type: "youtube" },
            { text: "HTML Cheatsheet", url: "https://htmlcheatsheet.com/", type: "notes" },
            { text: "CSS Cheatsheet", url: "https://quickref.me/css.html", type: "notes" },
            { text: "JS Cheatsheet", url: "https://quickref.me/javascript.html", type: "notes" },
          ]},
          { label: "AI/ML Foundations", description: "Intro to ML, math basics, Python for data science", tags: ["Python", "NumPy", "Pandas"], links: [
            { text: "Kaggle Intro to ML", url: "https://www.kaggle.com/learn/intro-to-machine-learning", type: "course" },
            { text: "Kaggle Python Course", url: "https://www.kaggle.com/learn/python", type: "course" },
            { text: "Sentdex ML Playlist", url: "https://www.youtube.com/playlist?list=PLQVvvaa0QuDfKTOs3Keq_kaG2P55YRn5v", type: "youtube" },
            { text: "3Blue1Brown Neural Nets", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", type: "youtube" },
            { text: "NumPy Cheatsheet", url: "https://www.datacamp.com/cheat-sheet/numpy-cheat-sheet-data-analysis-in-python", type: "notes" },
            { text: "Pandas Cheatsheet", url: "https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf", type: "notes" },
          ]},
          { label: "Git & GitHub", description: "Version control, branching, pull requests — essential skill", tags: ["Git", "GitHub"], links: [
            { text: "Git Handbook", url: "https://guides.github.com/introduction/git-handbook/", type: "course" },
            { text: "GitHub Learning Lab", url: "https://skills.github.com/", type: "course" },
            { text: "Git & GitHub Crash Course", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", type: "youtube" },
            { text: "Kunal Kushwaha Git", url: "https://www.youtube.com/watch?v=apGV9Kg7ics", type: "youtube" },
            { text: "Git Cheatsheet (GitHub)", url: "https://training.github.com/downloads/github-git-cheat-sheet.pdf", type: "notes" },
            { text: "Git Quick Ref", url: "https://quickref.me/git.html", type: "notes" },
          ]},
          { label: "CS50 — Intro to CS", description: "Harvard's legendary free CS course — highly recommended", tags: ["CS Fundamentals"], links: [
            { text: "CS50x (Free)", url: "https://cs50.harvard.edu/x/2024/", type: "course" },
            { text: "CS50 Python", url: "https://cs50.harvard.edu/python/2022/", type: "course" },
            { text: "CS50 Full Lecture 0", url: "https://www.youtube.com/watch?v=3LPJfIKxwWc", type: "youtube" },
            { text: "CS50 YouTube Playlist", url: "https://www.youtube.com/playlist?list=PLhQjrBD2T381WAHyx1pq-sBfykqMBI7V4", type: "youtube" },
            { text: "CS50 Notes (cs50.ai)", url: "https://cs50.ai/", type: "notes" },
          ]},
          { label: "Linux & Command Line", description: "Terminal commands, file system, scripting basics", tags: ["Linux", "Bash"], links: [
            { text: "Linux Journey", url: "https://linuxjourney.com/", type: "course" },
            { text: "OverTheWire Bandit", url: "https://overthewire.org/wargames/bandit/", type: "practice" },
            { text: "Linux for Beginners", url: "https://www.youtube.com/watch?v=sWbUDq4S6Y8", type: "youtube" },
            { text: "Shell Scripting Tutorial", url: "https://www.youtube.com/watch?v=cQepf9fY6cE", type: "youtube" },
            { text: "Linux Command Cheatsheet", url: "https://quickref.me/linux.html", type: "notes" },
            { text: "Bash Cheatsheet", url: "https://devhints.io/bash", type: "notes" },
          ]},
        ],
      },
      {
        id: "skills", title: "Skills to Build", icon: <TrendingUp className="h-4 w-4" />,
        skills: [
          { name:"Python", category:"Language", hot:true, demand:98, learnUrl:"https://docs.python.org/3/tutorial/", jobs:50000, description:"Most in-demand language — used in AI, data, backend & automation", tags:["Beginner","AI/ML","Backend"] },
          { name:"C/C++", category:"Language", hot:false, demand:85, learnUrl:"https://www.learncpp.com/", jobs:30000, description:"Foundation language taught in first year — essential for placements", tags:["Beginner","Systems","DSA"] },
          { name:"JavaScript", category:"Language", hot:true, demand:95, learnUrl:"https://javascript.info/", jobs:60000, description:"Language of the web — runs in every browser", tags:["Web","Frontend","Beginner"] },
          { name:"HTML & CSS", category:"Frontend", hot:false, demand:90, learnUrl:"https://www.freecodecamp.org/learn/responsive-web-design/", jobs:40000, description:"Build your first webpage — must-know for any developer", tags:["Web","Beginner","Frontend"] },
          { name:"Git & GitHub", category:"DevOps", hot:false, demand:95, learnUrl:"https://skills.github.com/", jobs:80000, description:"Version control — used in every software job globally", tags:["Essential","DevOps","Collaboration"] },
          { name:"Data Structures", category:"Core CS", hot:true, demand:99, learnUrl:"https://www.geeksforgeeks.org/data-structures/", jobs:70000, description:"Arrays, Linked Lists, Trees — core of all technical interviews", tags:["DSA","Interviews","Essential"] },
          { name:"SQL Basics", category:"Database", hot:false, demand:88, learnUrl:"https://sqlzoo.net/", jobs:45000, description:"Query databases — needed for data and backend roles", tags:["Database","Beginner","Backend"] },
          { name:"Linux Terminal", category:"DevOps", hot:false, demand:80, learnUrl:"https://linuxjourney.com/", jobs:35000, description:"Command line basics — used daily by engineers", tags:["Linux","DevOps","Beginner"] },
        ] as any,
      },
      {
        id: "practice", title: "Daily Practice", icon: <Code2 className="h-4 w-4" />,
        items: [
          { label: "LeetCode Easy Problems", description: "Start with Easy — build confidence and consistency", tags: ["Easy", "Beginner"], links: [
            { text: "Start Solving", url: "https://leetcode.com/problemset/?difficulty=EASY&page=1", type: "practice" },
            { text: "LeetCode Beginner Guide", url: "https://www.youtube.com/watch?v=SVvr3ZjtjI8", type: "youtube" },
            { text: "NeetCode Roadmap", url: "https://www.youtube.com/watch?v=H8TldXIVTNs", type: "youtube" },
            { text: "LeetCode Patterns Cheatsheet", url: "https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns", type: "notes" },
          ]},
          { label: "HackerRank Algorithms", description: "Beginner-friendly problems with guided hints and explanations", tags: ["HackerRank"], links: [
            { text: "Easy Algorithms", url: "https://www.hackerrank.com/domains/algorithms?filters%5Bdifficulty%5D%5B%5D=easy", type: "practice" },
            { text: "HackerRank Tips", url: "https://www.youtube.com/watch?v=m4moinc9fZo", type: "youtube" },
          ]},
          { label: "GFG Practice Portal", description: "School and basic level problems on GeeksforGeeks", tags: ["GFG", "School"], links: [
            { text: "School Problems", url: "https://practice.geeksforgeeks.org/explore?difficulty%5B%5D=0&page=1", type: "practice" },
            { text: "GFG Basics Playlist", url: "https://www.youtube.com/playlist?list=PLqM7alHXFySEQDk2MDfmcpAiCH5ZOSY7B", type: "youtube" },
            { text: "GFG DSA Notes", url: "https://www.geeksforgeeks.org/data-structures/", type: "notes" },
          ]},
          { label: "LeetCode Daily Challenge", description: "One problem a day — build the habit early", tags: ["Daily", "Streak"], links: [
            { text: "Today's Problem", url: "https://leetcode.com/problemset/", type: "practice" },
            { text: "How to Use LeetCode", url: "https://www.youtube.com/watch?v=eqHFQAoQF7I", type: "youtube" },
            { text: "Blind 75 Cheatsheet", url: "https://www.techinterviewhandbook.org/grind75", type: "notes" },
          ]},
          { label: "100 Days of Code", description: "Build consistency with the #100DaysOfCode challenge", tags: ["Challenge", "Habit"], links: [
            { text: "Start Challenge", url: "https://www.100daysofcode.com/", type: "course" },
            { text: "100 Days Guide", url: "https://www.youtube.com/watch?v=8bFjKdXHTO4", type: "youtube" },
          ]},
          { label: "CodeChef Beginner", description: "Beginner-rated competitive programming problems", tags: ["CodeChef", "CP"], links: [
            { text: "Division 4", url: "https://www.codechef.com/contests", type: "practice" },
            { text: "CP for Beginners", url: "https://www.youtube.com/watch?v=JoFTj3DnFOA", type: "youtube" },
            { text: "CP Algorithms Notes", url: "https://cp-algorithms.com/", type: "notes" },
          ]},
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
    label: "4th Year", emoji: "", tagline: "Get Placed", color: "from-emerald-600 to-teal-600",
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
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("All")

  const categories = ["All", ...Array.from(new Set(skills.map(s => s.category))).sort()]

  const filtered = skills.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchCat = catFilter === "All" || s.category === catFilter
    return matchSearch && matchCat
  })

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
      {/* Search + category filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search skills (Python, Docker, React...)"
            className="w-full pl-4 pr-8 py-2 rounded-full border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs">✕</button>
          )}
        </div>
        <div className="relative">
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="appearance-none pl-4 pr-8 py-2 rounded-full border border-border bg-card text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:border-primary/50 transition-all">
            {categories.map(c => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-xs">▼</span>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{filtered.length} skills</span>
      </div>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="h-4 w-4 text-primary" />
        Most demanded skills in 2025 · click any card to start learning
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map(skill => (
          <a key={skill.name} href={skill.learnUrl} target="_blank" rel="noopener noreferrer"
            className="rounded-xl bg-card border border-border p-4 flex flex-col gap-2.5 hover:border-primary/50 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {skill.hot && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-500 shrink-0">HOT</span>}
                <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{skill.name}</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className={`self-start text-[10px] px-2 py-0.5 rounded-full border font-medium ${categoryColor[skill.category] ?? "bg-secondary text-muted-foreground border-border"}`}>
              {skill.category}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">{skill.description}</p>
            <div className="flex flex-wrap gap-1 mt-auto pt-1 border-t border-border">
              {(skill.tags ?? []).map(t => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{t}</span>
              ))}
            </div>
            {/* Course / Video / Notes links */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <a href={skill.learnUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all">
                <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Course
              </a>
              {skill.videoUrl && (
                <a href={skill.videoUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 transition-all">
                  <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  Video
                </a>
              )}
              {skill.notesUrl && (
                <a href={skill.notesUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 transition-all">
                  <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  Notes
                </a>
              )}
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
  const [hubTab, setHubTab] = useState<"drives" | "roadmap">("roadmap")
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

  // Navigate to Smart Resume section when arriving via #smart-resume hash
  useEffect(() => {
    if (!year) return
    if (typeof window === "undefined") return
    if (window.location.hash !== "#smart-resume") return
    const sections = yearContent[year]?.sections ?? []
    const idx = sections.findIndex(s => s.id === "smart-resume")
    if (idx !== -1) {
      setHubTab("roadmap")
      setActiveSection(idx)
      // Small delay so the section renders before scrolling
      setTimeout(() => {
        document.getElementById("smart-resume")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 200)
    }
  }, [year])

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
      {/* Top-level tab: Drives | Roadmap — hidden for 1st year */}
      {year !== 1 && (
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
      )}

      {/* DRIVES TAB · on-campus + off-campus — not shown for 1st year */}
      {hubTab === "drives" && year !== 1 && (
        <StudentDrivesInline student={student} />
      )}

      {/* ROADMAP TAB · existing career hub content */}
      {hubTab === "roadmap" && (
      <div className="space-y-4">

      {/* Banner */}
      <div className={`rounded-xl border border-white/10 bg-gradient-to-r ${content.color} p-5 text-white`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{content.emoji}</span>
          <div>
            <p className="font-semibold text-base">{content.label} &mdash; {content.tagline}</p>
            <p className="text-white/70 text-xs mt-0.5">
              {graduationYear
                ? `Graduating ${graduationYear} · Year ${year} detected automatically`
                : "Set your graduation year in profile for personalised content"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 mt-3 border-t border-white/10 pt-3 overflow-x-auto">
          {content.sections.map((s, i) => (
            <button key={s.id} onClick={() => setActiveSection(i)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeSection === i ? "bg-white/20 text-white" : "text-white/60 hover:text-white hover:bg-white/10"}`}>
              {s.icon}
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isSmartResumeSection ? (
        <div id="smart-resume">
          <SmartResume />
        </div>
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
                  <p className="text-xs font-medium text-muted-foreground">Posted by Recruiters on this Platform</p>
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
            const isOnCampusItem  = item.label.includes("On-Campus")
            const isOffCampusItem = item.label.includes("Off-Campus")
            const cleanLabel = item.label
              .replace(/^[]\s*/, "")
              .replace(/^On-Campus\s*[-]\s*/i, "")
              .replace(/^Off-Campus\s*[-]\s*/i, "")
            return (
              <div key={item.label} className={`rounded-xl bg-card border flex flex-col gap-2.5 p-4 ${
                isOnCampusItem ? "border-l-4 border-l-emerald-500 border-border" :
                isOffCampusItem ? "border-l-4 border-l-blue-500 border-border" :
                "border-border"}`}>
                <div className="flex items-start gap-2">
                  {isOnCampusItem && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">On-Campus</span>}
                  {isOffCampusItem && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">Off-Campus</span>}
                  <p className="text-base font-semibold">{cleanLabel}</p>
                </div>
                {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                {item.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">{tag}</Badge>)}
                  </div>
                )}
                {item.links && (
                  <div className="flex flex-wrap gap-2 pt-2 mt-auto border-t border-border/50">
                    {item.links.map(link => {
                      const isYT    = link.type === "youtube" || link.url.includes("youtube.com") || link.url.includes("youtu.be")
                      const isNotes = link.type === "notes" || link.text.toLowerCase().includes("note") || link.text.toLowerCase().includes("cheat") || link.text.toLowerCase().includes("sheet")
                      const isPrac  = link.type === "practice"

                      const logo = isYT ? (
                        // YouTube logo SVG
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="#FF0000">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      ) : isNotes ? (
                        // Notes icon SVG
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14,2 14,8 20,8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                          <polyline points="10,9 9,9 8,9"/>
                        </svg>
                      ) : isPrac ? (
                        // Code icon
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="16,18 22,12 16,6"/>
                          <polyline points="8,6 2,12 8,18"/>
                        </svg>
                      ) : (
                        // External link icon
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15,3 21,3 21,9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      )

                      const btnColor = isYT
                        ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                        : isNotes
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20"
                        : isPrac
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                        : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"

                      return (
                        <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${btnColor}`}>
                          {logo}
                          {link.text}
                        </a>
                      )
                    })}
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
  const [driveTab, setDriveTab]      = useState<"campus" | "offcampus" | "mine">("campus")

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

  // Live jobs section rendered inside on-campus / off-campus tabs
  function LiveJobsList({ jobs, type }: { jobs: any[]; type: "on" | "off" }) {
    const live = jobs.filter(j => !j.deadline || new Date(j.deadline) >= new Date())
    if (live.length === 0) return null
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 pt-1">
          <Briefcase className="h-3.5 w-3.5" />
          Live Jobs {type === "on" ? "from your College" : "from Recruiters"}
          <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">{live.length}</span>
        </p>
        {live.map((job: any) => (
          <div key={job._id} className={`rounded-xl border bg-card p-4 flex items-start gap-3 hover:border-primary/20 transition-all ${
            type === "on" ? "border-emerald-500/15" : "border-blue-500/15"
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 ${
              type === "on" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
            }`}>
              {job.companyName?.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-sm">{job.title}</p>
              <p className="text-xs text-primary">{job.companyName} · {job.type} · {job.location}</p>
              {job.salary && <p className="text-xs text-muted-foreground mt-0.5">{job.salary}</p>}
            </div>
            <a href="/student/jobs"
              className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                type === "on"
                  ? "border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/5"
                  : "border-blue-500/30 text-blue-600 hover:bg-blue-500/5"
              }`}>
              Apply †’
            </a>
          </div>
        ))}
      </div>
    )
  }

  function DrivesList({ list, campus }: { list: any[]; campus: boolean }) {
    if (list.length === 0 && (campus ? onCampusJobs : offCampusJobs).filter(j => !j.deadline || new Date(j.deadline) >= new Date()).length === 0)
      return (
        <div className="text-center py-14 rounded-2xl border border-dashed border-border">
          <Building2 className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">
            {campus ? "No on-campus drives from your college yet" : "No off-campus drives available"}
          </p>
        </div>
      )
    return (
      <div className="space-y-4">
        {list.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" />
              {campus ? "On-Campus Hiring Drives" : "Off-Campus Hiring Drives"}
              <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">{list.length}</span>
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((drive: any) => {
                const isApplied = applied.has(drive._id)
                const deadline  = drive.applicationDeadline ? new Date(drive.applicationDeadline) : null
                const past      = deadline && deadline < new Date()
                return (
                  <div key={drive._id} className={`rounded-xl border bg-card p-4 flex flex-col gap-3 hover:border-primary/20 transition-all ${campus ? "border-emerald-500/15" : "border-border"}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                        {drive.companyName?.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-sm truncate">{drive.title}</p>
                        <p className="text-xs text-primary truncate">{drive.companyName}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                      <span>{drive.type} &middot; {drive.location}</span>
                      {drive.salary && <span className="font-medium text-foreground">{drive.salary}</span>}
                      {deadline && <span className={past ? "text-red-500" : ""}>{past ? "Closed" : `Due ${deadline.toLocaleDateString()}`}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                      {drive.status === "assessment" && isApplied ? (
                        <a href={`/student/assessment/${drive._id}`} className="text-[10px] font-bold text-violet-500 hover:underline flex items-center gap-1">
                          <FileText className="h-3 w-3" />Take Test
                        </a>
                      ) : <span />}
                      {isApplied
                        ? <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Applied</span>
                        : !past && drive.status === "active"
                        ? <button onClick={() => applyToDrive(drive._id)} disabled={applying === drive._id}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1">
                            {applying === drive._id ? <Loader2 className="h-3 w-3 animate-spin" /> : null}Apply
                          </button>
                        : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        <LiveJobsList jobs={campus ? onCampusJobs : offCampusJobs} type={campus ? "on" : "off"} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Tab switcher €” removed "Live Jobs", kept On-Campus / Off-Campus / My Applications */}
      <div className="flex gap-1 border-b border-border pb-px">
        {[
          { id: "campus",    label: `On-Campus (${campusDrives.length + onCampusJobs.filter(j => !j.deadline || new Date(j.deadline) >= new Date()).length})` },
          { id: "offcampus", label: `Off-Campus (${offDrives.length + offCampusJobs.filter(j => !j.deadline || new Date(j.deadline) >= new Date()).length})` },
          { id: "mine",      label: `My Applications (${myDrives.length})` },
        ].map(t => (
          <button key={t.id} onClick={() => setDriveTab(t.id as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-all ${
              driveTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}

      {/* On-Campus: drives + on-campus live jobs */}
      {!loading && driveTab === "campus" && <DrivesList list={campusDrives} campus={true} />}

      {/* Off-Campus: drives + off-campus live jobs */}
      {!loading && driveTab === "offcampus" && <DrivesList list={offDrives} campus={false} />}

      {/* My Applications */}
      {!loading && driveTab === "mine" && (
        myDrives.length === 0
          ? <div className="text-center py-16 rounded-2xl border border-dashed border-border">
              <Briefcase className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-foreground font-semibold">No applications yet</p>
              <p className="text-xs text-muted-foreground mt-1">Apply to a drive to track your status here</p>
            </div>
          : <div className="space-y-3">
              {myDrives.map((d: any) => (
                <div key={d._id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                    {d.companyName?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-sm">{d.title}</p>
                    <p className="text-xs text-primary">{d.companyName} · {d.type}</p>
                    {d.assessmentScore != null && (
                      <p className="text-xs mt-1 text-violet-500 font-bold">
                        Score: {d.assessmentScore}%{d.assessmentRank ? ` · Rank #${d.assessmentRank}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      d.myStatus === "shortlisted" ? "bg-emerald-500/10 text-emerald-500" :
                      d.myStatus === "rejected"    ? "bg-red-500/10 text-red-500" :
                      d.myStatus === "offer_sent"  ? "bg-amber-500/10 text-amber-500" :
                      d.myStatus === "hired"       ? "bg-violet-500/10 text-violet-500" :
                                                     "bg-blue-500/10 text-blue-500"}`}>
                      {d.myStatus === "applied"      ? "Applied" :
                       d.myStatus === "shortlisted"  ? "Shortlisted" :
                       d.myStatus === "rejected"     ? "Not Selected" :
                       d.myStatus === "offer_sent"   ? "Offer Sent" :
                       d.myStatus === "hired"        ? "Selected!" :
                       d.myStatus}
                    </span>
                    {d.status === "assessment" && d.assessmentId && d.myStatus === "applied" && (
                      <a href={`/student/assessment/${d._id}`}
                        className="text-[10px] text-violet-500 hover:underline font-bold flex items-center gap-0.5">
                        <FileText className="h-3 w-3" />Take Assessment
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
      )}
    </div>
  )
}

