import { createAuthClient } from "better-auth/client";
import { electronProxyClient } from "@better-auth/electron/proxy";

export const authClient = createAuthClient({
  baseURL: "https://platform.localhost",
  plugins: [
    electronProxyClient({
      protocol: {
        scheme: "com.desktop.app"
      },
    }),
  ],
});