````markdown
# Error Handling Standards for Next.js

> **Approach:** Centralized error codes with Winston logging
> **Package Manager:** pnpm
> **Required Package:** `winston`

## Overview

This document defines the comprehensive error handling strategy for Next.js applications using:

- **Centralized Error Codes**: Single source of truth for all error types
- **Winston Logger**: Structured logging with file rotation
- **Standardized API Responses**: Consistent success/error format
- **Next.js Error Boundaries**: Client-side error catching
- **Type Safety**: TypeScript for error handling

---

## Installation

```bash
# Install Winston logger
pnpm add winston

# TypeScript types (if needed)
pnpm add -D @types/winston
```

---

## 1. Custom Error Handler

**File:** `src/server/utils/error-handler.ts`

```typescript
// Error code mapping with status codes and messages
const ERROR_MAP = {
  // 400 - Validation Errors
  VALIDATION_ERROR: { statusCode: 400, message: "Invalid input provided." },
  VERIFICATION_CODE_INVALID: {
    statusCode: 400,
    message: "The verification code is invalid or expired.",
  },
  INVALID_REQUEST: {
    statusCode: 400,
    message: "The request format is invalid.",
  },

  // 401 - Authentication Errors
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
    message: "Authentication required.",
  },

  // 403 - Authorization Errors
  INSUFFICIENT_PERMISSIONS: {
    statusCode: 403,
    message: "You do not have permission to perform this action.",
  },
  EMAIL_NOT_VERIFIED: {
    statusCode: 403,
    message: "Please verify your email address before continuing.",
  },
  ACCESS_DENIED: {
    statusCode: 403,
    message: "Access denied.",
  },

  // 404 - Not Found Errors
  USER_NOT_FOUND: { statusCode: 404, message: "User not found." },
  RESOURCE_NOT_FOUND: { statusCode: 404, message: "Resource not found." },
  ROUTE_NOT_FOUND: { statusCode: 404, message: "API route not found." },

  // 409 - Conflict Errors
  EMAIL_ALREADY_EXISTS: {
    statusCode: 409,
    message: "An account with this email already exists.",
  },
  EMAIL_ALREADY_VERIFIED: {
    statusCode: 409,
    message: "Email has already been verified.",
  },
  RESOURCE_CONFLICT: {
    statusCode: 409,
    message: "Resource already exists.",
  },

  // 429 - Rate Limiting
  RATE_LIMIT_EXCEEDED: {
    statusCode: 429,
    message: "Too many requests. Please try again later.",
  },

  // 500 - Server Errors
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    message: "An unexpected error occurred.",
  },
  DATABASE_ERROR: {
    statusCode: 500,
    message: "Database operation failed.",
  },
  EMAIL_SERVICE_ERROR: {
    statusCode: 500,
    message: "Failed to send email.",
  },
  EXTERNAL_API_ERROR: {
    statusCode: 500,
    message: "External service is unavailable.",
  },
} as const;

export type AppErrorCode = keyof typeof ERROR_MAP;

/**
 * Custom Application Error Class
 *
 * @example
 * // Basic usage with default message
 * throw new AppError("USER_NOT_FOUND");
 *
 * @example
 * // Override default message
 * throw new AppError("VALIDATION_ERROR", "Email format is invalid");
 *
 * @example
 * // Override status code (rare cases)
 * throw new AppError("INTERNAL_SERVER_ERROR", undefined, 503);
 */
export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean = true;

  constructor(code: AppErrorCode, message?: string, statusCode?: number) {
    super(message || ERROR_MAP[code].message);
    this.code = code;
    this.statusCode = statusCode || ERROR_MAP[code].statusCode;
    this.name = "AppError";
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Helper function to check if error is operational
 */
export const isOperationalError = (error: Error): boolean => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
};
```

---

## 2. Winston Logger Configuration

**File:** `src/server/utils/logger.ts`

