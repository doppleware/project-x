"use client"

import React, { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockInitiatives } from "@/data/mock-initiatives"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { CheckCircle2, Circle, ChevronDown, ChevronRight, AlertTriangle, UserCheck, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"

function InitiativeStatusBadge({ status }: { status: { type: string; reason?: string } }) {
  if (status.type === "in_progress_agent") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
        <Loader2 className="h-3 w-3" />
        In Progress (Agent)
      </span>
    )
  }

  if (status.type === "hitl_pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-700/10">
        <UserCheck className="h-3 w-3" />
        HITL Pending
      </span>
    )
  }

  if (status.type === "complete") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
        <CheckCircle2 className="h-3 w-3" />
        Complete
      </span>
    )
  }

  if (status.type === "warning") {
    return (
      <div className="group relative inline-flex">
        <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
          <AlertTriangle className="h-3 w-3" />
          Warning
        </span>
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
          {status.reason}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    )
  }

  return null
}

export default function InitiativesPage() {
  const [expandedInitiatives, setExpandedInitiatives] = useState<Set<string>>(new Set())

  const toggleInitiative = (initiativeId: string) => {
    setExpandedInitiatives(prev => {
      const newSet = new Set(prev)
      if (newSet.has(initiativeId)) {
        newSet.delete(initiativeId)
      } else {
        newSet.add(initiativeId)
      }
      return newSet
    })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Initiatives</h1>
            <p className="text-muted-foreground">
              Track and manage your ongoing initiatives
            </p>
          </div>
        </div>

        {/* Initiatives Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Initiatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Template
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Phase
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Stories
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockInitiatives.map((initiative) => {
                    const isExpanded = expandedInitiatives.has(initiative.id)

                    // Calculate initiative progress from initiativeStages
                    const completedInitiativeStages = initiative.initiativeStages.filter(s => s.completed).length
                    const totalInitiativeStages = initiative.initiativeStages.length

                    // Initiatives with stories are at least in story_breakdown
                    const effectivePhase = initiative.stories.length > 0 && initiative.phase === "backlog"
                      ? "story_breakdown"
                      : initiative.phase

                    // Find stories with warnings
                    const warningStory = initiative.stories.find(s => s.status.type === "warning")

                    return (
                      <React.Fragment key={initiative.id}>
                        {/* Initiative Row */}
                        <tr className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleInitiative(initiative.id)}
                                className="hover:bg-muted p-1 rounded transition-colors"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                              <Link href={`/initiatives/${initiative.id}`} className="font-semibold hover:text-primary">
                                {initiative.name}
                              </Link>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              {initiative.template}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 capitalize">
                              {effectivePhase.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-muted-foreground">
                              {initiative.stories.length} {initiative.stories.length === 1 ? "story" : "stories"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Popover>
                                <PopoverTrigger className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                  {completedInitiativeStages}/{totalInitiativeStages}
                                  <ChevronDown className="h-3 w-3" />
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <div className="space-y-1">
                                    <div className="font-semibold text-sm mb-3">Initiative Progress</div>
                                    {initiative.initiativeStages.map((stage, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-start gap-2 py-1"
                                      >
                                        {stage.completed ? (
                                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        ) : (
                                          <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                        )}
                                        <span
                                          className={
                                            stage.completed
                                              ? "text-sm line-through text-muted-foreground"
                                              : "text-sm"
                                          }
                                        >
                                          {stage.name}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                              {warningStory && (
                                <div className="group relative inline-flex">
                                  <AlertTriangle className="h-4 w-4 text-red-600" />
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                                    {warningStory.status.type === "warning" ? warningStory.status.reason : ""}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Story Rows (nested under initiative) - only show when expanded */}
                        {isExpanded && initiative.stories.map((story) => {
                          const storyCompletedStages = story.stages.filter(s => s.completed).length
                          const storyTotalStages = story.stages.length

                          return (
                            <tr
                              key={`${initiative.id}-${story.id}`}
                              className="border-b last:border-0 bg-muted/20 hover:bg-muted/40 transition-colors"
                            >
                              <td className="py-3 px-4 pl-12">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">↳</span>
                                  <Link
                                    href={`/initiatives/${initiative.id}/stories/${story.id}`}
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                  >
                                    {story.name}
                                  </Link>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {/* Empty - inherits from initiative */}
                              </td>
                              <td className="py-3 px-4">
                                {/* Empty - inherits from initiative */}
                              </td>
                              <td className="py-3 px-4">
                                {story.status.type !== "warning" ? (
                                  <InitiativeStatusBadge status={story.status} />
                                ) : (
                                  <div className="group relative inline-flex">
                                    <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
                                      <AlertTriangle className="h-3 w-3" />
                                      Warning
                                    </span>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                                      {story.status.reason}
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <Popover>
                                  <PopoverTrigger className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                    {storyCompletedStages}/{storyTotalStages}
                                    <ChevronDown className="h-3 w-3" />
                                  </PopoverTrigger>
                                  <PopoverContent className="w-64">
                                    <div className="space-y-1">
                                      <div className="font-semibold text-sm mb-3">Story Progress</div>
                                      {story.stages.map((stage, idx) => (
                                        <div key={idx} className="flex items-center gap-2 py-1">
                                          {stage.status === "success" ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                          ) : stage.status === "in-progress" ? (
                                            <Loader2 className="h-4 w-4 text-blue-600 animate-spin shrink-0" />
                                          ) : stage.status === "failed" ? (
                                            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                                          ) : (
                                            <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                                          )}
                                          <span className={`text-sm ${stage.status === "success" ? "line-through text-muted-foreground" : ""}`}>
                                            {stage.name}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </td>
                            </tr>
                          )
                        })}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
