````markdown
# Next.js Full-Stack Structure Template

> **⚠️ This is an adaptive guideline**
>
> Adapt based on your project's requirements (SRS/SIS). Default stack: **Next.js 14+, TypeScript, Tailwind v4, Drizzle ORM, PostgreSQL**.

---

## Project Structure

```
my-nextjs-app/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── globals.css              # Global styles & Tailwind v4 config
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   ├── loading.tsx              # Global loading UI
│   │   ├── error.tsx                # Global error UI
│   │   ├── not-found.tsx            # 404 page
│   │   │
│   │   ├── api/                     # API Routes (Backend)
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── register/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   └── refresh/route.ts
│   │   │   ├── users/
│   │   │   │   ├── route.ts
│   │   │   │   ├── me/route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   └── posts/
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   │
│   │   ├── (auth)/                  # Auth route group
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   └── dashboard/               # Protected pages
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       └── settings/page.tsx
│   │
│   ├── components/                  # Shared UI Components
│   │   ├── ui/                      # Base components (Button, Input, Modal)
│   │   ├── layout/                  # Header, Footer, Sidebar
│   │   └── common/                  # LoadingSpinner, ErrorBoundary
│   │
│   ├── features/                    # Feature Modules (Domain-driven)
│   │   ├── auth/
│   │   │   ├── components/          # Feature-specific UI
│   │   │   ├── hooks/               # Feature-specific hooks
│   │   │   ├── schemas/             # Zod validation schemas
│   │   │   ├── services/            # API calls (client-side)
│   │   │   └── index.ts             # Feature exports
│   │   │
│   │   ├── users/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── schemas/
│   │   │   ├── services/
│   │   │   └── index.ts
│   │   │
│   │   └── posts/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── schemas/
│   │       ├── services/
│   │       └── index.ts
│   │
│   ├── server/                      # Server-Side Code
│   │   ├── db/
│   │   │   ├── index.ts             # Drizzle client
│   │   │   └── schema.ts            # Database schema
│   │   │
│   │   ├── features/                # Server-side feature logic
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.repository.ts
│   │   │   │   ├── jwt.service.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── users/
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── user.repository.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── posts/
│   │   │       ├── post.controller.ts
│   │   │       ├── post.service.ts
│   │   │       ├── post.repository.ts
│   │   │       └── index.ts
│   │   │
│   │   └── middleware/
│   │       ├── auth.middleware.ts   # JWT verification
│   │       └── async-handler.ts     # Error wrapper
│   │
│   ├── shared/                      # Shared Code (Client + Server)
│   │   ├── config/
│   │   │   └── config.ts               # Environment variables (Zod validated)
│   │   │
│   │   ├── types/
│   │   │   ├── auth.types.ts
│   │   │   ├── user.types.ts
│   │   │   └── api.types.ts         # API request/response types
│   │   │
│   │   ├── utils/
│   │   │   ├── error-handler.ts     # AppError class + error codes
│   │   │   ├── response-handler.ts  # sendSuccessResponse, sendErrorResponse
│   │   │   └── logger.ts            # Winston/Pino logger
│   │   │
│   │   └── middleware/
│   │       ├── error-handler.ts     # Global error handler
│   │       └── validator.ts         # Zod validation middleware
│   │
│   ├── hooks/                       # Global React hooks
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   │
│   └── lib/                         # Client-side utilities
│       ├── api-client.ts            # Fetch/Axios setup
│       └── utils.ts                 # cn(), formatDate(), etc.
│
├── drizzle/                         # Database migrations
│   └── migrations/
│
├── public/                          # Static assets
├── .env.local
├── .env.example
├── drizzle.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ components/ │  │  features/  │  │         hooks/          │  │
│  │    (UI)     │  │ (UI+Logic)  │  │   (React State/Logic)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ API Calls
┌─────────────────────────────────────────────────────────────────┐
│                      API Routes (app/api/)                      │
│          ┌─────────────────────────────────────────┐            │
│          │           route.ts (thin layer)         │            │
│          │  - Parse request                        │            │
│          │  - Call controller                      │            │
│          │  - Return response                      │            │
│          └─────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVER (server/)                            │
│  ┌──────────────┐  ┌───────────────┐  ┌────────────────────┐   │
│  │  Controller  │─▶│    Service    │─▶│    Repository      │   │
│  │(HTTP parsing)│  │(Business logic)│  │(Database queries)  │   │
│  └──────────────┘  └───────────────┘  └────────────────────┘   │
│                                                │                 │
│                                                ▼                 │
│                                       ┌────────────────┐        │
│                                       │   Database     │        │
│                                       │   (Drizzle)    │        │
│                                       └────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SHARED (shared/)                           │
│  ┌────────────┐  ┌────────────────┐  ┌──────────────────────┐  │
│  │   types/   │  │     utils/     │  │     middleware/      │  │
│  │(TypeScript)│  │ (Error,Logger) │  │ (Validator,Handler)  │  │
│  └────────────┘  └────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Folder Details

### 📁 `src/app/` - Next.js App Router

| File/Folder   | Purpose                                 |
| ------------- | --------------------------------------- |
| `page.tsx`    | Page component                          |
| `layout.tsx`  | Layout wrapper (shared UI across pages) |
| `loading.tsx` | Loading state UI                        |
| `error.tsx`   | Error boundary UI                       |
| `(group)/`    | Route groups (no URL impact)            |
| `api/`        | Backend API routes                      |

---

### 📁 `src/app/api/` - API Routes

**Purpose**: Thin HTTP layer that delegates to controllers

```typescript
// src/app/api/users/route.ts
import { NextRequest } from "next/server";
import { asyncHandler } from "@/server/middleware/async-handler";
import * as controller from "@/server/features/users";

