# Software Implementation Specification: TesJor

**Project Name:** TesJor
**Version:** 2.0 (Unified Schema)
**Date:** December 20, 2025
**Document Status:** Approved for Development

## 1. Project Vision & Purpose

TesJor is a gamified travel discovery web application designed to solve the problem of concentrated tourism in Cambodia. It serves as a digital companion that guides international tourists to "Hidden Gems"—villages, local foods, traditional drinks, cultural activities, and souvenirs—that are often missed by standard tour packages.

### Key Objectives

- **Discovery Engine:** A centralized, high-quality directory of authentic Cambodian experiences.
- **Gamification:** A "Passport" system where users track their visits and bookmarks to "unlock" the country.
- **Accessibility:** Built as a Progressive Web App (PWA) to allow instant access via browser without app store downloads.

## 2. Technology Stack

### Core Framework

- **Next.js 15 (App Router):** Latest React Server Components architecture.
- **TypeScript:** Strict mode enabled for type safety.

### Database & ORM

- **PostgreSQL (Neon):** Serverless, scalable database.
- **Drizzle ORM:** Type-safe, lightweight ORM for defining schemas and queries.

### State Management & Caching

- **TanStack Query (React Query):** For managing server state, caching API responses, and handling Infinite Scroll.

### UI & Styling

- **Tailwind CSS:** Utility-first styling.
- **Shadcn UI:** Reusable component library.
- **Lucide React:** Iconography.

### Infrastructure & Services

- **Auth:** Better Auth (Google OAuth).
- **Maps:** Google Maps API (Maps JavaScript API + Places API).
- **Images:** Cloudinary (S3 wrapper for easy uploads).
- **Rate Limiting:** Upstash (Redis).
- **Logging:** Winston.

## 3. Database Schema Specification (Unified Strategy)

The core data is consolidated into a Unified Table (`listings`) to allow global search, unified map filtering, and simpler maintenance.

### 3.1 Users Table

| Column       | Type        | Description           |
| :----------- | :---------- | :-------------------- |
| `id`         | `Text`      | PK - from Google Auth |
| `email`      | `Text`      | Unique                |
| `name`       | `Text`      |                       |
| `role`       | `Enum`      | ('user', 'admin')     |
| `created_at` | `Timestamp` |                       |

### 3.2 Listings Table (The Master Content)

This table stores Places, Foods, Drinks, Souvenirs, and Events.

| Column Name    | Type     | Description                                             |
| :------------- | :------- | :------------------------------------------------------ | ----------------------------- | ------- | ---------- | ------- |
| `id`           | `UUID`   | Primary Key                                             |
| `slug`         | `Text`   | Unique URL-friendly string (e.g., `angkor-wat-sunrise`) |
| `category`     | `Enum`   | 'place'                                                 | 'food'                        | 'drink' | 'souvenir' | 'event' |
| `title`        | `Text`   | Name in English.                                        |
| `title_kh`     | `Text`   | Name in Khmer.                                          |
| `description`  | `Text`   | Full detailed description.                              |
| `address_text` | `Text`   | Displayable address (e.g., "St 60m, Siem Reap").        |
| `lat`          | `Double` | Latitude (Required for Map).                            |
| `lng`          | `Double` | Longitude (Required for Map).                           |
| `main_image`   | `Text`   | URL of the cover photo.                                 |
| `price_level`  | `Enum`   | '                                                       |
| $'             | '$$'     | '$$$'                                                   | 'Free' (For quick filtering). |

price_details

JSONB

Array of pricing rules. See structure below.

operating_hours

JSONB

Structured open/close times. See structure below.

contact_info

JSONB

Socials and Phone. See structure below.

google_place_id

Text

ID for linking to Google Maps Reviews/Directions.

views

Int

Default: 0.

avg_rating

Decimal

Cached average rating (updated via trigger or job).

created_at

Timestamp

JSONB Structures

A. operating_hours (Handling Split Shifts)

{
"monday": [ { "open": "07:00", "close": "11:00" }, { "open": "14:00", "close": "18:00" } ],
"tuesday": [ { "open": "08:00", "close": "17:00" } ],
"wednesday": [] // Closed
}

B. price_details

[
{ "label": "Locals", "price": "500", "currency": "KHR" },
{ "label": "Foreigners", "price": "5.00", "currency": "USD" }
]

C. contact_info

{
"phone": "+855 12 345 678",
"facebook": "[https://facebook.com/page](https://facebook.com/page)",
"website": "[https://website.com](https://website.com)"
}

3.3 Supporting Tables

listing_photos: id, listing_id (FK), image_url, caption.

reviews: id, listing_id (FK), user_id (FK), rating (1-5), content, created_at.

user_progress: id, user_id, listing_id, is_bookmarked, is_visited, visited_at.

4. Auth & Security

Authentication: Better Auth (Google Provider).

Role Management: Manual DB update for Admin status.

Middleware: Next.js Middleware to protect /admin and /profile routes.

Rate Limiting: Upstash Redis on API routes (e.g., 10 req/10s) to prevent scraping.

Validation: Zod used for all API inputs and Environment Variables.

5. Frontend Specification

5.1 Pages

/: Landing / Auth check.

/explore: Main feed. Tabs for categories (Place, Food, etc.). Infinite scroll.

/map: Full screen map. Markers colored by category.

/saved: User bookmarks list.

/profile: User stats ("5 Places Visited") and history.

/item/[slug]: Detail page.

Features: Photo Carousel (using listing_photos), 'Get Directions' button, 'Check-in' button, Review list, Operating Hours accordion.

/admin: CMS for adding listings.

5.2 Navigation

Mobile: Fixed Bottom Navigation Bar (Glassmorphism).

Desktop: Left Sidebar Navigation.

5.3 Design System

Theme: Tropical/Warm.

Primary: Terracotta Orange (#E07A5F)

Secondary: Deep Green (#3D5A80 or Nature Green)

Background: Cream/Off-White (#FDFCF6)

Typography:

English: Poppins (Round, friendly).

Khmer: Kantumruy Pro.

6. Backend API Specification

6.1 Endpoints (Route Handlers)

GET /api/listings: Global search.

Params: category, q (search), price_level, cursor.

GET /api/listings/nearby: Geospatial search.

Params: lat, lng, radius (km).

Logic: Calculates Haversine distance from listings table.

GET /api/listings/[slug]: Fetch single item + photos + top 3 reviews.

POST /api/user/interaction:

Body: { listingId, type: 'bookmark' | 'visit', value: boolean }.

POST /api/admin/create: Protected. Zod validation for complex JSON fields.

7. Project Structure

tesjor/
├── src/
│ ├── app/
│ │ ├── (main)/ # App Layout
│ │ │ ├── explore/
│ │ │ ├── map/
│ │ │ ├── item/[slug]/
│ │ │ └── ...
│ │ ├── api/ # API Routes
│ │ └── layout.tsx
│ ├── components/
│ │ ├── ui/ # Shadcn
│ │ ├── domain/ # Business Logic Components
│ │ │ ├── ListingCard.tsx
│ │ │ ├── HoursDisplay.tsx # Logic to show "Open Now" or "Closed"
│ │ │ └── MapMarker.tsx
│ ├── db/
│ │ └── schema.ts # Drizzle Schema (Listings, Users, etc.)
│ ├── lib/
│ │ ├── validators/ # Zod Schemas (JSON fields)
│ │ └── utils.ts
└── ...