```typescript
import winston from "winston";
import path from "path";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom format for console (development)
const consoleFormat = printf(
  ({ level, message, timestamp, stack, ...meta }) => {
    const metaString = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : "";
    return `${timestamp} [${level}]: ${stack || message}${metaString}`;
  }
);

// Logs directory path
const logsDir = path.join(process.cwd(), "logs");

/**
 * Winston Logger Instance
 *
 * Transports:
 * - Console: All logs with color coding (development)
 * - error.log: Only error-level logs (for quick debugging)
 * - combined.log: All log levels (for full context)
 */
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    errors({ stack: true }), // Include stack traces
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
  ),
  defaultMeta: {
    service: "nextjs-app",
    environment: process.env.NODE_ENV,
  },
  transports: [
    // Console output (all environments)
    new winston.transports.Console({
      format: combine(colorize(), consoleFormat),
    }),

    // ERROR LOG - Only errors (for quick debugging)
    // Use this when you need to find recent errors fast
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      format: combine(
        timestamp(),
        json() // JSON format for parsing/monitoring tools
      ),
      maxsize: 5242880, // 5MB per file
      maxFiles: 5, // Keep last 5 files
    }),

    // COMBINED LOG - All levels (for full context)
    // Use this to understand what happened before an error
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      format: combine(timestamp(), json()),
      maxsize: 5242880, // 5MB per file
      maxFiles: 5,
    }),
  ],
});

/**
 * Usage Examples:
 *
 * // Info: Successful operations
 * logger.info("User logged in", { userId: "123", email: "user@example.com" });
 *
 * // Error: Failed operations with context
 * logger.error("Database error", {
 *   error: err.message,
 *   query: "SELECT * FROM users",
 *   userId: "123"
 * });
 *
 * // Warning: Potential issues
 * logger.warn("Rate limit approaching", { userId: "123", count: 95 });
 *
 * // Debug: Development information
 * logger.debug("Processing request", { requestId: "abc", body: data });
 */

// Export logging methods for convenience
export const logInfo = logger.info.bind(logger);
export const logError = logger.error.bind(logger);
export const logWarn = logger.warn.bind(logger);
export const logDebug = logger.debug.bind(logger);
```

### Why Two Log Files?

#### `error.log` (Errors Only)

- **Purpose**: Quick access to errors without noise
- **When to use**: Investigating production issues, setting up error alerts
- **Content**: Only `logger.error()` calls
- **Example use case**: "Show me all errors from the last hour"

#### `combined.log` (All Logs)

- **Purpose**: Full application behavior context
- **When to use**: Understanding what led to an error, debugging complex flows
- **Content**: All log levels (debug, info, warn, error)
- **Example use case**: "What was the user doing before this error occurred?"

---

## 3. Standardized API Responses

**File:** `src/server/utils/api-response.ts`

```typescript
import { NextResponse } from "next/server";
import { AppError, AppErrorCode } from "./error-handler";
import { logger } from "./logger";

// Type definitions
export interface SuccessResponse<T = any> {
  status: "success";
  message: string;
  data: T;
}

export interface ErrorResponse {
  status: "error";
  message: string;
  code?: AppErrorCode;
}

export const apiResponse = {
  /**
   * Success Response
   *
   * @param data - The response data (can be object, array, null, etc.)
   * @param message - Success message for the client
   * @param statusCode - HTTP status code (default: 200)
   * @returns NextResponse with success format
   *
   * @example
   * // Simple success
   * return apiResponse.success(user, "User retrieved successfully");
   *
   * @example
   * // Created resource
   * return apiResponse.success(newPost, "Post created", 201);
   *
   * @example
   * // No content
   * return apiResponse.success(null, "User deleted", 200);
   */
  success: <T>(
    data: T,
    message: string = "Operation successful",
    statusCode: number = 200
  ): NextResponse<SuccessResponse<T>> => {
    logger.info(message, {
      statusCode,
      dataType: typeof data,
      hasData: data !== null && data !== undefined,
    });

    return NextResponse.json(
      {
        status: "success",
        message,
        data,
      },
      { status: statusCode }
    );
  },

  /**
   * Error Response
   *
   * @param error - The error object (AppError, Zod error, or unknown)
   * @returns NextResponse with error format
   *
   * @example
   * // AppError
   * return apiResponse.error(new AppError("USER_NOT_FOUND"));
   *
   * @example
   * // Catch block
   * try {
   *   await riskyOperation();
   * } catch (error) {
   *   return apiResponse.error(error);
   * }
   */
  error: (error: unknown): NextResponse<ErrorResponse> => {
    // Handle AppError instances
    if (error instanceof AppError) {
      logger.error(error.message, {
        code: error.code,
        statusCode: error.statusCode,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });

      return NextResponse.json(
        {
          status: "error",
          message: error.message,
          code: error.code,
        },
        { status: error.statusCode }
      );
    }

    // Handle Zod validation errors
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as any;
      const message = zodError.issues
        .map((issue: any) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");

      logger.error("Validation error", {
        issues: zodError.issues,
        statusCode: 400,
      });

      return NextResponse.json(
        {
          status: "error",
          message: message || "Validation failed",
          code: "VALIDATION_ERROR" as AppErrorCode,
        },
        { status: 400 }
      );
    }

    // Handle unknown errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    logger.error("Unexpected error", {
      message: errorMessage,
      stack: errorStack,
      statusCode: 500,
    });

    // Don't expose internal errors in production
    const clientMessage =
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : errorMessage;

    return NextResponse.json(
      {
        status: "error",
        message: clientMessage,
        code: "INTERNAL_SERVER_ERROR" as AppErrorCode,
      },
      { status: 500 }
    );
  },
};
```

