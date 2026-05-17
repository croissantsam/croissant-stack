import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@renderer/lib/auth-client";
import { useSecretData } from "@workspace/orpc/react";

export const Route = createFileRoute("/_auth/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;
  const { data: secretData, isLoading, error } = useSecretData();

  if (!user) return null;

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p>Welcome, {user.name}!</p>
          <p>This is a protected page. Only authenticated users can see this.</p>

          <div className="mt-6 rounded-lg border bg-gray-50 p-4 dark:bg-zinc-900">
            <h2 className="font-semibold mb-2">Secure oRPC Data:</h2>
            <p className="font-mono text-xs">
              {isLoading ? "Loading secret..." : error ? "Error: " + error.message : secretData?.secret}
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={async () => {
                await authClient.signOut();
                window.location.reload();
              }}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
