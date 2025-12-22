import { NextRequest } from "next/server";
import { asyncHandler, requireAuth, checkRateLimit } from "@/server/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { log } from "@/shared/utils";
import { getUserStats } from "@/server/services/user";

export const GET = asyncHandler(async (request: NextRequest) => {
  // Get session
  const session = await requireAuth(request);
  const userId = session.user.id;

  // Rate limiting
  await checkRateLimit(request, userId);

  log.info("Fetching user stats", { userId });

  const stats = await getUserStats(userId);
  console.log("User Stats 11: ", stats);

  return sendSuccessResponse(stats, "User stats retrieved successfully", {
    cache: {
      maxAge: 60, // Browser cache: 1 minute
      sMaxAge: 120, // CDN cache: 2 minutes
      staleWhileRevalidate: 300, // Serve stale for 5 minutes while revalidating
    },
  });
});
