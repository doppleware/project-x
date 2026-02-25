"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockInitiatives } from "@/data/mock-initiatives"
import type { ContextSection } from "@/data/mock-initiatives"
import {
  CheckCircle2,
  AlertCircle,
  Circle,
  Loader2,
  AlertTriangle,
  UserCheck,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  User,
  Bot,
  ChevronDown,
  ChevronRight,
  Clock,
  Cloud,
  Monitor,
  FileText,
  GitPullRequest,
  Code2,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"

function StoryStatusBadge({ status }: { status: { type: string; reason?: string } }) {
  if (status.type === "in_progress_agent") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
        <Loader2 className="h-4 w-4 animate-spin" />
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
      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
        executor.type === "agent"
          ? "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10"
          : "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10"
      }`}>
        {executor.type === "agent" ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
        {executor.type === "agent" ? "Agent" : "User"}
      </span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
        {tooltipText}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  )
}

const getStatusIcon = (status?: string) => {
  switch (status) {
    case "success":    return <CheckCircle2 className="h-6 w-6 text-green-600" />
    case "failed":     return <AlertCircle className="h-6 w-6 text-red-600" />
    case "in-progress": return <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
    default:           return <Circle className="h-6 w-6 text-gray-400" />
  }
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case "success":    return "text-green-600"
    case "failed":     return "text-red-600"
    case "in-progress": return "text-blue-600"
    default:           return "text-gray-400"
  }
}

const linkTypeIcon: Record<string, React.ReactNode> = {
  Issue: <FileText className="h-3.5 w-3.5" />,
  PR: <GitPullRequest className="h-3.5 w-3.5" />,
  "Code File": <Code2 className="h-3.5 w-3.5" />,
  Document: <BookOpen className="h-3.5 w-3.5" />,
}

function ContextCard({ section, title }: { section: ContextSection; title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="text-sm font-medium text-foreground mb-1">{section.title}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{section.summary}</p>
        </div>
        {section.toc.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Scope</p>
            <ul className="space-y-1">
              {section.toc.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {section.links.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">References</p>
            <div className="space-y-1.5">
              {section.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group w-fit text-sm"
                >
                  <span className="text-muted-foreground">
                    {linkTypeIcon[link.type]}
                  </span>
                  <span className="group-hover:text-primary transition-colors">{link.title}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function StoryDetailPage() {
  const params = useParams()
  const initiative = mockInitiatives.find(i => i.id === params.id)
  const story = initiative?.stories.find(s => s.id === params.storyId)
  const storyIndex = initiative?.stories.findIndex(s => s.id === params.storyId) ?? 0

  const [expandedStages, setExpandedStages] = useState<Set<number>>(
    new Set(story?.stages.map((_, i) => i) ?? [])
  )
  const [activeTab, setActiveTab] = useState<"progress" | "context">("progress")

  const toggleStage = (index: number) => {
    setExpandedStages(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  if (!initiative || !story) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Story not found</p>
        </div>
      </AppLayout>
    )
  }

  const completedStages = story.stages.filter(s => s.completed).length

  const hasExpandableContent = (stage: (typeof story.stages)[number]) =>
    !!(stage.summary || stage.aiAssisted || stage.artifacts?.length || stage.subStages?.length)

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link href={`/initiatives/${initiative.id}`}>
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {initiative.name}
            </Button>
          </Link>
          <div className="flex items-start gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{story.name}</h1>
            <div className="mt-1">
              <StoryStatusBadge status={story.status} />
            </div>
          </div>
          {story.description && (
            <p className="text-muted-foreground mt-1">{story.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {completedStages}/{story.stages.length} stages completed
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 border-b">
          <button
            onClick={() => setActiveTab("progress")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "progress"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Progress
          </button>
          <button
            onClick={() => setActiveTab("context")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "context"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Context
          </button>
        </div>

        {/* Progress tab */}
        {activeTab === "progress" && (
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 ml-4 border-l-2 border-gray-200 pl-6">
                {story.stages.map((stage, stageIndex) => {
                  const isExpanded = expandedStages.has(stageIndex)

                  return (
                    <div key={stageIndex} className="relative">
                      {/* Connector line to next stage */}
                      {stageIndex < story.stages.length - 1 && (
                        <div
                          className={`absolute left-3 top-12 w-0.5 ${stage.completed ? "bg-green-600" : "bg-gray-300"}`}
                          style={{ height: isExpanded ? "calc(100% + 1.5rem)" : "3rem" }}
                        />
                      )}

                      <div className="flex gap-4">
                        {/* Status icon */}
                        <div className="flex-shrink-0 z-10 bg-background">
                          {getStatusIcon(stage.status)}
                        </div>

                        {/* Stage content */}
                        <div className="flex-1 pb-8">
                          {/* Header row — clickable only when there's content to expand */}
                          {hasExpandableContent(stage) ? (
                            <button
                              onClick={() => toggleStage(stageIndex)}
                              className="w-full text-left mb-2 hover:opacity-70 transition-opacity"
                            >
                              <div className="flex items-center gap-2">
                                <h3 className={`text-lg font-semibold ${stage.completed ? "" : getStatusColor(stage.status)}`}>
                                  {stage.name}
                                </h3>
                                {isExpanded
                                  ? <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                  : <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                }
                              </div>
                              {stage.executedAt && (
                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(stage.executedAt).toLocaleString()}
                                  </span>
                                  {stage.executionType && (
                                    <span className="flex items-center gap-1">
                                      {stage.executionType === "cloud"
                                        ? <><Cloud className="h-3 w-3" />Cloud</>
                                        : <><Monitor className="h-3 w-3" />Local</>
                                      }
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
                            </button>
                          ) : (
                            <div className="mb-2">
                              <h3 className={`text-lg font-semibold ${stage.completed ? "" : getStatusColor(stage.status)}`}>
                                {stage.name}
                              </h3>
                              {stage.executedAt && (
                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(stage.executedAt).toLocaleString()}
                                  </span>
                                  {stage.executionType && (
                                    <span className="flex items-center gap-1">
                                      {stage.executionType === "cloud"
                                        ? <><Cloud className="h-3 w-3" />Cloud</>
                                        : <><Monitor className="h-3 w-3" />Local</>
                                      }
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
                          )}

                          {/* Expandable content — only rendered when toggled open */}
                          {isExpanded && hasExpandableContent(stage) && (
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
                                              <Link href={`/conversations/conv-${initiative.id}-${storyIndex}-${stageIndex}-${subIndex}`}>
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
                                                  {subStage.executionType === "cloud"
                                                    ? <><Cloud className="h-3 w-3" />Cloud</>
                                                    : <><Monitor className="h-3 w-3" />Local</>
                                                  }
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

        {/* Context tab */}
        {activeTab === "context" && (
          <>
            {/* Story context */}
            {story.context ? (
              <>
                <ContextCard section={story.context.productContext} title="Product Context" />
                <ContextCard section={story.context.technicalContext} title="Technical Context" />
              </>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-sm text-muted-foreground text-center">No story-level context available.</p>
                </CardContent>
              </Card>
            )}

            {/* Initiative context */}
            {initiative.sharedContext && (
              <>
                <div className="pt-2">
                  <h2 className="text-lg font-semibold text-muted-foreground mb-4">
                    Initiative Context — {initiative.name}
                  </h2>
                  <div className="space-y-4">
                    <ContextCard section={initiative.sharedContext.productContext} title="Initiative Product Context" />
                    <ContextCard section={initiative.sharedContext.technicalContext} title="Initiative Technical Context" />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
