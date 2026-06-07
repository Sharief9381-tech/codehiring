"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { StudentsTable } from "@/components/college/students-table"
import { CollegeLeaderboard } from "@/components/college/college-leaderboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Trophy } from "lucide-react"

export default function StudentsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Students"
        description="Manage students and view rankings"
      />
      <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full space-y-4">
        <Tabs defaultValue="list">
          <TabsList className="h-9">
            <TabsTrigger value="list" className="gap-2 text-sm">
              <GraduationCap className="h-4 w-4" /> All Students
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2 text-sm">
              <Trophy className="h-4 w-4" /> Leaderboard
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-4">
            <StudentsTable />
          </TabsContent>
          <TabsContent value="leaderboard" className="mt-4">
            <CollegeLeaderboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
