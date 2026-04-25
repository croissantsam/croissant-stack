import { createFileRoute, redirect } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { getSessionFn } from "@/lib/auth-utils"
import { orpc } from "@/lib/orpc"

export const Route = createFileRoute("/_auth/examples/client-orpc-auth")({
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: "/examples/client-orpc-auth",
        },
      })
    }
    return { session }
  },
  component: ClientORPCAuth,
})

function ClientORPCAuth() {
  const { session } = Route.useRouteContext()
  
  const { data, isLoading } = useQuery({
    queryKey: ["secret-data"],
    queryFn: () => orpc.getSecretData(),
  })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Client + oRPC (Authenticated)</h1>
      <p>This page is protected and fetches secret data on the client using TanStack Query.</p>
      
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">User Session:</h2>
        <pre className="text-xs bg-muted p-2 rounded">{JSON.stringify(session, null, 2)}</pre>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Secret Data (Client-side):</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <pre className="text-xs bg-muted p-2 rounded">{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </div>
  )
}
