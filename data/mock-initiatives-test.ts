export type InitiativeTemplate = "New feature" | "Support Ticket" | "Bug fix" | "Research"

export interface StageArtifact {
  type: "PR" | "Changeset" | "Jira Ticket" | "GitHub Issue" | "Document" | "Deployment Log"
  title: string
  url: string
}

export interface StageExecutor {
  type: "user" | "agent"
  name: string
  details?: string
}

export interface StoryStage {
  name: string
  completed: boolean
  summary?: string
  executedAt?: string
  executionType?: "local" | "cloud"
  status?: "success" | "failed" | "in-progress" | "pending"
  artifacts?: StageArtifact[]
  aiAssisted?: boolean
  promptLogSummary?: string
  subStages?: StoryStage[]
  executor?: StageExecutor
}

export type StoryStatus =
  | { type: "in_progress_agent" }
  | { type: "hitl_pending" }
  | { type: "complete" }
  | { type: "warning"; reason: string }

export interface Story {
  id: string
  name: string
  description?: string
  status: StoryStatus
  stages: StoryStage[]
  createdAt?: string
}

export interface ContextSection {
  title: string
  summary: string
  toc: string[]
  links: {
    type: "Issue" | "PR" | "Code File" | "Document"
    title: string
    url: string
  }[]
}

export interface SharedContext {
  productContext: ContextSection
  implementationContext: ContextSection
}

export type InitiativePhase = "backlog" | "story_breakdown" | "final_validation" | "complete"

export interface Initiative {
  id: string
  name: string
  description?: string
  phase: InitiativePhase
  template: InitiativeTemplate
  stories: Story[]
  createdAt?: string
  assignedTo?: string
  sharedContext?: SharedContext
}

export const mockInitiatives: Initiative[] = [
  {
    id: "init-1",
    name: "Add inventory screen for users",
    description: "Create a new inventory management screen",
    phase: "story_breakdown",
    template: "New feature",
    createdAt: "2024-02-15T10:00:00Z",
    assignedTo: "Sarah Johnson",
    stories: [
      {
        id: "story-1-1",
        name: "Basic inventory list view",
        status: { type: "complete" },
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
          },
          {
            name: "Coding",
            completed: true,
            status: "success",
          },
          {
            name: "PR",
            completed: true,
            status: "success",
          },
          {
            name: "Review",
            completed: true,
            status: "success",
          },
          {
            name: "Deployment",
            completed: true,
            status: "success",
          },
        ],
      },
    ],
  },
]
