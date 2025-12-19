import { NextRequest } from "next/server";
import { asyncHandler } from "@/server/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { AppError } from "@/shared/utils";
import { deleteFile, extractPublicId } from "@/server/services/upload";

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { url, publicId } = body;

  if (!url && !publicId) {
    throw new AppError("VALIDATION_ERROR", "URL or publicId is required");
  }

  // Extract public ID from URL if not provided
  const idToDelete = publicId || extractPublicId(url);

  if (!idToDelete) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Could not extract public ID from URL"
    );
  }

  await deleteFile(idToDelete);

  return sendSuccessResponse({ success: true });
});
