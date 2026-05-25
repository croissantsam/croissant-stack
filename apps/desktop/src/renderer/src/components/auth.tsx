import { useEffect } from "react";

export function Auth() {
  useEffect(() => {
    const unsubscribeAuthenticated =
      window.onAuthenticated((user) => {
        console.log("Authenticated user:", user);
      });
    const unsubscribeAuthError =
      window.onAuthError((ctx) => {
        // toast.error(`Authentication error: ${ctx.message}`);
        console.error(`Authentication error: ${ctx.message}`);
      });

    return () => {
      unsubscribeAuthenticated();
      unsubscribeAuthError();
    };
  }, []);

  return (
      <button onClick={() => window.requestAuth()}>
        Sign in with Browser
      </button>
  );
}