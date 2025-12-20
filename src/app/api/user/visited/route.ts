import { NextRequest } from "next/server";
import { asyncHandler, requireAuth, checkRateLimit } from "@/server/middleware";
import { validateRequestBody } from "@/shared/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { log } from "@/shared/utils";
import { visitedSchema } from "@/features/user/schemas";
import { toggleVisited, getUserVisited } from "@/server/services/user";

export const POST = asyncHandler(async (request: NextRequest) => {
  // Get session
  const session = await requireAuth(request);
  const userId = session.user.id;

  // Rate limiting
  await checkRateLimit(request, userId);

  // Parse and validate request body
  const body = await request.json();
  const data = validateRequestBody(visitedSchema, body);

  log.info("Toggling visited status", { userId, data });

  const result = await toggleVisited({
    userId,
    listingId: data.listingId,
    action: data.action,
  });

  return sendSuccessResponse(result);
});

export const GET = asyncHandler(async (request: NextRequest) => {
  // Get session
  const session = await requireAuth(request);
  const userId = session.user.id;

  // Rate limiting
  await checkRateLimit(request, userId);

  log.info("Fetching user visited items", { userId });

  const visited = await getUserVisited(userId);

  return sendSuccessResponse({ visited });
});
