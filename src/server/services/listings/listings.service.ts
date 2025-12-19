import * as repository from "./listings.repository";
import { AppError } from "@/shared/utils/error-handler";
import { log } from "@/shared/utils";
import type {
  Category,
  ListingsResponse,
  NearbyResponse,
} from "@/shared/types";

interface GetListingsParams {
  category?: Category;
  province?: string;
  q?: string;
  cursor?: string;
  limit: number;
}

interface NearbyParams {
  lat: number;
  lng: number;
  radius: number;
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get listings with pagination
export async function getListings(
  params: GetListingsParams
): Promise<ListingsResponse> {
  const { category, province, q, cursor, limit } = params;

  // Parse cursor if provided
  let cursorDate: Date | null = null;
  if (cursor) {
    try {
      const [timestamp] = cursor.split("_");
      cursorDate = new Date(parseInt(timestamp));
      log.info("Using cursor for pagination", { cursor, cursorDate });
    } catch {
      log.warn("Invalid cursor format", { cursor });
    }
  }

  const items = await repository.findListings({
    category,
    province,
    q,
    cursor: cursorDate,
    limit: limit + 1, // Fetch one extra to check if there are more
  });

  // Sort by createdAt descending
  items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // If we have a category, trim to limit
  const limitedItems = category ? items.slice(0, limit) : items.slice(0, limit);
  const hasMore = items.length > limit;

  // Generate next cursor
  let nextCursor: string | null = null;
  if (hasMore && limitedItems.length > 0) {
    const lastItem = limitedItems[limitedItems.length - 1];
    nextCursor = `${lastItem.createdAt.getTime()}_${lastItem.id}`;
  }

  return {
    items: limitedItems as ListingsResponse["items"],
    nextCursor,
    hasMore,
  };
}

// Get all listings (no pagination)
export async function getAllListings(categories?: string[]) {
  // If categories provided, fetch each category
  if (categories && categories.length > 0) {
    const allItems = [];
    for (const category of categories) {
      const items = await repository.findListings({
        category: category as Category,
        limit: 1000,
      });
      allItems.push(...items);
    }

    // Filter items with valid coordinates for map display
    return allItems.filter(
      (item) => item.lat && item.lng && item.lat !== "" && item.lng !== ""
    );
  }

  // Otherwise fetch all
  const items = await repository.findListings({
    limit: 1000,
  });

  return items.filter(
    (item) => item.lat && item.lng && item.lat !== "" && item.lng !== ""
  );
}

// Get item by ID
export async function getItemById(id: string) {
  const item = await repository.findById(id);

  if (!item) {
    throw new AppError("ITEM_NOT_FOUND", "Item not found");
  }

  return item;
}

// Get nearby items
export async function getNearbyItems(
  params: NearbyParams
): Promise<NearbyResponse> {
  const { lat, lng, radius } = params;

  // Fetch places and activities with coordinates
  const [placeResults, activityResults] = await Promise.all([
    repository.findAllPlacesWithCoords(),
    repository.findAllActivitiesWithCoords(),
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

  return { items };
}

// Create content item
export async function createContent(
  category: Category,
  data: Record<string, unknown>
) {
  switch (category) {
    case "place":
      return repository.createPlace(
        data as Parameters<typeof repository.createPlace>[0]
      );
    case "activity":
      return repository.createActivity(
        data as Parameters<typeof repository.createActivity>[0]
      );
    case "food":
      return repository.createFood(
        data as Parameters<typeof repository.createFood>[0]
      );
    case "drink":
      return repository.createDrink(
        data as Parameters<typeof repository.createDrink>[0]
      );
    case "souvenir":
      return repository.createSouvenir(
        data as Parameters<typeof repository.createSouvenir>[0]
      );
    default:
      throw new AppError("VALIDATION_ERROR", "Invalid category");
  }
}