---

## 4. API Route Patterns

### Basic CRUD Example

**File:** `src/app/api/users/[id]/route.ts`

```typescript
import { NextRequest } from "next/server";
import { apiResponse } from "@/server/utils/api-response";
import { AppError } from "@/server/utils/error-handler";
import { userService } from "@/server/services/users/user.service";
import { z } from "zod";

/**
 * GET /api/users/[id]
 * Retrieve a single user by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await userService.findById(params.id);

    // Success Response:
    // { status: "success", message: "User retrieved successfully", data: { id: "123", name: "John", ... } }
    return apiResponse.success(user, "User retrieved successfully");
  } catch (error) {
    // Error Response (if user not found):
    // { status: "error", message: "User not found.", code: "USER_NOT_FOUND" }
    return apiResponse.error(error);
  }
}

/**
 * PUT /api/users/[id]
 * Update user information
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Zod validation schema
    const updateSchema = z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Invalid email format"),
      bio: z
        .string()
        .max(500, "Bio must be less than 500 characters")
        .optional(),
    });

    // Validate request body (throws if invalid)
    const validated = updateSchema.parse(body);

    const updatedUser = await userService.update(params.id, validated);

    // Success Response:
    // { status: "success", message: "User updated successfully", data: { id: "123", name: "Jane", ... } }
    return apiResponse.success(updatedUser, "User updated successfully");
  } catch (error) {
    // Zod validation error:
    // { status: "error", message: "email: Invalid email format", code: "VALIDATION_ERROR" }

    // AppError (user not found):
    // { status: "error", message: "User not found.", code: "USER_NOT_FOUND" }

    return apiResponse.error(error);
  }
}

/**
 * DELETE /api/users/[id]
 * Delete a user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await userService.delete(params.id);

    // Success Response (no data needed):
    // { status: "success", message: "User deleted successfully", data: null }
    return apiResponse.success(null, "User deleted successfully");
  } catch (error) {
    return apiResponse.error(error);
  }
}
```

### Authentication Example

**File:** `src/app/api/auth/login/route.ts`

```typescript
import { NextRequest } from "next/server";
import { apiResponse } from "@/server/utils/api-response";
import { AppError } from "@/server/utils/error-handler";
import { authService } from "@/server/services/auth/auth.service";
import { z } from "zod";

/**
 * POST /api/auth/login
 * Authenticate user and return session token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    const loginSchema = z.object({
      email: z.string().email("Invalid email format"),
      password: z.string().min(1, "Password is required"),
    });

    const { email, password } = loginSchema.parse(body);

    // Authenticate user
    const result = await authService.login(email, password);

    // Success Response:
    // {
    //   status: "success",
    //   message: "Login successful",
    //   data: { user: {...}, token: "jwt-token-here" }
    // }
    return apiResponse.success(result, "Login successful");
  } catch (error) {
    // Possible errors:
    // - VALIDATION_ERROR: Invalid email format
    // - INVALID_CREDENTIALS: Wrong password
    // - USER_NOT_FOUND: Email doesn't exist
    // - EMAIL_NOT_VERIFIED: Email not verified
    return apiResponse.error(error);
  }
}
```

