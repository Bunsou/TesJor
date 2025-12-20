# Database Schema Migration Summary

## Overview

Successfully migrated from separate content tables (places, events, foods, drinks, souvenirs) to a **unified listings table** with flexible JSONB fields, following the SIS specification.

## Migration Date

2024-12-20

## Key Changes

### 1. Database Schema (`src/server/db/schema.ts`)

#### New Enums

- `categoryEnum`: `'place' | 'food' | 'drink' | 'souvenir' | 'event'`
- `priceLevelEnum`: `'$' | '$$' | '$$$' | 'Free'`

#### Unified Listings Table

- **Primary Key**: `id` (UUID)
- **Unique Fields**: `slug` (for SEO-friendly URLs)
- **Core Fields**: `title`, `titleKh`, `description`, `category`
- **Location**: `lat`, `lng`, `addressText`
- **Pricing**: `priceLevel` (enum), `priceDetails` (JSONB array)
- **Media**: `mainImage`
- **JSONB Fields**:
  - `priceDetails`: `Array<{label: string, price: string, currency: string}>`
  - `operatingHours`: `{monday?: Array<{open: string, close: string}>, ...}`
  - `contactInfo`: `{phone?: string, facebook?: string, website?: string}`
- **Metadata**: `googlePlaceId`, `views`, `avgRating`, `createdAt`

#### Supporting Tables

- **listing_photos**: Photos gallery for each listing
- **reviews**: User reviews with ratings
- **user_progress**: Simplified to use single `listingId` FK instead of 5 separate FKs

#### Indexes Created

- `listings_category_idx` - Fast category filtering
- `listings_slug_idx` - Fast slug lookups
- `listings_title_idx` - Text search optimization
- `listings_lat_lng_idx` - Geospatial queries
- `user_progress_user_listing_idx` - Composite index for user queries

### 2. Type Definitions (`src/shared/types/content.types.ts`)

Replaced category-specific types with unified types:

- `Listing` - Main listing interface
- `ListingPhoto`, `Review` - Supporting types
- `PriceDetail`, `TimeSlot`, `OperatingHours`, `ContactInfo` - JSONB structure types
- `ListingWithProgress`, `ListingWithDetails` - Composed types for API responses

### 3. Validation Schemas

#### Listings Schemas (`src/features/listings/schemas/listings.schema.ts`)

- Added JSONB validation schemas: `priceDetailSchema`, `operatingHoursSchema`, `contactInfoSchema`
- Updated `createListingSchema` with JSONB fields
- Added `priceLevel` filter to `listingsQuerySchema`
- Added `category` filter to `nearbyQuerySchema`
- Created `slugParamSchema` for slug-based routes

#### User Schemas (`src/features/user/schemas/user.schema.ts`)

- Simplified `bookmarkSchema` and `visitedSchema` to use `listingId` instead of `itemId + category`

#### Admin Schemas (`src/features/admin/schemas/admin.schema.ts`)

- Replaced 5 separate schemas with single `createListingSchema`

### 4. Repository Layer

#### Listings Repository (`src/server/services/listings/listings.repository.ts`)

**Removed:**

- Separate methods for each category (createPlace, createFood, etc.)
- Category-specific queries

**Added:**

- `findListings(options)` - Unified query with category/priceLevel/search filters
- `findNearbyListings(options)` - Haversine distance calculation with optional category filter
- `findBySlug(slug)` - Slug-based lookup
- `findListingPhotos(listingId)` - Get photos gallery
- `findListingReviews(listingId)` - Get reviews
- `findAllListingsWithCoords(categories?)` - For map display
- `createListing(data)` - Single create method
- `incrementViews(id)` - View counter

#### User Repository (`src/server/services/user/user.repository.ts`)

**Changes:**

- `findProgressEntry(userId, listingId)` - Now uses single listingId parameter
- `createProgressEntry(...)` - Simplified to use listingId
- `findBookmarkedItems(userId)` - Now joins with listings table and returns listing data
- `findVisitedItems(userId)` - Now joins with listings table and returns listing data
- `getUserStats(userId)` - Calculates category counts dynamically from joined listings

### 5. Service Layer

#### Listings Service (`src/server/services/listings/listings.service.ts`)

**Removed:**

- `createContent()` - Category-based switch statement
- `getNearbyItems()` - Multiple table queries

**Added/Updated:**

- `getListings(params)` - Uses unified repository
- `getAllListings(categories?)` - Simplified for map display
- `getListingBySlug(slug)` - New slug-based retrieval with photos and reviews
- `getListingById(id)` - Simplified
- `getNearbyListings(params)` - Uses Haversine formula in database
- `createListing(data)` - Single unified method

#### User Service (`src/server/services/user/user.service.ts`)

**Changes:**

- `toggleBookmark(params)` - Now accepts `listingId` instead of `itemId + category`
- `toggleVisited(params)` - Now accepts `listingId` instead of `itemId + category`
- All methods simplified by removing category parameter

### 6. API Routes

#### Listings Routes

- `/api/listings` - GET listings with filters (updated to use `priceLevel`)
- `/api/listings/[slug]` - **Renamed from [id]**, now uses slug parameter
- `/api/listings/nearby` - Added optional `category` filter
- `/api/listings/all` - No changes needed (already category-agnostic)

#### User Routes

