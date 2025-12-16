# Software Implementation Specification: TesJor

**Project Name:** TesJor
**Version:** 1.0
**Date:** December 16, 2025
**Document Status:** Approved for Development

## 1. Project Vision & Purpose

TesJor is a gamified travel discovery web application designed to solve the problem of concentrated tourism in Cambodia (specifically the "Angkor Wat bottleneck"). The platform serves as a curated digital companion that guides international tourists to authentic, lesser-known experiences.

### Key Objectives

- **Discovery:** Provide a structured, high-quality directory of "Hidden Gems" including villages, local foods, traditional drinks, cultural activities, and souvenirs.
- **Gamification:** Implement a "Passport/Checklist" mechanic where users track their progress, encouraging them to visit more locations to "unlock" the real Cambodia.
- **Low Friction Accessibility:** The application will be built as a high-performance Progressive Web App (PWA). Tourists can use it immediately via a browser without downloading a large app from the App Store.

## 2. Technology Stack

### Core Framework

- **Next.js 15 (App Router):** Utilizing the latest React Server Components (RSC) architecture for optimal performance and SEO.
- **TypeScript:** Enforced Strict Mode for maximum type safety and maintainability.

### Database & ORM

- **PostgreSQL (Neon):** Serverless Postgres database. Selected for its ability to scale to zero (cost-efficiency) and branching capabilities.
- **Drizzle ORM:** Used for type-safe database queries and schema management. It offers better performance and lower cold starts compared to Prisma.

### State Management & Fetching

- **TanStack Query (React Query):** Critical for handling server state, caching data (reducing API calls), and managing "Infinite Scroll" pagination features.

### Frontend UI

- **Tailwind CSS:** Utility-first CSS framework for rapid styling.
- **Shadcn UI:** A collection of accessible, reusable components (based on Radix UI) that will be customized to fit the project's branding.
- **Lucide React:** Standard, clean icon library.

### External Services

- **Google Maps API:** For rendering the interactive map, markers, and directions.
- **Better Auth:** For secure, type-safe authentication via Google OAuth.
- **UploadThing:** For handling image uploads (Cover images for places/foods).
- **Upstash (Redis):** For serverless rate limiting.
- **Winston:** For structured backend logging.

## 3. Database Schema Specification

To ensure scalability and clean data separation, the system uses 5 Distinct Content Tables rather than a single unified table.

### 3.1 Users Table

- **id:** Text (Primary Key - sourced from Google Auth ID)
- **email:** Text (Unique, Not Null)
- **name:** Text (Not Null)
- **role:** Enum ('user', 'admin') — Default: 'user'
- **created_at:** Timestamp (Default: Now)

### 3.2 Content Tables (The 5 Pillars)

All 5 tables share standard descriptive fields but differ in location data.

#### A. places (Villages, Temples, Parks, Markets)

- **id:** UUID (PK)
- **name_en:** Text (English Name)
- **name_kh:** Text (Khmer Name)
- **description_en:** Text
- **province:** Text (e.g., "Siem Reap")
- **lat:** Decimal (For Map Pins)
- **lng:** Decimal (For Map Pins)
- **Maps_url:** Text
- **image_url:** Text (From UploadThing)
- **price_range:** Text (e.g., "$5 - $10")
- **opening_hours:** Text (e.g., "8:00 AM - 5:00 PM")
- **created_at:** Timestamp

#### B. activities (Workshops, Bamboo Train, Boat Rides)

Same fields as places (Includes Lat/Lng and Province).

#### C. foods (Generic dishes, e.g., Fish Amok)

- **id:** UUID (PK)
- **name_en, name_kh, description_en, image_url, price_range, created_at.**
- **Note:** No Lat/Lng or Province.

#### D. drinks (Generic drinks, e.g., Palm Juice)

Same fields as foods.

#### E. souvenirs (Products, e.g., Krama, Silverware)

Same fields as foods.

### 3.3 User Progress Table

This table aggregates all user interactions to avoid querying 5 separate join tables.

- **id:** Serial/UUID (PK)
- **user_id:** Text (FK referencing users.id)
- **is_bookmarked:** Boolean (Default: False)
- **is_visited:** Boolean (Default: False)
- **visited_at:** Timestamp (Nullable)
- **Nullable Foreign Keys (Only ONE of these is populated per row):**
  - **place_id** (FK -> places.id)
  - **activity_id** (FK -> activities.id)
  - **food_id** (FK -> foods.id)
  - **drink_id** (FK -> drinks.id)
  - **souvenir_id** (FK -> souvenirs.id)

