import { createAuthClient } from "better-auth/client";
import { electronClient } from "@better-auth/electron/client";
import { storage } from "@better-auth/electron/storage";


console.log(process.env.VITE_BETTER_AUTH_URL);
console.log(process.env.VITE_BETTER_AUTH_SIGN_IN_URL);
export const authClient = createAuthClient({
  baseURL: "https://platform.localhost", // Base URL of your Better Auth frontend
  plugins: [
    electronClient({
      signInURL: "https://platform.localhost/login-desktop", // The URL to redirect to for authentication
      protocol: {
        scheme: "com.desktop.app" // The custom protocol scheme registered by your Electron app
      },
      storage: storage(),
    }),
  ],
});