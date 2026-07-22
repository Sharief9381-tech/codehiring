/**
 * GET /api/student/aptitude-questions?count=10&offset=0
 * Fetches aptitude questions from HuggingFace dataset:
 * suchandra17/preprocessed_aptitude (117k questions)
 * Each row: { question: string, answer: string }
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

const HF_DATASET = "suchandra17/preprocessed_aptitude"
const HF_API     = "https://datasets-server.huggingface.co/rows"

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const count  = Math.min(Number(searchParams.get("count")  ?? "10"), 50)
    const offset = Number(searchParams.get("offset") ?? "0")

    // Fetch rows from HuggingFace datasets server
    const url = `${HF_API}?dataset=${encodeURIComponent(HF_DATASET)}&config=default&split=train&offset=${offset}&length=${count}`

    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 3600 }, // cache 1 hour
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `HuggingFace API error: ${res.status}`, detail: err }, { status: 500 })
    }

    const data = await res.json()
    const rows  = data.rows ?? []

    // Transform to question objects
    const questions = rows.map((row: any, i: number) => ({
      id:       `hf-apt-${offset + i}`,
      question: row.row?.question ?? "",
      answer:   row.row?.answer   ?? "",
    })).filter((q: any) => q.question.length > 10)

    return NextResponse.json({
      questions,
      total:  data.num_rows_total ?? 117262,
      offset,
      count:  questions.length,
    })
  } catch (err) {
    console.error("aptitude-questions error:", err)
    return NextResponse.json({ error: "Failed to fetch questions", detail: String(err) }, { status: 500 })
  }
}
