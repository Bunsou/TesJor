## File Structure

```
Nextjs-Template/
└── src
    ├── app
    │   ├── (auth)
    │   │   ├── login
    │   │   │   └── page.tsx
    │   │   └── register
    │   │       └── page.tsx
    │   ├── (marketing)
    │   │   ├── landing
    │   │   │   └── page.tsx
    │   │   └── pricing
    │   │       └── page.tsx
    │   ├── api
    │   │   ├── auth
    │   │   │   └── [...nextauth]
    │   │   │       └── route.ts
    │   │   ├── posts
    │   │   │   ├── [id]
    │   │   │   │   └── route.ts
    │   │   │   └── route.ts
    │   │   └── users
    │   │       ├── [id]
    │   │       │   └── route.ts
    │   │       └── route.ts
    │   ├── dashboard
    │   │   ├── settings
    │   │   │   └── page.tsx
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components
    │   ├── layout
    │   │   ├── Footer.tsx
    │   │   └── Header.tsx
    │   └── ui
    │       ├── accordion.tsx
    │       ├── Button.tsx
    │       ├── dialog.tsx
    │       ├── field.tsx
    │       ├── form.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── separator.tsx
    │       ├── sonner.tsx
    │       └── table.tsx
    ├── features
    │   ├── posts
    │   │   ├── components
    │   │   │   ├── AddPostButton.tsx
    │   │   │   ├── DeletePostButton.tsx
    │   │   │   ├── PostForm.tsx
    │   │   │   ├── PostsTable.tsx
    │   │   │   └── UpdatePostButton.tsx
    │   │   └── schemas
    │   │       ├── index.ts
    │   │       └── post.schemas.ts
    │   └── users
    │       ├── components
    │       │   ├── AddUserButton.tsx
    │       │   ├── DeleteUserButton.tsx
    │       │   ├── UpdateUserButton.tsx
    │       │   ├── UserForm.tsx
    │       │   └── UsersTable.tsx
    │       └── schemas
    │           ├── index.ts
    │           └── user.schemas.ts
    ├── lib
    │   ├── cloudinary
    │   │   ├── index.ts
    │   │   └── upload.ts
    │   └── utils.ts
    ├── server
    │   ├── db
    │   │   ├── migrations
    │   │   │   ├── meta
    │   │   │   │   ├── _journal.json
    │   │   │   │   └── 0000_snapshot.json
    │   │   │   └── 0000_fair_quicksilver.sql
    │   │   ├── schema
    │   │   │   ├── index.ts
    │   │   │   ├── posts.ts
    │   │   │   └── users.ts
    │   │   └── drizzle.ts
    │   ├── middleware
    │   │   ├── async-handler.ts
    │   │   └── index.ts
    │   └── services
    │       ├── posts
    │       │   └── post.service.ts
    │       └── users
    │           └── user.service.ts
    └── shared
        ├── config
        │   ├── cloudinary.config.ts
        │   └── config.ts
        ├── middleware
        │   ├── error-handler.ts
        │   ├── index.ts
        │   └── validator.ts
        ├── types
        │   ├── api.types.ts
        │   ├── auth.types.ts
        │   └── index.ts
        ├── utils
        │   ├── error-handler.ts
        │   ├── index.ts
        │   ├── logger.ts
        │   └── response-handler.ts
        └── index.ts
```

### `src/app/(auth)/login/page.tsx`

```typescript

```

### `src/app/(auth)/register/page.tsx`

```typescript

```

### `src/app/(marketing)/landing/page.tsx`

```typescript

```

### `src/app/(marketing)/pricing/page.tsx`

```typescript

```

### `src/app/api/auth/[...nextauth]/route.ts`

```typescript
// depend on the auth we used in the project
```

### `src/app/api/posts/[id]/route.ts`

```typescript
// Path: src/app/api/posts/[id]/route.ts
// Single post API route - Demonstrates param validation

import { NextRequest } from "next/server";
import { asyncHandler, RouteContext } from "@/server/middleware/async-handler";
import { sendSuccessResponse, AppError } from "@/shared/utils";
import { validateRequestParams } from "@/shared/middleware/validator";
import { postIdParamSchema } from "@/features/posts/schemas";
import {
  getPostById,
  updatePost,
  deletePost,
} from "@/server/services/posts/post.service";

/**
 * GET /api/posts/[id]
 * Retrieves a single post by ID
 */
export const GET = asyncHandler<{ id: string }>(
  async (req: NextRequest, context?: RouteContext<{ id: string }>) => {
    // Get and validate params
    const params = await context?.params;
    const { id } = validateRequestParams(postIdParamSchema, params);

    // Fetch post from database
    const post = await getPostById(id);

    // Handle not found case
    if (!post) {
      throw new AppError("POST_NOT_FOUND");
    }

    return sendSuccessResponse(post, "Post retrieved successfully");
  }
);

/**
 * PATCH /api/posts/[id]
 * Updates a post by ID with optional image upload
 */
export const PATCH = asyncHandler<{ id: string }>(
  async (req: NextRequest, context?: RouteContext<{ id: string }>) => {
    // Get and validate params
    const params = await context?.params;
    const { id } = validateRequestParams(postIdParamSchema, params);

    // Check if post exists
    const existingPost = await getPostById(id);
    if (!existingPost) {
      throw new AppError("POST_NOT_FOUND");
    }

    const formData = await req.formData();

    // Delegate to service layer which handles validation, image upload, and database operations
    const result = await updatePost(id, formData);

    if (!result.success) {
      throw new AppError("VALIDATION_ERROR", result.error);
    }

    return sendSuccessResponse(result.data, "Post updated successfully");
  }
);

/**
 * DELETE /api/posts/[id]
 * Deletes a post by ID (also deletes associated image from Cloudinary)
 */
export const DELETE = asyncHandler<{ id: string }>(
  async (req: NextRequest, context?: RouteContext<{ id: string }>) => {
    // Get and validate params
    const params = await context?.params;
    const { id } = validateRequestParams(postIdParamSchema, params);

    // Check if post exists
    const existingPost = await getPostById(id);
    if (!existingPost) {
      throw new AppError("POST_NOT_FOUND");
    }

    // Delete post (service handles image deletion)
    await deletePost(id);

    return sendSuccessResponse(null, "Post deleted successfully");
  }
);
```

### `src/app/api/posts/route.ts`

```typescript
// Path: src/app/api/posts/route.ts
// Posts API route - Demonstrates the boilerplate patterns

import { NextRequest } from "next/server";
import { asyncHandler } from "@/server/middleware/async-handler";
import { sendSuccessResponse, AppError } from "@/shared/utils";
import { validateRequestQuery } from "@/shared/middleware/validator";
import { postListQuerySchema } from "@/features/posts/schemas";
import { getPosts, createPost } from "@/server/services/posts/post.service";

/**
 * GET /api/posts
 * Retrieves all posts with optional query parameters
 */
export const GET = asyncHandler(async (req: NextRequest) => {
  // Validate query parameters
  // Example: Use query.page, query.limit for pagination
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const query = validateRequestQuery(postListQuerySchema, req);

  // Fetch posts from database
  // TODO: Implement filtering/pagination using query params
  const posts = await getPosts();

  // Return standardized success response
  return sendSuccessResponse(posts, "Posts retrieved successfully", 200, {
    total: posts.length,
  });
});

/**
 * POST /api/posts
 * Creates a new post with optional image upload
 */
export const POST = asyncHandler(async (req: NextRequest) => {
  const formData = await req.formData();

  // Delegate to service layer which handles validation, image upload, and database operations
  const result = await createPost(formData);

  if (!result.success) {
    throw new AppError("VALIDATION_ERROR", result.error);
  }

  return sendSuccessResponse(result.data, "Post created successfully", 201);
});
```

### `src/app/api/users/[id]/route.ts`

