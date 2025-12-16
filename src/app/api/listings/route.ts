import { NextRequest } from "next/server";
import { db } from "@/db";
import { places, activities, foods, drinks, souvenirs } from "@/db/schema";
import { listingsQuerySchema } from "@/lib/validators";
import { errorResponse, successResponse } from "@/lib/utils";
import { ratelimit, getIdentifier } from "@/lib/ratelimit";
import { log } from "@/lib/logger";
import { or, and, ilike, desc, lt } from "drizzle-orm";

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
    const rawParams = {
      category: searchParams.get("category") || undefined,
      province: searchParams.get("province") || undefined,
      q: searchParams.get("q") || undefined,
      cursor: searchParams.get("cursor") || undefined,
      limit: searchParams.get("limit") || undefined,
    };

    const result = listingsQuerySchema.safeParse(rawParams);

    if (!result.success) {
      log.error("Validation failed for listings query", {
        rawParams,
        errors: result.error.flatten(),
      });
      return errorResponse(
        "Invalid query parameters",
        400,
        result.error.flatten().fieldErrors
      );
    }

    const { category, province, q, cursor, limit } = result.data;

    // If cursor is provided, parse the timestamp from it
    let cursorDate: Date | null = null;
    if (cursor) {
      try {
        // Cursor format: timestamp_itemId
        const [timestamp] = cursor.split("_");
        cursorDate = new Date(parseInt(timestamp));
        log.info("Using cursor for pagination", { cursor, cursorDate });
      } catch {
        log.warn("Invalid cursor format", { cursor });
      }
    }

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
      // Add cursor condition for pagination
      if (cursorDate) {
        conditions.push(lt(places.createdAt, cursorDate));
      }

      const query = db.select().from(places);
      const placeResults = await (conditions.length > 0
        ? query.where(and(...conditions)!)
        : cursorDate
        ? query.where(lt(places.createdAt, cursorDate))
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
      // Add cursor condition for pagination
      if (cursorDate) {
        conditions.push(lt(activities.createdAt, cursorDate));
      }

      const query = db.select().from(activities);
      const activityResults = await (conditions.length > 0
        ? query.where(and(...conditions)!)
        : cursorDate
        ? query.where(lt(activities.createdAt, cursorDate))
        : query
      )
        .orderBy(desc(activities.createdAt))
        .limit(limit);

      items.push(
        ...activityResults.map((a) => ({ ...a, category: "activity" }))
      );
    }

    if (!category || category === "food") {
      const conditions = [];
      if (q) {
        conditions.push(
          or(
            ilike(foods.name, `%${q}%`),
            ilike(foods.nameKh, `%${q}%`),
            ilike(foods.description, `%${q}%`)
          )!
        );
      }
      // Add cursor condition for pagination
      if (cursorDate) {
        conditions.push(lt(foods.createdAt, cursorDate));
      }

      const query = db.select().from(foods);
      const foodResults = await (conditions.length > 0
        ? query.where(and(...conditions)!)
        : cursorDate
        ? query.where(lt(foods.createdAt, cursorDate))
        : query
      )
        .orderBy(desc(foods.createdAt))
        .limit(limit);

      items.push(...foodResults.map((f) => ({ ...f, category: "food" })));
    }

    if (!category || category === "drink") {
      const conditions = [];
      if (q) {
        conditions.push(
          or(
            ilike(drinks.name, `%${q}%`),
            ilike(drinks.nameKh, `%${q}%`),
            ilike(drinks.description, `%${q}%`)
          )!
        );
      }
      // Add cursor condition for pagination
      if (cursorDate) {
        conditions.push(lt(drinks.createdAt, cursorDate));
      }

      const query = db.select().from(drinks);
      const drinkResults = await (conditions.length > 0
        ? query.where(and(...conditions)!)
        : cursorDate
        ? query.where(lt(drinks.createdAt, cursorDate))
        : query
      )
        .orderBy(desc(drinks.createdAt))
        .limit(limit);

      items.push(...drinkResults.map((d) => ({ ...d, category: "drink" })));
    }

    if (!category || category === "souvenir") {
      const conditions = [];
      if (q) {
        conditions.push(
          or(
            ilike(souvenirs.name, `%${q}%`),
            ilike(souvenirs.nameKh, `%${q}%`),
            ilike(souvenirs.description, `%${q}%`)
          )!
        );
      }
      // Add cursor condition for pagination
      if (cursorDate) {
        conditions.push(lt(souvenirs.createdAt, cursorDate));
      }

      const query = db.select().from(souvenirs);
      const souvenirResults = await (conditions.length > 0
        ? query.where(and(...conditions)!)
        : cursorDate
        ? query.where(lt(souvenirs.createdAt, cursorDate))
        : query
      )
        .orderBy(desc(souvenirs.createdAt))
        .limit(limit);

      items.push(
        ...souvenirResults.map((s) => ({ ...s, category: "souvenir" }))
      );
    }

    // Filter out any undefined items and sort by createdAt
    items = items
      .filter((item) => item && item.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);

    // Create cursor using timestamp and ID for stable pagination
    const nextCursor =
      items.length === limit
        ? `${new Date(items[items.length - 1].createdAt).getTime()}_${
            items[items.length - 1].id
          }`
        : null;

    log.info("Listings query completed", {
      itemCount: items.length,
      hasMore: items.length === limit,
      nextCursor,
    });

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
