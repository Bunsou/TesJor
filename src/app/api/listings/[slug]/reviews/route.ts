import { NextRequest } from "next/server";
import { asyncHandler, checkRateLimit, requireAuth } from "@/server/middleware";
import type { RouteContext } from "@/server/middleware";
import {
  validateRequestBody,
  validateRequestParams,
} from "@/shared/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { log } from "@/shared/utils";
import { AppError } from "@/shared/utils";
import { z } from "zod";
import { db } from "@/server/db";
import { reviews, listings } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";

const slugParamSchema = z.object({
  slug: z.string().min(1),
});

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  content: z.string().optional(),
});

export const POST = asyncHandler<{ slug: string }>(
  async (request: NextRequest, context?: RouteContext<{ slug: string }>) => {
    // Rate limiting
    await checkRateLimit(request);

    // Require authentication
    const session = await requireAuth(request);

    const params = await context!.params;
    const validated = validateRequestParams(slugParamSchema, {
      slug: params.slug,
    });

    const body = await request.json();
    const reviewData = validateRequestBody(reviewSchema, body);

    log.info("Creating review", {
      slug: validated.slug,
      userId: session.user.id,
    });

    // Get listing by slug
    const [listing] = await db
      .select()
      .from(listings)
      .where(eq(listings.slug, validated.slug))
      .limit(1);

    if (!listing) {
      throw new AppError("NOT_FOUND", "Listing not found");
    }

    // Create new review (allow multiple reviews per user)
    const [newReview] = await db
      .insert(reviews)
      .values({
        listingId: listing.id,
        userId: session.user.id,
        rating: reviewData.rating,
        content: reviewData.content,
      })
      .returning();

    // Recalculate average rating
    await updateListingAvgRating(listing.id);

    return sendSuccessResponse(newReview, "Review created successfully");
  }
);

async function updateListingAvgRating(listingId: string) {
  const result = await db
    .select({
      avgRating: sql<number>`AVG(${reviews.rating})::decimal(3,2)`,
    })
    .from(reviews)
    .where(eq(reviews.listingId, listingId));

  const avgRating = result[0]?.avgRating;

  await db
    .update(listings)
    .set({ avgRating: avgRating ? avgRating.toString() : null })
    .where(eq(listings.id, listingId));
}
