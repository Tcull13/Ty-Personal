import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const storefronts = sqliteTable("storefronts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  businessName: text("business_name").notNull(),
  ownerName: text("owner_name").default(""),
  phone: text("phone").notNull(),
  email: text("email").default(""),
  website: text("website").default(""),
  services: text("services").notNull(),
  serviceArea: text("service_area").default(""),
  description: text("description").default(""),
  slug: text("slug").notNull().unique(),
  passwordHash: text("password_hash").default(""),
  plan: text("plan").default("free"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const sessions = sqliteTable("sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  storefrontId: integer("storefront_id").notNull().references(() => storefronts.id),
  token: text("token").notNull().unique(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const scans = sqliteTable("scans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  storefrontId: integer("storefront_id").notNull().references(() => storefronts.id),
  type: text("type").notNull(),
  referrer: text("referrer").default(""),
  ip: text("ip").default(""),
  userAgent: text("user_agent").default(""),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});