import { NextRequest } from "next/server";
import { asyncHandler, checkRateLimit } from "@/server/middleware";
import type { RouteContext } from "@/server/middleware";
import { validateRequestParams } from "@/shared/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { log } from "@/shared/utils";
import { AppError } from "@/shared/utils";
import { itemIdSchema } from "@/features/listings/schemas";
import { getItemById } from "@/server/services/listings";

export const GET = asyncHandler<{ id: string }>(
  async (request: NextRequest, context?: RouteContext<{ id: string }>) => {
    // Rate limiting
    await checkRateLimit(request);

    const params = await context!.params;
    const validated = validateRequestParams(itemIdSchema, { id: params.id });

    log.info("Fetching item", { id: validated.id });

    const item = await getItemById(validated.id);

    if (!item) {
      throw new AppError("NOT_FOUND", "Item not found");
    }

    return sendSuccessResponse(item);
  }
);
