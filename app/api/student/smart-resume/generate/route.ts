/**
 * POST /api/student/smart-resume/generate
 * Generates a complete AI resume from the student's platform data.
 * No file upload needed — uses verified coding stats directly.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { groqChat, isGroqAvailable } from "@/lib/groq"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    if (!isGroqAvailable()) {
      return NextResponse.json({ error: "AI service not configured. Add GROQ_API_KEY to your environment." }, { status: 503 })
    }

    const doc = await UserModel.findById(user._id as string) as any
    if (!doc) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const body = await req.json().catch(() => ({}))
    const { targetRole, additionalInfo } = body

    // Build a rich context from real verified data
    const platforms = doc.linkedPlatforms ?? {}
    const platformSummaries: string[] = []

    for (const [platform, data] of Object.entries(platforms)) {
      const d = data as any
      const stats = d?.stats ?? {}
      if (platform === "leetcode") {
        platformSummaries.push(`LeetCode: ${stats.totalSolved ?? 0} problems solved (Easy: ${stats.easySolved ?? 0}, Medium: ${stats.mediumSolved ?? 0}, Hard: ${stats.hardSolved ?? 0}), ranking #${stats.ranking ?? "N/A"}`)
      } else if (platform === "codeforces") {
        platformSummaries.push(`Codeforces: rating ${stats.rating ?? 0} (${stats.rank ?? "unranked"}), max rating ${stats.maxRating ?? 0}`)
      } else if (platform === "github") {
        platformSummaries.push(`GitHub: ${stats.publicRepos ?? 0} public repos, ${stats.totalContributions ?? 0} contributions, languages: ${Object.keys(stats.languages ?? {}).join(", ")}`)
      } else if (platform === "codechef") {
        platformSummaries.push(`CodeChef: ${stats.stars ?? "1*"} (rating ${stats.currentRating ?? 0}), ${stats.problemsSolved ?? 0} problems solved`)
      } else if (platform === "hackerrank") {
        const badges = (stats.badges ?? []).filter((b: any) => b.stars >= 3)
        if (badges.length > 0) platformSummaries.push(`HackerRank: ${badges.map((b: any) => `${b.name} (${b.stars}★)`).join(", ")}`)
      } else if (platform === "geeksforgeeks") {
        platformSummaries.push(`GeeksForGeeks: coding score ${stats.codingScore ?? 0}, ${stats.problemsSolved ?? 0} problems`)
      }
    }

    const aggregated = doc.aggregatedStats ?? doc.stats ?? {}
    const studentProfile = `
Name: ${doc.name}
Email: ${doc.email}
Branch/Degree: ${doc.branch ?? "Not specified"}
Graduation Year: ${doc.graduationYear ?? "Not specified"}
College: ${doc.collegeCode ?? "Not specified"}
Skills: ${(doc.skills ?? []).join(", ") || "Not specified"}
Target Role: ${targetRole || "Software Engineer / SDE"}
Additional Info: ${additionalInfo || "None"}

VERIFIED CODING STATS:
Total Problems Solved: ${aggregated.totalProblems ?? 0}
Highest Rating: ${aggregated.highestRating ?? 0}
GitHub Contributions: ${aggregated.githubContributions ?? 0}
Contests Participated: ${aggregated.contestsAttended ?? 0}

PLATFORM BREAKDOWN:
${platformSummaries.join("\n") || "No platforms connected yet"}

GitHub Repositories:
${(platforms.github?.stats?.repositories ?? []).slice(0, 5).map((r: any) => `- ${r.name}: ${r.description || "No description"} (${r.language ?? "N/A"})`).join("\n") || "None"}
`.trim()

    const systemPrompt = `You are an expert technical resume writer specializing in software engineering resumes for Indian students/graduates applying to top tech companies.

Given a student's verified coding profile data, generate a complete, professional resume in JSON format.

Return ONLY valid JSON with this exact structure:
{
  "professionalSummary": "3-4 sentence compelling summary highlighting coding achievements, technical strengths, and career goals",
  "technicalSkills": {
    "languages": ["list of programming languages based on platforms and skills"],
    "frameworks": ["relevant frameworks"],
    "tools": ["tools, platforms, databases"],
    "competitiveProgramming": "brief statement about CP achievements"
  },
  "codingAchievements": [
    "Achievement bullet point 1 with numbers (e.g., Solved 500+ problems on LeetCode with Knight badge)",
    "Achievement bullet point 2",
    "Achievement bullet point 3",
    "Achievement bullet point 4"
  ],
  "projectSuggestions": [
    {
      "name": "Project name based on skills",
      "description": "2-3 sentence description with impact metrics",
      "technologies": ["tech1", "tech2"],
      "bullets": ["Key achievement 1", "Key achievement 2"]
    }
  ],
  "careerObjective": "One strong sentence career objective for ${targetRole || "SDE role"}",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "atsScore": <number 60-95 based on profile strength>,
  "atsKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "improvementTips": ["tip 1", "tip 2", "tip 3"],
  "suggestedRoles": ["role1", "role2", "role3"]
}

Make achievements specific and quantified. Use action verbs. Tailor everything to the target role.
Return ONLY valid JSON, no markdown fences, no explanation.`

    const aiResponse = await groqChat(systemPrompt, studentProfile, 2000)

    let generated: Record<string, any>
    try {
      const cleaned = aiResponse.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "").trim()
      generated = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: "AI returned invalid response. Please try again." }, { status: 500 })
    }

    const smartResume = {
      generated,
      generatedAt: new Date().toISOString(),
      targetRole: targetRole || "Software Engineer",
      fromVerifiedData: true,
    }

    await UserModel.update(user._id as string, { smartResumeGenerated: smartResume })

    return NextResponse.json({ success: true, resume: generated, meta: { targetRole, generatedAt: smartResume.generatedAt } })
  } catch (err) {
    console.error("Smart resume generate error:", err)
    return NextResponse.json({ error: err instanceof Error ? err.message : "Generation failed" }, { status: 500 })
  }
}
