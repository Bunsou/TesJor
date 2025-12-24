import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { userProgress, listings } from "@/server/db/schema";
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
            eq(userProgress.userId, userId),
            eq(userProgress.listingId, itemId)
          )
        )
        .limit(1);

      const matchedProgress = progress[0];

      return successResponse({
        isBookmarked: matchedProgress?.isBookmarked || false,
        isVisited: matchedProgress?.isVisited || false,
        visitedAt: matchedProgress?.visitedAt || null,
      });
    }

    // Fetch items with user progress metadata using join
    const items = await db
      .select({
        id: listings.id,
        slug: listings.slug,
        category: listings.category,
        title: listings.title,
        titleKh: listings.titleKh,
        description: listings.description,
        province: listings.province,
        lat: listings.lat,
        lng: listings.lng,
        mainImage: listings.mainImage,
        priceLevel: listings.priceLevel,
        operatingHours: listings.operatingHours,
        isBookmarked: userProgress.isBookmarked,
        isVisited: userProgress.isVisited,
        visitedAt: userProgress.visitedAt,
      })
      .from(userProgress)
      .innerJoin(listings, eq(userProgress.listingId, listings.id))
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
      count: items.length,
    });

    // Add caching for progress data
    return sendSuccessResponse(
      {
        items,
        count: items.length,
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
    log.error("Failed to fetch user progress", { error });
    return errorResponse("Failed to fetch user progress", 500);
  }
}
