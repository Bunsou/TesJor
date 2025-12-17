````markdown
# NextJS Full-Stack Structure Template

> **Use this template when asking Claude AI for NextJS full-stack development help**
>
> Simply paste this template into your conversation to help Claude understand your project structure and provide consistent, well-organized code for both frontend and backend.

## Project Structure

```
my-nextjs-app/
├── src/
│   ├── app/                     # NextJS App Router (Pages, Routing & API Routes)
│   │   ├── globals.css         # Global styles & Tailwind v4 configuration
│   │   ├── layout.tsx          # Root layout (required)
│   │   ├── page.tsx           # Home page
│   │   ├── loading.tsx        # Global loading UI
│   │   ├── error.tsx          # Global error UI
│   │   ├── not-found.tsx      # 404 page
│   │   │
│   │   ├── api/               # 🔧 Backend API Routes
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts       # POST /api/auth/login
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts       # POST /api/auth/register
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts       # POST /api/auth/logout
│   │   │   │   └── refresh/
│   │   │   │       └── route.ts       # POST /api/auth/refresh
│   │   │   │
│   │   │   ├── users/
│   │   │   │   ├── route.ts           # GET/POST /api/users
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts       # GET/PUT/DELETE /api/users/[id]
│   │   │   │   │   └── profile/
│   │   │   │   │       └── route.ts   # GET/PUT /api/users/[id]/profile
│   │   │   │   └── me/
│   │   │   │       └── route.ts       # GET /api/users/me
│   │   │   │
│   │   │   ├── products/
│   │   │   │   ├── route.ts           # GET/POST /api/products
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts       # GET/PUT/DELETE /api/products/[id]
│   │   │   │   │   └── reviews/
│   │   │   │   │       └── route.ts   # GET/POST /api/products/[id]/reviews
│   │   │   │   └── search/
│   │   │   │       └── route.ts       # GET /api/products/search
│   │   │   │
│   │   │   └── webhook/
│   │   │       └── polar/
│   │   │           └── route.ts       # POST /api/webhook/polar
│   │   │
│   │   ├── (auth)/            # Route group for auth pages
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── dashboard/         # Dashboard section
│   │   │   ├── layout.tsx     # Dashboard-specific layout
│   │   │   ├── page.tsx       # Dashboard home
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   └── products/          # Products section
│   │       ├── page.tsx       # Products list
│   │       └── [id]/
│   │           └── page.tsx   # Product detail
│   │
│   ├── components/            # Reusable UI Components
│   │   ├── ui/               # Basic UI elements (Atoms)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   └── index.ts      # Barrel exports
│   │   │
│   │   ├── forms/            # Form components (Molecules)
│   │   │   ├── ContactForm.tsx
│   │   │   ├── SearchForm.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   │
│   │   └── common/           # Common reusable components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── SEOHead.tsx
│   │
│   ├── features/             # Feature-based organization
│   │   ├── auth/
│   │   │   ├── components/   # Auth-specific UI components
│   │   │   ├── hooks/        # Auth-related custom hooks
│   │   │   ├── services/     # Auth API calls & business logic
│   │   │   ├── types/        # Auth-specific TypeScript types
│   │   │   └── utils/        # Auth utility functions
│   │   │
│   │   ├── user-profile/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   │
│   │   └── products/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       ├── types/
│   │       └── utils/
│   │
│   ├── lib/                  # Global utilities and configurations
│   │   ├── api/             # API configuration
│   │   │   ├── client.ts    # Main API client (axios/fetch)
│   │   │   ├── endpoints.ts # API endpoints constants
│   │   │   └── types.ts     # Global API types
│   │   │
│   │   ├── auth/            # Global auth utilities
│   │   │   ├── config.ts    # Auth configuration
│   │   │   └── tokens.ts    # Token management
│   │   │
│   │   ├── utils/           # General utility functions
│   │   │   ├── format.ts    # Formatting functions
│   │   │   ├── validation.ts # Validation schemas (Zod)
│   │   │   ├── constants.ts # App-wide constants
│   │   │   └── helpers.ts   # Helper functions
│   │   │
│   │   └── providers/       # React Context providers
│   │       ├── AuthProvider.tsx
│   │       ├── ThemeProvider.tsx
│   │       └── QueryProvider.tsx
│   │
│   ├── hooks/               # Global custom hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useFetch.ts
│   │   └── useToggle.ts
│   │
│   ├── types/               # Global TypeScript definitions
│   │   ├── global.ts        # Global app types
│   │   ├── api.ts          # Shared API types
│   │   └── common.ts       # Common utility types
│   │
│   ├── styles/             # Additional styles (if not using Tailwind only)
│   │   ├── components.css  # Component-specific styles
│   │   └── utilities.css   # Custom utility classes
│   │
│   ├── config/             # Configuration files
│   │   ├── constants.ts    # App constants
│   │   ├── environment.ts  # Environment variables
│   │   └── routes.ts       # Route definitions & navigation
│   │
│   └── server/             # 🔧 Backend-only code
│       ├── db/             # Database configuration & models
│       │   ├── client.ts   # Database client (Drizzle ORM)
│       │   ├── schema.ts   # Database schema (Drizzle)
│       │   └── queries/    # Reusable database queries
│       │       ├── users.ts
│       │       ├── products.ts
│       │       └── index.ts
│       │
│       ├── services/       # Business logic layer
│       │   ├── auth/
│       │   │   ├── auth.service.ts      # Auth business logic
│       │   │   ├── password.service.ts  # Password hashing/validation
│       │   │   └── token.service.ts     # JWT creation/validation
│       │   ├── users/
│       │   │   └── user.service.ts      # User business logic
│       │   ├── products/
│       │   │   └── product.service.ts   # Product business logic
│       │   └── email/
│       │       └── email.service.ts     # Email sending logic
│       │
│       ├── middleware/     # API middleware
│       │   ├── auth.ts     # Authentication middleware
│       │   ├── validation.ts # Request validation middleware
│       │   ├── error-handler.ts # Global error handler
│       │   ├── rate-limit.ts # Rate limiting
│       │   └── cors.ts     # CORS configuration
│       │
│       ├── utils/          # Backend utilities
│       │   ├── api-response.ts # Standardized API responses
│       │   ├── error.ts    # Custom error classes
│       │   ├── logger.ts   # Logging utility
│       │   └── validators.ts # Zod validation schemas
│       │
│       └── types/          # Backend-specific types
│           ├── api.types.ts    # API request/response types
│           ├── db.types.ts     # Database types
│           └── service.types.ts # Service layer types
│
├── drizzle/               # Drizzle ORM
│   ├── migrations/       # Database migrations (generated)
│   └── meta/            # Migration metadata
│
├── public/               # Static assets
│   ├── images/
│   │   ├── logos/
│   │   ├── icons/
│   │   └── backgrounds/
│   ├── favicon.ico
│   └── robots.txt
│
├── .env.local           # Environment variables
├── .env.example        # Environment template
├── drizzle.config.ts   # Drizzle Kit configuration
├── next.config.js      # NextJS configuration
├── tsconfig.json       # TypeScript configuration
├── package.json
└── README.md
```