```typescript
// Path: src/app/api/users/[id]/route.ts
// Single user API route - Demonstrates param validation

import { NextRequest } from "next/server";
import { asyncHandler, RouteContext } from "@/server/middleware/async-handler";
import { sendSuccessResponse, AppError } from "@/shared/utils";
import {
  validateRequestBody,
  validateRequestParams,
} from "@/shared/middleware/validator";
import { userIdParamSchema, updateUserSchema } from "@/features/users/schemas";
import {
  getUserById,
  updateUser,
  deleteUser,
} from "@/server/services/users/user.service";

/**
 * GET /api/users/[id]
 * Retrieves a single user by ID
 */
export const GET = asyncHandler<{ id: string }>(
  async (req: NextRequest, context?: RouteContext<{ id: string }>) => {
    // Get and validate params
    const params = await context?.params;
    const { id } = validateRequestParams(userIdParamSchema, params);

    // Fetch user from database
    const user = await getUserById(id);

    // Handle not found case
    if (!user) {
      throw new AppError("USER_NOT_FOUND");
    }

    return sendSuccessResponse(user, "User retrieved successfully");
  }
);

/**
 * PATCH /api/users/[id]
 * Updates a user by ID
 */
export const PATCH = asyncHandler<{ id: string }>(
  async (req: NextRequest, context?: RouteContext<{ id: string }>) => {
    // Get and validate params
    const params = await context?.params;
    const { id } = validateRequestParams(userIdParamSchema, params);

    // Validate request body
    const body = await validateRequestBody(updateUserSchema, req);

    // Check if user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      throw new AppError("USER_NOT_FOUND");
    }

    // Update user
    const updatedUser = await updateUser(id, body);

    return sendSuccessResponse(updatedUser, "User updated successfully");
  }
);

/**
 * DELETE /api/users/[id]
 * Deletes a user by ID
 */
export const DELETE = asyncHandler<{ id: string }>(
  async (req: NextRequest, context?: RouteContext<{ id: string }>) => {
    // Get and validate params
    const params = await context?.params;
    const { id } = validateRequestParams(userIdParamSchema, params);

    // Check if user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      throw new AppError("USER_NOT_FOUND");
    }

    // Delete user
    await deleteUser(id);

    return sendSuccessResponse(null, "User deleted successfully");
  }
);
```

### `src/app/api/users/route.ts`

```typescript
// Path: src/app/api/users/route.ts
// Users API route - Demonstrates the boilerplate patterns

import { NextRequest } from "next/server";
import { asyncHandler } from "@/server/middleware/async-handler";
import { sendSuccessResponse } from "@/shared/utils";
import {
  validateRequestBody,
  validateRequestQuery,
} from "@/shared/middleware/validator";
import {
  createUserSchema,
  userListQuerySchema,
} from "@/features/users/schemas";
import { getUsers, createUser } from "@/server/services/users/user.service";

/**
 * GET /api/users
 * Retrieves all users with optional query parameters
 */
export const GET = asyncHandler(async (req: NextRequest) => {
  // Validate query parameters
  // Example: Use query.page, query.limit for pagination
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const query = validateRequestQuery(userListQuerySchema, req);

  // Fetch users from database
  // TODO: Implement filtering/pagination using query params
  const users = await getUsers();

  // Return standardized success response
  return sendSuccessResponse(users, "Users retrieved successfully", 200, {
    total: users.length,
  });
});

/**
 * POST /api/users
 * Creates a new user
 */
export const POST = asyncHandler(async (req: NextRequest) => {
  // Validate request body against schema
  const body = await validateRequestBody(createUserSchema, req);

  // Create the user
  const newUser = await createUser(body);

  // Return standardized success response with 201 Created
  return sendSuccessResponse(newUser, "User created successfully", 201);
});
```

### `src/app/dashboard/layout.tsx`

```typescript

```

### `src/app/dashboard/page.tsx`

```typescript

```

### `src/app/dashboard/settings/page.tsx`

```typescript

```

### `src/app/globals.css`

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  /* Base colors - Light Mode */

  /* Accent - Blue for light mode */
  --primary: oklch(0.205 0 0);
  --primary-dark: oklch(0.2881 0.1436 272.76);
  --primary-foreground: oklch(0.985 0 0);

  /* Secondary colors */
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);

  /* Semantic colors */
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.997 0 0);
  --warning: oklch(0.924 0.194454 103.2263);
  --warning-foreground: oklch(0.0672 0 0);
  --success: oklch(0.6055 0.1611 131.03);
  --success-foreground: oklch(0.997 0 0);

  /* UI Elements */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);

  /* Chart colors - Blue theme */
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);

  /* Sidebar */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);

  /* Legacy custom colors - mapped to new system */
  --color-blue: var(--primary);
  --color-light-100: var(--foreground);
  --color-light-200: var(--muted-foreground);
  --color-border-dark: var(--border);
  --color-dark-100: var(--secondary);
  --color-dark-200: var(--muted);

  /* Radius */
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
}

.dark {
  /* Base colors - Dark Mode */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);

  /* Accent - Purple for dark mode */
  --primary: oklch(0.922 0 0);
  --primary-dark: oklch(0.4026 0.215 294.09);
  --primary-foreground: oklch(0.205 0 0);

  /* Secondary colors */
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);

  /* UI Elements */
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);

  /* Chart colors - Purple theme */
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);

  /* Sidebar */
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);

  /* Legacy custom colors - mapped to new system */
  --color-blue: var(--primary);
  --color-light-100: var(--foreground);
  --color-light-200: var(--muted-foreground);
  --color-border-dark: var(--border);
  --color-dark-100: var(--secondary);
  --color-dark-200: var(--muted);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --ring: oklch(0.556 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-ring: oklch(0.556 0 0);
}

@theme inline {
  /* Base colors */
  --color-background: var(--background);
  --color-foreground: var(--foreground);

  /* Primary colors */
  --color-primary: var(--primary);
  --color-primary-dark: var(--primary-dark);
  --color-primary-foreground: var(--primary-foreground);

  /* Secondary colors */
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);

  /* Semantic colors */
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);

  /* UI elements */
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Chart colors */
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  /* Sidebar */
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* Legacy custom colors */
  --color-blue: var(--color-blue);
  --color-light-100: var(--color-light-100);
  --color-light-200: var(--color-light-200);
  --color-border-dark: var(--color-border-dark);
  --color-dark-100: var(--color-dark-100);
  --color-dark-200: var(--color-dark-200);

  /* Fonts */
  --font-poppins: var(--font-poppins);

  /* Radius */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
}

@utility flex-center {
  @apply flex items-center justify-center;
}

@utility text-gradient {
  @apply bg-linear-to-b from-foreground via-foreground to-primary bg-clip-text font-semibold text-transparent;
}

@utility glass {
  @apply bg-background/20 dark:bg-background/10 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md border-foreground/10 border;
}

@utility card-shadow {
  box-shadow: 0px 4px 40px 0px oklch(0.0672 0 0 / 0.4);
}

.dark .card-shadow {
  box-shadow: 0px 4px 40px 0px oklch(0.997 0 0 / 0.1);
}

@layer base {
  /* 
  Base Styles (@layer base)
    - Global resets and HTML element styling
    - Applies to all <body>, <main>, <h1>, etc.
  */
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground relative;
    background: linear-gradient(
      135deg,
      oklch(0.997 0 0) 0%,
      oklch(0.997 0.04 280) 50%,
      oklch(0.997 0 0) 100%
    );
  }

  .dark body {
    background: linear-gradient(
      135deg,
      oklch(0.0672 0 0) 0%,
      oklch(0.15 0.08 280) 50%,
      oklch(0.0672 0 0) 100%
    );
  }

  main {
    @apply mx-auto flex flex-col py-6 sm:py-8 md:py-10 w-full max-w-[calc(100%-4rem)] md:max-w-7xl; /* max-w-3xl = max-w-[764px] */
  }

  h1 {
    @apply text-primary text-3xl sm:text-4xl md:text-6xl font-semibold;
  }

  h3 {
    @apply text-2xl font-bold;
  }

  ul {
    @apply list-disc list-inside;
  }
}

