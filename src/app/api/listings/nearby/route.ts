import { NextRequest } from "next/server";
import { asyncHandler, checkRateLimit } from "@/server/middleware";
import { validateRequestQuery } from "@/shared/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { log } from "@/shared/utils";
import { nearbyQuerySchema } from "@/features/listings/schemas";
import { getNearbyListings } from "@/server/services/listings";

export const GET = asyncHandler(async (request: NextRequest) => {
  // Rate limiting
  await checkRateLimit(request);

  // Parse query params
  const searchParams = request.nextUrl.searchParams;
  const rawParams = {
    lat: searchParams.get("lat"),
    lng: searchParams.get("lng"),
    radius: searchParams.get("radius"),
    category: searchParams.get("category") || undefined,
  };

  const query = validateRequestQuery(nearbyQuerySchema, rawParams);

  log.info("Fetching nearby listings", { query });

  const result = await getNearbyListings({
    lat: query.lat,
    lng: query.lng,
    radius: query.radius,
    category: query.category,
  });

  return sendSuccessResponse(result, "Nearby listings retrieved successfully", {
    cache: {
      maxAge: 30, // Browser cache: 30 seconds
      sMaxAge: 60, // CDN cache: 1 minute
      staleWhileRevalidate: 300, // Serve stale for 5 minutes while revalidating
    },
  });
});
