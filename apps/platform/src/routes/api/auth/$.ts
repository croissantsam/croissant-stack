import { auth } from "@workspace/auth/lib/auth";
import { createFileRoute } from "@tanstack/react-router";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "http://localhost:8081",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const response = await auth.handler(request);
        Object.entries(CORS_HEADERS).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        return response;
      },
      POST: async ({ request }: { request: Request }) => {
        const response = await auth.handler(request);
        Object.entries(CORS_HEADERS).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        return response;
      },
      OPTIONS: async () => {
        return new Response(null, {
          status: 204,
          headers: CORS_HEADERS,
        });
      },
    },
  },
});