@layer components {
  /* 
  Component Styles (@layer components)
    - Reusable component classes like #explore-btn
    - Scoped styles for specific UI elements
  */
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### `src/app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Next.js Template",
  description:
    "A starter template for Next.js projects with Tailwind CSS and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}  antialiased`}>
        <main className="font-poppins">
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
```

### `src/app/page.tsx`

```typescript
import AddPostButton from "@/features/posts/components/AddPostButton";
import PostsTable from "@/features/posts/components/PostsTable";
import AddUserButton from "@/features/users/components/AddUserButton";
import UsersTable from "@/features/users/components/UsersTable";

const page = async () => {
  return (
    <div className="">
      <div className="mb-4">
        <h1>Users</h1>
        <div className="flex justify-end">
          <AddUserButton />
        </div>

        <UsersTable />
      </div>
      <div>
        <h1>Posts</h1>
        <div className="flex justify-end">
          <AddPostButton />
        </div>

        <PostsTable />
      </div>
    </div>
  );
};

export default page;
```

### `src/components/layout/Footer.tsx`

```typescript

```

### `src/components/layout/Header.tsx`

```typescript

```

### `src/components/ui/Button.tsx`

```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

### `src/components/ui/accordion.tsx`

```typescript
"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
```

### `src/components/ui/dialog.tsx`

```typescript
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
```

### `src/components/ui/field.tsx`

```typescript
"use client";

import { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:text-sm",
        className
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        className
      )}
      {...props}
    />
  );
}

const fieldVariants = cva(
  "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
        responsive: [
          "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
);

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
        className
      )}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
        className
      )}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-destructive text-sm font-normal", className)}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};
```

### `src/components/ui/form.tsx`

```typescript
"use client";

import * as React from "react";
import type * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
```

### `src/components/ui/input.tsx`

```typescript
import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
```

### `src/components/ui/label.tsx`

```typescript
"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Label };
```

### `src/components/ui/separator.tsx`

```typescript
"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
```

### `src/components/ui/sonner.tsx`

```typescript
"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
```

### `src/components/ui/table.tsx`

```typescript
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
```

### `src/features/posts/components/AddPostButton.tsx`

```typescript
"use client";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { PostForm } from "./PostForm";
import { useState } from "react";

const AddPostDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <form>
          <DialogTrigger asChild>
            <Button variant="outline">
              Add Post <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Post</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new post to your account.
              </DialogDescription>
            </DialogHeader>

            <PostForm closeDialog={() => setIsOpen(false)} />
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default AddPostDialog;
```

### `src/features/posts/components/DeletePostButton.tsx`

```typescript
"use client";

import { Button } from "@/components/ui/Button";
import { Loader, Trash } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deletePost } from "@/server/services/posts/post.service";

interface DeletePostButtonProps {
  postId: string;
}

const DeletePostButton = ({ postId }: DeletePostButtonProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (postId: string) => async () => {
    setIsLoading(true);
    try {
      const result = await deletePost(postId);
      console.log(result);

      if (!result) {
        throw new Error("Failed to delete post.");
      }

      toast.success("Post deleted successfully!");

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete post."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Trash className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            post.
          </DialogDescription>

          <Button
            variant="destructive"
            onClick={handleDelete(postId)}
            disabled={isLoading}
          >
            {isLoading ? <Loader className="size-4 animate-spin" /> : "Delete"}
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePostButton;
```

### `src/features/posts/components/PostForm.tsx`

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SelectPost } from "@/server/db/schema";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { createPost, updatePost } from "@/server/services/posts/post.service";

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(5, {
    message: "Content must be at least 5 characters.",
  }),
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine(
      (file) =>
        [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "image/gif",
        ].includes(file.type),
      "Only .jpg, .jpeg, .png, .webp and .gif formats are supported"
    )
    .optional()
    .nullable(),
});

interface PostFormProps {
  post?: SelectPost;
  closeDialog: () => void;
}

export const PostForm = ({ post, closeDialog }: PostFormProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    post?.imageUrl || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      image: null,
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (
        ![
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "image/gif",
        ].includes(file.type)
      ) {
        toast.error(
          "Only .jpg, .jpeg, .png, .webp and .gif formats are supported"
        );
        return;
      }

      setSelectedFile(file);
      setRemoveExistingImage(false);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setRemoveExistingImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit handler using server actions
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (removeExistingImage) {
        formData.append("removeImage", "true");
      }

      // Call service function directly
      const result = post
        ? await updatePost(post.id, formData)
        : await createPost(formData);

      if (!result.success) {
        throw new Error(result.error || "Failed to save post");
      }

      toast.success(`Post ${post ? "updated" : "created"} successfully!`);
      form.reset();
      router.refresh();
      closeDialog();
    } catch (error) {
      console.error(`Error ${post ? "updating" : "creating"} post:`, error);
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${post ? "update" : "add"} post. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter post title" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input placeholder="Enter post content" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload Field */}
        <FormItem>
          <FormLabel>Image (Optional)</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Upload Button */}
              {!imagePreview && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Upload className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WEBP, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Change Image Button */}
              {imagePreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Change Image
                </Button>
              )}
            </div>
          </FormControl>
          <FormDescription>
            Upload an image for your post (max 5MB)
          </FormDescription>
          <FormMessage />
        </FormItem>

        <Button disabled={isLoading} type="submit" className="w-full">
          {post
            ? isLoading
              ? "Updating..."
              : "Update Post"
            : isLoading
            ? "Creating..."
            : "Create Post"}
        </Button>
      </form>
    </Form>
  );
};
```

### `src/features/posts/components/PostsTable.tsx`

```typescript
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SelectPost } from "@/server/db/schema";
import DeletePostButton from "./DeletePostButton";
import UpdatePostButton from "./UpdatePostButton";
import { getPosts } from "@/server/services/posts/post.service";
import { ImageIcon } from "lucide-react";

