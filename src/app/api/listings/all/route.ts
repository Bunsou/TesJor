import { NextRequest } from "next/server";
import { asyncHandler, requireAuth } from "@/server/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { log } from "@/shared/utils";
import { getAllListings } from "@/server/services/listings";

export const GET = asyncHandler(async (request: NextRequest) => {
  // Require authentication
  await requireAuth(request);

  console.log("Hello 11");
  // Get category filter from query params
  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get("category");
  const categories = categoryParam ? categoryParam.split(",") : [];

  // If no categories selected, return empty array
  console.log("Categories 11:", categories);
  if (categories.length === 0) {
    return sendSuccessResponse({ items: [] });
  }

  log.info("Fetching all listings", { categories });

  const items = await getAllListings(categories);

  return sendSuccessResponse({ items }, "Listings retrieved successfully", {
    cache: {
      maxAge: 60, // Browser cache: 1 minute
      sMaxAge: 300, // CDN cache: 5 minutes
      staleWhileRevalidate: 600, // Serve stale for 10 minutes while revalidating
    },
  });
});