**Note**: This project uses **Tailwind CSS v4**. Configuration is done directly in `src/app/globals.css` using CSS variables and `@theme` directive, not in a separate config file.

**Note**: This project uses **Drizzle ORM**. Database schema is defined in `src/server/db/schema.ts` and configuration is in `drizzle.config.ts` at the project root.

**Note**: This project uses **Inter font from Google Fonts**. The font is imported using `next/font/google` for automatic optimization and self-hosting.

### Root Layout Example (`src/app/layout.tsx`)

```typescript
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**Key Points:**

- Import `Inter` from `next/font/google` for automatic optimization
- Configure with `subsets`, `variable`, and `display` options
- Apply `inter.variable` to `<html>` tag to make CSS variable available
- Apply `inter.className` to `<body>` tag for direct font application
- The font is automatically self-hosted and optimized by Next.js

---

## Folder Explanations & Usage Guidelines

### 📁 `src/app/` - NextJS App Router

**Purpose**: Handle routing, layouts, page components, and API routes
**What goes here**:

- Page components (`page.tsx`)
- Layout components (`layout.tsx`)
- Loading states (`loading.tsx`)
- Error boundaries (`error.tsx`)
- Route groups using `(auth)` syntax
- **API routes in `api/` folder** (`route.ts` files)

**What NOT to put here**: Business logic, reusable components, utilities (except in API routes)

---

### 📁 `src/app/api/` - Backend API Routes

**Purpose**: Handle HTTP requests and responses for backend functionality
**What goes here**:

- API route handlers (`route.ts`)
- RESTful endpoints (GET, POST, PUT, DELETE)
- Request parsing and validation
- Response formatting
- Thin layer that delegates to services

**What NOT to put here**: Business logic (goes in `src/server/services/`), database queries (goes in `src/server/db/`)

#### API Route Structure Pattern:

```typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/server/middleware/auth";
import { userService } from "@/server/services/users/user.service";
import { apiResponse } from "@/server/utils/api-response";

