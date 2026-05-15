import { Outlet, createRootRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@workspace/ui/components/sonner";
import { ThemeProvider } from "@workspace/ui/components/theme-provider";
import { ORPCProvider } from "@workspace/orpc/react";
import { orpc } from "@/lib/orpc";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import "@workspace/ui/globals.css";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <QueryClientProvider client={queryClient}>
        <ORPCProvider client={orpc}>
          <Outlet />
          <Toaster />
          <TanStackRouterDevtools />
        </ORPCProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
