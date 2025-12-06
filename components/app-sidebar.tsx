"use client"

import * as React from "react"
import {
  Search,
  Vault,
  LucideIcon,
  LayoutDashboardIcon,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { Nav } from "./nav"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession()

  const user = session?.user ? {
    name: session.user.name || "User",
    email: session.user.email || "",
    avatar: session.user.image || "",
  } : {
    name: "Guest",
    email: "",
    avatar: "",
  }

  const projects = [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon as LucideIcon
    },
    {
      name: "Browse Products",
      url: "/products",
      icon: Search as LucideIcon
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Vault className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">LoanPick</span>
            <span className="truncate text-xs">Compare &amp; Choose</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <Nav projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
