# CodeTrack

A platform for tracking student coding performance across LeetCode, GitHub, Codeforces, and more — with dashboards for students, colleges, and recruiters.

---

## Getting Started (for all developers)

### 1. Clone the repo

```bash
git clone https://github.com/Sharief9381-tech/CodeHiring.git
cd CodeHiring
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in:

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ Yes | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | ✅ Yes | Any long random string for signing sessions |
| `NEXTAUTH_URL` | ✅ Yes | `http://localhost:3000` for local dev |
| `GITHUB_TOKEN` | Optional | For fetching live GitHub stats |
| `LEETCODE_SESSION` | Optional | For fetching live LeetCode stats |

**Getting a MongoDB URI:**
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and create a free cluster
2. Click **Connect → Drivers** and copy the connection string
3. Replace `<password>` with your DB user password

**Generating NEXTAUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Creating your first account

Since the database starts empty, go to `/signup` and create an account as a student, college, or recruiter.

---

## Project Structure

```
app/
  api/          → API routes
  student/      → Student dashboard pages
  college/      → College dashboard pages
  recruiter/    → Recruiter dashboard pages
  admin/        → Admin panel
  login/        → Login page
  signup/       → Signup page
components/     → Reusable UI components
lib/
  auth.ts       → Session-based authentication
  database.ts   → MongoDB connection
  models/       → User and session models
  platforms/    → Platform scrapers (LeetCode, GitHub, etc.)
  services/     → Analytics and sync services
scripts/        → Utility scripts (clear DB, setup, etc.)
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `node scripts/clear-database.js` | Wipe all data (requires dev server running) |

---

## Roles

| Role | Access |
|---|---|
| **Student** | Personal dashboard, platform linking, analytics, leaderboard |
| **College** | Student performance overview, department stats, placement tracking |
| **Recruiter** | Candidate search, job postings, hiring pipeline |
| **Admin** | Full user management (`/admin`) |

---

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **MongoDB** (via native driver)
- **Tailwind CSS + shadcn/ui**

---

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit: `git commit -m "describe your change"`
4. Push: `git push origin feature/your-feature`
5. Open a pull request

> ⚠️ Never commit `.env.local` — it contains secrets and is gitignored.
