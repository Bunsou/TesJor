# Authentication Standards with BetterAuth

> **Framework:** BetterAuth
> **Default Methods:** Email/Password + Google OAuth
> **Documentation:** https://www.better-auth.com/docs

## Overview

This project uses **BetterAuth** as the authentication framework. BetterAuth is a framework-agnostic, type-safe authentication library for TypeScript that provides comprehensive auth features out of the box.

**Key Features:**

- Email & Password authentication
- Social sign-on (Google, GitHub, Apple, etc.)
- Built-in session management
- Automatic database schema management
- Plugin ecosystem for advanced features (2FA, passkey, magic link, etc.)
- Type-safe client and server APIs
- Framework-specific integrations (Next.js, Nuxt, SvelteKit, etc.)

---

## Installation & Setup

### 1. Install BetterAuth

```bash
npm install better-auth
```

### 2. Environment Variables

Add to `.env.local`:

```env
# BetterAuth Core
BETTER_AUTH_SECRET="your-secret-key-here"  # Generate using: openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3000"    # Base URL of your app

# Google OAuth (if using)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

**Generate Secret:**

```bash
openssl rand -base64 32
```

### 3. Project Structure

```
src/
├── lib/
│   ├── auth.ts              # Server-side auth instance
│   └── auth-client.ts       # Client-side auth instance
│
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts  # Auth API route handler
│   │
│   ├── (auth)/              # Auth pages route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   └── middleware.ts        # Optional: Auth middleware
│
└── server/
    └── db/
        └── schema.ts        # Include user tables (if using Drizzle)
```

---

## Server Configuration

### Create Auth Instance

**File:** `src/lib/auth.ts`

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/server/db/client";

export const auth = betterAuth({
  // Database adapter
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),

  // Email & Password authentication
  emailAndPassword: {
    enabled: true,
    autoSignIn: true, // Auto sign-in after registration (default: true)
    minPasswordLength: 8, // Minimum password length
    maxPasswordLength: 128, // Maximum password length
  },

  // Social providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Optional: Customize redirect URI
      // redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
    },
    // Add more providers as needed:
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days (in seconds)
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache session in cookie for 5 minutes
    },
  },

  // Advanced security options
  advanced: {
    cookiePrefix: "better-auth", // Cookie prefix (default: "better-auth")
    crossSubDomainCookies: {
      enabled: false, // Enable for subdomain sharing
      domain: undefined, // e.g., ".example.com"
    },
    generateId: () => {
      // Custom ID generation (optional)
      // Default uses nanoid
      return crypto.randomUUID();
    },
  },

  // Plugins (must be last in array)
  plugins: [
    nextCookies(), // Required for Next.js server actions
    // Add more plugins as needed:
    // twoFactor(),
    // magicLink(),
    // passkey(),
  ],
});

// Export types for use in client
export type Session = typeof auth.$Infer.Session;
```

**Important Notes:**

- The `nextCookies()` plugin **must be the last plugin** in the array
- This plugin ensures cookies are properly set in Next.js server actions
- Export the `auth` instance as default or named export

---

## API Route Handler (Next.js)

**File:** `src/app/api/auth/[...all]/route.ts`

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth.handler);
```

**Path Requirements:**

- Route must be at `/api/auth/[...all]` (catch-all route)
- Handles all auth-related requests automatically
- Do not change the path unless you update `BETTER_AUTH_URL`

---

## Client Configuration

### Create Client Instance

**File:** `src/lib/auth-client.ts`

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Optional: Only needed if auth server is on different domain
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

// Alternative: Export specific methods
export const { signIn, signUp, signOut, useSession } = authClient;
```

**Framework-Specific Imports:**

- **React/Next.js:** `"better-auth/react"`
- **Vue/Nuxt:** `"better-auth/vue"`
- **Svelte/SvelteKit:** `"better-auth/svelte"`
- **Solid/SolidStart:** `"better-auth/solid"`
- **Vanilla JS:** `"better-auth/client"`

---

## Database Schema

### CLI Commands

```bash
# Generate schema (for ORMs like Drizzle/Prisma)
npx @better-auth/cli generate

# Or migrate directly (for Kysely adapter)
npx @better-auth/cli migrate
```

### Core Schema (If Using Drizzle)

**File:** `src/server/db/schema.ts`

```typescript
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Sessions table
export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Accounts table (for social providers)
export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Verification tokens table (for email verification)
export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
```

**Note:** BetterAuth CLI can auto-generate this schema for you.

---

## Authentication Patterns

### 1. Email/Password Registration

**Client-Side (React Component):**

