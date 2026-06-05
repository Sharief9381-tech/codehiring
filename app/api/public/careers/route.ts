import { NextResponse } from "next/server"
import { CareerModel } from "@/lib/models/career"
import { isDatabaseAvailable } from "@/lib/database"

export const revalidate = 60

export async function GET() {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ careers: [] })
  }
  try {
    const careers = await CareerModel.findAll(true) // only active postings
    return NextResponse.json({ careers })
  } catch (error) {
    console.error("Public careers API error:", error)
    return NextResponse.json({ careers: [] })
  }
}
