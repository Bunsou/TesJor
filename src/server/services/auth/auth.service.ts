import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { config } from "@/shared/config";
import { log } from "@/shared/utils";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: false, // Only using Google OAuth
  },
  socialProviders: {
    google: {
      clientId: config.googleClientId,
      clientSecret: config.googleClientSecret,
      prompt: "select_account",
    },
  },
  secret: config.betterAuthSecret,
  baseURL: config.betterAuthUrl,

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
});

// Export types for use in application
export type Session = typeof auth.$Infer.Session & {
  user: typeof auth.$Infer.Session.user & { role?: string };
};
