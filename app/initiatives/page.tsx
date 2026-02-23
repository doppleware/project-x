"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockInitiatives } from "@/data/mock-initiatives"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { CheckCircle2, Circle, ChevronDown, AlertTriangle, Clock, UserCheck, Loader2 } from "lucide-react"
import Link from "next/link"

function InitiativeStatusBadge({ status }: { status: any }) {
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
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Last task
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Next task
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockInitiatives.map((initiative) => {
                    const completedStages = initiative.stages.filter(s => s.completed).length
                    const totalStages = initiative.stages.length

                    return (
                      <tr
                        key={initiative.id}
                        className="border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-4">
                          <Link href={`/initiatives/${initiative.id}`} className="font-medium hover:text-primary">
                            {initiative.name}
                          </Link>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {initiative.template}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {initiative.initiativeStatus.type !== "warning" && (
                            <InitiativeStatusBadge status={initiative.initiativeStatus} />
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-muted-foreground">
                            {initiative.lastTask}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-muted-foreground">
                            {initiative.nextTask}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Popover>
                              <PopoverTrigger className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                {completedStages}/{totalStages}
                                <ChevronDown className="h-3 w-3" />
                              </PopoverTrigger>
                              <PopoverContent>
                                <div className="space-y-1">
                                  <div className="font-semibold text-sm mb-3">Progress</div>
                                  {initiative.stages.map((stage, idx) => (
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
                            {initiative.initiativeStatus.type === "warning" && (
                              <div className="group relative inline-flex">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                                  {initiative.initiativeStatus.reason}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
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
