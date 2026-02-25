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
  | { type: "warning"; reason: "Agent processing time too long" | "HITL bottleneck" | "Repeated agent errors" }

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
    description: "Create a new inventory management screen that allows users to view, search, and manage their product inventory with real-time updates.",
    phase: "story_breakdown",
    template: "New feature",
    createdAt: "2024-02-15T10:00:00Z",
    assignedTo: "Sarah Johnson",
    sharedContext: {
      productContext: {
        title: "Product Context",
        summary: "Users need a centralized inventory management screen to view, search, and manage their product inventory. Key features include real-time inventory tracking, advanced search and filtering, bulk operations, and CSV export.",
        toc: [
          "User Stories",
          "Search and Filter Requirements",
          "Permissions Model",
          "Export Functionality",
        ],
        links: [
          { type: "Issue", title: "PROJ-1234: Inventory Screen", url: "https://jira.example.com/PROJ-1234" },
          { type: "Document", title: "Requirements Document", url: "https://docs.example.com/inventory-requirements" },
        ],
      },
      implementationContext: {
        title: "Implementation Context",
        summary: "The inventory screen reuses existing table components and extends the ProductModel interface for inventory-specific fields. Backend implements server-side pagination with 50 items per page.",
        toc: [
          "Component Architecture",
          "API Endpoints",
          "Data Models",
        ],
        links: [
          { type: "Code File", title: "components/InventoryList.tsx", url: "https://github.com/example/repo/blob/main/src/components/InventoryList.tsx" },
        ],
      },
    },
    stories: [
      {
        id: "story-1-1",
        name: "Basic inventory list view",
        description: "Display inventory items in a table with pagination",
        status: { type: "complete" },
        createdAt: "2024-02-15T10:00:00Z",
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            summary: "Analyzed requirements for basic list view with pagination",
            executedAt: "2024-02-15T11:00:00Z",
            executionType: "cloud",
          },
          {
            name: "Coding",
            completed: true,
            status: "success",
            summary: "Implemented inventory list component with server-side pagination",
            executedAt: "2024-02-16T14:00:00Z",
            executionType: "cloud",
          },
          {
            name: "PR",
            completed: true,
            status: "success",
            summary: "Created PR with all checks passing",
            executedAt: "2024-02-17T10:00:00Z",
            executionType: "cloud",
          },
          {
            name: "Review",
            completed: true,
            status: "success",
            summary: "Code review approved",
            executedAt: "2024-02-18T15:00:00Z",
            executionType: "cloud",
          },
          {
            name: "Deployment",
            completed: true,
            status: "success",
            summary: "Deployed to production",
            executedAt: "2024-02-19T16:00:00Z",
            executionType: "cloud",
          },
        ],
      },
      {
        id: "story-1-2",
        name: "Search and filter functionality",
        description: "Add search bar and filters for product name, SKU, and category",
        status: { type: "in_progress_agent" },
        createdAt: "2024-02-16T10:00:00Z",
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            summary: "Defined search and filter requirements",
            executedAt: "2024-02-16T11:00:00Z",
            executionType: "cloud",
            subStages: [
              {
                name: "Validate issue context",
                completed: true,
                summary: "Agent analyzed search requirements and existing patterns",
                executedAt: "2024-02-16T10:30:00Z",
                executionType: "cloud",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "Agent: Analyzing search and filter requirements\nAgent: Found existing SearchBar component that can be reused\nAgent: Recommendation: Extend SearchBar with multi-field search",
                executor: { type: "agent", name: "ContextAnalyzer", details: "Claude / Opus 4" },
              },
            ],
          },
          {
            name: "Coding",
            completed: false,
            status: "in-progress",
            summary: "Implementing search and filter components",
            executedAt: "2024-02-20T09:00:00Z",
            executionType: "cloud",
            subStages: [
              {
                name: "Coding Progress",
                completed: true,
                summary: "Created SearchBar and FilterPanel components",
                executedAt: "2024-02-20T11:00:00Z",
                executionType: "cloud",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "User: Create search and filter components\nAgent: Generated SearchBar with debounced input\nAgent: Created FilterPanel with category and status filters",
                executor: { type: "agent", name: "CodeGen", details: "Claude / Sonnet 4.5" },
              },
              {
                name: "Local Review",
                completed: false,
                summary: "Reviewing component implementation",
                executedAt: "2024-02-20T14:00:00Z",
                executionType: "local",
                status: "in-progress",
                executor: { type: "agent", name: "CodeReviewer", details: "Claude / Opus 4" },
              },
            ],
          },
          {
            name: "PR",
            completed: false,
            status: "pending",
          },
          {
            name: "Review",
            completed: false,
            status: "pending",
          },
          {
            name: "Deployment",
            completed: false,
            status: "pending",
          },
        ],
      },
      {
        id: "story-1-3",
        name: "CSV export functionality",
        description: "Allow users to export inventory data to CSV format",
        status: { type: "warning", reason: "HITL bottleneck" },
        createdAt: "2024-02-17T10:00:00Z",
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            summary: "Defined CSV export requirements and format",
            executedAt: "2024-02-17T11:00:00Z",
            executionType: "cloud",
          },
          {
            name: "Coding",
            completed: true,
            status: "success",
            summary: "Implemented CSV export with custom field selection",
            executedAt: "2024-02-19T15:00:00Z",
            executionType: "cloud",
          },
          {
            name: "PR",
            completed: true,
            status: "success",
            summary: "PR created and checks passed",
            executedAt: "2024-02-20T10:00:00Z",
            executionType: "cloud",
          },
          {
            name: "Review",
            completed: true,
            status: "success",
            summary: "Awaiting product approval for export format",
            executedAt: "2024-02-21T14:00:00Z",
            executionType: "cloud",
          },
          {
            name: "Deployment",
            completed: false,
            status: "pending",
          },
        ],
      },
    ],
  },
  {
    id: "init-2",
    name: "Support SSO",
    description: "Implement Single Sign-On (SSO) authentication using OAuth 2.0 and SAML protocols",
    phase: "complete",
    template: "New feature",
    createdAt: "2024-01-20T09:00:00Z",
    assignedTo: "Michael Chen",
    stories: [
      {
        id: "story-2-1",
        name: "OAuth 2.0 implementation",
        description: "Implement OAuth 2.0 authorization flow with PKCE",
        status: { type: "complete" },
        createdAt: "2024-01-20T09:00:00Z",
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            summary: "Analyzed OAuth 2.0 requirements and security best practices",
            executedAt: "2024-01-21T11:00:00Z",
            executionType: "cloud",
            artifacts: [
              { type: "Jira Ticket", title: "SSO-123: OAuth Implementation", url: "https://jira.example.com/SSO-123" },
              { type: "Document", title: "OAuth 2.0 Spec", url: "https://docs.example.com/oauth-spec" },
            ],
          },
          {
            name: "Coding",
            completed: true,
            status: "success",
            summary: "Implemented OAuth 2.0 with PKCE, token refresh, and session management",
            executedAt: "2024-01-28T16:45:00Z",
            executionType: "cloud",
            subStages: [
              {
                name: "Coding Progress",
                completed: true,
                summary: "AI agent generated OAuth 2.0 implementation with PKCE flow. Created authentication endpoints, token validation middleware, and session management. Agent iterated 3 times to refine error handling and add comprehensive logging.",
                executedAt: "2024-01-28T14:20:00Z",
                executionType: "cloud",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "User: Implement OAuth 2.0 with PKCE for SSO\nAgent: Created auth controller with /authorize, /token, /callback endpoints\nUser: Add better error handling for token expiration\nAgent: Enhanced error handling with specific error codes and user-friendly messages\nUser: Add session refresh logic\nAgent: Implemented automatic token refresh with sliding window expiration",
                artifacts: [
                  { type: "Document", title: "Prompt Log", url: "https://logs.example.com/prompt-session-abc123" },
                  { type: "Changeset", title: "Commit 1a2b3c4", url: "https://github.com/example/repo/commit/1a2b3c4" },
                ],
                executor: { type: "agent", name: "CodeGen", details: "Claude / Sonnet 4.5" },
              },
              {
                name: "Local Review",
                completed: true,
                summary: "Developer reviewed AI-generated code for security best practices. Verified PKCE implementation matches OAuth 2.0 RFC standards. Checked token storage uses httpOnly cookies. Validated CSRF protection is enabled.",
                executedAt: "2024-01-28T15:30:00Z",
                executionType: "local",
                status: "success",
                artifacts: [
                  { type: "Document", title: "Review Checklist", url: "https://docs.example.com/sso-review-checklist" },
                ],
                executor: { type: "agent", name: "CodeReviewer", details: "Claude / Opus 4" },
              },
              {
                name: "Local Tests and Lints",
                completed: true,
                summary: "Ran unit tests (42 tests, 100% pass rate). Integration tests with mock OAuth provider (8 scenarios, all passed). ESLint found 0 errors, 2 warnings (fixed). TypeScript compilation successful with strict mode.",
                executedAt: "2024-01-28T16:45:00Z",
                executionType: "local",
                status: "success",
                artifacts: [
                  { type: "Document", title: "Test Report", url: "https://tests.example.com/report-sso-123" },
                  { type: "Document", title: "Coverage Report", url: "https://coverage.example.com/sso" },
                ],
                executor: { type: "agent", name: "TestRunner", details: "Local Agent / Haiku" },
              },
            ],
          },
          {
            name: "PR",
            completed: true,
            status: "success",
            summary: "Created pull request with SSO implementation. All CI checks passed. Code coverage at 87%. Security scan completed with no critical issues.",
            executedAt: "2024-01-29T10:15:00Z",
            executionType: "cloud",
            artifacts: [
              { type: "PR", title: "PR #234: Add SSO Support", url: "https://github.com/example/repo/pull/234" },
            ],
            subStages: [
              {
                name: "PR Created",
                completed: true,
                summary: "Pull request created with 47 files changed, 2,345 additions, 156 deletions. Automated description generated including feature overview, testing notes, and breaking changes.",
                executedAt: "2024-01-29T09:00:00Z",
                executionType: "cloud",
                status: "success",
                artifacts: [
                  { type: "PR", title: "PR #234: Add SSO Support", url: "https://github.com/example/repo/pull/234" },
                ],
                executor: { type: "agent", name: "PRBot", details: "GitHub Bot / Automation" },
              },
              {
                name: "Checks Passing",
                completed: true,
                summary: "All CI/CD checks passed: Unit tests (42/42), Integration tests (8/8), ESLint (0 errors), TypeScript compilation, Security scan (0 critical vulnerabilities), Code coverage (87% - above 80% threshold).",
                executedAt: "2024-01-29T10:15:00Z",
                executionType: "cloud",
                status: "success",
                artifacts: [
                  { type: "Document", title: "CI Pipeline Results", url: "https://ci.example.com/builds/sso-234" },
                ],
                executor: { type: "agent", name: "CI/CD", details: "GitHub Actions / CI" },
              },
            ],
          },
          {
            name: "Review",
            completed: true,
            status: "success",
            summary: "Code review completed by senior engineers. Addressed feedback on token expiration handling and error messages. Security team approved the implementation. All comments resolved.",
            executedAt: "2024-02-02T14:20:00Z",
            executionType: "cloud",
            artifacts: [
              { type: "PR", title: "PR #234: Add SSO Support", url: "https://github.com/example/repo/pull/234" },
            ],
            subStages: [
              {
                name: "Review Agent",
                completed: true,
                summary: "AI code review agent analyzed PR for code quality, security vulnerabilities, and best practices. Found 3 suggestions: improve error handling in token refresh, add rate limiting to auth endpoints, update JSDoc comments. All suggestions addressed in follow-up commits.",
                executedAt: "2024-01-30T11:00:00Z",
                executionType: "cloud",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "Agent: Analyzing PR #234 for code quality and security issues\nAgent: Found 3 recommendations - generating detailed review comments\nAgent: Suggestion 1: Add exponential backoff to token refresh logic\nAgent: Suggestion 2: Implement rate limiting for /authorize endpoint\nAgent: Suggestion 3: Add comprehensive JSDoc for public API methods",
                artifacts: [
                  { type: "Document", title: "AI Review Report", url: "https://review.example.com/ai-report-234" },
                  { type: "Document", title: "Prompt Log", url: "https://logs.example.com/review-session-234" },
                ],
                executor: { type: "agent", name: "ReviewAgent", details: "Claude / Opus 4" },
              },
              {
                name: "Human Signoff",
                completed: true,
                summary: "Senior engineer reviewed AI suggestions and code changes. Verified OAuth 2.0 compliance, security best practices, and architectural alignment. Approved PR for merge.",
                executedAt: "2024-02-02T14:20:00Z",
                executionType: "cloud",
                status: "success",
                artifacts: [
                  { type: "PR", title: "PR #234: Add SSO Support", url: "https://github.com/example/repo/pull/234" },
                ],
                executor: { type: "user", name: "sarah.johnson", details: "Staff Engineer" },
              },
            ],
          },
          {
            name: "Deployment",
            completed: true,
            status: "success",
            summary: "Successfully deployed SSO feature to production",
            executedAt: "2024-02-06T10:00:00Z",
            executionType: "cloud",
            subStages: [
              {
                name: "Deploy to Prod",
                completed: true,
                summary: "Deployed SSO service to production Kubernetes cluster. Rolling deployment completed across 5 pods. Database migrations applied successfully. Feature flag enabled for gradual rollout (10% of users).",
                executedAt: "2024-02-06T10:00:00Z",
                executionType: "cloud",
                status: "success",
                artifacts: [
                  { type: "Deployment Log", title: "Production Deployment #456", url: "https://deploy.example.com/deployments/456" },
                  { type: "Document", title: "Deployment Runbook", url: "https://docs.example.com/sso-deployment" },
                ],
                executor: { type: "agent", name: "DeployBot", details: "ArgoCD / GitOps" },
              },
              {
                name: "Monitor",
                completed: true,
                summary: "Monitoring confirmed successful deployment. 0 errors, 45 successful logins, average response time 234ms.",
                executedAt: "2024-02-06T10:30:00Z",
                executionType: "cloud",
                status: "success",
                artifacts: [
                  { type: "Document", title: "Grafana Dashboard", url: "https://grafana.example.com/d/sso-metrics" },
                ],
                executor: { type: "agent", name: "MonitorAgent", details: "Datadog / APM" },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "init-3",
    name: "Implement dark mode",
    description: "Add dark mode theme support to the application with automatic theme detection, manual toggle, and persistent user preferences. Includes updating all components to support both light and dark color schemes.",
    phase: "story_breakdown",
    template: "New feature",
    createdAt: "2024-02-10T08:00:00Z",
    assignedTo: "Emily Rodriguez",
    stories: [
      {
        id: "story-3-1",
        name: "Dark mode theme system",
        description: "Implement dark mode theme system with CSS variables and theme toggle",
        status: { type: "warning", reason: "Agent processing time too long" },
        createdAt: "2024-02-10T08:00:00Z",
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            summary: "Reviewed dark mode requirements with design and product teams. Analyzed existing component library for theme support compatibility.",
            executedAt: "2024-02-11T14:00:00Z",
            executionType: "cloud",
            artifacts: [
              { type: "Jira Ticket", title: "DARK-123: Dark Mode Support", url: "https://jira.example.com/DARK-123" },
              { type: "Document", title: "Design Specifications", url: "https://docs.example.com/dark-mode-specs" },
            ],
            subStages: [
              {
                name: "Validate issue context",
                completed: true,
                summary: "Agent analyzed existing component library and CSS architecture. Identified 45 components requiring theme updates. Verified CSS variable support in target browsers.",
                executedAt: "2024-02-11T10:00:00Z",
                executionType: "cloud",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "Agent: Analyzing DARK-123 - Implement dark mode\nAgent: Scanning CSS architecture and component library\nAgent: Found: 45 components, CSS-in-JS with styled-components\nAgent: Browser support: CSS variables supported in 97% of target users\nAgent: Recommendation: Use CSS custom properties for theme tokens",
                artifacts: [
                  { type: "Document", title: "Component Analysis", url: "https://docs.example.com/dark-mode-analysis" },
                ],
                executor: { type: "agent", name: "ContextAnalyzer", details: "Claude / Opus 4" },
              },
              {
                name: "Request Clarifications",
                completed: true,
                summary: "Agent identified 3 design ambiguities and generated clarification questions. Design team provided answers on: theme toggle placement (header vs settings), default theme (system preference vs light), and transition animations (instant vs smooth fade).",
                executedAt: "2024-02-11T14:00:00Z",
                executionType: "cloud",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "Agent: Questions about dark mode implementation\nAgent: Question 1: Theme toggle placement?\nUser: Header (visible at all times) plus settings page\nAgent: Question 2: Default theme behavior?\nUser: Follow system preference, allow manual override\nAgent: Question 3: Transition animation?\nUser: Smooth fade with 200ms transition",
                artifacts: [
                  { type: "Document", title: "Design Decisions", url: "https://docs.example.com/dark-mode-decisions" },
                ],
                executor: { type: "agent", name: "RequirementsAgent", details: "Claude / Sonnet 4.5" },
              },
            ],
          },
          {
            name: "Coding",
            completed: false,
            status: "in-progress",
            summary: "Implementing dark mode theme system. Currently updating component library.",
            executedAt: "2024-02-20T09:00:00Z",
            executionType: "cloud",
          },
          {
            name: "PR",
            completed: false,
            status: "pending",
          },
          {
            name: "Review",
            completed: false,
            status: "pending",
          },
          {
            name: "Deployment",
            completed: false,
            status: "pending",
          },
        ],
      },
    ],
  },
  {
    id: "init-4",
    name: "API rate limiting",
    description: "Add rate limiting to API endpoints to prevent abuse and ensure fair usage. Implement Redis-based rate limiting with configurable limits per endpoint and user tier.",
    phase: "complete",
    template: "Bug fix",
    createdAt: "2024-01-15T10:00:00Z",
    assignedTo: "David Kim",
    stories: [
      {
        id: "story-4-1",
        name: "Rate limiting implementation",
        description: "Implement Redis-based rate limiting middleware for API endpoints",
        status: { type: "complete" },
        createdAt: "2024-01-15T10:00:00Z",
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            summary: "Analyzed rate limiting requirements and designed Redis-based solution",
            executedAt: "2024-01-16T14:00:00Z",
            executionType: "cloud",
          },
          {
            name: "Coding",
            completed: true,
            status: "success",
            summary: "Implemented rate limiting middleware with Redis backend",
            executedAt: "2024-01-20T16:00:00Z",
            executionType: "cloud",
          },
          {
            name: "PR",
            completed: true,
            status: "success",
            summary: "Pull request created with comprehensive rate limiting implementation. All CI/CD checks passed.",
            executedAt: "2024-01-22T11:15:00Z",
            executionType: "cloud",
          },
          {
            name: "Review",
            completed: true,
            status: "success",
            summary: "Code review completed by senior engineers and security team. All feedback addressed.",
            executedAt: "2024-01-25T16:20:00Z",
            executionType: "cloud",
          },
          {
            name: "Deployment",
            completed: true,
            status: "success",
            summary: "Successfully deployed rate limiting to production. Monitoring shows 99.9% of requests within limits.",
            executedAt: "2024-01-28T17:00:00Z",
            executionType: "cloud",
          },
        ],
      },
    ],
  },
  {
    id: "init-5",
    name: "Mobile app integration",
    description: "Create REST API endpoints for mobile app integration supporting iOS and Android clients. Includes authentication, data synchronization, push notifications, and offline mode support.",
    phase: "story_breakdown",
    template: "New feature",
    createdAt: "2024-02-18T10:00:00Z",
    assignedTo: "Alex Turner",
    stories: [
      {
        id: "story-5-1",
        name: "Mobile API endpoints",
        description: "Create REST API endpoints for mobile data sync and authentication",
        status: { type: "warning", reason: "Repeated agent errors" },
        createdAt: "2024-02-18T10:00:00Z",
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            summary: "Analyzed mobile app integration requirements with mobile team. Defined REST API endpoints, authentication strategy, and offline sync approach.",
            executedAt: "2024-02-19T14:00:00Z",
            executionType: "cloud",
            artifacts: [
              { type: "Jira Ticket", title: "MOB-234: Mobile API", url: "https://jira.example.com/MOB-234" },
              { type: "Document", title: "API Specification", url: "https://docs.example.com/mobile-api-spec" },
            ],
            subStages: [
              {
                name: "Validate issue context",
                completed: true,
                summary: "Agent analyzed existing API architecture and mobile app requirements. Identified need for 8 new endpoints for data sync, auth, and push notifications. Verified JWT token compatibility with mobile SDKs.",
                executedAt: "2024-02-19T10:00:00Z",
                executionType: "cloud",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "Agent: Analyzing MOB-234 - Mobile app API integration\nAgent: Scanning existing API and authentication system\nAgent: Found: REST API with JWT auth, no mobile-specific endpoints\nAgent: Requirements: Data sync, offline support, push notifications\nAgent: Recommendation: Create versioned mobile API with delta sync",
                artifacts: [
                  { type: "Document", title: "Mobile API Analysis", url: "https://docs.example.com/mobile-analysis" },
                ],
                executor: { type: "agent", name: "ContextAnalyzer", details: "Claude / Opus 4" },
              },
              {
                name: "Request Clarifications",
                completed: true,
                summary: "Agent identified questions on sync strategy and offline behavior. Mobile team clarified: delta sync every 5 minutes, offline queue with conflict resolution, FCM for push notifications on Android and APNs for iOS.",
                executedAt: "2024-02-19T14:00:00Z",
                executionType: "cloud",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "Agent: Questions about mobile integration\nAgent: Question 1: Sync strategy - full vs delta?\nUser: Delta sync with lastSyncTime parameter\nAgent: Question 2: Offline conflict resolution?\nUser: Last-write-wins with user notification on conflicts\nAgent: Question 3: Push notification service?\nUser: FCM for Android, APNs for iOS",
                artifacts: [
                  { type: "Document", title: "Mobile API Decisions", url: "https://docs.example.com/mobile-decisions" },
                ],
                executor: { type: "agent", name: "RequirementsAgent", details: "Claude / Sonnet 4.5" },
              },
            ],
          },
          {
            name: "Coding",
            completed: false,
            status: "in-progress",
            summary: "Implementing mobile API endpoints with authentication and sync logic. Currently debugging token validation issues.",
            executedAt: "2024-02-20T14:00:00Z",
            executionType: "cloud",
            subStages: [
              {
                name: "Coding Progress",
                completed: true,
                summary: "AI agent created 6 mobile API endpoints for data sync, user profile, and settings. Implemented JWT token refresh flow. Still working on push notification registration endpoint with authentication issues.",
                executedAt: "2024-02-20T11:30:00Z",
                executionType: "cloud",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "User: Create mobile API endpoints with JWT authentication\nAgent: Generated /api/mobile/sync, /api/mobile/profile endpoints\nUser: Add token refresh flow\nAgent: Implemented refresh token with 7-day expiry\nUser: Add push notification registration\nAgent: Created /api/mobile/push/register endpoint",
                artifacts: [
                  { type: "Changeset", title: "Commit 7c8d9e0", url: "https://github.com/example/repo/commit/7c8d9e0" },
                ],
                executor: { type: "agent", name: "CodeGen", details: "Claude / Sonnet 4.5" },
              },
              {
                name: "Local Review",
                completed: true,
                summary: "Reviewed API endpoints for mobile best practices. Verified response pagination and data minimization. Identified token validation issue in push notification endpoint.",
                executedAt: "2024-02-20T13:00:00Z",
                executionType: "local",
                status: "success",
                artifacts: [
                  { type: "Document", title: "Code Review Notes", url: "https://docs.example.com/mobile-review" },
                ],
                executor: { type: "agent", name: "CodeReviewer", details: "Claude / Opus 4" },
              },
              {
                name: "Local Tests and Lints",
                completed: false,
                summary: "Running test suite - 12/18 tests passing. 6 failing tests related to JWT token validation in push notification flow. Debugging authentication middleware interaction.",
                executedAt: "2024-02-20T14:00:00Z",
                executionType: "local",
                status: "in-progress",
                executor: { type: "agent", name: "TestRunner", details: "Local Agent / Haiku" },
              },
            ],
          },
          {
            name: "PR",
            completed: false,
            status: "pending",
          },
          {
            name: "Review",
            completed: false,
            status: "pending",
          },
          {
            name: "Deployment",
            completed: false,
            status: "pending",
          },
        ],
      },
    ],
  },
  {
    id: "init-6",
    name: "Performance optimization",
    description: "Optimize application performance by addressing slow database queries, inefficient rendering, and memory leaks. Target 50% reduction in page load times and improved responsiveness.",
    phase: "final_validation",
    template: "Bug fix",
    createdAt: "2024-02-05T09:00:00Z",
    assignedTo: "Sarah Johnson",
    stories: [
      {
        id: "story-6-1",
        name: "Database query optimization",
        description: "Optimize N+1 queries and add database indexes",
        status: { type: "in_progress_agent" },
        createdAt: "2024-02-05T09:00:00Z",
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            summary: "Profiled application performance and identified bottlenecks. Key issues: N+1 database queries, large bundle size, and unnecessary re-renders.",
            executedAt: "2024-02-06T13:00:00Z",
            executionType: "local",
            artifacts: [
              { type: "Jira Ticket", title: "PERF-567: Performance Issues", url: "https://jira.example.com/PERF-567" },
              { type: "Document", title: "Performance Report", url: "https://docs.example.com/perf-report" },
            ],
            subStages: [
              {
                name: "Validate issue context",
                completed: true,
                summary: "Agent ran performance profiling and analyzed flame graphs. Found 45 N+1 query patterns, 4.2MB bundle size (target: <2MB), and 15 components with expensive renders. Database query time accounts for 78% of page load.",
                executedAt: "2024-02-06T10:00:00Z",
                executionType: "local",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "Agent: Profiling application performance\nAgent: Found N+1 queries in user listings (45 instances)\nAgent: Bundle size: 4.2MB (React DevTools: 45% vendor, 30% app code)\nAgent: Identified: memo() missing on 15 expensive components\nAgent: Recommendation: Add database indexes, code splitting, React.memo",
                artifacts: [
                  { type: "Document", title: "Profiling Results", url: "https://docs.example.com/profiling-results" },
                ],
                executor: { type: "agent", name: "ContextAnalyzer", details: "Claude / Opus 4" },
              },
              {
                name: "Request Clarifications",
                completed: true,
                summary: "Agent identified optimization trade-offs and asked for priorities. Team decided: focus on database queries first (biggest impact), then bundle size, then React optimizations. Target: 50% load time reduction.",
                executedAt: "2024-02-06T13:00:00Z",
                executionType: "local",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "Agent: Performance optimization priorities?\nAgent: Option 1: Database queries (78% of load time)\nUser: Start with database, highest impact\nAgent: Option 2: Bundle size reduction approach?\nUser: Code splitting by route, lazy load heavy components\nAgent: Option 3: Target performance improvement?\nUser: 50% reduction in page load time (3.2s → 1.6s)",
                executor: { type: "agent", name: "RequirementsAgent", details: "Claude / Sonnet 4.5" },
              },
            ],
          },
          {
            name: "Coding",
            completed: true,
            status: "success",
            summary: "Added database indexes for frequently queried columns. Implemented query batching to eliminate N+1 patterns. Added React.memo to expensive components and code splitting for large modules.",
            executedAt: "2024-02-12T17:00:00Z",
            executionType: "local",
            artifacts: [
              { type: "Changeset", title: "Commit 9d0e1f2", url: "https://github.com/example/repo/commit/9d0e1f2" },
            ],
            subStages: [
              {
                name: "Coding Progress",
                completed: true,
                summary: "AI agent added 12 database indexes and implemented DataLoader for query batching. Applied React.memo to 15 components. Added dynamic imports for code splitting. Performance tests show 55% load time reduction.",
                executedAt: "2024-02-12T14:20:00Z",
                executionType: "local",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "User: Optimize database queries and eliminate N+1 patterns\nAgent: Created indexes on user_id, created_at, status columns\nAgent: Implemented DataLoader for batch query loading\nUser: Reduce bundle size with code splitting\nAgent: Added dynamic imports, reduced bundle to 2.1MB\nUser: Optimize React rendering\nAgent: Applied React.memo to expensive components",
                artifacts: [
                  { type: "Document", title: "Performance Benchmarks", url: "https://docs.example.com/perf-benchmarks" },
                ],
                executor: { type: "agent", name: "CodeGen", details: "Claude / Sonnet 4.5" },
              },
              {
                name: "Local Review",
                completed: true,
                summary: "Reviewed performance optimizations for correctness and maintainability. Verified indexes don't slow down write operations. Checked memo dependencies are correct.",
                executedAt: "2024-02-12T15:30:00Z",
                executionType: "local",
                status: "success",
                executor: { type: "agent", name: "CodeReviewer", details: "Claude / Opus 4" },
              },
              {
                name: "Local Tests and Lints",
                completed: true,
                summary: "All tests passing (34/34). Performance tests confirm 55% load time reduction (3.2s → 1.4s). Database write performance impact: +8ms (acceptable).",
                executedAt: "2024-02-12T17:00:00Z",
                executionType: "local",
                status: "success",
                artifacts: [
                  { type: "Document", title: "Perf Test Results", url: "https://tests.example.com/perf-results" },
                ],
                executor: { type: "agent", name: "TestRunner", details: "Local Agent / Haiku" },
              },
            ],
          },
          {
            name: "PR",
            completed: true,
            status: "success",
            summary: "PR created with performance optimizations",
            executedAt: "2024-02-13T10:00:00Z",
            executionType: "cloud",
          },
          {
            name: "Review",
            completed: false,
            status: "in-progress",
            summary: "Code review in progress. Verifying performance improvements meet 50% reduction target.",
            executedAt: "2024-02-15T14:00:00Z",
            executionType: "cloud",
            subStages: [
              {
                name: "Review Agent",
                completed: true,
                summary: "AI review confirmed performance improvements. Suggested adding monitoring for query performance regression and bundle size alerts. Recommended load testing before production deployment.",
                executedAt: "2024-02-15T11:00:00Z",
                executionType: "cloud",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "Agent: Reviewing performance optimization PR\nAgent: Verified: 55% load time reduction (exceeds 50% target)\nAgent: Suggestion 1: Add Datadog APM for query monitoring\nAgent: Suggestion 2: Set up bundle size alerts in CI\nAgent: Suggestion 3: Run load tests before prod deployment",
                executor: { type: "agent", name: "ReviewAgent", details: "Claude / Opus 4" },
              },
              {
                name: "Human Signoff",
                completed: false,
                summary: "Waiting for senior engineer to review database index strategy and approve for production.",
                executedAt: "2024-02-15T14:00:00Z",
                executionType: "cloud",
                status: "in-progress",
                executor: { type: "user", name: "sarah.johnson", details: "Staff Engineer" },
              },
            ],
          },
          {
            name: "Deployment",
            completed: false,
            status: "pending",
          },
        ],
      },
    ],
  },
  {
    id: "init-7",
    name: "User analytics dashboard",
    description: "Build comprehensive analytics dashboard showing user engagement metrics, retention rates, conversion funnels, and real-time activity. Features interactive charts with D3.js and customizable date ranges.",
    phase: "final_validation",
    template: "New feature",
    createdAt: "2024-01-25T09:00:00Z",
    assignedTo: "Michael Chen",
    stories: [
      {
        id: "story-7-1",
        name: "Analytics dashboard implementation",
        description: "Build D3.js-based analytics dashboard with real-time updates",
        status: { type: "warning", reason: "HITL bottleneck" },
        createdAt: "2024-01-25T09:00:00Z",
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            summary: "Analyzed analytics dashboard requirements with product and data teams. Defined key metrics, data sources, and visualization requirements.",
            executedAt: "2024-01-26T14:00:00Z",
            executionType: "cloud",
            artifacts: [
              { type: "Jira Ticket", title: "ANALYTICS-901: Dashboard", url: "https://jira.example.com/ANALYTICS-901" },
              { type: "Document", title: "Analytics Requirements", url: "https://docs.example.com/analytics-requirements" },
            ],
            subStages: [
              {
                name: "Validate issue context",
                completed: true,
                summary: "Agent analyzed existing analytics infrastructure and data pipeline. Identified available metrics in database: user sessions, page views, conversion events, and retention data. Verified D3.js compatibility with React 19 and Next.js 15.",
                executedAt: "2024-01-26T10:00:00Z",
                executionType: "cloud",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "Agent: Analyzing ANALYTICS-901 - User analytics dashboard\nAgent: Scanning database schema for available metrics\nAgent: Found: user_events table with 8M+ records, sessions, conversions\nAgent: Current reporting: Only basic GA4, no internal dashboard\nAgent: Libraries: D3.js v7 compatible, Recharts as alternative\nAgent: Recommendation: Use D3.js for flexibility with custom visualizations",
                artifacts: [
                  { type: "Document", title: "Data Analysis", url: "https://docs.example.com/analytics-data-analysis" },
                  { type: "Document", title: "Prompt Log", url: "https://logs.example.com/context-validation-901" },
                ],
                executor: { type: "agent", name: "ContextAnalyzer", details: "Claude / Opus 4" },
              },
              {
                name: "Request Clarifications",
                completed: true,
                summary: "Agent identified questions on metric calculations and visualization preferences. Product team clarified: 7-day and 30-day retention cohorts, conversion funnel with 5 steps, real-time updates every 30 seconds, date range picker with presets (today, week, month, quarter).",
                executedAt: "2024-01-26T14:00:00Z",
                executionType: "cloud",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "Agent: Questions about analytics dashboard requirements\nAgent: Question 1: Which retention cohorts to display?\nUser: 7-day and 30-day cohorts with week-over-week comparison\nAgent: Question 2: Conversion funnel steps?\nUser: 5 steps: Signup → Activation → First Action → Repeat User → Paid\nAgent: Question 3: Real-time update frequency?\nUser: 30-second intervals for active users, 5-minute for aggregated metrics\nAgent: Question 4: Date range options?\nUser: Today, Last 7 days, Last 30 days, Last 90 days, Custom range",
                artifacts: [
                  { type: "Document", title: "Metrics Definitions", url: "https://docs.example.com/metrics-definitions" },
                  { type: "Document", title: "Prompt Log", url: "https://logs.example.com/clarifications-901" },
                ],
                executor: { type: "agent", name: "RequirementsAgent", details: "Claude / Sonnet 4.5" },
              },
            ],
          },
          {
            name: "Coding",
            completed: true,
            status: "success",
            summary: "Built analytics dashboard with D3.js visualizations. Implemented line charts for engagement trends, bar charts for conversion funnels, heatmaps for user activity patterns, and real-time WebSocket updates.",
            executedAt: "2024-02-02T17:00:00Z",
            executionType: "cloud",
            artifacts: [
              { type: "Changeset", title: "Commit b9c0d1e", url: "https://github.com/example/repo/commit/b9c0d1e" },
            ],
            subStages: [
              {
                name: "Coding Progress",
                completed: true,
                summary: "AI agent generated analytics dashboard components with D3.js. Created responsive charts for engagement metrics, retention cohorts, and conversion funnels. Implemented WebSocket connection for real-time updates and date range picker with custom presets. Added data aggregation queries optimized for performance.",
                executedAt: "2024-02-02T14:30:00Z",
                executionType: "cloud",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "User: Create analytics dashboard with D3.js visualizations\nAgent: Generated AnalyticsDashboard component with line, bar, and heatmap charts\nUser: Add real-time updates for active users\nAgent: Implemented WebSocket connection with 30-second polling fallback\nUser: Create date range picker with presets\nAgent: Built DateRangePicker with quick selects and custom range calendar\nUser: Optimize database queries for large datasets\nAgent: Added SQL aggregation queries with indexes, reduced query time from 4s to 180ms\nUser: Make charts responsive for mobile\nAgent: Applied responsive D3.js patterns with viewport-based dimensions",
                artifacts: [
                  { type: "Document", title: "Prompt Log", url: "https://logs.example.com/prompt-session-analytics-901" },
                  { type: "Changeset", title: "Commit 3d4e5f6", url: "https://github.com/example/repo/commit/3d4e5f6" },
                ],
                executor: { type: "agent", name: "CodeGen", details: "Claude / Sonnet 4.5" },
              },
              {
                name: "Local Review",
                completed: true,
                summary: "Reviewed dashboard implementation for data accuracy and performance. Verified metric calculations against SQL queries. Tested real-time updates under load. Confirmed chart responsiveness and accessibility with keyboard navigation.",
                executedAt: "2024-02-02T15:45:00Z",
                executionType: "local",
                status: "success",
                artifacts: [
                  { type: "Document", title: "Review Checklist", url: "https://docs.example.com/analytics-review" },
                ],
                executor: { type: "agent", name: "CodeReviewer", details: "Claude / Opus 4" },
              },
              {
                name: "Local Tests and Lints",
                completed: true,
                summary: "All tests passing (52/52). Unit tests for metric calculations, integration tests for WebSocket updates, visual regression tests for charts. Performance test: dashboard loads in 1.2s with 100k data points. ESLint: 0 errors, 1 warning (D3.js type definition).",
                executedAt: "2024-02-02T17:00:00Z",
                executionType: "local",
                status: "success",
                artifacts: [
                  { type: "Document", title: "Test Report", url: "https://tests.example.com/report-analytics" },
                  { type: "Document", title: "Performance Report", url: "https://tests.example.com/perf-analytics" },
                ],
                executor: { type: "agent", name: "TestRunner", details: "Local Agent / Haiku" },
              },
            ],
          },
          {
            name: "PR",
            completed: true,
            status: "success",
            summary: "Pull request created with analytics dashboard implementation. All CI/CD checks passed including visual regression tests.",
            executedAt: "2024-02-05T11:30:00Z",
            executionType: "cloud",
            artifacts: [
              { type: "PR", title: "PR #789: Analytics Dashboard", url: "https://github.com/example/repo/pull/789" },
            ],
            subStages: [
              {
                name: "PR Created",
                completed: true,
                summary: "Pull request created with 34 files changed (28 new components, 6 modified). Automated PR description includes screenshots of all chart types and performance benchmarks.",
                executedAt: "2024-02-05T09:00:00Z",
                executionType: "cloud",
                status: "success",
                artifacts: [
                  { type: "PR", title: "PR #789: Analytics Dashboard", url: "https://github.com/example/repo/pull/789" },
                ],
                executor: { type: "agent", name: "PRBot", details: "GitHub Bot / Automation" },
              },
              {
                name: "Checks Passing",
                completed: true,
                summary: "All CI/CD checks passed: Unit tests (52/52), Integration tests (18/18), Visual regression (15/15), Performance benchmarks (all < 2s load time), Bundle size check (added 245KB after gzip - acceptable).",
                executedAt: "2024-02-05T11:30:00Z",
                executionType: "cloud",
                status: "success",
                artifacts: [
                  { type: "Document", title: "CI Results", url: "https://ci.example.com/builds/analytics-789" },
                  { type: "Document", title: "Visual Regression", url: "https://percy.io/analytics-789" },
                ],
                executor: { type: "agent", name: "CI/CD", details: "GitHub Actions / CI" },
              },
            ],
          },
          {
            name: "Review",
            completed: true,
            status: "success",
            summary: "Code review completed by engineering and product teams. Data team verified metric accuracy. All feedback addressed.",
            executedAt: "2024-02-08T16:20:00Z",
            executionType: "cloud",
            artifacts: [
              { type: "PR", title: "PR #789: Analytics Dashboard", url: "https://github.com/example/repo/pull/789" },
            ],
            subStages: [
              {
                name: "Review Agent",
                completed: true,
                summary: "AI code review found 2 suggestions: add error boundaries for D3.js rendering failures and implement data caching to reduce database load. Both addressed in follow-up commits. Performance impact verified: 60% reduction in API calls with 5-minute cache.",
                executedAt: "2024-02-06T11:00:00Z",
                executionType: "cloud",
                status: "success",
                aiAssisted: true,
                promptLogSummary: "Agent: Reviewing PR #789 for analytics dashboard\nAgent: Code quality: Excellent separation of concerns, reusable chart components\nAgent: Suggestion 1: Add React error boundaries for D3.js failures\nAgent: Suggestion 2: Implement Redis cache for aggregated metrics (5-min TTL)\nAgent: Performance: 1.2s load time excellent, consider lazy loading charts below fold\nAgent: Verified: Metric calculations match SQL queries exactly",
                artifacts: [
                  { type: "Document", title: "AI Review", url: "https://review.example.com/ai-789" },
                  { type: "Document", title: "Prompt Log", url: "https://logs.example.com/review-789" },
                ],
                executor: { type: "agent", name: "ReviewAgent", details: "Claude / Opus 4" },
              },
              {
                name: "Human Signoff",
                completed: true,
                summary: "Senior engineer and product manager reviewed dashboard. Data team verified metric calculations against existing reports. Approved for production with recommendation for gradual rollout to monitor database load.",
                executedAt: "2024-02-08T16:20:00Z",
                executionType: "cloud",
                status: "success",
                artifacts: [
                  { type: "PR", title: "PR #789: Analytics Dashboard", url: "https://github.com/example/repo/pull/789" },
                  { type: "Document", title: "Data Validation Report", url: "https://docs.example.com/data-validation" },
                ],
                executor: { type: "user", name: "michael.chen", details: "Staff Engineer" },
              },
            ],
          },
          {
            name: "Deployment",
            completed: false,
            status: "in-progress",
            summary: "Deployment ready. Waiting for final product team approval and go-live communication plan before enabling for all users.",
            executedAt: "2024-02-12T11:00:00Z",
            executionType: "cloud",
            subStages: [
              {
                name: "Deploy to Prod",
                completed: true,
                summary: "Deployed analytics dashboard to production with feature flag. Database indexes applied. Redis cache warmed. Rolling deployment to 10% of users successful with no performance degradation.",
                executedAt: "2024-02-12T10:00:00Z",
                executionType: "cloud",
                status: "success",
                artifacts: [
                  { type: "Deployment Log", title: "Production Deploy #892", url: "https://deploy.example.com/892" },
                  { type: "Document", title: "Deployment Runbook", url: "https://docs.example.com/analytics-deployment" },
                ],
                executor: { type: "agent", name: "DeployBot", details: "ArgoCD / GitOps" },
              },
              {
                name: "Monitor",
                completed: false,
                summary: "Monitoring 10% rollout. Current metrics: 0 errors, 450 dashboard views, avg load time 980ms, database query time 165ms (excellent). Waiting for product approval to increase rollout to 100%.",
                executedAt: "2024-02-12T11:00:00Z",
                executionType: "cloud",
                status: "in-progress",
                artifacts: [
                  { type: "Document", title: "Analytics Dashboard Metrics", url: "https://grafana.example.com/d/analytics-metrics" },
                ],
                executor: { type: "agent", name: "MonitorAgent", details: "Datadog / APM" },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "init-8",
    name: "Email notification system",
    description: "Implement automated email notification system using SendGrid for transactional emails, alerts, and marketing campaigns. Includes responsive email templates and delivery tracking.",
    phase: "final_validation",
    template: "Support Ticket",
    createdAt: "2024-02-01T10:00:00Z",
    assignedTo: "Emily Rodriguez",
    stories: [
      {
        id: "story-8-1",
        name: "Email notification implementation",
        description: "Implement SendGrid-based email system with responsive templates",
        status: { type: "in_progress_agent" },
        createdAt: "2024-02-01T10:00:00Z",
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            summary: "Analyzed email notification requirements. Defined templates for different notification types.",
            executedAt: "2024-02-02T11:00:00Z",
            executionType: "cloud",
          },
          {
            name: "Coding",
            completed: true,
            status: "success",
            summary: "Implemented email service with SendGrid. Created responsive email templates.",
            executedAt: "2024-02-08T16:00:00Z",
            executionType: "cloud",
          },
          {
            name: "PR",
            completed: true,
            status: "success",
            summary: "PR created with email notification system",
            executedAt: "2024-02-10T10:00:00Z",
            executionType: "cloud",
          },
          {
            name: "Review",
            completed: true,
            status: "success",
            summary: "Code review completed. All email templates tested across email clients.",
            executedAt: "2024-02-12T14:00:00Z",
            executionType: "cloud",
          },
          {
            name: "Deployment",
            completed: false,
            status: "in-progress",
            summary: "Rolling out email notifications to production in phases.",
            executedAt: "2024-02-16T10:00:00Z",
            executionType: "cloud",
          },
        ],
      },
    ],
  },
]
