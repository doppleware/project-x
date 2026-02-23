"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockInitiatives } from "@/data/mock-initiatives"
import { CheckCircle2, Circle, Clock, Cloud, Monitor, ArrowLeft, ExternalLink, AlertCircle, Loader2, Sparkles, User, Bot, FileText, Code, AlertTriangle, UserCheck, Bell, ChevronDown, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"

function InitiativeStatusBadge({ status }: { status: { type: string; reason?: string } }) {
  if (status.type === "in_progress_agent") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
        <Loader2 className="h-4 w-4" />
        In Progress (Agent)
      </span>
    )
  }

  if (status.type === "hitl_pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 ring-1 ring-inset ring-amber-700/10">
        <UserCheck className="h-4 w-4" />
        HITL Pending
      </span>
    )
  }

  if (status.type === "complete") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
        <CheckCircle2 className="h-4 w-4" />
        Complete
      </span>
    )
  }

  if (status.type === "warning") {
    return (
      <div className="group relative inline-flex">
        <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
          <AlertTriangle className="h-4 w-4" />
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

function ExecutorBadge({ executor }: { executor?: { type: "user" | "agent"; name: string; details?: string } }) {
  if (!executor) return null

  const tooltipText = executor.type === "user" ? executor.name : (executor.details || executor.name)

  return (
    <div className="group relative inline-flex">
      <span
        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
          executor.type === "agent"
            ? "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10"
            : "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10"
        }`}
      >
        {executor.type === "agent" ? (
          <Bot className="h-3 w-3" />
        ) : (
          <User className="h-3 w-3" />
        )}
        {executor.type === "agent" ? "Agent" : "User"}
      </span>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
        {tooltipText}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  )
}

export default function InitiativeDetailPage() {
  const params = useParams()
  const initiative = mockInitiatives.find(i => i.id === params.id)
  const [activeTab, setActiveTab] = useState<"timeline" | "context">("timeline")

  // Find the active stage index (in-progress or first incomplete)
  const activeStageIndex = initiative?.stages.findIndex(s => s.status === "in-progress") ??
                          initiative?.stages.findIndex(s => !s.completed) ??
                          -1

  const [expandedStages, setExpandedStages] = useState<Set<number>>(
    new Set(activeStageIndex >= 0 ? [activeStageIndex] : [])
  )

  const toggleStage = (index: number) => {
    setExpandedStages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  if (!initiative) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Initiative not found</p>
        </div>
      </AppLayout>
    )
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-6 w-6 text-green-600" />
      case "failed":
        return <AlertCircle className="h-6 w-6 text-red-600" />
      case "in-progress":
        return <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
      case "pending":
        return <Circle className="h-6 w-6 text-gray-400" />
      default:
        return <Circle className="h-6 w-6 text-gray-400" />
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "failed":
        return "text-red-600"
      case "in-progress":
        return "text-blue-600"
      case "pending":
        return "text-gray-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <Link href="/initiatives">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Initiatives
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{initiative.name}</h1>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
            <p className="text-muted-foreground">{initiative.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {initiative.template}
            </span>
            {initiative.initiativeStatus.type !== "warning" && (
              <InitiativeStatusBadge status={initiative.initiativeStatus} />
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">Supervising Engineer</div>
              <div className="text-2xl font-bold mt-1">{initiative.assignedTo || "Unassigned"}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">Current Stage</div>
              <div className="text-2xl font-bold mt-1">
                {(() => {
                  const currentStage = initiative.stages.find(s => s.status === "in-progress") ||
                                      initiative.stages.find(s => !s.completed)
                  return currentStage?.name || "Complete"
                })()}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {(() => {
                  const currentStage = initiative.stages.find(s => s.status === "in-progress") ||
                                      initiative.stages.find(s => !s.completed)
                  if (currentStage?.executedAt) {
                    return `Last update: ${new Date(currentStage.executedAt).toLocaleString()}`
                  }
                  // Find most recent completed stage
                  const completedStages = initiative.stages.filter(s => s.completed && s.executedAt)
                  if (completedStages.length > 0) {
                    const mostRecent = completedStages.reduce((latest, stage) => {
                      return new Date(stage.executedAt!) > new Date(latest.executedAt!) ? stage : latest
                    })
                    return `Last update: ${new Date(mostRecent.executedAt!).toLocaleString()}`
                  }
                  return "No updates yet"
                })()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">Progress</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="text-2xl font-bold">
                  {initiative.stages.filter(s => s.completed).length}/{initiative.stages.length} stages
                </div>
                {initiative.initiativeStatus.type === "warning" && (
                  <div className="group relative inline-flex">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                      {initiative.initiativeStatus.reason}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </div>
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Created: {initiative.createdAt ? new Date(initiative.createdAt).toLocaleDateString() : "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("timeline")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "timeline"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Agentic Process
            </button>
            <button
              onClick={() => setActiveTab("context")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "context"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Shared Context
            </button>
          </div>
        </div>

        {/* Agentic Process Tab */}
        {activeTab === "timeline" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Agentic Process</CardTitle>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </div>
            </CardHeader>
            <CardContent>
            <div className="space-y-6">
              {initiative.stages.map((stage, index) => {
                const isExpanded = expandedStages.has(index)

                return (
                  <div key={index} className="relative">
                    {/* Connector Line */}
                    {index < initiative.stages.length - 1 && (
                      <div
                        className={`absolute left-3 top-12 w-0.5 ${
                          stage.completed ? "bg-green-600" : "bg-gray-300"
                        }`}
                        style={{ height: isExpanded ? "calc(100% + 1.5rem)" : "3rem" }}
                      />
                    )}

                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 z-10 bg-background">
                        {getStatusIcon(stage.status)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <button
                          onClick={() => toggleStage(index)}
                          className="w-full text-left flex items-start justify-between mb-2 hover:opacity-70 transition-opacity"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className={`text-lg font-semibold ${stage.completed ? "" : getStatusColor(stage.status)}`}>
                                {stage.name}
                              </h3>
                              {isExpanded ? (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            {stage.executedAt && (
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(stage.executedAt).toLocaleString()}
                                </span>
                                {stage.executionType && (
                                  <span className="flex items-center gap-1">
                                    {stage.executionType === "cloud" ? (
                                      <>
                                        <Cloud className="h-3 w-3" />
                                        Cloud
                                      </>
                                    ) : (
                                      <>
                                        <Monitor className="h-3 w-3" />
                                        Local
                                      </>
                                    )}
                                  </span>
                                )}
                                <span className={`font-medium ${getStatusColor(stage.status)}`}>
                                  {stage.status === "success" && "✓ Success"}
                                  {stage.status === "failed" && "✗ Failed"}
                                  {stage.status === "in-progress" && "⟳ In Progress"}
                                  {stage.status === "pending" && "○ Pending"}
                                </span>
                              </div>
                            )}
                          </div>
                        </button>

                      {isExpanded && (
                        <>
                          {stage.summary && (
                            <p className="text-sm text-muted-foreground mb-3">{stage.summary}</p>
                          )}

                          {stage.aiAssisted && stage.promptLogSummary && (
                        <div className="mb-3 p-3 rounded-md bg-purple-50 border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-900">AI-Assisted</span>
                          </div>
                          <div className="text-xs text-purple-800 whitespace-pre-line font-mono">
                            {stage.promptLogSummary}
                          </div>
                        </div>
                      )}

                      {stage.artifacts && stage.artifacts.length > 0 && (
                        <div className="space-y-2 mb-4">
                          <div className="text-sm font-medium">Artifacts:</div>
                          <div className="flex flex-wrap gap-2">
                            {stage.artifacts.map((artifact, idx) => (
                              <a
                                key={idx}
                                href={artifact.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                              >
                                {artifact.title}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sub-stages */}
                      {stage.subStages && stage.subStages.length > 0 && (
                        <div className="mt-4 ml-6 space-y-4 border-l-2 border-gray-200 pl-6">
                          {stage.subStages.map((subStage, subIndex) => (
                            <div key={subIndex} className="relative">
                              <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                  {subStage.status === "success" ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  ) : subStage.status === "failed" ? (
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                  ) : subStage.status === "in-progress" ? (
                                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="text-md font-medium">{subStage.name}</h4>
                                      {subStage.aiAssisted && (
                                        <Sparkles className="h-3 w-3 text-purple-600" />
                                      )}
                                      <ExecutorBadge executor={subStage.executor} />
                                    </div>
                                    {subStage.executor?.type === "agent" && (
                                      <Link href={`/conversations/conv-${initiative.id}-${index}-${subIndex}`}>
                                        <Button variant="outline" size="sm">
                                          Join Conversation
                                        </Button>
                                      </Link>
                                    )}
                                  </div>
                                  {subStage.executedAt && (
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(subStage.executedAt).toLocaleString()}
                                      </span>
                                      {subStage.executionType && (
                                        <span className="flex items-center gap-1">
                                          {subStage.executionType === "cloud" ? (
                                            <>
                                              <Cloud className="h-3 w-3" />
                                              Cloud
                                            </>
                                          ) : (
                                            <>
                                              <Monitor className="h-3 w-3" />
                                              Local
                                            </>
                                          )}
                                        </span>
                                      )}
                                      <span className={`font-medium ${getStatusColor(subStage.status)}`}>
                                        {subStage.status === "success" && "✓ Success"}
                                        {subStage.status === "failed" && "✗ Failed"}
                                        {subStage.status === "in-progress" && "⟳ In Progress"}
                                        {subStage.status === "pending" && "○ Pending"}
                                      </span>
                                    </div>
                                  )}
                                  {subStage.summary && (
                                    <p className="text-sm text-muted-foreground mb-2">{subStage.summary}</p>
                                  )}
                                  {subStage.aiAssisted && subStage.promptLogSummary && (
                                    <div className="mb-2 p-2 rounded bg-purple-50 border border-purple-200">
                                      <div className="text-xs text-purple-800 whitespace-pre-line font-mono">
                                        {subStage.promptLogSummary}
                                      </div>
                                    </div>
                                  )}
                                  {subStage.artifacts && subStage.artifacts.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {subStage.artifacts.map((artifact, aIdx) => (
                                        <a
                                          key={aIdx}
                                          href={artifact.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                                        >
                                          {artifact.title}
                                          <ExternalLink className="h-3 w-3" />
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
        )}

        {/* Shared Context Tab */}
        {activeTab === "context" && initiative.sharedContext && (
          <div className="space-y-6">
            {/* Product Context */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle>{initiative.sharedContext.productContext.title}</CardTitle>
                  </div>
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Subscribe
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6">
                  {/* Main Content - Scrollable */}
                  <div className="flex-1">
                    <div className="prose prose-sm max-w-none">
                      <div className="max-h-96 overflow-y-auto pr-4 space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {initiative.sharedContext.productContext.summary}
                        </p>

                        {initiative.sharedContext.productContext.toc.map((item, idx) => (
                          <div key={idx} id={`product-${idx}`} className="scroll-mt-4">
                            <h3 className="text-base font-semibold mb-2">{item}</h3>
                            <p className="text-sm text-muted-foreground">
                              Detailed content for {item} would go here. This section provides comprehensive information about this aspect of the product context.
                            </p>
                          </div>
                        ))}

                        <div className="pt-4 border-t">
                          <h3 className="text-base font-semibold mb-3">Related Links</h3>
                          <div className="flex flex-wrap gap-2">
                            {initiative.sharedContext.productContext.links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 hover:bg-blue-100 transition-colors"
                              >
                                <span className="text-xs text-blue-600">{link.type}</span>
                                <span>•</span>
                                <span>{link.title}</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TOC Navigation */}
                  <div className="w-48 flex-shrink-0">
                    <div className="sticky top-4">
                      <h4 className="text-sm font-semibold mb-3">Table of Contents</h4>
                      <nav className="space-y-1">
                        {initiative.sharedContext.productContext.toc.map((item, idx) => (
                          <a
                            key={idx}
                            href={`#product-${idx}`}
                            className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 border-l-2 border-transparent hover:border-primary pl-3"
                          >
                            {item}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Implementation Context */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    <CardTitle>{initiative.sharedContext.implementationContext.title}</CardTitle>
                  </div>
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Subscribe
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6">
                  {/* Main Content - Scrollable */}
                  <div className="flex-1">
                    <div className="prose prose-sm max-w-none">
                      <div className="max-h-96 overflow-y-auto pr-4 space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {initiative.sharedContext.implementationContext.summary}
                        </p>

                        {initiative.sharedContext.implementationContext.toc.map((item, idx) => (
                          <div key={idx} id={`implementation-${idx}`} className="scroll-mt-4">
                            <h3 className="text-base font-semibold mb-2">{item}</h3>
                            <p className="text-sm text-muted-foreground">
                              Detailed content for {item} would go here. This section provides comprehensive technical information about this aspect of the implementation.
                            </p>
                          </div>
                        ))}

                        <div className="pt-4 border-t">
                          <h3 className="text-base font-semibold mb-3">Related Links</h3>
                          <div className="flex flex-wrap gap-2">
                            {initiative.sharedContext.implementationContext.links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 hover:bg-purple-100 transition-colors"
                              >
                                <span className="text-xs text-purple-600">{link.type}</span>
                                <span>•</span>
                                <span>{link.title}</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TOC Navigation */}
                  <div className="w-48 flex-shrink-0">
                    <div className="sticky top-4">
                      <h4 className="text-sm font-semibold mb-3">Table of Contents</h4>
                      <nav className="space-y-1">
                        {initiative.sharedContext.implementationContext.toc.map((item, idx) => (
                          <a
                            key={idx}
                            href={`#implementation-${idx}`}
                            className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 border-l-2 border-transparent hover:border-primary pl-3"
                          >
                            {item}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "context" && !initiative.sharedContext && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No shared context available for this initiative.
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
