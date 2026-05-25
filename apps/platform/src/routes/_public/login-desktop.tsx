import { authClient } from '@/lib/auth-client-electron';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react';

export const Route = createFileRoute('/_public/login-desktop')({
  component: RouteComponent,
})

function SignIn() {
  const handleSignIn = () => {
    console.log('yooo');
    authClient.ensureElectronRedirect();
    console.log('yooooo');
  };

  useEffect(() => {
    const id = authClient.ensureElectronRedirect();
    return () => {
      if (typeof id === 'number') {
        clearTimeout(id);
      }
    }
  }, []);

  return (
    <button
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
      onClick={handleSignIn}
    >
      Sign in to Desktop
    </button>
  );
}

function RouteComponent() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm flex justify-center">
        <SignIn />
      </div>
    </div>
  );
}
