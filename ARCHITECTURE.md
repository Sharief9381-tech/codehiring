# CodeHiring — Architecture & Workflow

## Overview

CodeHiring is a full-stack campus hiring platform connecting students, colleges, and recruiters. It provides AI-powered placement preparation, real company assessments, coding practice, job tracking, and hiring management.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| Backend | Next.js API Routes (serverless) |
| Database | MongoDB Atlas (via native driver) |
| Authentication | Custom JWT + session model |
| AI | OpenAI GPT-4o-mini (primary), Groq LLaMA-3.3-70B (fallback) |
| Code Execution | Docker sandbox (code-executor service) |
| Email | Gmail SMTP (port 465, SSL) |
| Deployment | Vercel |

---

## Directory Structure

```
codehiring/
├── app/                          # Next.js App Router
│   ├── api/                      # All backend API routes
│   │   ├── admin/                # Admin-only endpoints
│   │   │   └── seed-problems/    # Seeds 18,900 AI problems to MongoDB
│   │   ├── auth/                 # Login, signup, OTP, email verify
│   │   ├── college/              # College portal APIs
│   │   ├── recruiter/            # Recruiter portal APIs
│   │   ├── student/              # Student feature APIs
│   │   │   ├── generate-assessment/   # MCQ + coding assessment generator
│   │   │   ├── company-coding-ai/     # CodeHiring coding model
│   │   │   ├── run-code/              # Code execution sandbox
│   │   │   ├── first-year-progress/   # XP + badge tracking
│   │   │   └── ...
│   │   └── public/               # Public endpoints (no auth)
│   ├── student/                  # Student pages
│   │   ├── dashboard/            # Student home
│   │   ├── learn/                # Year-based learning hub
│   │   ├── practice/             # Practice landing (Apt/DSA/Comm)
│   │   ├── problems/             # Coding problem list + editor
│   │   ├── prep/                 # Company prep track
│   │   └── ...
│   ├── college/                  # College portal pages
│   ├── recruiter/                # Recruiter portal pages
│   └── admin/                   # Admin panel
├── components/
│   ├── dashboard/sidebar.tsx     # Global nav with Practice flyout
│   ├── student/
│   │   ├── first-year-full-hub.tsx   # Year 1-2 gamified learning hub
│   │   ├── career-hub.tsx            # Year 3-4 career prep hub
│   │   └── problem-editor.tsx        # Monaco code editor
│   └── ...
├── lib/
│   ├── coding-model/
│   │   ├── company-profiles.ts   # Per-company OA section definitions
│   │   └── generator.ts          # Pattern templates + prompt builder
│   ├── models/
│   │   ├── user.ts               # User schema (student/college/recruiter)
│   │   ├── company-problem.ts    # 18,900-problem MongoDB collection
│   │   └── ...
│   ├── companies-data.ts         # 189 companies with sections config
│   ├── topic-questions.ts        # 750 curated problems (25 topics)
│   ├── service-company-problems.ts   # 105 IT service company problems
│   ├── fintech-problem-bank.ts   # 225 FinTech/Quant problems
│   ├── it-services-problems.ts   # Extended IT services problems
│   └── question-bank.ts          # PYQ bank for aptitude generation
└── seed-problems.mjs             # Local script to seed MongoDB
```

---

## User Roles & Portals

```
┌─────────────────────────────────────────────────────────┐
│                      CodeHiring                         │
├──────────────┬──────────────────┬───────────────────────┤
│   STUDENT    │     COLLEGE      │      RECRUITER        │
│              │                  │                       │
│ Dashboard    │ Student Mgmt     │ Drive Management      │
│ Practice Hub │ Drive Creation   │ Talent Search         │
│ Prep Track   │ Analytics        │ Shortlisting          │
│ Problems     │ Announcements    │ Job Postings          │
│ Platforms    │ Placement Report │ Analytics             │
│ AI Insights  │ College Website  │ AI Copilot            │
└──────────────┴──────────────────┴───────────────────────┘
```

---

## Student Year-Based Experience

