import { pgTable, index, foreignKey, serial, text, boolean, timestamp, uuid, unique, doublePrecision, jsonb, integer, numeric, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const category = pgEnum("category", ['place', 'food', 'drink', 'souvenir', 'event'])
export const priceLevel = pgEnum("price_level", ['$', '$$', '$$$', 'Free'])
export const userRole = pgEnum("user_role", ['user', 'admin'])


export const userProgress = pgTable("user_progress", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	isBookmarked: boolean("is_bookmarked").default(false).notNull(),
	isVisited: boolean("is_visited").default(false).notNull(),
	visitedAt: timestamp("visited_at", { mode: 'string' }),
	placeId: uuid("place_id"),
	activityId: uuid("activity_id"),
	foodId: uuid("food_id"),
	drinkId: uuid("drink_id"),
	souvenirId: uuid("souvenir_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("user_progress_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_progress_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	name: text().notNull(),
	role: userRole().default('user').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const accounts = pgTable("accounts", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const verifications = pgTable("verifications", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	token: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("sessions_token_unique").on(table.token),
]);

export const listingPhotos = pgTable("listing_photos", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	listingId: uuid("listing_id").notNull(),
	imageUrl: text("image_url").notNull(),
	caption: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const listings = pgTable("listings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	category: category().notNull(),
	title: text().notNull(),
	titleKh: text("title_kh"),
	description: text().notNull(),
	addressText: text("address_text"),
	lat: doublePrecision().notNull(),
	lng: doublePrecision().notNull(),
	mainImage: text("main_image"),
	priceLevel: priceLevel("price_level"),
	priceDetails: jsonb("price_details"),
	operatingHours: jsonb("operating_hours"),
	contactInfo: jsonb("contact_info"),
	googlePlaceId: text("google_place_id"),
	views: integer().default(0).notNull(),
	avgRating: numeric("avg_rating", { precision: 3, scale:  2 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("listings_slug_unique").on(table.slug),
]);

export const reviews = pgTable("reviews", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	listingId: uuid("listing_id").notNull(),
	userId: text("user_id").notNull(),
	rating: integer().notNull(),
	content: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});
