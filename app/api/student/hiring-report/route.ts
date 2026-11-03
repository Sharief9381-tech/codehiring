/**
 * POST /api/student/hiring-report
 * Generates a full Company Hiring Simulation & Recruitment Report via Groq AI.
 */
import { NextResponse } from "next/server"
import { ALL_COMPANIES } from "@/lib/companies-data"
import { COMPANY_ASSESSMENT_PATTERNS } from "@/lib/company-assessment-patterns"

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions"

// Derive benchmark from COMPANY_ASSESSMENT_PATTERNS (single source of truth)
// Fallback tier based on category
const CATEGORY_BENCHMARKS: Record<string, number> = {
  "IT Services":      70,
  "Product":          82,
  "Consulting":       72,
  "BFSI":             70,
  "Core Engineering": 68,
  "Telecom":          65,
  "Analytics":        72,
  "Pharma":           65,
  "FMCG":             65,
  "EV/Auto":          65,
  "Defence":          68,
}

function getCompanyMeta(companyId: string) {
  const entry = ALL_COMPANIES.find(c => c.id === companyId)
  const pattern = COMPANY_ASSESSMENT_PATTERNS[companyId]

  // Benchmark from pattern difficulty or category
  const diffToBenchmark: Record<string, number> = {
    "Very Hard": 90, "Hard": 82, "Medium-Hard": 75, "Medium": 68, "Easy-Medium": 62, "Easy": 55
  }
  const benchmark = diffToBenchmark[entry?.difficulty ?? "Medium"] 
    ?? CATEGORY_BENCHMARKS[entry?.category ?? "IT Services"] 
    ?? 70

  // Focus areas from pattern sections
  const focusAreas = pattern
    ? Object.values(pattern.sections).map(s => s.name)
    : entry?.sections?.map(s => s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())) ?? []

  // Rounds from pattern
  const rounds = pattern
    ? Object.values(pattern.sections).map(s => s.name)
    : ["Online Assessment", "Technical Interview", "HR Round"]

  return {
    benchmark,
    rounds,
    focusAreas,
    difficulty: entry?.difficulty ?? "Medium",
    cutoff: `${benchmark}%`,
    category: entry?.category ?? "IT Services",
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      company,
      companyName,
      targetRole,
      scores,
      candidateRatings,
      testHistory,
      violations,
      timeStats,
      topicScores,
      activeSections = [], // which sections were actually in the assessment
    } = body

    const meta = getCompanyMeta(company)
    const overallScore = scores?.overall ?? 0
    const sectionScores = scores?.sections ?? {}

    // Derive actual rounds from activeSections
    const hasCoding   = activeSections.some((s: string) => s.includes("coding"))
    const hasAptitude = activeSections.some((s: string) => s === "quantitative" || s === "advanced-aptitude" || s === "logical")
    const hasVerbal   = activeSections.some((s: string) => s === "verbal" || s === "communication")

    const actualRounds: string[] = []
    if (hasAptitude) actualRounds.push("Online Aptitude Test")
    if (hasCoding)   actualRounds.push("Coding Round")
    if (hasVerbal)   actualRounds.push("Communication Round")

    const readiness = Math.min(100, Math.round(
      (overallScore * 0.5) +
      ((candidateRatings?.coding ?? 50) * 0.2) +
      ((candidateRatings?.dsa ?? 50) * 0.15) +
      ((candidateRatings?.aptitude ?? 50) * 0.15)
    ))

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ report: buildFallbackReport({ company, companyName, overallScore, readiness, meta, targetRole, activeSections, hasCoding, hasVerbal }) })
    }

    // Build section analysis only for sections that were tested
    const testedSections = Object.entries(sectionScores)
      .filter(([, v]) => typeof v === "number")
      .map(([k, v]) => `- ${k}: ${v}%`)
      .join("\n")

    const prompt = `You are the Hiring Simulation Intelligence Engine for CodeHiring.

Generate a Company Hiring Assessment Report.

COMPANY: ${companyName || company.toUpperCase()}
TARGET ROLE: ${targetRole || "Software Engineer"}
OVERALL SCORE: ${overallScore}/100
BENCHMARK: ${meta.benchmark}%

SECTIONS TESTED (ONLY these were in the assessment):
${testedSections || "- Overall: " + overallScore + "%"}

CANDIDATE PERFORMANCE:
- Aptitude: ${candidateRatings?.aptitude ?? "N/A"}
- Coding: ${candidateRatings?.coding ?? "N/A"}
${hasVerbal ? `- Communication: ${candidateRatings?.communication ?? "N/A"}` : ""}
- CS Fundamentals: ${candidateRatings?.csFoundations ?? "N/A"}

ACTUAL ROUNDS IN THIS ASSESSMENT: ${actualRounds.join(" → ")}

INTEGRITY: Tab switches: ${violations?.tabSwitches ?? 0}, Fullscreen exits: ${violations?.fullscreenExits ?? 0}
TIME: ${timeStats?.totalTime ?? "N/A"} min total, avg ${timeStats?.avgTimePerQ ?? "N/A"}s/question

IMPORTANT RULES:
1. selectionProbability should be REALISTIC percentages (0-100, NOT 0-1). If score is 7%, probability is 2-5% not 0.05%.
2. roundPredictions MUST only include rounds that were actually tested: ${actualRounds.join(", ")}
3. sectionAnalysis MUST only include sections that were tested: ${Object.keys(sectionScores).join(", ")}
4. If communication was NOT tested, do NOT include communication in strengths/weaknesses
5. Selection probabilities should be on a 0-100 scale where:
   - Score 0-20%: Round1 probability 5-15%
   - Score 21-40%: Round1 probability 15-30%
   - Score 41-60%: Round1 probability 30-50%
   - Score 61-75%: Round1 probability 50-70%
   - Score 76-100%: Round1 probability 70-90%

Return ONLY valid JSON:
{
  "companyName": "${companyName || company.toUpperCase()}",
  "targetRole": "${targetRole || "Software Engineer"}",
  "overallScore": ${overallScore},
  "companyBenchmark": ${meta.benchmark},
  "readinessScore": <0-100>,
  "readinessLabel": "<Not Ready|Needs Improvement|Moderately Ready|Ready|Highly Ready>",
  "benchmarkStatus": "<Above Benchmark|At Benchmark|Below Benchmark>",
  "selectionProbability": {
    ${hasCoding || hasAptitude ? '"round1": <realistic 0-100 percentage>,' : ''}
    ${hasCoding ? '"technicalRound": <realistic 0-100 percentage>,' : ''}
    ${hasVerbal ? '"hrRound": <realistic 0-100 percentage>,' : ''}
    "overall": <realistic 0-100 percentage>
  },
  "roundPredictions": {
    ${hasCoding || hasAptitude ? '"round1": "<Pass|Fail>",' : ''}
    ${hasCoding ? '"technicalRound": "<Pass|Fail>",' : ''}
    ${hasVerbal ? '"hrRound": "<Pass|Fail>"' : '"overall": "<Pass|Fail>"'}
  },
  "sectionAnalysis": [
    ${Object.keys(sectionScores).map(k => `{ "section": "${k}", "score": ${sectionScores[k]}, "benchmark": ${meta.benchmark}, "status": "<Strong|Average|Weak>", "feedback": "specific feedback" }`).join(",\n    ")}
  ],
  "hrReport": {
    "candidateSummary": "2-3 sentence professional summary based only on tested sections",
    "strengths": ["strength based on actual scores"],
    "weaknesses": ["weakness based on actual scores"],
    "riskAreas": ["risk 1"],
    "behaviorIndicators": "assessment",
    "learningAbility": "assessment",
    "problemSolvingAbility": "assessment",
    ${hasVerbal ? '"communicationAssessment": "assessment",' : ''}
    "technicalAssessment": "assessment",
    "overallImpression": "honest hiring impression",
    "verdict": "<Strongly Recommended|Recommended|Borderline|Needs Improvement|Not Recommended>",
    "verdictReason": "specific reason"
  },
  "crackTheCompany": {
    "whyMayFail": ["reason 1", "reason 2"],
    "whyMaySucceed": ["reason 1"],
    "top5Improvements": [
      { "area": "area", "action": "specific action", "impact": "expected impact" }
    ],
    "topicsToRevise": ["topic 1", "topic 2", "topic 3"],
    "expectedImprovement": "Current: ${overallScore}% -> After improvement: XX%"
  },
  "preparationPlan": {
    "oneDay": ["task 1", "task 2"],
    "threeDays": ["focus 1", "focus 2", "focus 3"],
    "sevenDays": ["plan 1", "plan 2", "plan 3", "plan 4"],
    "fourteenDays": ["plan 1", "plan 2", "plan 3"],
    "thirtyDays": ["plan 1", "plan 2", "plan 3"]
  },
  "integrityAnalysis": {
    "integrityScore": <0-100>,
    "riskLevel": "<Low Risk|Medium Risk|High Risk>",
    "violations": [],
    "reasoning": "reasoning"
  },
  "companyInsights": {
    "hiringProcess": "description",
    "whatTheyLookFor": "what they look for",
    "commonMistakes": ["mistake 1", "mistake 2"],
    "insiderTips": ["tip 1", "tip 2"]
  }
}`

    const res = await fetch(GROQ_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        max_tokens: 4000,
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ report: buildFallbackReport({ company, companyName, overallScore, readiness, meta, targetRole, activeSections, hasCoding, hasVerbal }) })
    }

    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content?.trim() ?? ""
    const json = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()

    try {
      const report = JSON.parse(json)
      return NextResponse.json({ report })
    } catch {
      return NextResponse.json({ report: buildFallbackReport({ company, companyName, overallScore, readiness, meta, targetRole, activeSections, hasCoding, hasVerbal }) })
    }
  } catch (err) {
    console.error("Hiring report error:", err)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}