## 4. Authentication & Security

### 4.1 Authentication Logic

- **Library:** Better Auth (Version 5+).
- **Provider:** Google OAuth only.
- **Session:** Database-backed sessions (secure/server-side) using Drizzle Adapter.

### 4.2 Security Measures

#### Role-Based Access Control (RBAC):

- **Admin Access:** Granted via manual database update (changing role to admin).
- **Protected Routes:** create endpoints are strictly protected by checking `session.user.role === 'admin'`.

#### Rate Limiting:

- **Service:** Upstash (Redis).
- **Policy:** Limit API requests (e.g., 10 requests per 10 seconds per IP) to prevent abuse of the database.

#### Environment Validation:

- **Library:** T3 Env or Zod.
- **Logic:** The build will fail if keys like `GOOGLE_CLIENT_ID` or `DATABASE_URL` are missing.

### 4.3 Logging

- **Library:** Winston.
- **Implementation:** Logs critical events (Database connection errors, 500 API errors) to the console (or external monitoring in the future).

## 5. Services & Infrastructure Strategy

| Service  | Choice          | Justification                                                                                                   |
| :------- | :-------------- | :-------------------------------------------------------------------------------------------------------------- |
| Hosting  | Vercel          | Native support for Next.js, zero-config CI/CD, and serverless function scaling.                                 |
| Database | Neon            | Serverless architecture matches Vercel's scaling model. Branching feature helps when adding new features later. |
| Images   | UploadThing     | Provides the simplest API for file uploads in Next.js without managing raw S3 buckets permissions.              |
| Maps     | Google Maps API | Industry standard for accuracy. Essential for directions and place details.                                     |

## 6. Frontend Specification

### 6.1 Core Pages & Routing

- **`/` (Landing):** Public page. Showcases the value prop. "Sign in with Google" CTA. Redirects to `/explore` if session exists.
- **`/explore` (Dashboard):**
  - **UI:** Grid of Category Buttons (Places, Food, etc.).
  - **Feed:** Horizontal scroll of "Recommended" items.
  - **Pagination:** Infinite Scroll (cursor-based).
- **`/map` (Map View):**
  - **UI:** Full-screen Google Map.
  - **Filters:** Floating toggles to show/hide specific pins (e.g., "Show only Food").
  - **User Position:** Blue dot indicating current location.
- **`/saved` (Bookmarks):**
  - **UI:** Vertical list of all items where `is_bookmarked = true`.
  - **Filters:** Tab bar (All | Places | Food | etc.).
- **`/profile` (User Stats):**
  - **UI:** Avatar, Name, Stats Card ("12 Places Visited").
  - **History:** Chronological list of visited items.
- **`/item/[id]` (Dynamic Detail):**
  - **UI:** Large Cover Image, Title (EN/KH), Description, Price, Opening Hours.
  - **Actions:** Floating Action Button (FAB) or fixed bottom bar with "Bookmark" (Heart) and "Check-in" (Checkmark).
- **`/admin`:** Simple form protected by Admin Middleware to create new database entries.

### 6.2 Navigation & Layout

- **Mobile:** Fixed Bottom Navigation Bar with Glassmorphism effect (blur). Icons: Compass (Explore), Map, Heart (Saved), User (Profile).
- **Desktop:** Left Sidebar Navigation. Main content area sits to the right.

### 6.3 Styling & Design System

- **Vibe:** "Tropical & Warm".
- **Color Palette:**
  - **Primary:** Orange/Terracotta (inspired by Angkor Wat sandstone).
  - **Secondary:** Lush Green (inspired by rice fields).
  - **Background:** Off-white/Cream (for reduced eye strain).
- **Typography:**
  - **English:** Poppins (Geometric sans-serif, friendly, modern).
  - **Khmer:** Kantumruy Pro (Modern screen-optimized Khmer font).
- **Icons:** Lucide React (Consistent stroke width).
- **Feedback UI:**
  - **Loading:** Skeleton screens (shimmer effect) while TanStack Query fetches data.
  - **Success:** Confetti animation triggers when a user successfully "Checks In" to a location.

