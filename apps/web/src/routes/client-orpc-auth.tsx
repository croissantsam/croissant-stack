import { createFileRoute, redirect } from "@tanstack/react-router"
import { getSessionFn } from "../lib/auth-utils"
import { orpc } from "../lib/orpc"
import * as React from "react"

export const Route = createFileRoute("/client-orpc-auth")({
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: "/client-orpc-auth",
        },
      })
    }
    return { session }
  },
  component: ClientORPCAuth,
})

function ClientORPCAuth() {
  const { session } = Route.useRouteContext()
  const [data, setData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await orpc.getSecretData()
        setData(res)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Client + oRPC (Authenticated)</h1>
      <p>This page is protected and fetches secret data on the client.</p>
      
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">User Session:</h2>
        <pre className="text-xs bg-muted p-2 rounded">{JSON.stringify(session, null, 2)}</pre>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Secret Data (Client-side):</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <pre className="text-xs bg-muted p-2 rounded">{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </div>
  )
}
