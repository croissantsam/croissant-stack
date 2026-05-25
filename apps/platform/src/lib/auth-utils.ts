import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@workspace/auth/lib/auth";

export const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders();

  const session = await auth.api.getSession({
    headers,
  });

  return session;
});

export const ensureSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders();

  const session = await auth.api.getSession({
    headers,
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
});
