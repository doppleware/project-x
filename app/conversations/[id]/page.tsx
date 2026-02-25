"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockInitiatives } from "@/data/mock-initiatives"
import { ArrowLeft, Send, Users, FileText, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"

// Mock data for demonstration
const mockConversation = {
  id: "conv-1",
  initiativeName: "Add inventory screen for users",
  stageName: "Backlog grooming",
  subStageName: "Validate issue context",
  assignedEngineer: "Sarah Johnson",
  activeUsers: [
    { name: "John Doe", avatar: "JD", color: "bg-blue-500" },
    { name: "Sarah Johnson", avatar: "SJ", color: "bg-green-500" }
  ],
  context: {
    summary: "Agent analyzed existing component library and CSS architecture. Identified 45 components requiring theme updates. Verified CSS variable support in target browsers.",
    details: "The agent is validating the issue context by scanning the codebase for related components and dependencies. This includes analyzing the current architecture, identifying potential conflicts, and determining the scope of changes needed.",
    relatedFiles: [
      "src/components/inventory/InventoryList.tsx",
      "src/components/inventory/SearchBar.tsx",
      "src/api/inventory.controller.ts"
    ]
  },
  messages: [
    {
      id: 1,
      sender: "agent",
      content: "I'm analyzing the codebase for inventory-related components. Let me scan the existing structure.",
      timestamp: "2024-02-15T10:05:00Z"
    },
    {
      id: 2,
      sender: "agent",
      content: "Found: InventoryService API, ProductModel interfaces, ListingPage patterns. All required APIs exist, authentication is in place, and the UI framework is compatible.",
      timestamp: "2024-02-15T10:08:00Z"
    },
    {
      id: 3,
      sender: "user",
      content: "Great! Can you verify if we have any existing pagination patterns we can reuse?",
      timestamp: "2024-02-15T10:10:00Z"
    },
    {
      id: 4,
      sender: "agent",
      content: "Yes, I found a reusable pagination component in src/components/shared/Pagination.tsx that's used in the ProductListing page. It supports server-side pagination with customizable page sizes. I recommend reusing this pattern for consistency.",
      timestamp: "2024-02-15T10:12:00Z"
    },
    {
      id: 5,
      sender: "user",
      content: "Perfect, let's proceed with that approach.",
      timestamp: "2024-02-15T10:15:00Z"
    }
  ]
}

function resolveBackLink(convId: string): { href: string; label: string } {
  // Story conversation format: conv-{initiativeId}-{storyIndex}-{stageIndex}-{subIndex}
  // e.g. conv-init-1-0-1-2 → parts: ["conv","init","1","0","1","2"]
  // Initiative conversation format: conv-init-{n}
  // e.g. conv-init-1 → parts: ["conv","init","1"]
  const parts = convId.split("-")
  // parts[0]="conv", parts[1]="init", parts[2]=initiative number
  const initiativeId = `${parts[1]}-${parts[2]}`
  const initiative = mockInitiatives.find(i => i.id === initiativeId)

  if (parts.length > 3) {
    // Story-level conversation
    const storyIndex = parseInt(parts[3])
    const story = initiative?.stories[storyIndex]
    if (story && initiative) {
      return {
        href: `/initiatives/${initiative.id}/stories/${story.id}`,
        label: story.name,
      }
    }
  }

  // Initiative-level conversation (or fallback)
  if (initiative) {
    return { href: `/initiatives/${initiative.id}`, label: initiative.name }
  }

  return { href: "/initiatives", label: "Initiatives" }
}

export default function ConversationDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState<"chat" | "context">("chat")
  const [messageInput, setMessageInput] = useState("")
  const conversation = mockConversation
  const backLink = resolveBackLink(String(params.id))

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", messageInput)
      setMessageInput("")
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <Link href={backLink.href}>
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {backLink.label}
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{conversation.initiativeName}</h1>
            <p className="text-muted-foreground">
              {conversation.stageName} → {conversation.subStageName}
            </p>
          </div>

          {/* Presence Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Active:</span>
              <div className="flex -space-x-2">
                {conversation.activeUsers.map((user, idx) => (
                  <div
                    key={idx}
                    className="group relative"
                  >
                    <div className={`${user.color} h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ring-2 ring-background`}>
                      {user.avatar}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                      {user.name}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Assigned Engineer</div>
                <div className="text-lg font-bold mt-1">{conversation.assignedEngineer}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "chat"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Conversation
            </button>
            <button
              onClick={() => setActiveTab("context")}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "context"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-4 w-4" />
              Context
            </button>
          </div>
        </div>

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <Card className="flex flex-col" style={{ height: "calc(100vh - 400px)" }}>
            <CardHeader>
              <CardTitle>Agent Conversation</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {conversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">
                        {message.sender === "user" ? "You" : "Agent"}
                      </div>
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs mt-1 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2 pt-4 border-t">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Context Tab */}
        {activeTab === "context" && (
          <Card>
            <CardHeader>
              <CardTitle>Context & Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Summary</h3>
                  <p className="text-sm text-muted-foreground">{conversation.context.summary}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Details</h3>
                  <p className="text-sm text-muted-foreground">{conversation.context.details}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Related Files</h3>
                  <div className="space-y-2">
                    {conversation.context.relatedFiles.map((file, idx) => (
                      <div key={idx} className="text-sm font-mono bg-muted px-3 py-2 rounded">
                        {file}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