---

## 5. Service Layer Patterns

**File:** `src/server/services/users/user.service.ts`

```typescript
import { eq } from "drizzle-orm";
import { db } from "@/server/db/client";
import { users } from "@/server/db/schema";
import { AppError } from "@/server/utils/error-handler";
import { logger } from "@/server/utils/logger";

export const userService = {
  /**
   * Find user by ID
   * @throws {AppError} USER_NOT_FOUND if user doesn't exist
   * @throws {AppError} DATABASE_ERROR if database operation fails
   */
  async findById(id: string) {
    try {
      logger.debug("Fetching user by ID", { userId: id });

      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
        columns: {
          password: false, // Exclude sensitive fields
        },
      });

      if (!user) {
        throw new AppError("USER_NOT_FOUND");
      }

      logger.info("User fetched successfully", { userId: id });
      return user;
    } catch (error) {
      // Re-throw AppError as-is
      if (error instanceof AppError) {
        throw error;
      }

      // Wrap database errors
      logger.error("Database error while fetching user", { userId: id, error });
      throw new AppError("DATABASE_ERROR");
    }
  },

  /**
   * Create new user
   * @throws {AppError} EMAIL_ALREADY_EXISTS if email is taken
   * @throws {AppError} VALIDATION_ERROR if data is invalid
   * @throws {AppError} DATABASE_ERROR if database operation fails
   */
  async create(data: { email: string; password: string; name: string }) {
    try {
      logger.debug("Creating new user", { email: data.email });

      // Check if email exists
      const existing = await db.query.users.findFirst({
        where: eq(users.email, data.email),
      });

      if (existing) {
        throw new AppError("EMAIL_ALREADY_EXISTS");
      }

      // Insert new user
      const [newUser] = await db
        .insert(users)
        .values({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      logger.info("User created successfully", { userId: newUser.id });

      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      logger.error("Database error while creating user", { error });
      throw new AppError("DATABASE_ERROR");
    }
  },

  /**
   * Update user information
   * @throws {AppError} USER_NOT_FOUND if user doesn't exist
   * @throws {AppError} EMAIL_ALREADY_EXISTS if new email is taken
   * @throws {AppError} DATABASE_ERROR if database operation fails
   */
  async update(id: string, data: Partial<typeof users.$inferInsert>) {
    try {
      logger.debug("Updating user", { userId: id, fields: Object.keys(data) });

      // Check if email is being changed and if it's taken
      if (data.email) {
        const existing = await db.query.users.findFirst({
          where: eq(users.email, data.email),
        });

        if (existing && existing.id !== id) {
          throw new AppError("EMAIL_ALREADY_EXISTS");
        }
      }

      // Update user
      const [updatedUser] = await db
        .update(users)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();

      if (!updatedUser) {
        throw new AppError("USER_NOT_FOUND");
      }

      logger.info("User updated successfully", { userId: id });

      // Return without password
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      logger.error("Database error while updating user", { userId: id, error });
      throw new AppError("DATABASE_ERROR");
    }
  },

  /**
   * Delete user
   * @throws {AppError} USER_NOT_FOUND if user doesn't exist
   * @throws {AppError} DATABASE_ERROR if database operation fails
   */
  async delete(id: string) {
    try {
      logger.debug("Deleting user", { userId: id });

      const [deletedUser] = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning();

      if (!deletedUser) {
        throw new AppError("USER_NOT_FOUND");
      }

      logger.info("User deleted successfully", { userId: id });
      return deletedUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      logger.error("Database error while deleting user", { userId: id, error });
      throw new AppError("DATABASE_ERROR");
    }
  },
};
```

---

## 6. Next.js Error Boundaries

### Route-Level Error Boundary

