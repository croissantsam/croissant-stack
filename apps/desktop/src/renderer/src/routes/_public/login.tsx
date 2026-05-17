import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@renderer/components/login-form";

export const Route = createFileRoute("/_public/login")({
  component: Login,
});

function Login() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
