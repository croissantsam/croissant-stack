import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@workspace/db";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { electron } from "@better-auth/electron";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: { enabled: true },
  advanced: {
    cookiePrefix: "croissant",
    useSecureCookies: true,
  },
  cookie: {
    sameSite: "none",
    secure: true,
  },
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:1420",
    "tauri://localhost",
    "http://tauri.localhost",
  ],
  plugins: [tanstackStartCookies(), electron()],
});

export type Session = typeof auth.$Infer.Session;
