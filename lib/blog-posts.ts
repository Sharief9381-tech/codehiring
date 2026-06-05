export interface BlogPost {
  slug: string
  date: string
  tag: string
  tagColor: string
  title: string
  excerpt: string
  readTime: string
  content: string // full article HTML-like markdown content
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-leetcode-score-matters",
    date: "May 20, 2025",
    tag: "Insights",
    tagColor: "bg-primary/10 text-primary",
    title: "Why Your LeetCode Score Matters More Than Your Resume",
    excerpt:
      "Recruiters at top tech companies are increasingly looking past resume bullets and asking for proof. Here's how verified coding performance changes the hiring conversation.",
    readTime: "5 min read",
    content: `
## The Problem with Resumes

Every year, millions of engineering students submit resumes claiming "proficient in Data Structures & Algorithms." Recruiters have no way to verify this. The result? Hours wasted on screening calls where the gap between claimed and actual skills becomes painfully obvious.

LeetCode changed the game by giving developers a standardized way to demonstrate ability. When you solve 500+ problems with a Knight badge, that speaks for itself in a way a resume bullet never can.

## What Recruiters Actually Look For

Top-tier companies have quietly shifted their screening process. Many now ask for LeetCode profiles upfront. What they look at:

- **Total problems solved** — consistency and volume of practice
- **Difficulty breakdown** — ratio of medium/hard problems shows depth
- **Contest rating** — performance under time pressure reflects real interview conditions
- **Consistency** — recent activity shows you're still sharp

## The Verified Advantage

The biggest shift is verification. A resume says "experienced in dynamic programming." A LeetCode profile shows 120 hard problems solved with a contest rating of 1900. One is a claim. The other is proof.

CodeHiring takes this further by pulling your stats directly from LeetCode's API — no self-reporting, no cherry-picking. Recruiters see exactly what the platform shows.

## What This Means for You

If you're a student, the time you spend on LeetCode is no longer invisible. Every problem you solve is building a verifiable track record that follows you into every job application.

Focus on consistency over cramming. A steady 2–3 problems per day over a year beats a panic sprint the week before interviews.

## The Bottom Line

Your LeetCode score isn't everything. But in a world where everyone claims the same skills, verified performance data is the clearest signal recruiters have. Make sure yours tells the right story.
    `,
  },
  {
    slug: "college-placement-analytics",
    date: "April 15, 2025",
    tag: "For Colleges",
    tagColor: "bg-emerald-500/10 text-emerald-600",
    title: "How Data-Driven Placement Cells Are Outperforming the Rest",
    excerpt:
      "Colleges that track coding activity in real time are seeing 30–40% better placement outcomes. We break down what they're doing differently.",
    readTime: "7 min read",
    content: `
## The Old Way vs. The New Way

Traditional placement cells run on spreadsheets and gut feel. They compile student data manually, send it to recruiters in PDFs, and hope for the best. The feedback loop is nearly nonexistent.

Data-driven placement cells operate differently. They have real-time visibility into every student's coding activity, can identify who is ready to interview, and can benchmark performance against previous batches.

## What the Numbers Show

Colleges using real-time coding analytics report:

- **35% higher placement rates** on average
- **40% reduction** in time-to-placement
- **2x more recruiter partnerships** due to transparent data sharing
- **Better student outcomes** with targeted intervention for struggling students

## The Key Differences

**1. Real-Time Monitoring**
Instead of waiting for semester-end reports, TPOs can see daily activity. When a student's LeetCode activity drops for two weeks, that's an early warning signal — not a post-mortem discovery.

**2. Skill Gap Identification**
Aggregated data across a batch shows which skills are consistently weak. If 60% of your final year students have never solved a dynamic programming problem, you can run a targeted workshop — before placement season, not during.

**3. Transparent Recruiter Access**
Companies now expect data. Placement cells that can share verified, structured coding profiles get more recruiter attention than those sending static PDFs. Transparency builds trust.

**4. Historical Benchmarking**
Year-over-year data lets TPOs set realistic targets, identify trends, and make the case for resources to college management.

## How to Get Started

You don't need to overhaul your entire system. Start with:

1. Require students to connect at least one coding platform
2. Set a weekly review cadence to monitor activity
3. Share anonymized aggregate stats with recruiting partners
4. Identify your top 20% and fast-track them to early drives

The data advantage compounds over time. Colleges that start now will be significantly ahead within two placement cycles.
    `,
  },
  {
    slug: "verified-profiles-vs-resumes",
    date: "March 8, 2025",
    tag: "Recruiting",
    tagColor: "bg-amber-500/10 text-amber-600",
    title: "Verified Profiles vs. Self-Reported Resumes: The Data Is Clear",
    excerpt:
      "We analyzed thousands of candidate profiles. The gap between claimed skills and verified performance is wider than most recruiters expect.",
    readTime: "6 min read",
    content: `
## The Resume Inflation Problem

Résumé inflation is not new. But it's gotten worse. With AI tools that can generate polished bullet points in seconds, the signal-to-noise ratio on resumes has collapsed. Recruiters are spending more time reading, and getting less signal.

We analyzed a sample of candidate profiles on CodeHiring where both self-reported resume data and verified platform stats were available. The results were striking.

## What We Found

- **68% of candidates** who claimed "advanced" DSA skills had solved fewer than 100 LeetCode problems
- **45%** who listed competitive programming as a skill had never participated in a rated contest
- **Only 22%** of candidates whose resumes claimed a "4.0 GitHub contribution streak" had more than 50 commits in the past year

None of this is malicious. Most candidates genuinely believe their self-assessment. But belief and evidence are different things.

## The Verification Gap

The gap between claimed and verified performance is widest at the middle of the skill distribution — not at the extremes. Strong candidates tend to undersell themselves. Weak candidates tend to oversell. Recruiters using only resumes consistently end up interviewing the wrong half.

## How Verified Profiles Fix This

When every stat comes directly from the source — LeetCode's API, GitHub's contribution graph, Codeforces's rating system — the self-reporting bias disappears entirely.

A recruiter looking at a CodeHiring profile sees:
- Problems solved: 347 (pulled live from LeetCode)
- Contest rating: 1,654 (from Codeforces)
- GitHub contributions in last 90 days: 89 (from GitHub API)

These aren't claims. They're facts.

## The Hiring Quality Difference

Companies that shifted to verified-profile-first screening report:
- 50% reduction in failed technical screens
- Faster time-to-hire because fewer surprises
- Higher offer acceptance rates because candidates feel more fairly evaluated

## The Bottom Line

Resumes won't disappear. But for technical roles, they should be the last thing you look at — not the first. Start with verified performance, and use the resume only to understand context.
    `,
  },
  {
    slug: "ai-job-matching-explained",
    date: "February 22, 2025",
    tag: "Product",
    tagColor: "bg-violet-500/10 text-violet-600",
    title: "How CodeHiring's AI Matching Actually Works",
    excerpt:
      "A behind-the-scenes look at how we use coding platform data, normalized scores, and job requirements to rank candidates — without keyword matching.",
    readTime: "8 min read",
    content: `
## The Problem with Keyword Matching

Most job platforms match candidates to jobs by looking for keyword overlap: if the job description says "React" and the resume says "React," it's a match. This approach is fast, but deeply flawed.

A student who built three React projects with 200 GitHub commits and a 4-star HackerRank badge gets the same match score as someone who put "React" on their resume after watching a YouTube tutorial. Keyword matching can't tell the difference.

## How We Think About Matching

CodeHiring's matching is built on a fundamentally different premise: **match on demonstrated ability, not stated skills.**

Here's what we actually look at:

### 1. The CodeScore

Every student on CodeHiring has a normalized CodeScore — a single number that synthesizes:
- Total problems solved across platforms (weighted by difficulty)
- Contest participation and ratings
- GitHub activity (commits, PRs, repos)
- Platform-specific achievements (badges, certifications)

The CodeScore is normalized across the full student population, so a 75th percentile score means the same thing regardless of which platforms the student uses.

### 2. Job Requirement Translation

When a recruiter posts a job, they specify:
- Required tech stack
- Minimum problem-solving threshold
- Preferred contest rating range
- Experience type (internship, full-time, etc.)

Our system translates these requirements into performance benchmarks based on historical hiring data.

### 3. The Matching Algorithm

Candidates are ranked for each job using a weighted scoring function:

- **40%** — CodeScore percentile
- **25%** — Skill overlap (but verified: we check if the student has solved problems tagged with required skills)
- **20%** — Recency (recent activity weighted higher — active practice matters)
- **15%** — Platform-specific signals (e.g., for backend roles, GitHub activity weighted higher)

### 4. The Groq AI Layer

On top of the numeric scoring, we use Groq's LLM API to generate natural-language match explanations. Recruiters don't just see a score — they see "This candidate has solved 45 graph problems and has a Codeforces rating in the top 15% for your required stack."

## What We Deliberately Don't Do

- We don't match on college name or CGPA as primary signals
- We don't penalize candidates from non-tier-1 colleges
- We don't use resume text as a matching input

The goal is to surface talent that keyword-based systems miss. That's only possible if the foundation is verified data, not self-reported claims.

## Results So Far

Early recruiter partners report 60% fewer failed technical screens and 2x more diverse candidate pipelines compared to their previous processes. The matching isn't perfect — no algorithm is — but it's consistently better than the alternative.
    `,
  },
  {
    slug: "student-guide-to-codehiring",
    date: "January 30, 2025",
    tag: "Guide",
    tagColor: "bg-cyan-500/10 text-cyan-600",
    title: "The Student's Complete Guide to Getting the Most Out of CodeHiring",
    excerpt:
      "Connect your profiles, understand your CodeScore, and position yourself for the roles that actually fit your skill set. Step-by-step walkthrough.",
    readTime: "10 min read",
    content: `
## Step 1: Create Your Account

Sign up at CodeHiring with your college email. During signup, you'll enter your college code — ask your placement officer if you don't have it. This links your profile to your college's placement cell and makes you visible to authorized recruiters.

Fill in your basic profile: branch, graduation year, and skills. Don't overthink the skills list — it's supplementary to your verified platform data.

## Step 2: Connect Your Platforms

This is the most important step. Go to **Dashboard → Platforms** and connect every coding profile you have.

Priority order:
1. **LeetCode** — most heavily weighted for job matching
2. **GitHub** — critical for any development role
3. **Codeforces** — high weight for competitive programming roles
4. **CodeChef** — useful, especially for Indian company hiring
5. **HackerRank** — good for certifications and skill badges

For each platform, enter your username. CodeHiring pulls your data automatically — no manual entry needed.

**Pro tip:** Connect platforms even if your stats aren't great yet. Having a verified "0 contest rating" is better than no data at all — it shows honesty and gives you a baseline to improve from.

## Step 3: Understand Your CodeScore

After syncing, you'll see your CodeScore on the dashboard. This is a normalized score (0–1000) that represents your percentile among all students on CodeHiring.

What moves your score:
- Solving more problems (especially medium/hard on LeetCode)
- Participating in contests
- GitHub commits and project activity
- Platform certifications

Check your score weekly. The trend matters as much as the absolute number.

## Step 4: Review Your Skill Gaps

CodeHiring's AI analyzes your problem-solving history and flags gaps. Common examples:
- Solved lots of arrays/strings but no dynamic programming
- Strong on LeetCode but no competitive programming experience
- Good GitHub activity but no open-source contributions

Use these gaps as a study roadmap. Closing a flagged gap typically moves your CodeScore by 15–30 points.

## Step 5: Browse and Apply to Jobs

Go to **Jobs** to see your matched opportunities. Jobs are sorted by match score — the top results are where your profile aligns best with the recruiter's requirements.

For each job, you'll see:
- Why you matched (specific skills and scores that triggered the match)
- What's missing (skills the recruiter wants that you don't yet have)
- Application instructions

Apply through the platform. Your CodeHiring profile is automatically shared with the recruiter — no separate resume submission needed unless requested.

## Step 6: Keep Your Profile Fresh

Sync your platforms at least once a week. Recruiters can see your last-active date. A profile that hasn't been updated in 3 months signals low engagement.

Set a reminder: every Sunday, solve 2–3 LeetCode problems and push a commit to a project. It takes 30 minutes and keeps your profile active.

## Common Mistakes to Avoid

- **Connecting platforms with incomplete profiles** — Make sure your LeetCode profile is public before connecting
- **Ignoring the skill gap report** — This is free coaching. Use it.
- **Only applying to reach roles** — Apply to a mix: 30% reach, 50% match, 20% safety
- **Not updating after a skill improvement** — Re-sync after completing a course or hitting a milestone

## Final Note

CodeHiring surfaces your effort automatically. The more consistently you practice, the better your profile looks — no extra work required. The platform is only as useful as the data you give it.
    `,
  },
  {
    slug: "campus-hiring-trends-2025",
    date: "January 10, 2025",
    tag: "Trends",
    tagColor: "bg-rose-500/10 text-rose-600",
    title: "Campus Hiring Trends to Watch in 2025",
    excerpt:
      "From AI-assisted screening to skills-first hiring mandates, here's what's reshaping the campus recruitment landscape this year.",
    readTime: "6 min read",
    content: `
## The Landscape Has Shifted

Campus hiring in 2025 looks meaningfully different from three years ago. The post-pandemic hiring boom, followed by the 2023–24 correction, has forced both companies and colleges to rethink their approaches. Here are the trends that are actually shaping outcomes this year.

## 1. Skills-First Hiring is No Longer Optional

Major tech companies have formally dropped degree requirements for many roles. This has created downstream pressure on campus hiring: companies visiting campuses now care less about CGPA and more about demonstrable skills.

For students, this is good news — a lower GPA with strong verified coding stats is increasingly competitive. For colleges, it means placement cells need skill-tracking infrastructure, not just relationship management.

## 2. AI-Assisted Screening is Standard

By mid-2024, most mid-to-large tech companies had integrated some form of AI screening into their hiring pipeline. This ranges from LLM-evaluated coding assessments to AI-powered profile ranking.

The implication: keyword-stuffed resumes are less effective than ever. AI screeners are trained to flag inconsistencies between claimed skills and actual performance signals. Verified profiles win in this environment.

## 3. The Internship-to-PPO Pipeline is Dominant

Pre-placement offers (PPOs) from internships now account for a significant portion of campus placements at top colleges. Companies have realized that a 2–3 month internship is a better signal than a 45-minute technical interview.

For students: treat every internship as a 3-month interview. For colleges: internship placement rates are becoming as important as final placement rates.

## 4. Niche Skill Premiums Are Growing

Generalist developer demand has softened. Demand for specific skills — particularly ML/AI engineering, systems programming, and full-stack with specific framework expertise — has intensified.

Students who have visible, verified depth in a niche skill set (demonstrated through platform stats, projects, or certifications) are commanding significant salary premiums over generalists.

## 5. Placement Data Transparency is Expected

Recruiting teams now routinely ask colleges for batch-level analytics before committing to a campus visit. Colleges that can share structured, verifiable data about their students' coding performance are getting prioritized.

This is a structural shift. The days of "our students are strong" being sufficient are over. Numbers matter.

## 6. Tier-2 and Tier-3 College Talent is Being Discovered

With AI-powered matching tools, companies are increasingly finding strong candidates at colleges they'd never have visited in person. A student from a tier-3 college with a LeetCode rating in the top 10% is now discoverable.

This is perhaps the most significant long-term trend: geographic and institutional bias in hiring is declining as verified performance data becomes the primary signal.

## What to Do With This

**If you're a student:** Focus on depth in 1–2 platforms, pursue an internship aggressively, and make sure your coding activity is visible and verified.

**If you're a placement officer:** Invest in analytics infrastructure now. The colleges winning recruiter relationships in 2025 are the ones that can answer data questions instantly.

**If you're a recruiter:** Expand your campus footprint digitally. The best candidates for your roles may not be at the five colleges you've always visited.
    `,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug.toLowerCase() === slug.toLowerCase())
}
