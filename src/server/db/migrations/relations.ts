import { relations } from "drizzle-orm/relations";
import { users, userProgress, accounts, sessions } from "./schema";

export const userProgressRelations = relations(userProgress, ({one}) => ({
	user: one(users, {
		fields: [userProgress.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	userProgresses: many(userProgress),
	accounts: many(accounts),
	sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));