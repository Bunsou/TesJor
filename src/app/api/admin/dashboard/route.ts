import { NextRequest } from "next/server";
import { asyncHandler, requireAdmin } from "@/server/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { getDashboardStats } from "@/server/services/admin/dashboard.service";

export const GET = asyncHandler(async (request: NextRequest) => {
  // Check authentication and admin role
  await requireAdmin(request);

  const stats = await getDashboardStats();

  return sendSuccessResponse(stats, undefined, {
    cache: {
      maxAge: 60, // Cache for 1 minute
      sMaxAge: 60,
      staleWhileRevalidate: 120,
    },
  });
});
