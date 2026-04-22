import { createFileRoute } from "@tanstack/react-router"
import { orpc } from "../lib/orpc"
import * as React from "react"

export const Route = createFileRoute("/client-orpc")({
  component: ClientORPC,
})

function ClientORPC() {
  const [data, setData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await orpc.hello({ name: "Client User" })
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
      <h1 className="text-2xl font-bold">Client + oRPC Example</h1>
      <p>This page fetches data on the client using the oRPC client.</p>
      
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Message from oRPC (Client-side):</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <p>{data?.message}</p>
        )}
      </div>
    </div>
  )
}
