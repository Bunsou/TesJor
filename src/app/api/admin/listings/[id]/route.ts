import { NextRequest } from "next/server";
import { asyncHandler, requireAdmin } from "@/server/middleware";
import { sendSuccessResponse, AppError } from "@/shared/utils";
import { db } from "@/server/db";
import { listings } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const DELETE = asyncHandler(
  async (
    request: NextRequest,
    context?: { params: Promise<{ id: string }> }
  ) => {
    // Check if user is authenticated and is admin
    await requireAdmin(request);

    const { id } = await context!.params;

    if (!id) {
      throw new AppError("VALIDATION_ERROR", "Listing ID is required");
    }

    // Delete the listing (cascade will handle photos and reviews)
    const result = await db
      .delete(listings)
      .where(eq(listings.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError("NOT_FOUND", "Listing not found");
    }

    return sendSuccessResponse({ id }, "Listing deleted successfully");
  }
);
