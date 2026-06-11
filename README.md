# CodeHiring

> Where coding skills meet opportunities.

CodeHiring is a full-stack platform that unifies student coding performance across all major competitive programming and development platforms — giving students a single profile, colleges placement analytics, and recruiters a verified talent pool.

---

## What it does

**For Students**
- Connect 10+ coding platforms (LeetCode, Codeforces, CodeChef, GitHub, GeeksforGeeks, HackerRank, AtCoder, and more)
- Auto-sync stats every 5 minutes
- View aggregated analytics, leaderboard ranking, and AI-powered insights
- Access a Career Hub with internships, live jobs, trending skills, and smart resume tools
- Apply to campus placement drives and track application status

**For Colleges**
- Dashboard with department-wise placement analytics
- Manage campus drives and shortlisted students
- Post announcements and track student leaderboards
- Export placement reports

**For Recruiters**
- Search verified talent by platform rating, problems solved, and skills
- Post jobs and placement drives
- Manage shortlists and hiring pipelines

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database | MongoDB (native driver) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| AI | Groq (LLaMA) — assessment generation & evaluation |
| Auth | Custom session-based auth (no NextAuth) |
| Animation | Framer Motion |
| Charts | Recharts |
| Notifications | Sonner |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Sharief9381-tech/codehiring.git
cd codehiring
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | ✅ | Long random string for signing sessions |
| `NEXTAUTH_URL` | ✅ | `http://localhost:3000` for local dev |
| `GROQ_API_KEY` | ✅ | Required for AI assessments — free at [console.groq.com](https://console.groq.com) |

**Get a MongoDB URI** — create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com), click Connect → Drivers, copy the string and replace `<password>`.

**Generate NEXTAUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## First account

The database starts empty. Go to `/signup` and create an account as a **student**, **college**, or **recruiter**. Admin access is at `/admin`.

---

## Project Structure

```
app/
  page.tsx              → Landing page
  student/              → Student dashboard, platforms, analytics, jobs, AI, prep, drives
  college/              → College dashboard, students, drives, analytics, reports
  recruiter/            → Recruiter dashboard, search, jobs, shortlists
  admin/                → Admin panel (user management, site config)
  api/                  → All API routes (auth, platforms, drives, jobs, analytics...)
  blog/                 → Blog
  explore/              → Public explore pages (students, colleges, drives, recruiters)
  u/[username]/         → Public student profiles

components/
  student/              → Dashboard, platforms, analytics, career hub, AI insights
  college/              → Placement drives, student tables, announcements
  recruiter/            → Search, shortlists, job postings
  dashboard/            → Shared nav, sidebar, notification bell
  ui/                   → shadcn/ui primitives

lib/
  auth.ts               → Session-based authentication
  database.ts           → MongoDB connection
  groq.ts               → Groq AI client
  models/               → MongoDB models (User, Drive, Job, Assessment, Notification...)
  platforms/            → Platform scrapers (LeetCode, GitHub, Codeforces, CodeChef, GFG, HackerRank, AtCoder, SPOJ, Kattis, and more)
  services/             → Sync engine, analytics, job matcher, stats aggregator

scripts/                → DB setup and utility scripts
```

---

## Supported Platforms

LeetCode · GitHub · Codeforces · CodeChef · GeeksforGeeks · HackerRank · HackerEarth · AtCoder 

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run setup` | Run DB setup script |
| `npm run verify` | Verify environment setup |

---

## Roles & Permissions

| Role | Dashboard | Key Features |
|---|---|---|
| **Student** | `/student/dashboard` | Platform linking, analytics, leaderboard, career hub, AI insights, placement drives |
| **College** | `/college/dashboard` | Student overview, placement drives, department analytics, reports |
| **Recruiter** | `/recruiter/dashboard` | Talent search, job postings, placement drives, shortlists |
| **Admin** | `/admin` | Full user management, blog, site config, feedback |

---

## Contributing

```bash
git checkout -b feature/your-feature
# make changes
git commit -m "feat: describe your change"
git push origin feature/your-feature
# open a pull request
```

> Never commit `.env` — it's gitignored and contains secrets.
