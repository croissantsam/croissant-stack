import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { orpc } from "@/lib/orpc"

const getISRData = createServerFn({ method: "GET" }).handler(async () => {
  // In a real ISR scenario, this would be cached on the server
  // For this example, we'll fetch planets via oRPC
  const planets = await orpc.planets.getPlanets()

  return {
    generatedAt: new Date().toISOString(),
    planets,
    message:
      "This page is an example of ISR. In a production build with proper configuration, this data would be cached and updated in the background.",
  }
})

export const Route = createFileRoute("/_public/examples/isr")({
  head: () => ({
    meta: [
      {
        title: "Incremental Static Regeneration (ISR) Example | Croissant Stack",
      },
      {
        name: "description",
        content:
          "Experience high-performance page loads with ISR in Croissant Stack.",
      },
    ],
  }),
  loader: () => getISRData(),
  headers: () => ({
    // Cache at CDN for 10 seconds, allow stale content for up to 1 minute
    "Cache-Control": "public, max-age=10, s-maxage=10, stale-while-revalidate=60",
  }),
  component: ISRExample,
})

function ISRExample() {
  const { generatedAt, message, planets } = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">ISR Example + oRPC</h1>
      <p>{message}</p>
      
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Generated At (Server-side):</h2>
        <p className="font-mono">{generatedAt}</p>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="font-semibold mb-4">Planets (Fetched via oRPC):</h2>
        {planets.length === 0 ? (
          <p className="text-gray-500 italic">No planets found.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {planets.map((planet) => (
              <li key={planet.id} className="rounded-md border p-3 bg-muted/50">
                <span className="font-bold">{planet.name}</span> - {planet.description}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground">
        Refresh the page to see if the time updates. In a true ISR setup, it would only update after a certain interval.
      </p>
    </div>
  )
}
