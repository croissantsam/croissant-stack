import { createFileRoute } from "@tanstack/react-router";
import { SignupForm } from "@/components/signup-form";

export const Route = createFileRoute("/_public/signup")({
  head: () => ({
    meta: [
      {
        title: "Create an Account | Croissant Stack",
      },
      {
        name: "description",
        content:
          "Join Croissant Stack today. Create an account to start building with the best stack.",
      },
    ],
  }),
  headers: () => ({
    "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
  }),
  component: Signup,
});

function Signup() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
