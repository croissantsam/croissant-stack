import { RPCHandler } from "@orpc/server/fetch";
import { createFileRoute } from "@tanstack/react-router";
import { onError } from "@orpc/server";
import { router } from "@workspace/orpc/router";
import { auth } from "@workspace/auth/lib/auth";

const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const Route = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const session = await auth.api.getSession({
          headers: request.headers,
        });

        const { response } = await handler.handle(request, {
          prefix: "/api/rpc",
          context: {
            session,
          },
        });

        return response ?? new Response("Not Found", { status: 404 });
      },
    },
  },
});
