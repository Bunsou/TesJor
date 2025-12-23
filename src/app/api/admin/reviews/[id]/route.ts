import { NextRequest } from "next/server";
import { asyncHandler, requireAdmin } from "@/server/middleware";
import { sendSuccessResponse, AppError } from "@/shared/utils";
import { db } from "@/server/db";
import { reviews } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const DELETE = asyncHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    // Check if user is authenticated and is admin
    await requireAdmin(request);

    const { id } = await params;

    if (!id) {
      throw new AppError("VALIDATION_ERROR", "Review ID is required");
    }

    // Delete the review
    const result = await db
      .delete(reviews)
      .where(eq(reviews.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError("NOT_FOUND", "Review not found");
    }

    return sendSuccessResponse({ id }, "Review deleted successfully");
  }
);
