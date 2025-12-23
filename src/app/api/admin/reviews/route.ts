import { NextRequest } from "next/server";
import { asyncHandler, requireAdmin } from "@/server/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { db } from "@/server/db";
import { reviews, users, listings } from "@/server/db/schema";
import { desc, eq, ilike, or, sql, and } from "drizzle-orm";

export const GET = asyncHandler(async (request: NextRequest) => {
  // Check if user is authenticated and is admin
  await requireAdmin(request);

  // Parse query params
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const rating = searchParams.get("rating") || "";
  const sort = searchParams.get("sort") || "newest";

  const offset = (page - 1) * limit;

  // Build conditions
  const conditions = [];

  // Search filter
  if (search) {
    conditions.push(
      or(
        ilike(users.name, `%${search}%`),
        ilike(listings.title, `%${search}%`),
        ilike(reviews.content, `%${search}%`)
      )!
    );
  }

  // Rating filter
  if (rating) {
    conditions.push(eq(reviews.rating, Number(rating)));
  }

  // Sort order
  const orderBy =
    sort === "oldest" ? [reviews.createdAt] : [desc(reviews.createdAt)];

  // Get reviews with user and listing info
  const reviewsQuery = db
    .select({
      id: reviews.id,
      userId: reviews.userId,
      userName: users.name,
      userImage: users.image,
      userRole: users.role,
      listingId: reviews.listingId,
      listingTitle: listings.title,
      listingProvince: listings.province,
      rating: reviews.rating,
      content: reviews.content,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .innerJoin(listings, eq(reviews.listingId, listings.id))
    .orderBy(...orderBy)
    .limit(limit + 1)
    .offset(offset);

  const items = await (conditions.length > 0
    ? reviewsQuery.where(and(...conditions))
    : reviewsQuery);

  // Get total count
  const countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .innerJoin(listings, eq(reviews.listingId, listings.id));

  const [{ count }] = await (conditions.length > 0
    ? countQuery.where(and(...conditions))
    : countQuery);

  // Check if there are more items
  const hasMore = items.length > limit;
  const itemsToReturn = items.slice(0, limit);

  return sendSuccessResponse({
    items: itemsToReturn,
    page,
    nextPage: hasMore ? page + 1 : null,
    hasMore,
    total: Number(count),
  });
});
