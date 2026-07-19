# CodeHiring — Campus Placement & Career Platform

An AI-powered platform connecting students, colleges, and recruiters for campus placements, career development, and skill building.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Database | MongoDB Atlas |
| Auth | Custom JWT + session cookies |
| AI (Primary) | Groq — llama-3.3-70b-versatile |
| AI (Code Eval) | Mistral API |
| AI (Fallback) | OpenAI GPT-4o-mini |
| Email | Gmail SMTP (App Password) |
| Styling | Tailwind CSS + custom dark theme |

---

## User Roles

| Role | Portal |
|---|---|
| Student | `/student/*` |
| College | `/college/*` |
| Recruiter | `/recruiter/*` |
| Admin | `/admin/*` |

---

## Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# AI Providers
GROQ_API_KEY=gsk_...          # Primary AI (free)
MISTRAL_API_KEY=...            # Code evaluation
OPENAI_API_KEY=sk-...          # Fallback

# Email (Gmail SMTP)
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=...         # Google App Password
```

---

## Student Portal Structure

```
/student/
├── dashboard        — Stats, activity heatmap, platform sync
├── learn            — Year-based learning hub (see below)
├── prep             — AI assessments: Aptitude / Coding / Communication
├── platforms        — Link LeetCode, GitHub, CodeChef, GFG etc.
├── analytics        — Charts, skill radar, monthly stats
├── leaderboard      — College + global rankings by XP
├── drives           — Campus placement drives (on/off campus)
├── jobs             — Off-campus job listings
├── profile          — Edit profile, graduation year, skills
├── resume           — Smart Resume builder (AI-enhanced)
├── ai               — AI insights (skill gaps, recommendations)
└── daily-challenge  — Code editor with AI evaluation
```

---

## Learn Page — Year-Based Architecture

```
Year 1 → FirstYearFullHub (/components/student/first-year-full-hub.tsx)
  Tabs:
  ├── My Progress      — XP, streak, 7 platform badges
  ├── Practice ▾       — Dropdown: Aptitude / Coding / Communication
  ├── Challenges
  │   ├── Project Challenges   (AI-generated, Basic→Advanced, infinite)
  │   ├── Debug Challenges     (AI-generated, language-selectable, infinite)
  │   └── Skill Badge Challenges (51 topics × 7 LeetCode problems)
  ├── Soft Skills      — Bite-sized communication & mindset modules
  └── Community        — LeetCode-style discussion board

Years 2-4 → CareerHub (/components/student/career-hub.tsx)
  Year 2: Practice nav dropdown only
  Year 3: Placement Tools | DSA & Interview | Smart Resume
  Year 4: AI-Powered Prep | Smart Resume
  All years: Hiring Drives tab (on/off campus)
```

---

## Prep Track Page (`/student/prep`)

```
Hero banner with buttons:
  Practice ▾ | Learning Paths | Smart Resume | History

Practice dropdown opens:
  → Aptitude      (Quant, Logical, Data Interpretation)
  → Coding / DSA  (Arrays, Trees, DP, Graphs)
  → Communication (Grammar, Vocab, Reading Comprehension)

Each track:
  → AI generates topic-wise questions (Groq)
  → Mock test with timer
  → Instant explanation on wrong answers
  → Score saved to history

Company Prep (Year 2+):
  → "Choose From Top Roles" grid
  → 189+ companies with filters (category, search)
  → Click → AI-generated OA simulation (company-pattern questions)
  → Back button returns to grid (not duplicate page)
```

---

## Challenges System (Year 1)

### Project Challenges
- AI-generated via Groq (falls back to static pool)
- Progression: Beginner → Intermediate → Advanced (6 per tier)
- Real-world projects: QR Generator, GitHub Dashboard, Netflix Clone etc.
- "Try in Editor" → `/student/daily-challenge`
- GPT/Mistral evaluates code → marks done → auto-replaced with next

### Debug Challenges
- AI-generated, language-selectable (15 languages)
- Always "find and fix the bug" type — full code shown
- Answer input → server checks with fuzzy matching
- Wrong → show explanation + hint + retry
- Correct → XP awarded → replaced with next challenge
- Progression: Basic → Intermediate → Advanced (3 per topic, infinite)

### Skill Badge Challenges
- 51 DSA/CS topics × 7 LeetCode problems each
- Student marks problems done after solving on LeetCode
- Progress tracked in DB, XP awarded per problem

### Daily Challenge
- AI generates 1 new problem per day (Groq)
- Cached in MongoDB by date (same problem for all users)
- Difficulty: Basic (days 1-90) → Intermediate (91-210) → Advanced (211+)
- "Try in Editor" → write code → Mistral evaluates → awards XP if score ≥ 70

---

## Platform Badges (7 Total)

| Badge | Condition |
|---|---|
| Code Spark | Earn any XP |
| First Blood | Complete 1 challenge |
| Daily Grinder | 7-day daily problem streak |
| Decathlon | Complete 10 challenges |
| Badge Hunter | Mark 7 LeetCode problems done |
| Two-Week Warrior | 14-day streak |
| XP Legend | Earn 500+ XP |

---

## MongoDB Collections

| Collection | Purpose |
|---|---|
| `users` | All user accounts + linked platform stats |
| `first_year_progress` | XP, streak, badges, completed challenges |
| `debug_challenges` | Cached AI debug challenges per user |
| `project_challenges` | Cached AI project challenges per user |
| `daily_problems` | Today's AI problem (cached by date) |
| `discussions` | Community posts + replies + upvotes |
| `drives` | Campus placement drives |
| `jobs` | Job listings (on/off campus) |
| `assessment_history` | Practice test scores |

---

## API Routes

```
/api/auth/*
  login, signup, logout, OTP, verify-email, Google OAuth, forgot-password

/api/student/*
  progress, first-year-progress, evaluate-code, debug-challenges,
  project-challenges, daily-problem, badge-try, discussions,
  analytics, leaderboard, assessment, generate-assessment

/api/college/*
  dashboard, students, announcements, drives, analytics

/api/recruiter/*  (via drives/jobs pages)
  job postings, candidate search, shortlists

/api/admin/*
  blog, careers, site-config, user-details, dashboard

/api/platforms/*
  sync platform stats (LeetCode, GitHub, CodeChef, GFG etc.)

/api/public/*
  landing, blog
```

---

## AI Provider Chain

```
Feature               Primary         Fallback
─────────────────────────────────────────────
Debug challenges      Groq            OpenAI
Project challenges    Groq            Static pool
Daily problem         Groq            Static pool
Code evaluation       Mistral         Groq → OpenAI
Assessment generation Groq            OpenAI
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in MONGODB_URI, GROQ_API_KEY, MISTRAL_API_KEY, GMAIL_* etc.

# Run development server
npm run dev
# → http://localhost:3000
```

---

## College Code

Every student must enter a **college code** at signup (except recruiters). This enables:
- College-specific leaderboards
- Campus drive filtering
- College analytics dashboard
- Placement statistics by institution
