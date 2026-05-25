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

        if (response) {
          const origin = request.headers.get("Origin");
          if (origin) {
            response.headers.set("Access-Control-Allow-Origin", origin);
          }
          response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
          response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
          response.headers.set("Access-Control-Allow-Credentials", "true");
        }

        return response ?? new Response("Not Found", { status: 404 });
      },
      OPTIONS: async ({ request }) => {
        const origin = request.headers.get("Origin");
        const headers: Record<string, string> = {
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
        };
        if (origin) {
          headers["Access-Control-Allow-Origin"] = origin;
        }
        return new Response(null, {
          status: 204,
          headers,
        });
      },
    },
  },
});
