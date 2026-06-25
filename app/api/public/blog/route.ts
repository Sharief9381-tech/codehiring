/**
 * GET /api/public/blog          — list published posts (DB first, static fallback)
 * GET /api/public/blog?slug=x   — single post by slug
 *
 * Self-triggers daily auto-generation if no post exists for today.
 */
import { NextResponse } from "next/server"
import { isDatabaseAvailable } from "@/lib/database"
import { BlogModel } from "@/lib/models/blog"
import { blogPosts, getPostBySlug } from "@/lib/blog-posts"

export const revalidate = 300 // 5 min cache

async function triggerDailyPostIfNeeded(baseUrl: string) {
  try {
    const { getDatabase } = await import("@/lib/database")
    const db = await getDatabase()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const count = await db.collection("blogs").countDocuments({ createdAt: { $gte: today } })
    if (count === 0) {
      // Fire-and-forget — don't await so we don't block the response
      fetch(`${baseUrl}/api/cron/generate-blog`, { method: "POST" }).catch(() => {})
    }
  } catch {}
}

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const slug = searchParams.get("slug")

  // ── Single post ──
  if (slug) {
    if (isDatabaseAvailable()) {
      try {
        const post = await BlogModel.findBySlug(slug)
        if (post) return NextResponse.json({ post })
      } catch {}
    }
    const post = getPostBySlug(slug)
    return post
      ? NextResponse.json({ post })
      : NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // ── All posts ──
  if (isDatabaseAvailable()) {
    try {
      // Self-trigger daily post generation (non-blocking)
      triggerDailyPostIfNeeded(origin)

      const posts = await BlogModel.findAll(true)
      if (posts.length >= 3) {
        return NextResponse.json({
          posts: posts.map(({ _id, slug, title, excerpt, tag, tagColor, date, readTime, published }) => ({
            _id, slug, title, excerpt, tag, tagColor, date, readTime, published,
          })),
        })
      }
      // Less than 3 DB posts — pad with static posts
      if (posts.length > 0) {
        const dbSlugs = new Set(posts.map((p: any) => p.slug))
        const staticPad = [...blogPosts]
          .filter(p => !dbSlugs.has(p.slug))
          .slice(0, 3 - posts.length)
        const combined = [
          ...posts.map(({ _id, slug, title, excerpt, tag, tagColor, date, readTime, published }: any) => ({
            _id, slug, title, excerpt, tag, tagColor, date, readTime, published,
          })),
          ...staticPad.map(({ slug, title, excerpt, tag, tagColor, date, readTime }) => ({
            slug, title, excerpt, tag, tagColor, date, readTime, published: true,
          })),
        ]
        return NextResponse.json({ posts: combined })
      }
    } catch {}
  }

  // Static fallback — sorted newest first
  const sorted = [...blogPosts].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  return NextResponse.json({
    posts: sorted.map(({ slug, title, excerpt, tag, tagColor, date, readTime }) => ({
      slug, title, excerpt, tag, tagColor, date, readTime, published: true,
    })),
  })
}
