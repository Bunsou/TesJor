import { NextRequest } from "next/server";
import { asyncHandler, checkRateLimit } from "@/server/middleware";
import type { RouteContext } from "@/server/middleware";
import { validateRequestParams } from "@/shared/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { log } from "@/shared/utils";
import { AppError } from "@/shared/utils";
import { slugParamSchema } from "@/features/listings/schemas";
import { getListingBySlug } from "@/server/services/listings";

export const GET = asyncHandler<{ slug: string }>(
  async (request: NextRequest, context?: RouteContext<{ slug: string }>) => {
    // Rate limiting
    await checkRateLimit(request);

    const params = await context!.params;
    const validated = validateRequestParams(slugParamSchema, {
      slug: params.slug,
    });

    log.info("Fetching listing", { slug: validated.slug });

    const listing = await getListingBySlug(validated.slug);

    if (!listing) {
      throw new AppError("NOT_FOUND", "Listing not found");
    }

    // Add caching for item details
    return sendSuccessResponse(listing, undefined, {
      cache: {
        maxAge: 60, // Cache for 1 minute in browser
        sMaxAge: 300, // Cache for 5 minutes in CDN
        staleWhileRevalidate: 600, // Serve stale for 10 minutes while revalidating
      },
    });
  }
);
