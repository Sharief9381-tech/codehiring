# CodeHiring — Workflows

Detailed step-by-step workflows for all major user journeys on the platform.

---

## 1. Student Registration & Onboarding

```
[Student visits /signup]
        │
        ├── Fill form: name, email, password, college, graduation year
        │
        ▼
POST /api/auth/signup
        │
        ├── Validate inputs
        ├── Check email not already registered
        ├── Hash password (bcrypt)
        ├── Create user in MongoDB
        │   { role: "student", year: detected from graduationYear }
        │
        ▼
POST /api/auth/send-verification
        │
        ├── Generate 6-digit OTP
        ├── Store OTP hash in DB (expires 15 min)
        └── Send email via Gmail SMTP (port 465)

[Student enters OTP at /verify-email]
        │
        ▼
POST /api/auth/verify-email
        │
        ├── Validate OTP match + not expired
        ├── Mark user.emailVerified = true
        └── Redirect to /student/dashboard
```

---

## 2. Student Login

```
[Student at /login]
        │
        ├── Option A: Email + Password
        │       │
        │       ▼
        │   POST /api/auth/login
        │       ├── Find user by email
        │       ├── Compare bcrypt hash
        │       ├── Create session token (JWT, 7-day expiry)
        │       ├── Set httpOnly cookie
        │       └── Redirect by role → /student/dashboard
        │
        └── Option B: Google OAuth
                │
                ▼
            GET /api/auth/google
                ├── Redirect to Google consent
                ├── Callback: upsert user from Google profile
                ├── Create session
                └── Redirect to dashboard
```

---

## 3. Student Dashboard (Year 1-2)

```
[/student/learn → FirstYearFullHub]
        │
        ├── Fetch: /api/student/first-year-progress
        │   Returns: completedChallenges[], XP, badges, streak
        │
        ├── Display tabs:
        │   ├── Home       — XP bar, daily streak, quick actions
        │   ├── Challenges — Coding challenges by topic (topic-questions.ts)
        │   ├── Progress   — Module completion per topic
        │   └── Community  — Peer activity feed
        │
        └── When student solves a problem:
            POST /api/student/badge-try
            ├── Mark challenge completed
            ├── Award XP (Easy=20, Medium=30, Hard=40)
            ├── Check badge unlock conditions
            └── Return updated progress
```

---

## 4. Coding Practice — All Years

```
[Student clicks Practice → Coding/DSA]
        │
        ▼
[/student/problems]
        │
        ├── Load: TOPIC_QUESTIONS from lib/topic-questions.ts
        │   (750 problems, 25 topics, 6 modules each)
        │
        ├── Filter by: topic, difficulty (Easy/Medium/Hard), search
        │
        ├── Student selects a problem
        │
        ▼
[/student/problems/[slug]]
        │
        ├── Monaco code editor loads
        ├── Problem statement from TOPIC_QUESTIONS
        │
        ├── Student writes solution
        │
        ├── Click "Run Code":
        │   POST /api/student/run-code
        │   ├── Send code to Docker sandbox (code-executor service)
        │   ├── Execute with timeout
        │   └── Return: stdout, stderr, execution time
        │
        └── Click "Submit":
            ├── Run against hidden test cases
            ├── Mark problem as solved in localStorage
            └── Award XP to student profile
```

---

## 5. Aptitude Practice

```
[Student clicks Practice → Aptitude]
        │
        ▼
[/student/prep?track=aptitude]
        │
        ├── PrepHubPage loads with activePath = "aptitude"
        │
        ├── Sub-sections:
        │   ├── Overview  — learning path diagram
        │   ├── Learn     — theory cards with formulas + examples
        │   ├── Topic Tests — timed MCQ per topic (Percentages, etc.)
        │   └── Full Mock  — complete aptitude simulation
        │
        └── Topic Test flow:
            POST /api/student/generate-assessment
            { company: "tcs", section: "quantitative", count: 15 }
                │
                ├── Check: does QUESTION_BANK have PYQs for this?
                │   Yes → shuffle + return real patterns
                │   No  ↓
                ├── Try scrape (PrepInsta, IndiaBix patterns)
                └── AI generation:
                    prompt: "Generate 15 TCS NQT quantitative questions..."
                    → Groq returns JSON array of MCQs
                    → Return to student
```

---

## 6. Company Placement Prep (Year 3-4)

