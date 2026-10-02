/**
 * Shared types for the Question Generation pipeline
 */

export type QuestionType = "aptitude" | "coding" | "communication"

export type SectionId =
  | "quantitative"
  | "advanced-aptitude"
  | "verbal"
  | "basic-coding"
  | "advanced-coding"
  | "logical"
  | "coding"

export interface QuestionRequest {
  company:      string       // "tcs"
  companyName:  string       // "TCS"
  section:      SectionId   // "quantitative"
  sectionName:  string       // "Numerical Ability"
  type:         QuestionType // "aptitude"
  topics:       string[]     // ["Percentages", "Time & Work"]
  difficulty:   string       // "Medium"
  count:        number       // 15
  // Optional extra context passed from prep/page.tsx live pattern
  liveTopics?:  string[]
}

export interface MCQQuestion {
  id:          number
  question:    string
  options:     string[]
  correct:     number       // index 0-3
  explanation: string
  topic:       string
  difficulty:  string
  passage?:    string       // for reading comprehension
}

export interface CodingQuestion {
  id:          number
  title:       string
  difficulty:  string
  statement:   string
  constraints: string
  example: {
    input:       string   // plain stdin numbers
    output:      string
    explanation: string
  }
  hints:       string[]
  topic:       string
}

export type GeneratedQuestion = MCQQuestion | CodingQuestion

export interface GenerationResult {
  questions:   GeneratedQuestion[]
  company:     string
  section:     string
  source:      "ai+rag" | "cache" | "fallback"
  model?:      string
}

export interface RetrievedContext {
  pyqs:          any[]    // from pyq_embeddings
  patterns:      any[]    // from pattern_embeddings
  staticSamples: any[]    // from static question banks
  queryText:     string
}
