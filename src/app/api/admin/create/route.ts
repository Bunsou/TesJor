import { NextRequest } from "next/server";
import {
  asyncHandler,
  requireAdmin,
  checkRateLimit,
} from "@/server/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { log, AppError } from "@/shared/utils";
import {
  createPlaceSchema,
  createActivitySchema,
  createFoodSchema,
  createDrinkSchema,
  createSouvenirSchema,
} from "@/features/admin/schemas";
import { createContent } from "@/server/services/listings";
import type { Category } from "@/shared/types";

export const POST = asyncHandler(async (request: NextRequest) => {
  // Get session and verify admin
  const session = await requireAdmin(request);
  const userId = session.user.id;

  // Rate limiting
  await checkRateLimit(request, userId);

  // Parse request body
  const body = await request.json();
  const { category, ...data } = body;

  // Validate based on category
  let validatedData;
  switch (category) {
    case "place":
      const placeResult = createPlaceSchema.safeParse(data);
      if (!placeResult.success) {
        throw new AppError(
          "VALIDATION_ERROR",
          "Invalid place data",
          placeResult.error.flatten().fieldErrors
        );
      }
      validatedData = placeResult.data;
      break;

    case "activity":
      const activityResult = createActivitySchema.safeParse(data);
      if (!activityResult.success) {
        throw new AppError(
          "VALIDATION_ERROR",
          "Invalid activity data",
          activityResult.error.flatten().fieldErrors
        );
      }
      validatedData = activityResult.data;
      break;

    case "food":
      const foodResult = createFoodSchema.safeParse(data);
      if (!foodResult.success) {
        throw new AppError(
          "VALIDATION_ERROR",
          "Invalid food data",
          foodResult.error.flatten().fieldErrors
        );
      }
      validatedData = foodResult.data;
      break;

    case "drink":
      const drinkResult = createDrinkSchema.safeParse(data);
      if (!drinkResult.success) {
        throw new AppError(
          "VALIDATION_ERROR",
          "Invalid drink data",
          drinkResult.error.flatten().fieldErrors
        );
      }
      validatedData = drinkResult.data;
      break;

    case "souvenir":
      const souvenirResult = createSouvenirSchema.safeParse(data);
      if (!souvenirResult.success) {
        throw new AppError(
          "VALIDATION_ERROR",
          "Invalid souvenir data",
          souvenirResult.error.flatten().fieldErrors
        );
      }
      validatedData = souvenirResult.data;
      break;

    default:
      throw new AppError("VALIDATION_ERROR", "Invalid category");
  }

  const newItem = await createContent(category as Category, validatedData);

  log.info("Content created by admin", {
    userId,
    email: session.user.email,
    category,
    itemId: newItem.id,
    itemName: newItem.name,
  });

  return sendSuccessResponse({ item: newItem }, undefined, 201);
});
