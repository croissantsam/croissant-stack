import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { useHello, usePlanets } from "@workspace/orpc/react";

export const Route = createFileRoute("/_public/")({
  component: App,
});

function App() {
  const { data: helloData, isLoading: helloLoading } = useHello("Croissant Desktop");
  const { data: planets, isLoading: planetsLoading } = usePlanets();

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-lg min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium text-2xl mb-4">Desktop Project ready!</h1>
          <p>
            oRPC integration: <span className="font-bold">{helloLoading ? "Loading..." : helloData?.message}</span>
          </p>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Planets from Database:</h2>
            {planetsLoading ? (
               <p className="text-gray-500 italic">Loading planets...</p>
            ) : !planets || planets.length === 0 ? (
              <p className="text-gray-500 italic">
                No planets found in the database.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-2">
                {planets.map((planet) => (
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
