import * as React from "react";
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "../lib/router";

const ORPCContext = React.createContext<RouterClient<AppRouter> | null>(null);

export function ORPCProvider({
  client,
  children,
}: {
  client: RouterClient<AppRouter>;
  children: React.ReactNode;
}) {
  return <ORPCContext.Provider value={client}>{children}</ORPCContext.Provider>;
}

export function useORPC() {
  const context = React.useContext(ORPCContext);
  if (!context) {
    throw new Error("useORPC must be used within an ORPCProvider");
  }
  return context;
}
