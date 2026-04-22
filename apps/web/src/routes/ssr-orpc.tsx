import { createFileRoute } from "@tanstack/react-router"
import { orpc } from "../lib/orpc"

export const Route = createFileRoute("/ssr-orpc")({
  loader: async () => {
    const data = await orpc.hello({ name: "SSR User" })
    const planets = await orpc.getPlanets()
    return { data, planets }
  },
  component: SSRORPC,
})

function SSRORPC() {
  const { data, planets } = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">SSR + oRPC Example</h1>
      <p>This page fetches data on the server using oRPC in a loader.</p>
      
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Message from oRPC:</h2>
        <p>{data.message}</p>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Planets from DB:</h2>
        <ul className="list-disc ml-6">
          {planets.map((planet) => (
            <li key={planet.id}>{planet.name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
