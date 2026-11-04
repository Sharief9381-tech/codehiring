# CodeHiring — AI-Powered Campus Placement Platform

A full-stack placement preparation platform for engineering students. Students practice DSA problems, take company-specific mock assessments, get AI-generated reports, and improve communication skills through voice coaching.

**Live:** https://codehiring.vercel.app

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Database:** MongoDB Atlas
- **AI:** Gemini 2.0-flash (KEY4→KEY3→KEY2→KEY1) → OpenAI (gpt-4o-mini) → Groq (llama-3.1-8b-instant)
- **Code Execution:** Docker-based executor on Render.com
- **Deployment:** Vercel
- **Auth:** Custom JWT + session tokens

---

## Features

### 👨‍💻 Coding Practice
- **544 unique DSA problems** across 24 topics (Arrays, Strings, Trees, Graphs, DP, etc.)
- Each topic has 6 modules (2 Easy + 2 Medium + 2 Hard) × 5 problems = 30/topic
- AI-generated descriptions, input/output formats, constraints, test cases, starter code (5 languages)
- **Hidden test cases** — revealed after 3 failed attempts or on passing all tests
- **Daily new problem** added every morning at 7 AM IST via Vercel cron (`/api/cron/add-daily-problem`)
- Problems ordered Easy → Medium → Hard within each topic
- "NEW" badge on daily problems in the sidebar

### 🏢 Company Assessments (190+ companies)
- **Pattern-aware** — each company shows its real section structure before starting; Start button disabled until loaded
- **Dynamic question counts** — distributes total questions proportionally across sections (e.g. SBI 200Q: Quant 80, Logical 67, Verbal 53)
- 35 companies have explicit patterns; 155 use category-based defaults (IT Services, Product, Consulting, BFSI, Core Engineering)
- **AI generates questions** using Gemini KEY4→KEY3→KEY2→KEY1 → OpenAI → Groq fallback chain
- Coding section uses full problem editor with public + hidden test cases
- **Scores calculated from actual answers** — coding score = problems solved ÷ total × 100 (0% if not attempted)
- Section keys stored per actual section ID (`advanced-coding`, `basic-coding`, `quantitative`, etc.)

### 🔒 Proctored Assessment (Zero Tolerance)
- Fullscreen mandatory — **exiting immediately terminates** the assessment
- Tab switch / window blur → **immediate termination**
- Copy (Ctrl+C) → **immediate termination** + −10 integrity
- Paste (Ctrl+V) → **immediate termination**
- Right-click, DevTools (F12), Ctrl+A/U/S → **immediate termination**
- Camera feed monitored — brightness-based face detection (10s no-face → terminate)
- Termination screen shows reason + 5s countdown before returning to assessments

### 📊 AI Hiring Report
- Generated after each assessment using Groq AI (with OpenAI + Gemini fallback)
- **Marks per section** — shows correct/total (e.g. `18/29` with percentage)
- Section names shown as proper display names (not raw keys like `advanced-aptitude`)
- **Dynamic** — only shows sections that were actually in the assessment
- Overall selection probability ring (no per-round breakdowns)
- Benchmark derived from company difficulty/category for all 190 companies

### 🎤 Voice & Communication
- **Voice Chat** (ChatGPT/Claude style) — natural conversation orb, auto-listens after AI speaks, gentle grammar corrections
- **AI Voice Coach** — HR interview, technical, GD, spoken English; feedback on grammar/fluency/content/confidence
- **Communication Model** — Sentence Formation, Vocabulary, GD, HR Soft Skills, Pronunciation with Beginner/Intermediate/Advanced levels
- AI chain: Gemini (KEY4→1) → OpenAI → Groq across all voice routes

### 📚 Practice Hub
- **Aptitude** — 200+ questions: Quantitative, Logical Reasoning
- **Coding** — DSA problems by topic and difficulty
- **Communication** — 900+ questions + voice practice
- AI generates Easy → Hard questions using existing bank as style reference
- **1st and 2nd year students** only see Practice (no Prep Track)

### 🧠 AI Insights
- 24-hour MongoDB cache per user
- Groq → OpenAI → Gemini fallback chain
- Force refresh with `?refresh=1`

---

## Environment Variables

