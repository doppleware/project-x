export type InitiativeTemplate = "New feature" | "Support Ticket" | "Bug fix" | "Research"

export interface StageArtifact {
  type: "PR" | "Changeset" | "Jira Ticket" | "GitHub Issue" | "Document" | "Deployment Log"
  title: string
  url: string
}

export interface StageExecutor {
  type: "user" | "agent"
  name: string
  details?: string // For agent: model info like "Claude / Sonnet 4.5", for user: email or role
}

export interface InitiativeStage {
  name: string
  completed: boolean
  summary?: string
  executedAt?: string
  executionType?: "local" | "cloud"
  status?: "success" | "failed" | "in-progress" | "pending"
  artifacts?: StageArtifact[]
  aiAssisted?: boolean
  promptLogSummary?: string
  subStages?: InitiativeStage[]
  executor?: StageExecutor
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

export type InitiativeStatus =
  | { type: "in_progress_agent" }
  | { type: "hitl_pending" }
  | { type: "complete" }
  | { type: "warning"; reason: "Agent processing time too long" | "HITL bottleneck" | "Repeated agent errors" }

export interface Initiative {
  id: string
  name: string
  description?: string
  lastTask: string
  nextTask: string
  progress: number
  status: "active" | "completed" | "on-hold"
  initiativeStatus: InitiativeStatus
  template: InitiativeTemplate
  stages: InitiativeStage[]
  createdAt?: string
  assignedTo?: string
  sharedContext?: SharedContext
}

export const mockInitiatives: Initiative[] = [
  {
    id: "init-1",
    name: "Add inventory screen for users",
    description: "Create a new inventory management screen that allows users to view, search, and manage their product inventory with real-time updates.",
    lastTask: "Backlog item reviewed",
    nextTask: "Coding",
    progress: 35,
    status: "active",
    initiativeStatus: { type: "in_progress_agent" },
    template: "New feature",
    createdAt: "2024-02-15T10:00:00Z",
    assignedTo: "Sarah Johnson",
    sharedContext: {
      productContext: {
        title: "Product Context",
        summary: "Users need a centralized inventory management screen to view, search, and manage their product inventory. Key features include real-time inventory tracking, advanced search and filtering, bulk operations, and CSV export. The interface should support warehouse managers and admin roles with different permission levels.",
        toc: [
          "User Stories",
          "Search and Filter Requirements",
          "Permissions Model",
          "Export Functionality",
          "Mobile Responsiveness",
        ],
        links: [
          { type: "Issue", title: "PROJ-1234: Inventory Screen", url: "https://jira.example.com/PROJ-1234" },
          { type: "Document", title: "Requirements Document", url: "https://docs.example.com/inventory-requirements" },
          { type: "Document", title: "User Workflows", url: "https://docs.example.com/inventory-workflows" },
        ],
      },
      implementationContext: {
        title: "Implementation Context",
        summary: "The inventory screen reuses existing table components and extends the ProductModel interface for inventory-specific fields. Backend implements server-side pagination with 50 items per page. Search functionality covers product name, SKU, and category. Filters include date range, stock status (in-stock, low-stock, out-of-stock), and category selection.",
        toc: [
          "Component Architecture",
          "API Endpoints",
          "Data Models",
          "Pagination Strategy",
          "Performance Optimization",
        ],
        links: [
          { type: "Code File", title: "components/InventoryList.tsx", url: "https://github.com/example/repo/blob/main/src/components/InventoryList.tsx" },
          { type: "Code File", title: "components/SearchBar.tsx", url: "https://github.com/example/repo/blob/main/src/components/SearchBar.tsx" },
          { type: "Code File", title: "api/inventory.controller.ts", url: "https://github.com/example/repo/blob/main/src/api/inventory.controller.ts" },
          { type: "Code File", title: "models/inventory.model.ts", url: "https://github.com/example/repo/blob/main/src/models/inventory.model.ts" },
          { type: "Document", title: "API Specification", url: "https://docs.example.com/api/inventory" },
        ],
      },
    },
    stages: [
      {
        name: "Backlog grooming",
        completed: true,
        summary: "Reviewed requirements with product team. Identified key user stories: inventory listing, search functionality, bulk operations, and export capabilities. Estimated 3 sprints for completion.",
        executedAt: "2024-02-15T14:30:00Z",
        executionType: "cloud",
        status: "success",
        artifacts: [
          { type: "Jira Ticket", title: "PROJ-1234: Inventory Screen", url: "https://jira.example.com/PROJ-1234" },
          { type: "Document", title: "Requirements Doc", url: "https://docs.example.com/inventory-requirements" },
        ],
        subStages: [
          {
            name: "Validate issue context",
            completed: true,
            summary: "Agent analyzed Jira ticket and existing codebase. Identified related components: inventory service API, product data models, and existing UI patterns. Verified technical feasibility and estimated effort.",
            executedAt: "2024-02-15T10:30:00Z",
            executionType: "cloud",
            status: "success",
            aiAssisted: true,
            promptLogSummary: "Agent: Analyzing PROJ-1234 - Add inventory screen for users\nAgent: Scanning codebase for existing inventory-related code\nAgent: Found: InventoryService API, ProductModel interfaces, ListingPage patterns\nAgent: Validated: All required APIs exist, authentication in place, UI framework compatible\nAgent: Recommendation: Reuse existing table components, extend ProductModel for inventory",
            artifacts: [
              { type: "Document", title: "Context Analysis", url: "https://docs.example.com/context-analysis-1234" },
              { type: "Document", title: "Prompt Log", url: "https://logs.example.com/context-validation-1234" },
            ],
            executor: { type: "agent", name: "ContextAnalyzer", details: "Claude / Opus 4" },
          },
          {
            name: "Request Clarifications",
            completed: true,
            summary: "Agent identified 5 ambiguities in requirements and generated clarification questions. Product team provided answers on: search scope (products only vs all items), export format (CSV vs Excel), filter options (categories, date ranges, status), pagination size (default 50), and permissions model (view-only vs edit).",
            executedAt: "2024-02-15T14:30:00Z",
            executionType: "cloud",
            status: "success",
            aiAssisted: true,
            promptLogSummary: "Agent: Identified unclear requirements in PROJ-1234\nAgent: Question 1: Should search include archived inventory items?\nUser: No, only active items\nAgent: Question 2: Export format preference?\nUser: Start with CSV, Excel in future iteration\nAgent: Question 3: Which filters are required for MVP?\nUser: Category, date range, and status (in-stock, low-stock, out-of-stock)\nAgent: Question 4: Default pagination size?\nUser: 50 items per page\nAgent: Question 5: User permissions - who can edit inventory?\nUser: Admin and warehouse manager roles only",
            artifacts: [
              { type: "Document", title: "Clarification Questions", url: "https://docs.example.com/clarifications-1234" },
              { type: "Document", title: "Prompt Log", url: "https://logs.example.com/clarifications-1234" },
              { type: "Jira Ticket", title: "PROJ-1234: Inventory Screen", url: "https://jira.example.com/PROJ-1234" },
            ],
            executor: { type: "agent", name: "RequirementsAgent", details: "Claude / Sonnet 4.5" },
          },
        ],
      },
      {
        name: "Coding",
        completed: false,
        summary: "Currently implementing inventory screen components and backend API endpoints.",
        status: "in-progress",
        executionType: "cloud",
        subStages: [
          {
            name: "Coding Progress",
            completed: true,
            summary: "AI agent scaffolded React components for inventory list, search bar, and filters. Generated TypeScript interfaces for inventory items. Created REST API endpoints for CRUD operations. Agent made 5 iterations based on feedback about pagination and sorting requirements.",
            executedAt: "2024-02-18T11:30:00Z",
            executionType: "cloud",
            status: "success",
            aiAssisted: true,
            promptLogSummary: "User: Create inventory management screen with search and filters\nAgent: Generated InventoryList, SearchBar, and FilterPanel components with TypeScript\nUser: Add pagination with 50 items per page\nAgent: Implemented server-side pagination with useQuery hook\nUser: Add sorting by name, date, quantity\nAgent: Added sortable table headers with ascending/descending toggle\nUser: Make it responsive for mobile\nAgent: Applied Tailwind responsive classes and mobile-first design",
            artifacts: [
              { type: "Document", title: "Prompt Log", url: "https://logs.example.com/prompt-session-xyz789" },
              { type: "Changeset", title: "Commit 7d8e9f0", url: "https://github.com/example/repo/commit/7d8e9f0" },
            ],
            executor: { type: "agent", name: "CodeGen", details: "Claude / Sonnet 4.5" },
          },
          {
            name: "Local Review",
            completed: true,
            summary: "Reviewed component structure and API design. Verified data validation on both frontend and backend. Checked accessibility with screen reader. Confirmed responsive design works on mobile devices.",
            executedAt: "2024-02-18T14:00:00Z",
            executionType: "local",
            status: "success",
            artifacts: [
              { type: "Document", title: "Review Notes", url: "https://docs.example.com/inventory-review" },
            ],
            executor: { type: "agent", name: "CodeReviewer", details: "Claude / Opus 4" },
          },
          {
            name: "Local Tests and Lints",
            completed: false,
            summary: "Running test suite - 15/20 tests passing. 2 failing tests in search functionality, 3 pending for export feature. ESLint check in progress.",
            executedAt: "2024-02-18T15:30:00Z",
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
  {
    id: "init-2",
    name: "Support SSO",
    description: "Implement Single Sign-On (SSO) authentication using OAuth 2.0 and SAML protocols to allow enterprise customers to integrate with their identity providers.",
    lastTask: "Code Review",
    nextTask: "Deployment Monitoring",
    progress: 80,
    status: "active",
    initiativeStatus: { type: "hitl_pending" },
    template: "New feature",
    createdAt: "2024-01-20T09:00:00Z",
    assignedTo: "Michael Chen",
    sharedContext: {
      productContext: {
        title: "Product Context",
        summary: "Enterprise customers need Single Sign-On (SSO) to integrate with their identity providers (Okta, Auth0, Azure AD). This feature enables secure authentication using OAuth 2.0 with PKCE, reducing password fatigue and improving security posture. The implementation supports gradual rollout with feature flags to minimize risk.",
        toc: [
          "User Stories and Requirements",
          "Target Identity Providers",
          "Security and Compliance",
          "Rollout Strategy",
          "Success Metrics",
        ],
        links: [
          { type: "Issue", title: "AUTH-456: SSO Implementation", url: "https://jira.example.com/AUTH-456" },
          { type: "Document", title: "Product Requirements Doc", url: "https://docs.example.com/sso-prd" },
          { type: "Document", title: "Customer Research", url: "https://docs.example.com/sso-customer-research" },
          { type: "Issue", title: "AUTH-457: SAML Support (Future)", url: "https://jira.example.com/AUTH-457" },
        ],
      },
      implementationContext: {
        title: "Implementation Context",
        summary: "The SSO implementation extends the existing JWT-based authentication system using passport strategies. OAuth 2.0 Authorization Code flow with PKCE is implemented for security. The system maintains backward compatibility with existing password authentication while adding SSO as an alternative method. Database schema extended to store identity provider configurations and user SSO mappings.",
        toc: [
          "Architecture Overview",
          "Authentication Flow",
          "Database Schema Changes",
          "Security Considerations",
          "Testing Strategy",
          "Migration Path",
        ],
        links: [
          { type: "PR", title: "PR #234: Add SSO Support", url: "https://github.com/example/repo/pull/234" },
          { type: "Code File", title: "auth/oauth.controller.ts", url: "https://github.com/example/repo/blob/main/src/auth/oauth.controller.ts" },
          { type: "Code File", title: "auth/strategies/oauth.strategy.ts", url: "https://github.com/example/repo/blob/main/src/auth/strategies/oauth.strategy.ts" },
          { type: "Code File", title: "models/identity-provider.model.ts", url: "https://github.com/example/repo/blob/main/src/models/identity-provider.model.ts" },
          { type: "Document", title: "SSO Architecture Design", url: "https://docs.example.com/sso-architecture" },
          { type: "Document", title: "API Documentation", url: "https://docs.example.com/api/sso" },
        ],
      },
    },
    stages: [
      {
        name: "Backlog grooming",
        completed: true,
        summary: "Analyzed SSO requirements for OAuth 2.0 and SAML 2.0 support. Defined security standards and compliance requirements. Prioritized OAuth implementation first.",
        executedAt: "2024-01-21T11:00:00Z",
        executionType: "cloud",
        status: "success",
        artifacts: [
          { type: "Jira Ticket", title: "AUTH-456: SSO Implementation", url: "https://jira.example.com/AUTH-456" },
          { type: "Document", title: "SSO Architecture Design", url: "https://docs.example.com/sso-design" },
        ],
        subStages: [
          {
            name: "Validate issue context",
            completed: true,
            summary: "Agent analyzed AUTH-456 and existing authentication system. Reviewed current session management, token handling, and user model. Identified integration points with identity providers (Okta, Auth0, Azure AD). Validated OAuth 2.0 and SAML 2.0 library support in current tech stack.",
            executedAt: "2024-01-20T10:00:00Z",
            executionType: "cloud",
            status: "success",
            aiAssisted: true,
            promptLogSummary: "Agent: Analyzing AUTH-456 - Implement SSO support\nAgent: Scanning authentication layer and session management\nAgent: Found: JWT-based auth, Express middleware, PostgreSQL user store\nAgent: Researching: passport-oauth2, passport-saml libraries compatible\nAgent: Security check: CSRF protection exists, httpOnly cookies configured\nAgent: Recommendation: Use passport strategies, extend existing auth middleware",
            artifacts: [
              { type: "Document", title: "Auth System Analysis", url: "https://docs.example.com/auth-context-456" },
              { type: "Document", title: "Prompt Log", url: "https://logs.example.com/context-validation-456" },
            ],
            executor: { type: "agent", name: "ContextAnalyzer", details: "Claude / Opus 4" },
          },
          {
            name: "Request Clarifications",
            completed: true,
            summary: "Agent generated clarification questions on security requirements, provider priorities, and migration strategy. Security team clarified: PKCE required for OAuth, SAML optional for v1, support top 3 providers first (Okta, Auth0, Azure AD). Product confirmed gradual rollout with feature flags.",
            executedAt: "2024-01-21T11:00:00Z",
            executionType: "cloud",
            status: "success",
            aiAssisted: true,
            promptLogSummary: "Agent: Identified requirements needing clarification in AUTH-456\nAgent: Question 1: Which OAuth 2.0 flow - Authorization Code with PKCE?\nUser: Yes, PKCE required for security\nAgent: Question 2: Priority - OAuth 2.0 or SAML 2.0 first?\nUser: OAuth 2.0 MVP, SAML in next phase\nAgent: Question 3: Which identity providers to support?\nUser: Start with Okta, Auth0, and Azure AD\nAgent: Question 4: Migration strategy for existing users?\nUser: Gradual rollout with feature flag, no forced migration\nAgent: Question 5: Session handling - replace JWT or dual support?\nUser: Keep existing JWT, add SSO as alternative auth method",
            artifacts: [
              { type: "Document", title: "Security Requirements", url: "https://docs.example.com/sso-security-req" },
              { type: "Document", title: "Prompt Log", url: "https://logs.example.com/clarifications-456" },
              { type: "Jira Ticket", title: "AUTH-456: SSO Implementation", url: "https://jira.example.com/AUTH-456" },
            ],
            executor: { type: "agent", name: "RequirementsAgent", details: "Claude / Sonnet 4.5" },
          },
        ],
      },
      {
        name: "Coding",
        completed: true,
        summary: "Implemented OAuth 2.0 authorization flow with PKCE. Added SAML service provider configuration. Created identity provider management interface. Added JWT token validation and refresh logic.",
        executedAt: "2024-01-28T16:45:00Z",
        executionType: "local",
        status: "success",
        artifacts: [
          { type: "Changeset", title: "Commit a3f2b1c", url: "https://github.com/example/repo/commit/a3f2b1c" },
        ],
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
        summary: "Created pull request with SSO implementation. All CI checks passed. Code coverage at 87%. Security scan completed with no critical issues.",
        executedAt: "2024-01-29T10:15:00Z",
        executionType: "cloud",
        status: "success",
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
        summary: "Code review completed by senior engineers. Addressed feedback on token expiration handling and error messages. Security team approved the implementation. All comments resolved.",
        executedAt: "2024-02-02T14:20:00Z",
        executionType: "cloud",
        status: "success",
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
        completed: false,
        summary: "Deploying SSO feature to production environment.",
        status: "in-progress",
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
            completed: false,
            summary: "Monitoring production metrics and error rates. Current status: 0 errors, 45 successful logins, average response time 234ms.",
            executedAt: "2024-02-06T10:30:00Z",
            executionType: "cloud",
            status: "in-progress",
            artifacts: [
              { type: "Document", title: "Grafana Dashboard", url: "https://grafana.example.com/d/sso-metrics" },
            ],
            executor: { type: "agent", name: "MonitorAgent", details: "Datadog / APM" },
          },
        ],
      },
    ],
  },
  {
    id: "init-3",
    name: "Implement dark mode",
    description: "Add dark mode theme support to the application with automatic theme detection, manual toggle, and persistent user preferences. Includes updating all components to support both light and dark color schemes.",
    lastTask: "Design approval",
    nextTask: "Component development",
    progress: 25,
    status: "active",
    initiativeStatus: { type: "in_progress_agent" },
    template: "New feature",
    createdAt: "2024-02-10T08:00:00Z",
    assignedTo: "Emily Rodriguez",
    stages: [
      {
        name: "Backlog grooming",
        completed: true,
        summary: "Reviewed dark mode requirements with design and product teams. Analyzed existing component library for theme support compatibility.",
        executedAt: "2024-02-11T14:00:00Z",
        executionType: "cloud",
        status: "success",
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
            promptLogSummary: "Agent: Questions about dark mode implementation\nAgent: Question 1: Where should theme toggle be placed?\nUser: Header with icon button, accessible from all pages\nAgent: Question 2: Default theme preference?\nUser: Respect system preference, allow manual override\nAgent: Question 3: Theme transition style?\nUser: Smooth 200ms transition to avoid jarring switch",
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
        summary: "Implementing theme provider with CSS custom properties. Creating dark mode variants for all components.",
        status: "in-progress",
        executionType: "cloud",
        subStages: [
          {
            name: "Coding Progress",
            completed: true,
            summary: "AI agent created theme provider with React context. Generated CSS custom properties for colors, spacing, and shadows. Implemented theme toggle component with smooth transitions.",
            executedAt: "2024-02-14T11:30:00Z",
            executionType: "cloud",
            status: "success",
            aiAssisted: true,
            promptLogSummary: "User: Create theme provider for dark mode support\nAgent: Generated ThemeProvider with React context and CSS variables\nUser: Add smooth transitions between themes\nAgent: Implemented 200ms transition with prefers-reduced-motion support\nUser: Create theme toggle button\nAgent: Built toggle component with sun/moon icons and accessibility labels",
            artifacts: [
              { type: "Changeset", title: "Commit 4a5b6c7", url: "https://github.com/example/repo/commit/4a5b6c7" },
            ],
            executor: { type: "agent", name: "CodeGen", details: "Claude / Sonnet 4.5" },
          },
          {
            name: "Local Review",
            completed: true,
            summary: "Reviewed theme implementation for accessibility and consistency. Verified color contrast ratios meet WCAG AA standards. Checked theme persistence across browser sessions.",
            executedAt: "2024-02-14T14:00:00Z",
            executionType: "local",
            status: "success",
            artifacts: [
              { type: "Document", title: "Review Checklist", url: "https://docs.example.com/dark-mode-review" },
            ],
            executor: { type: "agent", name: "CodeReviewer", details: "Claude / Opus 4" },
          },
          {
            name: "Local Tests and Lints",
            completed: false,
            summary: "Running test suite - 18/25 tests passing. 7 failing tests for components not yet updated with dark mode support. ESLint check in progress.",
            executedAt: "2024-02-14T15:30:00Z",
            executionType: "local",
            status: "in-progress",
            executor: { type: "agent", name: "TestRunner", details: "Local Agent / Haiku" },
          },
        ],
      },
      { name: "PR", completed: false, status: "pending" },
      { name: "Review", completed: false, status: "pending" },
      { name: "Deployment", completed: false, status: "pending" },
    ],
  },
  {
    id: "init-4",
    name: "API rate limiting",
    description: "Implement rate limiting for all API endpoints to prevent abuse and ensure fair usage. Uses Redis for distributed rate tracking with configurable limits per endpoint and user tier.",
    lastTask: "Testing completed",
    nextTask: "Production rollout",
    progress: 90,
    status: "active",
    initiativeStatus: { type: "complete" },
    template: "New feature",
    createdAt: "2024-01-15T09:00:00Z",
    assignedTo: "David Kim",
    stages: [
      {
        name: "Backlog grooming",
        completed: true,
        summary: "Analyzed API rate limiting requirements and abuse patterns. Defined rate limits for different endpoint categories and user tiers.",
        executedAt: "2024-01-16T14:00:00Z",
        executionType: "cloud",
        status: "success",
        artifacts: [
          { type: "Jira Ticket", title: "API-789: Rate Limiting", url: "https://jira.example.com/API-789" },
          { type: "Document", title: "Rate Limit Strategy", url: "https://docs.example.com/rate-limits" },
        ],
        subStages: [
          {
            name: "Validate issue context",
            completed: true,
            summary: "Agent analyzed existing API architecture and current abuse patterns. Found 12 high-traffic endpoints without rate limiting. Identified Redis as existing caching layer suitable for distributed rate tracking.",
            executedAt: "2024-01-16T10:00:00Z",
            executionType: "cloud",
            status: "success",
            aiAssisted: true,
            promptLogSummary: "Agent: Analyzing API-789 - Implement rate limiting\nAgent: Scanning API endpoints and traffic patterns\nAgent: Found: 12 critical endpoints, existing Redis cluster\nAgent: Current issue: API abuse causing performance degradation\nAgent: Recommendation: Token bucket algorithm with Redis for distributed tracking",
            artifacts: [
              { type: "Document", title: "API Analysis", url: "https://docs.example.com/api-analysis" },
            ],
            executor: { type: "agent", name: "ContextAnalyzer", details: "Claude / Opus 4" },
          },
          {
            name: "Request Clarifications",
            completed: true,
            summary: "Agent generated questions on rate limit thresholds and enforcement. Security team clarified: 100 req/min for free tier, 1000 req/min for paid tier, soft vs hard limits (429 status code), and grace period (none for paid).",
            executedAt: "2024-01-16T14:00:00Z",
            executionType: "cloud",
            status: "success",
            aiAssisted: true,
            promptLogSummary: "Agent: Questions about rate limiting implementation\nAgent: Question 1: Rate limits per user tier?\nUser: Free: 100 req/min, Paid: 1000 req/min, Enterprise: custom\nAgent: Question 2: Response when limit exceeded?\nUser: Return 429 status with Retry-After header\nAgent: Question 3: Per-user or per-IP tracking?\nUser: Per-user for authenticated, per-IP for anonymous",
            artifacts: [
              { type: "Document", title: "Rate Limit Specs", url: "https://docs.example.com/rate-limit-specs" },
            ],
            executor: { type: "agent", name: "RequirementsAgent", details: "Claude / Sonnet 4.5" },
          },
        ],
      },
      {
        name: "Coding",
        completed: true,
        summary: "Implemented rate limiting middleware with Redis backend. Added per-user and per-endpoint tracking with configurable limits.",
        executedAt: "2024-01-20T16:45:00Z",
        executionType: "cloud",
        status: "success",
        artifacts: [
          { type: "Changeset", title: "Commit f8e9d1a", url: "https://github.com/example/repo/commit/f8e9d1a" },
        ],
        subStages: [
          {
            name: "Coding Progress",
            completed: true,
            summary: "AI agent implemented Express middleware for rate limiting. Created Redis-based token bucket algorithm with sliding window. Added rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset).",
            executedAt: "2024-01-20T14:20:00Z",
            executionType: "cloud",
            status: "success",
            aiAssisted: true,
            promptLogSummary: "User: Implement rate limiting middleware with Redis\nAgent: Created Express middleware with token bucket algorithm\nUser: Add rate limit info in response headers\nAgent: Implemented X-RateLimit-* headers per RFC 6585\nUser: Support different limits per endpoint\nAgent: Added configurable limits with endpoint-specific overrides",
            artifacts: [
              { type: "Changeset", title: "Commit 2b3c4d5", url: "https://github.com/example/repo/commit/2b3c4d5" },
            ],
            executor: { type: "agent", name: "CodeGen", details: "Claude / Sonnet 4.5" },
          },
          {
            name: "Local Review",
            completed: true,
            summary: "Reviewed rate limiting logic and Redis connection handling. Verified graceful degradation when Redis is unavailable. Checked for race conditions in distributed scenarios.",
            executedAt: "2024-01-20T15:30:00Z",
            executionType: "local",
            status: "success",
            executor: { type: "agent", name: "CodeReviewer", details: "Claude / Opus 4" },
          },
          {
            name: "Local Tests and Lints",
            completed: true,
            summary: "All tests passing (28/28). Integration tests with Redis verified rate limit enforcement. Load tests confirmed performance impact < 5ms. ESLint: 0 errors.",
            executedAt: "2024-01-20T16:45:00Z",
            executionType: "local",
            status: "success",
            artifacts: [
              { type: "Document", title: "Test Report", url: "https://tests.example.com/report-rate-limit" },
            ],
            executor: { type: "agent", name: "TestRunner", details: "Local Agent / Haiku" },
          },
        ],
      },
      {
        name: "PR",
        completed: true,
        summary: "Pull request created with comprehensive rate limiting implementation. All CI/CD checks passed.",
        executedAt: "2024-01-22T11:15:00Z",
        executionType: "cloud",
        status: "success",
        artifacts: [
          { type: "PR", title: "PR #456: API Rate Limiting", url: "https://github.com/example/repo/pull/456" },
        ],
        subStages: [
          {
            name: "PR Created",
            completed: true,
            summary: "Pull request created with 18 files changed. Automated PR description generated with implementation overview and testing notes.",
            executedAt: "2024-01-22T09:00:00Z",
            executionType: "cloud",
            status: "success",
            executor: { type: "agent", name: "PRBot", details: "GitHub Bot / Automation" },
          },
          {
            name: "Checks Passing",
            completed: true,
            summary: "All CI/CD checks passed: Unit tests (28/28), Integration tests (12/12), Load tests (< 5ms latency), Security scan (0 vulnerabilities).",
            executedAt: "2024-01-22T11:15:00Z",
            executionType: "cloud",
            status: "success",
            artifacts: [
              { type: "Document", title: "CI Results", url: "https://ci.example.com/builds/rate-limit-456" },
            ],
            executor: { type: "agent", name: "CI/CD", details: "GitHub Actions / CI" },
          },
        ],
      },
      {
        name: "Review",
        completed: true,
        summary: "Code review completed by senior engineers and security team. All feedback addressed.",
        executedAt: "2024-01-25T16:20:00Z",
        executionType: "cloud",
        status: "success",
        artifacts: [
          { type: "PR", title: "PR #456: API Rate Limiting", url: "https://github.com/example/repo/pull/456" },
        ],
        subStages: [
          {
            name: "Review Agent",
            completed: true,
            summary: "AI code review identified 2 suggestions: add monitoring alerts for rate limit hits and improve Redis connection pool configuration. Both addressed in follow-up commits.",
            executedAt: "2024-01-23T11:00:00Z",
            executionType: "cloud",
            status: "success",
            aiAssisted: true,
            promptLogSummary: "Agent: Reviewing PR #456 for rate limiting implementation\nAgent: Suggestion 1: Add Datadog metrics for rate limit hits per endpoint\nAgent: Suggestion 2: Increase Redis connection pool from 10 to 50\nAgent: Code quality: Excellent test coverage and error handling",
            artifacts: [
              { type: "Document", title: "AI Review", url: "https://review.example.com/ai-456" },
            ],
            executor: { type: "agent", name: "ReviewAgent", details: "Claude / Opus 4" },
          },
          {
            name: "Human Signoff",
            completed: true,
            summary: "Senior engineer and security team reviewed implementation. Verified Redis security, rate limit thresholds, and monitoring setup. Approved for production.",
            executedAt: "2024-01-25T16:20:00Z",
            executionType: "cloud",
            status: "success",
            executor: { type: "user", name: "david.kim", details: "Senior Engineer" },
          },
        ],
      },
      {
        name: "Deployment",
        completed: true,
        summary: "Successfully deployed rate limiting to production. Monitoring shows 99.9% of requests within limits.",
        executedAt: "2024-01-28T17:00:00Z",
        executionType: "cloud",
        status: "success",
        artifacts: [
          { type: "Deployment Log", title: "Production Deploy #789", url: "https://deploy.example.com/789" },
        ],
        subStages: [
          {
            name: "Deploy to Prod",
            completed: true,
            summary: "Deployed rate limiting middleware to production API cluster. Rolling deployment across 10 servers. Feature flag enabled for gradual rollout (25% → 50% → 100%).",
            executedAt: "2024-01-28T16:00:00Z",
            executionType: "cloud",
            status: "success",
            artifacts: [
              { type: "Deployment Log", title: "Deploy #789", url: "https://deploy.example.com/789" },
            ],
            executor: { type: "agent", name: "DeployBot", details: "ArgoCD / GitOps" },
          },
          {
            name: "Monitor",
            completed: true,
            summary: "Monitoring confirmed successful deployment. Rate limiting active with 0 errors. 125 requests rejected (0.1% of total). Average response time: 178ms (+2ms vs baseline).",
            executedAt: "2024-01-28T17:00:00Z",
            executionType: "cloud",
            status: "success",
            artifacts: [
              { type: "Document", title: "Monitoring Dashboard", url: "https://grafana.example.com/d/rate-limit" },
            ],
            executor: { type: "agent", name: "MonitorAgent", details: "Datadog / APM" },
          },
        ],
      },
    ],
  },
  {
    id: "init-5",
    name: "Mobile app integration",
    description: "Create REST API endpoints for mobile app integration supporting iOS and Android clients. Includes authentication, data synchronization, push notifications, and offline mode support.",
    lastTask: "Architecture review",
    nextTask: "API endpoint creation",
    progress: 15,
    status: "active",
    initiativeStatus: { type: "in_progress_agent" },
    template: "New feature",
    createdAt: "2024-02-18T10:00:00Z",
    assignedTo: "Alex Turner",
    stages: [
      {
        name: "Backlog grooming",
        completed: true,
        summary: "Analyzed mobile app integration requirements with mobile team. Defined REST API endpoints, authentication strategy, and offline sync approach.",
        executedAt: "2024-02-19T14:00:00Z",
        executionType: "cloud",
        status: "success",
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
        summary: "Implementing mobile API endpoints with authentication and sync logic. Currently debugging token validation issues.",
        status: "in-progress",
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
      { name: "PR", completed: false, status: "pending" },
      { name: "Review", completed: false, status: "pending" },
      { name: "Deployment", completed: false, status: "pending" },
    ],
  },
  {
    id: "init-6",
    name: "Performance optimization",
    description: "Optimize application performance by addressing slow database queries, inefficient rendering, and memory leaks. Target 50% reduction in page load times and improved responsiveness.",
    lastTask: "Benchmarking",
    nextTask: "Database indexing",
    progress: 45,
    status: "active",
    initiativeStatus: { type: "in_progress_agent" },
    template: "Bug fix",
    createdAt: "2024-02-05T09:00:00Z",
    assignedTo: "Sarah Johnson",
    stages: [
      {
        name: "Backlog grooming",
        completed: true,
        summary: "Profiled application performance and identified bottlenecks. Key issues: N+1 database queries, large bundle size, and unnecessary re-renders.",
        executedAt: "2024-02-06T13:00:00Z",
        executionType: "local",
        status: "success",
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
        summary: "Added database indexes for frequently queried columns. Implemented query batching to eliminate N+1 patterns. Added React.memo to expensive components and code splitting for large modules.",
        executedAt: "2024-02-12T17:00:00Z",
        executionType: "local",
        status: "success",
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
        name: "Review",
        completed: false,
        summary: "Code review in progress. Verifying performance improvements meet 50% reduction target.",
        status: "in-progress",
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
      { name: "Deployment", completed: false, status: "pending" },
    ],
  },
  {
    id: "init-7",
    name: "User analytics dashboard",
    description: "Build comprehensive analytics dashboard showing user engagement metrics, retention rates, conversion funnels, and real-time activity. Features interactive charts with D3.js and customizable date ranges.",
    lastTask: "Data modeling",
    nextTask: "Chart implementation",
    progress: 60,
    status: "active",
    initiativeStatus: { type: "hitl_pending" },
    template: "New feature",
    createdAt: "2024-01-25T09:00:00Z",
    assignedTo: "Michael Chen",
    stages: [
      {
        name: "Backlog grooming",
        completed: true,
        status: "success",
        summary: "Defined analytics dashboard requirements. Key metrics: user engagement, retention, and conversion rates.",
        executedAt: "2024-01-26T10:00:00Z",
        executionType: "cloud"
      },
      {
        name: "Coding",
        completed: true,
        status: "success",
        summary: "Implemented dashboard with interactive charts using D3.js. Added real-time data updates.",
        executedAt: "2024-02-02T15:00:00Z",
        executionType: "cloud"
      },
      {
        name: "PR",
        completed: true,
        status: "success",
        summary: "Pull request created and all automated checks passed.",
        executedAt: "2024-02-05T10:00:00Z",
        executionType: "cloud"
      },
      {
        name: "Review",
        completed: true,
        status: "success",
        summary: "Code review completed. Waiting on product team approval for deployment.",
        executedAt: "2024-02-08T14:00:00Z",
        executionType: "cloud"
      },
      {
        name: "Deployment",
        completed: false,
        status: "in-progress",
        summary: "Waiting for HITL approval before deploying to production.",
        executedAt: "2024-02-12T09:00:00Z",
        executionType: "cloud"
      },
    ],
  },
  {
    id: "init-8",
    name: "Email notification system",
    description: "Implement automated email notification system using SendGrid for transactional emails, alerts, and marketing campaigns. Includes responsive email templates and delivery tracking.",
    lastTask: "Template design",
    nextTask: "Integration testing",
    progress: 70,
    status: "active",
    initiativeStatus: { type: "in_progress_agent" },
    template: "Support Ticket",
    createdAt: "2024-02-01T10:00:00Z",
    assignedTo: "Emily Rodriguez",
    stages: [
      {
        name: "Backlog grooming",
        completed: true,
        status: "success",
        summary: "Analyzed email notification requirements. Defined templates for different notification types.",
        executedAt: "2024-02-02T11:00:00Z",
        executionType: "cloud"
      },
      {
        name: "Coding",
        completed: true,
        status: "success",
        summary: "Implemented email service with SendGrid. Created responsive email templates.",
        executedAt: "2024-02-08T16:00:00Z",
        executionType: "cloud"
      },
      {
        name: "Review",
        completed: true,
        status: "success",
        summary: "Code review completed. All email templates tested across email clients.",
        executedAt: "2024-02-12T14:00:00Z",
        executionType: "cloud"
      },
      {
        name: "Deployment",
        completed: false,
        status: "in-progress",
        summary: "Rolling out email notifications to production in phases.",
        executedAt: "2024-02-16T10:00:00Z",
        executionType: "cloud"
      },
    ],
  },
]
