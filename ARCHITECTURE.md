# CodeHiring — System Architecture

---

## High-Level System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CODEHIRING PLATFORM                            │
│                          AI-Powered Campus Hiring                           │
└─────────────────────────────────────────────────────────────────────────────┘

        ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
        │   STUDENT    │    │   COLLEGE    │    │  RECRUITER   │
        │  (Browser)   │    │  (Browser)   │    │  (Browser)   │
        └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
               │                   │                    │
               └─────────────────┬─┘────────────────────┘
                                  │  HTTPS
                                  ▼
                    ┌─────────────────────────┐
                    │      NEXT.JS APP         │
                    │   (Vercel Edge/SSR)      │
                    │                         │
                    │  ┌───────┐ ┌─────────┐  │
                    │  │ Pages │ │  API    │  │
                    │  │ (RSC) │ │ Routes  │  │
                    │  └───────┘ └────┬────┘  │
                    └─────────────────┼────────┘
                                      │
              ┌───────────────────────┼─────────────────────────┐
              │                       │                         │
              ▼                       ▼                         ▼
  ┌───────────────────┐  ┌────────────────────┐  ┌─────────────────────┐
  │   MONGODB ATLAS   │  │     GROQ / OPENAI  │  │   CODE EXECUTOR     │
  │                   │  │                    │  │   (Docker Sandbox)  │
  │  users            │  │  LLaMA-3.3-70B     │  │                     │
  │  drives           │  │  GPT-4o-mini       │  │  Python / JS        │
  │  assessments      │  │                    │  │  Java / C++         │
  │  company_problems │  │  Assessment Gen    │  │  Timeout + Isolate  │
  │  blogs            │  │  Hiring Reports    │  │                     │
  │  sessions         │  │  Blog Writing      │  └─────────────────────┘
  │  notifications    │  │  AI Insights       │
  └───────────────────┘  └────────────────────┘
              │
              ▼
  ┌───────────────────┐
  │   GMAIL SMTP      │
  │  (Port 465 SSL)   │
  │                   │
  │  OTP emails       │
  │  Verification     │
  │  Offer letters    │
  └───────────────────┘
```

---

## Application Layer

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          NEXT.JS APP ROUTER                                 │
├──────────────────────┬──────────────────────┬──────────────────────────────┤
│    STUDENT PORTAL    │   COLLEGE PORTAL     │    RECRUITER PORTAL          │
│                      │                      │                              │
│  /student/dashboard  │  /college/dashboard  │  /recruiter/dashboard        │
│  /student/learn      │  /college/students   │  /recruiter/search           │
│  /student/practice   │  /college/drives     │  /recruiter/drives           │
│  /student/problems   │  /college/reports    │  /recruiter/jobs             │
│  /student/prep       │  /college/analytics  │  /recruiter/shortlists       │
│  /student/drives     │                      │  /recruiter/analytics        │
│  /student/jobs       │                      │                              │
│  /student/ai         │                      │                              │
├──────────────────────┴──────────────────────┴──────────────────────────────┤
│                          PUBLIC PAGES                                       │
│  /  /login  /signup  /blog  /explore  /about  /careers                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## API Routes Structure

```
/api
 ├── auth/
 │    ├── login              POST  → JWT session + cookie
 │    ├── signup             POST  → create user + send OTP
 │    ├── verify-email       POST  → verify OTP → activate
 │    ├── logout             POST  → clear session
 │    ├── google             GET   → OAuth callback
 │    ├── forgot-password    POST  → send reset link
 │    ├── reset-password     POST  → update password
 │    └── user               GET   → current user
 │
 ├── student/
 │    ├── generate-assessment   POST  → MCQ + coding questions
 │    ├── company-coding-ai     POST  → CodeHiring coding model
 │    ├── run-code              POST  → Docker sandbox execution
 │    ├── first-year-progress   GET   → XP, badges, streaks
 │    ├── badge-try             POST  → mark solved, award XP
 │    ├── ai-insights           GET   → personalized AI career advice
 │    ├── hiring-report         POST  → AI post-assessment report
 │    ├── platforms/sync        POST  → sync LeetCode/CodeChef stats
 │    ├── leaderboard           GET   → college rankings
 │    └── ...25 more routes
 │
 ├── college/
 │    ├── dashboard          GET   → placement stats
 │    ├── students           GET   → student list + filters
 │    ├── drives             GET/POST → manage drives
 │    └── announcements      GET/POST
 │
 ├── recruiter/
 │    ├── dashboard          GET   → hiring pipeline
 │    ├── search             GET   → AI talent search
 │    ├── drives             GET/POST/PATCH
 │    ├── jobs               GET/POST
 │    └── copilot            POST  → AI recruitment assistant
 │
 ├── drives/[id]/
 │    ├── apply              POST  → student applies
 │    ├── assessment         GET/POST → drive test config
 │    ├── submit             POST  → assessment submission
 │    ├── shortlist          POST  → recruiter shortlists
 │    └── offer              POST  → send offer
 │
 ├── admin/
 │    └── seed-problems      POST/GET → seed 18,900 AI problems
 │
 └── public/
      ├── stats              GET   → platform stats (cached 1min)
      ├── colleges           GET   → college directory
      └── drives             GET   → public drive listings
