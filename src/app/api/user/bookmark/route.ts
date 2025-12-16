import { NextRequest } from "next/server";
import { db } from "@/db";
import { userProgress } from "@/db/schema";
import { bookmarkSchema } from "@/lib/validators";
import { errorResponse, successResponse } from "@/lib/utils";
import { ratelimit, getIdentifier } from "@/lib/ratelimit";
import { log } from "@/lib/logger";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return errorResponse("Unauthorized", 401);
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
    const result = bookmarkSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(
        "Invalid request data",
        400,
        result.error.flatten().fieldErrors
      );
    }

    const { itemId, category, action } = result.data;
    const userId = session.user.id;

    // Check if progress entry exists using explicit column reference
    let existing;
    switch (category) {
      case "place":
        existing = await db
          .select()
          .from(userProgress)
          .where(
            and(
              eq(userProgress.userId, userId),
              eq(userProgress.placeId, itemId)
            )
          )
          .limit(1);
        break;
      case "activity":
        existing = await db
          .select()
          .from(userProgress)
          .where(
            and(
              eq(userProgress.userId, userId),
              eq(userProgress.activityId, itemId)
            )
          )
          .limit(1);
        break;
      case "food":
        existing = await db
          .select()
          .from(userProgress)
          .where(
            and(
              eq(userProgress.userId, userId),
              eq(userProgress.foodId, itemId)
            )
          )
          .limit(1);
        break;
      case "drink":
        existing = await db
          .select()
          .from(userProgress)
          .where(
            and(
              eq(userProgress.userId, userId),
              eq(userProgress.drinkId, itemId)
            )
          )
          .limit(1);
        break;
      case "souvenir":
        existing = await db
          .select()
          .from(userProgress)
          .where(
            and(
              eq(userProgress.userId, userId),
              eq(userProgress.souvenirId, itemId)
            )
          )
          .limit(1);
        break;
      default:
        return errorResponse("Invalid category", 400);
    }

    if (action === "add") {
      if (existing.length > 0) {
        // Update existing entry
        await db
          .update(userProgress)
          .set({ isBookmarked: true })
          .where(eq(userProgress.id, existing[0].id));
      } else {
        // Create new entry with explicit column based on category
        const baseValues = {
          userId,
          isBookmarked: true,
          isVisited: false,
        };

        let insertValues;
        switch (category) {
          case "place":
            insertValues = { ...baseValues, placeId: itemId };
            break;
          case "activity":
            insertValues = { ...baseValues, activityId: itemId };
            break;
          case "food":
            insertValues = { ...baseValues, foodId: itemId };
            break;
          case "drink":
            insertValues = { ...baseValues, drinkId: itemId };
            break;
          case "souvenir":
            insertValues = { ...baseValues, souvenirId: itemId };
            break;
          default:
            return errorResponse("Invalid category", 400);
        }
        await db.insert(userProgress).values(insertValues);
      }

      log.info("Item bookmarked", { userId, itemId, category });
      return successResponse({ bookmarked: true });
    } else {
      // Remove bookmark
      if (existing.length > 0) {
        await db
          .update(userProgress)
          .set({ isBookmarked: false })
          .where(eq(userProgress.id, existing[0].id));

        log.info("Bookmark removed", { userId, itemId, category });
      }

      return successResponse({ bookmarked: false });
    }
  } catch (error) {
    log.error("Failed to update bookmark", { error });
    return errorResponse("Failed to update bookmark", 500);
  }
}
