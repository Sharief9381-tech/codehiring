"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, BarChart3 } from "lucide-react"
import { CollegeStats } from "@/components/college/college-stats"
import { TopPerformers } from "@/components/college/top-performers"
import { PlacementOverview } from "@/components/college/placement-overview"
import { DepartmentBreakdown } from "@/components/college/department-breakdown"
import { BatchAnalytics } from "@/components/college/batch-analytics"

export function CollegeDashboardTabs({ college }: { college: any }) {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="h-9 mb-6">
        <TabsTrigger value="overview" className="gap-2 text-sm">
          <LayoutDashboard className="h-4 w-4" /> Overview
        </TabsTrigger>
        <TabsTrigger value="analytics" className="gap-2 text-sm">
          <BarChart3 className="h-4 w-4" /> Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <CollegeStats college={college} />
        <div className="grid gap-6 lg:grid-cols-2">
          <TopPerformers />
          <PlacementOverview />
        </div>
        <DepartmentBreakdown />
      </TabsContent>

      <TabsContent value="analytics">
        <BatchAnalytics college={college} />
      </TabsContent>
    </Tabs>
  )
}
