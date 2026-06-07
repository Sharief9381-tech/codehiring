/**
 * GET /api/landing
 * Returns all dynamic content for the landing page:
 * - site config (hero copy, testimonials, featured companies, announcement)
 * - live stats (students, colleges, recruiters, drives, problems, applications)
 * - topColleges: top 8 verified colleges by student count (uses collegeCode)
 * - open career count
 * - recent blog post count
 */
import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"
import { SiteConfigModel } from "@/lib/models/site-config"
import { blogPosts } from "@/lib/blog-posts"

export const revalidate = 60

export async function GET() {
  const siteConfig = isDatabaseAvailable()
    ? await SiteConfigModel.get().catch(() => SiteConfigModel.getDefault())
    : SiteConfigModel.getDefault()

  const fallbackStats = {
    students: 0, colleges: 0, recruiters: 0,
    drives: 0, problemsSolved: 0, applications: 0,
  }

  let stats = fallbackStats
  let openCareers = 0
  let topColleges: string[] = []

  if (isDatabaseAvailable()) {
    try {
      const db = await getDatabase()

      const [roleCounts, jobCounts, problemsResult, applicationsResult, careersResult, collegesResult] =
        await Promise.all([
          // Role counts for stats
          db.collection("users").aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
          ]).toArray(),

          // Total job/drive count
          db.collection("jobs").countDocuments(),

          // Total problems solved by students
          db.collection("users").aggregate([
            { $match: { role: "student" } },
            { $group: { _id: null, total: { $sum: { $ifNull: ["$aggregatedStats.totalProblems", { $ifNull: ["$stats.totalProblems", 0] }] } } } },
          ]).toArray(),

          // Total applications
          db.collection("jobs").aggregate([
            { $group: { _id: null, total: { $sum: { $ifNull: ["$applications", 0] } } } },
          ]).toArray(),

          // Open careers
          db.collection("careers").countDocuments({ active: true }),

          // Top 8 verified colleges by student count:
          // 1. Group students by collegeCode, count them
          // 2. Join to college accounts (verified = college account exists)
          // 3. Filter only verified ones
          // 4. Sort by student count desc, take top 8
          // 5. Return the collegeCode
          db.collection("users").aggregate([
            { $match: { role: "student", collegeCode: { $exists: true, $ne: null, $ne: "" } } },
            { $group: { _id: "$collegeCode", studentCount: { $sum: 1 } } },
            { $sort: { studentCount: -1 } },
            { $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "collegeCode",
              as: "collegeAccount",
              pipeline: [
                { $match: { role: "college" } },
                { $project: { collegeCode: 1 } }
              ]
            }},
            // Only keep if a verified college account exists
            { $match: { "collegeAccount.0": { $exists: true } } },
            { $limit: 8 },
            { $project: { _id: 0, collegeCode: "$_id", studentCount: 1 } }
          ]).toArray(),
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
      topColleges = collegesResult.map((c: any) => c.collegeCode).filter(Boolean)

    } catch (e) {
      console.error("Landing API error:", e)
    }
  }

  return NextResponse.json({
    siteConfig,
    stats,
    openCareers,
    topColleges,
    recentPosts: blogPosts.slice(0, 3).map(({ slug, title, tag, tagColor, date, readTime, excerpt }) => ({
      slug, title, tag, tagColor, date, readTime, excerpt,
    })),
  })
}