```
[Student opens /student/prep]
        │
        ├── Shows 189 company cards (from companies-data.ts)
        ├── Filter by: category (Product, IT Services, BFSI, etc.)
        │
        ├── Student selects company (e.g., TCS)
        │
        ▼
CompanyAssessment component loads
        │
        ├── Shows company info: sections, duration, difficulty, roles
        │
        ├── Click "Start Assessment":
        │   ├── ProctoredShell activates (fullscreen + camera check)
        │   ├── Timer starts (e.g., 75 min for TCS)
        │   └── Sections load in order:
        │
        │   Section 1: Quantitative (15 questions)
        │   ├── POST /api/student/generate-assessment
        │   │   { company:"tcs", section:"quantitative", count:15 }
        │   ├── AI generates TCS-pattern MCQs
        │   └── Student answers → score recorded
        │
        │   Section 2: Advanced Aptitude (12 questions)
        │   ├── Same pipeline, section:"advanced-aptitude"
        │   └── Logical/reasoning questions
        │
        │   Section 3: Basic Coding (1 problem)
        │   ├── POST /api/student/company-coding-ai
        │   │   { company:"tcs", section:"basic-coding" }
        │   ├── Check MongoDB (18,900 pre-seeded problems)
        │   │   → TCS basic-coding: Easy, loops/arrays/strings
        │   └── Student solves in Monaco editor
        │
        │   Section 4: Advanced Coding (1 problem)
        │   ├── Same pipeline, section:"advanced-coding"
        │   │   → TCS advanced: Medium, Trees/DP/Sliding Window
        │   └── Student solves
        │
        ├── Assessment ends → Calculate scores
        │
        ▼
POST /api/student/hiring-report
        │
        ├── Send: scores, violations, time stats
        ├── AI generates personalized feedback report
        │   { strengths, weaknesses, recommendations, overall score }
        └── Save to assessment history
```

---

## 7. Company Coding AI — Problem Generation

```
POST /api/student/company-coding-ai
{ company: "amazon", section: "advanced-coding", count: 2 }
        │
        ├── Step 1: MongoDB lookup
        │   db.company_problems.find({ company: "amazon" })
        │   ├── Found 100 problems → random sample 2 → return
        │   │   source: "ai_database"
        │   └── Not found → continue
        │
        ├── Step 2: Load company profile
        │   lib/coding-model/company-profiles.ts
        │   Amazon advanced-coding:
        │   ├── difficulty: Hard
        │   ├── patterns: [Sliding Window, DP, Graphs BFS/DFS, Heap...]
        │   ├── style: "Amazon context: delivery, warehouse, sorting"
        │   └── constraints: n up to 10^5, optimal required
        │
        ├── Step 3: RAG context
        │   Pull 5 similar problems from:
        │   ├── service-company-problems.ts
        │   └── fintech-problem-bank.ts
        │   Format as examples for AI
        │
        ├── Step 4: Build structured prompt
        │   lib/coding-model/generator.ts → buildModelPrompt()
        │   "You are CodeHiring AI. Generate 2 Amazon OA-style problems.
        │    Style: Amazon context (delivery/warehouse), Hard difficulty,
        │    use DP + Graphs patterns, constraints n≤10^5..."
        │
        ├── Step 5: Call Groq/OpenAI
        │   Returns: JSON array of 2 problems
        │
        ├── Step 6: Cache to MongoDB
        │   db.company_problems.insertMany(problems)
        │
        └── Return problems to student
            source: "ai_generated"
```

---

## 8. Problem Bank Seeding (Admin)

```
[Admin runs: node seed-problems.mjs]
        │
        ├── Load .env (reads NEXTAUTH_SECRET as seed token)
        │
        ├── Check progress: GET /api/admin/seed-problems?secret=...
        │   Returns: { totalProblems, companiesComplete, percentComplete }
        │
        ├── For each of 189 companies (in order):
        │   │
        │   ├── POST /api/admin/seed-problems
        │   │   { company: "amazon", secret: "...", targetCount: 100 }
        │   │
        │   ├── Check existing count in MongoDB
        │   │   Already 100? → skip (idempotent)
        │   │
        │   ├── For each of 10 batches (10 problems each):
        │   │   │
        │   │   ├── Select patterns for batch
        │   │   │   e.g., batch 3 = [BFS, DFS, Topological Sort, Union Find, Shortest Path]
        │   │   │
        │   │   ├── Build prompt with:
        │   │   │   ├── Company name + category
        │   │   │   ├── Industry context (e.g., "Product: tech product company")
        │   │   │   ├── Difficulty distribution (Amazon: 2 Easy, 4 Medium, 4 Hard)
        │   │   │   ├── Already-generated titles (avoid duplicates)
        │   │   │   └── Pattern list for this batch
        │   │   │
        │   │   ├── Call Groq AI → get 10 problems as JSON
        │   │   │
        │   │   ├── Deduplicate by title within batch
        │   │   │
        │   │   └── db.company_problems.insertMany(10 problems)
        │   │
        │   └── Wait 2.5s (Groq rate limit: ~30 req/min)
        │
        └── Print final stats:
            Total: 18,900 / 18,900 (100%)
            All 189 companies seeded!
```

