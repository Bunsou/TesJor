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

  return sendSuccessResponse(stats);
});