**File:** `src/app/error.tsx` (or `src/app/dashboard/error.tsx` for specific routes)

```typescript
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

/**
 * Error Boundary for catching React component errors
 * Place this at route level (e.g., app/dashboard/error.tsx)
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Error boundary caught:", error);

    // You can send to external service:
    // sendToErrorTracking({ error, digest: error.digest });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-600">
              Something went wrong!
            </CardTitle>
          </div>
          <CardDescription>
            {process.env.NODE_ENV === "development" ? (
              <span className="font-mono text-xs">{error.message}</span>
            ) : (
              "We encountered an unexpected error. Please try again."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={reset} variant="default" className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Global Error Boundary

**File:** `src/app/global-error.tsx`

```typescript
"use client";

/**
 * Root-level error boundary
 * Catches errors that escape route-level error boundaries
 * Must include <html> and <body> tags
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
            <h2 className="mb-2 text-2xl font-bold text-red-600">
              Application Error
            </h2>
            <p className="mb-4 text-gray-600">
              A critical error occurred. Please refresh the page.
            </p>
            {process.env.NODE_ENV === "development" && (
              <pre className="mb-4 overflow-auto rounded bg-gray-100 p-2 text-left text-xs">
                {error.message}
              </pre>
            )}
            <button
              onClick={reset}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
```

### Custom Error Boundary Component

**File:** `src/components/common/ErrorBoundary.tsx`

```typescript
"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Custom Error Boundary for wrapping specific components
 *
 * @example
 * <ErrorBoundary fallback={<div>Custom fallback UI</div>}>
 *   <ComplexComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Send to monitoring service
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6">
          <AlertTriangle className="mb-2 h-8 w-8 text-red-600" />
          <h3 className="mb-2 text-lg font-semibold text-red-900">
            Something went wrong
          </h3>
          <p className="mb-4 text-sm text-red-700">
            {this.state.error?.message || "An error occurred in this component"}
          </p>
          <Button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            variant="outline"
            size="sm"
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 7. Client-Side Error Handling

### API Call Hook with Error Handling

**File:** `src/features/users/hooks/useUser.ts`

```typescript
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { AppErrorCode } from "@/server/utils/error-handler";

interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data?: T;
  code?: AppErrorCode;
}

export function useUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Fetch user by ID
   */
  const fetchUser = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/users/${id}`);
      const result: ApiResponse<any> = await response.json();

      if (result.status === "error") {
        setError(result.message);

        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });

        return null;
      }

      // Success: result.data contains user object
      toast({
        title: "Success",
        description: result.message,
      });

      return result.data;
    } catch (error) {
      const message = "Failed to fetch user. Please try again.";
      setError(message);

      toast({
        title: "Network Error",
        description: message,
        variant: "destructive",
      });

      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user information
   */
  const updateUser = async (id: string, data: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<any> = await response.json();

      if (result.status === "error") {
        setError(result.message);

        // Handle specific error codes
        if (result.code === "EMAIL_ALREADY_EXISTS") {
          toast({
            title: "Email Taken",
            description:
              "This email is already registered. Please use a different email.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        }

        return null;
      }

      toast({
        title: "Success",
        description: result.message,
      });

      return result.data;
    } catch (error) {
      const message = "Failed to update user. Please try again.";
      setError(message);

      toast({
        title: "Network Error",
        description: message,
        variant: "destructive",
      });

      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete user
   */
  const deleteUser = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      const result: ApiResponse<any> = await response.json();

      if (result.status === "error") {
        setError(result.message);

        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });

        return false;
      }

      toast({
        title: "Success",
        description: result.message,
      });

      return true;
    } catch (error) {
      const message = "Failed to delete user. Please try again.";
      setError(message);

      toast({
        title: "Network Error",
        description: message,
        variant: "destructive",
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchUser,
    updateUser,
    deleteUser,
    loading,
    error,
  };
}
```

---

## 8. Authentication Error Handling

**File:** `src/server/services/auth/auth.service.ts`