```
Year 1 & 2  →  FirstYearFullHub  (gamified, XP, badges, topic practice)
Year 3 & 4  →  CareerHub         (company prep, job tracking, drives)

All Years   →  Practice Nav Flyout:
                ├── Aptitude      → /student/prep?track=aptitude
                ├── Coding/DSA    → /student/problems  (750+ problems)
                └── Communication → /student/prep?track=communication
```

---

## Assessment Generation Pipeline

When a student takes a company test (e.g., TCS):

```
Student selects company
        │
        ▼
POST /api/student/generate-assessment
{ company: "tcs", section: "basic-coding", count: 1 }
        │
        ├─── Coding sections ──────────────────────────────────────┐
        │                                                           │
        │    POST /api/student/company-coding-ai                    │
        │    { company: "tcs", section: "basic-coding" }            │
        │              │                                            │
        │    Step 1: Check MongoDB (18,900 pre-seeded problems)     │
        │              │ found → return instantly (sub-100ms)       │
        │              │ not found ↓                                │
        │    Step 2: Load company profile (company-profiles.ts)     │
        │              TCS basic-coding = Easy, loops/arrays only   │
        │              │                                            │
        │    Step 3: RAG context from static banks                  │
        │              (service/fintech problems as examples)        │
        │              │                                            │
        │    Step 4: Groq AI generates problem                      │
        │              using company profile + RAG context          │
        │              │                                            │
        │    Step 5: Cache result to MongoDB                        │
        │              └─────────────────────────────────────────── ┘
        │
        └─── Aptitude sections ─────────────────────────────────────
             Web scrape → Groq AI with PYQ context → Static fallback
```

---

## CodeHiring Coding Model

The platform's own model for generating company-authentic coding problems.

```
lib/coding-model/company-profiles.ts
├── 26 explicit company profiles (TCS, Amazon, Google, Infosys...)
│   Each defines:
│   ├── sections (basic-coding, advanced-coding)
│   ├── difficulty per section
│   ├── allowed patterns (Arrays, DP, Graphs...)
│   ├── forbidden patterns (e.g., TCS basic = no DP/Trees)
│   ├── constraint sizes
│   ├── style rules (e.g., "max 100 words", "Amazon context")
│   └── real exam notes
└── 9 category fallbacks (IT Services, Product, BFSI, Consulting...)
    Auto-applied for remaining 163 companies

lib/coding-model/generator.ts
├── 16 pattern templates (Array Traversal, Binary Search, DP...)
├── buildModelPrompt() — structured prompt from profile
├── selectBatchPatterns() — ensures variety across 100 problems
└── formatRAGExamples() — formats static bank examples for context
```

---

## Problem Banks (Static)

| Bank | Companies | Problems |
|---|---|---|
| `service-company-problems.ts` | TCS, Infosys, Wipro, Cognizant, Accenture, HCL, TechMahindra | 105 |
| `fintech-problem-bank.ts` | Stripe, Block, PayPal, Plaid, Robinhood, Coinbase, Affirm, Brex, Jane Street, Citadel, Two Sigma, HRT, Jump, D.E. Shaw, Bloomberg | 225 |
| `it-services-problems.ts` | Capgemini, Mphasis, Hexaware, LTIMindtree, Zensar, Persistent, Cyient, Birlasoft, Sonata | ~900 |
| `topic-questions.ts` | All (DSA practice) | 750 |
| **MongoDB** (`company_problems`) | All 189 companies | 18,900 (AI-generated) |

---

## MongoDB Collections

| Collection | Purpose |
|---|---|
| `users` | All users (student/college/recruiter/admin) |
| `sessions` | Auth sessions |
| `company_problems` | 18,900 AI-generated coding problems |
| `drives` | Hiring drives created by recruiters/colleges |
| `assessments` | Drive assessment configs + submissions |
| `notifications` | In-app notifications |
| `blogs` | AI-generated blog posts |
| `site-config` | Platform-wide settings |

---

## 189 Company Assessment Sections

Sections are defined per company in `lib/companies-data.ts`:

