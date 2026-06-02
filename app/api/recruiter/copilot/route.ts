/**
 * POST /api/recruiter/copilot
 * Recruiter pastes a Job Description → AI finds best matching students
 * and generates a Candidate Strength Report for each.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { isDatabaseAvailable } from "@/lib/database"
import { groqChat, isGroqAvailable } from "@/lib/groq"
import { computeMatchScore } from "@/lib/services/job-matcher"

function getStudentStats(student: any) {
  let totalProblems = 0, highestRating = 0, githubContributions = 0, contests = 0
  const platforms: string[] = []

  Object.entries(student.linkedPlatforms || {}).forEach(([pid, data]: [string, any]) => {
    if (!data?.stats) return
    platforms.push(pid)
    const s = data.stats
    totalProblems += s.totalSolved || s.problemsSolved || 0
    if (pid === "github") githubContributions = s.totalContributions || 0
    const r = Math.max(s.rating || 0, s.currentRating || 0, s.highestRating || 0, s.contestRating || 0)
    if (r > highestRating) highestRating = r
    contests += s.contests?.length || s.contestsParticipated || s.attendedContestsCount || 0
  })

  return { totalProblems, highestRating, githubContributions, contests, platforms }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "DB unavailable" }, { status: 503 })
    }

    const { jobDescription, topN = 5 } = await request.json()
    if (!jobDescription?.trim()) {
      return NextResponse.json({ error: "Job description required" }, { status: 400 })
    }

    // Step 1: Extract requirements from JD using AI (or fallback to keyword extraction)
    let requiredSkills: string[] = []
    let minProblems = 0
    let minRating = 0
    let roleTitle = "Software Engineer"

    if (isGroqAvailable()) {
      try {
        const extractPrompt = `Extract from this job description and respond ONLY with JSON:
{
  "roleTitle": "job title",
  "requiredSkills": ["skill1", "skill2"],
  "minProblems": 0,
  "minRating": 0
}
Keep skills lowercase. minProblems and minRating are numbers (0 if not mentioned).`

        const raw = await groqChat(extractPrompt, jobDescription, 300)
        const match = raw.match(/\{[\s\S]*\}/)
        if (match) {
          const parsed = JSON.parse(match[0])
          requiredSkills = parsed.requiredSkills || []
          minProblems = parsed.minProblems || 0
          minRating = parsed.minRating || 0
          roleTitle = parsed.roleTitle || roleTitle
        }
      } catch { /* fallback to keyword extraction */ }
    }

    // Fallback: simple keyword extraction
    if (requiredSkills.length === 0) {
      const commonSkills = ["java", "python", "javascript", "typescript", "react", "node", "spring", "django",
        "sql", "mongodb", "aws", "docker", "kubernetes", "c++", "golang", "rust", "flutter", "android", "ios",
        "machine learning", "deep learning", "data science", "devops", "git", "linux"]
      const jdLower = jobDescription.toLowerCase()
      requiredSkills = commonSkills.filter(s => jdLower.includes(s))
    }

    // Step 2: Find matching students
    const allStudents = await UserModel.findByRole("student")

    const fakeJob = {
      _id: "copilot",
      skills: requiredSkills,
      minProblems,
      minRating,
      status: "active" as const,
      title: roleTitle,
      type: "Full-time" as const,
      location: "",
      salary: "",
      description: jobDescription,
      applications: 0,
      views: 0,
      recruiterId: user._id as string,
      recruiterName: user.name,
      companyName: (user as any).companyName || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const scored = allStudents
      .filter(s => (s as any).isOpenToWork !== false)
      .map(s => {
        const st = getStudentStats(s)
        const matchScore = computeMatchScore({
          skills: s.skills || [],
          totalProblems: st.totalProblems,
          rating: st.highestRating,
          platformCount: st.platforms.length,
          isOpenToWork: (s as any).isOpenToWork ?? true,
        }, fakeJob)

        const studentSkillsLower = (s.skills || []).map((sk: string) => sk.toLowerCase())
        const matchedSkills = requiredSkills.filter(sk => studentSkillsLower.includes(sk))
        const missingSkills = requiredSkills.filter(sk => !studentSkillsLower.includes(sk))

        return {
          _id: s._id?.toString(),
          name: s.name,
          college: (s as any).collegeCode || "",
          branch: (s as any).branch || "",
          matchScore,
          matchedSkills,
          missingSkills,
          stats: st,
          skills: s.skills || [],
          profileSlug: s.name?.toLowerCase().replace(/\s+/g, "-"),
        }
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, topN)

    // Step 3: Generate AI strength report for top candidates (if Groq available)
    const candidates = await Promise.all(
      scored.map(async (c) => {
        if (!isGroqAvailable() || c.matchScore < 30) {
          return {
            ...c,
            aiReport: null,
            recommendation: c.matchScore >= 70 ? "Strong Candidate" : c.matchScore >= 50 ? "Good Candidate" : "Potential Candidate",
          }
        }

        try {
          const reportPrompt = `You are a technical recruiter. Generate a brief candidate strength report.
Respond ONLY with JSON:
{
  "recommendation": "Strong Candidate|Good Candidate|Potential Candidate|Not Recommended",
  "problemSolving": 8.5,
  "consistency": 7.0,
  "technicalDepth": 8.0,
  "summary": "2 sentence summary",
  "risks": ["risk if any"]
}
Scores are out of 10.`

          const candidateInfo = `
Candidate: ${c.name}
College: ${c.college}, Branch: ${c.branch}
Problems Solved: ${c.stats.totalProblems}
Highest Rating: ${c.stats.highestRating}
GitHub Contributions: ${c.stats.githubContributions}
Contests: ${c.stats.contests}
Skills: ${c.skills.join(", ")}
Matched Skills: ${c.matchedSkills.join(", ")}
Missing Skills: ${c.missingSkills.join(", ")}
Match Score: ${c.matchScore}%
Job: ${roleTitle}`

          const raw = await groqChat(reportPrompt, candidateInfo, 400)
          const match = raw.match(/\{[\s\S]*\}/)
          const report = match ? JSON.parse(match[0]) : null

          return { ...c, aiReport: report, recommendation: report?.recommendation || "Good Candidate" }
        } catch {
          return { ...c, aiReport: null, recommendation: "Good Candidate" }
        }
      })
    )

    return NextResponse.json({
      roleTitle,
      requiredSkills,
      totalMatched: scored.length,
      candidates,
    })
  } catch (error) {
    console.error("Recruiter copilot error:", error)
    return NextResponse.json({ error: "Copilot failed" }, { status: 500 })
  }
}
