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

  // Callbacks
  callbacks: {
    async session({
      session,
      user,
    }: {
      session: typeof auth.$Infer.Session;
      user: typeof auth.$Infer.Session.user & { role?: string; name?: string };
    }) {
      // Add role and name to session
      return {
        ...session,
        user: {
          ...session.user,
          name: user.name || session.user.name,
          role: user.role || "user",
        },
      };
    },
    async signIn({
      user,
      account,
    }: {
      user: { id: string; email: string; name: string };
      account: { provider: string };
    }) {
      log.info("User signed in", {
        userId: user.id,
        email: user.email,
        provider: account.provider,
      });
      return true;
    },
    async signOut({ session }: { session: { user: { id: string } } }) {
      log.info("User signed out", {
        userId: session.user.id,
      });
    },
  },

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