export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";

    const users = await userService.list({ page: +page });
    return apiResponse.success(users, 200);
  } catch (error) {
    return apiResponse.error(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newUser = await userService.create(body);
    return apiResponse.success(newUser, 201);
  } catch (error) {
    return apiResponse.error(error);
  }
}
```

**API Naming Conventions**:

- RESTful resources: `/api/users`, `/api/products`
- Nested resources: `/api/users/[id]/profile`
- Actions: `/api/auth/login`, `/api/products/search`
- Webhooks: `/api/webhook/polar`

---

### 📁 `src/components/` - Reusable UI Components

**Purpose**: UI components that can be used across multiple features

#### `components/ui/`

- **Basic UI elements** (buttons, inputs, modals, cards)
- **Atomic design**: Smallest reusable pieces
- **Example**: `Button.tsx`, `Input.tsx`, `Modal.tsx`

#### `components/forms/`

- **Complete form components** that combine multiple UI elements
- **Example**: `ContactForm.tsx`, `SearchForm.tsx`

#### `components/layout/`

- **Layout-related components** (headers, footers, navigation)
- **Example**: `Header.tsx`, `Footer.tsx`, `Sidebar.tsx`

#### `components/common/`

- **Utility components** used across the app
- **Example**: `LoadingSpinner.tsx`, `ErrorBoundary.tsx`

---

### 📁 `src/features/` - Feature-based Organization

**Purpose**: Group everything related to a specific business feature

Each feature folder contains:

#### `features/[feature-name]/components/`

- **UI components specific to this feature**
- **Only used within this feature**
- **Example**: `ProfileCard.tsx`, `EditProfileForm.tsx`

#### `features/[feature-name]/hooks/`

- **Custom hooks containing business logic**
- **State management for this feature**
- **Example**: `useUserProfile.ts`, `useAuth.ts`

#### `features/[feature-name]/services/`

- **API calls related to this feature**
- **Functions that communicate with backend**
- **Example**: `auth-api.ts`, `user-profile-api.ts`

#### `features/[feature-name]/types/`

- **TypeScript types specific to this feature**
- **Interface definitions for this domain**
- **Example**: `auth.types.ts`, `user.types.ts`

#### `features/[feature-name]/utils/`

- **Utility functions specific to this feature**
- **Helper functions and validators**
- **Example**: `validation.ts`, `formatters.ts`

---

### 📁 `src/lib/` - Global Utilities & Configuration

**Purpose**: App-wide utilities that aren't feature-specific

#### `lib/api/`

- **API client configuration** (axios/fetch setup)
- **Global API endpoints**
- **API response types**

#### `lib/auth/`

- **Authentication configuration**
- **Token management utilities**
- **Auth-related helpers**

#### `lib/utils/`

- **General utility functions**
- **Formatting functions**
- **Validation schemas**
- **App constants**

#### `lib/providers/`

- **React Context providers**
- **Global state management**
- **Theme and auth providers**

---

### 📁 `src/hooks/` - Global Custom Hooks

**Purpose**: Reusable hooks used across multiple features
**Examples**: `useLocalStorage`, `useDebounce`, `useFetch`, `useToggle`

---

### 📁 `src/types/` - Global TypeScript Types

**Purpose**: Type definitions used across the entire app
**Examples**: Global interfaces, API response types, common utility types

---

### 📁 `src/config/` - Configuration Files

**Purpose**: App configuration and constants
**Examples**: Environment variables, route definitions, app constants

---

### 📁 `src/server/` - Backend-Only Code

**Purpose**: Server-side code that never runs on the client
**What goes here**: Database logic, business logic, middleware, backend utilities

---

### 📁 `src/server/db/` - Database Layer

**Purpose**: Database configuration and data access
**What goes here**:

- Database client setup (`client.ts`)
- Raw database queries (`queries/`)
- Database schema (if using Drizzle)
- Data access layer

**Example**:

```typescript
// src/server/db/client.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(process.env.DATABASE_URL!);
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
```

---

### 📁 `src/server/services/` - Business Logic Layer

**Purpose**: Reusable business logic and data manipulation
**What goes here**:

- Business logic functions
- Data transformation
- Complex operations
- Reusable across multiple API routes

**Example**:

```typescript
// src/server/services/users/user.service.ts
import { eq } from "drizzle-orm";
import { db } from "@/server/db/client";
import { users } from "@/server/db/schema";
import { hashPassword } from "@/server/services/auth/password.service";

