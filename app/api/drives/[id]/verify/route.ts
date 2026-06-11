/**
 * PATCH /api/drives/[id]/verify — Step 2: CodeHiring admin verifies a hiring request
 * Advances status from pending_review → verified or cancelled
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { DriveModel } from "@/lib/models/drive"
import { isDatabaseAvailable } from "@/lib/database"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin only" }, { status: 401 })
    }
    if (!isDatabaseAvailable()) return NextResponse.json({ error: "DB unavailable" }, { status: 503 })

    const { id } = await params
    const { approved, note } = await req.json()

    const drive = await DriveModel.findById(id)
    if (!drive) return NextResponse.json({ error: "Drive not found" }, { status: 404 })
    if (drive.status !== "pending_review") {
      return NextResponse.json({ error: "Drive is not pending review" }, { status: 400 })
    }

    if (approved) {
      await DriveModel.update(id, {
        verifiedBy: (user as any)._id?.toString() as string,
        verifiedAt: new Date(),
      })
      await DriveModel.advanceStatus(id, "active", note || "Verified and activated by CodeHiring")
    } else {
      await DriveModel.advanceStatus(id, "cancelled", note || "Rejected during verification")
    }

    return NextResponse.json({
      success: true,
      status: approved ? "active" : "cancelled",
      message: approved ? "Drive verified and activated" : "Drive rejected",
    })
  } catch (err) {
    console.error("Verify error:", err)
    return NextResponse.json({ error: "Failed to verify" }, { status: 500 })
  }
}