export const GET = asyncHandler(async (req: NextRequest) => {
  return controller.getAllUsers(req);
});

export const POST = asyncHandler(async (req: NextRequest) => {
  return controller.createUser(req);
});
```

---

### 📁 `src/components/` - Shared UI Components

| Folder    | Purpose                                   |
| --------- | ----------------------------------------- |
| `ui/`     | Base elements: Button, Input, Modal, Card |
| `layout/` | Header, Footer, Sidebar, Navigation       |
| `common/` | LoadingSpinner, ErrorBoundary, Toast      |

---

### 📁 `src/features/` - Client-Side Feature Modules

Each feature is a self-contained module with all its related code:

```
features/auth/
├── components/          # LoginForm, RegisterForm
├── hooks/               # useAuth, useSession
├── schemas/             # loginSchema, registerSchema (Zod)
├── services/            # login(), register() API calls
└── index.ts             # Public exports
```

**Example - Feature Service (Client-side API call)**:

```typescript
// features/auth/services/auth.service.ts
import { apiClient } from "@/lib/api-client";
import type { LoginRequest, AuthResponse } from "../schemas/auth.schema";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  return apiClient.post("/api/auth/login", data);
};
```

**Example - Feature Schema**:

```typescript
// features/auth/schemas/auth.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[0-9]/, "Must contain a number"),
  full_name: z.string().min(2),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
```

---

### 📁 `src/server/` - Server-Side Code

**Never import this in client components.**

#### `server/db/` - Database Layer

```typescript
// server/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const conn = postgres(process.env.DATABASE_URL!);
export const db = drizzle(conn, { schema });
```

#### `server/features/` - Server Feature Modules

Each server feature follows the **Controller → Service → Repository** pattern:

```
server/features/users/
├── user.controller.ts    # HTTP request/response handling
├── user.service.ts       # Business logic
├── user.repository.ts    # Database queries
└── index.ts              # Public exports
```

**Controller** - Handles HTTP requests:

```typescript
// server/features/users/user.controller.ts
import { NextRequest } from "next/server";
import { sendSuccessResponse } from "@/shared/utils/response-handler";
import * as service from "./user.service";

export const getAllUsers = async (req: NextRequest) => {
  const users = await service.getAllUsers();
  return sendSuccessResponse(users, "Users retrieved successfully");
};

