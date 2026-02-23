"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ListTodo,
  Users,
  Settings,
  Bot,
  FolderKanban
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    disabled: true,
  },
  {
    title: "Initiatives",
    href: "/initiatives",
    icon: ListTodo,
    disabled: false,
  },
  {
    title: "Agents",
    href: "/agents",
    icon: Bot,
    disabled: true,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
    disabled: true,
  },
  {
    title: "Team",
    href: "/team",
    icon: Users,
    disabled: true,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    disabled: true,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/initiatives" className="flex items-center gap-2 font-semibold text-lg">
          <Bot className="h-6 w-6 text-primary" />
          <span>AgenticTasks</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            if (item.disabled) {
              return (
                <div
                  key={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    "text-muted-foreground/40 cursor-not-allowed opacity-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </div>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer/User Info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">john@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
