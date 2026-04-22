import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/isr")({
  loader: async () => {
    // In a real ISR scenario, this would be cached on the server
    // For this example, we'll just show the time it was "generated"
    return {
      generatedAt: new Date().toISOString(),
      message: "This page is an example of ISR. In a production build with proper configuration, this data would be cached and updated in the background.",
    }
  },
  component: ISRExample,
})

function ISRExample() {
  const { generatedAt, message } = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">ISR Example</h1>
      <p>{message}</p>
      
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Generated At:</h2>
        <p className="font-mono">{generatedAt}</p>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Refresh the page to see if the time updates. In a true ISR setup, it would only update after a certain interval.
      </p>
    </div>
  )
}