```

---

## Student Experience by Year

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STUDENT YEAR-BASED ROUTING                               │
│                                                                             │
│  Graduate Year Detection:                                                   │
│  now.year - graduationYear  →  current academic year (1, 2, 3, 4)          │
└─────────────────────────────────────────────────────────────────────────────┘

 YEAR 1 & 2                          YEAR 3 & 4
 ──────────────────────               ──────────────────────
 /student/learn                       /student/prep
      │                                     │
      ▼                                     ▼
 FirstYearFullHub                    CareerHub
 ├── XP + Badges + Streak            ├── 189 Company Cards
 ├── Daily Coding Challenges         ├── Company Assessments
 ├── Topic Learning Modules          ├── AI Hiring Report
 └── Community Feed                  └── Interview Prep

 PRACTICE (All Years — Nav Flyout)
 ──────────────────────────────────
 Practice ▼
 ├── Aptitude      →  /student/prep?track=aptitude
 │                    (Quantitative, Logical, Data Interp)
 ├── Coding / DSA  →  /student/problems
 │                    (750 problems, 25 topics, Monaco editor)
 └── Communication →  /student/prep?track=communication
                       (Grammar, Vocab, Reading)
```

---

## AI Assessment Generation Pipeline

```
Student starts company test (e.g., TCS)
              │
              ▼
 ┌────────────────────────────┐
 │  TCS has 4 sections:       │
 │  1. Quantitative (15 MCQ)  │
 │  2. Advanced Aptitude (12) │
 │  3. Basic Coding (1)       │
 │  4. Advanced Coding (1)    │
 └────────────┬───────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
    ▼                   ▼
 APTITUDE            CODING
 SECTIONS            SECTIONS
    │                   │
    ▼                   ▼
 /api/student/       /api/student/
 generate-           company-
 assessment          coding-ai
    │                   │
    │           ┌───────┴────────┐
    │           │  Priority:     │
    │           │  1. MongoDB    │ ← 18,900 pre-seeded
    │           │  2. Company    │ ← lib/coding-model/
    │           │     Profile    │   company-profiles.ts
    │           │  3. RAG        │ ← static problem banks
    │           │  4. Groq AI    │ ← generate fresh
    │           │  5. Cache      │ → save to MongoDB
    │           └───────────────┘
    │
    ▼
 ┌──────────────────────────────────┐
 │  Web Scrape (PYQ patterns)       │
 │      ↓ if scrape fails           │
 │  Groq AI + PYQ context           │
 │      ↓ if AI fails               │
 │  Static fallback (question-bank) │
 └──────────────────────────────────┘
```

---

## CodeHiring Coding Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CODEHIRING CODING MODEL                                  │
│             (Own model — not generic AI prompting)                          │
└─────────────────────────────────────────────────────────────────────────────┘

lib/coding-model/
├── company-profiles.ts
│    ├── 26 explicit profiles
│    │    ┌──────────────────────────────────────────────────────────┐
│    │    │  TCS basic-coding:                                       │
│    │    │  • difficulty: Easy                                      │
│    │    │  • patterns: [Array Traversal, String Manipulation,     │
│    │    │               Basic Math, Counting, Simple Loops]        │
│    │    │  • FORBIDDEN: [DP, Trees, Graphs, Backtracking]         │
│    │    │  • constraints: n ≤ 10^4                                │
│    │    │  • style: "under 100 words, single loop sufficient"     │
│    │    └──────────────────────────────────────────────────────────┘
│    └── 9 category defaults (for remaining 163 companies)
│         IT Services, Product, BFSI, Consulting, Core Engg...
│
└── generator.ts
     ├── 16 pattern templates
     │    (Array Traversal, Binary Search, Sliding Window, DP...)
     ├── buildModelPrompt()
     │    → structured prompt from profile + RAG + templates
     ├── selectBatchPatterns()
     │    → rotates patterns for variety across 100 problems
     └── formatRAGExamples()
          → formats static bank examples as few-shot context
