# CodeHiring — Campus Placement & Career Platform

An AI-powered platform connecting students, colleges, and recruiters for campus placements, career development, and skill building.

Live: **https://codehiring.vercel.app**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Database | MongoDB Atlas |
| Auth | Custom JWT + session cookies |
| AI — Primary | Groq `qwen/qwen3.6-27b` |
| AI — Fallback | OpenAI `gpt-4o-mini` |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| Code Execution | Self-hosted Docker executor (Render.com) |
| Styling | Tailwind CSS v4 + Radix UI + shadcn/ui |
| Email | Gmail SMTP (App Password / Nodemailer) |
| Charts | Recharts |
| Deployment | Vercel |

---

## User Roles

| Role | Portal | Description |
|---|---|---|
| Student | `/student/*` | Practice, placements, AI tools |
| College | `/college/*` | Drive management, student analytics |
| Recruiter | `/recruiter/*` | Job postings, candidate search, AI copilot |
| Admin | `/admin/*` | Platform config, blog, user management |

---

## Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://...

# Auth
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# AI Providers
GROQ_API_KEY=gsk_...          # Primary AI — free at console.groq.com
OPENAI_API_KEY=sk-...          # Fallback AI

# Email (Gmail SMTP)
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=...         # Google App Password

# Code Execution Engine
EXECUTOR_URL=https://your-executor.onrender.com
EXECUTOR_SECRET=your_secret

# Optional
MISTRAL_API_KEY=...            # Legacy code evaluation
GOOGLE_SEARCH_CX=...           # Company pattern web search
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Fill in MONGODB_URI, GROQ_API_KEY, GMAIL_*, EXECUTOR_URL

# 3. Start dev server
npm run dev
# → http://localhost:3000
```

---

## Student Portal

```
/student/
├── dashboard        — Stats, XP, activity heatmap, platform sync overview
├── learn            — Year-based learning hub (1st year hub / career hub)
├── practice/        — Practice hub: Aptitude · Coding/DSA · Communication
│   ├── aptitude     — Quant, Logical Reasoning, Data Interpretation (200+ Qs)
│   └── communication— Grammar, Vocabulary, RC, Para Jumbles, AI Voice Coach (900+ Qs)
├── problems/        — 750+ DSA problems, topic sidebar, search, difficulty filter
│   └── [slug]/      — Full Monaco IDE per problem with run/submit + test cases
├── prep             — Company mock assessments: 189+ companies, AI-pattern OA simulation
├── ai               — AI Insights: skill gaps, strengths, placement readiness score
├── analytics        — Charts: activity, topic breakdown, platform stats, skill radar
├── leaderboard      — College + global rankings by XP
├── drives           — Campus placement drives (on/off campus)
├── jobs             — Off-campus job listings
├── platforms        — Link LeetCode, GitHub, CodeChef, GFG, Codeforces, HackerRank
├── profile          — Edit profile, skills, graduation year, open-to-work toggle
├── resume           — Smart Resume builder with AI enhancement
├── assessment/      — Proctored drive assessments (camera, tab-switch detection)
└── daily-challenge  — AI-generated daily coding problem with Monaco editor
```

---

## Learn Page — Year-Based Architecture

```
Year 1  → FirstYearFullHub
  Tabs:
  ├── My Progress    — XP, streak counter, 7 platform badges
  ├── Practice       — Links to /practice (Aptitude / Coding / Communication)
  ├── Challenges
  │   ├── Topic Coding Problems  — 750+ DSA problems grouped by topic
  │   ├── Debug Challenges       — AI-generated "find the bug" (15 languages)
  │   └── Daily Challenge        — 1 AI problem/day, Monaco editor + auto-eval
  ├── Soft Skills    — Communication & mindset bite-sized modules
  └── Community      — Discussion board (posts, replies, upvotes)

Years 2–4 → CareerHub
  Year 2: Practice nav · Placement Tools
  Year 3: Placement Tools · DSA & Interview · Smart Resume
  Year 4: AI-Powered Prep · Smart Resume
  All years: Hiring Drives tab (on/off campus listings)
