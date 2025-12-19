import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "../utils/error-handler";
import { sendErrorResponse } from "../utils/response-handler";
import { log } from "../utils/logger";

export function handleError(error: unknown): NextResponse {
  // Log the error
  log.error("Error occurred", { error });

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return sendErrorResponse(
      new AppError("VALIDATION_ERROR", "Validation failed", {
        errors: error.flatten().fieldErrors,
      })
    );
  }

  // Handle AppError
  if (error instanceof AppError) {
    return sendErrorResponse(error);
  }

  // Handle unknown errors
  return sendErrorResponse(
    new AppError("INTERNAL_SERVER_ERROR", "An unexpected error occurred")
  );
}
