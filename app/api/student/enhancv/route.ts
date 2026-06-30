/**
 * POST /api/student/enhancv
 *
 * Free resume parsing pipeline:
 * 1. APILayer Resume Parser API (free, no CC) — parses PDF to structured JSON
 *    Get key: https://apilayer.com/marketplace/resume_parser-api (free signup)
 * 2. Groq AI — deep ResumeWorded-style analysis on the parsed data
 *
 * Falls back to raw text extraction if API key not set.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"

const GROQ_API     = "https://api.groq.com/openai/v1/chat/completions"
const APILAYER_URL = "https://api.apilayer.com/resume_parser/upload"

// ── Extract readable text from PDF buffer ──────────────────────────────────────
function extractPDFText(buf: Buffer): string {
  return (buf.toString("latin1").match(/[\x20-\x7E]{4,}/g) ?? [])
    .join(" ").replace(/\s{2,}/g, " ").trim()
}

// ── Parse resume via APILayer (free tier) ──────────────────────────────────────
async function parseWithAPILayer(fileBuffer: Buffer, fileName: string): Promise<any> {
  const key = process.env.APILAYER_RESUME_KEY
  if (!key) throw new Error("APILAYER_RESUME_KEY not set")

  const form = new FormData()
  form.append("file", new Blob([new Uint8Array(fileBuffer)], { type: "application/octet-stream" }), fileName)

  const res = await fetch(APILAYER_URL, {
    method: "POST",
    headers: { "apikey": key },
    body: form,
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`APILayer error ${res.status}: ${txt.slice(0, 200)}`)
  }
  return res.json()
  /*
   APILayer returns: {
     name, email, phone, address,
     education: [{ degree, institution, graduation_year }],
     work_experience: [{ job_title, company, start_date, end_date, description }],
     skills: [...],
     certifications: [...],
     languages: [...],
     summary: "...",
   }
  */
}

