import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = window.api.onAuthCallback(async (url) => {
      const token = new URL(url).searchParams.get("token");
      if (token) {
        setLoading(true);
        // Better Auth typically handles this via the setSession/proxy
        // In deep link flow, we might need to manually set the session
        // or let the client handle the token.
        // For now, we redirect to dashboard and let authClient.getSession() handle it
        navigate({ to: "/dashboard" });
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleBrowserLogin = () => {
     const platformUrl = `${import.meta.env.VITE_API_URL.replace("/api/auth", "")}/login?redirect=desktop://auth-callback`;
     window.api.openExternal(platformUrl);
   };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login to your account</CardTitle>
          <CardDescription>
            Click the button below to login via your web browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button size="lg" className="w-full" onClick={handleBrowserLogin} disabled={loading}>
              {loading ? "Authenticating..." : "Login from the web"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
