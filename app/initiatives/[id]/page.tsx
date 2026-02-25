"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockInitiatives } from "@/data/mock-initiatives"
import type { ContextSection } from "@/data/mock-initiatives"
import {
  CheckCircle2,
  Circle,
  Loader2,
  AlertTriangle,
  UserCheck,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  FileText,
  GitPullRequest,
  Code2,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"

function StageBadge({ status }: { status?: "success" | "in-progress" | "pending" }) {
  if (status === "success") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
        <CheckCircle2 className="h-3 w-3" />
        Complete
      </span>
    )
  }
  if (status === "in-progress") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
        <Loader2 className="h-3 w-3 animate-spin" />
        In Progress
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-500 ring-1 ring-inset ring-gray-500/10">
      <Circle className="h-3 w-3" />
      Pending
    </span>
  )
}

function StoryStatusBadge({ status }: { status: { type: string; reason?: string } }) {
  if (status.type === "in_progress_agent") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
        <Loader2 className="h-3 w-3 animate-spin" />
        In Progress
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
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
          {status.reason}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    )
  }
  return null
}

const issueTypeBadgeClass: Record<string, string> = {
  Jira: "bg-blue-50 text-blue-700 ring-blue-700/10",
  GitHub: "bg-gray-100 text-gray-700 ring-gray-700/10",
  Linear: "bg-purple-50 text-purple-700 ring-purple-700/10",
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

export default function InitiativeDetailPage() {
  const params = useParams()
  const initiative = mockInitiatives.find(i => i.id === params.id)
  const [activeTab, setActiveTab] = useState<"progress" | "context">("progress")

  if (!initiative) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Initiative not found</p>
        </div>
      </AppLayout>
    )
  }

  const backlogStage = initiative.initiativeStages.find(s => s.name === "Backlog grooming")
  const planningStage = initiative.initiativeStages.find(s => s.name === "Planning")
  const storyBreakdownStage = initiative.initiativeStages.find(s => s.name === "Story Breakdown")

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link href="/initiatives">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Initiatives
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">{initiative.name}</h1>
              {initiative.description && (
                <p className="text-muted-foreground">{initiative.description}</p>
              )}
              {initiative.assignedTo && (
                <p className="text-sm text-muted-foreground">
                  Supervised by <span className="font-medium text-foreground">{initiative.assignedTo}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {initiative.template}
              </span>
              <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 capitalize">
                {initiative.phase.replace(/_/g, " ")}
              </span>
            </div>
          </div>
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
          <>
            {/* Backlog Grooming */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Backlog Grooming</CardTitle>
                  <StageBadge status={backlogStage?.status} />
                </div>
              </CardHeader>
              <CardContent>
                {backlogStage?.conversationId || backlogStage?.linkedIssues?.length ? (
                  <div className="space-y-4">
                    {backlogStage.conversationId && (
                      <Link href={`/conversations/${backlogStage.conversationId}`}>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Open Conversation
                        </Button>
                      </Link>
                    )}
                    {backlogStage.linkedIssues && backlogStage.linkedIssues.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Linked Issues</p>
                        <div className="space-y-1.5">
                          {backlogStage.linkedIssues.map(issue => (
                            <a
                              key={issue.id}
                              href={issue.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 group w-fit"
                            >
                              <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${issueTypeBadgeClass[issue.type]}`}>
                                {issue.type}
                              </span>
                              <span className="text-sm font-mono text-muted-foreground">{issue.id}</span>
                              <span className="text-sm group-hover:text-primary transition-colors">{issue.title}</span>
                              <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No conversation or linked issues yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Planning */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Planning</CardTitle>
                  <StageBadge status={planningStage?.status} />
                </div>
              </CardHeader>
              <CardContent>
                {planningStage?.planOutput ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                    {planningStage.planOutput}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Plan not yet available.</p>
                )}
              </CardContent>
            </Card>

            {/* Story Breakdown */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Story Breakdown</CardTitle>
                  <StageBadge status={storyBreakdownStage?.status} />
                </div>
              </CardHeader>
              <CardContent>
                {initiative.stories.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-0 font-medium text-sm text-muted-foreground">Story</th>
                        <th className="text-left py-2 px-4 font-medium text-sm text-muted-foreground">Status</th>
                        <th className="text-left py-2 px-4 font-medium text-sm text-muted-foreground">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {initiative.stories.map(story => {
                        const completed = story.stages.filter(s => s.completed).length
                        const total = story.stages.length
                        return (
                          <tr key={story.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                            <td className="py-3 px-0">
                              <Link
                                href={`/initiatives/${initiative.id}/stories/${story.id}`}
                                className="text-sm font-medium hover:text-primary transition-colors"
                              >
                                {story.name}
                              </Link>
                              {story.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">{story.description}</p>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <StoryStatusBadge status={story.status} />
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {completed}/{total} stages
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-muted-foreground">No stories created yet.</p>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Context tab */}
        {activeTab === "context" && (
          <>
            {initiative.sharedContext ? (
              <>
                <ContextCard section={initiative.sharedContext.productContext} title="Product Context" />
                <ContextCard section={initiative.sharedContext.technicalContext} title="Technical Context" />
              </>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-sm text-muted-foreground text-center">No context available for this initiative.</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
