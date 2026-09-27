/**
 * POST /api/admin/seed-pattern-embeddings
 * Seeds all company assessment patterns into the pattern_embeddings
 * collection with OpenAI embeddings for semantic search.
 *
 * Run once after deploy, or whenever patterns are updated.
 * Requires: OPENAI_API_KEY (for embeddings) + MONGODB_URI
 *
 * Body: { secret: "codetrack_super_secret_key_2024_replace_in_production" }
 */

import { NextResponse } from "next/server"
import { upsertPatternDocsBulk } from "@/lib/rag/pattern-search"
import { ALL_COMPANIES } from "@/lib/companies-data"
import { getCompanyPattern } from "@/lib/rag/company-pattern"

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "codetrack_super_secret_key_2024_replace_in_production"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  if (body.secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY required for embeddings" }, { status: 400 })
  }

  const results = { success: 0, failed: 0, skipped: 0, companies: [] as string[] }
  const BATCH_SIZE = 20

  // Process companies in batches to avoid rate limits
  for (let i = 0; i < ALL_COMPANIES.length; i += BATCH_SIZE) {
    const batch = ALL_COMPANIES.slice(i, i + BATCH_SIZE)
    const docs: any[] = []

    for (const company of batch) {
      try {
        // Get the pattern (from MongoDB cache or fallback)
        const pattern = await getCompanyPattern(company.id, company.name)
        if (!pattern?.sections?.length) {
          results.skipped++
          continue
        }

        // Create one embedding doc per section
        for (const section of pattern.sections) {
          docs.push({
            company:     company.id,
            companyName: company.name,
            sectionId:   section.id,
            sectionName: section.name,
            questions:   section.questions,
            timeMinutes: section.timeMinutes,
            difficulty:  section.difficulty,
            topics:      section.topics ?? [],
            isCoding:    section.isCoding,
            year:        2025,
            notes:       pattern.notes ?? "",
            source:      pattern.source ?? "fallback",
          })
        }
        results.companies.push(company.id)
      } catch (e) {
        console.error(`Pattern fetch failed for ${company.id}:`, e)
        results.failed++
      }
    }

    // Embed the whole batch at once
    if (docs.length > 0) {
      try {
        await upsertPatternDocsBulk(docs)
        results.success += docs.length
      } catch (e) {
        console.error("Bulk embed failed:", e)
        results.failed += docs.length
      }
    }

    // Small delay between batches to respect rate limits
    if (i + BATCH_SIZE < ALL_COMPANIES.length) {
      await new Promise(r => setTimeout(r, 500))
    }
  }

  return NextResponse.json({
    message: `Seeded ${results.success} pattern sections across ${results.companies.length} companies`,
    ...results,
    note: "Make sure 'pattern_vector_index' exists in MongoDB Atlas Vector Search on 'pattern_embeddings' collection",
    atlasIndexDefinition: {
      fields: [{
        type: "vector",
        path: "embedding",
        numDimensions: 1536,
        similarity: "cosine",
      }],
    },
  })
}
