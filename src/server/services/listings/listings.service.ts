import * as repository from "./listings.repository";
import { AppError } from "@/shared/utils/error-handler";
import { log } from "@/shared/utils";
import type { NewListing } from "@/server/db/schema";

interface GetListingsParams {
  category?: string;
  priceLevel?: string;
  q?: string;
  cursor?: string;
  limit: number;
}

interface NearbyParams {
  lat: number;
  lng: number;
  radius: number;
  category?: string;
}

/**
 * Get listings with pagination and filters
 */
export async function getListings(params: GetListingsParams) {
  const { category, priceLevel, q, cursor, limit } = params;

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
    priceLevel,
    q,
    cursor: cursorDate,
    limit: limit + 1, // Fetch one extra to check if there are more
  });

  const limitedItems = items.slice(0, limit);
  const hasMore = items.length > limit;

  // Generate next cursor
  let nextCursor: string | null = null;
  if (hasMore && limitedItems.length > 0) {
    const lastItem = limitedItems[limitedItems.length - 1];
    nextCursor = `${lastItem.createdAt.getTime()}_${lastItem.id}`;
  }

  return {
    items: limitedItems,
    nextCursor,
    hasMore,
  };
}

/**
 * Get all listings with optional category filter (for map)
 */
export async function getAllListings(categories?: string[]) {
  return repository.findAllListingsWithCoords(categories);
}

/**
 * Get listing by slug
 */
export async function getListingBySlug(slug: string) {
  const listing = await repository.findBySlug(slug);

  if (!listing) {
    throw new AppError("LISTING_NOT_FOUND", "Listing not found");
  }

  // Increment views
  await repository.incrementViews(listing.id);

  // Get additional data
  const [photos, reviews] = await Promise.all([
    repository.findListingPhotos(listing.id),
    repository.findListingReviews(listing.id),
  ]);

  return {
    ...listing,
    photos,
    reviews,
  };
}

/**
 * Get listing by ID
 */
export async function getListingById(id: string) {
  const listing = await repository.findById(id);

  if (!listing) {
    throw new AppError("LISTING_NOT_FOUND", "Listing not found");
  }

  return listing;
}

/**
 * Get nearby listings
 */
export async function getNearbyListings(params: NearbyParams) {
  const { lat, lng, radius, category } = params;

  const items = await repository.findNearbyListings({
    lat,
    lng,
    radius,
    category,
    limit: 100,
  });

  log.info("Nearby search completed", {
    lat,
    lng,
    radius,
    category,
    resultCount: items.length,
  });

  return { items };
}

/**
 * Create new listing
 */
export async function createListing(data: NewListing) {
  return repository.createListing(data);
}
