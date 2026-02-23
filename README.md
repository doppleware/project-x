# AgenticTasks Manager

A modern SaaS application for managing agentic tasks, collaboration, and AI-powered workflows.

## Features

- **Dashboard**: Overview of tasks, agents, and project metrics
- **Task Management**: Create, assign, and track agentic tasks
- **Agent Management**: Manage AI agents and their capabilities
- **Project Collaboration**: Organize tasks into projects and collaborate with teams
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
agentic-tasks-manager/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── layout/           # Layout components (Sidebar, Header)
│   └── ui/               # shadcn/ui components
├── data/                 # Mock data files
│   ├── mock-agents.ts
│   ├── mock-tasks.ts
│   ├── mock-projects.ts
│   └── mock-users.ts
├── lib/                  # Utility functions
│   ├── utils.ts          # Helper functions
│   └── types.ts          # TypeScript types
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Mock Data

The application uses mock data for prototyping:
- **Agents**: 8 pre-configured AI agents with different capabilities
- **Tasks**: 10 sample tasks with various statuses and priorities
- **Projects**: 5 projects including active and completed ones
- **Users**: 4 user profiles with different roles

## Next Steps

- [ ] Add task creation and editing functionality
- [ ] Implement agent detail pages
- [ ] Add project management features
- [ ] Create team collaboration features
- [ ] Integrate real API endpoints
- [ ] Add authentication and user management

## License

MIT
