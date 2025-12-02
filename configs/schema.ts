import { integer, json, pgTable, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    subscriptionStatus: varchar({ length: 50 }).default('free'),
    subscriptionPlan: varchar({ length: 50 }).default('free'),
    subscriptionEndDate: varchar(),
});

export const HistoryTable = pgTable("historyTable", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    recordId: varchar().notNull(),
    content:json(),
    userEmail:varchar('userEmail').references(()=>usersTable.email),
    createdAt:varchar(),
    aiAgentType:varchar(),
    metaData:varchar()
});

export const SubscriptionsTable = pgTable("subscriptions", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userEmail: varchar({ length: 255 }).notNull().references(()=>usersTable.email),
    clerkSubscriptionId: varchar({ length: 255 }).unique(),
    plan: varchar({ length: 50 }).notNull().default('free'),
    status: varchar({ length: 50 }).notNull().default('inactive'),
    currentPeriodStart: varchar(),
    currentPeriodEnd: varchar(),
    cancelAtPeriodEnd: boolean().default(false),
    createdAt: varchar().default(new Date().toString()),
    updatedAt: varchar().default(new Date().toString()),
});