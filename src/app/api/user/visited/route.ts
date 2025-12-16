import { NextRequest } from "next/server";
import { db } from "@/db";
import { userProgress } from "@/db/schema";
import { visitedSchema } from "@/lib/validators";
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
    const result = visitedSchema.safeParse(body);

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
      const visitedAt = new Date();

      if (existing.length > 0) {
        // Update existing entry
        await db
          .update(userProgress)
          .set({ isVisited: true, visitedAt })
          .where(eq(userProgress.id, existing[0].id));
      } else {
        // Create new entry with explicit column based on category
        const values: Record<string, string | boolean | Date> = {
          userId,
          isBookmarked: false,
          isVisited: true,
          visitedAt,
        };
        switch (category) {
          case "place":
            values.placeId = itemId;
            break;
          case "activity":
            values.activityId = itemId;
            break;
          case "food":
            values.foodId = itemId;
            break;
          case "drink":
            values.drinkId = itemId;
            break;
          case "souvenir":
            values.souvenirId = itemId;
            break;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await db.insert(userProgress).values(values as any);
      }

      log.info("Item marked as visited", { userId, itemId, category });
      return successResponse({ visited: true, visitedAt });
    } else {
      // Remove visited status
      if (existing.length > 0) {
        await db
          .update(userProgress)
          .set({ isVisited: false, visitedAt: null })
          .where(eq(userProgress.id, existing[0].id));

        log.info("Visited status removed", { userId, itemId, category });
      }

      return successResponse({ visited: false });
    }
  } catch (error) {
    log.error("Failed to update visited status", { error });
    return errorResponse("Failed to update visited status", 500);
  }
}
