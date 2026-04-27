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
          response.headers.set("Access-Control-Allow-Origin", "http://localhost:8081");
          response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
          response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
          response.headers.set("Access-Control-Allow-Credentials", "true");
        }

        return response ?? new Response("Not Found", { status: 404 });
      },
      OPTIONS: async () => {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:8081",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
          },
        });
      },
    },
  },
});
