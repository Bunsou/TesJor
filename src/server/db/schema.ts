import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  pgEnum,
  serial,
  index,
} from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

// Users Table
export const users = pgTable("users", {
  id: text("id").primaryKey(), // From Better Auth
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  name: text("name").notNull(),
  image: text("image"),
  role: userRoleEnum("role").default("user").notNull(),
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

// Places Table (Villages, Temples, Parks, Markets)
export const places = pgTable(
  "places",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    nameKh: text("name_kh"),
    description: text("description").notNull(),
    province: text("province").notNull(),
    lat: text("lat").notNull(), // Store as text for precision
    lng: text("lng").notNull(), // Store as text for precision
    mapsUrl: text("maps_url"),
    imageUrl: text("image_url"),
    priceRange: text("price_range"),
    openingHours: text("opening_hours"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    provinceIdx: index("places_province_idx").on(table.province),
    nameIdx: index("places_name_idx").on(table.name),
  })
);

// Activities Table (Workshops, Bamboo Train, Boat Rides)
export const activities = pgTable(
  "activities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    nameKh: text("name_kh"),
    description: text("description").notNull(),
    province: text("province").notNull(),
    lat: text("lat").notNull(),
    lng: text("lng").notNull(),
    mapsUrl: text("maps_url"),
    imageUrl: text("image_url"),
    priceRange: text("price_range"),
    openingHours: text("opening_hours"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    provinceIdx: index("activities_province_idx").on(table.province),
    nameIdx: index("activities_name_idx").on(table.name),
  })
);

// Foods Table (Generic dishes, e.g., Fish Amok)
export const foods = pgTable("foods", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  nameKh: text("name_kh"),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  priceRange: text("price_range"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Drinks Table (Generic drinks, e.g., Palm Juice)
export const drinks = pgTable("drinks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  nameKh: text("name_kh"),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  priceRange: text("price_range"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Souvenirs Table (Products, e.g., Krama, Silverware)
export const souvenirs = pgTable("souvenirs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  nameKh: text("name_kh"),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  priceRange: text("price_range"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User Progress Table
export const userProgress = pgTable(
  "user_progress",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    isBookmarked: boolean("is_bookmarked").default(false).notNull(),
    isVisited: boolean("is_visited").default(false).notNull(),
    visitedAt: timestamp("visited_at"),

    // Only ONE of these should be populated per row
    placeId: uuid("place_id").references(() => places.id, {
      onDelete: "cascade",
    }),
    activityId: uuid("activity_id").references(() => activities.id, {
      onDelete: "cascade",
    }),
    foodId: uuid("food_id").references(() => foods.id, { onDelete: "cascade" }),
    drinkId: uuid("drink_id").references(() => drinks.id, {
      onDelete: "cascade",
    }),
    souvenirId: uuid("souvenir_id").references(() => souvenirs.id, {
      onDelete: "cascade",
    }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_progress_user_id_idx").on(table.userId),
  })
);

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Place = typeof places.$inferSelect;
export type NewPlace = typeof places.$inferInsert;

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

export type Food = typeof foods.$inferSelect;
export type NewFood = typeof foods.$inferInsert;

export type Drink = typeof drinks.$inferSelect;
export type NewDrink = typeof drinks.$inferInsert;

export type Souvenir = typeof souvenirs.$inferSelect;
export type NewSouvenir = typeof souvenirs.$inferInsert;

export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;
