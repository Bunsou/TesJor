import { NextRequest } from "next/server";
import { db } from "@/db";
import { places, activities, foods, drinks, souvenirs } from "@/db/schema";
import { errorResponse, successResponse } from "@/lib/utils";
import { ratelimit, getIdentifier } from "@/lib/ratelimit";
import { log } from "@/lib/logger";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limiting
    const identifier = getIdentifier(request);
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      log.warn("Rate limit exceeded", { identifier });
      return errorResponse("Too many requests", 429);
    }

    const { id } = params;

    // Try to find the item in all tables
    const [place, activity, food, drink, souvenir] = await Promise.all([
      db.select().from(places).where(eq(places.id, id)).limit(1),
      db.select().from(activities).where(eq(activities.id, id)).limit(1),
      db.select().from(foods).where(eq(foods.id, id)).limit(1),
      db.select().from(drinks).where(eq(drinks.id, id)).limit(1),
      db.select().from(souvenirs).where(eq(souvenirs.id, id)).limit(1),
    ]);

    let item = null;
    let category = null;

    if (place[0]) {
      item = place[0];
      category = "place";
    } else if (activity[0]) {
      item = activity[0];
      category = "activity";
    } else if (food[0]) {
      item = food[0];
      category = "food";
    } else if (drink[0]) {
      item = drink[0];
      category = "drink";
    } else if (souvenir[0]) {
      item = souvenir[0];
      category = "souvenir";
    }

    if (!item) {
      return errorResponse("Item not found", 404);
    }

    return successResponse({ ...item, category });
  } catch (error) {
    log.error("Failed to fetch item", { error, id: params.id });
    return errorResponse("Failed to fetch item", 500);
  }
}
