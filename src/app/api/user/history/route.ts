import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { userProgress, listings, reviews } from "@/server/db/schema";
import {
  errorResponse,
  successResponse,
  sendSuccessResponse,
} from "@/shared/utils";
import {
  ratelimit,
  getIdentifier,
} from "@/server/middleware/ratelimit.middleware";
import { log } from "@/shared/utils/logger";
import { auth } from "@/server/services/auth";
import { eq, or, and, desc } from "drizzle-orm";

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

    // Fetch visited places with listing details
    const visitedPlaces = await db
      .select({
        id: userProgress.id,
        listingId: listings.id,
        title: listings.title,
        category: listings.category,
        mainImage: listings.mainImage,
        xpPoints: listings.xpPoints,
        visitedAt: userProgress.visitedAt,
      })
      .from(userProgress)
      .innerJoin(listings, eq(userProgress.listingId, listings.id))
      .where(
        and(eq(userProgress.userId, userId), eq(userProgress.isVisited, true))
      )
      .orderBy(desc(userProgress.visitedAt));

    // Fetch user reviews with listing details
    const userReviews = await db
      .select({
        id: reviews.id,
        listingId: listings.id,
        title: listings.title,
        category: listings.category,
        mainImage: listings.mainImage,
        rating: reviews.rating,
        content: reviews.content,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .innerJoin(listings, eq(reviews.listingId, listings.id))
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));

    // Format history items
    const historyItems = [
      // Add visits
      ...visitedPlaces.map((visit) => ({
        id: `visit-${visit.id}`,
        type: "visit" as const,
        title: visit.title,
        subtitle: `Visited ${visit.category}`,
        date: visit.visitedAt
          ? new Date(visit.visitedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Unknown date",
        xp: visit.xpPoints,
        image: visit.mainImage || undefined,
        timestamp: visit.visitedAt ? new Date(visit.visitedAt).getTime() : 0,
      })),
      // Add reviews
      ...userReviews.map((review) => ({
        id: `review-${review.id}`,
        type: "review" as const,
        title: review.title,
        subtitle: `Reviewed ${review.category}`,
        date: new Date(review.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        rating: review.rating,
        note: review.content || undefined,
        image: review.mainImage || undefined,
        timestamp: new Date(review.createdAt).getTime(),
      })),
    ];

    // Sort by timestamp (most recent first)
    historyItems.sort((a, b) => b.timestamp - a.timestamp);

    // Remove timestamp field before sending
    const formattedItems = historyItems.map(({ timestamp, ...item }) => item);

    log.info("Fetched user history", {
      userId,
      totalItems: formattedItems.length,
      visits: visitedPlaces.length,
      reviews: userReviews.length,
    });

    return sendSuccessResponse(
      {
        items: formattedItems,
        count: formattedItems.length,
      },
      undefined,
      {
        cache: {
          maxAge: 30, // Cache for 30 seconds in browser
          sMaxAge: 60, // Cache for 60 seconds in CDN
          staleWhileRevalidate: 180, // Serve stale for 3 minutes while revalidating
        },
      }
    );
  } catch (error) {
    log.error("Failed to fetch user history", { error });
    return errorResponse("Failed to fetch user history", 500);
  }
}
