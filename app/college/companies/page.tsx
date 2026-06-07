import { CompanyNetwork } from "@/components/college/company-network"

export const dynamic = "force-dynamic"

export default function CompaniesPage() {
  return (
    <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
      <CompanyNetwork />
    </div>
  )
}