```

---

## Coding Practice System

### Problem Library (`/student/problems`)
- 750+ problems from `lib/topic-questions.ts` — 24 topics, 6 modules each
- Filterable by topic, difficulty (Easy / Medium / Hard), search, bookmarks
- Company tags (Amazon, Google, Microsoft etc.) on popular problems
- Solved/unsaved state persisted in `localStorage`

### Problem Editor (`/student/problems/[slug]`)
- Full Monaco IDE with 10 languages (Python, JS, TS, Java, C++, C, C#, Go, Kotlin, Swift)
- 3 color themes: Dark, Light, Monokai
- Resizable left panel (description) + right panel (editor + console)
- Run mode: 2 public test cases · Submit mode: up to 5 test cases (2 public + 3 hidden)
- Problem data: static bank → MongoDB cache → AI generation (Groq → OpenAI)
- Test cases: stdin/stdout format, executed via remote Docker executor

### Company Assessment Prep (`/student/prep`)
- 189+ companies with live exam patterns (fetched via RAG + web search)
- Sections: Quantitative · Logical · Verbal · Basic Coding · Advanced Coding
- AI generates company-specific MCQ questions on demand (Groq → OpenAI)
- Full coding section uses the Monaco IDE per question
- Post-test: AI Hiring Report (readiness score, section breakdown, weak topics)
- Proctored shell: tab-switch detection, fullscreen enforcement
- Assessment history saved to MongoDB

---

## AI Features

### AI Insights (`/student/ai`)
- Analyses linked platform stats + profile
- Returns: overall assessment, strengths, improvement areas, skill gaps, placement readiness %
- Powered by Groq `qwen/qwen3.6-27b` → fallback OpenAI `gpt-4o-mini`

### AI Chat
- Contextual career advisor chatbot
- Knows student's profile, platforms, and history

### AI Voice Coach (`/student/practice/communication`)
- Real-time spoken English feedback
- Powered by Groq audio/speech API

### Code Evaluation
- Student code submitted to self-hosted executor (Docker on Render.com)
- Supports 10 languages with per-language timeouts
- stdin/stdout test case format — no LeetCode-style function signatures

### AI Hiring Report
- Generated after every company mock assessment
- Includes: verdict, selection probability, topic-wise scores, recommended actions

### Debug Challenges
- AI-generated buggy code snippets in 15 languages
- Groq generates bug + correct answer + explanation

---

## AI Provider Chain

```
Feature                     Primary              Fallback
──────────────────────────────────────────────────────────
AI Insights                 Groq qwen3.6-27b     OpenAI gpt-4o-mini
Assessment generation       Groq qwen3.6-27b     OpenAI gpt-4o-mini
Company coding questions     Groq qwen3.6-27b     OpenAI gpt-4o-mini
Problem detail generation   Groq qwen3.6-27b     OpenAI gpt-4o-mini
Debug challenges            Groq qwen3.6-27b     OpenAI gpt-4o-mini
Hiring report               Groq qwen3.6-27b     OpenAI gpt-4o-mini
Daily problem               Groq gpt-4o-mini     Static pool (30 problems)
Resume AI                   Groq qwen3.6-27b     —
AI Chat                     Groq qwen3.6-27b     —
Voice Coach                 Groq qwen3.6-27b     —
```

---

## API Routes

```
/api/auth/*
  login, signup, logout, google, send-otp, verify-otp,
  verify-email, forgot-password, reset-password, user

/api/student/*
  ai-insights, ai-chat, analytics, activity,
  aptitude-questions, assessment-history, assessment-leaderboard,
  badge-try, campus-jobs, community, company-assessment-pattern,
  company-coding-ai, daily-problem, debug-challenges, discussions,
  evaluate-code, first-year-leaderboard, first-year-progress,
  generate-assessment, hiring-report, jobs, leaderboard,
  link-platform, monthly-stats, my-drives, problem-detail,
  profile, project-challenges, ranking, reset-progress,
  resume-ai, resume-download, resume-upload, run-code,
  scrape-questions, smart-resume, submit-pyq, sync-stats, voice-coach

/api/college/*
  dashboard, students, announcements, jobs, analytics

/api/recruiter/*
  dashboard, analytics, jobs, search, match, shortlists,
  students, copilot

/api/drives/*
  list, [id]: apply, assessment, evaluate, interview,
  notify, offer, shortlist, submit, verify

/api/admin/*
  blog, careers, clear-problem-cache, dashboard, drives,
  feedback, pyq, refresh-patterns, scrape-pyq,
  seed-pattern-embeddings, seed-problems, seed-rag,
  site-config, user-details

/api/public/*
  blog, careers, colleges, drives, profile, recruiters,
  stats, students

/api/platforms/*
  link, route, search, sync, verify

/api/analytics      — page-view tracking
/api/feedback       — user feedback
/api/health         — uptime check
/api/landing        — landing page stats
/api/notifications  — bell notifications + read
/api/cron/generate-blog — scheduled blog post generation
```

---

## MongoDB Collections

| Collection | Purpose |
|---|---|
| `users` | All accounts — students, colleges, recruiters |
| `first_year_progress` | XP, streak, badges, completed challenges |
| `debug_challenges` | Cached AI debug challenges per user |
| `project_challenges` | Cached AI project challenges per user |
| `daily_problems` | Today's AI problem (cached by date key) |
| `problem_details_v8` | AI-generated problem details cache (stdin/stdout format) |
| `company_problems` | 18,900+ seeded company-specific coding problems |
| `pattern_embeddings` | RAG embeddings for company exam patterns |
| `discussions` | Community posts, replies, upvotes |
| `assessment_history` | Mock test scores + section breakdowns |
| `drives` | Campus placement drives |
| `jobs` | Off-campus job listings |
| `analytics` | Page-view events |
| `feedback` | User feedback submissions |
| `notifications` | Per-user bell notifications |

---

## Key Libraries

```
lib/
├── topic-questions.ts     — 750+ DSA problems (24 topics × 6 modules × 5 questions)
├── problem-bank.ts        — Static detailed problem bank (stdin/stdout test cases)
├── companies-data.ts      — 189+ companies with category, roles, sections
├── question-bank.ts       — MCQ bank for aptitude/verbal/logical
├── communication-bank.ts  — 900+ verbal/communication MCQs
├── quantitative-reasoning.ts — Quantitative aptitude question pool
├── logical-reasoning-bank.ts — Logical reasoning question pool
├── fintech-problem-bank.ts   — Fintech company coding problems (RAG)
├── service-company-problems.ts — IT service company problems (RAG)
├── groq.ts                — Groq API wrapper
├── openai.ts              — OpenAI API wrapper
├── auth.ts                — JWT session management
├── database.ts            — MongoDB connection
├── email.ts               — Gmail SMTP via Nodemailer
├── question-gen/          — QGen pipeline: LLM caller + formatters
├── coding-model/          — Company coding profile + prompt builder
└── rag/                   — Company pattern RAG + embeddings
```

---

## College Code

Every student enters a **college code** at signup. This powers:
- College-specific leaderboards and XP rankings
- Campus drive filtering (only relevant drives shown)
- College analytics dashboard (placement stats, avg scores)
- Student performance reports for placement cells

---

## Deployment Notes

- **Vercel** — zero-config Next.js deployment
- **MongoDB Atlas** — shared cluster, `codetrack` database
- **Code Executor** — self-hosted on Render.com (`EXECUTOR_URL`)
  - Runs a Node.js Docker server that executes student code in isolated containers
  - Supports Python, JavaScript, TypeScript, Java, C++, C, C#, Go, Kotlin, Swift
  - Set `EXECUTOR_SECRET` to match the server's bearer token
- **Groq** — free tier, ~500 tokens/sec on `qwen/qwen3.6-27b`
- **Cron** — `/api/cron/generate-blog` runs daily (configure via Vercel cron)
