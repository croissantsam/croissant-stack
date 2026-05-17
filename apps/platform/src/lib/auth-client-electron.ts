import { createAuthClient } from "better-auth/client";
import { electronProxyClient } from "@better-auth/electron/proxy";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  plugins: [
    electronProxyClient({
      protocol: {
        scheme: "com.example.app"
      },
    }),
  ],
});