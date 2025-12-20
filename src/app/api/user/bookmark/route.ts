import { NextRequest } from "next/server";
import { asyncHandler, requireAuth, checkRateLimit } from "@/server/middleware";
import { validateRequestBody } from "@/shared/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { log } from "@/shared/utils";
import { bookmarkSchema } from "@/features/user/schemas";
import { toggleBookmark, getUserBookmarks } from "@/server/services/user";

export const POST = asyncHandler(async (request: NextRequest) => {
  // Get session
  const session = await requireAuth(request);
  const userId = session.user.id;

  // Rate limiting
  await checkRateLimit(request, userId);

  // Parse and validate request body
  const body = await request.json();
  const data = validateRequestBody(bookmarkSchema, body);

  log.info("Toggling bookmark", { userId, data });

  const result = await toggleBookmark({
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

  log.info("Fetching user bookmarks", { userId });

  const bookmarks = await getUserBookmarks(userId);

  return sendSuccessResponse({ bookmarks });
});
