import { NextRequest } from "next/server";
import { asyncHandler } from "@/server/middleware";
import { checkRateLimit } from "@/server/middleware";
import { validateRequestQuery } from "@/shared/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { listingsQuerySchema } from "@/features/listings/schemas";
import { getListings } from "@/server/services/listings";

export const GET = asyncHandler(async (request: NextRequest) => {
  // Rate limiting
  await checkRateLimit(request);

  // Parse query params
  const searchParams = request.nextUrl.searchParams;
  const rawParams = {
    category: searchParams.get("category") || undefined,
    province: searchParams.get("province") || undefined,
    tag: searchParams.get("tag") || undefined,
    sortByRating: searchParams.get("sortByRating") || undefined,
    sortByPrice: searchParams.get("sortByPrice") || undefined,
    q: searchParams.get("q") || undefined,
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "10",
  };

  const query = validateRequestQuery(listingsQuerySchema, rawParams);

  const result = await getListings(query);

  // Add caching for better performance
  return sendSuccessResponse(result, undefined, {
    cache: {
      maxAge: 30, // Cache for 30 seconds in browser
      sMaxAge: 60, // Cache for 60 seconds in CDN
      staleWhileRevalidate: 300, // Serve stale content for 5 minutes while revalidating
    },
  });
});
