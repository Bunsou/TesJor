import { NextRequest } from "next/server";
import {
  asyncHandler,
  requireAdmin,
  checkRateLimit,
} from "@/server/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { log, AppError } from "@/shared/utils";
import { createListingSchema } from "@/features/admin/schemas";
import { createListing } from "@/server/services/listings";

export const POST = asyncHandler(async (request: NextRequest) => {
  // Get session and verify admin
  const session = await requireAdmin(request);
  const userId = session.user.id;

  // Rate limiting
  await checkRateLimit(request, userId);

  // Parse request body
  const body = await request.json();

  // Validate using unified schema
  const result = createListingSchema.safeParse(body);
  if (!result.success) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Invalid listing data",
      result.error.flatten().fieldErrors
    );
  }

  const newListing = await createListing(result.data);

  log.info("Listing created by admin", {
    userId,
    email: session.user.email,
    category: newListing.category,
    listingId: newListing.id,
    listingTitle: newListing.title,
  });

  return sendSuccessResponse({ listing: newListing }, undefined, 201);
});
