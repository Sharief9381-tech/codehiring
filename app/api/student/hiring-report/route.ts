/**
 * POST /api/student/hiring-report
 * Generates a full Company Hiring Simulation & Recruitment Report via Groq AI.
 */
import { NextResponse } from "next/server"

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions"

const COMPANY_BENCHMARKS: Record<string, {
  benchmark: number; rounds: string[]; focusAreas: string[];
  difficulty: string; cutoff: string
}> = {
  tcs:       { benchmark: 75, rounds: ["NQT Online","Technical Interview","HR Round"],            focusAreas: ["Quantitative Aptitude","Logical Reasoning","Verbal Ability"],            difficulty: "Easy-Medium",  cutoff: "75%" },
  infosys:   { benchmark: 65, rounds: ["InfyTQ Test","Technical Interview","HR Round"],           focusAreas: ["Aptitude","Reasoning","Pseudocode","Technical MCQs"],                  difficulty: "Medium",        cutoff: "65%" },
  wipro:     { benchmark: 60, rounds: ["NLTH Online","Technical Interview","HR Round"],           focusAreas: ["Aptitude","Verbal","Basic Coding"],                                    difficulty: "Easy-Medium",  cutoff: "60%" },
  cognizant: { benchmark: 60, rounds: ["GenC Test","Technical Interview","HR Round"],             focusAreas: ["Aptitude","Reasoning","Verbal","Basic Coding"],                        difficulty: "Easy",          cutoff: "60%" },
  capgemini: { benchmark: 65, rounds: ["Online Test","Technical Interview","HR Round"],           focusAreas: ["Aptitude","Pseudocode","Technical"],                                   difficulty: "Medium",        cutoff: "65%" },
  accenture: { benchmark: 70, rounds: ["Cognitive Test","Coding Round","Technical","HR"],         focusAreas: ["Quantitative","Analytical","Verbal","Coding"],                         difficulty: "Medium",        cutoff: "70%" },
  deloitte:  { benchmark: 70, rounds: ["Aptitude Test","Group Discussion","Technical","HR"],      focusAreas: ["Analytical Thinking","Aptitude","Communication"],                      difficulty: "Medium",        cutoff: "70%" },
  amazon:    { benchmark: 85, rounds: ["Online Assessment","Technical Round 1","Technical Round 2","Bar Raiser","HR"], focusAreas: ["DSA","Coding","Problem Solving","System Design"], difficulty: "Hard",          cutoff: "85%" },
  microsoft: { benchmark: 82, rounds: ["Coding Screen","Technical Round 1","Technical Round 2","Technical Round 3","HR"], focusAreas: ["DSA","Coding","System Thinking"],             difficulty: "Hard",          cutoff: "82%" },
  google:    { benchmark: 90, rounds: ["Phone Screen","Technical 1","Technical 2","Technical 3","Googliness","Team Match"], focusAreas: ["Advanced DSA","Algorithms","Optimization"], difficulty: "Very Hard",     cutoff: "90%" },
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      company,
      companyName,
      targetRole,
      scores,          // { overall, sections: {quantitative,logical,verbal,coding} }
      candidateRatings, // { aptitude, coding, dsa, csFoundations, communication }
      testHistory,     // array of { company, score, date }
      violations,      // { tabSwitches, fullscreenExits, copyAttempts, pasteAttempts }
      timeStats,       // { totalTime, avgTimePerQ, sectionTimes }
      topicScores,     // { topic: score }
    } = body

    const meta = COMPANY_BENCHMARKS[company] || COMPANY_BENCHMARKS.tcs
    const overallScore = scores?.overall ?? 0
    const sectionScores = scores?.sections ?? {}
    const readiness = Math.min(100, Math.round(
      (overallScore * 0.5) +
      ((candidateRatings?.coding ?? 50) * 0.2) +
      ((candidateRatings?.dsa ?? 50) * 0.15) +
      ((candidateRatings?.aptitude ?? 50) * 0.15)
    ))

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ report: buildFallbackReport({ company, companyName, overallScore, readiness, meta, targetRole }) })
    }

    const prompt = `You are the Hiring Simulation Intelligence Engine for CodeHiring — acting as both Senior HR Manager and Technical Evaluator.

Generate a comprehensive Company Hiring Simulation & Recruitment Report for the following candidate:

COMPANY: ${companyName || company.toUpperCase()}
TARGET ROLE: ${targetRole || "Software Engineer"}
TEST SCORE: ${overallScore}/100
COMPANY BENCHMARK: ${meta.benchmark}%
DIFFICULTY LEVEL: ${meta.difficulty}
SELECTION CUTOFF: ${meta.cutoff}

SECTION SCORES:
${Object.entries(sectionScores).map(([k, v]) => `- ${k}: ${v}%`).join("\n") || "- Overall: " + overallScore + "%"}

CANDIDATE SELF-RATINGS (0-100):
- Aptitude: ${candidateRatings?.aptitude ?? "N/A"}
- Coding: ${candidateRatings?.coding ?? "N/A"}
- DSA: ${candidateRatings?.dsa ?? "N/A"}
- CS Fundamentals: ${candidateRatings?.csFoundations ?? "N/A"}
- Communication: ${candidateRatings?.communication ?? "N/A"}

COMPANY FOCUS AREAS: ${meta.focusAreas.join(", ")}
INTERVIEW ROUNDS: ${meta.rounds.join(" → ")}

VIOLATION LOG:
- Tab Switches: ${violations?.tabSwitches ?? 0}
- Fullscreen Exits: ${violations?.fullscreenExits ?? 0}
- Copy Attempts: ${violations?.copyAttempts ?? 0}
- Paste Attempts: ${violations?.pasteAttempts ?? 0}

TIME STATISTICS:
- Total time taken: ${timeStats?.totalTime ?? "N/A"} minutes
- Average time per question: ${timeStats?.avgTimePerQ ?? "N/A"} seconds

TOPIC SCORES:
${Object.entries(topicScores ?? {}).map(([k, v]) => `- ${k}: ${v}%`).join("\n") || "- Not available"}

PREVIOUS TEST HISTORY:
${(testHistory ?? []).map((h: any) => `- ${h.company}: ${h.score}% (${h.date})`).join("\n") || "- No previous history"}

---

Generate a FULL RECRUITMENT REPORT in this EXACT JSON format (no markdown, no explanation, just JSON):

{
  "companyName": "${companyName || company.toUpperCase()}",
  "targetRole": "${targetRole || "Software Engineer"}",
  "overallScore": ${overallScore},
  "companyBenchmark": ${meta.benchmark},
  "readinessScore": <number 0-100>,
  "readinessLabel": "<Not Ready|Needs Improvement|Moderately Ready|Ready|Highly Ready>",
  "benchmarkStatus": "<Above Benchmark|At Benchmark|Below Benchmark>",
  "selectionProbability": {
    "round1": <number>,
    "round2": <number>,
    "technicalRound": <number>,
    "hrRound": <number>,
    "overall": <number>
  },
  "roundPredictions": {
    "round1": "<Pass|Fail>",
    "technicalRound": "<Pass|Fail>",
    "hrRound": "<Pass|Fail>"
  },
  "sectionAnalysis": [
    { "section": "section name", "score": <number>, "benchmark": <number>, "status": "<Strong|Average|Weak>", "feedback": "specific feedback" }
  ],
  "hrReport": {
    "candidateSummary": "2-3 sentence professional summary",
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
    "riskAreas": ["risk 1", "risk 2"],
    "behaviorIndicators": "assessment of candidate behavior and consistency",
    "learningAbility": "assessment",
    "problemSolvingAbility": "assessment",
    "communicationAssessment": "assessment",
    "technicalAssessment": "assessment",
    "overallImpression": "detailed hiring impression",
    "verdict": "<Strongly Recommended|Recommended|Borderline|Needs Improvement|Not Recommended>",
    "verdictReason": "specific reason for verdict"
  },
  "crackTheCompany": {
    "whyMayFail": ["reason 1", "reason 2", "reason 3"],
    "whyMaySucceed": ["reason 1", "reason 2"],
    "top5Improvements": [
      { "area": "improvement area", "action": "specific action to take", "impact": "expected impact" }
    ],
    "topicsToRevise": ["topic 1", "topic 2", "topic 3", "topic 4", "topic 5"],
    "expectedImprovement": "Current: ${overallScore}% → After improvement: XX%"
  },
  "preparationPlan": {
    "oneDay": ["task 1", "task 2", "task 3"],
    "threeDays": ["day 1 focus", "day 2 focus", "day 3 focus"],
    "sevenDays": ["week plan item 1", "week plan item 2", "week plan item 3", "week plan item 4"],
    "fourteenDays": ["fortnight plan item 1", "fortnight plan item 2", "fortnight plan item 3"],
    "thirtyDays": ["month plan item 1", "month plan item 2", "month plan item 3", "month plan item 4"]
  },
  "integrityAnalysis": {
    "integrityScore": <number 0-100>,
    "riskLevel": "<Low Risk|Medium Risk|High Risk|Critical Risk>",
    "violations": [],
    "reasoning": "reasoning about integrity"
  },
  "companyInsights": {
    "hiringProcess": "description of ${companyName || company} hiring process",
    "whatTheyLookFor": "what ${companyName || company} specifically looks for",
    "commonMistakes": ["mistake 1", "mistake 2", "mistake 3"],
    "insiderTips": ["tip 1", "tip 2", "tip 3"]
  }
}`

    const res = await fetch(GROQ_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        max_tokens: 3000,
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ report: buildFallbackReport({ company, companyName, overallScore, readiness, meta, targetRole }) })
    }

    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content?.trim() ?? ""
    const json = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()

    try {
      const report = JSON.parse(json)
      return NextResponse.json({ report })
    } catch {
      return NextResponse.json({ report: buildFallbackReport({ company, companyName, overallScore, readiness, meta, targetRole }) })
    }
  } catch (err) {
    console.error("Hiring report error:", err)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}