| Company Category | Sections |
|---|---|
| IT Services (TCS, Infosys, etc.) | quantitative → advanced-aptitude → basic-coding → advanced-coding |
| Product (Amazon, Google, etc.) | basic-coding → advanced-coding |
| Consulting (Deloitte, McKinsey) | quantitative → advanced-aptitude → verbal |
| BFSI with coding (JPMorgan, Goldman) | quantitative → advanced-aptitude → basic-coding → advanced-coding |
| BFSI banks (ICICI, HDFC, SBI) | quantitative → advanced-aptitude → verbal |
| Core Engineering (BHEL, NTPC) | quantitative → advanced-aptitude → verbal |
| Core Engg with coding (Bosch, Siemens) | quantitative → advanced-aptitude → basic-coding → advanced-coding |
| Defence/FMCG/Pharma | quantitative → advanced-aptitude → verbal |

---

## Authentication Flow

```
Signup/Login
    │
    ├── Email + Password
    │       └── bcrypt hash → MongoDB users collection
    │           JWT session token → cookie (httpOnly)
    │
    ├── Google OAuth
    │       └── OAuth callback → upsert user → session
    │
    └── OTP Verification
            └── Gmail SMTP (port 465) → 6-digit OTP → verify
```

---

## Code Execution

```
Student submits code
        │
        ▼
POST /api/student/run-code
        │
        ▼
code-executor service (Docker)
        ├── Python: subprocess + timeout
        ├── JavaScript: Node.js subprocess
        ├── Java: compile + run
        └── C++: g++ compile + run
        │
        ▼
Return: stdout, stderr, execution time
```

---

## Seeding 18,900 Problems

```bash
# Start dev server
cd codehiring && npm run dev

# In another terminal — seeds all 189 companies
node seed-problems.mjs

# Check progress
node seed-problems.mjs --check

# Resume from company 50
node seed-problems.mjs --start=50

# Seed specific companies only
node seed-problems.mjs --only=amazon,google,tcs
```

Each company gets 100 problems across 10 batches × 10 problems.
Groq generates problems using the company profile + industry context.
Rate: ~2.5s per company → ~8 hours for all 189.

---

## Environment Variables

```env
MONGODB_URI          # MongoDB Atlas connection string
NEXTAUTH_SECRET      # JWT signing secret / seed auth token
GROQ_API_KEY         # Groq AI (free tier) — primary AI provider
OPENAI_API_KEY       # OpenAI (optional) — premium AI provider
GMAIL_USER           # Gmail address for OTP/verification emails
GMAIL_PASS           # Gmail app password (not account password)
NEXTAUTH_URL         # Deployed URL (https://codehiring.com)
SEED_SECRET          # Auth token for /api/admin/seed-problems
```

---

## Key Workflows

### Student Placement Prep (Year 3-4)
1. Student opens **Prep Track** from nav
2. Sees 189 company cards filtered by category
3. Clicks TCS → sees Section 1/4 (Quantitative)
4. AI generates 15 MCQ questions matching TCS NQT patterns
5. Completes all 4 sections → gets AI hiring report
6. Report saved to assessment history

### Coding Practice (All Years)
1. Click **Practice** → dropdown shows Aptitude / Coding / Communication
2. **Coding** → `/student/problems` — 750 problems filterable by topic/difficulty
3. Select problem → Monaco editor opens
4. Write code → Run (Docker sandbox) → Submit
5. Progress saved to `localStorage` + MongoDB

### College Hiring Drive
1. College admin creates drive with JD, eligibility, date
2. Students apply from drives page
3. Recruiter adds coding assessment to drive
4. Students take proctored assessment
5. Recruiter shortlists → sends offers
6. College gets placement report

---

## API Route Summary

| Prefix | Handler |
|---|---|
| `/api/auth/*` | Login, signup, OTP, email verification, password reset |
| `/api/student/*` | All student features (assessments, coding, platforms, AI) |
| `/api/college/*` | College portal (students, drives, announcements) |
| `/api/recruiter/*` | Recruiter portal (drives, search, shortlists, jobs) |
| `/api/admin/*` | Admin panel + problem seeder |
| `/api/public/*` | Public data (no auth) — stats, profiles, colleges |
| `/api/drives/*` | Drive management shared by college + recruiter |