export const createUser = async (req: NextRequest) => {
  const body = await req.json();
  const user = await service.createUser(body);
  return sendSuccessResponse(user, "User created successfully", 201);
};
```

**Service** - Business logic:

```typescript
// server/features/users/user.service.ts
import { AppError } from "@/shared/utils/error-handler";
import * as repo from "./user.repository";

export const getAllUsers = async () => {
  return repo.findAllUsers();
};

export const createUser = async (data: unknown) => {
  // Validate, apply business rules, etc.
  const existing = await repo.findByEmail(data.email);
  if (existing) {
    throw new AppError("EMAIL_ALREADY_EXISTS");
  }
  return repo.createUser(data);
};
```

**Repository** - Database queries:

```typescript
// server/features/users/user.repository.ts
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";

export const findAllUsers = async () => {
  return db.query.usersTable.findMany({
    columns: { password_hash: false },
  });
};

export const findByEmail = async (email: string) => {
  return db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  });
};

export const createUser = async (data: typeof usersTable.$inferInsert) => {
  const [user] = await db.insert(usersTable).values(data).returning();
  return user;
};
```

---

### 📁 `src/shared/` - Shared Utilities

Code that works on **both client and server**.

#### `shared/config/config.ts` - Environment Variables

```typescript
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  NEXT_PUBLIC_API_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

#### `shared/utils/error-handler.ts` - Error Classes

```typescript
// Centralized error definitions
const ERROR_MAP = {
  VALIDATION_ERROR: { statusCode: 400, message: "Invalid input provided." },
  INVALID_CREDENTIALS: {
    statusCode: 401,
    message: "Invalid email or password.",
  },
  TOKEN_INVALID: { statusCode: 401, message: "Invalid or missing token." },
  TOKEN_EXPIRED: { statusCode: 401, message: "Token has expired." },
  INSUFFICIENT_PERMISSIONS: { statusCode: 403, message: "Permission denied." },
  USER_NOT_FOUND: { statusCode: 404, message: "User not found." },
  EMAIL_ALREADY_EXISTS: { statusCode: 409, message: "Email already exists." },
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    message: "An unexpected error occurred.",
  },
};

export type AppErrorCode = keyof typeof ERROR_MAP;

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly statusCode: number;

  constructor(code: AppErrorCode, message?: string) {
    super(message || ERROR_MAP[code].message);
    this.code = code;
    this.statusCode = ERROR_MAP[code].statusCode;
  }
}
```

#### `shared/utils/response-handler.ts` - Response Helpers

```typescript
import { NextResponse } from "next/server";

export const sendSuccessResponse = <T>(
  data: T,
  message: string,
  statusCode = 200
) => {
  return NextResponse.json(
    { success: true, message, data },
    { status: statusCode }
  );
};

export const sendErrorResponse = (error: AppError) => {
  return NextResponse.json(
    { success: false, error: { code: error.code, message: error.message } },
    { status: error.statusCode }
  );
};
```

#### `shared/middleware/validator.ts` - Zod Validation

```typescript
import { z, ZodSchema } from "zod";
import { AppError } from "../utils/error-handler";

export const validateBody = <T>(schema: ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw new AppError("VALIDATION_ERROR", message);
    }
    throw error;
  }
};
```

#### `shared/middleware/error-handler.ts` - Global Error Handler

```typescript
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "../utils/error-handler";
import { sendErrorResponse } from "../utils/response-handler";

export const handleError = (error: unknown): NextResponse => {
  if (error instanceof ZodError) {
    return sendErrorResponse(new AppError("VALIDATION_ERROR"));
  }

  if (error instanceof AppError) {
    return sendErrorResponse(error);
  }

  // Log unexpected errors
  console.error("Unexpected error:", error);
  return sendErrorResponse(new AppError("INTERNAL_SERVER_ERROR"));
};
```

---

### 📁 `src/server/middleware/` - Server Middleware

