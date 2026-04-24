import { createFileRoute } from "@tanstack/react-router"
import { SignupForm } from "@/components/signup-form"

export const Route = createFileRoute("/_public/signup")({
  headers: () => ({
    "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
  }),
  component: Signup,
})

function Signup() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  )
}
