import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar";
import { AuthSidebar } from "@renderer/components/app-sidebar";
import { authClient } from "@renderer/lib/auth-client";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ location }) => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <SidebarProvider>
      <AuthSidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
