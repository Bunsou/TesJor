import { NextResponse } from "next/server";
import { AppError } from "./error-handler";

interface ResponseOptions {
  statusCode?: number;
  cache?: {
    maxAge?: number; // Cache duration in seconds
    sMaxAge?: number; // CDN cache duration
    staleWhileRevalidate?: number; // Serve stale while revalidating
  };
  headers?: Record<string, string>;
}

// Success Response with optional caching
export function sendSuccessResponse<T>(
  data: T,
  message?: string,
  options?: ResponseOptions
) {
  const statusCode = options?.statusCode || 200;
  const headers: Record<string, string> = { ...options?.headers };

  // Add cache control headers if specified
  if (options?.cache) {
    const { maxAge = 0, sMaxAge, staleWhileRevalidate } = options.cache;
    const cacheDirectives = [
      maxAge > 0 ? `public, max-age=${maxAge}` : "no-store",
      sMaxAge ? `s-maxage=${sMaxAge}` : null,
      staleWhileRevalidate
        ? `stale-while-revalidate=${staleWhileRevalidate}`
        : null,
    ]
      .filter(Boolean)
      .join(", ");

    headers["Cache-Control"] = cacheDirectives;
  }

  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status: statusCode, headers }
  );
}

// Error Response
export function sendErrorResponse(
  error: AppError | string,
  statusCode?: number,
  details?: Record<string, unknown>
) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.details && { details: error.details }),
        },
      },
      { status: error.statusCode }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: error,
        ...(details && { details }),
      },
    },
    { status: statusCode || 500 }
  );
}

// Legacy Response Helpers (for backward compatibility)
export function successResponse<T>(data: T, messageOrStatus?: string | number) {
  const isStatus = typeof messageOrStatus === "number";
  const status = isStatus ? messageOrStatus : 200;
  const message = !isStatus ? messageOrStatus : undefined;

  return Response.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status }
  );
}

export function errorResponse(
  message: string,
  status = 400,
  errors?: Record<string, unknown>
) {
  return Response.json(
    {
      success: false,
      error: message,
      ...(errors && { errors }),
    },
    { status }
  );
}