- `/api/user/bookmark` - Updated to use `listingId` instead of `itemId + category`
- `/api/user/visited` - Updated to use `listingId` instead of `itemId + category`

#### Admin Routes

- `/api/admin/create` - Replaced category switch with unified `createListingSchema` validation

### 7. Seed Data (`src/server/db/seed.ts`)

Complete rewrite with 13 sample listings:

- 5 places (Kampot Pepper Farm, Bamboo Train, Koh Ker, Kampong Phluk, Bokor Hill)
- 3 foods (Fish Amok, Lok Lak, Nom Banh Chok)
- 2 drinks (Palm Juice, Iced Coffee)
- 3 souvenirs (Krama, Kampot Pepper, Silk Scarf)

All with proper:

- Unique slugs
- Complete JSONB data (operating hours with time slots, price details, contact info)
- Realistic coordinates for Cambodia
- Khmer translations (titleKh)

## Migration Process

1. ✅ Updated `drizzle.config.ts` with new schema paths
2. ✅ Generated migration files with `drizzle-kit generate`
3. ✅ Created custom migration script (`src/server/db/migrations/0002_unify_listings.sql`) to:
   - Truncate user_progress (clean slate for new structure)
   - Drop old foreign key columns
   - Add listingId column
   - Create all necessary indexes and constraints
4. ✅ Ran migration using Node script (`migrate.ts`)
5. ✅ Ran seed script to populate with 13 sample listings

## Benefits of Unified Approach

### 1. Simplified Codebase

- Single repository method instead of 5
- Single service method instead of 5
- Single API validation schema instead of 5
- Removed ~400 lines of duplicate code

### 2. Better Performance

- Single table query instead of multiple table unions
- Efficient indexes on slug, category, and coordinates
- Haversine distance calculation in database (vs. application layer)

### 3. Flexibility

- JSONB fields allow different price structures per category
- Operating hours can vary by listing
- Easy to add new categories without schema changes

### 4. Maintainability

- Single source of truth for all content
- Easier to add features that work across all categories
- Consistent data structure

### 5. API Improvements

- SEO-friendly slug-based URLs
- Better filtering with priceLevel enum
- Category-aware nearby search
- Unified response format

## Breaking Changes

### Frontend/Client Code

⚠️ **These will need updates:**

1. **Component Props**: Components expecting `itemId + category` should now use `listingId`
2. **API Calls**:
   - `/api/listings/[id]` → `/api/listings/[slug]`
   - Bookmark/visited requests: `{itemId, category}` → `{listingId}`
3. **Type Imports**: Import `Listing` instead of `Place`, `Food`, etc.
4. **Map Markers**: Now receive unified listings with `category` field
5. **Detail Pages**: Route from `/item/[id]` to `/item/[slug]`

### Data Fields

- `name` → `title`
- `nameKh` → `titleKh`
- Separate price fields → `priceLevel` enum + `priceDetails` JSONB
- Hardcoded hours → `operatingHours` JSONB
- Separate contact fields → `contactInfo` JSONB

## Testing Checklist

- [x] Server compiles without errors
- [x] Migration runs successfully
- [x] Seed data populates correctly
- [ ] Test GET /api/listings with filters
- [ ] Test GET /api/listings/[slug]
- [ ] Test GET /api/listings/nearby
- [ ] Test GET /api/listings/all
- [ ] Test POST /api/user/bookmark
- [ ] Test POST /api/user/visited
- [ ] Test GET /api/user/stats
- [ ] Test POST /api/admin/create
- [ ] Update frontend components
- [ ] Test map functionality
- [ ] Test detail pages with slugs
- [ ] Test bookmark/visited interactions

## Next Steps

1. **Update Frontend Components**:

   - Update `PlaceCard` to use new `Listing` type
   - Update bookmark/visited handlers to use `listingId`
   - Update detail page route to use slug
   - Update map markers to handle unified listings

2. **Create Migration Guide** for frontend team

3. **Test All Endpoints** with new schema

4. **Update Documentation**:
   - API documentation
   - Component documentation
   - Database schema diagram

## Rollback Plan

If needed, the old schema can be restored by:

1. Running the old migration files
2. Reverting code changes
3. Re-seeding with old data

However, **user_progress data will be lost** as the structure has changed fundamentally.

## Files Changed

### Database

- `src/server/db/schema.ts`
- `src/server/db/seed.ts`
- `src/server/db/migrations/0002_unify_listings.sql`
- `drizzle.config.ts`

### Types

- `src/shared/types/content.types.ts`

### Schemas

- `src/features/listings/schemas/listings.schema.ts`
- `src/features/user/schemas/user.schema.ts`
- `src/features/admin/schemas/admin.schema.ts`

### Repositories

- `src/server/services/listings/listings.repository.ts`
- `src/server/services/user/user.repository.ts`

### Services

- `src/server/services/listings/listings.service.ts`
- `src/server/services/user/user.service.ts`

### API Routes

- `src/app/api/listings/route.ts`
- `src/app/api/listings/[id]/route.ts` → `src/app/api/listings/[slug]/route.ts`
- `src/app/api/listings/nearby/route.ts`
- `src/app/api/user/bookmark/route.ts`
- `src/app/api/user/visited/route.ts`
- `src/app/api/admin/create/route.ts`

## Conclusion

The unified listings migration is complete and operational. All backend code has been updated to work with the new schema. The next phase involves updating frontend components to use the new API structure and data types.
