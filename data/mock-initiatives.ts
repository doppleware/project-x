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

export interface LinkedIssue {
  id: string
  title: string
  url: string
  type: "Jira" | "GitHub" | "Linear"
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
  technicalContext: ContextSection
}

export interface Story {
  id: string
  name: string
  description?: string
  status: StoryStatus
  stages: StoryStage[]
  createdAt?: string
  context?: SharedContext
}

export type InitiativePhase = "backlog" | "story_breakdown" | "final_validation" | "complete"

export interface InitiativeStage {
  name: "Backlog grooming" | "Planning" | "Story Breakdown" | "Final Testing"
  completed: boolean
  status?: "success" | "in-progress" | "pending"
  conversationId?: string
  linkedIssues?: LinkedIssue[]
  planOutput?: string
}

export interface Initiative {
  id: string
  name: string
  description?: string
  phase: InitiativePhase
  template: InitiativeTemplate
  initiativeStages: InitiativeStage[]
  stories: Story[]
  createdAt?: string
  assignedTo?: string
  sharedContext?: SharedContext
}

export const mockInitiatives: Initiative[] = [
  // ─────────────────────────────────────────────────────────────────
  // init-1: Add inventory screen for users
  // ─────────────────────────────────────────────────────────────────
  {
    id: "init-1",
    name: "Add inventory screen for users",
    description: "Create a new inventory management screen",
    phase: "story_breakdown",
    template: "New feature",
    initiativeStages: [
      {
        name: "Backlog grooming",
        completed: true,
        status: "success",
        conversationId: "conv-init-1",
        linkedIssues: [
          { id: "PROJ-142", title: "Users need visibility into inventory levels", url: "#", type: "Jira" },
          { id: "GH-89", title: "Feature: add inventory management screen", url: "#", type: "GitHub" },
        ],
      },
      {
        name: "Planning",
        completed: true,
        status: "success",
        planOutput: `Implementation Plan: Add Inventory Screen

Overview
Build a new inventory management screen allowing users to view, search, filter, and manage inventory items inline with existing product workflows.

Stories
  1. Create inventory page UI
     Build the frontend inventory list page with table view, search, and column-level filtering.

  2. Implement backend inventory CRUD
     Create REST API endpoints for create, read, update, and delete inventory operations.

  3. Support selection and bulk operations
     Add multi-select with bulk actions: delete, CSV export, and status updates.

Technical Approach
  - Reuse Pagination component from ProductListing (cursor-based, server-side)
  - Leverage InventoryService API (already in place)
  - Mirror table patterns from OrdersPage for consistency

Dependencies
  - Auth system — complete
  - ProductModel API — complete
  - Design system — available

Risks
  - Pagination performance at >10k items → enforce server-side cursor pagination
  - Bulk op timeouts for large selections → background job queue with status polling`,
      },
      { name: "Story Breakdown", completed: false, status: "in-progress" },
      { name: "Final Testing", completed: false, status: "pending" },
    ],
    createdAt: "2024-02-15T10:00:00Z",
    assignedTo: "Sarah Johnson",
    sharedContext: {
      productContext: {
        title: "Inventory Management Feature",
        summary: "This initiative introduces an inventory management screen enabling users to view, search, filter, and manage their inventory items in real time. The goal is to eliminate manual spreadsheet tracking and give warehouse managers and operations teams immediate visibility into stock levels and locations. In v1 we scope to read/search/filter and CRUD operations; bulk actions and inline editing are handled in follow-on stories.",
        toc: [
          "User story and business goals",
          "Target users (warehouse managers, ops teams)",
          "Success metrics: time-to-find-item, error rate reduction",
          "Out of scope for v1: inline editing, import/export via file upload",
        ],
        links: [
          { type: "Issue", title: "PROJ-142: Users need visibility into inventory levels", url: "#" },
          { type: "Issue", title: "GH-89: Feature: add inventory management screen", url: "#" },
          { type: "Document", title: "Inventory feature PRD", url: "#" },
        ],
      },
      technicalContext: {
        title: "Frontend Architecture & Existing Patterns",
        summary: "The inventory screen is built as a Next.js page component following the OrdersPage pattern. Server-side cursor-based pagination is reused from ProductListing to handle datasets beyond 10k items without performance degradation. InventoryService (already in place) provides the API layer; no new service creation is needed. State management is via URL query params (no client-side store) to enable deep-linking and browser-back behaviour.",
        toc: [
          "Component architecture: InventoryPage → InventoryTable → InventorySearchBar",
          "Pagination: cursor-based, server-side, from ProductListing",
          "API: InventoryService endpoints (already available)",
          "State: URL query params (search, sort, page cursor)",
        ],
        links: [
          { type: "Code File", title: "src/pages/OrdersPage.tsx (pattern reference)", url: "#" },
          { type: "Code File", title: "src/components/ProductListing/Pagination.tsx", url: "#" },
          { type: "Code File", title: "src/api/InventoryService.ts", url: "#" },
        ],
      },
    },
    stories: [
      // ── story-1-1: Create inventory page UI (complete) ──────────────
      {
        id: "story-1-1",
        name: "Create inventory page UI",
        description: "Build the frontend inventory list page with table view",
        context: {
          productContext: {
            title: "Inventory UI Requirements",
            summary: "The inventory table must display SKU, name, quantity, warehouse location, stock status, and last-updated timestamp. Default sort is by last-updated descending. Search is across name and SKU fields. Column filters apply server-side. Empty state should use an illustration, not plain text. No inline editing in this story.",
            toc: [
              "Table columns and default sort order",
              "Search: name and SKU, debounced 300ms",
              "Filters: status (In Stock / Low / Out), location (dropdown)",
              "Empty state: illustration + CTA to import",
            ],
            links: [
              { type: "Issue", title: "PROJ-142: Users need visibility into inventory levels", url: "#" },
              { type: "Document", title: "Figma: Inventory Table designs", url: "#" },
            ],
          },
          technicalContext: {
            title: "Component Implementation Details",
            summary: "InventoryPage wraps InventoryTable and InventorySearchBar. InventoryTable adapts the OrdersTable pattern — same DataTable base, custom column definitions. Pagination reused from ProductListing with cursor tokens. Filters are reflected in URL query params to support deep-linking. The page is server-rendered (RSC) with client-side interactivity for filters.",
            toc: [
              "File structure: src/pages/InventoryPage.tsx, src/components/inventory/*",
              "Column definitions: 6 columns with sortable headers",
              "Pagination: cursor-based, server-side, page sizes 10/25/50",
              "Filters → URL params via useSearchParams hook",
            ],
            links: [
              { type: "Code File", title: "src/pages/OrdersPage.tsx (pattern reference)", url: "#" },
              { type: "Code File", title: "src/components/inventory/InventoryTable.tsx", url: "#" },
              { type: "PR", title: "PR #234: Add inventory page UI", url: "#" },
            ],
          },
        },
        status: { type: "complete" },
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            executedAt: "2024-02-15T10:00:00Z",
            summary: "Analyzed existing codebase, confirmed no existing inventory component. Scoped work to a frontend list view with table, search, and pagination. No blockers identified.",
            subStages: [
              {
                name: "Read issue and scan codebase",
                completed: true,
                status: "success",
                executedAt: "2024-02-15T10:02:00Z",
                executor: { type: "agent", name: "Claude", details: "Scanned PROJ-142 and 18 source files" },
                aiAssisted: true,
                promptLogSummary: `User: Read PROJ-142 and scan the codebase for existing inventory-related components
Agent: Read PROJ-142. Scanning src/pages, src/components, src/api now
User: Focus on any existing pagination or table patterns we can reuse
Agent: Found Pagination in ProductListing (cursor-based, server-side). OrdersPage has a DataTable we can adapt. InventoryService exists but has no UI counterpart
User: Any blockers before we start coding?
Agent: None. InventoryService API is complete, ProductModel is compatible, auth middleware is in place`,
                summary: "Agent completed codebase analysis. Identified reusable components and confirmed no existing inventory UI to migrate.",
              },
              {
                name: "Scope confirmation with engineer",
                completed: true,
                status: "success",
                executedAt: "2024-02-15T10:30:00Z",
                executor: { type: "user", name: "Sarah Johnson" },
                summary: "Sarah confirmed scope: table view with search and pagination only. No inline editing in v1. Default page size 25.",
              },
            ],
          },
          {
            name: "Coding",
            completed: true,
            status: "success",
            executedAt: "2024-02-15T11:30:00Z",
            executionType: "cloud",
            summary: "Built InventoryPage component with DataTable, SearchBar, and column filters. Reused Pagination component from ProductListing.",
            aiAssisted: true,
            promptLogSummary: `User: Build the inventory page with table, search, and column filters
Agent: Scaffolding InventoryPage, InventoryTable, and InventorySearchBar components
User: Use the OrdersPage DataTable pattern for consistency
Agent: Adapting OrdersTable — 6 columns: SKU, Name, Quantity, Location, Status, Last Updated
User: Add debounced search and wire the filters to URL params
Agent: SearchBar debounced at 300ms, filters reflected in URL query params for deep-linking
User: Change the empty state to use an illustration
Agent: Replaced plain text empty state with IllustrationEmpty component and an "Import inventory" CTA`,
            subStages: [
              {
                name: "Scaffold InventoryPage component",
                completed: true,
                status: "success",
                executedAt: "2024-02-15T11:32:00Z",
                executor: { type: "agent", name: "Claude", details: "Generated component structure and routing" },
                aiAssisted: true,
                promptLogSummary: `User: Create the page component structure and wire it to the router
Agent: Created InventoryPage.tsx, InventoryTable.tsx, InventorySearchBar.tsx. Registering route /inventory in router
User: Use TypeScript interfaces from ProductModel
Agent: Defined InventoryItem interface extending ProductModel — added warehouse, quantity, stockStatus fields
User: Make sure the page has a loading skeleton
Agent: Added InventoryTableSkeleton with 10 placeholder rows matching the column layout`,
                summary: "Component scaffold created with proper TypeScript interfaces matching ProductModel.",
              },
              {
                name: "Implement table with filters",
                completed: true,
                status: "success",
                executedAt: "2024-02-15T12:15:00Z",
                executor: { type: "agent", name: "Claude", details: "Implemented DataTable with column sorting and filters" },
                aiAssisted: true,
                promptLogSummary: `User: Add the 6 table columns with server-side sorting
Agent: Added columns: SKU (fixed), Name (sortable), Quantity (sortable), Location (sortable), Status, Last Updated (sortable)
User: Status column should show colored badges — In Stock, Low, Out of Stock
Agent: Implemented StockStatusBadge with green/yellow/red variants matching design tokens
User: Wire the column sort headers to trigger a server-side refetch
Agent: Added sort state to URL params (sort=name&dir=asc), table refetches on change via useQuery
User: Integrate the SearchBar — search should hit name and SKU fields
Agent: SearchBar debounced 300ms, appends q= to URL params, server filters across name and SKU fields`,
                summary: "Table rendered with server-side sorting, column filters, and debounced search.",
              },
              {
                name: "Integrate Pagination component",
                completed: true,
                status: "success",
                executedAt: "2024-02-15T13:00:00Z",
                executor: { type: "agent", name: "Claude", details: "Wired cursor-based pagination" },
                summary: "Reused Pagination from ProductListing with cursor-based navigation. Page size selector: 10, 25, 50.",
              },
              {
                name: "Review checkpoint",
                completed: true,
                status: "success",
                executedAt: "2024-02-15T13:45:00Z",
                executor: { type: "user", name: "Sarah Johnson" },
                summary: "LGTM. Requested one change: empty-state illustration instead of plain text.",
              },
            ],
          },
          {
            name: "PR",
            completed: true,
            status: "success",
            executedAt: "2024-02-15T14:00:00Z",
            summary: "Opened PR #234 — 8 files changed, +420 −12 lines.",
            artifacts: [
              { type: "PR", title: "PR #234: Add inventory page UI", url: "#" },
            ],
          },
          {
            name: "Review",
            completed: true,
            status: "success",
            executedAt: "2024-02-16T09:00:00Z",
            summary: "Approved by Sarah Johnson. Two minor comments addressed: default pagination size changed to 25, empty-state copy updated.",
          },
          {
            name: "Deployment",
            completed: true,
            status: "success",
            executedAt: "2024-02-16T11:00:00Z",
            executionType: "cloud",
            summary: "Deployed to production via CI/CD pipeline. Health checks passed, no rollback needed.",
            artifacts: [
              { type: "Deployment Log", title: "Deploy #891", url: "#" },
            ],
          },
        ],
      },

      // ── story-1-2: Implement backend inventory CRUD (in_progress_agent) ──
      {
        id: "story-1-2",
        name: "Implement backend inventory CRUD",
        description: "Create API endpoints for inventory operations",
        context: {
          productContext: {
            title: "Inventory API Requirements",
            summary: "Users must be able to create, read, update, and delete inventory items through the UI. The API must support batch reads for the table view (paginated), individual item detail, create with validation, update (partial), and soft delete. All mutations are audit-logged. The API is internal only (no public exposure in v1).",
            toc: [
              "Endpoints: GET /inventory, GET /inventory/:id, POST, PATCH, DELETE",
              "Pagination: cursor-based with limit param",
              "Validation: SKU uniqueness, quantity >= 0, required fields",
              "Audit log: all mutations logged with actor and timestamp",
            ],
            links: [
              { type: "Issue", title: "PROJ-142: Users need visibility into inventory levels", url: "#" },
              { type: "Document", title: "API design doc: Inventory CRUD", url: "#" },
            ],
          },
          technicalContext: {
            title: "API Architecture & InventoryService",
            summary: "InventoryService already exists as a thin client layer. This story adds the server-side REST handlers in Express. The InventoryModel extends ProductModel with warehouse and quantity fields. Soft delete sets a deletedAt timestamp rather than removing rows. Cursor pagination is implemented with a base64-encoded cursor over the id column.",
            toc: [
              "InventoryService: existing client, add server handlers",
              "InventoryModel: extends ProductModel (warehouse, quantity, deletedAt)",
              "Soft delete: deletedAt timestamp, filtered in all list queries",
              "Cursor pagination: base64(id) cursor, server-side limit enforcement",
            ],
            links: [
              { type: "Code File", title: "src/api/InventoryService.ts", url: "#" },
              { type: "Code File", title: "src/models/ProductModel.ts (extends)", url: "#" },
            ],
          },
        },
        status: { type: "in_progress_agent" },
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            executedAt: "2024-02-15T10:15:00Z",
            summary: "Analyzed InventoryService API, identified 5 endpoints needed. Confirmed data model aligns with ProductModel. No blockers.",
            subStages: [
              {
                name: "Read issue and scan API layer",
                completed: true,
                status: "success",
                executedAt: "2024-02-15T10:17:00Z",
                executor: { type: "agent", name: "Claude", details: "Scanned PROJ-142, controllers, and service layer" },
                aiAssisted: true,
                promptLogSummary: `User: Read PROJ-142 and audit the existing API and service layer for inventory
Agent: Read PROJ-142. Scanning src/api/controllers, src/services, src/models
User: Check if InventoryService has any existing implementation
Agent: InventoryService exists as a stub — only interface definitions, no implementations. ProductModel schema matches what we need
User: Any existing patterns for auth-protected routes?
Agent: Found authMiddleware in src/middleware/auth.ts — already used on /orders and /products routes. Directly reusable
User: What validation library is used?
Agent: Zod is used throughout — found in OrdersController and ProductsController. Will follow the same pattern`,
                summary: "Agent confirmed InventoryService exists as a stub — full implementation needed. Existing auth middleware can protect all 5 endpoints.",
              },
              {
                name: "Scope confirmation with engineer",
                completed: true,
                status: "success",
                executedAt: "2024-02-15T10:50:00Z",
                executor: { type: "user", name: "Sarah Johnson" },
                summary: "Sarah confirmed: full CRUD required, no soft delete, rate limit bulk delete to 100 items max. Zod validation required on all inputs.",
              },
            ],
          },
          {
            name: "Coding",
            completed: true,
            status: "success",
            executedAt: "2024-02-16T09:00:00Z",
            executionType: "cloud",
            summary: "Implemented InventoryController with 5 CRUD endpoints, Zod input validation, and unit test coverage at 94%.",
            aiAssisted: true,
            promptLogSummary: `User: Implement the 5 inventory API endpoints with validation and tests
Agent: Building InventoryController with GET /inventory (paginated), POST, GET /:id, PUT /:id, DELETE /:id
User: Use soft delete — don't actually remove records
Agent: DELETE sets deletedAt timestamp, all list queries filter WHERE deletedAt IS NULL
User: Add Zod validation schemas for create and update
Agent: Created InventoryCreateSchema and InventoryUpdateSchema (partial). Validation applied before service calls
User: Write unit tests targeting 90%+ coverage
Agent: Generated 34 unit tests. Coverage: 94%. All passing`,
            subStages: [
              {
                name: "Scaffold controller and routes",
                completed: true,
                status: "success",
                executedAt: "2024-02-16T09:05:00Z",
                executor: { type: "agent", name: "Claude", details: "Generated controller scaffold and route registration" },
                aiAssisted: true,
                promptLogSummary: `User: Scaffold the controller file and register the 5 routes
Agent: Created src/api/controllers/InventoryController.ts with 5 route handlers. Registered in app.ts under /api/inventory
User: Add authMiddleware to all routes
Agent: Applied authMiddleware to all 5 routes. Added requireRole('user') for reads, requireRole('manager') for write operations
User: Add request logging for all mutations
Agent: Added requestLogger middleware to POST, PUT, DELETE routes — logs actor, action, timestamp, and payload summary`,
                summary: "Controller scaffold and route registration complete.",
              },
              {
                name: "Implement CRUD operations",
                completed: true,
                status: "success",
                executedAt: "2024-02-16T10:00:00Z",
                executor: { type: "agent", name: "Claude", details: "Implemented all 5 service methods" },
                aiAssisted: true,
                promptLogSummary: `User: Implement the InventoryService list method with cursor pagination
Agent: Implemented list() with cursor-based pagination — base64-encoded id cursor, configurable limit (default 25, max 100)
User: Add sort support to the list method
Agent: list() now accepts sort: { field, direction }. Validated against allowed columns to prevent injection
User: Implement create with SKU uniqueness check
Agent: create() checks SKU uniqueness before insert. Returns 409 Conflict with field-level error if duplicate found
User: Implement soft delete
Agent: delete() sets deletedAt = NOW(). All list and read queries filter WHERE deletedAt IS NULL`,
                summary: "All CRUD operations implemented and connected to PostgreSQL.",
              },
              {
                name: "Add Zod validation schemas",
                completed: true,
                status: "success",
                executedAt: "2024-02-16T10:45:00Z",
                executor: { type: "agent", name: "Claude", details: "Created input validation schemas" },
                summary: "CreateInventorySchema, UpdateInventorySchema, and ListInventoryQuerySchema created with strict validation.",
              },
              {
                name: "Write unit tests",
                completed: true,
                status: "success",
                executedAt: "2024-02-16T11:30:00Z",
                executor: { type: "agent", name: "Claude", details: "Wrote 34 unit tests" },
                aiAssisted: true,
                promptLogSummary: `User: Write unit tests for all 5 CRUD operations
Agent: Writing happy path tests first — list pagination, create, read by ID, update partial fields, soft delete
User: Make sure to cover validation failures
Agent: Added tests for missing required fields, SKU duplicate, invalid cursor token, quantity below zero
User: Add a test for the 404 case on read and update
Agent: Added 404 tests for GET /:id and PUT /:id when record is not found or is soft-deleted
User: Check coverage and fill any gaps
Agent: Coverage at 94%. Found gaps in DB error paths — added 4 more tests for timeout and constraint errors`,
                summary: "34 unit tests written, 94% coverage achieved.",
              },
              {
                name: "Review checkpoint",
                completed: true,
                status: "success",
                executedAt: "2024-02-16T13:00:00Z",
                executor: { type: "user", name: "Sarah Johnson" },
                summary: "Implementation approved. Requested adding a 100-item hard cap to bulk delete. Agent applied the change.",
              },
            ],
          },
          {
            name: "PR",
            completed: false,
            status: "in-progress",
            executedAt: "2024-02-16T14:30:00Z",
            summary: "PR #251 opened. CI pipeline running — 156 tests in progress.",
            artifacts: [
              { type: "PR", title: "PR #251: Inventory CRUD API", url: "#" },
            ],
            subStages: [
              {
                name: "Open pull request",
                completed: true,
                status: "success",
                executedAt: "2024-02-16T14:31:00Z",
                executor: { type: "agent", name: "Claude", details: "Created PR with description and linked PROJ-142" },
                summary: "PR #251 created — 11 files changed, +680 −5 lines. Linked to PROJ-142.",
              },
              {
                name: "CI pipeline",
                completed: false,
                status: "in-progress",
                executedAt: "2024-02-16T14:35:00Z",
                executor: { type: "agent", name: "Claude", details: "Monitoring CI run #1042" },
                summary: "Running 156 tests across unit and integration suites. ETA ~4 minutes.",
              },
            ],
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

      // ── story-1-3: Support selection and bulk operations (hitl_pending) ──
      {
        id: "story-1-3",
        name: "Support selection and bulk operations",
        description: "Add multi-select and bulk actions (delete, export, update)",
        context: {
          productContext: {
            title: "Bulk Operations UX",
            summary: "Users managing large inventories need to act on multiple items simultaneously. The toolbar appears when one or more rows are selected, showing the count and available actions. Bulk delete is soft-delete with a confirmation dialog. CSV export respects the current filter and column visibility settings. Status update applies a single new status to all selected items.",
            toc: [
              "Selection: checkbox per row + header select-all",
              "Toolbar: appears on selection, shows count + actions",
              "Bulk delete: soft delete, confirmation dialog required",
              "CSV export: respects active filters and column visibility",
              "Bulk status update: single status applied to all selected",
            ],
            links: [
              { type: "Issue", title: "PROJ-142: Users need visibility into inventory levels", url: "#" },
            ],
          },
          technicalContext: {
            title: "Multi-select & Bulk Action Implementation",
            summary: "The CheckboxTable pattern from OrdersPage is directly adaptable. Selection state is managed in local React state (Set<string> of item IDs). The toolbar is conditionally rendered above the table. Bulk delete calls DELETE /inventory/bulk with an array of IDs. CSV export is generated client-side for < 1k items; for larger sets a server-side export job is kicked off and polled.",
            toc: [
              "CheckboxTable: adapted from OrdersPage pattern",
              "Selection state: Set<string> in useState, cleared on filter change",
              "Bulk delete: POST /inventory/bulk-delete, soft delete on server",
              "CSV export: client-side for < 1k items, background job for larger sets",
            ],
            links: [
              { type: "Code File", title: "src/pages/OrdersPage.tsx (CheckboxTable pattern)", url: "#" },
            ],
          },
        },
        status: { type: "hitl_pending" },
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            executedAt: "2024-02-17T10:00:00Z",
            summary: "Agent analyzed multi-select patterns in the codebase and is waiting for engineer decision on bulk delete behavior before proceeding.",
            subStages: [
              {
                name: "Analyze multi-select UI patterns",
                completed: true,
                status: "success",
                executedAt: "2024-02-17T10:03:00Z",
                executor: { type: "agent", name: "Claude", details: "Scanned existing table components for selection patterns" },
                aiAssisted: true,
                promptLogSummary: `User: Scan the codebase for existing multi-select or checkbox table patterns
Agent: Scanning src/pages, src/components for table selection patterns
User: What patterns exist?
Agent: Found CheckboxTable in OrdersPage — supports select-all header, row checkboxes, selection count in toolbar. Directly adaptable
User: What bulk action patterns are used elsewhere?
Agent: Found 3 patterns: floating action bar (DataExplorer), toolbar-on-selection (OrdersPage), inline row actions (TaskList). OrdersPage pattern recommended for consistency
User: What's the max selection limit currently?
Agent: No limit enforced in OrdersPage. API maxes at 100 items per page, so effective max is 100. Flagged: need clarification on whether cross-page selection is in scope`,
                summary: "CheckboxTable from OrdersPage is directly adaptable. Recommended toolbar-on-selection pattern.",
              },
              {
                name: "Request scope clarification",
                completed: false,
                status: "in-progress",
                executedAt: "2024-02-17T10:30:00Z",
                executor: { type: "agent", name: "Claude", details: "Awaiting engineer response on bulk delete semantics" },
                summary: "Waiting for Sarah Johnson to confirm: (1) hard or soft delete for bulk ops? (2) Max selection limit — 100 or unlimited? (3) Should export respect active filters?",
              },
            ],
          },
          {
            name: "Coding",
            completed: false,
            status: "pending",
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

  // ─────────────────────────────────────────────────────────────────
  // init-2: Support SSO (complete)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "init-2",
    name: "Support SSO",
    description: "Implement Single Sign-On authentication",
    phase: "complete",
    template: "New feature",
    initiativeStages: [
      {
        name: "Backlog grooming",
        completed: true,
        status: "success",
        conversationId: "conv-init-2",
        linkedIssues: [
          { id: "PROJ-98", title: "Enterprise customers require SSO support", url: "#", type: "Jira" },
          { id: "PROJ-101", title: "Security audit: implement MFA and SSO", url: "#", type: "Jira" },
        ],
      },
      {
        name: "Planning",
        completed: true,
        status: "success",
        planOutput: `Implementation Plan: Support SSO

Overview
Implement Single Sign-On authentication to support enterprise customers using OAuth 2.0 and SAML 2.0 protocols.

Stories
  1. OAuth 2.0 integration
     Implement OAuth 2.0 authentication flow with PKCE extension for enhanced security.

  2. SAML provider support
     Add SAML 2.0 protocol support for enterprise SSO provider integrations.

  3. SSO admin dashboard
     Create admin UI for managing SSO providers and user attribute mappings.

Technical Approach
  - Use passport.js for OAuth 2.0 with PKCE
  - Integrate samlify library for SAML 2.0 support
  - Store provider configs encrypted in database via Secrets Manager

Dependencies
  - User management system — complete
  - Database schema — needs migration
  - Secrets manager — available

Risks
  - SAML provider compatibility variations → test with 3 major enterprise providers
  - Session management complexity with multiple auth methods → unified session layer`,
      },
      { name: "Story Breakdown", completed: true, status: "success" },
      { name: "Final Testing", completed: true, status: "success" },
    ],
    createdAt: "2024-01-10T09:00:00Z",
    assignedTo: "Michael Chen",
    sharedContext: {
      productContext: {
        title: "Enterprise SSO Authentication",
        summary: "Enterprise customers require Single Sign-On as a prerequisite for procurement approval. This initiative implements both OAuth 2.0 (with PKCE) and SAML 2.0 to support the full spectrum of enterprise identity providers including Okta, Azure AD, and Google Workspace. An admin dashboard allows IT administrators to configure providers without engineering involvement.",
        toc: [
          "Enterprise customer requirements and blockers",
          "Supported identity providers: Okta, Azure AD, Google Workspace",
          "Auth flows: OAuth 2.0 (PKCE), SAML 2.0 (SP-initiated and IdP-initiated)",
          "Compliance: SOC 2 Type II, session timeout policies",
        ],
        links: [
          { type: "Issue", title: "PROJ-98: Enterprise customers require SSO support", url: "#" },
          { type: "Issue", title: "PROJ-101: Security audit: implement MFA and SSO", url: "#" },
          { type: "Document", title: "Enterprise Auth PRD", url: "#" },
        ],
      },
      technicalContext: {
        title: "Authentication System Architecture",
        summary: "OAuth 2.0 is handled via passport.js with PKCE extension for public clients. SAML 2.0 is implemented using the samlify library. Provider configurations are stored encrypted in the database via Secrets Manager. Session management is unified across all auth methods through a custom SessionLayer that normalises claims from different providers into a common user identity object.",
        toc: [
          "OAuth 2.0: passport.js + PKCE, authorization code flow",
          "SAML 2.0: samlify library, SP-initiated and IdP-initiated",
          "Provider config storage: encrypted in DB via Secrets Manager",
          "Session: unified SessionLayer, normalised user identity",
          "Database: SSOProvider and SSOUserMapping tables (migration required)",
        ],
        links: [
          { type: "Code File", title: "src/auth/SessionLayer.ts", url: "#" },
          { type: "Code File", title: "src/auth/OAuthStrategy.ts", url: "#" },
          { type: "Document", title: "Auth architecture diagram", url: "#" },
        ],
      },
    },
    stories: [
      // ── story-2-1: OAuth 2.0 integration (complete) ─────────────────
      {
        id: "story-2-1",
        name: "OAuth 2.0 integration",
        description: "Implement OAuth 2.0 authentication flow with PKCE",
        context: {
          productContext: {
            title: "OAuth 2.0 Flow Requirements",
            summary: "OAuth 2.0 with PKCE enables secure authentication via Google Workspace and Azure AD without managing client secrets on the frontend. Users see a provider selection screen on the login page when their email domain matches a configured OAuth provider. On first login, a user account is created automatically from the provider's profile claims.",
            toc: [
              "Provider selection: automatic based on email domain",
              "Supported providers: Google Workspace, Azure AD (OAuth flows)",
              "First-login auto-provisioning from provider claims",
              "Session duration: 8 hours with silent refresh",
            ],
            links: [
              { type: "Issue", title: "PROJ-98: Enterprise customers require SSO support", url: "#" },
            ],
          },
          technicalContext: {
            title: "OAuth 2.0 with PKCE Implementation",
            summary: "passport.js with custom OAuth2Strategy handles the authorization code flow with PKCE. The PKCE code verifier is generated client-side and stored in sessionStorage. Callback handler at /auth/oauth/callback validates the state parameter and exchanges the code for tokens. Access token is stored in the unified SessionLayer; refresh token is kept server-side only.",
            toc: [
              "passport.js: OAuth2Strategy with PKCE extension",
              "PKCE: code_verifier in sessionStorage, code_challenge in redirect",
              "Callback: /auth/oauth/callback — state validation + code exchange",
              "Token storage: access token in SessionLayer, refresh server-only",
            ],
            links: [
              { type: "Code File", title: "src/auth/OAuthStrategy.ts", url: "#" },
              { type: "PR", title: "PR #187: OAuth 2.0 integration with PKCE", url: "#" },
            ],
          },
        },
        status: { type: "complete" },
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            executedAt: "2024-01-10T09:30:00Z",
            summary: "Analyzed existing auth system, identified integration points for OAuth 2.0 with PKCE. Confirmed passport.js is already a dependency.",
            subStages: [
              {
                name: "Read issues and audit auth layer",
                completed: true,
                status: "success",
                executedAt: "2024-01-10T09:32:00Z",
                executor: { type: "agent", name: "Claude", details: "Audited PROJ-98, PROJ-101 and existing auth code" },
                aiAssisted: true,
                promptLogSummary: `User: Read PROJ-98 and PROJ-101, then audit the existing auth architecture
Agent: Read both issues. Scanning src/auth, package.json, and middleware
User: What auth libraries are currently in use?
Agent: passport.js v0.6 with JWTStrategy and LocalStrategy — both active. No OAuth strategy present
User: Is there a Secrets Manager client available?
Agent: Yes — SecretsManagerClient from @aws-sdk/client-secrets-manager is already configured in src/lib/secrets.ts
User: Any concerns about adding OAuth alongside the existing JWT strategy?
Agent: No conflicts — passport.js supports multiple strategies simultaneously. JWTStrategy stays as fallback for API clients`,
                summary: "Agent confirmed passport.js is present and JWTStrategy can coexist with OAuth strategy.",
              },
              {
                name: "Scope confirmation with engineer",
                completed: true,
                status: "success",
                executedAt: "2024-01-10T10:00:00Z",
                executor: { type: "user", name: "Michael Chen" },
                summary: "Michael confirmed: Google and GitHub as initial providers. PKCE required. Short-lived access tokens (15 min), refresh token rotation.",
              },
            ],
          },
          {
            name: "Coding",
            completed: true,
            status: "success",
            executedAt: "2024-01-11T09:00:00Z",
            executionType: "cloud",
            summary: "Implemented OAuth 2.0 with PKCE for Google and GitHub. Token refresh rotation and session management integrated.",
            aiAssisted: true,
            promptLogSummary: `User: Implement OAuth 2.0 with PKCE for Google and GitHub providers
Agent: Building OAuthStrategy with PKCE extension, PKCE helper utilities, and provider config system
User: Store provider client secrets in Secrets Manager, not in env vars
Agent: Provider configs fetched from Secrets Manager via SecretsManagerClient on startup and cached in memory
User: Handle first-login auto-provisioning from provider claims
Agent: Added firstLoginHandler — creates user from provider email and name claims if no existing account found
User: Write integration tests covering the PKCE flow end-to-end
Agent: 28 integration tests written. Cover: PKCE flow, token exchange, refresh rotation, expired tokens, invalid state`,
            subStages: [
              {
                name: "Implement PKCE flow",
                completed: true,
                status: "success",
                executedAt: "2024-01-11T09:10:00Z",
                executor: { type: "agent", name: "Claude", details: "Built OAuth 2.0 + PKCE from spec" },
                aiAssisted: true,
                promptLogSummary: `User: Implement the PKCE code_challenge and code_verifier generation
Agent: Implemented generateCodeVerifier() (43-char random base64url) and generateCodeChallenge() (SHA-256 hash). Verifier stored in sessionStorage
User: Build the authorization URL with state and PKCE parameters
Agent: buildAuthURL() generates a state token (stored in sessionStorage) and appends code_challenge and code_challenge_method=S256 to the provider URL
User: Implement the callback handler for token exchange
Agent: Callback at /auth/oauth/callback — validates state param, exchanges code and code_verifier for tokens via provider token endpoint
User: Handle token refresh rotation
Agent: Refresh token stored server-side only. Access token refreshed silently on 401. Old refresh tokens invalidated after use`,
                summary: "PKCE flow implemented end-to-end for both providers.",
              },
              {
                name: "Token refresh rotation",
                completed: true,
                status: "success",
                executedAt: "2024-01-11T10:30:00Z",
                executor: { type: "agent", name: "Claude", details: "Implemented refresh token rotation with Redis" },
                summary: "Refresh tokens stored in Redis with 7-day TTL. Rotation on every use. Old token invalidated immediately.",
              },
              {
                name: "Integration tests",
                completed: true,
                status: "success",
                executedAt: "2024-01-11T11:30:00Z",
                executor: { type: "agent", name: "Claude", details: "Wrote 28 integration tests with mocked providers" },
                aiAssisted: true,
                promptLogSummary: `User: Write integration tests for the full PKCE flow
Agent: Mocking provider endpoints with nock. Writing tests for authorization URL generation and callback handling
User: Cover the state parameter validation
Agent: Added tests for missing state, tampered state, and expired state (older than 10 min). All return 401
User: Test token refresh rotation
Agent: Added tests for successful refresh, expired refresh token (403), and concurrent refresh — second request waits for first
User: Test error cases from the provider
Agent: Added tests for provider returning error param, invalid_grant on token exchange, and network timeout`,
                summary: "28 integration tests passing. Edge cases covered: expired tokens, invalid state, provider errors.",
              },
              {
                name: "Review checkpoint",
                completed: true,
                status: "success",
                executedAt: "2024-01-11T13:00:00Z",
                executor: { type: "user", name: "Michael Chen" },
                summary: "Approved. Requested adding rate limiting to the OAuth callback endpoint to prevent abuse. Agent applied change.",
              },
            ],
          },
          {
            name: "PR",
            completed: true,
            status: "success",
            executedAt: "2024-01-11T14:00:00Z",
            summary: "PR #198 merged after 1 round of review. CI: 189/189 tests passing.",
            artifacts: [
              { type: "PR", title: "PR #198: OAuth 2.0 + PKCE integration", url: "#" },
            ],
          },
          {
            name: "Review",
            completed: true,
            status: "success",
            executedAt: "2024-01-12T09:00:00Z",
            summary: "Approved by Michael Chen and security team. One comment: add audit log for OAuth logins — applied before merge.",
          },
          {
            name: "Deployment",
            completed: true,
            status: "success",
            executedAt: "2024-01-12T14:00:00Z",
            executionType: "cloud",
            summary: "Deployed to production. Smoke tests passed. OAuth login verified with Google and GitHub in production.",
            artifacts: [
              { type: "Deployment Log", title: "Deploy #812", url: "#" },
            ],
          },
        ],
      },

      // ── story-2-2: SAML provider support (complete) ─────────────────
      {
        id: "story-2-2",
        name: "SAML provider support",
        description: "Add SAML 2.0 protocol support for enterprise SSO",
        context: {
          productContext: {
            title: "SAML 2.0 Provider Requirements",
            summary: "SAML 2.0 support unblocks enterprise customers using Okta and other SAML-only providers that do not support OAuth flows. Both SP-initiated (user clicks login) and IdP-initiated (user clicks app tile in Okta/Azure portal) flows must be supported. Attribute mappings (email, first name, last name, role) are configurable per provider.",
            toc: [
              "SP-initiated flow: login page → IdP redirect → assertion validation",
              "IdP-initiated flow: Okta app tile → POST assertion → session creation",
              "Attribute mapping: email (required), name, role (optional)",
              "Tested providers: Okta, Azure AD (SAML), Google SAML app",
            ],
            links: [
              { type: "Issue", title: "PROJ-98: Enterprise customers require SSO support", url: "#" },
              { type: "Document", title: "SAML integration test plan", url: "#" },
            ],
          },
          technicalContext: {
            title: "SAML 2.0 with samlify",
            summary: "samlify handles SP metadata generation, assertion decryption, and attribute extraction. SP metadata is served at /auth/saml/metadata. The assertion consumer service endpoint is /auth/saml/acs. IdP metadata is fetched and cached on provider configuration save. Assertions are validated for signature, audience, and time conditions before session creation.",
            toc: [
              "samlify: SP metadata, assertion parsing, attribute extraction",
              "SP metadata endpoint: GET /auth/saml/metadata",
              "ACS endpoint: POST /auth/saml/acs",
              "Validation: signature, audience restriction, NotBefore/NotOnOrAfter",
            ],
            links: [
              { type: "Code File", title: "src/auth/SAMLStrategy.ts", url: "#" },
              { type: "PR", title: "PR #203: SAML 2.0 provider support", url: "#" },
            ],
          },
        },
        status: { type: "complete" },
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            executedAt: "2024-01-13T09:00:00Z",
            summary: "Researched SAML 2.0 library options. Chose samlify over passport-saml for better TypeScript support and active maintenance. Confirmed Okta and Azure AD as target providers.",
            subStages: [
              {
                name: "Library evaluation",
                completed: true,
                status: "success",
                executedAt: "2024-01-13T09:05:00Z",
                executor: { type: "agent", name: "Claude", details: "Compared passport-saml vs samlify vs node-saml" },
                aiAssisted: true,
                promptLogSummary: `User: Evaluate SAML 2.0 libraries and recommend one
Agent: Evaluating passport-saml, samlify, and node-saml
User: What are the key criteria?
Agent: Criteria: TypeScript support, active maintenance, SP-initiated and IdP-initiated support, assertion encryption handling
User: What did you find?
Agent: passport-saml: unmaintained (last release 2021). node-saml: low-level with no high-level abstractions. samlify: active, full TypeScript, 1.2k stars, supports both flow types and encrypted assertions
User: Any concerns with samlify?
Agent: One concern — samlify v3 had a signature bypass CVE in 2022, patched in v3.3. Will pin to v3.3.5 and add assertion signature validation tests`,
                summary: "samlify selected: full TypeScript, active maintenance, supports SP and IdP-initiated flows.",
              },
              {
                name: "Provider requirements review",
                completed: true,
                status: "success",
                executedAt: "2024-01-13T10:00:00Z",
                executor: { type: "user", name: "Michael Chen" },
                summary: "Michael confirmed target providers: Okta and Azure AD. Provided test tenant credentials for both. Attribute mapping: email → user.email, groups → user.roles.",
              },
            ],
          },
          {
            name: "Coding",
            completed: true,
            status: "success",
            executedAt: "2024-01-14T09:00:00Z",
            executionType: "cloud",
            summary: "Implemented SAML 2.0 SP-initiated and IdP-initiated flows. Tested with Okta and Azure AD test tenants. Attribute mapping configured.",
            aiAssisted: true,
            promptLogSummary: `User: Implement SAML 2.0 support using samlify
Agent: Installing samlify v3.3.5. Building SAMLStrategy, metadata endpoint, and ACS handler
User: Support both SP-initiated and IdP-initiated flows
Agent: SP-initiated: login page → AuthnRequest → IdP → ACS callback. IdP-initiated: POST to /auth/saml/callback with assertion, no AuthnRequest required
User: Validate signature, audience, and time conditions on every assertion
Agent: SAMLStrategy validates: XML signature, Issuer against stored entity ID, AudienceRestriction, NotBefore and NotOnOrAfter. Throws on any violation
User: Write tests against real Okta and Azure AD test tenants
Agent: 22 tests written. Included live tests against Okta sandbox and Azure AD test tenant — both flow types verified`,
            subStages: [
              {
                name: "Implement SP-initiated flow",
                completed: true,
                status: "success",
                executedAt: "2024-01-14T09:10:00Z",
                executor: { type: "agent", name: "Claude", details: "Built SP-initiated SSO with samlify" },
                aiAssisted: true,
                promptLogSummary: `User: Build the SP-initiated flow
Agent: Implementing AuthnRequest builder with NameIDFormat, ForceAuthn option, and RelayState for post-login redirect
User: Generate SP metadata for provider configuration
Agent: Metadata endpoint at GET /auth/saml/metadata serves signed XML with entity ID, ACS URL, and public cert
User: Implement the ACS endpoint
Agent: POST /auth/saml/callback — decodes base64 SAMLResponse, validates signature, extracts attributes, creates session
User: Test with Okta
Agent: Tested against Okta sandbox. SP-initiated flow working. Attribute mapping: email (NameID), firstName, lastName, groups`,
                summary: "SP-initiated flow complete. Metadata endpoint serving signed XML.",
              },
              {
                name: "Implement IdP-initiated flow",
                completed: true,
                status: "success",
                executedAt: "2024-01-14T10:30:00Z",
                executor: { type: "agent", name: "Claude", details: "Extended ACS handler for IdP-initiated" },
                summary: "IdP-initiated assertions handled — validates InResponseTo absence and session creation.",
              },
              {
                name: "Attribute mapping",
                completed: true,
                status: "success",
                executedAt: "2024-01-14T11:15:00Z",
                executor: { type: "agent", name: "Claude", details: "Built configurable attribute mapper" },
                summary: "Attribute mapper reads provider config from DB. email, displayName, groups mapped to user model.",
              },
              {
                name: "Test with Okta and Azure AD",
                completed: true,
                status: "success",
                executedAt: "2024-01-14T13:00:00Z",
                executor: { type: "agent", name: "Claude", details: "Ran end-to-end tests against test tenants" },
                summary: "SP-initiated and IdP-initiated flows verified with both Okta and Azure AD test tenants. All attribute mappings correct.",
              },
            ],
          },
          {
            name: "PR",
            completed: true,
            status: "success",
            executedAt: "2024-01-15T09:00:00Z",
            summary: "PR #203 merged. 14 files changed, +520 −8 lines.",
            artifacts: [
              { type: "PR", title: "PR #203: SAML 2.0 provider support", url: "#" },
            ],
          },
          {
            name: "Review",
            completed: true,
            status: "success",
            executedAt: "2024-01-15T14:00:00Z",
            summary: "Approved by Michael Chen. Security team reviewed SAML assertion validation — no issues found.",
          },
          {
            name: "Deployment",
            completed: true,
            status: "success",
            executedAt: "2024-01-16T10:00:00Z",
            executionType: "cloud",
            summary: "Deployed to production. First enterprise customer (Acme Corp, Okta) successfully authenticated via SAML within 2 hours of deploy.",
            artifacts: [
              { type: "Deployment Log", title: "Deploy #821", url: "#" },
            ],
          },
        ],
      },

      // ── story-2-3: SSO admin dashboard (complete) ───────────────────
      {
        id: "story-2-3",
        name: "SSO admin dashboard",
        description: "Create admin UI for managing SSO providers and user mappings",
        context: {
          productContext: {
            title: "Admin SSO Management UI",
            summary: "IT administrators must be able to configure SSO providers without filing engineering tickets. The dashboard allows adding, editing, and deleting provider configurations; mapping provider attributes to user fields; and testing connectivity before going live. The settings page is under /admin/security/sso and is gated behind the admin role.",
            toc: [
              "Providers list: table of configured SSO providers with status",
              "Add/edit provider: drawer form for metadata URL, entity ID, attribute mappings",
              "Connection test: validate metadata URL and fetch IdP metadata on demand",
              "Attribute mapping: email, first name, last name, role fields",
            ],
            links: [
              { type: "Issue", title: "PROJ-98: Enterprise customers require SSO support", url: "#" },
              { type: "Document", title: "Figma: SSO Admin Settings designs", url: "#" },
            ],
          },
          technicalContext: {
            title: "Admin Dashboard Implementation",
            summary: "The SSO settings page reuses AdminLayout and SettingsForm patterns from the existing settings area. A DataTable lists configured providers. An Add/Edit provider drawer uses the existing form infrastructure with validation. The 'Test Connection' button calls a backend endpoint that fetches and validates the IdP metadata URL, returning a success or structured error.",
            toc: [
              "Reuses: AdminLayout, SettingsForm, DataTable (existing components)",
              "Providers table: columns — Provider name, type (OAuth/SAML), status, last modified",
              "Drawer: metadata URL, entity ID, attribute mapping editor, test connection",
              "API: GET/POST/PATCH/DELETE /api/admin/sso-providers",
            ],
            links: [
              { type: "Code File", title: "src/pages/admin/security/SSOSettingsPage.tsx", url: "#" },
              { type: "PR", title: "PR #209: SSO admin dashboard", url: "#" },
            ],
          },
        },
        status: { type: "complete" },
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            executedAt: "2024-01-17T09:00:00Z",
            summary: "Reviewed admin requirements. Identified existing AdminLayout and form patterns to reuse. Scoped to provider CRUD + attribute mapping UI.",
            subStages: [
              {
                name: "Audit admin panel patterns",
                completed: true,
                status: "success",
                executedAt: "2024-01-17T09:05:00Z",
                executor: { type: "agent", name: "Claude", details: "Scanned admin panel and existing settings pages" },
                aiAssisted: true,
                promptLogSummary: `User: Audit the admin panel for reusable components and patterns
Agent: Scanning src/pages/admin, src/components/admin, and existing settings pages
User: What's available to reuse?
Agent: Found AdminLayout (nav + content area), SettingsForm (field definitions + validation), DataTable (sortable, paginated). Auth settings page is the strongest reference
User: Is there an admin-only route guard?
Agent: Yes — adminGuard HOC in src/middleware/adminGuard.ts, used on /admin/users and /admin/billing. Directly reusable
User: Check if there's an existing drawer or modal pattern for forms
Agent: Found SlideoverDrawer in src/components/ui/SlideoverDrawer.tsx — used in UserEditDrawer. Supports form content and footer actions with a save/cancel pattern`,
                summary: "Existing AdminLayout and SettingsForm directly reusable. Auth settings page is a strong pattern to follow.",
              },
              {
                name: "Design review",
                completed: true,
                status: "success",
                executedAt: "2024-01-17T10:30:00Z",
                executor: { type: "user", name: "Michael Chen" },
                summary: "Michael provided Figma designs for the SSO settings page. Agreed on: providers list table, add/edit provider drawer, attribute mapping inline editor.",
              },
            ],
          },
          {
            name: "Coding",
            completed: true,
            status: "success",
            executedAt: "2024-01-18T09:00:00Z",
            executionType: "cloud",
            summary: "Built SSO admin dashboard with provider management, attribute mapping editor, and connection test button.",
            aiAssisted: true,
            promptLogSummary: `User: Build the SSO admin settings page with provider CRUD and attribute mapping
Agent: Scaffolding SSOSettingsPage using AdminLayout and SettingsForm patterns. Building ProviderForm drawer and AttributeMappingEditor
User: Use SlideoverDrawer for the add and edit provider form
Agent: ProviderForm rendered in SlideoverDrawer with fields: provider name, type (OAuth/SAML), metadata URL, client ID, attribute mappings
User: Add a Test Connection button to validate the metadata URL before saving
Agent: TestConnectionButton calls POST /api/admin/sso-providers/test-connection — fetches metadata URL, validates XML, returns success or structured error inline
User: Make sure only admins can access the page
Agent: Wrapped SSOSettingsPage in adminGuard HOC. Added requireRole('admin') on all /api/admin/sso-providers endpoints`,
            subStages: [
              {
                name: "Providers list and management",
                completed: true,
                status: "success",
                executedAt: "2024-01-18T09:15:00Z",
                executor: { type: "agent", name: "Claude", details: "Built provider list and CRUD UI" },
                aiAssisted: true,
                promptLogSummary: `User: Build the providers list table with add and delete actions
Agent: Created DataTable with columns: Provider Name, Type (OAuth/SAML), Status (Active/Inactive), Last Modified, Actions
User: Add and Edit should open the same drawer form
Agent: Unified ProviderForm drawer — empty for Add, pre-populated for Edit. Distinguishes between POST and PATCH on submit
User: Delete should show a confirmation dialog
Agent: Delete button triggers ConfirmDialog — "This will disconnect all users authenticated via this provider." Requires typing the provider name to confirm
User: Show a status badge based on whether the connection has been tested
Agent: Status badge: Active (green, test passed), Untested (gray, newly added), Error (red, last test failed)`,
                summary: "Provider management UI complete: list, add, edit, delete with confirmation.",
              },
              {
                name: "Attribute mapping editor",
                completed: true,
                status: "success",
                executedAt: "2024-01-18T11:00:00Z",
                executor: { type: "agent", name: "Claude", details: "Built dynamic attribute mapping UI" },
                summary: "Inline editor with source attribute → target field mapping. Drag-to-reorder, live preview of parsed attributes.",
              },
              {
                name: "Connection test feature",
                completed: true,
                status: "success",
                executedAt: "2024-01-18T12:30:00Z",
                executor: { type: "agent", name: "Claude", details: "Built test connection button with live feedback" },
                summary: "Test Connection button validates metadata URL, fetches IdP metadata, and shows success/error inline.",
              },
            ],
          },
          {
            name: "PR",
            completed: true,
            status: "success",
            executedAt: "2024-01-18T15:00:00Z",
            summary: "PR #209 merged. 9 files changed, +410 −3 lines.",
            artifacts: [
              { type: "PR", title: "PR #209: SSO admin dashboard", url: "#" },
            ],
          },
          {
            name: "Review",
            completed: true,
            status: "success",
            executedAt: "2024-01-19T10:00:00Z",
            summary: "Approved by Michael Chen. UX team reviewed and approved the provider drawer flow.",
          },
          {
            name: "Deployment",
            completed: true,
            status: "success",
            executedAt: "2024-01-19T14:00:00Z",
            executionType: "cloud",
            summary: "Deployed. Admin team onboarded first 3 enterprise SSO configurations using the new dashboard within the same day.",
            artifacts: [
              { type: "Deployment Log", title: "Deploy #830", url: "#" },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // init-3: Implement dark mode (story_breakdown)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "init-3",
    name: "Implement dark mode",
    description: "Add dark mode theme support across the application",
    phase: "story_breakdown",
    template: "New feature",
    initiativeStages: [
      {
        name: "Backlog grooming",
        completed: true,
        status: "success",
        conversationId: "conv-init-3",
        linkedIssues: [
          { id: "GH-201", title: "Feature request: dark mode support", url: "#", type: "GitHub" },
          { id: "GH-215", title: "Eye strain reported by users in low-light environments", url: "#", type: "GitHub" },
        ],
      },
      {
        name: "Planning",
        completed: true,
        status: "success",
        planOutput: `Implementation Plan: Implement Dark Mode

Overview
Add a system-aware dark mode theme with manual override. Use CSS custom properties for theming to minimize component-level changes.

Stories
  1. Theme system foundation
     Build CSS variable system, ThemeProvider, and toggle component.

  2. Update component library
     Apply dark mode token overrides to all 47 UI components.

Technical Approach
  - CSS custom properties (--color-bg, --color-text, etc.) as single source of truth
  - ThemeProvider wraps app, reads localStorage + prefers-color-scheme
  - No third-party theming library — keeps bundle size minimal

Dependencies
  - Design system tokens — design team to supply dark variants
  - Component audit — complete (47 components identified)

Risks
  - Design specs incomplete for 35 of 47 components → dependency on design team
  - Third-party embedded widgets may not support dark mode`,
      },
      { name: "Story Breakdown", completed: false, status: "in-progress" },
      { name: "Final Testing", completed: false, status: "pending" },
    ],
    createdAt: "2024-02-20T11:30:00Z",
    assignedTo: "Emma Rodriguez",
    sharedContext: {
      productContext: {
        title: "Dark Mode & User Experience",
        summary: "Multiple users have reported eye strain during extended use in low-light environments. Dark mode is now considered table-stakes for professional tools and is a blocker for several enterprise deals that enforce accessibility standards. The feature should respect the user's OS preference by default and allow manual override. Preference is persisted across sessions.",
        toc: [
          "User research: 38% of users reported eye strain (Q4 survey)",
          "OS preference detection: prefers-color-scheme media query",
          "Manual override: toggle in global header, persisted to localStorage",
          "Scope: web app only; mobile app is a separate initiative",
        ],
        links: [
          { type: "Issue", title: "GH-201: Feature request: dark mode support", url: "#" },
          { type: "Issue", title: "GH-215: Eye strain reported in low-light environments", url: "#" },
          { type: "Document", title: "Dark mode PRD and user research summary", url: "#" },
        ],
      },
      technicalContext: {
        title: "CSS Theming System Architecture",
        summary: "Dark mode uses CSS custom properties (CSS variables) as the single source of truth for all color tokens. Tailwind is configured to use the 'class' dark mode strategy, enabling dark: variant overrides. A ThemeProvider context component wraps the application, manages theme state, and applies the .dark class to the <html> element. No third-party theming library is introduced.",
        toc: [
          "CSS variables: :root (light) and .dark overrides in globals.css",
          "Tailwind: darkMode: 'class' strategy, dark: variant in components",
          "ThemeProvider: manages state, applies .dark to <html>, exposes useTheme()",
          "Persistence: localStorage for manual preference, prefers-color-scheme fallback",
        ],
        links: [
          { type: "Code File", title: "styles/globals.css (CSS variable tokens)", url: "#" },
          { type: "Code File", title: "tailwind.config.ts", url: "#" },
          { type: "Code File", title: "src/providers/ThemeProvider.tsx", url: "#" },
        ],
      },
    },
    stories: [
      // ── story-3-1: Theme system foundation (complete) ───────────────
      {
        id: "story-3-1",
        name: "Theme system foundation",
        description: "Build CSS variable system and theme toggle component",
        context: {
          productContext: {
            title: "Theme Foundation Requirements",
            summary: "This story delivers the theme infrastructure: CSS tokens, ThemeProvider, useTheme hook, and the ThemeToggle component in the global header. After this story, the app's chrome (header, sidebar, background) correctly switches between light and dark. Individual component dark styling is handled in story 2. The toggle is accessible (keyboard-focusable, aria-pressed).",
            toc: [
              "Token scope: backgrounds, text, borders, brand, status colors (24 tokens)",
              "ThemeToggle: sun/moon icons, aria-pressed, smooth CSS transition",
              "ThemeProvider: wraps <App>, applies .dark class, exposes useTheme()",
              "Acceptance: header, sidebar, and page background switch correctly",
            ],
            links: [
              { type: "Issue", title: "GH-201: Feature request: dark mode support", url: "#" },
              { type: "Document", title: "Design token spec (light + dark values)", url: "#" },
            ],
          },
          technicalContext: {
            title: "CSS Variable Foundation & ThemeProvider",
            summary: "24 CSS custom properties are defined in globals.css as :root (light) and .dark overrides. ThemeProvider is a React context that initialises from localStorage, falls back to prefers-color-scheme, and toggles the .dark class on document.documentElement. The useTheme() hook exposes { theme, toggleTheme } to any component. ThemeToggle uses the hook and renders a button with lucide-react Sun/Moon icons.",
            toc: [
              "globals.css: :root { --color-bg: ...; } .dark { --color-bg: ...; }",
              "ThemeProvider: Context + localStorage + prefers-color-scheme",
              "useTheme(): returns { theme: 'light' | 'dark', toggleTheme: () => void }",
              "ThemeToggle: Button, Sun/Moon icons, aria-pressed state",
            ],
            links: [
              { type: "Code File", title: "styles/globals.css", url: "#" },
              { type: "Code File", title: "src/providers/ThemeProvider.tsx", url: "#" },
              { type: "PR", title: "PR #262: Theme system foundation", url: "#" },
            ],
          },
        },
        status: { type: "complete" },
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            executedAt: "2024-02-20T11:30:00Z",
            summary: "Audited CSS architecture. Confirmed global variables approach is feasible — no major refactor of component styles needed for the foundation layer.",
            subStages: [
              {
                name: "Audit CSS architecture",
                completed: true,
                status: "success",
                executedAt: "2024-02-20T11:33:00Z",
                executor: { type: "agent", name: "Claude", details: "Scanned global styles, Tailwind config, and component CSS" },
                aiAssisted: true,
                promptLogSummary: `User: Audit the CSS architecture and confirm the CSS variable approach is viable
Agent: Scanning styles/globals.css, tailwind.config.ts, and component CSS files
User: How many components use hardcoded colors?
Agent: Found 8 components with hardcoded hex colors in className strings. All others use Tailwind utilities referencing design tokens
User: Is the Tailwind dark: variant compatible with our setup?
Agent: tailwind.config.ts uses darkMode: 'media' currently. Switching to darkMode: 'class' is a one-line change and is non-breaking
User: Any third-party components that might not respect our theme?
Agent: Found 2: react-datepicker and recharts. Both require custom CSS overrides for dark mode — noted as items for story 2`,
                summary: "CSS variable approach is clean — only 8 hardcoded color overrides need migrating. Tailwind dark: variant works with class strategy.",
              },
              {
                name: "Design token review",
                completed: true,
                status: "success",
                executedAt: "2024-02-20T12:15:00Z",
                executor: { type: "user", name: "Emma Rodriguez" },
                summary: "Emma provided the light/dark token set from Figma. 24 color tokens confirmed for the foundation layer. Component-level tokens to follow in story 2.",
              },
            ],
          },
          {
            name: "Coding",
            completed: true,
            status: "success",
            executedAt: "2024-02-21T09:00:00Z",
            executionType: "local",
            summary: "Built ThemeProvider with localStorage persistence and prefers-color-scheme fallback. ThemeToggle component added to global header.",
            aiAssisted: true,
            promptLogSummary: `User: Build the CSS variable token system, ThemeProvider, and ThemeToggle component
Agent: Defining 24 CSS custom properties in globals.css. Building ThemeProvider context and useTheme hook
User: Use prefers-color-scheme as the initial value if no localStorage preference is set
Agent: ThemeProvider initialises from localStorage, falls back to window.matchMedia('(prefers-color-scheme: dark)')
User: The toggle should animate smoothly between sun and moon icons
Agent: ThemeToggle uses CSS opacity transition on the icons — Sun fades out as Moon fades in with a 150ms ease
User: Make sure the theme applies before first paint to avoid a flash
Agent: Added blocking inline script in _document.tsx to apply .dark class from localStorage before React hydrates`,
            subStages: [
              {
                name: "Define CSS custom properties",
                completed: true,
                status: "success",
                executedAt: "2024-02-21T09:10:00Z",
                executor: { type: "agent", name: "Claude", details: "Defined 24 color tokens in globals.css" },
                aiAssisted: true,
                promptLogSummary: `User: Define the full token set for light and dark themes
Agent: Writing :root and .dark override blocks in globals.css, grouped by category
User: What token groups are we defining?
Agent: 24 tokens: backgrounds (4: bg-base, bg-surface, bg-elevated, bg-overlay), text (4: primary, secondary, muted, inverse), borders (3), brand (5), status colors (8)
User: Make sure the brand colors have enough contrast in dark mode
Agent: Checked contrast ratios — brand-primary in dark mode is 4.8:1 on bg-base. WCAG AA compliant. Adjusted brand-secondary from #7B61FF to #9B87FF for better contrast
User: Add semantic aliases for common patterns
Agent: Added semantic aliases: --color-card-bg, --color-input-border, --color-focus-ring. These reference the base tokens to keep overrides minimal`,
                summary: "24 CSS custom properties defined for both light and dark themes.",
              },
              {
                name: "Build ThemeProvider and hook",
                completed: true,
                status: "success",
                executedAt: "2024-02-21T10:00:00Z",
                executor: { type: "agent", name: "Claude", details: "Built ThemeProvider with persistence" },
                summary: "ThemeProvider reads localStorage, falls back to prefers-color-scheme, applies .dark class to <html>. useTheme() hook exposed for components.",
              },
              {
                name: "Build ThemeToggle component",
                completed: true,
                status: "success",
                executedAt: "2024-02-21T10:45:00Z",
                executor: { type: "agent", name: "Claude", details: "Built toggle with sun/moon icons and animation" },
                summary: "ThemeToggle renders sun/moon icons with smooth CSS transition. Added to GlobalHeader.",
              },
            ],
          },
          {
            name: "PR",
            completed: true,
            status: "success",
            executedAt: "2024-02-21T14:00:00Z",
            summary: "PR #262 merged. 6 files changed, +180 −22 lines.",
            artifacts: [
              { type: "PR", title: "PR #262: Theme system foundation", url: "#" },
            ],
          },
          {
            name: "Review",
            completed: true,
            status: "success",
            executedAt: "2024-02-22T09:00:00Z",
            summary: "Approved by Emma Rodriguez. Design team verified token values match Figma. Toggle animation approved.",
          },
          {
            name: "Deployment",
            completed: true,
            status: "success",
            executedAt: "2024-02-22T11:00:00Z",
            executionType: "cloud",
            summary: "Deployed. Dark mode toggle live in production — foundation only, component styling to follow in story 2.",
            artifacts: [
              { type: "Deployment Log", title: "Deploy #904", url: "#" },
            ],
          },
        ],
      },

      // ── story-3-2: Update component library (warning) ───────────────
      {
        id: "story-3-2",
        name: "Update component library",
        description: "Apply dark mode styles to all UI components",
        context: {
          productContext: {
            title: "Component Dark Mode Coverage",
            summary: "For a polished dark mode experience all 47 UI components must respond correctly to the .dark class. Priority is P0 (Button, Card, Input, Modal, Table — user-facing in every screen), then P1 (form elements, nav, sidebar), then P2 (charts, misc). Design specs are required before coding each component — currently only 12 of 47 specs have been delivered.",
            toc: [
              "P0 (5 components): Button, Card, Input, Modal, Table — highest priority",
              "P1 (12 components): Form elements, Nav, Sidebar, Dropdown",
              "P2 (30 components): Charts, Tooltips, Badges, misc",
              "Blocker: design team has only delivered 12 of 47 dark specs",
            ],
            links: [
              { type: "Issue", title: "GH-215: Eye strain reported in low-light environments", url: "#" },
              { type: "Document", title: "Component audit spreadsheet (47 components)", url: "#" },
            ],
          },
          technicalContext: {
            title: "Component Dark Mode Pattern",
            summary: "Each component is updated to use Tailwind dark: variant classes referencing CSS custom properties from story 1. For the 8 components with hardcoded hex colors, the values are migrated to CSS variable references. No component logic changes — only className updates. Changes are applied component by component, verified in Storybook with a dark mode toggle addon.",
            toc: [
              "Pattern: className='bg-[--color-bg] dark:bg-[--color-bg-dark]' → simplified with CSS vars",
              "Hardcoded hex removal: 8 components need color → CSS variable migration",
              "Storybook: dark mode toggle for per-component review",
              "Verification: visual regression tests with Chromatic",
            ],
            links: [
              { type: "Code File", title: "src/components/ui/Button.tsx (first target)", url: "#" },
              { type: "Document", title: "Storybook dark mode addon config", url: "#" },
            ],
          },
        },
        status: { type: "warning", reason: "Design specs incomplete" },
        stages: [
          {
            name: "Backlog grooming",
            completed: true,
            status: "success",
            executedAt: "2024-02-22T13:00:00Z",
            summary: "Completed component audit. 47 components need dark variants. Design team has only delivered specs for 12. Story is blocked pending full design spec delivery.",
            subStages: [
              {
                name: "Audit components needing dark mode",
                completed: true,
                status: "success",
                executedAt: "2024-02-22T13:05:00Z",
                executor: { type: "agent", name: "Claude", details: "Scanned all components in src/components" },
                aiAssisted: true,
                promptLogSummary: `User: Audit all components and generate a prioritised list for dark mode updates
Agent: Scanning all 47 components in src/components, checking className strings for hardcoded colors
User: Group by priority — P0 should be what users see on every page
Agent: P0 (5): Button, Card, Input, Modal, Table. P1 (12): Select, Checkbox, Nav, Sidebar, Dropdown, Badge, Alert, Tooltip, Tabs, Accordion, DatePicker, Avatar. P2 (30): Charts and misc
User: Flag any components with hardcoded hex values
Agent: Found 8 with hardcoded hex: Button (1 instance), Input (2), Modal overlay (1), Tooltip background, Badge (3 color variants), Chart axis colors — all need token migration
User: How many have design specs from the design team?
Agent: Design team has delivered dark specs for 12 components: all 5 P0 and 7 P1. Remaining 35 are pending`,
                summary: "47 components audited. 8 have hardcoded colors. Priority grouping complete: 5 P0, 12 P1, 30 P2.",
              },
              {
                name: "Request design specs",
                completed: true,
                status: "failed",
                executedAt: "2024-02-22T14:30:00Z",
                executor: { type: "user", name: "Emma Rodriguez" },
                summary: "Design team provided dark specs for only 12 of 47 components. Remaining 35 components are pending. Story cannot proceed until specs are complete.",
              },
            ],
          },
          {
            name: "Coding",
            completed: false,
            status: "pending",
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
]
