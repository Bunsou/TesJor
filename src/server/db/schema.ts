import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  pgEnum,
  serial,
  index,
  doublePrecision,
  integer,
  jsonb,
  decimal,
} from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const categoryEnum = pgEnum("category", [
  "place",
  "food",
  "drink",
  "souvenir",
  "event",
]);
export const priceLevelEnum = pgEnum("price_level", ["$", "$$", "$$$", "Free"]);

// Users Table
export const users = pgTable("users", {
  id: text("id").primaryKey(), // From Better Auth
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  name: text("name").notNull(),
  image: text("image"),
  role: userRoleEnum("role").default("user").notNull(),
  xpPoints: integer("xp_points").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Better Auth - Sessions Table
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Better Auth - Accounts Table (for OAuth)
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  expiresAt: timestamp("expires_at"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Better Auth - Verification Table
export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ========================================
// UNIFIED LISTINGS TABLE
// ========================================
export const listings = pgTable(
  "listings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    category: categoryEnum("category").notNull(),
    tags: text("tags").array().default([]).notNull(),
    title: text("title").notNull(),
    titleKh: text("title_kh"),
    description: text("description").notNull(),
    addressText: text("address_text"),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    mainImage: text("main_image"),
    priceLevel: priceLevelEnum("price_level"),
    priceDetails: jsonb("price_details"), // Array of { label, price, currency }
    operatingHours: jsonb("operating_hours"), // Object with day keys
    contactInfo: jsonb("contact_info"), // { phone, facebook, website }
    googlePlaceId: text("google_place_id"),
    views: integer("views").default(0).notNull(),
    avgRating: decimal("avg_rating", { precision: 3, scale: 2 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    categoryIdx: index("listings_category_idx").on(table.category),
    slugIdx: index("listings_slug_idx").on(table.slug),
    titleIdx: index("listings_title_idx").on(table.title),
    latLngIdx: index("listings_lat_lng_idx").on(table.lat, table.lng),
  })
);

// ========================================
// SUPPORTING TABLES
// ========================================

// Listing Photos
export const listingPhotos = pgTable(
  "listing_photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    caption: text("caption"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    listingIdIdx: index("listing_photos_listing_id_idx").on(table.listingId),
  })
);

// Reviews
export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(), // 1-5
    content: text("content"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    listingIdIdx: index("reviews_listing_id_idx").on(table.listingId),
    userIdIdx: index("reviews_user_id_idx").on(table.userId),
  })
);

// User Progress (simplified for unified listings)
export const userProgress = pgTable(
  "user_progress",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    isBookmarked: boolean("is_bookmarked").default(false).notNull(),
    isVisited: boolean("is_visited").default(false).notNull(),
    visitedAt: timestamp("visited_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_progress_user_id_idx").on(table.userId),
    listingIdIdx: index("user_progress_listing_id_idx").on(table.listingId),
    userListingIdx: index("user_progress_user_listing_idx").on(
      table.userId,
      table.listingId
    ),
  })
);

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;

export type ListingPhoto = typeof listingPhotos.$inferSelect;
export type NewListingPhoto = typeof listingPhotos.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;

export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;

// JSONB type definitions
export type PriceDetail = {
  label: string;
  price: string;
  currency: "KHR" | "USD";
};

export type TimeSlot = {
  open: string;
  close: string;
};

export type OperatingHours = {
  monday?: TimeSlot[];
  tuesday?: TimeSlot[];
  wednesday?: TimeSlot[];
  thursday?: TimeSlot[];
  friday?: TimeSlot[];
  saturday?: TimeSlot[];
  sunday?: TimeSlot[];
};

export type ContactInfo = {
  phone?: string;
  facebook?: string;
  website?: string;
};
