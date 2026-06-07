import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@workspace/db";
import { tanstackStartCookies } from "better-auth/tanstack-start";

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
  trustedOrigins: ["https://platform.localhost"],
  plugins: [tanstackStartCookies()],
});

export type Session = typeof auth.$Infer.Session;
