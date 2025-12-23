import { NextRequest } from "next/server";
import { asyncHandler, requireAdmin } from "@/server/middleware";
import { checkRateLimit } from "@/server/middleware";
import { validateRequestQuery } from "@/shared/middleware";
import { sendSuccessResponse, AppError } from "@/shared/utils";
import { listingsQuerySchema } from "@/features/listings/schemas";
import { getListings } from "@/server/services/listings";
import { createListing } from "@/server/services/listings/listings.repository";
import { db } from "@/server/db";
import { listingPhotos } from "@/server/db/schema";

export const GET = asyncHandler(async (request: NextRequest) => {
  // Rate limiting
  await checkRateLimit(request);

  // Parse query params
  const searchParams = request.nextUrl.searchParams;
  const rawParams = {
    category: searchParams.get("category") || undefined,
    province: searchParams.get("province") || undefined,
    tag: searchParams.get("tag") || undefined,
    sortByRating: searchParams.get("sortByRating") || undefined,
    sortByPrice: searchParams.get("sortByPrice") || undefined,
    q: searchParams.get("q") || undefined,
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "10",
  };

  const query = validateRequestQuery(listingsQuerySchema, rawParams);

  const result = await getListings(query);

  // Add caching for better performance
  return sendSuccessResponse(result, undefined, {
    cache: {
      maxAge: 30, // Cache for 30 seconds in browser
      sMaxAge: 60, // Cache for 60 seconds in CDN
      staleWhileRevalidate: 300, // Serve stale content for 5 minutes while revalidating
    },
  });
});

export const POST = asyncHandler(async (request: NextRequest) => {
  // Check if user is authenticated and is admin
  await requireAdmin(request);

  const body = await request.json();

  // Validate required fields
  if (!body.title || !body.category || !body.province) {
    throw new AppError("VALIDATION_ERROR", "Missing required fields");
  }

  // Create slug from title
  const slug = body.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  // Prepare listing data
  const listingData = {
    slug,
    category: body.category,
    tags: body.tags || [],
    title: body.title,
    titleKh: body.titleKh || "",
    description: body.description || "",
    addressText: body.address || "",
    lat: body.lat ? parseFloat(body.lat) : 0,
    lng: body.lng ? parseFloat(body.lng) : 0,
    mainImage: body.mainImage || "",
    priceLevel: body.priceLevel || "$",
    priceDetails: body.priceOptions || [],
    operatingHours: body.operatingHours || [],
    contactInfo: {
      phone: body.phone || "",
      website: body.website || "",
      facebook: body.facebook || "",
    },
    xpPoints: body.xpPoints ? parseInt(body.xpPoints) : 10,
    province: body.province,
  };

  // Create listing
  const newListing = await createListing(listingData);

  // Insert photos if provided
  if (body.photos && body.photos.length > 0) {
    await db.insert(listingPhotos).values(
      body.photos.map((url: string) => ({
        listingId: newListing.id,
        imageUrl: url,
      }))
    );
  }

  return sendSuccessResponse({
    listing: newListing,
    message: "Listing created successfully",
  });
});