export const userService = {
  async list({ page = 1, limit = 10 }) {
    return await db.query.users.findMany({
      limit,
      offset: (page - 1) * limit,
      columns: { id: true, email: true, name: true },
    });
  },

  async create(data: { email: string; password: string; name: string }) {
    const hashedPassword = await hashPassword(data.password);
    const [user] = await db
      .insert(users)
      .values({
        ...data,
        password: hashedPassword,
      })
      .returning();
    return user;
  },

  async findById(id: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    if (!user) throw new NotFoundError("User not found");
    return user;
  },
};
```

---

### 📁 `src/server/middleware/` - API Middleware

**Purpose**: Reusable middleware for API routes
**What goes here**:

- Authentication middleware
- Request validation
- Error handling
- Rate limiting
- CORS configuration

**Example**:

```typescript
// src/server/middleware/auth.ts
import { NextRequest } from "next/server";
import { tokenService } from "@/server/services/auth/token.service";
import { UnauthorizedError } from "@/server/utils/error";

export async function authMiddleware(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("No token provided");
  }

  const user = await tokenService.verify(token);
  return user;
}
```

---

### 📁 `src/server/utils/` - Backend Utilities

**Purpose**: Backend-specific utility functions
**What goes here**:

- API response formatting
- Custom error classes
- Logging utilities
- Validation schemas (Zod)

**Example**:

```typescript
// src/server/utils/api-response.ts
import { NextResponse } from "next/server";

export const apiResponse = {
  success: (data: any, status = 200) => {
    return NextResponse.json({ success: true, data }, { status });
  },

  error: (error: any) => {
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  },
};

// src/server/utils/error.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(401, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message);
  }
}
```

---

### 📁 `drizzle/` - Database Migrations

**Purpose**: Drizzle ORM migrations and metadata
**What goes here**:

- `migrations/` - Generated SQL migration files
- `meta/` - Migration metadata and snapshots

**Note**: These files are auto-generated by `drizzle-kit generate:pg`. You define your schema in `src/server/db/schema.ts` and migrations are created from it.

**Example workflow**:

```bash
# 1. Update schema in src/server/db/schema.ts
# 2. Generate migration
npx drizzle-kit generate:pg

# 3. Apply migration
npx drizzle-kit push:pg

# 4. View database
npx drizzle-kit studio
```

---

## Development Guidelines

### File Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase starting with "use" (`useUserProfile.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: camelCase with `.types.ts` suffix (`user.types.ts`)
- **Frontend Services**: kebab-case with `-api.ts` suffix (`user-profile-api.ts`)
- **Backend Services**: camelCase with `.service.ts` suffix (`user.service.ts`)
- **API Routes**: `route.ts` (NextJS convention)
- **Middleware**: camelCase (`.ts`) (`auth.ts`, `validation.ts`)