#### `async-handler.ts` - Error Wrapper

```typescript
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/shared/middleware/error-handler";

type Handler = (req: NextRequest, context?: any) => Promise<NextResponse>;

export const asyncHandler = (handler: Handler) => {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (error) {
      return handleError(error);
    }
  };
};
```

#### `auth.middleware.ts` - Authentication

```typescript
import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/server/features/auth/jwt.service";
import { AppError } from "@/shared/utils/error-handler";

export const requireAuth = async (req: NextRequest) => {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    throw new AppError("TOKEN_INVALID");
  }

  const payload = verifyAccessToken(token);
  return payload; // { userId, email, role }
};
```

---

## Naming Conventions

| Type             | Convention      | Example              |
| ---------------- | --------------- | -------------------- |
| **Components**   | PascalCase      | `UserProfile.tsx`    |
| **Hooks**        | camelCase + use | `useAuth.ts`         |
| **Schemas**      | camelCase       | `auth.schema.ts`     |
| **Services**     | camelCase       | `auth.service.ts`    |
| **Controllers**  | camelCase       | `user.controller.ts` |
| **Repositories** | camelCase       | `user.repository.ts` |
| **Types**        | camelCase       | `auth.types.ts`      |
| **Directories**  | kebab-case      | `user-profile/`      |
| **API Routes**   | `route.ts`      | `api/users/route.ts` |

---

## Data Flow Example

**Creating a new user:**

```
1. Client: features/auth/services/auth.service.ts
   └─▶ POST /api/auth/register

2. API Route: app/api/auth/register/route.ts
   └─▶ asyncHandler wraps controller

3. Controller: server/features/auth/auth.controller.ts
   └─▶ Parse request body, call service

4. Service: server/features/auth/auth.service.ts
   └─▶ Validate data, hash password, call repository

5. Repository: server/features/auth/auth.repository.ts
   └─▶ Insert into database

6. Response flows back through each layer
   └─▶ sendSuccessResponse({ user }, 'User created', 201)
```

---

## Key Patterns

### 1. Feature-Based Organization

Group related code together instead of by technical role:

```
✅ GOOD: features/auth/
   ├── components/
   ├── hooks/
   ├── schemas/
   └── services/

❌ BAD:
   ├── components/auth/
   ├── hooks/auth/
   ├── schemas/auth/
   └── services/auth/
```

### 2. Separation of Concerns

| Layer      | Responsibility                               |
| ---------- | -------------------------------------------- |
| Route      | HTTP routing, call controller                |
| Controller | Parse request, call service, format response |
| Service    | Business logic, validation, orchestration    |
| Repository | Database queries only                        |

### 3. Centralized Error Handling

- Define error codes in ONE place: `shared/utils/error-handler.ts`
- Use `asyncHandler` to catch all errors automatically
- Return consistent error response format

### 4. Validation at the Edge

- Use Zod schemas for request validation
- Validate in controllers before calling services
- Share schemas between client and server when needed

---

## Quick Reference

| Need                    | Location                                        |
| ----------------------- | ----------------------------------------------- |
| Add a new page          | `src/app/[route]/page.tsx`                      |
| Add an API endpoint     | `src/app/api/[route]/route.ts`                  |
| Add shared UI component | `src/components/ui/`                            |
| Add feature-specific UI | `src/features/[feature]/components/`            |
| Add business logic      | `src/server/features/[feature]/`                |
| Add database query      | `src/server/features/[feature]/repository.ts`   |
| Add validation schema   | `src/features/[feature]/schemas/`               |
| Add global type         | `src/shared/types/`                             |
| Add utility function    | `src/shared/utils/` or `src/lib/`               |
| Add React hook          | `src/hooks/` or `src/features/[feature]/hooks/` |

---

## Notes

- **Tailwind v4**: Config in `globals.css` using `@theme` directive
- **Drizzle ORM**: Schema in `server/db/schema.ts`, config in `drizzle.config.ts`
- **Font**: Use `next/font/google` for Poppins (or as specified in SRS)
````