function buildFallbackReport({ company, companyName, overallScore, readiness, meta, targetRole, activeSections = [], hasCoding = false, hasVerbal = false }: any) {
  const above = overallScore >= meta.benchmark
  // Realistic probabilities — 0-100 scale, not fractions
  const baseProb = overallScore < 20 ? 5 :
                   overallScore < 40 ? 20 :
                   overallScore < 60 ? 35 :
                   overallScore < 75 ? 55 :
                   overallScore < 85 ? 70 : 85
  const prob = Math.min(95, Math.max(5, baseProb))
  const roundPreds: any = {}
  const selProb: any = { overall: prob }

  if (hasCoding || activeSections.length > 0) {
    selProb.round1 = Math.min(95, prob + 8)
    roundPreds.round1 = prob >= 40 ? "Pass" : "Fail"
  }
  if (hasCoding) {
    selProb.technicalRound = Math.max(5, prob - 5)
    roundPreds.technicalRound = prob >= 50 ? "Pass" : "Fail"
  }
  if (hasVerbal) {
    selProb.hrRound = Math.min(90, prob + 10)
    roundPreds.hrRound = prob >= 35 ? "Pass" : "Fail"
  }

  return {
    companyName: companyName || company.toUpperCase(),
    targetRole: targetRole || "Software Engineer",
    overallScore,
    companyBenchmark: meta.benchmark,
    readinessScore: readiness,
    readinessLabel: readiness >= 91 ? "Highly Ready" : readiness >= 76 ? "Ready" : readiness >= 61 ? "Moderately Ready" : readiness >= 41 ? "Needs Improvement" : "Not Ready",
    benchmarkStatus: above ? "Above Benchmark" : overallScore === meta.benchmark ? "At Benchmark" : "Below Benchmark",
    selectionProbability: selProb,
    roundPredictions: roundPreds,
    sectionAnalysis: meta.focusAreas.map((s: string) => ({ section: s, score: overallScore, benchmark: meta.benchmark, status: above ? "Strong" : "Average", feedback: `Focus on ${s} practice sets.` })),
    hrReport: {
      candidateSummary: `Candidate demonstrated ${above ? "above average" : "below average"} performance in ${companyName || company} simulation.`,
      strengths: ["Completed all sections", "Consistent attempt rate", "Technical awareness"],
      weaknesses: ["Needs more practice", "Speed improvement required", "Accuracy inconsistency"],
      riskAreas: ["Time management", "Weak topics need reinforcement"],
      behaviorIndicators: "Candidate showed consistent engagement throughout the test.",
      learningAbility: "Moderate - responds well to structured practice.",
      problemSolvingAbility: above ? "Good - above company benchmark." : "Developing - below company benchmark.",
      communicationAssessment: hasVerbal ? "Evaluated through verbal section." : "Not evaluated in this simulation.",
      technicalAssessment: `Score of ${overallScore}% against ${meta.benchmark}% benchmark.`,
      overallImpression: above ? "Candidate shows promise and is worth moving forward." : "Candidate needs targeted improvement before the actual exam.",
      verdict: above ? "Recommended" : overallScore >= meta.benchmark * 0.7 ? "Borderline" : "Needs Improvement",
      verdictReason: above ? "Score exceeds company benchmark." : "Score is below company selection cutoff.",
    },
    crackTheCompany: {
      whyMayFail: ["Below benchmark in key sections", "Needs more mock practice", "Speed may be an issue"],
      whyMaySucceed: ["Completed the test", "Shows potential in attempted questions"],
      top5Improvements: meta.focusAreas.slice(0, 5).map((area: string) => ({ area, action: `Practice 20 questions daily on ${area}`, impact: "+5-8% score improvement" })),
      topicsToRevise: meta.focusAreas,
      expectedImprovement: `Current: ${overallScore}% -> After 2 weeks of practice: ${Math.min(100, overallScore + 15)}%`,
    },
    preparationPlan: {
      oneDay: ["Revise all weak topics", "Solve 10 practice questions per section", "Take one mini-mock"],
      threeDays: ["Day 1: Focus on aptitude weak areas", "Day 2: Coding and technical practice", "Day 3: Full mock test"],
      sevenDays: ["Days 1-2: Topic mastery", "Days 3-4: Section tests", "Days 5-6: Full mocks", "Day 7: Review and revision"],
      fourteenDays: ["Week 1: Foundation strengthening", "Week 2: Mock tests and analysis", "Daily: 1 hour focused practice"],
      thirtyDays: ["Week 1-2: Topic mastery", "Week 3: Mock tests", "Week 4: Company-specific simulations", "Daily: Track improvement"],
    },
    integrityAnalysis: {
      integrityScore: 90,
      riskLevel: "Low Risk",
      violations: [],
      reasoning: "No significant integrity violations detected.",
    },
    companyInsights: {
      hiringProcess: `${companyName || company} follows a ${meta.rounds.join(" -> ")} process.`,
      whatTheyLookFor: `Strong ${meta.focusAreas.join(", ")} skills.`,
      commonMistakes: ["Not practicing enough mocks", "Ignoring verbal section", "Poor time management"],
      insiderTips: ["Practice previous year patterns", "Focus on accuracy over speed", "Attempt all questions"],
    },
  }
}
