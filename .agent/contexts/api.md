# ## Next.js API Route Standards

This document defines the strict standards for building backend API endpoints in this project.

## 1. File Structure

- All API endpoints MUST be built using Route Handlers inside the App Router.
- The file path MUST be `src/app/api/.../route.ts`.
- **Example:** A `POST` request to `/api/users` is handled by a `POST` function in `src/app/api/users/route.ts`.

## 2. Handler Functions

- You MUST use the exported, named functions for HTTP verbs (e.g., `export async function GET()`, `export async function POST()`).
- You MUST use `NextRequest` and `NextResponse` from `next/server` for all handlers. Do not use the classic `req` and `res` objects.

## 3. Zod Validation is Mandatory

- **Zod is required for ALL API endpoints.**
- **Request Body:** You MUST define a Zod schema for the `request.body`. You MUST parse and validate the body inside a `try/catch` block.
- **Responses:** You SHOULD define Zod schemas for your success and error responses to ensure consistency.

## 4. Error Handling & Responses

- You MUST return a standardized JSON response using `NextResponse.json()`.
- **Success:**
  - `return NextResponse.json({ data: ... }, { status: 200 });`
- **Validation Error (from Zod):**
  - `return NextResponse.json({ error: "Invalid input", details: zodError.errors }, { status: 400 });`
- **Server Error (from `try/catch`):**
  - `return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });`

## 5. Example `route.ts` Template

This is the pattern all API routes MUST follow:

```tsx
import { NextRequest, NextResponse } from "next/server";
import { z } = "zod";

// 1. Define the Zod schema for the request body
const createUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
});

// 2. Define the handler function
export async function POST(request: NextRequest) {
  try {
    // 3. Validate the request body
    const body = await request.json();
    const validatedBody = createUserSchema.parse(body);

    // 4. (Database logic would go here)
    // const newUser = await db.user.create({ data: validatedBody });
    const newUser = { id: "1", ...validatedBody }; // Mock data

    // 5. Return a success response
    return NextResponse.json({ data: newUser }, { status: 201 });

  } catch (error) {
    // 6. Handle validation errors from Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    // 7. Handle other server errors
    console.error(error); // Log the error
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// You MUST also define GET, PUT, DELETE as needed.
export async function GET(request: NextRequest) {
  // ...
}
```
