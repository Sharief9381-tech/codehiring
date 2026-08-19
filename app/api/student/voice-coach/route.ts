import { NextResponse } from "next/server"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { mode, scenario, question, userSpeech, conversationHistory } = body

    if (!userSpeech && mode !== "get-question") {
      return NextResponse.json({ error: "No speech input provided" }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 503 })
    }

    // ── Mode: get a question ──────────────────────────────────────────────────
    if (mode === "get-question") {
      const scenarioPrompts: Record<string, string> = {
        hr: "Generate one HR interview question for a fresh engineering graduate. Keep it concise, one sentence.",
        technical: "Generate one technical interview question for a CS/IT engineering student. Focus on concepts, not code. One sentence.",
        gd: "Give one group discussion topic for engineering students. One sentence.",
        english: "Give one spoken English practice prompt — describe an object, tell a story, or discuss a daily topic. One sentence.",
      }
      const prompt = scenarioPrompts[scenario] || scenarioPrompts.hr

      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 100,
          temperature: 0.8,
        }),
      })
      const data = await res.json()
      const generatedQuestion = data.choices?.[0]?.message?.content?.trim() || "Tell me about yourself."
      return NextResponse.json({ question: generatedQuestion })
    }

    // ── Mode: analyze practice answer ─────────────────────────────────────────
    if (mode === "practice") {
      const systemPrompt = `You are an expert communication coach for engineering students preparing for campus placements.
Analyze the student's spoken answer and provide structured feedback.
Return ONLY valid JSON in this exact format:
{
  "overallScore": <0-100 number>,
  "grammar": { "score": <0-100>, "issues": ["issue1", "issue2"], "tip": "one improvement tip" },
  "fluency": { "score": <0-100>, "fillerWords": ["um", "uh"], "tip": "one tip" },
  "content": { "score": <0-100>, "relevance": "brief comment", "tip": "one tip" },
  "confidence": { "score": <0-100>, "observation": "brief observation", "tip": "one tip" },
  "improvedVersion": "A polished version of what the student said",
  "encouragement": "One encouraging sentence"
}`

      const userPrompt = `Question asked: "${question}"
Student's spoken answer: "${userSpeech}"

Analyze and return JSON feedback.`

      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 600,
          temperature: 0.3,
        }),
      })
      const data = await res.json()
      const raw = data.choices?.[0]?.message?.content?.trim() || ""

      // Extract JSON from response
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return NextResponse.json({
          overallScore: 60,
          grammar: { score: 60, issues: [], tip: "Keep practising!" },
          fluency: { score: 60, fillerWords: [], tip: "Speak with confidence." },
          content: { score: 60, relevance: "Relevant", tip: "Add more details." },
          confidence: { score: 60, observation: "Good effort", tip: "Speak clearly." },
          improvedVersion: userSpeech,
          encouragement: "Great effort! Keep practising.",
        })
      }

      const feedback = JSON.parse(jsonMatch[0])
      return NextResponse.json(feedback)
    }

    // ── Mode: mock interview (conversation) ───────────────────────────────────
    if (mode === "interview") {
      const systemPrompt = `You are an interviewer conducting a ${scenario === "hr" ? "HR" : scenario === "technical" ? "technical" : "communication"} interview for an engineering student.
Keep responses short (2-3 sentences max). Ask follow-up questions naturally. 
Be encouraging but professional. After 8 exchanges, provide a brief performance summary.`

      const messages = [
        { role: "system", content: systemPrompt },
        ...(conversationHistory || []),
        { role: "user", content: userSpeech },
      ]

      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages,
          max_tokens: 200,
          temperature: 0.7,
        }),
      })
      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content?.trim() || "Could you elaborate on that?"
      return NextResponse.json({ reply, role: "assistant" })
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 })
  } catch (error) {
    console.error("Voice coach error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
