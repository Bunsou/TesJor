import { NextRequest } from "next/server";
import { db } from "@/db";
import { places, activities } from "@/db/schema";
import { nearbyQuerySchema } from "@/lib/validators";
import { errorResponse, successResponse, calculateDistance } from "@/lib/utils";
import { ratelimit, getIdentifier } from "@/lib/ratelimit";
import { log } from "@/lib/logger";

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
    const result = nearbyQuerySchema.safeParse({
      lat: searchParams.get("lat"),
      lng: searchParams.get("lng"),
      radius: searchParams.get("radius"),
    });

    if (!result.success) {
      return errorResponse(
        "Invalid query parameters",
        400,
        result.error.flatten().fieldErrors
      );
    }

    const { lat, lng, radius } = result.data;

    // Fetch places and activities with coordinates
    const [placeResults, activityResults] = await Promise.all([
      db.select().from(places),
      db.select().from(activities),
    ]);

    // Filter by distance using Haversine formula
    const nearbyPlaces = placeResults
      .map((place) => ({
        ...place,
        category: "place" as const,
        distance: calculateDistance(
          lat,
          lng,
          Number(place.lat),
          Number(place.lng)
        ),
      }))
      .filter((place) => place.distance <= radius);

    const nearbyActivities = activityResults
      .map((activity) => ({
        ...activity,
        category: "activity" as const,
        distance: calculateDistance(
          lat,
          lng,
          Number(activity.lat),
          Number(activity.lng)
        ),
      }))
      .filter((activity) => activity.distance <= radius);

    // Combine and sort by distance
    const items = [...nearbyPlaces, ...nearbyActivities].sort(
      (a, b) => a.distance - b.distance
    );

    log.info("Nearby search completed", {
      lat,
      lng,
      radius,
      resultCount: items.length,
    });

    return successResponse({ items });
  } catch (error) {
    log.error("Failed to fetch nearby items", { error });
    return errorResponse("Failed to fetch nearby items", 500);
  }
}
