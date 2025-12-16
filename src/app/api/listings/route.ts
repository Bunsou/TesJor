import { NextRequest } from "next/server";
import { db } from "@/db";
import { places, activities, foods, drinks, souvenirs } from "@/db/schema";
import { listingsQuerySchema } from "@/lib/validators";
import { errorResponse, successResponse } from "@/lib/utils";
import { ratelimit, getIdentifier } from "@/lib/ratelimit";
import { log } from "@/lib/logger";
import { or, and, ilike, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getIdentifier(request);
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      log.warn("Rate limit exceeded", { identifier });
      return errorResponse("Too many requests", 429);
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const result = listingsQuerySchema.safeParse({
      category: searchParams.get("category"),
      province: searchParams.get("province"),
      q: searchParams.get("q"),
      cursor: searchParams.get("cursor"),
      limit: searchParams.get("limit"),
    });

    if (!result.success) {
      return errorResponse(
        "Invalid query parameters",
        400,
        result.error.flatten().fieldErrors
      );
    }

    const { category, province, q, limit } = result.data;

    // Build query based on category
    let items: Array<{
      id: string;
      name: string;
      nameKh?: string | null;
      description: string;
      category: string;
      createdAt: Date;
      [key: string]: unknown;
    }> = [];

    if (!category || category === "place") {
      const conditions = [];
      if (province) conditions.push(ilike(places.province, province));
      if (q) {
        conditions.push(
          or(
            ilike(places.name, `%${q}%`),
            ilike(places.nameKh, `%${q}%`),
            ilike(places.description, `%${q}%`)
          )!
        );
      }

      const query = db.select().from(places);
      const placeResults = await (conditions.length > 0
        ? query.where(and(...conditions)!)
        : query
      )
        .orderBy(desc(places.createdAt))
        .limit(limit);

      items.push(...placeResults.map((p) => ({ ...p, category: "place" })));
    }

    if (!category || category === "activity") {
      const conditions = [];
      if (province) conditions.push(ilike(activities.province, province));
      if (q) {
        conditions.push(
          or(
            ilike(activities.name, `%${q}%`),
            ilike(activities.nameKh, `%${q}%`),
            ilike(activities.description, `%${q}%`)
          )!
        );
      }

      const query = db.select().from(activities);
      const activityResults = await (conditions.length > 0
        ? query.where(and(...conditions)!)
        : query
      )
        .orderBy(desc(activities.createdAt))
        .limit(limit);

      items.push(
        ...activityResults.map((a) => ({ ...a, category: "activity" }))
      );
    }

    if (!category || category === "food") {
      const query = db.select().from(foods);
      const foodResults = await (q
        ? query.where(
            or(
              ilike(foods.name, `%${q}%`),
              ilike(foods.nameKh, `%${q}%`),
              ilike(foods.description, `%${q}%`)
            )!
          )
        : query
      )
        .orderBy(desc(foods.createdAt))
        .limit(limit);

      items.push(...foodResults.map((f) => ({ ...f, category: "food" })));
    }

    if (!category || category === "drink") {
      const query = db.select().from(drinks);
      const drinkResults = await (q
        ? query.where(
            or(
              ilike(drinks.name, `%${q}%`),
              ilike(drinks.nameKh, `%${q}%`),
              ilike(drinks.description, `%${q}%`)
            )!
          )
        : query
      )
        .orderBy(desc(drinks.createdAt))
        .limit(limit);

      items.push(...drinkResults.map((d) => ({ ...d, category: "drink" })));
    }

    if (!category || category === "souvenir") {
      const query = db.select().from(souvenirs);
      const souvenirResults = await (q
        ? query.where(
            or(
              ilike(souvenirs.name, `%${q}%`),
              ilike(souvenirs.nameKh, `%${q}%`),
              ilike(souvenirs.description, `%${q}%`)
            )!
          )
        : query
      )
        .orderBy(desc(souvenirs.createdAt))
        .limit(limit);

      items.push(
        ...souvenirResults.map((s) => ({ ...s, category: "souvenir" }))
      );
    }

    // Sort by createdAt and limit
    items = items
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);

    // Simple cursor pagination (use last item's ID)
    const nextCursor =
      items.length === limit ? items[items.length - 1].id : null;

    return successResponse({
      items,
      nextCursor,
      hasMore: items.length === limit,
    });
  } catch (error) {
    log.error("Failed to fetch listings", { error });
    return errorResponse("Failed to fetch listings", 500);
  }
}
