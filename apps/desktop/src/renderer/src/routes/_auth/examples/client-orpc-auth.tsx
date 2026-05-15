import { createFileRoute } from "@tanstack/react-router";
import { useSecretData } from "@workspace/orpc/react";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth/examples/client-orpc-auth")({
  component: ClientORPCAuth,
});

function ClientORPCAuth() {
  const { data: sessionData } = authClient.useSession();
  const session = sessionData;

  const { data, isLoading } = useSecretData();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Client + oRPC (Authenticated)</h1>
      <p>This page is protected and fetches secret data on the client using TanStack Query.</p>

      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">User Session:</h2>
        <pre className="text-xs bg-muted p-2 rounded dark:bg-zinc-900 overflow-auto">{JSON.stringify(session, null, 2)}</pre>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Secret Data (Client-side):</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <pre className="text-xs bg-muted p-2 rounded dark:bg-zinc-900 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
