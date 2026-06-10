/**
 * POST /api/drives/[id]/offer — Step 11: Send offer to selected candidates
 * Marks drive as completed when all offers sent
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { DriveModel } from "@/lib/models/drive"
import { isDatabaseAvailable } from "@/lib/database"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== "recruiter" && user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isDatabaseAvailable()) return NextResponse.json({ error: "DB unavailable" }, { status: 503 })

    const { id: driveId } = await params
    const { studentIds, offerDetails } = await req.json()

    const drive = await DriveModel.findById(driveId)
    if (!drive) return NextResponse.json({ error: "Drive not found" }, { status: 404 })

    // Mark candidates as offer_sent
    await Promise.all(
      (studentIds || []).map((sid: string) =>
        DriveModel.updateApplicantStatus(driveId, sid, "offer_sent")
      )
    )

    const hiredCount = studentIds?.length || 0
    await DriveModel.update(driveId, { hiredCount })

    // Advance to completed if all positions filled
    if (hiredCount >= drive.openPositions) {
      await DriveModel.advanceStatus(driveId, "completed", `${hiredCount} offers sent`)
    }

    return NextResponse.json({
      success: true,
      message: `Offers sent to ${hiredCount} candidate(s)`,
    })
  } catch (err) {
    console.error("Offer error:", err)
    return NextResponse.json({ error: "Failed to send offers" }, { status: 500 })
  }
}
