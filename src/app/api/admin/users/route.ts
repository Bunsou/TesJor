import { NextRequest } from "next/server";
import { asyncHandler, requireAdmin } from "@/server/middleware";
import { sendSuccessResponse } from "@/shared/utils";
import { db } from "@/server/db";
import { users, sessions } from "@/server/db/schema";
import { desc, eq, ilike, or, sql, and } from "drizzle-orm";

export const GET = asyncHandler(async (request: NextRequest) => {
  // Check if user is authenticated and is admin
  await requireAdmin(request);

  // Parse query params
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";
  const dateFilter = searchParams.get("date") || "";

  const offset = (page - 1) * limit;

  // Build conditions
  const conditions = [];

  // Search filter (name, email, or id)
  if (search) {
    conditions.push(
      or(
        ilike(users.name, `%${search}%`),
        ilike(users.email, `%${search}%`),
        ilike(users.id, `%${search}%`)
      )!
    );
  }

  // Role filter
  if (role) {
    conditions.push(eq(users.role, role as "user" | "admin"));
  }

  // Date filter
  if (dateFilter) {
    const now = new Date();
    const daysAgo = Number(dateFilter);
    const dateThreshold = new Date(now);
    dateThreshold.setDate(now.getDate() - daysAgo);

    conditions.push(sql`${users.createdAt} >= ${dateThreshold}`);
  }

  // Get users with last active session
  const usersQuery = db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      image: users.image,
      role: users.role,
      xpPoints: users.xpPoints,
      createdAt: users.createdAt,
      lastActive: sql<Date | null>`(
        SELECT MAX(${sessions.updatedAt})
        FROM ${sessions}
        WHERE ${sessions.userId} = ${users.id}
      )`,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit + 1)
    .offset(offset);

  const items = await (conditions.length > 0
    ? usersQuery.where(and(...conditions))
    : usersQuery);

  // Get total count
  const countQuery = db.select({ count: sql<number>`count(*)` }).from(users);

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
