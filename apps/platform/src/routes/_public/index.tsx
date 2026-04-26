import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Button } from "@workspace/ui/components/button";
import type { router } from "@workspace/orpc/router";
import type { InferRouterOutputs } from "@orpc/server";
import { orpc } from "@/lib/orpc";

type Outputs = InferRouterOutputs<typeof router>;
type Planet = Outputs["planets"]["getPlanets"][number];

const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const [helloRes, planets] = await Promise.all([
    orpc.hello({ name: "Croissant Stack" }),
    orpc.planets.getPlanets(),
  ]);
  return {
    message: helloRes.message,
    planets,
  };
});

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      {
        title: "Croissant Stack - The Ultimate TanStack Starter",
      },
      {
        name: "description",
        content:
          "Build full-stack applications faster with Croissant Stack. Featuring TanStack Start, oRPC, and Better Auth.",
      },
      {
        property: "og:title",
        content: "Croissant Stack - The Ultimate TanStack Starter",
      },
      {
        property: "og:description",
        content: "Build full-stack applications faster with Croissant Stack.",
      },
      {
        property: "og:image",
        content: "/og-image.png",
      },
    ],
  }),
  loader: () => getHomeData(),
  headers: () => ({
    "Cache-Control": "public, max-age=10, s-maxage=10, stale-while-revalidate=60",
  }),
  component: App,
});

function App() {
  const { message, planets } = Route.useLoaderData();

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-lg min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium text-2xl mb-4">Project ready!</h1>
          <p>
            oRPC integration: <span className="font-bold">{message}</span>
          </p>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Planets from Database:</h2>
            {planets.length === 0 ? (
              <p className="text-gray-500 italic">
                No planets found in the database. Run `db:push` and seed data if needed.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-2">
                {planets.map((planet: Planet) => (
                  <li key={planet.id} className="rounded-md border p-3 shadow-sm">
                    <span className="font-bold">{planet.name}</span> - {planet.description}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-8 flex gap-2">
            <Link to="/login">
              <Button>Go to Login</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
          </div>
          <p className="mt-4 text-gray-500">You may now add components and start building.</p>
        </div>
      </div>
    </div>
  );
}
