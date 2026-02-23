export type TaskStatus = "pending" | "in_progress" | "completed" | "failed"
export type TaskPriority = "low" | "medium" | "high" | "urgent"
export type AgentStatus = "idle" | "active" | "busy" | "offline"

export interface Agent {
  id: string
  name: string
  type: string
  status: AgentStatus
  avatar?: string
  capabilities: string[]
  tasksCompleted: number
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignedAgentId?: string
  projectId?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  tags: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "archived"
  progress: number
  teamMembers: string[]
  taskCount: number
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "member" | "viewer"
}
