import { NextRequest } from "next/server";
import { asyncHandler, checkRateLimit } from "@/server/middleware";
import { validateRequestQuery } from "@/shared/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { log } from "@/shared/utils";
import { nearbyQuerySchema } from "@/features/listings/schemas";
import { getNearbyItems } from "@/server/services/listings";

export const GET = asyncHandler(async (request: NextRequest) => {
  // Rate limiting
  await checkRateLimit(request);

  // Parse query params
  const searchParams = request.nextUrl.searchParams;
  const rawParams = {
    lat: searchParams.get("lat"),
    lng: searchParams.get("lng"),
    radius: searchParams.get("radius"),
  };

  const query = validateRequestQuery(nearbyQuerySchema, rawParams);

  log.info("Fetching nearby items", { query });

  const result = await getNearbyItems({
    lat: query.lat,
    lng: query.lng,
    radius: query.radius,
  });

  return sendSuccessResponse(result);
});
