import { ZodSchema, ZodError } from "zod";
import { AppError } from "../utils/error-handler";

// Validate request body
export function validateRequestBody<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("VALIDATION_ERROR", "Invalid request body", {
        errors: error.flatten().fieldErrors,
      });
    }
    throw error;
  }
}

// Validate request query parameters
export function validateRequestQuery<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("INVALID_QUERY_PARAMS", "Invalid query parameters", {
        errors: error.flatten().fieldErrors,
      });
    }
    throw error;
  }
}

// Validate request params (route params)
export function validateRequestParams<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("VALIDATION_ERROR", "Invalid route parameters", {
        errors: error.flatten().fieldErrors,
      });
    }
    throw error;
  }
}
