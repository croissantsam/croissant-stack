import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { RouterClient } from "@orpc/server";
import { router } from "@workspace/orpc/router";

const link = new RPCLink({
  // In a real desktop app, this might point to a local or remote server
  // For now, we assume it's the same origin as the platform's API
  url: `https://platform.localhost/api/rpc`, 
});

export const orpc: RouterClient<typeof router> = createORPCClient(link)