```typescript
"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
        callbackURL: "/dashboard", // Redirect after verification
      },
      {
        onRequest: () => {
          // Show loading state
        },
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (ctx) => {
          alert(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Full Name" required />
      <input type="email" name="email" placeholder="Email" required />
      <input
        type="password"
        name="password"
        placeholder="Password"
        minLength={8}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
```

**Server-Side (Server Action):**

```typescript
"use server";

import { auth } from "@/lib/auth";

export async function registerUser(
  email: string,
  password: string,
  name: string
) {
  const response = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  if (response.error) {
    return { error: response.error.message };
  }

  return { success: true, user: response.data };
}
```

### 2. Email/Password Sign In

**Client-Side:**

```typescript
"use client";

import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { data, error } = await authClient.signIn.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      rememberMe: true, // Keep session after browser close
      callbackURL: "/dashboard",
    });

    if (error) {
      alert(error.message);
      return;
    }

    // Success - user is signed in
    window.location.href = "/dashboard";
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

### 3. Google OAuth Sign In

**Client-Side:**

```typescript
"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      errorCallbackURL: "/login?error=oauth",
      newUserCallbackURL: "/welcome", // For first-time users
    });
    // User will be redirected to Google OAuth page
  };

  return (
    <Button onClick={handleGoogleLogin} variant="outline">
      <GoogleIcon />
      Continue with Google
    </Button>
  );
}
```

**OAuth Flow:**

1. User clicks "Continue with Google"
2. User is redirected to Google OAuth page
3. User authenticates with Google
4. Google redirects back to `/api/auth/callback/google`
5. BetterAuth handles the callback, creates/updates user
6. User is redirected to `callbackURL`

### 4. Sign Out

**Client-Side:**

```typescript
"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
```

---

## Session Management

### Client-Side Session Access

#### Using the Hook (Recommended)

```typescript
"use client";

import { authClient } from "@/lib/auth-client";

export function UserProfile() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
      <img src={session.user.image} alt="Profile" />
    </div>
  );
}
```

#### Using getSession (Alternative)

```typescript
"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export function UserInfo() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await authClient.getSession();
      setSession(data);
    };
    fetchSession();
  }, []);

  return <div>{session?.user.name}</div>;
}
```

### Server-Side Session Access

#### In Server Components (RSC)

```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
    </div>
  );
}
```

#### In Server Actions

```typescript
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getUserProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Not authenticated");
  }

  return session.user;
}
```

#### In API Routes

```typescript
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user: session.user });
}
```

---

## Middleware (Route Protection)

### Basic Middleware (Cookie Check Only)

**File:** `src/middleware.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // WARNING: This only checks if cookie exists, not if it's valid
  // Always validate session on the server for protected actions
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], // Protected routes
};
```

**Security Warning:** The `getSessionCookie()` function only checks for the existence of a session cookie; it does not validate it. Always validate sessions on the server for actual security.

### Advanced Middleware (Full Session Validation)

**For Next.js 15.2.0+:**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs", // Required for Node.js APIs
  matcher: ["/dashboard/:path*"],
};
```

---

## Type Safety

### Inferring Types

```typescript
import type { auth } from "@/lib/auth";

// Session type
export type Session = typeof auth.$Infer.Session;

// User type
export type User = Session["user"];

// Usage in components
function UserCard({ user }: { user: User }) {
  return <div>{user.name}</div>;
}
```

---

## Error Handling

### Client-Side

```typescript
const { data, error } = await authClient.signIn.email({
  email,
  password,
});

if (error) {
  // Error object structure:
  // {
  //   message: string,
  //   status: number,
  //   statusText: string
  // }

  switch (error.status) {
    case 400:
      console.error("Invalid credentials");
      break;
    case 429:
      console.error("Too many attempts");
      break;
    default:
      console.error("An error occurred");
  }
}
```

### Server-Side

```typescript
const response = await auth.api.signInEmail({
  body: { email, password },
});

if (response.error) {
  return {
    error: response.error.message,
    status: response.error.status,
  };
}

return { success: true };
```

---

## Best Practices

### 1. **Always Use Server-Side Validation**

- Never trust client-side session checks for security
- Always validate sessions on the server for protected actions
- Use middleware only for UX (optimistic redirects)

### 2. **Secure Password Requirements**

```typescript
emailAndPassword: {
  enabled: true,
  minPasswordLength: 12, // Recommended minimum
  maxPasswordLength: 128,
  // Enforce additional password rules in your validation
}
```

### 3. **Environment Variables**

- Never commit `.env.local` to version control
- Always use `.env.example` as a template
- Store secrets securely in production (Vercel, AWS, etc.)

