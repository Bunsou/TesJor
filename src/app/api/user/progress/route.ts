import { NextRequest } from "next/server";
import { db } from "@/db";
import {
  userProgress,
  places,
  activities,
  foods,
  drinks,
  souvenirs,
} from "@/db/schema";
import { errorResponse, successResponse } from "@/lib/utils";
import { ratelimit, getIdentifier } from "@/lib/ratelimit";
import { log } from "@/lib/logger";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type"); // "bookmarked" or "visited"
    const itemId = searchParams.get("itemId"); // optional: check specific item

    const userId = session.user.id;

    // If checking specific item progress
    if (itemId) {
      const progress = await db
        .select()
        .from(userProgress)
        .where(
          and(
            eq(userProgress.userId, userId)
            // Check all possible category ID columns
            // This is a bit hacky but works since only one will match
          )
        );

      // Find the progress entry that matches this itemId
      const matchedProgress = progress.find(
        (p) =>
          p.placeId === itemId ||
          p.activityId === itemId ||
          p.foodId === itemId ||
          p.drinkId === itemId ||
          p.souvenirId === itemId
      );

      return successResponse({
        isBookmarked: matchedProgress?.isBookmarked || false,
        isVisited: matchedProgress?.isVisited || false,
        visitedAt: matchedProgress?.visitedAt || null,
      });
    }

    // Fetch all user progress
    const allProgress = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          type === "bookmarked"
            ? eq(userProgress.isBookmarked, true)
            : type === "visited"
            ? eq(userProgress.isVisited, true)
            : undefined
        )
      );

    log.info("Fetched user progress", {
      userId,
      type,
      count: allProgress.length,
    });

    // Now fetch the actual items for each progress entry
    const items = [];

    for (const progress of allProgress) {
      let item = null;
      let category = "";

      if (progress.placeId) {
        const result = await db
          .select()
          .from(places)
          .where(eq(places.id, progress.placeId))
          .limit(1);
        if (result[0]) {
          item = result[0];
          category = "place";
        }
      } else if (progress.activityId) {
        const result = await db
          .select()
          .from(activities)
          .where(eq(activities.id, progress.activityId))
          .limit(1);
        if (result[0]) {
          item = result[0];
          category = "activity";
        }
      } else if (progress.foodId) {
        const result = await db
          .select()
          .from(foods)
          .where(eq(foods.id, progress.foodId))
          .limit(1);
        if (result[0]) {
          item = result[0];
          category = "food";
        }
      } else if (progress.drinkId) {
        const result = await db
          .select()
          .from(drinks)
          .where(eq(drinks.id, progress.drinkId))
          .limit(1);
        if (result[0]) {
          item = result[0];
          category = "drink";
        }
      } else if (progress.souvenirId) {
        const result = await db
          .select()
          .from(souvenirs)
          .where(eq(souvenirs.id, progress.souvenirId))
          .limit(1);
        if (result[0]) {
          item = result[0];
          category = "souvenir";
        }
      }

      if (item) {
        items.push({
          ...item,
          category,
          isBookmarked: progress.isBookmarked,
          isVisited: progress.isVisited,
          visitedAt: progress.visitedAt,
        });
      }
    }

    return successResponse({
      items,
      count: items.length,
    });
  } catch (error) {
    log.error("Failed to fetch user progress", { error });
    return errorResponse("Failed to fetch user progress", 500);
  }
}
