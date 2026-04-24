import * as React from "react"
import { Link } from "@tanstack/react-router"
import { LogOut, Settings, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { authClient } from "@/lib/auth-client"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Examples",
      items: [
        {
          title: "SSR + oRPC",
          url: "/examples/ssr-orpc",
        },
        {
          title: "SSR + oRPC (Auth)",
          url: "/examples/ssr-orpc-auth",
        },
        {
          title: "Client + oRPC",
          url: "/examples/client-orpc",
        },
        {
          title: "Client + oRPC (Auth)",
          url: "/examples/client-orpc-auth",
        },
        {
          title: "ISR",
          url: "/examples/isr",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<typeof authClient.$Infer.Session.user | null>(null)

  React.useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData } = await authClient.getSession()
      setUser(sessionData?.user || null)
    }
    checkSession()
  }, [])

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <span className="font-bold">LLM Trust</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton
                      render={
                        <Link
                          to={subItem.url}
                          activeProps={{ className: "bg-sidebar-accent" }}
                        />
                      }
                    >
                      {subItem.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
              {user ? (
                <SidebarMenuButton
                  size="lg"
                  render={<div />}
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.image || ""} alt={user.name} />
                      <AvatarFallback className="rounded-lg">
                        {user.name.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.name}</span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <Link
                        to="/account"
                        className="p-1 rounded hover:bg-sidebar-accent-foreground/10"
                        title="Account Settings"
                      >
                        <Settings className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={async (e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          await authClient.signOut()
                          window.location.reload()
                        }}
                        className="p-1 rounded hover:bg-sidebar-accent-foreground/10"
                        title="Sign Out"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </SidebarMenuButton>
              ) : (
              <SidebarMenuButton
                render={
                  <Link to="/login" className="flex items-center gap-2" />
                }
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
