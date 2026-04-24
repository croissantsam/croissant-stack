import { createFileRoute, redirect } from "@tanstack/react-router"
import { getSessionFn } from "@/lib/auth-utils"
import { authClient } from "@/lib/auth-client"
import { orpc } from "@/lib/orpc"

export const Route = createFileRoute("/_auth/dashboard")({
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session) {
      throw redirect({
        to: "/",
      })
    }
    return { session }
  },
  loader: async () => {
    try {
      const data = await orpc.getSecretData()
      return { secretData: data.secret }
    } catch (err: any) {
      return { secretData: "Error: " + (err.message || "Unknown error") }
    }
  },
  component: Dashboard,
})

function Dashboard() {
  const { session } = Route.useRouteContext()
  const { secretData } = Route.useLoaderData()

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p>Welcome, {session.user.name}!</p>
          <p>This is a protected page. Only authenticated users can see this.</p>
          
          <div className="mt-6 rounded-lg border bg-gray-50 p-4">
            <h2 className="font-semibold mb-2">Secure oRPC Data:</h2>
            <p className="font-mono text-xs">{secretData}</p>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={async () => {
                await authClient.signOut()
                window.location.href = "/"
              }}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