```typescript
import { eq } from "drizzle-orm";
import { db } from "@/server/db/client";
import { users } from "@/server/db/schema";
import { AppError } from "@/server/utils/error-handler";
import { logger } from "@/server/utils/logger";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authService = {
  /**
   * Login user
   * @throws {AppError} USER_NOT_FOUND if email doesn't exist
   * @throws {AppError} INVALID_CREDENTIALS if password is wrong
   * @throws {AppError} EMAIL_NOT_VERIFIED if email not verified
   */
  async login(email: string, password: string) {
    try {
      logger.debug("Login attempt", { email });

      // Find user
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        logger.warn("Login failed: user not found", { email });
        throw new AppError("USER_NOT_FOUND");
      }

      // Check if email is verified
      if (!user.emailVerified) {
        logger.warn("Login failed: email not verified", { email });
        throw new AppError("EMAIL_NOT_VERIFIED");
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        logger.warn("Login failed: invalid password", { email });
        throw new AppError("INVALID_CREDENTIALS");
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      logger.info("Login successful", { userId: user.id, email });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      logger.error("Login error", { email, error });
      throw new AppError("INTERNAL_SERVER_ERROR");
    }
  },

  /**
   * Register new user
   * @throws {AppError} EMAIL_ALREADY_EXISTS if email is taken
   * @throws {AppError} VALIDATION_ERROR if data is invalid
   */
  async register(data: { email: string; password: string; name: string }) {
    try {
      logger.debug("Registration attempt", { email: data.email });

      // Check if email exists
      const existing = await db.query.users.findFirst({
        where: eq(users.email, data.email),
      });

      if (existing) {
        logger.warn("Registration failed: email exists", { email: data.email });
        throw new AppError("EMAIL_ALREADY_EXISTS");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          email: data.email,
          password: hashedPassword,
          name: data.name,
          emailVerified: false,
        })
        .returning();

      logger.info("User registered successfully", { userId: newUser.id });

      // Return without password
      const { password: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      logger.error("Registration error", { email: data.email, error });
      throw new AppError("INTERNAL_SERVER_ERROR");
    }
  },

  /**
   * Verify JWT token
   * @throws {AppError} TOKEN_INVALID if token is malformed
   * @throws {AppError} TOKEN_EXPIRED if token has expired
   */
  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        email: string;
      };

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError("TOKEN_EXPIRED");
      }

      throw new AppError("TOKEN_INVALID");
    }
  },
};
```

---

## 9. Middleware Error Handling

**File:** `src/server/middleware/auth.ts`

```typescript
import { NextRequest } from "next/server";
import { AppError } from "@/server/utils/error-handler";
import { authService } from "@/server/services/auth/auth.service";
import { logger } from "@/server/utils/logger";

/**
 * Authentication Middleware
 * Extracts and verifies JWT token from Authorization header
 *
 * @throws {AppError} TOKEN_INVALID if token is missing or malformed
 * @throws {AppError} TOKEN_EXPIRED if token has expired
 * @throws {AppError} UNAUTHORIZED if no token provided
 *
 * @example
 * export async function GET(request: NextRequest) {
 *   const user = await authMiddleware(request);
 *   // user is now authenticated
 * }
 */
export async function authMiddleware(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      logger.warn("No authorization header provided");
      throw new AppError("UNAUTHORIZED", "No authentication token provided");
    }

    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      logger.warn("Invalid authorization header format");
      throw new AppError("TOKEN_INVALID", "Invalid token format");
    }

    // Verify token
    const decoded = await authService.verifyToken(token);

    logger.debug("Token verified successfully", { userId: decoded.userId });

    return decoded;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    logger.error("Auth middleware error", { error });
    throw new AppError("TOKEN_INVALID");
  }
}

/**
 * Optional Authentication Middleware
 * Returns user if token is valid, null otherwise
 * Does not throw errors - useful for optional auth routes
 */
export async function optionalAuthMiddleware(request: NextRequest) {
  try {
    return await authMiddleware(request);
  } catch (error) {
    return null;
  }
}
```

---

## 10. Best Practices

### When to Use Each Error Code

