// ========================================
// Error Codes and AppError Class
// ========================================

const ERROR_MAP = {
  // Validation Errors (400)
  VALIDATION_ERROR: { statusCode: 400, message: "Invalid input provided." },
  INVALID_QUERY_PARAMS: {
    statusCode: 400,
    message: "Invalid query parameters.",
  },
  INVALID_REQUEST_BODY: { statusCode: 400, message: "Invalid request body." },
  MISSING_REQUIRED_FIELD: {
    statusCode: 400,
    message: "Missing required field.",
  },

  // Authentication Errors (401)
  UNAUTHORIZED: { statusCode: 401, message: "Authentication required." },
  INVALID_TOKEN: { statusCode: 401, message: "Invalid or expired token." },
  SESSION_EXPIRED: { statusCode: 401, message: "Session has expired." },

  // Authorization Errors (403)
  FORBIDDEN: {
    statusCode: 403,
    message: "You don't have permission to access this resource.",
  },
  ADMIN_REQUIRED: { statusCode: 403, message: "Admin access required." },

  // Not Found Errors (404)
  NOT_FOUND: { statusCode: 404, message: "Resource not found." },
  USER_NOT_FOUND: { statusCode: 404, message: "User not found." },
  ITEM_NOT_FOUND: { statusCode: 404, message: "Item not found." },

  // Rate Limiting (429)
  RATE_LIMIT_EXCEEDED: {
    statusCode: 429,
    message: "Too many requests. Please try again later.",
  },

  // Server Errors (500)
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    message: "An unexpected error occurred.",
  },
  DATABASE_ERROR: { statusCode: 500, message: "Database operation failed." },
  EXTERNAL_SERVICE_ERROR: {
    statusCode: 500,
    message: "External service error.",
  },
} as const;

export type AppErrorCode = keyof typeof ERROR_MAP;

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    code: AppErrorCode,
    customMessage?: string,
    details?: Record<string, unknown>
  ) {
    const errorInfo = ERROR_MAP[code];
    super(customMessage || errorInfo.message);

    this.code = code;
    this.statusCode = errorInfo.statusCode;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { ERROR_MAP };
