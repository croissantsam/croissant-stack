import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { buttonVariants } from "@workspace/ui/components/button";

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
      <div className="rounded-full bg-muted p-6">
        <Lock className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Access Denied</h2>
      <p className="text-muted-foreground max-w-[400px]">
        You need to be logged in to access this page. Please sign in to view this content.
      </p>
      <div className="flex gap-2">
        <Link
          to="/login"
          className={buttonVariants({ variant: "default" })}
        >
          Sign In
        </Link>
        <Link
          to="/"
          className={buttonVariants({ variant: "outline" })}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