| Error Code                 | HTTP Status | Use Case                                    |
| -------------------------- | ----------- | ------------------------------------------- |
| `VALIDATION_ERROR`         | 400         | Invalid user input (format, type, range)    |
| `INVALID_CREDENTIALS`      | 401         | Wrong username/password                     |
| `TOKEN_INVALID`            | 401         | Malformed or invalid JWT token              |
| `TOKEN_EXPIRED`            | 401         | Expired JWT token                           |
| `UNAUTHORIZED`             | 401         | No authentication provided                  |
| `INSUFFICIENT_PERMISSIONS` | 403         | User lacks required permissions             |
| `EMAIL_NOT_VERIFIED`       | 403         | Email verification required                 |
| `USER_NOT_FOUND`           | 404         | User doesn't exist in database              |
| `RESOURCE_NOT_FOUND`       | 404         | Generic resource not found                  |
| `EMAIL_ALREADY_EXISTS`     | 409         | Duplicate email during registration         |
| `EMAIL_ALREADY_VERIFIED`   | 409         | Attempting to verify already verified email |
| `RATE_LIMIT_EXCEEDED`      | 429         | Too many requests                           |
| `INTERNAL_SERVER_ERROR`    | 500         | Unexpected server errors                    |
| `DATABASE_ERROR`           | 500         | Database operation failed                   |
| `EMAIL_SERVICE_ERROR`      | 500         | Email sending failed                        |

### Logging Best Practices

```typescript
// ✅ DO: Include context
logger.info("User created", { userId: user.id, email: user.email });

// ❌ DON'T: Log without context
logger.info("User created");

// ✅ DO: Log errors with full context
logger.error("Database query failed", {
  query: "SELECT * FROM users",
  error: err.message,
  stack: err.stack,
});

// ❌ DON'T: Log sensitive data
logger.info("User logged in", { password: "secret123" }); // NEVER DO THIS

// ✅ DO: Use appropriate log levels
logger.debug("Request body", { body }); // Development only
logger.info("User action", { action }); // Important events
logger.warn("Approaching limit", { count }); // Potential issues
logger.error("Operation failed", { error }); // Actual errors
```

### Error Response Consistency

```typescript
// ✅ DO: Use apiResponse helpers
return apiResponse.success(data, "User created", 201);
return apiResponse.error(new AppError("USER_NOT_FOUND"));

// ❌ DON'T: Create manual responses
return NextResponse.json({ success: true, user: data }); // Inconsistent format
return NextResponse.json({ error: "Not found" }); // Missing error code
```

### Service Layer Error Handling

```typescript
// ✅ DO: Re-throw AppError, wrap others
try {
  // operation
} catch (error) {
  if (error instanceof AppError) {
    throw error; // Preserve original error
  }
  throw new AppError("DATABASE_ERROR"); // Wrap unexpected errors
}

// ❌ DON'T: Swallow errors
try {
  // operation
} catch (error) {
  console.log(error); // Error is lost!
  return null;
}
```

---

## 11. File Structure Summary

```
src/
├── app/
│   ├── error.tsx                          # Route-level error boundary
│   ├── global-error.tsx                   # Root error boundary
│   └── api/
│       ├── users/
│       │   └── [id]/
│       │       └── route.ts               # API with error handling
│       └── auth/
│           └── login/
│               └── route.ts               # Auth error handling
│
├── server/
│   ├── services/
│   │   ├── users/
│   │   │   └── user.service.ts           # Service with errors
│   │   └── auth/
│   │       └── auth.service.ts           # Auth service
│   ├── middleware/
│   │   └── auth.ts                       # Auth middleware
│   └── utils/
│       ├── error-handler.ts              # AppError + ERROR_MAP
│       ├── logger.ts                     # Winston logger
│       └── api-response.ts               # Response helpers
│
├── features/
│   └── users/
│       └── hooks/
│           └── useUser.ts                # Client error handling
│
└── components/
    └── common/
        └── ErrorBoundary.tsx             # Custom error boundary

logs/
├── error.log                             # Error logs only
└── combined.log                          # All logs
```

---

## 12. Environment Setup

### Create logs directory

```bash
# Project root
mkdir logs
echo "logs/" >> .gitignore
```

### Environment variables