---

## 9. Hiring Drive (College Workflow)

```
[College admin at /college/drives]
        │
        ├── Create Drive:
        │   POST /api/drives
        │   { title, company, eligibility, CTC, deadline, rounds }
        │
        ├── Add Assessment Round:
        │   Configure: sections, duration, proctoring
        │
        ├── Publish Drive → students see it at /student/drives
        │
        ▼
[Students apply]
        │
        POST /api/drives/[id]/apply
        ├── Check eligibility (CGPA, branch, year)
        ├── Add to applicants list
        └── Send confirmation email

[Assessment window opens]
        │
        Students take proctored assessment
        ├── Violations tracked (tab switch, fullscreen exit)
        └── Code runs in Docker sandbox

[After assessment]
        │
        POST /api/drives/[id]/evaluate
        ├── Auto-grade MCQs
        ├── AI evaluates coding submissions
        └── Generate ranked shortlist

[College shortlists students]
        │
        POST /api/drives/[id]/shortlist
        └── Send notifications to shortlisted students

[Offer stage]
        │
        POST /api/drives/[id]/offer
        └── Generate offer letters, update placement stats
```

---

## 10. Recruiter Workflow

```
[Recruiter at /recruiter/dashboard]
        │
        ├── Post Job:
        │   POST /api/recruiter/jobs
        │   { title, company, CTC, skills, location, deadline }
        │
        ├── Search Talent:
        │   GET /api/recruiter/search?skills=react,nodejs&cgpa=7.5
        │   ├── AI-powered matching
        │   └── Returns ranked student profiles
        │
        ├── Create Drive at specific colleges:
        │   Similar to college workflow above
        │
        ├── Shortlist candidates:
        │   POST /api/recruiter/shortlists
        │   └── Candidates notified via email + in-app
        │
        └── AI Copilot:
            POST /api/recruiter/copilot
            ├── "Find me Python developers from tier-2 colleges"
            └── AI queries + ranks student pool
```

---

## 11. AI Blog Generation (Cron)

```
[Daily cron at /api/cron/generate-blog]
        │
        ├── Generate topic: tech trends, placement tips, DSA concepts
        │
        ├── Call Groq AI → full blog post (800-1200 words)
        │
        ├── Save to MongoDB blogs collection
        │
        └── Auto-published at /blog/[slug]
```

---

## 12. AI Insights (Student)

```
[Student at /student/ai]
        │
        POST /api/student/ai-insights
        │
        ├── Analyze: platforms (LeetCode, CodeChef), scores, activity
        │
        ├── Identify: weak topics, practice gaps, company fit
        │
        └── Return:
            ├── Recommended companies to target
            ├── Skills to improve
            ├── Estimated placement readiness score
            └── Action plan (this week / this month)
```

---

## 13. Platform Sync

```
[Student at /student/platforms]
        │
        ├── Connect platforms: LeetCode, CodeChef, HackerRank, etc.
        │
        POST /api/platforms/link
        { platform: "leetcode", username: "johndoe" }
        │
        ├── Verify profile exists
        │
        ├── Sync stats:
        │   POST /api/platforms/sync
        │   ├── Scrape: problems solved, contests, rating
        │   └── Store in user.platformStats
        │
        └── Display on dashboard:
            ├── Total solved across all platforms
            ├── Difficulty breakdown
            └── Contest ratings
```

---

## Navigation & Routing Summary

```
All Students (Year 1-4)
├── /student/dashboard      — Home with stats
├── /student/platforms      — Link coding platforms
├── /student/practice       — Practice landing
│   ├── → /student/prep?track=aptitude      — Aptitude MCQs
│   ├── → /student/problems                 — 750 DSA problems
│   └── → /student/prep?track=communication — Verbal practice
├── /student/analytics      — Progress analytics
├── /student/leaderboard    — College rankings
└── /student/ai             — AI career insights

Year 1-2 Additional
└── /student/learn          — Gamified hub (XP, badges, topics)

Year 3-4 Additional
├── /student/prep           — 189-company assessment track
├── /student/drives         — Active hiring drives
└── /student/jobs           — Job listings

College Portal
├── /college/dashboard
├── /college/students       — Manage students
├── /college/drives         — Manage drives
└── /college/reports        — Placement stats

Recruiter Portal
├── /recruiter/dashboard
├── /recruiter/search       — Search students
├── /recruiter/drives       — Manage drives
└── /recruiter/jobs         — Job postings
```
