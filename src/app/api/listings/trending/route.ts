import { NextRequest } from "next/server";
import { asyncHandler } from "@/server/middleware";
import { checkRateLimit } from "@/server/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { getTrendingListings } from "@/server/services/listings";

export const GET = asyncHandler(async (request: NextRequest) => {
  // Rate limiting
  await checkRateLimit(request);

  // Parse query params
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category") || undefined;

  const result = await getTrendingListings(category);

  // Add caching for better performance
  return sendSuccessResponse(result, undefined, {
    cache: {
      maxAge: 60, // Cache for 1 minute in browser
      sMaxAge: 300, // Cache for 5 minutes in CDN
      staleWhileRevalidate: 600, // Serve stale content for 10 minutes while revalidating
    },
  });
});
