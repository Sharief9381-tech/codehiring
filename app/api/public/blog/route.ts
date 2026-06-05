/**
 * GET /api/public/blog          — list published posts (DB first, fallback to static)
 * GET /api/public/blog?slug=x   — single post by slug
 */
import { NextResponse } from "next/server"
import { isDatabaseAvailable } from "@/lib/database"
import { BlogModel } from "@/lib/models/blog"
import { blogPosts, getPostBySlug } from "@/lib/blog-posts"

export const revalidate = 60

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")

  // ── Single post ──
  if (slug) {
    if (isDatabaseAvailable()) {
      try {
        const post = await BlogModel.findBySlug(slug)
        if (post) return NextResponse.json({ post })
      } catch {}
    }
    // Fallback to static
    const post = getPostBySlug(slug)
    return post
      ? NextResponse.json({ post })
      : NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // ── All posts ──
  if (isDatabaseAvailable()) {
    try {
      const posts = await BlogModel.findAll(true)
      if (posts.length > 0) return NextResponse.json({ posts })
    } catch {}
  }
  // Fallback to static
  return NextResponse.json({
    posts: blogPosts.map(({ slug, title, excerpt, tag, tagColor, date, readTime }) => ({
      slug, title, excerpt, tag, tagColor, date, readTime, published: true,
    })),
  })
}
