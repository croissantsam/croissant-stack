import { createFileRoute } from "@tanstack/react-router";
import { SignupForm } from "@renderer/components/signup-form";

export const Route = createFileRoute("/_public/signup")({
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
