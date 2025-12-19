import { NextRequest } from "next/server";
import { asyncHandler } from "@/server/middleware";
import { checkRateLimit } from "@/server/middleware";
import { validateRequestQuery } from "@/shared/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { log } from "@/shared/utils";
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
    q: searchParams.get("q") || undefined,
    cursor: searchParams.get("cursor") || undefined,
    limit: searchParams.get("limit") || undefined,
  };

  const query = validateRequestQuery(listingsQuerySchema, rawParams);

  log.info("Fetching listings", { query });

  const result = await getListings(query);

  return sendSuccessResponse(result);
});
