import { NextRequest } from "next/server";
import { asyncHandler, requireAdmin } from "@/server/middleware";
import { sendSuccessResponse, AppError } from "@/shared/utils";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const DELETE = asyncHandler(
  async (
    request: NextRequest,
    context?: { params: Promise<{ id: string }> }
  ) => {
    await requireAdmin(request);

    const { id } = await context!.params;

    if (!id) {
      throw new AppError("VALIDATION_ERROR", "User ID is required");
    }

    // Delete the user
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (deletedUser.length === 0) {
      throw new AppError("NOT_FOUND", "User not found");
    }

    return sendSuccessResponse({ message: "User deleted successfully" });
  }
);