### Directory Naming Conventions

- **All directories**: lowercase-with-dashes (kebab-case)
- **Examples:**
  - ✅ GOOD: `auth-wizard/`, `user-profile/`, `product-list/`, `shopping-cart/`
  - ❌ BAD: `AuthWizard/`, `userProfile/`, `ProductList/`, `shopping_cart/`
- **Rationale:** Consistent URL structure, cross-platform compatibility, avoids case-sensitivity issues

### Component Export Conventions

- **Prefer named exports** over default exports for better refactoring and IDE support.
- **Named exports (GOOD):**

  ```tsx
  // UserProfile.tsx
  export function UserProfile() {
    return <div>Profile</div>;
  }

  // Import
  import { UserProfile } from "@/components/UserProfile";
  ```

- **Default exports (ACCEPTABLE for Next.js conventions):**
  - Next.js page files (`page.tsx`)
  - Next.js layout files (`layout.tsx`)
  - Next.js route handlers (`route.ts`)
- **Benefits of named exports:**
  - Better IDE autocomplete and refactoring
  - Easier to track usage across codebase
  - No naming conflicts during import
  - Clearer intention of what's being imported

### Import Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/features/*": ["./src/features/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/server/*": ["./src/server/*"]
    }
  }
}
```

### When to Create a New Feature

Create a new feature folder when you have:

- A distinct business domain (auth, products, users)
- Multiple related components
- Specific business logic and API calls
- Domain-specific types and utilities

### Component Organization Rules

1. **Global components** go in `src/components/`
2. **Feature-specific components** go in `src/features/[feature]/components/`
3. **Page components** only in `src/app/`
4. **Reusable logic** goes in hooks (custom or built-in)

### Backend Organization Rules

1. **API route handlers** go in `src/app/api/[resource]/route.ts`
2. **Business logic** goes in `src/server/services/`
3. **Database queries** go in `src/server/db/queries/`
4. **Middleware** goes in `src/server/middleware/`
5. **Backend utilities** go in `src/server/utils/`
6. **Keep API routes thin** - delegate to services

### Backend Development Guidelines

#### Layer Separation:

- **API Routes** (`src/app/api/`) → Parse requests, call services, format responses
- **Services** (`src/server/services/`) → Business logic and data manipulation
- **Database** (`src/server/db/`) → Data access and queries
- **Middleware** (`src/server/middleware/`) → Reusable request processing

#### Error Handling:

- Use custom error classes (`AppError`, `BadRequestError`, etc.)
- Catch errors in API routes and return standardized responses
- Log unexpected errors for debugging

#### Authentication Flow:

1. Client sends request with JWT token in `Authorization` header
2. API route calls `authMiddleware` to verify token
3. Middleware returns user object or throws error
4. Route proceeds with authenticated user context

#### Data Flow:

```
Client Request → API Route → Middleware → Service → Database
                     ↓           ↓          ↓          ↓
Client Response ← API Route ← Service ← Database Query
```

---

## Example Usage Instructions for Claude

When asking Claude for help, include this context:

> "I'm using the NextJS Full-Stack structure template above. Please help me create [specific request] following this organization pattern. Make sure to place files in the correct folders and follow the naming conventions for both frontend and backend."

**Frontend Examples**:

- "Create a user authentication feature with login form, hooks, and API client calls"
- "Add a products listing page with components and data fetching"
- "Create a reusable modal component for the UI library"

**Backend Examples**:

- "Create API endpoints for user CRUD operations with authentication"
- "Add a product service with database queries and business logic"
- "Implement authentication middleware with JWT token verification"

**Full-Stack Examples**:

- "Build a complete authentication system with login/register pages and API routes"
- "Create a products feature with listing page, detail page, and CRUD API endpoints"
- "Add a user profile feature with frontend components and backend API"
````
