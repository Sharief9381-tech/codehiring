/**
 * POST /api/student/resume-ai
 * ResumeWorded-style deep analysis:
 * - Overall score with breakdown (Impact, Brevity, Style, Sections, Skills)
 * - Line-by-line bullet analysis with improvement suggestions
 * - ATS keyword scoring against job descriptions
 * - Section-by-section grading
 * - Job-specific match scores
 * - Rewritten bullet suggestions
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions"

function extractPDFText(buf: Buffer): string {
  const raw = buf.toString("latin1")
  const runs = raw.match(/[\x20-\x7E]{4,}/g) ?? []
  return runs.join(" ").replace(/\s{2,}/g, " ").trim()
}

function cleanText(t: string) {
  return t.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ").replace(/\s{2,}/g, " ").trim()
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const doc = await UserModel.findById(user._id as string) as any
    if (!doc) return NextResponse.json({ error: "User not found" }, { status: 404 })
    if (!process.env.GROQ_API_KEY) return NextResponse.json({ error: "AI not configured" }, { status: 503 })

    // Extract resume text
    let resumeText = ""
    if (doc.resumeFile?.dataUri) {
      try {
        const b64 = doc.resumeFile.dataUri.replace(/^data:[^;]+;base64,/, "")
        const buf = Buffer.from(b64, "base64")
        const mime: string = doc.resumeFile.mimeType ?? ""
        resumeText = mime === "text/plain" ? buf.toString("utf-8")
          : mime === "application/pdf" ? extractPDFText(buf)
          : cleanText(buf.toString("utf-8"))
        resumeText = resumeText.slice(0, 4000)
      } catch {}
    }

    const platforms = Object.entries(doc.linkedPlatforms ?? {})
      .filter(([, v]: any) => v?.username)
      .map(([pid, pd]: any) => {
        const s = pd.stats ?? {}
        return `${pid}: @${pd.username} solved=${s.totalSolved ?? s.problemsSolved ?? 0} rating=${s.rating ?? s.currentRating ?? 0}`
      }).join("; ")

    const profileContext = `
Name: ${doc.name}
Branch: ${doc.branch ?? "N/A"} | Graduation: ${doc.graduationYear ?? "N/A"}
Skills listed: ${(doc.skills ?? []).join(", ") || "none"}
Coding platforms: ${platforms || "none"}
Bio: ${doc.bio ?? "none"}
Resume URL: ${doc.resumeUrl ?? "none"}
${resumeText ? `\nRESUME CONTENT:\n${resumeText}` : "\n(No resume file uploaded — analyse profile only)"}`.trim()

    const prompt = `You are a senior technical recruiter with 10+ years experience at Google, Amazon, and top product companies. You are doing a DEEP resume review exactly like ResumeWorded — giving specific, actionable, numbered feedback with clear reasoning for every score.

CANDIDATE PROFILE:
${profileContext}

Analyse this resume/profile and return a comprehensive JSON report. Every score must have a clear "why" explanation — not generic advice, but specific to THIS candidate.

Rules:
- Be brutally honest but constructive
- Every issue must cite the SPECIFIC problem and SPECIFIC fix
- Improved bullets must use strong action verbs + quantified results (numbers, %)
- ATS keywords must be real job-posting keywords for software engineering roles
- Quick wins must be SPECIFIC and actionable (not "improve your resume")

Return ONLY valid JSON:

{
  "overallScore": <0-100>,
  "overallReason": "2 sentence explanation of why this specific score — cite actual resume content",
  "scoreBreakdown": {
    "impact": { "score": <0-20>, "max": 20, "label": "Impact", "why": "Specific reason — e.g. '3 of 5 bullets have no numbers or measurable outcomes'" },
    "brevity": { "score": <0-20>, "max": 20, "label": "Brevity", "why": "Specific reason — e.g. 'Resume fits 1 page but 2 bullets exceed 2 lines'" },
    "style": { "score": <0-20>, "max": 20, "label": "Style", "why": "Specific reason — e.g. 'Consistent formatting, but dates are inconsistently placed'" },
    "sections": { "score": <0-20>, "max": 20, "label": "Sections", "why": "Specific reason — e.g. 'Missing a Summary section and Certifications'" },
    "skills": { "score": <0-20>, "max": 20, "label": "Skills", "why": "Specific reason — e.g. 'Skills listed but not demonstrated in project bullets'" }
  },
  "atsScore": <0-100>,
  "atsReason": "Why this ATS score — e.g. 'Missing 6 high-frequency keywords from SDE job postings'",
  "atsKeywords": {
    "found": ["Python", "REST API", "Git"],
    "missing": ["Docker", "CI/CD", "System Design", "Microservices", "Agile"],
    "density": <0-100>
  },
  "sectionScores": [
    {
      "name": "Work Experience",
      "score": <0-100>,
      "grade": "A|B|C|D|F",
      "feedback": "Specific feedback citing actual content — e.g. 'Your TCS internship bullet says you worked on a project but gives no outcome. Recruiters need to see impact.'",
      "issues": ["Bullet 1: No quantified result — how many users? What % improvement?", "Missing: Technologies used in each role"],
      "howToFix": "Add numbers: 'Improved API response time by 40%' not 'Improved API performance'"
    }
  ],
  "bulletAnalysis": [
    {
      "original": "Worked on backend API development using Python",
      "score": <0-10>,
      "issues": ["Weak verb 'Worked on' — use 'Built', 'Designed', 'Engineered'", "No quantified result — how many endpoints? What load?", "Missing tech stack details"],
      "improved": "Engineered 12 RESTful API endpoints using Python/FastAPI, reducing average response latency by 35% and serving 10,000+ daily requests",
      "explanation": "The original gives no signal of scale or impact. The rewrite uses a strong verb, specifies the number of endpoints, names the framework, quantifies latency improvement, and shows scale (10K requests). Each of these elements increases recruiter confidence."
    }
  ],
  "hardSkills": {
    "present": ["Python", "React", "SQL"],
    "suggested": ["Docker", "Kubernetes", "Redis", "System Design"],
    "suggestedReason": "These appear in 80%+ of SDE job postings at your target companies"
  },
  "softSkills": {
    "present": ["Problem Solving"],
    "suggested": ["Technical Communication", "Cross-functional Collaboration"]
  },
  "jobMatches": [
    {
      "role": "Software Engineer (New Grad)",
      "company": "TCS / Infosys / Wipro tier",
      "match": <0-100>,
      "missingSkills": ["DBMS concepts", "OS fundamentals"],
      "reason": "Strong LeetCode history and internship experience align well. The gap is theoretical CS knowledge tested in NQT.",
      "howToClose": "Add DBMS project or coursework to resume. Mention OS concepts in skills."
    }
  ],
  "wordCount": { "current": <number>, "ideal": "400-600 words", "status": "Too short|Good|Too long", "advice": "Your resume has X words. For a fresher, 450-550 is ideal — enough detail without padding." },
  "formattingIssues": [
    "Dates not consistently right-aligned — use a table or tab stops",
    "Font size varies between sections — standardize to 10-11pt"
  ],
  "strengthPoints": [
    "Strong LeetCode profile with 300+ problems solved — top 20% signal",
    "Internship at a named company shows real-world exposure"
  ],
  "criticalIssues": [
    "No quantified results in any bullet — this alone drops ATS score by 15-20 points",
    "Skills section lists technologies but no proficiency level or context"
  ],
  "quickWins": [
    { "action": "Add 1 number to each internship bullet (users, requests, time saved, % improvement)", "impact": "high", "effort": "low", "whyItMatters": "Quantified bullets are the #1 factor separating shortlisted from rejected resumes at top companies" },
    { "action": "Add Docker and CI/CD to skills — they appear in 70% of SDE JDs", "impact": "high", "effort": "low", "whyItMatters": "ATS systems filter for these keywords before a human sees your resume" }
  ],
  "improvedSummary": "Results-driven Computer Science graduate with proven track record in backend development (Python, Node.js) and competitive programming (LeetCode Top 20%). Delivered production-grade APIs during internship at [Company]. Seeking SDE role to apply strong DSA foundations and system design knowledge.",
  "summaryExplanation": "This summary works because: (1) opens with a credibility signal, (2) names specific tech stack, (3) quantifies coding achievement, (4) shows real-world experience, (5) states clear career objective",
  "templateRecommendation": {
    "name": "Technical",
    "reason": "Your strongest assets are technical skills and coding stats — a Technical template with a prominent skills section and project highlights will showcase these better than a generic template"
  },
  "linkedinTips": [
    "Your LinkedIn headline should match your resume title exactly for ATS consistency",
    "Add your LeetCode profile link to LinkedIn — recruiters actively check this"
  ],
  "interviewReadiness": <0-100>,
  "interviewReadinessReason": "Based on your LeetCode rating and problem count, you can handle standard DSA rounds. Gaps: system design experience not visible in resume, no evidence of large-scale project work."
}`

    const res = await fetch(GROQ_API, {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 4000,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("Groq error:", err)
      return NextResponse.json({ error: "AI analysis failed" }, { status: 500 })
    }

    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content?.trim() ?? ""
    const json = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()

    try {
      const analysis = JSON.parse(json)
      return NextResponse.json({ success: true, analysis })
    } catch {
      console.error("Parse error:", raw.slice(0, 300))
      return NextResponse.json({ error: "AI returned invalid response" }, { status: 500 })
    }
  } catch (err) {
    console.error("Resume AI error:", err)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
