import { DashboardHeader } from "@/components/dashboard/header"
import { TalentSearch } from "@/components/recruiter/talent-search"
import { Suspense } from "react"
import Loading from "./loading"

export const dynamic = 'force-dynamic'

export default async function SearchPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Search Talent"
        description="Find the perfect candidates with AI-powered search"
      />
      <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
        <Suspense fallback={<Loading />}>
          <TalentSearch />
        </Suspense>
      </div>
    </div>
  )
}
