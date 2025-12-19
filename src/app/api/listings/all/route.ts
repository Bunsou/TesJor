import { NextRequest } from "next/server";
import { asyncHandler, requireAuth } from "@/server/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { log } from "@/shared/utils";
import { getAllListings } from "@/server/services/listings";

export const GET = asyncHandler(async (request: NextRequest) => {
  // Require authentication
  await requireAuth(request);

  // Get category filter from query params
  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get("categories");
  const categories = categoryParam ? categoryParam.split(",") : [];

  // If no categories selected, return empty array
  if (categories.length === 0) {
    return sendSuccessResponse({ items: [] });
  }

  log.info("Fetching all listings", { categories });

  const items = await getAllListings(categories);

  return sendSuccessResponse({ items });
});
