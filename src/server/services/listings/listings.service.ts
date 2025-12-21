import * as repository from "./listings.repository";
import { AppError } from "@/shared/utils/error-handler";
import type { NewListing } from "@/server/db/schema";

interface GetListingsParams {
  category?: string;
  priceLevel?: string;
  q?: string;
  page: number;
  limit: number;
}

interface NearbyParams {
  lat: number;
  lng: number;
  radius: number;
  category?: string;
}

/**
 * Get listings with offset-based pagination
 */
export async function getListings(params: GetListingsParams) {
  const { category, priceLevel, q, page, limit } = params;

  // Fetch one extra item to determine if there are more pages
  const items = await repository.findListings({
    category,
    priceLevel,
    q,
    page,
    limit: limit + 1,
    pageSize: limit, // Original page size for offset calculation
  });

  // Check if there are more items beyond this page
  const hasMore = items.length > limit;
  const itemsToReturn = items.slice(0, limit);

  // Calculate next page number
  const nextPage = hasMore ? page + 1 : null;

  return {
    items: itemsToReturn,
    page,
    nextPage,
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

  return { items };
}

/**
 * Create new listing
 */
export async function createListing(data: NewListing) {
  return repository.createListing(data);
}
