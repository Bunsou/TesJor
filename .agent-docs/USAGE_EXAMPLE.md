# Usage Example: Building a Feature End-to-End

This document shows a complete example of using the AI Agent workflow to build a feature from scratch.

## Scenario: Building User Authentication

Let's build a complete authentication system with Google OAuth.

---

## Step 1: Write Your Master Plan

First, create or update your `docs/source/srs.md`:

```bash
mkdir -p docs/source
vim docs/source/srs.md
```

**Add this section to your SRS:**

```markdown
## 2.1 User Authentication

**Description:** Users can register and login using email/password or Google OAuth.

**User Stories:**

- As a new user, I want to register with Google, so I can quickly create an account.
- As a returning user, I want to login with my Google account, so I don't need to remember a password.

**Functional Requirements:**

1. System shall support Google OAuth 2.0 authentication
2. System shall create user records on first login
3. System shall maintain session state using JWT tokens
4. Users can logout and invalidate their session

**Non-Functional Requirements:**

- Authentication flow must complete in < 3 seconds
- JWT tokens expire after 7 days
- Secure token storage (httpOnly cookies)
```

---

## Step 2: Generate a PRD

```bash
# Use your AI agent interface "/plan:prd 'User Authentication System'"
```

**Save the output to:** `docs/prd/prd-001-authentication.md`

---

## Step 3: Plan the Feature

```bash
# Use your AI agent interface "/plan:feature 'Google OAuth login button and callback handler (relates to prd-001)'"
```

**Save the output to:** `docs/features/feat-001-google-oauth.md`

**Example feature plan output:**

```markdown
# Feature: Google OAuth Login

**Related to:** docs/prd/prd-001-authentication.md

## 1. Description

Implement Google OAuth 2.0 authentication with a login button and callback handler.

## 2. Components Needed

- `src/app/login/page.tsx` - Login page (Server Component)
- `src/app/login/components/google-login-button.tsx` - OAuth button (Client Component)

## 3. API Endpoints Needed

- `GET /api/auth/google` - Initiates OAuth flow
- `GET /api/auth/google/callback` - Handles OAuth callback

## 4. Data Models

- User schema with googleId field
- JWT token payload structure

## 5. File Changes

[Detailed list of all files to create/modify]
```

---

## Step 4: Generate the Login Button Component

```bash
# Use your AI agent interface "/do:component 'docs/features/feat-001-google-oauth.md'"
```

**Expected output:**

```typescript
// src/app/login/components/google-login-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    window.location.href = "/api/auth/google";
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      className="w-full"
      variant="outline"
    >
      {isLoading ? "Redirecting..." : "Continue with Google"}
    </Button>
  );
}
```

**Save it to the correct location.**

---

## Step 5: Generate the API Routes

```bash
# Use your AI agent interface "/do:api-route 'docs/features/feat-001-google-oauth.md'"
```

**Expected output:**

```typescript
// src/app/api/auth/google/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/google/callback`;

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "email profile");

  return NextResponse.redirect(authUrl.toString());
}
```

**And the callback:**

```typescript
// src/app/api/auth/google/callback/route.ts
// [Complete implementation with token exchange, user creation, JWT generation]
```

---

## Step 6: Create Database Schema

```bash
# Use your AI agent interface "/do:db 'User table for Google OAuth authentication from feat-001'"
```

**Expected output:**

```typescript
// src/server/db/schema.ts
import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  googleId: varchar("google_id", { length: 255 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

**Generate and run migration:**

```bash
npx drizzle-kit generate:pg
npx drizzle-kit push:pg
```

---

## Step 7: Write Tests

```bash
# Use your AI agent interface "/do:test 'src/app/api/auth/google/callback/route.ts'"
```

**Expected output:**

```typescript
// src/app/api/auth/google/callback/route.test.ts
import { GET } from "./route";
// [Complete test suite]
```

---

## Step 8: Review Your Code

```bash
# Use your AI agent interface "/review:code" < src/app/login/components/google-login-button.tsx
```

**Expected output:**

```
✅ Component Structure: Good
✅ TypeScript Types: Correct
✅ Error Handling: Missing try-catch (see suggestion below)
⚠️ Accessibility: Missing aria-label for screen readers

Suggestions:
1. Add error boundary or try-catch
2. Add aria-label="Sign in with Google"
3. Consider adding loading spinner icon
```

---

## Step 9: Refactor if Needed

```bash
# Use your AI agent interface "/refactor:file 'src/app/login/components/google-login-button.tsx'"
```

---

## Step 10: Commit

```bash
git add .
git diff --staged | # Use your AI agent interface "/do:commit"
```

**Expected output:**

```
feat(auth): implement Google OAuth authentication

- Add Google OAuth login button component
- Create OAuth initiation and callback API routes
- Add user table schema with googleId field
- Implement JWT token generation and validation
- Add comprehensive tests for auth flow

Closes #123
```

**Apply the commit:**

```bash
git commit -m "feat(auth): implement Google OAuth authentication..."
```

---

## Result

You've now:
✅ Planned the feature (PRD + Feature doc)
✅ Generated all components and API routes
✅ Created database schema and migrations
✅ Written comprehensive tests
✅ Reviewed and refactored code
✅ Made a proper semantic commit

**All following strict standards and best practices!** 🎉

---

## Tips for Real Projects

1. **Always start with SRS** - Don't skip the planning phase
2. **Save all feature docs** - They serve as technical documentation
3. **Review before committing** - Use `/review:code` frequently
4. **Iterate gradually** - Build one feature at a time
5. **Keep contexts updated** - When you establish new patterns, document them

---

## Troubleshooting

### "AI doesn't know about my feature"

→ Make sure you saved the feature doc and referenced it correctly

### "Generated code doesn't match standards"

→ Check that all context files are in `.agent/contexts/`

### "Command not found"

→ Ensure `.agent/commands/` structure is correct

### "AI suggests wrong file paths"

→ Review `structure_template.md` and update if needed
