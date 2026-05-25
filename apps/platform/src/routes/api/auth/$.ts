import { auth } from "@workspace/auth/lib/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const response = await auth.handler(request);
        const origin = request.headers.get("Origin");
        if (origin) {
          response.headers.set("Access-Control-Allow-Origin", origin);
        }
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.headers.set("Access-Control-Allow-Credentials", "true");
        return response;
      },
      POST: async ({ request }: { request: Request }) => {
        const response = await auth.handler(request);
        const origin = request.headers.get("Origin");
        if (origin) {
          response.headers.set("Access-Control-Allow-Origin", origin);
        }
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.headers.set("Access-Control-Allow-Credentials", "true");
        return response;
      },
      OPTIONS: async ({ request }: { request: Request }) => {
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