```env
# Database
MONGODB_URI=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://codehiring.vercel.app

# AI — Gemini (primary, 4 keys for rotation)
GEMINI_API_KEY=
GEMINI_API_KEY_2=
GEMINI_API_KEY_3=
GEMINI_API_KEY_4=
GOOGLE_API_KEY=   # same as GEMINI_API_KEY

# AI — Fallback
GROQ_API_KEY=
OPENAI_API_KEY=

# Code Execution
EXECUTOR_URL=https://code-executor-ry2k.onrender.com
EXECUTOR_SECRET=codehiring-executor-secret

# Email (forgot password)
GMAIL_USER=
GMAIL_APP_PASSWORD=

# Misc
MISTRAL_API_KEY=
```

---

## AI Architecture

### Question Generation Pipeline
```
Request → Cache check (24h TTL) → Gemini 3.8-flash (KEY4)
       → Gemini 3.5-flash (KEY4 → KEY1 → KEY2 → KEY3)
       → Groq (openai/gpt-oss-20b)
       → OpenAI (gpt-4o-mini)
       → Static fallback bank
```

### Token Budget
Gemini 3.5+ and 3.8 are "thinking models" — they use 500-800 tokens internally before generating output. `maxOutputTokens: 8000` is set to ensure enough budget for both thinking + actual JSON output.

### Batch Generation
For large requests (TCS 20Q, TCS 30Q), questions are generated in batches of 8 to avoid token truncation. Results are deduplicated and padded with fallback questions if AI returns fewer than requested.

---

## Company Assessment System

### Pattern Resolution (priority order)
1. **Explicit pattern** — 35 major companies (TCS, Infosys, Amazon, Google, Deloitte etc.) have exact data
2. **Category-based** — remaining 155 companies derive patterns from `ALL_COMPANIES.category`:
   - IT Services → Quant Hard + Logical Medium-Hard + Verbal + Basic/Advanced Coding
   - Product → Hard coding focus, Hard aptitude
   - Consulting → Data Interpretation Hard + Logical + Verbal, no coding
   - BFSI → Financial Math Hard + Logical + Verbal
   - Core Engineering → Engineering Math + Technical coding

### Score Calculation
- **MCQ sections** (Quantitative, Logical, Verbal): `(correct answers / total questions) × 100`
- **Coding sections**: `(problems submitted with accepted code / total coding problems) × 100`
- No hardcoded fallback scores anywhere

---

## Cron Jobs

| Schedule | Endpoint | Purpose |
|---|---|---|
| 0 6 * * * (6 AM UTC) | `/api/cron/generate-blog` | Daily blog post |
| 30 1 * * * (1:30 AM UTC = 7 AM IST) | `/api/cron/add-daily-problem` | New coding problem |

---

## Student Year Access Control

| Year | Nav | Prep Track | Practice |
|---|---|---|---|
| 1st year | Dashboard, Platforms, Practice, Analytics, Leaderboard, AI | ❌ Redirected to /student/learn | ✅ All practice |
| 2nd year | Same as 1st year | ❌ Redirected | ✅ All practice |
| 3rd/4th year | + Prep Track | ✅ Full access | ✅ All practice |

---

## Key Collections (MongoDB)

| Collection | Purpose |
|---|---|
| `students` | Student profiles and auth |
| `problem_details_v8` | AI-generated problem descriptions + test cases |
| `daily_new_problems` | Daily cron-generated problems |
| `questions_cache` | Assessment questions cache (24h TTL, v2 key) |
| `practice_questions_cache` | Practice topic questions cache (24h TTL) |
| `assessment_history` | Student assessment history |
| `ai_insights_cache` | AI insights cache per user (24h TTL) |
| `company_patterns` | Company assessment patterns cache (7 days) |
| `blogs` | Auto-generated blog posts |
| `daily_problems` | Daily challenge problems |

---

## Development

```bash
pnpm install
pnpm run dev
```

For code execution locally, set `EXECUTOR_URL` to your local executor:
```env
EXECUTOR_URL=http://localhost:4000
```

---

## Deployment Notes (Vercel)

After any deployment, ensure these env vars are set in Vercel dashboard:
- `GEMINI_API_KEY_4` — 4th Gemini key for better quota rotation
- `NEXTAUTH_URL=https://codehiring.vercel.app` — required for forgot password links
- All other env vars from the list above

The `pnpm-lock.yaml` must be committed for Vercel's frozen lockfile install to succeed.
