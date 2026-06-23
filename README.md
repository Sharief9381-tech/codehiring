# CodeHiring

> The complete campus placement platform — verified coding stats, AI-powered hiring simulations, smart resume analysis, and personalised career roadmaps for students, colleges, and recruiters.

---

## What is CodeHiring?

CodeHiring bridges the gap between student coding ability and recruiter expectations by pulling **verified, real-time data** from LeetCode, Codeforces, GitHub, CodeChef, HackerRank, GeeksforGeeks and 8+ other platforms — making hiring decisions data-driven instead of resume-guesswork.

---

## Core Features

### For Students

| Feature | Description |
|---|---|
| **Coding Dashboard** | Live stats synced from 8+ platforms — problems solved, contest ratings, GitHub contributions |
| **CodeHiring Score** | Normalised 0–1000 score across all platforms — single signal for recruiters |
| **Leaderboard** | Global and college-wise ranks updated in real time |
| **Career Hub** | Year-personalised roadmap (1st–4th year) with courses, skills, internships, jobs |
| **Prep Track** | 189-company assessment library — AI generates real-pattern questions per company |
| **Company Assessments** | Proctored simulation — TCS NQT, Infosys InfyTQ, Amazon OA, Google, etc. |
| **AI Hiring Report** | Full recruitment-quality report after every assessment — readiness score, selection probability per round, HR verdict, 30-day prep plan |
| **Assessment History** | All past attempts stored with rank, percentile, and improvement trend |
| **Leaderboard (post-assessment)** | Rank vs all students who took the same company test |
| **Smart Resume** | ResumeWorded-style deep analysis — ATS score, bullet grading, job match %, section grades A–F |
| **Resume Studio** | 4 templates (Technical, Minimal, Creative, Executive) built from live platform data |
| **AI Career Chat** | Full context AI assistant — knows your platforms, problems, rating, resume, placements |
| **Blog** | AI auto-generates a fresh placement/career article daily via Groq |

### For Colleges

| Feature | Description |
|---|---|
| **Placement Analytics** | Batch-wide coding activity, top performers, skill gap reports |
| **Student Monitoring** | Real-time platform stats per student |
| **Hiring Drives** | Post on-campus drives — students apply, track status |
| **Announcements** | Broadcast announcements to all enrolled students |

### For Recruiters

| Feature | Description |
|---|---|
| **Job Posting** | Post on-campus and off-campus jobs |
| **AI Matching** | Students ranked by CodeHiring Score, skill overlap, and recency |
| **Verified Profiles** | No self-reported data — all stats pulled directly from platform APIs |

---

## Prep Track — 189 Companies

Categories: IT Services · Product/FAANG · Indian Startups · Consulting · BFSI · Core Engineering · Telecom · FMCG · Pharma · EV/Auto · Defence

**How it works:**
1. Student selects a company (e.g. TCS, Amazon, Google)
2. Proctored environment activates — fullscreen enforced, camera on, copy/paste disabled
3. Groq AI generates company-pattern questions by first scraping IndiaBix/PrepInsta for real previous-year papers
4. After submission → AI Hiring Report generated:
   - Readiness Score (0–100)
   - Selection probability per round
   - Section-wise analysis
   - HR verdict (Strongly Recommended → Not Recommended)
   - 30-day personalised prep plan
   - Integrity analysis (violation log)

---

## First-Year Student Mode

When a 1st-year student logs in (auto-detected from graduation year):

- **Career Hub** — Hiring Drives tab hidden; shows Learning Paths, Skills to Build, Daily Practice with YouTube videos, notes/cheatsheets, and course links
- **Prep Track** — Company assessments hidden; shows beginner learning resources (CS50, freeCodeCamp, Kaggle, etc.)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | MongoDB Atlas |
| AI | Groq (`llama-3.3-70b-versatile`) |
| Analytics | Vercel Analytics |
| Email | Resend (optional) |
| Resume Parsing | APILayer Resume Parser (optional, free tier) |

---

## Environment Variables

```env
# Required
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
GROQ_API_KEY=gsk_...

# Optional — enhances resume analysis
APILAYER_RESUME_KEY=...

# Optional — email verification
RESEND_API_KEY=...
```

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/Sharief9381-tech/codehiring
cd codehiring

# 2. Install
npm install

# 3. Configure
cp .env.example .env
# Edit .env with your MongoDB URI and Groq API key

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Admin Access

1. Visit `http://localhost:3000/api/debug/create-admin` once to create the admin account
2. Log in at `/login` with:
   - Email: `sharief9381@gmail.com`
   - Password: `12341234`
3. Access admin panel at `/admin`

Admin features: user management, blog management (AI auto-generates daily posts), analytics, feedback, drives.

---

## Automatic Blog

A Vercel cron job (`vercel.json`) calls `/api/cron/generate-blog` daily at 6 AM UTC. Groq AI picks a topic from 25 placement/career topics and writes a full article. On localhost, the blog page self-triggers generation on first daily load.

---

## Platforms Supported

LeetCode · GitHub · Codeforces · CodeChef · HackerRank · GeeksforGeeks · AtCoder · HackerEarth · SPOJ · Kattis · TopCoder · InterviewBit · Kaggle · Exercism · and more

---

## License

MIT — built with ❤️ for Indian CS/IT students
