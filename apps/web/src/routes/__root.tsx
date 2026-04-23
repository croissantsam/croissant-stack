import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar"
import { Toaster } from "@workspace/ui/components/sonner"

import appCss from "@workspace/ui/globals.css?url"
import { AppSidebar } from "@/components/app-sidebar"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger />
            </header>
            <div className="flex-1 overflow-auto p-4">
              {children}
            </div>
          </main>
          <Toaster />
        </SidebarProvider>
        <Scripts />
      </body>
    </html>
  )
}
