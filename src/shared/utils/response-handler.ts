import { NextResponse } from "next/server";
import { AppError } from "./error-handler";

// Success Response
export function sendSuccessResponse<T>(
  data: T,
  message?: string,
  statusCode = 200
) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status: statusCode }
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
