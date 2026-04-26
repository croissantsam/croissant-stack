import { createFileRoute, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getSessionFn } from "@/lib/auth-utils"
import { orpc } from "@/lib/orpc"

const getSecretData = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const secretData = await orpc.getSecretData()
    return { secretData }
  } catch (err) {
    return { secretData: null, error: "Failed to fetch secret data" }
  }
})

export const Route = createFileRoute("/_auth/examples/ssr-orpc-auth")({
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: "/examples/ssr-orpc-auth",
        },
      })
    }
    return { session }
  },
  loader: () => getSecretData(),
  component: SSRORPCAuth,
})

function SSRORPCAuth() {
  const { session } = Route.useRouteContext()
  const { secretData, error } = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">SSR + oRPC (Authenticated)</h1>
      <p>This page is protected and fetches secret data on the server.</p>
      
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">User Session:</h2>
        <pre className="text-xs bg-muted p-2 rounded">{JSON.stringify(session, null, 2)}</pre>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Secret Data:</h2>
        {error ? (
          <p className="text-destructive">{error}</p>
        ) : (
          <pre className="text-xs bg-muted p-2 rounded">{JSON.stringify(secretData, null, 2)}</pre>
        )}
      </div>
    </div>
  )
}