const PostsTable = async () => {
  const posts = await getPosts();
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent posts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead className="w-40">Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post: SelectPost) => (
            <TableRow key={post.id}>
              <TableCell>
                {post.imageUrl ? (
                  <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell className="max-w-xs truncate">
                {post.content}
              </TableCell>
              <TableCell>{post.userId || "Anonymous"}</TableCell>
              <TableCell>{post.createdAt.toLocaleString()}</TableCell>
              <TableCell>{post.updatedAt.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <UpdatePostButton post={post} />
                <DeletePostButton postId={post.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </div>
  );
};

export default PostsTable;
```

### `src/features/posts/components/UpdatePostButton.tsx`

```typescript
"use client";

import { Button } from "@/components/ui/Button";
import { Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { PostForm } from "./PostForm";
import { SelectPost } from "@/server/db/schema";

interface EditPostButtonProps {
  post: SelectPost;
}

const EditPostButton = ({ post }: EditPostButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Post</DialogTitle>
          <DialogDescription>
            Fill in the details below to update the post in your account.
          </DialogDescription>

          <PostForm post={post} closeDialog={() => setIsOpen(false)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostButton;
```

### `src/features/posts/schemas/index.ts`

```typescript
// Path: src/features/posts/schemas/index.ts
// Barrel export for post schemas

export {
  createPostSchema,
  updatePostSchema,
  postIdParamSchema,
  postListQuerySchema,
  postResponseSchema,
  type CreatePostRequest,
  type UpdatePostRequest,
  type PostIdParams,
  type PostListQuery,
  type PostResponse,
} from "./post.schemas";
```

### `src/features/posts/schemas/post.schemas.ts`

```typescript
// Path: src/features/posts/schemas/post.schemas.ts
// Zod validation schemas for post-related operations

import { z } from "zod";
import { CLOUDINARY_CONFIG } from "@/shared/config/cloudinary.config";

// --- Reusable Field Schemas ---
const uuidSchema = z.string().uuid("Invalid ID format");

const titleSchema = z
  .string()
  .min(3, "Title must be at least 3 characters")
  .max(200, "Title must be at most 200 characters")
  .trim();

const contentSchema = z
  .string()
  .min(10, "Content must be at least 10 characters")
  .max(50000, "Content must be at most 50000 characters");

const imageUrlSchema = z
  .string()
  .url("Invalid image URL")
  .optional()
  .nullable();

const imagePublicIdSchema = z.string().optional().nullable();

// --- Request Schemas ---

/**
 * Schema for creating a new post
 */
export const createPostSchema = z.object({
  title: titleSchema,
  content: contentSchema,
  userId: uuidSchema.optional().nullable(),
  imageUrl: imageUrlSchema,
  imagePublicId: imagePublicIdSchema,
});

/**
 * Schema for updating an existing post
 */
export const updatePostSchema = z.object({
  title: titleSchema.optional(),
  content: contentSchema.optional(),
  userId: uuidSchema.optional().nullable(),
  imageUrl: imageUrlSchema,
  imagePublicId: imagePublicIdSchema,
});

/**
 * Schema for post ID parameter
 */
export const postIdParamSchema = z.object({
  id: uuidSchema,
});

/**
 * Schema for post list query parameters
 */
export const postListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  userId: uuidSchema.optional(),
  search: z.string().optional(),
  sortBy: z.enum(["title", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// --- Type Exports ---
export type CreatePostRequest = z.infer<typeof createPostSchema>;
export type UpdatePostRequest = z.infer<typeof updatePostSchema>;
export type PostIdParams = z.infer<typeof postIdParamSchema>;
export type PostListQuery = z.infer<typeof postListQuerySchema>;

// --- Response Schemas (for documentation/validation) ---
export const postResponseSchema = z.object({
  id: uuidSchema,
  title: titleSchema,
  content: contentSchema,
  imageUrl: imageUrlSchema,
  imagePublicId: imagePublicIdSchema,
  userId: uuidSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type PostResponse = z.infer<typeof postResponseSchema>;
```

### `src/features/users/components/AddUserButton.tsx`

```typescript
"use client";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { UserForm } from "./UserForm";
import { useState } from "react";

const AddUserButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <form>
          <DialogTrigger asChild>
            <Button variant="outline">
              Add User <UserPlus />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new user to your account.
              </DialogDescription>
            </DialogHeader>

            <UserForm closeDialog={() => setIsOpen(false)} />
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default AddUserButton;
```

### `src/features/users/components/DeleteUserButton.tsx`

```typescript
"use client";

import { Button } from "@/components/ui/Button";
import { Loader, Trash } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteUser } from "@/server/services/users/user.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteUserButtonProps {
  userId: string;
}

const DeleteUserButton = ({ userId }: DeleteUserButtonProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (userId: string) => async () => {
    setIsLoading(true);
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully!");

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Trash className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>

          <Button
            variant="destructive"
            onClick={handleDelete(userId)}
            disabled={isLoading}
          >
            {isLoading ? <Loader className="size-4 animate-spin" /> : "Delete"}
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserButton;
```

### `src/features/users/components/UpdateUserButton.tsx`

```typescript
"use client";

import { Button } from "@/components/ui/Button";
import { Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { UserForm } from "./UserForm";
import { SelectUser } from "@/server/db/schema";

interface UpdateUserButtonProps {
  user: SelectUser;
}

const UpdateUserButton = ({ user }: UpdateUserButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>
            Fill in the details below to update the user in your account.
          </DialogDescription>

          <UserForm user={user} closeDialog={() => setIsOpen(false)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserButton;
```

### `src/features/users/components/UserForm.tsx`

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createUser, updateUser } from "@/server/services/users/user.service";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SelectUser } from "@/server/db/schema";

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.email(),
  age: z.coerce.number().min(0).max(120),
});

interface UserFormProps {
  user?: SelectUser;
  closeDialog: () => void;
}

export const UserForm = ({ user, closeDialog }: UserFormProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      age: user?.age || 0,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      if (user) {
        const updatedUserData = values;
        await updateUser(user.id, updatedUserData);
        toast.success("User updated successfully!");
      } else {
        const userData = {
          ...values,
          password: "password123", // Default password for new users (don't want to deal with passwords here)
        };
        await createUser(userData);

        form.reset();
        toast.success("User added successfully!");
      }
      router.refresh();
      closeDialog();
    } catch (error) {
      console.error(`Error ${user ? "updating" : "creating"} user:`, error);
      toast.error(
        `Failed to ${user ? "update" : "add"} user. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Bruce Wayne" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="bruce@wayne.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  placeholder="30"
                  type="number"
                  {...field}
                  value={(field.value as number) ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit">
          {user
            ? isLoading
              ? "Updating..."
              : "Update User"
            : isLoading
            ? "Adding..."
            : "Add User"}
        </Button>
      </form>
    </Form>
  );
};
```

### `src/features/users/components/UsersTable.tsx`

```typescript
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SelectUser } from "@/server/db/schema";
import { getUsers } from "@/server/services/users/user.service";
import DeleteUserButton from "./DeleteUserButton";
import UpdateUserButton from "./UpdateUserButton";

const UsersTable = async () => {
  const users = await getUsers();
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: SelectUser) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.age}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.createdAt.toLocaleString()}</TableCell>
              <TableCell>{user.updatedAt.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <UpdateUserButton user={user} />
                <DeleteUserButton userId={user.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </div>
  );
};

export default UsersTable;
```

### `src/features/users/schemas/index.ts`

```typescript
// Path: src/features/users/schemas/index.ts
// Barrel export for user schemas

export {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  userListQuerySchema,
  userResponseSchema,
  type CreateUserRequest,
  type UpdateUserRequest,
  type UserIdParams,
  type UserListQuery,
  type UserResponse,
} from "./user.schemas";
```

### `src/features/users/schemas/user.schemas.ts`

```typescript
// Path: src/features/users/schemas/user.schemas.ts
// Zod validation schemas for user-related operations

import { z } from "zod";

// --- Reusable Field Schemas ---
const emailSchema = z
  .string()
  .email("Invalid email format")
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be at most 100 characters")
  .trim();

const uuidSchema = z.string().uuid("Invalid ID format");

// --- Request Schemas ---

/**
 * Schema for creating a new user
 */
export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  age: z.coerce.number().int().positive("Age must be a positive number"),
});

/**
 * Schema for updating an existing user
 */
export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  age: z.coerce
    .number()
    .int()
    .positive("Age must be a positive number")
    .optional(),
});

/**
 * Schema for user ID parameter
 */
export const userIdParamSchema = z.object({
  id: uuidSchema,
});

/**
 * Schema for user list query parameters
 */
export const userListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.enum(["name", "email", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// --- Type Exports ---
export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type UserIdParams = z.infer<typeof userIdParamSchema>;
export type UserListQuery = z.infer<typeof userListQuerySchema>;

// --- Response Schemas (for documentation/validation) ---
export const userResponseSchema = z.object({
  id: uuidSchema,
  name: nameSchema,
  email: emailSchema,
  age: z.number().int().positive(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
```

### `src/lib/cloudinary/index.ts`

```typescript
// Path: src/lib/cloudinary/index.ts
// Barrel export for cloudinary utilities

export {
  uploadImage,
  deleteImage,
  type CloudinaryUploadResult,
  type UploadOptions,
} from "./upload";

export {
  cloudinary,
  CLOUDINARY_CONFIG,
} from "@/shared/config/cloudinary.config";
```

### `src/lib/cloudinary/upload.ts`

```typescript
// Path: src/lib/cloudinary/upload.ts
// Cloudinary upload helper functions

import {
  cloudinary,
  CLOUDINARY_CONFIG,
} from "@/shared/config/cloudinary.config";
import { AppError } from "@/shared/utils/error-handler";
import { Logger } from "@/shared/utils/logger";
import { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

/**
 * Upload result interface
 */
export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
}

/**
 * Upload options interface
 */
export interface UploadOptions {
  folder?: string;
}

/**
 * Validates file size
 * @param file - File to validate
 * @throws {AppError} If file size exceeds maximum allowed size
 */
function validateFileSize(file: File): void {
  if (file.size > CLOUDINARY_CONFIG.MAX_FILE_SIZE) {
    const maxSizeMB = CLOUDINARY_CONFIG.MAX_FILE_SIZE / (1024 * 1024);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new AppError(
      "FILE_TOO_LARGE",
      `Image size (${fileSizeMB}MB) exceeds the maximum allowed size of ${maxSizeMB}MB. Please choose a smaller image.`
    );
  }
}

/**
 * Validates file format
 * @param file - File to validate
 * @throws {AppError} If file format is not allowed
 */
function validateFileFormat(file: File): void {
  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
  const fileType = file.type.split("/")[1]?.toLowerCase() || "";

  if (
    !CLOUDINARY_CONFIG.ALLOWED_FORMATS.includes(fileExtension as never) &&
    !CLOUDINARY_CONFIG.ALLOWED_FORMATS.includes(fileType as never)
  ) {
    throw new AppError(
      "INVALID_FILE_TYPE",
      `Unsupported file format (.${fileExtension}). Please upload one of the following formats: ${CLOUDINARY_CONFIG.ALLOWED_FORMATS.join(
        ", "
      )}`
    );
  }
}

/**
 * Converts File to Buffer for upload
 * @param file - File to convert
 * @returns Promise<Buffer> File buffer
 */
async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Uploads an image to Cloudinary using upload_stream
 * @param file - File object to upload
 * @param options - Upload options
 * @returns Promise<CloudinaryUploadResult> Upload result
 * @throws {AppError} If upload fails or validation fails
 */
export async function uploadImage(
  file: File,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  try {
    // Validate file
    validateFileSize(file);
    validateFileFormat(file);

    // Convert file to buffer
    const buffer = await fileToBuffer(file);

    // Set upload options
    const uploadOptions = {
      folder: options.folder || CLOUDINARY_CONFIG.FOLDERS.POSTS,
    };

    Logger.info("Uploading image to Cloudinary", {
      folder: uploadOptions.folder,
      fileName: file.name,
      fileSize: file.size,
    });

    // Upload to Cloudinary using upload_stream
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            Logger.error("Cloudinary upload failed", {
              error: error.message,
              fileName: file.name,
            });
            return reject(
              new AppError(
                "UPLOAD_FAILED",
                error.message || "Failed to upload image"
              )
            );
          }
          if (result) {
            resolve(result);
          } else {
            reject(
              new AppError(
                "UPLOAD_FAILED",
                "Cloudinary did not return a result"
              )
            );
          }
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      const readableStream = Readable.from(buffer);
      readableStream.pipe(uploadStream);
    });

    Logger.info("Image uploaded successfully", {
      publicId: result.public_id,
      url: result.secure_url,
    });

    // Return formatted result
    return {
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    Logger.error("Error uploading image", {
      error: error instanceof Error ? error.message : "Unknown error",
      fileName: file.name,
    });
    throw new AppError(
      "UPLOAD_FAILED",
      error instanceof Error ? error.message : "Failed to upload image"
    );
  }
}

/**
 * Deletes an image from Cloudinary
 * @param publicId - Public ID of the image to delete
 * @returns Promise<boolean> True if deletion was successful
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    Logger.info("Deleting image from Cloudinary", { publicId });

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      Logger.info("Image deleted successfully", { publicId });
      return true;
    }

    Logger.warn("Image deletion failed", { publicId, result });
    return false;
  } catch (error) {
    Logger.error("Error deleting image", {
      error: error instanceof Error ? error.message : "Unknown error",
      publicId,
    });
    return false; // Don't throw, just return false
  }
}
```

### `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### `src/server/db/drizzle.ts`

```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

### `src/server/db/migrations/0000_fair_quicksilver.sql`

```sql
CREATE TABLE "posts_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"image_url" text,
	"image_public_id" text,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "posts_table" ADD CONSTRAINT "posts_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
```

### `src/server/db/migrations/meta/0000_snapshot.json`

```json
{
  "id": "079352e4-034d-4c66-9a47-be9de4a760f3",
  "prevId": "00000000-0000-0000-0000-000000000000",
  "version": "7",
  "dialect": "postgresql",
  "tables": {
    "public.posts_table": {
      "name": "posts_table",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "title": {
          "name": "title",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "content": {
          "name": "content",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "image_url": {
          "name": "image_url",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "image_public_id": {
          "name": "image_public_id",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "user_id": {
          "name": "user_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        }
      },
      "indexes": {},
      "foreignKeys": {
        "posts_table_user_id_users_table_id_fk": {
          "name": "posts_table_user_id_users_table_id_fk",
          "tableFrom": "posts_table",
          "tableTo": "users_table",
          "columnsFrom": ["user_id"],
          "columnsTo": ["id"],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.users_table": {
      "name": "users_table",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "name": {
          "name": "name",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "age": {
          "name": "age",
          "type": "integer",
          "primaryKey": false,
          "notNull": true
        },
        "email": {
          "name": "email",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "password": {
          "name": "password",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "primaryKey": false,
          "notNull": true
        }
      },
      "indexes": {},
      "foreignKeys": {},
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "users_table_email_unique": {
          "name": "users_table_email_unique",
          "nullsNotDistinct": false,
          "columns": ["email"]
        }
      },
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    }
  },
  "enums": {},
  "schemas": {},
  "sequences": {},
  "roles": {},
  "policies": {},
  "views": {},
  "_meta": {
    "columns": {},
    "schemas": {},
    "tables": {}
  }
}
```

### `src/server/db/migrations/meta/_journal.json`

```json
{
  "version": "7",
  "dialect": "postgresql",
  "entries": [
    {
      "idx": 0,
      "version": "7",
      "when": 1766103525250,
      "tag": "0000_fair_quicksilver",
      "breakpoints": true
    }
  ]
}
```

### `src/server/db/schema/index.ts`

```typescript
export { usersTable } from "./users";
export { postsTable } from "./posts";

export type { InsertUser, SelectUser } from "./users";
export type { InsertPost, SelectPost } from "./posts";
```

### `src/server/db/schema/posts.ts`

```typescript
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const postsTable = pgTable("posts_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  imagePublicId: text("image_public_id"),
  userId: uuid("user_id")
    // .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
```

### `src/server/db/schema/users.ts`

```typescript
import { integer, pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
```

### `src/server/middleware/async-handler.ts`

```typescript
// Path: src/server/middleware/async-handler.ts
// Async handler wrapper for Next.js API routes

import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/shared/middleware/error-handler";
import { Logger } from "@/shared/utils/logger";

/**
 * Type for route context with params (Next.js App Router)
 */
export interface RouteContext<T = Record<string, string>> {
  params: Promise<T>;
}

/**
 * Handler function type for API routes
 */
type AsyncHandler<T = Record<string, string>> = (
  req: NextRequest,
  context?: RouteContext<T>
) => Promise<NextResponse>;

/**
 * Wraps an async API route handler with automatic error handling.
 * Any errors thrown in the handler will be caught and returned as proper error responses.
 *
 * @param handler - The async handler function
 * @returns A wrapped handler with error handling
 *
 * @example
 * // In your API route file (route.ts)
 * import { asyncHandler } from "@/server/middleware/async-handler";
 *
 * export const GET = asyncHandler(async (req, context) => {
 *   const users = await getUsers();
 *   return sendSuccessResponse(users, "Users retrieved");
 * });
 *
 * @example
 * // With typed params
 * export const GET = asyncHandler<{ id: string }>(async (req, context) => {
 *   const params = await context?.params;
 *   const user = await getUserById(params?.id);
 *   return sendSuccessResponse(user, "User retrieved");
 * });
 */
export const asyncHandler = <T = Record<string, string>>(
  handler: AsyncHandler<T>
) => {
  return async (
    req: NextRequest,
    context?: RouteContext<T>
  ): Promise<NextResponse> => {
    const startTime = Date.now();

    try {
      Logger.request(req.method, req.url);

      const response = await handler(req, context);

      const duration = Date.now() - startTime;
      Logger.response(req.method, req.url, response.status, duration);

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      Logger.error(`Request failed: ${req.method} ${req.url}`, {
        duration,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      return handleError(error);
    }
  };
};

/**
 * Creates a typed async handler with predefined param types.
 * Useful for creating reusable handlers for specific route patterns.
 *
 * @example
 * // For routes with an 'id' param
 * const withIdParam = createTypedHandler<{ id: string }>();
 *
 * export const GET = withIdParam(async (req, context) => {
 *   const params = await context?.params;
 *   // params.id is typed as string
 * });
 */
export const createTypedHandler = <T extends Record<string, string>>() => {
  return (handler: AsyncHandler<T>) => asyncHandler<T>(handler);
};

/**
 * Handler for routes with a single 'id' parameter (common pattern)
 */
export const withIdParam = createTypedHandler<{ id: string }>();
```

### `src/server/middleware/index.ts`

```typescript
// Path: src/server/middleware/index.ts
// Barrel export for server middleware

export {
  asyncHandler,
  createTypedHandler,
  withIdParam,
  type RouteContext,
} from "./async-handler";
```

### `src/server/services/posts/post.service.ts`

```typescript
"use server";

import { InsertPost } from "../../db/schema";
import { db } from "../../db/drizzle";
import { postsTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { deleteImage, uploadImage, CLOUDINARY_CONFIG } from "@/lib/cloudinary";
import { Logger } from "@/shared/utils/logger";
import { AppError } from "@/shared/utils/error-handler";
import { revalidatePath } from "next/cache";

export async function getPosts() {
  try {
    const allPosts = await db.select().from(postsTable);
    return allPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

/**
 * Create a new post with optional image upload from FormData
 */
export async function createPost(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const userId = formData.get("userId") as string | null;
    const image = formData.get("image") as File | null;

    // Validate required fields
    if (!title || !content) {
      return {
        success: false,
        error: "Title and content are required",
      };
    }

    // Prepare post data
    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    // Upload image if provided
    if (image && image.size > 0) {
      try {
        const uploadResult = await uploadImage(image, {
          folder: CLOUDINARY_CONFIG.FOLDERS.POSTS,
        });

        imageUrl = uploadResult.secureUrl;
        imagePublicId = uploadResult.publicId;

        Logger.info("Image uploaded successfully", {
          publicId: imagePublicId,
          url: imageUrl,
        });
      } catch (error) {
        Logger.error("Failed to upload image", { error });
        return {
          success: false,
          error:
            error instanceof AppError
              ? error.message
              : "Failed to upload image",
        };
      }
    }

    // Convert empty string userId to null for anonymous posts
    const postData: InsertPost = {
      title,
      content,
      userId: userId && userId.trim() !== "" ? userId : null,
      imageUrl,
      imagePublicId,
    };

    const newPost = await db.insert(postsTable).values(postData).returning();

    // Revalidate the posts page to show the new post
    revalidatePath("/dashboard");

    return {
      success: true,
      data: newPost,
    };
  } catch (error) {
    Logger.error("Failed to create post", { error });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create post",
    };
  }
}

export async function getPostById(id: string) {
  try {
    const post = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, id))
      .limit(1)
      .then((res) => res[0]);
    return post;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw new Error("Failed to fetch post by ID");
  }
}

/**
 * Update an existing post with optional image upload from FormData
 */
export async function updatePost(postId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as File | null;
    const removeImage = formData.get("removeImage") === "true";

    // Validate required fields
    if (!title || !content) {
      return {
        success: false,
        error: "Title and content are required",
      };
    }

    // Get existing post
    const existingPost = await getPostById(postId);
    if (!existingPost) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    let imageUrl: string | null = existingPost.imageUrl;
    let imagePublicId: string | null = existingPost.imagePublicId;

    // Handle image removal
    if (removeImage && existingPost.imagePublicId) {
      try {
        await deleteImage(existingPost.imagePublicId);
        imageUrl = null;
        imagePublicId = null;
        Logger.info("Old image removed", {
          publicId: existingPost.imagePublicId,
        });
      } catch (error) {
        Logger.error("Failed to delete old image", { error });
        // Continue with update even if deletion fails
      }
    }

    // Handle new image upload
    if (image && image.size > 0) {
      // Delete old image if exists
      if (existingPost.imagePublicId) {
        try {
          await deleteImage(existingPost.imagePublicId);
          Logger.info("Old image deleted before upload", {
            publicId: existingPost.imagePublicId,
          });
        } catch (error) {
          Logger.error("Failed to delete old image", { error });
          // Continue with upload even if deletion fails
        }
      }

      // Upload new image
      try {
        const uploadResult = await uploadImage(image, {
          folder: CLOUDINARY_CONFIG.FOLDERS.POSTS,
        });

        imageUrl = uploadResult.secureUrl;
        imagePublicId = uploadResult.publicId;

        Logger.info("New image uploaded successfully", {
          publicId: imagePublicId,
          url: imageUrl,
        });
      } catch (error) {
        Logger.error("Failed to upload new image", { error });
        return {
          success: false,
          error:
            error instanceof AppError
              ? error.message
              : "Failed to upload image",
        };
      }
    }

    // Update the post
    const postData: Partial<InsertPost> = {
      title,
      content,
      imageUrl,
      imagePublicId,
    };

    const updatedPost = await db
      .update(postsTable)
      .set(postData)
      .where(eq(postsTable.id, postId))
      .returning();

    // Revalidate the posts page
    revalidatePath("/dashboard");

    return {
      success: true,
      data: updatedPost,
    };
  } catch (error) {
    Logger.error("Failed to update post", { error });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update post",
    };
  }
}

export async function deletePost(id: string) {
  try {
    // Get the post to check if it has an image
    const post = await getPostById(id);

    // Delete image from Cloudinary if it exists
    if (post?.imagePublicId) {
      try {
        await deleteImage(post.imagePublicId);
        Logger.info("Post image deleted from Cloudinary", {
          postId: id,
          publicId: post.imagePublicId,
        });
      } catch (error) {
        Logger.error("Failed to delete post image from Cloudinary", {
          postId: id,
          publicId: post.imagePublicId,
          error,
        });
        // Continue with post deletion even if image deletion fails
      }
    }

    // Delete the post from database
    await db.delete(postsTable).where(eq(postsTable.id, id));
    return { message: "Post deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post");
  }
}
```

### `src/server/services/users/user.service.ts`

```typescript
"use server";

import { InsertUser } from "../../db/schema";
import { db } from "../../db/drizzle";
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function getUsers() {
  try {
    const allUsers = await db.select().from(usersTable);
    return allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function createUser(user: InsertUser) {
  try {
    const newUser = await db.insert(usersTable).values(user).returning();
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1)
      .then((res) => res[0]);
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Failed to fetch user by ID");
  }
}

export async function updateUser(id: string, userData: Partial<InsertUser>) {
  try {
    const updatedUser = await db
      .update(usersTable)
      .set(userData)
      .where(eq(usersTable.id, id))
      .returning();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}

export async function deleteUser(id: string) {
  try {
    await db.delete(usersTable).where(eq(usersTable.id, id));
    return { message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}
```

### `src/shared/config/cloudinary.config.ts`

```typescript
// Path: src/config/cloudinary.config.ts
// Cloudinary configuration settings

import { v2 as cloudinary } from "cloudinary";
import { config } from "./config";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryAPIKey,
  api_secret: config.cloudinaryAPISecret,
  secure: true,
});

// Cloudinary upload configuration
export const CLOUDINARY_CONFIG = {
  // Maximum file size: 5MB in bytes
  MAX_FILE_SIZE: 5 * 1024 * 1024,

  // Allowed image formats
  ALLOWED_FORMATS: ["jpg", "jpeg", "png", "webp", "gif", "svg"],

  // Upload folders for organization
  FOLDERS: {
    POSTS: "nextjs-template/posts",
    USERS: "nextjs-template/users",
    TEMP: "nextjs-template/temp",
  },

  // Transformation presets
  TRANSFORMATIONS: {
    THUMBNAIL: {
      width: 300,
      height: 300,
      crop: "fill",
      quality: "auto",
      fetch_format: "auto",
    },
    MEDIUM: {
      width: 800,
      height: 600,
      crop: "limit",
      quality: "auto:good",
      fetch_format: "auto",
    },
    LARGE: {
      width: 1200,
      height: 900,
      crop: "limit",
      quality: "auto:good",
      fetch_format: "auto",
    },
  },
} as const;

export { cloudinary };
```

### `src/shared/config/config.ts`

```typescript
export const config = {
  // Database
  databaseUrl: process.env.DATABASE_URL || "",

  // Cloudinary
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryAPIKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryAPISecret: process.env.CLOUDINARY_API_SECRET || "",

  nodeEnv: process.env.NODE_ENV || "development",
};
```

### `src/shared/index.ts`

```typescript
// Path: src/shared/index.ts
// Main barrel export for all shared code

// Utils
export * from "./utils";

// Middleware
export * from "./middleware";

// Types
export * from "./types";
```

### `src/shared/middleware/error-handler.ts`

```typescript
// Path: src/shared/middleware/error-handler.ts
// Global error handler middleware for Next.js API routes

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError, isAppError } from "../utils/error-handler";
import { sendErrorResponse, ApiErrorResponse } from "../utils/response-handler";
import { Logger } from "../utils/logger";
import { config } from "../config/config";

/**
 * Handles any error and returns an appropriate NextResponse.
 * This is the main error handler for API routes.
 *
 * @param error - The error to handle
 * @returns A NextResponse with the appropriate error details
 *
 * @example
 * // In your API route
 * export async function GET(req: NextRequest) {
 *   try {
 *     // ... your code
 *   } catch (error) {
 *     return handleError(error);
 *   }
 * }
 */
export const handleError = (error: unknown): NextResponse<ApiErrorResponse> => {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const message = error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    Logger.warn("Validation error", { issues: error.issues });

    return sendErrorResponse(new AppError("VALIDATION_ERROR", message));
  }

  // Handle our custom AppError
  if (isAppError(error)) {
    // Log operational errors at appropriate level
    if (error.statusCode >= 500) {
      Logger.error(`AppError: ${error.code}`, {
        message: error.message,
        stack: error.stack,
      });
    } else {
      Logger.warn(`AppError: ${error.code}`, { message: error.message });
    }

    return sendErrorResponse(error);
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    Logger.error("Unhandled Error", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    // In development, include the actual error message
    if (config.nodeEnv === "development") {
      return sendErrorResponse(
        new AppError("INTERNAL_SERVER_ERROR", error.message)
      );
    }

    // In production, hide internal error details
    return sendErrorResponse(new AppError("INTERNAL_SERVER_ERROR"));
  }

  // Handle unknown error types
  Logger.error("Unknown error type", { error });
  return sendErrorResponse(new AppError("INTERNAL_SERVER_ERROR"));
};

/**
 * Wraps an error with additional context
 *
 * @param error - The original error
 * @param context - Additional context to log
 * @returns The handled error response
 */
export const handleErrorWithContext = (
  error: unknown,
  context: Record<string, unknown>
): NextResponse<ApiErrorResponse> => {
  Logger.error("Error with context", { context, error });
  return handleError(error);
};
```

### `src/shared/middleware/index.ts`

```typescript
// Path: src/shared/middleware/index.ts
// Barrel export for all middleware

export {
  validateData,
  validateRequestBody,
  validateRequestQuery,
  validateRequestParams,
  createValidator,
  ValidationSource,
  type ValidationOptions,
  type InferSchema,
} from "./validator";

export { handleError, handleErrorWithContext } from "./error-handler";
```

### `src/shared/middleware/validator.ts`

```typescript
// Path: src/shared/middleware/validator.ts
// Zod validation utilities for Next.js API routes

import { z, ZodError, ZodSchema } from "zod";
import { NextRequest } from "next/server";
import { AppError } from "../utils/error-handler";

/**
 * Validation sources for request data
 */
export enum ValidationSource {
  BODY = "body",
  QUERY = "query",
  PARAMS = "params",
}

/**
 * Options for validation
 */
export interface ValidationOptions {
  /** Whether to strip unknown properties (default: true) */
  stripUnknown?: boolean;
  /** Custom error message prefix */
  errorPrefix?: string;
}

/**
 * Formats Zod validation errors into a readable message
 */
const formatZodError = (error: ZodError, prefix?: string): string => {
  const messages = error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "value";
    return `${path}: ${issue.message}`;
  });

  const baseMessage = messages.join("; ");
  return prefix ? `${prefix}: ${baseMessage}` : baseMessage;
};

/**
 * Validates data against a Zod schema
 *
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @param options - Validation options
 * @returns The validated and typed data
 * @throws AppError with VALIDATION_ERROR code if validation fails
 *
 * @example
 * const userSchema = z.object({
 *   email: z.string().email(),
 *   name: z.string().min(2),
 * });
 *
 * const validatedData = validateData(userSchema, req.body);
 */
export const validateData = <T>(
  schema: ZodSchema<T>,
  data: unknown,
  options: ValidationOptions = {}
): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const message = formatZodError(error, options.errorPrefix);
      throw new AppError("VALIDATION_ERROR", message);
    }
    throw error;
  }
};

/**
 * Validates request body from a NextRequest
 *
 * @param schema - The Zod schema to validate against
 * @param req - The NextRequest object
 * @returns The validated and typed body
 *
 * @example
 * export async function POST(req: NextRequest) {
 *   const body = await validateRequestBody(createUserSchema, req);
 *   // body is now typed and validated
 * }
 */
export const validateRequestBody = async <T>(
  schema: ZodSchema<T>,
  req: NextRequest
): Promise<T> => {
  try {
    const body = await req.json();
    return validateData(schema, body, {
      errorPrefix: "Body validation failed",
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      throw new AppError("VALIDATION_ERROR", "Invalid JSON in request body");
    }
    throw new AppError("VALIDATION_ERROR", "Failed to parse request body");
  }
};

/**
 * Validates query parameters from a NextRequest
 *
 * @param schema - The Zod schema to validate against
 * @param req - The NextRequest object
 * @returns The validated and typed query parameters
 *
 * @example
 * const querySchema = z.object({
 *   page: z.coerce.number().positive().default(1),
 *   limit: z.coerce.number().positive().max(100).default(10),
 * });
 *
 * export async function GET(req: NextRequest) {
 *   const query = validateRequestQuery(querySchema, req);
 *   // query.page and query.limit are typed numbers
 * }
 */
export const validateRequestQuery = <T>(
  schema: ZodSchema<T>,
  req: NextRequest
): T => {
  const { searchParams } = new URL(req.url);
  const queryObject = Object.fromEntries(searchParams.entries());
  return validateData(schema, queryObject, {
    errorPrefix: "Query validation failed",
  });
};

/**
 * Validates route parameters (from the context object in Next.js App Router)
 *
 * @param schema - The Zod schema to validate against
 * @param params - The params object from the route context
 * @returns The validated and typed params
 *
 * @example
 * const paramsSchema = z.object({
 *   id: z.string().uuid(),
 * });
 *
 * export async function GET(
 *   req: NextRequest,
 *   { params }: { params: { id: string } }
 * ) {
 *   const validatedParams = validateRequestParams(paramsSchema, params);
 *   // validatedParams.id is validated as a UUID
 * }
 */
export const validateRequestParams = <T>(
  schema: ZodSchema<T>,
  params: unknown
): T => {
  return validateData(schema, params, {
    errorPrefix: "Params validation failed",
  });
};

/**
 * Creates a validation middleware function for reuse
 *
 * @param schema - The Zod schema to validate against
 * @returns A function that validates data against the schema
 *
 * @example
 * const validateUser = createValidator(userSchema);
 *
 * // Later in your code
 * const user = validateUser(data);
 */
export const createValidator = <T>(schema: ZodSchema<T>) => {
  return (data: unknown, options?: ValidationOptions): T => {
    return validateData(schema, data, options);
  };
};

/**
 * Type helper to infer the type from a Zod schema
 */
export type InferSchema<T extends ZodSchema> = z.infer<T>;
```

### `src/shared/types/api.types.ts`

```typescript
// Path: src/shared/types/api.types.ts
// API-related type definitions

import { NextRequest, NextResponse } from "next/server";

/**
 * Route context with typed params
 */
export interface RouteContext<T = Record<string, string>> {
  params: Promise<T>;
}

/**
 * Common route param types
 */
export interface IdParams {
  id: string;
}

export interface SlugParams {
  slug: string;
}

/**
 * Pagination query parameters
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Paginated response wrapper
 */
export interface PaginatedData<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * API handler function type
 */
export type ApiHandler<TParams = Record<string, string>> = (
  req: NextRequest,
  context?: RouteContext<TParams>
) => Promise<NextResponse>;

/**
 * HTTP methods
 */
export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS";

/**
 * Request with parsed body type helper
 */
export type TypedRequest<TBody = unknown> = NextRequest & {
  parsedBody?: TBody;
};
```

### `src/shared/types/auth.types.ts`

```typescript
// Path: src/shared/types/auth.types.ts
// Authentication-related type definitions

/**
 * User roles enumeration
 */
export type UserRole = "user" | "admin";

/**
 * JWT payload structure
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Authenticated user information (attached to request context)
 */
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * User profile (safe to expose publicly)
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Auth token pair
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Auth response (returned after login/register)
 */
export interface AuthResponse {
  user: UserProfile;
  tokens?: TokenPair; // Optional if using cookies
}

/**
 * Session data stored in cookies or local storage
 */
export interface SessionData {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}
```

### `src/shared/types/index.ts`

```typescript
// Path: src/shared/types/index.ts
// Barrel export for all shared types

export type {
  RouteContext,
  IdParams,
  SlugParams,
  PaginationQuery,
  PaginatedData,
  ApiHandler,
  HttpMethod,
  TypedRequest,
} from "./api.types";

export type {
  UserRole,
  JWTPayload,
  AuthUser,
  UserProfile,
  TokenPair,
  AuthResponse,
  SessionData,
} from "./auth.types";
```

### `src/shared/utils/error-handler.ts`

```typescript
// Path: src/shared/utils/error-handler.ts
// Centralized error definitions and AppError class

/**
 * Error map containing all possible application error codes.
 * Each error code maps to a default HTTP status code and message.
 * Add new error codes here as your application grows.
 */
const ERROR_MAP = {
  // 400 - Bad Request
  VALIDATION_ERROR: { statusCode: 400, message: "Invalid input provided." },
  BAD_REQUEST: { statusCode: 400, message: "Bad request." },

  // 401 - Unauthorized
  INVALID_CREDENTIALS: {
    statusCode: 401,
    message: "Invalid email or password.",
  },
  TOKEN_INVALID: {
    statusCode: 401,
    message: "Authentication token is invalid or missing.",
  },
  TOKEN_EXPIRED: {
    statusCode: 401,
    message: "Authentication token has expired.",
  },
  UNAUTHORIZED: {
    statusCode: 401,
    message: "Authentication is required.",
  },

  // 403 - Forbidden
  INSUFFICIENT_PERMISSIONS: {
    statusCode: 403,
    message: "You do not have permission to perform this action.",
  },
  EMAIL_NOT_VERIFIED: {
    statusCode: 403,
    message: "Please verify your email address.",
  },

  // 404 - Not Found
  NOT_FOUND: { statusCode: 404, message: "Resource not found." },
  USER_NOT_FOUND: { statusCode: 404, message: "User not found." },
  POST_NOT_FOUND: { statusCode: 404, message: "Post not found." },

  // 409 - Conflict
  EMAIL_ALREADY_EXISTS: {
    statusCode: 409,
    message: "An account with this email already exists.",
  },
  EMAIL_ALREADY_VERIFIED: {
    statusCode: 409,
    message: "Email has already been verified.",
  },
  RESOURCE_ALREADY_EXISTS: {
    statusCode: 409,
    message: "Resource already exists.",
  },

  // 429 - Too Many Requests
  RATE_LIMIT_EXCEEDED: {
    statusCode: 429,
    message: "Too many requests. Please try again later.",
  },

  // 413 - Payload Too Large
  FILE_TOO_LARGE: {
    statusCode: 413,
    message:
      "Image size exceeds the maximum allowed size. Please choose a smaller image.",
  },

  // 415 - Unsupported Media Type
  INVALID_FILE_TYPE: {
    statusCode: 415,
    message: "Unsupported file format. Please upload a valid image file.",
  },

  // 500 - Internal Server Error
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    message: "An unexpected error occurred.",
  },
  DATABASE_ERROR: {
    statusCode: 500,
    message: "A database error occurred.",
  },
  EMAIL_SERVICE_ERROR: {
    statusCode: 500,
    message: "Failed to send email.",
  },
  UPLOAD_FAILED: {
    statusCode: 500,
    message: "Failed to upload file.",
  },
  DELETE_FAILED: {
    statusCode: 500,
    message: "Failed to delete file.",
  },
  TRANSFORMATION_FAILED: {
    statusCode: 500,
    message: "Failed to transform image.",
  },
} as const;

/**
 * Type representing all valid error codes
 */
export type AppErrorCode = keyof typeof ERROR_MAP;

/**
 * Get error details by code
 */
export const getErrorDetails = (code: AppErrorCode) => ERROR_MAP[code];

/**
 * Custom application error class that extends the built-in Error class.
 * This provides a consistent error structure throughout the application.
 *
 * @example
 * // Using default message
 * throw new AppError("USER_NOT_FOUND");
 *
 * @example
 * // Using custom message
 * throw new AppError("VALIDATION_ERROR", "Email format is invalid");
 *
 * @example
 * // Using custom status code
 * throw new AppError("NOT_FOUND", "The requested item was not found", 404);
 */
export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(code: AppErrorCode, message?: string, statusCode?: number) {
    const errorDetails = ERROR_MAP[code];
    super(message || errorDetails.message);

    this.code = code;
    this.statusCode = statusCode || errorDetails.statusCode;
    this.isOperational = true; // Distinguishes operational errors from programming errors

    // Maintains proper stack trace for where our error was thrown (V8 engines)
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Type guard to check if an error is an AppError
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};
```

### `src/shared/utils/index.ts`

```typescript
// Path: src/shared/utils/index.ts
// Barrel export for all shared utilities

export {
  AppError,
  isAppError,
  getErrorDetails,
  type AppErrorCode,
} from "./error-handler";
export {
  sendSuccessResponse,
  sendErrorResponse,
  ApiResponses,
  type ApiSuccessResponse,
  type ApiErrorResponse,
  type ApiResponse,
} from "./response-handler";
export { Logger } from "./logger";
```

### `src/shared/utils/logger.ts`

```typescript
// Path: src/shared/utils/logger.ts
// Simple logger utility for Next.js

import { config } from "../config/config";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

/**
 * Determines if we're in a development environment
 */
const isDev = config.nodeEnv === "development";

/**
 * Formats a log entry for console output
 */
const formatLog = (entry: LogEntry): string => {
  const { level, message, timestamp, data } = entry;
  const dataStr = data ? ` ${JSON.stringify(data)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}${dataStr}`;
};

/**
 * Color codes for console output (only works in terminal)
 */
const colors = {
  info: "\x1b[36m", // Cyan
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
  debug: "\x1b[35m", // Magenta
  reset: "\x1b[0m", // Reset
};

/**
 * Creates a log entry and outputs it
 */
const createLog = (level: LogLevel, message: string, data?: unknown): void => {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    data,
  };

  const formattedMessage = formatLog(entry);

  // In development, use colored console output
  if (isDev) {
    const color = colors[level];
    console[level === "debug" ? "log" : level](
      `${color}${formattedMessage}${colors.reset}`
    );
  } else {
    // In production, output JSON for structured logging
    console[level === "debug" ? "log" : level](JSON.stringify(entry));
  }
};

/**
 * Logger utility with methods for different log levels
 *
 * @example
 * Logger.info("User logged in", { userId: "123" });
 * Logger.error("Failed to fetch data", { error: err.message });
 * Logger.warn("Deprecated API used");
 * Logger.debug("Processing request", { body: req.body });
 */
export const Logger = {
  /**
   * Logs informational messages
   */
  info: (message: string, data?: unknown): void => {
    createLog("info", message, data);
  },

  /**
   * Logs warning messages
   */
  warn: (message: string, data?: unknown): void => {
    createLog("warn", message, data);
  },

  /**
   * Logs error messages
   */
  error: (message: string, data?: unknown): void => {
    createLog("error", message, data);
  },

  /**
   * Logs debug messages (only in development)
   */
  debug: (message: string, data?: unknown): void => {
    if (isDev) {
      createLog("debug", message, data);
    }
  },

  /**
   * Logs HTTP request information
   */
  request: (method: string, url: string, data?: unknown): void => {
    createLog("info", `HTTP ${method} ${url}`, data);
  },

  /**
   * Logs HTTP response information
   */
  response: (
    method: string,
    url: string,
    status: number,
    duration?: number
  ): void => {
    const durationStr = duration ? ` (${duration}ms)` : "";
    createLog("info", `HTTP ${method} ${url} - ${status}${durationStr}`);
  },
};
```

### `src/shared/utils/response-handler.ts`

```typescript
// Path: src/shared/utils/response-handler.ts
// Standardized API response handlers for Next.js API routes

import { NextResponse } from "next/server";
import { AppError, AppErrorCode } from "./error-handler";

/**
 * Standard API response structure
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  meta?: {
    timestamp: string;
    [key: string]: unknown;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: AppErrorCode;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    [key: string]: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Creates a standardized success response
 *
 * @param data - The data to include in the response
 * @param message - A human-readable success message
 * @param statusCode - HTTP status code (default: 200)
 * @param meta - Additional metadata to include
 *
 * @example
 * // Basic usage
 * return sendSuccessResponse({ user }, "User created successfully", 201);
 *
 * @example
 * // With pagination metadata
 * return sendSuccessResponse(
 *   users,
 *   "Users retrieved",
 *   200,
 *   { total: 100, page: 1, limit: 10 }
 * );
 */
export const sendSuccessResponse = <T>(
  data: T,
  message: string,
  statusCode = 200,
  meta?: Record<string, unknown>
): NextResponse<ApiSuccessResponse<T>> => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
    { status: statusCode }
  );
};

