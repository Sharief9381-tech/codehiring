/**
 * POST /api/student/scrape-questions
 * Scrapes real previous year questions from IndiaBix, PrepInsta, GFG etc.
 * Then uses Groq to parse and structure them into MCQ format.
 */
import { NextResponse } from "next/server"

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions"

// Source URLs per company/section
const SCRAPE_SOURCES: Record<string, Record<string, string[]>> = {
  tcs: {
    quantitative: [
      "https://www.indiabix.com/aptitude/tcs-placement-papers/",
      "https://prepinsta.com/tcs-nqt/quantitative-aptitude/",
    ],
    logical: [
      "https://www.indiabix.com/verbal-reasoning/tcs-placement-papers/",
      "https://prepinsta.com/tcs-nqt/reasoning/",
    ],
    verbal: [
      "https://www.indiabix.com/verbal-ability/tcs-placement-papers/",
    ],
  },
  infosys: {
    quantitative: [
      "https://www.indiabix.com/aptitude/infosys-placement-papers/",
      "https://prepinsta.com/infosys/aptitude/",
    ],
    logical: [
      "https://prepinsta.com/infosys/reasoning/",
    ],
  },
  wipro: {
    quantitative: [
      "https://www.indiabix.com/aptitude/wipro-placement-papers/",
      "https://prepinsta.com/wipro/aptitude/",
    ],
  },
  cognizant: {
    quantitative: [
      "https://www.indiabix.com/aptitude/cognizant-placement-papers/",
    ],
  },
  accenture: {
    quantitative: [
      "https://prepinsta.com/accenture/aptitude/",
    ],
  },
  amazon: {
    coding: [
      "https://www.geeksforgeeks.org/amazon-interview-preparation/",
      "https://leetcode.com/company/amazon/",
    ],
  },
  google: {
    coding: [
      "https://www.geeksforgeeks.org/google-interview-preparation/",
    ],
  },
  microsoft: {
    coding: [
      "https://www.geeksforgeeks.org/microsoft-interview-preparation/",
    ],
  },
}

async function fetchPageText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return ""
    const html = await res.text()
    // Strip HTML tags, scripts, styles — keep readable text
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#?\w+;/g, " ")
      .replace(/\s{3,}/g, "\n")
      .trim()
      .slice(0, 8000) // keep first 8k chars — most questions are near top
  } catch {
    return ""
  }
}

async function extractQuestionsWithGroq(
  rawText: string,
  company: string,
  section: string,
  count: number
): Promise<any[]> {
  if (!process.env.GROQ_API_KEY) return []

  const prompt = `You are extracting and reformatting real placement exam questions from scraped webpage text.

COMPANY: ${company.toUpperCase()}
SECTION: ${section}
SCRAPED TEXT FROM OFFICIAL PLACEMENT PAPER WEBSITE:
---
${rawText.slice(0, 5000)}
---

TASK:
1. Extract up to ${count} real MCQ questions from the text above
2. If you find real questions, extract them exactly — don't change the question text
3. If the text doesn't have enough questions, generate NEW ones in the EXACT same style, difficulty, and topic
4. Make sure you return EXACTLY ${count} questions total
5. Each question must have exactly 4 options with one correct answer
6. Include a clear step-by-step explanation for the correct answer

Return ONLY valid JSON array:
[
  {
    "id": 1,
    "question": "Exact question text from the paper",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Step-by-step solution",
    "topic": "topic name",
    "difficulty": "Easy|Medium|Hard",
    "source": "extracted|generated"
  }
]`

  const res = await fetch(GROQ_API, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 6000,
    }),
  })

  if (!res.ok) return []
  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content?.trim() ?? ""
  const json = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()

  try {
    const parsed = JSON.parse(json)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function POST(req: Request) {
  try {
    const { company, section, count = 5 } = await req.json()

    const sources = SCRAPE_SOURCES[company]?.[section]
    if (!sources || sources.length === 0) {
      return NextResponse.json({ questions: [], scraped: false })
    }

    // Try all source URLs and combine content for more question material
    let rawText = ""
    const successUrls: string[] = []
    for (const url of sources) {
      const text = await fetchPageText(url)
      if (text.length > 500) {
        rawText += "\n\n--- SOURCE: " + url + " ---\n" + text
        successUrls.push(url)
      }
      if (rawText.length > 12000) break // cap combined content
    }

    if (!rawText) {
      return NextResponse.json({ questions: [], scraped: false, reason: "Could not fetch source pages" })
    }

    const questions = await extractQuestionsWithGroq(rawText, company, section, count)

    return NextResponse.json({
      questions,
      scraped: true,
      source: successUrls.join(", "),
      count: questions.length,
    })
  } catch (err) {
    console.error("scrape-questions error:", err)
    return NextResponse.json({ questions: [], scraped: false }, { status: 500 })
  }
}
