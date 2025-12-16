import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "./env";
import { log } from "./logger";

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
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,

  // Callbacks
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user }: { session: any; user: any }) {
      // Add role to session
      return {
        ...session,
        user: {
          ...session.user,
          role: user.role || "user",
        },
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user, account }: { user: any; account: any }) {
      log.info("User signed in", {
        userId: user.id,
        email: user.email,
        provider: account.provider,
      });
      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signOut({ session }: { session: any }) {
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
