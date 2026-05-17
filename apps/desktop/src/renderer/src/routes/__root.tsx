import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@workspace/ui/components/sonner";
import { ThemeProvider } from "@workspace/ui/components/theme-provider";
import { ORPCProvider } from "@workspace/orpc/react";
import { orpc } from "@renderer/lib/orpc";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@workspace/ui/components/empty";
import { Button, buttonVariants } from "@workspace/ui/components/button";

import "@workspace/ui/globals.css";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => {
    return (
      <Empty className="h-screen border-none">
        <EmptyHeader>
          <EmptyTitle>404 - Page Not Found</EmptyTitle>
          <EmptyDescription>
            The page you are looking for does not exist or has been moved.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link to="/" className={buttonVariants({ variant: "outline" })}>
            Go Home
          </Link>
        </EmptyContent>
      </Empty>
    );
  },
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