/**
 * Creates a standardized error response
 *
 * @param error - The AppError instance
 * @param details - Additional error details (e.g., validation errors)
 *
 * @example
 * // Basic usage
 * return sendErrorResponse(new AppError("USER_NOT_FOUND"));
 *
 * @example
 * // With validation details
 * return sendErrorResponse(
 *   new AppError("VALIDATION_ERROR"),
 *   { fields: [{ field: "email", message: "Invalid format" }] }
 * );
 */
export const sendErrorResponse = (
  error: AppError,
  details?: unknown
): NextResponse<ApiErrorResponse> => {
  const errorPayload: ApiErrorResponse["error"] = {
    code: error.code,
    message: error.message,
  };

  if (details !== undefined) {
    errorPayload.details = details;
  }

  return NextResponse.json(
    {
      success: false,
      error: errorPayload,
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status: error.statusCode }
  );
};

/**
 * Quick helper to create common responses
 */
export const ApiResponses = {
  /**
   * Returns 200 OK with data
   */
  ok: <T>(data: T, message = "Success") => sendSuccessResponse(data, message),

  /**
   * Returns 201 Created with data
   */
  created: <T>(data: T, message = "Resource created successfully") =>
    sendSuccessResponse(data, message, 201),

  /**
   * Returns 204 No Content
   */
  noContent: () => new NextResponse(null, { status: 204 }),

  /**
   * Returns 400 Bad Request
   */
  badRequest: (message = "Bad request") =>
    sendErrorResponse(new AppError("BAD_REQUEST", message)),

  /**
   * Returns 401 Unauthorized
   */
  unauthorized: (message = "Authentication required") =>
    sendErrorResponse(new AppError("UNAUTHORIZED", message)),

  /**
   * Returns 403 Forbidden
   */
  forbidden: (message = "Permission denied") =>
    sendErrorResponse(new AppError("INSUFFICIENT_PERMISSIONS", message)),

  /**
   * Returns 404 Not Found
   */
  notFound: (message = "Resource not found") =>
    sendErrorResponse(new AppError("NOT_FOUND", message)),

  /**
   * Returns 409 Conflict
   */
  conflict: (message = "Resource already exists") =>
    sendErrorResponse(new AppError("RESOURCE_ALREADY_EXISTS", message)),

  /**
   * Returns 500 Internal Server Error
   */
  internalError: (message = "An unexpected error occurred") =>
    sendErrorResponse(new AppError("INTERNAL_SERVER_ERROR", message)),
};
```
