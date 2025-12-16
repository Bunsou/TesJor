import { NextRequest } from "next/server";
import { db } from "@/db";
import { userProgress } from "@/db/schema";
import { errorResponse, successResponse } from "@/lib/utils";
import { ratelimit, getIdentifier } from "@/lib/ratelimit";
import { log } from "@/lib/logger";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

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

    const userId = session.user.id;

    // Fetch all user progress records
    const progressRecords = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .orderBy(desc(userProgress.visitedAt));

    // Calculate stats
    const bookmarkedCount = progressRecords.filter(
      (record) => record.isBookmarked
    ).length;

    const visitedCount = progressRecords.filter(
      (record) => record.isVisited
    ).length;

    // Calculate points: 10 points per visit, 5 points per bookmark
    const points = visitedCount * 10 + bookmarkedCount * 5;

    // Get categories visited (unique)
    const categoriesVisited = [
      ...new Set(
        progressRecords
          .filter((record) => record.isVisited)
          .map((record) => {
            if (record.placeId) return "place";
            if (record.activityId) return "activity";
            if (record.foodId) return "food";
            if (record.drinkId) return "drink";
            if (record.souvenirId) return "souvenir";
            return null;
          })
          .filter(Boolean)
      ),
    ];

    log.info("Fetched user stats", {
      userId,
      bookmarkedCount,
      visitedCount,
      points,
    });

    return successResponse({
      bookmarkedCount,
      visitedCount,
      points,
      categoriesVisited,
      totalProgress: progressRecords.length,
    });
  } catch (error) {
    log.error("Error fetching user stats", { error });
    return errorResponse("Internal server error", 500);
  }
}