```

---

## Problem Bank Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROBLEM BANKS                                       │
├──────────────────────────┬──────────────────┬──────────────────────────────┤
│      STATIC BANKS        │   DYNAMIC BANK   │    PRACTICE BANK             │
│    (TypeScript files)    │   (MongoDB)      │  (topic-questions.ts)        │
├──────────────────────────┼──────────────────┼──────────────────────────────┤
│ service-company-         │                  │                              │
│  problems.ts             │ company_problems  │ 25 Topics                    │
│  7 IT companies          │ collection        │ 6 modules each               │
│  105 problems            │                  │ (2E + 2M + 2H)               │
│                          │ 18,900 problems   │ 30 problems/topic            │
│ fintech-problem-         │ 189 companies     │                              │
│  bank.ts                 │ × 100 each        │ = 750 total                  │
│  15 FinTech companies    │                  │                              │
│  225 problems            │ All AI-generated  │ LeetCode-linked              │
│                          │ by Groq           │ with XP values               │
│ it-services-problems.ts  │                  │                              │
│  9 more IT companies     │ Served via        │                              │
│  ~900 problems           │ company-coding-ai │                              │
└──────────────────────────┴──────────────────┴──────────────────────────────┘

          RAG Flow: Static Banks → AI Context → MongoDB Cache
```

---

## Authentication Architecture

```
┌──────────────┐      ┌─────────────────────────────────┐
│   Browser    │      │          API Routes              │
│              │      │                                  │
│  httpOnly    │◄────►│  /api/auth/login                 │
│  cookie      │      │  ├── bcrypt.compare()            │
│  (JWT 7d)    │      │  ├── sign JWT (NEXTAUTH_SECRET)  │
│              │      │  └── set-cookie: session=...     │
│  No JS       │      │                                  │
│  access      │      │  /api/auth/user (middleware)     │
│              │      │  ├── verify JWT                  │
│              │      │  └── return { user, role }       │
└──────────────┘      └─────────────────────────────────┘

 Roles: student | college | recruiter | admin
 Route protection: each API checks role before processing
```

---

## Hiring Drive Flow

```
  COLLEGE                  PLATFORM                STUDENT
  ───────                  ────────                ───────
  Create Drive        →    POST /api/drives     ←  See at /student/drives
  Set eligibility          Store in MongoDB        Check criteria
  Set assessment           
                      →    Drive published         Apply button appears
  
  Students apply      ←    POST .../apply      →   Apply
                           Eligibility check
                           Add to applicants
  
  Assessment window   →    Config loaded           Students take test
                           Proctored shell          (MCQ + Coding)
                           violations tracked       Time limited
  
  Results ready       ←    Auto-grade              Scores calculated
                           AI evaluate code
                           Rank candidates
  
  Shortlist           →    POST .../shortlist   →  Notification sent
                           Email via Gmail          Status updated
  
  Offer               →    POST .../offer       →  Offer letter
                           Generate PDF             Download + Accept
```

---

## Data Flow: Student Progress

```
Student solves problem
         │
         ▼
  POST /api/student/badge-try
  { challengeId, topic, difficulty }
         │
    ┌────┴──────────────────────────┐
    │  1. Add to completedChallenges│
    │  2. Award XP (+20/30/40)      │
    │  3. Update streak             │
    │  4. Check badge conditions    │
    │     - Topic Master (all done) │
    │     - Streak badges           │
    │     - Level up badges         │
    │  5. Save to MongoDB           │
    └────┬──────────────────────────┘
         │
         ▼
  Return { xp, badges, streakDays, level }
         │
         ▼
  UI updates: XP bar, badge popup, leaderboard
```

---

## Tech Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FRONTEND         Next.js 16 App Router · TypeScript · Tailwind CSS        │
│  BACKEND          Next.js API Routes (serverless) · Node.js runtime         │
│  DATABASE         MongoDB Atlas (native driver, no ORM)                     │
│  AI - Primary     Groq LLaMA-3.3-70B (free tier, fast)                     │
│  AI - Fallback    OpenAI GPT-4o-mini (paid, higher quality)                 │
│  CODE EXECUTION   Docker sandbox (code-executor/ directory)                 │
│  EMAIL            Gmail SMTP port 465 SSL (nodemailer)                      │
│  AUTH             Custom JWT + bcrypt (no NextAuth library)                 │
│  DEPLOYMENT       Vercel (serverless, edge functions)                       │
│  MONITORING       Vercel Analytics + custom /api/analytics                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

```
MONGODB_URI          MongoDB Atlas connection string
NEXTAUTH_SECRET      JWT signing key + seed API auth token
GROQ_API_KEY         Groq AI (free) — primary question generator
OPENAI_API_KEY       OpenAI (optional) — premium fallback
GMAIL_USER           Gmail address for transactional emails
GMAIL_PASS           Gmail app password (16-char, not login password)
NEXTAUTH_URL         Deployed URL  e.g. https://codehiring.vercel.app
SEED_SECRET          Auth token for /api/admin/seed-problems
```

---

> See [WORKFLOWS.md](./WORKFLOWS.md) for step-by-step user journey workflows.
