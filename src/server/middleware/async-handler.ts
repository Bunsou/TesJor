import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/shared/middleware/error-handler";

// Route context type for dynamic routes
export type RouteContext<T = Record<string, string>> = {
  params: Promise<T>;
};

// Handler type
type Handler<T = Record<string, string>> = (
  req: NextRequest,
  context?: RouteContext<T>
) => Promise<NextResponse>;

// Async handler wrapper for API routes
export function asyncHandler<T = Record<string, string>>(handler: Handler<T>) {
  return async (
    req: NextRequest,
    context?: RouteContext<T>
  ): Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (error) {
      return handleError(error);
    }
  };
}