```env
# .env.local

# Winston logging
NODE_ENV="development" # or "production"

# JWT (for auth examples)
JWT_SECRET="your-secret-key-here"

# Database
DATABASE_URL="postgresql://..."
```

---

## 13. Testing Error Handling

### Unit Test Example

**File:** `src/server/services/users/__tests__/user.service.test.ts`

```typescript
import { describe, it, expect, vi } from "vitest";
import { userService } from "../user.service";
import { AppError } from "@/server/utils/error-handler";

describe("userService.findById", () => {
  it("should throw USER_NOT_FOUND when user doesn't exist", async () => {
    await expect(userService.findById("invalid-id")).rejects.toThrow(
      new AppError("USER_NOT_FOUND")
    );
  });

  it("should return user when found", async () => {
    const user = await userService.findById("valid-id");
    expect(user).toHaveProperty("id");
    expect(user).not.toHaveProperty("password");
  });
});

describe("userService.create", () => {
  it("should throw EMAIL_ALREADY_EXISTS for duplicate email", async () => {
    await expect(
      userService.create({
        email: "existing@example.com",
        password: "password",
        name: "Test",
      })
    ).rejects.toThrow(new AppError("EMAIL_ALREADY_EXISTS"));
  });
});
```

---

## 14. Common Use Cases

### Case 1: User Registration with Email Check

```typescript
// API Route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    const user = await userService.create(validated);

    return apiResponse.success(user, "Account created successfully", 201);
  } catch (error) {
    // Automatically handles:
    // - EMAIL_ALREADY_EXISTS: Returns 409
    // - VALIDATION_ERROR: Returns 400
    // - DATABASE_ERROR: Returns 500
    return apiResponse.error(error);
  }
}
```

### Case 2: Protected Route with Auth

```typescript
// API Route
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const decoded = await authMiddleware(request);

    // Fetch user's data
    const data = await dataService.getUserData(decoded.userId);

    return apiResponse.success(data, "Data retrieved");
  } catch (error) {
    // Automatically handles:
    // - TOKEN_INVALID: Returns 401
    // - TOKEN_EXPIRED: Returns 401
    // - UNAUTHORIZED: Returns 401
    // - USER_NOT_FOUND: Returns 404
    return apiResponse.error(error);
  }
}
```

### Case 3: Update with Conflict Check

```typescript
// Service Layer
async update(id: string, data: { email?: string; name?: string }) {
  try {
    // Check for email conflict
    if (data.email) {
      const existing = await db.query.users.findFirst({
        where: eq(users.email, data.email),
      });

      if (existing && existing.id !== id) {
        throw new AppError("EMAIL_ALREADY_EXISTS");
      }
    }

    // Proceed with update
    const [updated] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();

    if (!updated) {
      throw new AppError("USER_NOT_FOUND");
    }

    return updated;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("DATABASE_ERROR");
  }
}
```

---

## 15. Adding New Error Codes

To add a new error code, update `ERROR_MAP` in `error-handler.ts`:

```typescript
const ERROR_MAP = {
  // ... existing errors

  // Add new error
  PAYMENT_FAILED: {
    statusCode: 402,
    message: "Payment processing failed.",
  },

  SUBSCRIPTION_EXPIRED: {
    statusCode: 403,
    message: "Your subscription has expired.",
  },
} as const;
```

Then use it:

```typescript
throw new AppError("PAYMENT_FAILED");
throw new AppError(
  "SUBSCRIPTION_EXPIRED",
  "Premium features require active subscription"
);
```

---

## Summary

✅ **Centralized error codes** - Single source of truth in `ERROR_MAP`
✅ **Winston logging** - Separate error.log and combined.log for debugging
✅ **Standardized responses** - Consistent `{ status, message, data/code }` format
✅ **Type-safe errors** - TypeScript enforcement with `AppErrorCode`
✅ **Error boundaries** - Client-side error catching with React
✅ **Best practices** - Logging, error re-throwing, context inclusion

**Remember:**

- Use `AppError` for all operational errors
- Log errors with context using Winston
- Always use `apiResponse` helpers for consistency
- Re-throw `AppError` instances, wrap database/unexpected errors
- Include error codes in responses for client-side handling
````
