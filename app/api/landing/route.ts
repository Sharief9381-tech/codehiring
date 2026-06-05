/**
 * GET /api/landing
 * Returns all dynamic content for the landing page:
 * - site config (hero copy, testimonials, featured companies, announcement)
 * - live stats (students, colleges, recruiters, drives, problems, applications)
 * - open career count
 * - recent blog post count
 */
import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"
import { SiteConfigModel } from "@/lib/models/site-config"
import { blogPosts } from "@/lib/blog-posts"

export const revalidate = 60

export async function GET() {
  // Always return site config (falls back to defaults if DB unavailable)
  const siteConfig = isDatabaseAvailable()
    ? await SiteConfigModel.get().catch(() => SiteConfigModel.getDefault())
    : SiteConfigModel.getDefault()

  const fallbackStats = {
    students: 0, colleges: 0, recruiters: 0,
    drives: 0, problemsSolved: 0, applications: 0,
  }

  let stats = fallbackStats
  let openCareers = 0

  if (isDatabaseAvailable()) {
    try {
      const db = await getDatabase()

      const [roleCounts, jobCounts, problemsResult, applicationsResult, careersResult] =
        await Promise.all([
          db.collection("users").aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]).toArray(),
          db.collection("jobs").countDocuments(),
          db.collection("users").aggregate([
            { $match: { role: "student" } },
            { $group: { _id: null, total: { $sum: { $ifNull: ["$aggregatedStats.totalProblems", { $ifNull: ["$stats.totalProblems", 0] }] } } } },
          ]).toArray(),
          db.collection("jobs").aggregate([
            { $group: { _id: null, total: { $sum: { $ifNull: ["$applications", 0] } } } },
          ]).toArray(),
          db.collection("careers").countDocuments({ active: true }),
        ])

      const roleMap: Record<string, number> = {}
      for (const r of roleCounts) if (r._id) roleMap[r._id] = r.count

      stats = {
        students: roleMap["student"] ?? 0,
        colleges: roleMap["college"] ?? 0,
        recruiters: roleMap["recruiter"] ?? 0,
        drives: jobCounts ?? 0,
        problemsSolved: problemsResult[0]?.total ?? 0,
        applications: applicationsResult[0]?.total ?? 0,
      }
      openCareers = careersResult ?? 0
    } catch (e) {
      console.error("Landing API error:", e)
    }
  }

  return NextResponse.json({
    siteConfig,
    stats,
    openCareers,
    recentPosts: blogPosts.slice(0, 3).map(({ slug, title, tag, tagColor, date, readTime, excerpt }) => ({
      slug, title, tag, tagColor, date, readTime, excerpt,
    })),
  })
}