function buildFallbackReport({ company, companyName, overallScore, readiness, meta, targetRole }: any) {
  const above = overallScore >= meta.benchmark
  const prob = Math.min(95, Math.max(20, overallScore + (above ? 5 : -10)))
  return {
    companyName: companyName || company.toUpperCase(),
    targetRole: targetRole || "Software Engineer",
    overallScore,
    companyBenchmark: meta.benchmark,
    readinessScore: readiness,
    readinessLabel: readiness >= 91 ? "Highly Ready" : readiness >= 76 ? "Ready" : readiness >= 61 ? "Moderately Ready" : readiness >= 41 ? "Needs Improvement" : "Not Ready",
    benchmarkStatus: above ? "Above Benchmark" : overallScore === meta.benchmark ? "At Benchmark" : "Below Benchmark",
    selectionProbability: { round1: Math.min(95, prob + 10), round2: prob, technicalRound: Math.max(20, prob - 5), hrRound: Math.min(90, prob + 8), overall: prob },
    roundPredictions: { round1: prob >= 60 ? "Pass" : "Fail", technicalRound: prob >= 65 ? "Pass" : "Fail", hrRound: "Pass" },
    sectionAnalysis: meta.focusAreas.map((s: string) => ({ section: s, score: overallScore, benchmark: meta.benchmark, status: above ? "Strong" : "Average", feedback: `Focus on ${s} practice sets.` })),
    hrReport: {
      candidateSummary: `Candidate demonstrated ${above ? "above average" : "below average"} performance in ${companyName || company} simulation.`,
      strengths: ["Completed all sections", "Consistent attempt rate", "Technical awareness"],
      weaknesses: ["Needs more practice", "Speed improvement required", "Accuracy inconsistency"],
      riskAreas: ["Time management", "Weak topics need reinforcement"],
      behaviorIndicators: "Candidate showed consistent engagement throughout the test.",
      learningAbility: "Moderate — responds well to structured practice.",
      problemSolvingAbility: above ? "Good — above company benchmark." : "Developing — below company benchmark.",
      communicationAssessment: "Not evaluated in this simulation.",
      technicalAssessment: `Score of ${overallScore}% against ${meta.benchmark}% benchmark.`,
      overallImpression: above ? "Candidate shows promise and is worth moving forward." : "Candidate needs targeted improvement before the actual exam.",
      verdict: above ? "Recommended" : "Needs Improvement",
      verdictReason: above ? "Score exceeds company benchmark." : "Score is below company selection cutoff.",
    },
    crackTheCompany: {
      whyMayFail: ["Below benchmark in key sections", "Needs more mock practice", "Speed may be an issue"],
      whyMaySucceed: ["Completed the test", "Shows potential in attempted questions"],
      top5Improvements: meta.focusAreas.slice(0, 5).map((area: string) => ({ area, action: `Practice 20 questions daily on ${area}`, impact: "+5-8% score improvement" })),
      topicsToRevise: meta.focusAreas,
      expectedImprovement: `Current: ${overallScore}% → After 2 weeks of practice: ${Math.min(100, overallScore + 15)}%`,
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
      hiringProcess: `${companyName || company} follows a ${meta.rounds.join(" → ")} process.`,
      whatTheyLookFor: `Strong ${meta.focusAreas.join(", ")} skills.`,
      commonMistakes: ["Not practicing enough mocks", "Ignoring verbal section", "Poor time management"],
      insiderTips: ["Practice previous year patterns", "Focus on accuracy over speed", "Attempt all questions"],
    },
  }
}
