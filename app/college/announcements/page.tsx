import { Announcements } from "@/components/college/announcements"

export const dynamic = "force-dynamic"

export default function AnnouncementsPage() {
  return (
    <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
      <Announcements />
    </div>
  )
}
