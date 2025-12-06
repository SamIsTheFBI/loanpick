import { pgTable, uuid, text, numeric, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Better Auth tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// Application tables
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  bank: text("bank").notNull(),
  type: text("type").notNull(),
  rate_apr: numeric("rate_apr").notNull(),
  min_income: numeric("min_income").notNull(),
  min_credit_score: integer("min_credit_score").notNull(),
  tenure_min_months: integer("tenure_min_months").default(6).notNull(),
  tenure_max_months: integer("tenure_max_months").default(60).notNull(),
  processing_fee_pct: numeric("processing_fee_pct").default("0"),
  prepayment_allowed: boolean("prepayment_allowed").default(true),
  disbursal_speed: text("disbursal_speed").default("standard"),
  docs_level: text("docs_level").default("standard"),
  summary: text("summary"),
  faq: jsonb("faq").default(sql`'[]'::jsonb`),
  terms: jsonb("terms").default(sql`'{}'::jsonb`),
});

export const ai_chat_messages = pgTable("ai_chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: text("user_id").notNull().references(() => user.id),
  product_id: uuid("product_id").notNull().references(() => products.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
