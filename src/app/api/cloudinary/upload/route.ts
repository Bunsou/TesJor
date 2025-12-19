import { NextRequest } from "next/server";
import { asyncHandler, requireAdmin } from "@/server/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { AppError } from "@/shared/utils";
import { uploadFile } from "@/server/services/upload";

export const POST = asyncHandler(async (request: NextRequest) => {
  // Check if user is authenticated and is admin
  await requireAdmin(request);

  // Get the file from the request
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    throw new AppError("VALIDATION_ERROR", "No file provided");
  }

  // Convert file to base64
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await uploadFile(base64File);

  return sendSuccessResponse(result);
});