### 4. **Session Security**

```typescript
session: {
  expiresIn: 60 * 60 * 24 * 7, // 7 days
  updateAge: 60 * 60 * 24, // Refresh every 24 hours
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60, // 5 minutes cache
  },
}
```

### 5. **OAuth Configuration**

- Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
- Set authorized redirect URIs to `{BETTER_AUTH_URL}/api/auth/callback/google`
- Request only necessary scopes

### 6. **Rate Limiting**

BetterAuth includes built-in rate limiting. Configure in advanced options:

```typescript
advanced: {
  rateLimit: {
    window: 60, // 60 seconds
    max: 10, // 10 requests per window
  },
}
```

### 7. **Testing Authentication**

```typescript
// In tests, mock the auth client
jest.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: jest.fn(() => ({
      data: { user: { id: "test", name: "Test User" } },
      isPending: false,
      error: null,
    })),
  },
}));
```

---

## Common Use Cases

### 1. Protected Server Component

```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  return <div>Protected content for {session.user.name}</div>;
}
```

### 2. Conditional Rendering Based on Auth

```typescript
"use client";

import { authClient } from "@/lib/auth-client";

export function Header() {
  const { data: session } = authClient.useSession();

  return (
    <header>
      {session ? <UserMenu user={session.user} /> : <LoginButton />}
    </header>
  );
}
```

### 3. Email Verification (Optional)

```typescript
// Add to auth configuration
emailAndPassword: {
  enabled: true,
  requireEmailVerification: true, // Enable verification
  sendVerificationEmail: async (user, url) => {
    // Send email with verification link
    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: `<a href="${url}">Verify Email</a>`,
    });
  },
}
```

### 4. Custom User Fields

```typescript
// In auth configuration
user: {
  additionalFields: {
    phoneNumber: {
      type: "string",
      required: false,
    },
    role: {
      type: "string",
      defaultValue: "user",
    },
  },
}

// Usage
await authClient.signUp.email({
  email,
  password,
  name,
  // Additional fields
  phoneNumber: "+1234567890",
  role: "admin",
});
```

---

## Troubleshooting

### Issue: Cookies Not Set in Server Actions

**Solution:** Add the `nextCookies()` plugin:

```typescript
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  // ...config
  plugins: [nextCookies()], // Must be last
});
```

### Issue: OAuth Callback Fails

**Checklist:**

- Verify redirect URI in provider console matches exactly
- Check `BETTER_AUTH_URL` is set correctly
- Ensure credentials are correct
- Check network logs for detailed error messages

### Issue: Session Not Persisting

**Checklist:**

- Verify `DATABASE_URL` is correct
- Run `npx @better-auth/cli migrate`
- Check browser cookies are enabled
- Verify `BETTER_AUTH_SECRET` is set

### Issue: TypeScript Errors

**Solution:** Ensure proper imports:

```typescript
// Correct
import { createAuthClient } from "better-auth/react";

// Incorrect (for Next.js)
import { createAuthClient } from "better-auth/client";
```

---

## Additional Plugins

### Two-Factor Authentication

```typescript
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  // ...config
  plugins: [twoFactor(), nextCookies()],
});

// Client
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [twoFactorClient({ twoFactorPage: "/two-factor" })],
});
```

### Magic Link

```typescript
import { magicLink } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({ to: email, html: `<a href="${url}">Login</a>` });
      },
    }),
    nextCookies(),
  ],
});
```

### Passkey (WebAuthn)

```typescript
import { passkey } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [passkey(), nextCookies()],
});
```

---

## Resources

- **Documentation:** https://www.better-auth.com/docs
- **GitHub:** https://github.com/better-auth/better-auth
- **Discord Community:** https://www.better-auth.com/community
- **Examples:** https://github.com/better-auth/better-auth/tree/main/examples

---

## Summary Checklist

When implementing BetterAuth in your project:

- [ ] Install `better-auth`
- [ ] Set environment variables (`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`)
- [ ] Create `src/lib/auth.ts` (server instance)
- [ ] Create `src/lib/auth-client.ts` (client instance)
- [ ] Create API route at `src/app/api/auth/[...all]/route.ts`
- [ ] Run `npx @better-auth/cli migrate` to create database tables
- [ ] Configure email/password and OAuth providers
- [ ] Add `nextCookies()` plugin (must be last)
- [ ] Implement login/register pages
- [ ] Add session checks to protected routes
- [ ] Test authentication flow end-to-end

---

**Remember:** Always validate sessions on the server for security-critical operations. Client-side checks are for UX only.
