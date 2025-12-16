import { NextRequest } from "next/server";
import { db } from "@/db";
import { places, activities, foods, drinks, souvenirs } from "@/db/schema";
import {
  createPlaceSchema,
  createActivitySchema,
  createFoodSchema,
  createDrinkSchema,
  createSouvenirSchema,
} from "@/lib/validators";
import { errorResponse, successResponse } from "@/lib/utils";
import { ratelimit, getIdentifier } from "@/lib/ratelimit";
import { log } from "@/lib/logger";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    // Check admin role
    const user = session.user as { role?: string };
    if (user.role !== "admin") {
      log.warn("Non-admin attempted to create content", {
        userId: session.user.id,
        email: session.user.email,
      });
      return errorResponse("Forbidden: Admin access required", 403);
    }

    // Rate limiting
    const identifier = getIdentifier(request, session.user.id);
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      log.warn("Rate limit exceeded", { identifier, userId: session.user.id });
      return errorResponse("Too many requests", 429);
    }

    // Parse request body
    const body = await request.json();
    const { category, ...data } = body;

    let result;
    let newItem;

    switch (category) {
      case "place":
        result = createPlaceSchema.safeParse(data);
        if (!result.success) {
          return errorResponse(
            "Invalid place data",
            400,
            result.error.flatten().fieldErrors
          );
        }
        [newItem] = await db.insert(places).values(result.data).returning();
        break;

      case "activity":
        result = createActivitySchema.safeParse(data);
        if (!result.success) {
          return errorResponse(
            "Invalid activity data",
            400,
            result.error.flatten().fieldErrors
          );
        }
        [newItem] = await db.insert(activities).values(result.data).returning();
        break;

      case "food":
        result = createFoodSchema.safeParse(data);
        if (!result.success) {
          return errorResponse(
            "Invalid food data",
            400,
            result.error.flatten().fieldErrors
          );
        }
        [newItem] = await db.insert(foods).values(result.data).returning();
        break;

      case "drink":
        result = createDrinkSchema.safeParse(data);
        if (!result.success) {
          return errorResponse(
            "Invalid drink data",
            400,
            result.error.flatten().fieldErrors
          );
        }
        [newItem] = await db.insert(drinks).values(result.data).returning();
        break;

      case "souvenir":
        result = createSouvenirSchema.safeParse(data);
        if (!result.success) {
          return errorResponse(
            "Invalid souvenir data",
            400,
            result.error.flatten().fieldErrors
          );
        }
        [newItem] = await db.insert(souvenirs).values(result.data).returning();
        break;

      default:
        return errorResponse("Invalid category", 400);
    }

    log.info("Content created by admin", {
      userId: session.user.id,
      email: session.user.email,
      category,
      itemId: newItem.id,
      itemName: newItem.name,
    });

    return successResponse({ item: newItem }, 201);
  } catch (error) {
    log.error("Failed to create content", { error });
    return errorResponse("Failed to create content", 500);
  }
}
