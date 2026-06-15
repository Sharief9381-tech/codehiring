/**
 * POST /api/cron/generate-blog
 *
 * Generates a fresh, unique blog post via Groq AI and saves it to MongoDB.
 * - Runs at most ONCE per day (skips if today's post already exists)
 * - Can be called from:
 *   1. A Vercel cron job (vercel.json)
 *   2. The blog listing page (self-trigger on daily first load)
 *   3. Manually via HTTP POST
 *
 * Protected by CRON_SECRET env var (optional — skipped in dev if not set).
 */

import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"
import { BlogModel } from "@/lib/models/blog"

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions"

const TAG_OPTIONS = [
  { tag: "Insights",     tagColor: "bg-primary/10 text-primary" },
  { tag: "For Colleges", tagColor: "bg-emerald-500/10 text-emerald-600" },
  { tag: "Recruiting",   tagColor: "bg-amber-500/10 text-amber-600" },
  { tag: "Product",      tagColor: "bg-violet-500/10 text-violet-600" },
  { tag: "Guide",        tagColor: "bg-cyan-500/10 text-cyan-600" },
  { tag: "Trends",       tagColor: "bg-rose-500/10 text-rose-600" },
  { tag: "Career",       tagColor: "bg-sky-500/10 text-sky-600" },
]

const TOPICS = [
  "how to crack FAANG interviews with competitive programming",
  "the rise of skills-based hiring in India",
  "how placement cells can use analytics to improve outcomes",
  "LeetCode vs Codeforces — which matters more for jobs",
  "building a strong GitHub profile for campus placements",
  "how AI is changing technical screening in 2026",
  "top coding mistakes students make before placement season",
  "why consistent practice beats cramming before interviews",
  "remote internships and how to stand out",
  "salary negotiation tips for first-time job seekers",
  "how to choose between service companies and product companies",
  "competitive programming roadmap for beginners",
  "open source contributions that impress recruiters",
  "how to prepare for system design interviews",
  "resume red flags that make recruiters skip your profile",
  "the importance of data structures in real-world engineering",
  "how to network effectively as a student developer",
  "DSA problem patterns every student must know",
  "building full-stack projects that get you hired",
  "how college rank affects your placement — the data truth",
  "what recruiters actually look at in your GitHub",
  "internship to full-time conversion strategies",
  "how to use HackerRank certifications effectively",
  "the real difference between a good coder and a great engineer",
  "understanding time and space complexity for interviews",
]

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function todayDateString() {
  return new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

async function alreadyPostedToday(): Promise<boolean> {
  try {
    const db = await getDatabase()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const count = await db.collection("blogs").countDocuments({
      createdAt: { $gte: today },
    })
    return count > 0
  } catch {
    return false
  }
}

async function getRecentTitles(): Promise<string[]> {
  try {
    const db = await getDatabase()
    const docs = await db.collection("blogs").find({}, { projection: { title: 1 } })
      .sort({ createdAt: -1 }).limit(20).toArray()
    return docs.map((d: any) => d.title)
  } catch {
    return []
  }
}

async function generatePost(topic: string, recentTitles: string[]): Promise<{
  title: string; slug: string; excerpt: string; content: string;
  tag: string; tagColor: string; readTime: string
} | null> {
  if (!process.env.GROQ_API_KEY) return null

  const tagOpt = TAG_OPTIONS[Math.floor(Math.random() * TAG_OPTIONS.length)]
  const avoidList = recentTitles.slice(0, 5).map(t => `- ${t}`).join("\n")

  const prompt = `You are a professional tech blogger writing for CodeHiring — a platform that helps students, colleges, and recruiters use verified coding data for placements.

Write a high-quality, practical blog post about: "${topic}"

Requirements:
- Unique — do NOT write about these recent topics:
${avoidList || "  (none yet)"}
- Audience: Indian CS/IT students, college placement cells, tech recruiters
- Tone: authoritative, practical, friendly — like a senior engineer advising a junior
- Length: 500–700 words of body content
- Use markdown formatting:
  - ## for main headings (2–4 of them)
  - ### for sub-headings where needed
  - **bold** for key terms
  - - bullet points for lists
  - 1. numbered lists for steps

Respond with ONLY valid JSON (no markdown code fence, no explanation):
{
  "title": "Compelling article title (max 70 chars)",
  "excerpt": "2-sentence compelling summary for the blog list (max 160 chars)",
  "content": "Full markdown article body...",
  "readTime": "X min read"
}`

  try {
    const res = await fetch(GROQ_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.85,
        max_tokens: 1200,
      }),
    })

    if (!res.ok) return null
    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content?.trim()
    if (!raw) return null

    // Strip any accidental code fences
    const json = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
    const parsed = JSON.parse(json)

    return {
      title:    parsed.title    ?? `Blog Post — ${todayDateString()}`,
      slug:     slugify(parsed.title ?? topic),
      excerpt:  parsed.excerpt  ?? "",
      content:  parsed.content  ?? "",
      readTime: parsed.readTime ?? "5 min read",
      tag:      tagOpt.tag,
      tagColor: tagOpt.tagColor,
    }
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  // Optional secret check
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get("authorization") ?? req.headers.get("x-cron-secret") ?? ""
    if (auth.replace("Bearer ", "") !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  if (!isDatabaseAvailable()) {
    return NextResponse.json({ skipped: true, reason: "DB unavailable" })
  }

  // Skip if already posted today
  if (await alreadyPostedToday()) {
    return NextResponse.json({ skipped: true, reason: "Already posted today" })
  }

  // Pick a random topic
  const recentTitles = await getRecentTitles()
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)]

  const generated = await generatePost(topic, recentTitles)
  if (!generated) {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }

  // Ensure slug is unique
  let slug = generated.slug
  const existing = await BlogModel.findBySlug(slug)
  if (existing) slug = `${slug}-${Date.now()}`

  const post = await BlogModel.create({
    ...generated,
    slug,
    date: todayDateString(),
    published: true,
  })

  return NextResponse.json({ success: true, post: { _id: post._id, title: post.title, slug: post.slug } })
}

// Also allow GET for easy manual triggering / Vercel cron
export async function GET(req: Request) {
  return POST(req)
}