## 7. Backend API Specification

The backend is built using Next.js Route Handlers. All inputs are validated using Zod.

### 7.1 Listing APIs

- **`GET /api/listings`**
  - **Query Params:** `category` (enum), `province` (string), `q` (search term), `cursor` (pagination).
  - **Behavior:** Searches across the specific table based on category. If no category, searches all tables.
  - **Response:** JSON object containing array of items and `nextCursor`.
- **`GET /api/listings/nearby`**
  - **Query Params:** `lat`, `lng`, `radius` (default: 5km).
  - **Behavior:** Uses Haversine formula (or PostGIS extension if available in Neon) to find places and activities within the radius.
- **`GET /api/listings/[id]`**
  - **Behavior:** Fetches detail for a specific ID. Checks all tables to find the match.

### 7.2 User Interaction APIs (Protected)

- **`POST /api/user/bookmark`**
  - **Body:** `{ itemId: UUID, category: Enum, action: 'add' | 'remove' }`
  - **Behavior:** Updates `user_progress` table. Toggles `is_bookmarked`.
- **`POST /api/user/visited`**
  - **Body:** `{ itemId: UUID, category: Enum, action: 'add' | 'remove' }`
  - **Behavior:** Updates `user_progress` table. Toggles `is_visited`. Logs timestamp.

### 7.3 Admin APIs (Protected: Admin Only)

- **`POST /api/admin/create`**
  - **Body:** Validated Zod schema for the specific category (including `image_url` from UploadThing).
  - **Behavior:** Inserts new row into the correct content table.

## 8. Project Architecture Structure

```
tesjor/
├── .env # Environment Variables (DB_URL, Google Keys)
├── drizzle.config.ts # Drizzle Kit configuration
├── next.config.ts # Next.js Config
├── tailwind.config.ts # Tailwind Theme Config
├── public/ # Static Assets (Logos, default avatars)
├── src/
│ ├── app/ # Next.js App Router
│ │ ├── (auth)/ # Route Group for Auth
│ │ │ └── sign-in/ # Login Page
│ │ ├── (main)/ # Route Group for App (Authenticated Layout)
│ │ │ ├── explore/ # Dashboard
│ │ │ ├── map/ # Map View
│ │ │ ├── saved/ # Bookmarks
│ │ │ ├── profile/ # User Profile
│ │ │ └── item/[id]/ # Dynamic Detail Page
│ │ ├── api/ # API Route Handlers
│ │ │ ├── admin/ # Admin creation routes
│ │ │ ├── listings/ # Search & Fetch routes
│ │ │ └── user/ # User interaction routes
│ │ ├── layout.tsx # Root Layout (Fonts, Providers)
│ │ └── page.tsx # Landing Page
│ ├── components/
│ │ ├── ui/ # Shadcn UI (Button, Card, Input, Sheet)
│ │ ├── layout/ # BottomNav, Sidebar, Header
│ │ ├── shared/ # PlaceCard, Loader, Confetti
│ │ └── map/ # GoogleMapContainer, CustomMarker
│ ├── db/
│ │ ├── index.ts # DB Connection (Neon + Drizzle)
│ │ └── schema.ts # Schema Definitions (Users, Places, Progress)
│ ├── lib/
│ │ ├── auth.ts # Better Auth Configuration
│ │ ├── utils.ts # Helper functions (CN, formatters)
│ │ ├── validators.ts # Zod Schemas
│ │ └── uploadthing.ts # Image Upload Config
│ ├── types/ # TS Interfaces & Types
│ └── middleware.ts # Route Protection & Role Checking
```

## 9. Future Roadmap (V2 Scope)

The following features are explicitly **excluded** from the MVP (Phase 1) but planned for the future:

1.  **Monetization:**
    - Integration of Google AdSense for passive income.
    - Affiliate link system for hotels and guided tours (Commission model).
2.  **Community Content:**
    - Ability for users to upload their own photos.
    - Star ratings and text reviews for locations.
3.  **Advanced Gamification:**
    - Leaderboards (Weekly/Monthly top explorers).
    - Partner Rewards: Flash a badge at a local shop to get a 10% discount.
4.  **Localization:**
    - Full UI translation toggle (English <-> Khmer).
5.  **Offline Capability:**
    - Advanced Service Workers to cache the database JSON, allowing full app usage in remote areas with zero connectivity.
