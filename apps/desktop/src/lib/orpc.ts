import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { AppRouter } from "@workspace/orpc/router";
import type { RouterClient } from "@orpc/server";

const link = new RPCLink({
  url: `${import.meta.env.VITE_API_URL || "https://platform.localhost"}/api/rpc`,
});

export const orpc = createORPCClient(link) as RouterClient<AppRouter>;