// ── Deep analysis via Groq ─────────────────────────────────────────────────────
async function groqDeepAnalysis(parsedResume: any, profileCtx: string): Promise<any> {
  if (!process.env.GROQ_API_KEY) return null

  const resumeStr = JSON.stringify(parsedResume, null, 2).slice(0, 5000)

  const prompt = `You are a senior technical recruiter at Google/Amazon with 10+ years experience. 
Perform a DEEP ResumeWorded-style review of this candidate's resume.
Be specific — cite actual content from the resume in every explanation.

PARSED RESUME:
${resumeStr}

CANDIDATE CODING PROFILE:
${profileCtx}

Return ONLY valid JSON (no markdown):
{
  "overallScore": <0-100>,
  "overallReason": "2 sentences citing specific resume content",
  "scoreBreakdown": {
    "impact":   { "score": <0-20>, "max": 20, "label": "Impact",   "why": "cite specific bullets or lack thereof" },
    "brevity":  { "score": <0-20>, "max": 20, "label": "Brevity",  "why": "word count / length assessment" },
    "style":    { "score": <0-20>, "max": 20, "label": "Style",    "why": "formatting and consistency" },
    "sections": { "score": <0-20>, "max": 20, "label": "Sections", "why": "sections present vs missing" },
    "skills":   { "score": <0-20>, "max": 20, "label": "Skills",   "why": "skills listed vs demonstrated" }
  },
  "atsScore": <0-100>,
  "atsReason": "why this ATS score, cite missing keywords",
  "atsKeywords": {
    "found": ["up to 8 keywords actually in the resume"],
    "missing": ["up to 8 high-value missing keywords for SDE roles"],
    "density": <0-100>
  },
  "sectionScores": [
    { "name": "Work Experience", "score": <0-100>, "grade": "A|B|C|D|F", "feedback": "cite actual experience from resume", "issues": ["specific issue"], "howToFix": "specific action with example" },
    { "name": "Education",       "score": <0-100>, "grade": "A|B|C|D|F", "feedback": "...", "issues": [], "howToFix": "..." },
    { "name": "Skills",          "score": <0-100>, "grade": "A|B|C|D|F", "feedback": "...", "issues": [], "howToFix": "..." },
    { "name": "Projects",        "score": <0-100>, "grade": "A|B|C|D|F", "feedback": "...", "issues": [], "howToFix": "..." },
    { "name": "Summary",         "score": <0-100>, "grade": "A|B|C|D|F", "feedback": "...", "issues": [], "howToFix": "..." }
  ],
  "bulletAnalysis": [
    {
      "original": "exact bullet from the parsed work_experience or projects",
      "score": <0-10>,
      "issues": ["specific issue with this exact bullet"],
      "improved": "Rewritten with strong verb + metrics + tech stack",
      "explanation": "step-by-step why each change is better"
    }
  ],
  "hardSkills": {
    "present": ["skills from resume"],
    "suggested": ["6-8 specific skills missing for target roles"],
    "suggestedReason": "why these appear in 80%+ of SDE job postings"
  },
  "jobMatches": [
    { "role": "Software Engineer", "company": "Service company (TCS/Infosys)", "match": <0-100>, "missingSkills": [], "reason": "cite resume strengths", "howToClose": "specific actions" },
    { "role": "Backend Developer",  "company": "Product startup",               "match": <0-100>, "missingSkills": [], "reason": "...", "howToClose": "..." },
    { "role": "Full Stack Developer","company": "Mid-size tech company",         "match": <0-100>, "missingSkills": [], "reason": "...", "howToClose": "..." }
  ],
  "wordCount": { "current": <number>, "ideal": "400-600 words", "status": "Too short|Good|Too long", "advice": "specific advice" },
  "strengthPoints": ["cite actual resume strength 1", "cite actual resume strength 2", "cite actual resume strength 3"],
  "criticalIssues": ["specific critical problem 1", "specific critical problem 2"],
  "quickWins": [
    { "action": "specific action with example", "impact": "high", "effort": "low", "whyItMatters": "recruiter/ATS impact with numbers if possible" },
    { "action": "specific action", "impact": "high", "effort": "low", "whyItMatters": "..." },
    { "action": "specific action", "impact": "medium", "effort": "low", "whyItMatters": "..." }
  ],
  "improvedSummary": "rewritten 2-3 sentence summary using actual resume content",
  "summaryExplanation": "break down why each element of the summary works",
  "templateRecommendation": { "name": "Technical|Minimal|Creative|Executive", "reason": "specific to this resume" },
  "linkedinTips": ["specific tip 1", "specific tip 2"],
  "interviewReadiness": <0-100>,
  "interviewReadinessReason": "based on actual resume content and coding profile"
}`

  const res = await fetch(GROQ_API, {
    method: "POST",
    headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 4500,
    }),
  })

  if (!res.ok) return null
  const data = await res.json()
  const raw  = data.choices?.[0]?.message?.content?.trim() ?? ""
  const json = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
  try { return JSON.parse(json) } catch { return null }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const doc = await UserModel.findById(user._id as string) as any
    if (!doc) return NextResponse.json({ error: "User not found" }, { status: 404 })

    // Get file from request or stored
    const contentType = req.headers.get("content-type") ?? ""
    let fileBuffer: Buffer | null = null
    let fileName = "resume.pdf"

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData()
      const file = form.get("file") as File | null
      if (file) { fileBuffer = Buffer.from(await file.arrayBuffer()); fileName = file.name }
    }

    if (!fileBuffer && doc.resumeFile?.dataUri) {
      const b64 = doc.resumeFile.dataUri.replace(/^data:[^;]+;base64,/, "")
      fileBuffer  = Buffer.from(b64, "base64")
      fileName   = doc.resumeFile.fileName ?? "resume.pdf"
    }

    if (!fileBuffer) {
      return NextResponse.json({ error: "No resume file found. Upload your resume first." }, { status: 400 })
    }

    // Build candidate coding profile context
    const platforms = Object.entries(doc.linkedPlatforms ?? {})
      .filter(([, v]: any) => v?.username)
      .map(([pid, pd]: any) => {
        const s = pd.stats ?? {}
        return `${pid}: solved=${s.totalSolved ?? s.problemsSolved ?? 0} rating=${s.rating ?? s.currentRating ?? 0}`
      }).join(" | ")

    const profileCtx = `Name: ${doc.name} | Branch: ${doc.branch ?? "N/A"} | Grad: ${doc.graduationYear ?? "N/A"} | Skills: ${(doc.skills ?? []).join(", ") || "none"} | Coding: ${platforms || "none"}`

    let parsedResume: any = null
    let parseSource = "fallback"

    // Step 1: Try APILayer free parser
    if (process.env.APILAYER_RESUME_KEY) {
      try {
        parsedResume = await parseWithAPILayer(fileBuffer, fileName)
        parseSource  = "apilayer"
      } catch (e) {
        console.error("APILayer failed:", e)
      }
    }

    // Step 2: Fallback — extract raw text and structure it ourselves via Groq
    if (!parsedResume) {
      const rawText = extractPDFText(fileBuffer).slice(0, 4000)
      parsedResume  = { rawText, source: "text_extracted" }
      parseSource   = "groq_only"
    }

    // Step 3: Deep analysis
    const analysis = await groqDeepAnalysis(parsedResume, profileCtx)
    if (!analysis) return NextResponse.json({ error: "AI analysis failed" }, { status: 500 })

    analysis._parseSource = parseSource
    return NextResponse.json({ success: true, analysis, parseSource })

  } catch (err: any) {
    console.error("Resume analysis error:", err)
    return NextResponse.json({ error: err.message ?? "Analysis failed" }, { status: 500 })
  }
}
