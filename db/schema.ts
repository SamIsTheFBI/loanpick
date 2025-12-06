import { pgTable, uuid, text, numeric, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  display_name: text("display_name"),
  image: text("image"),
  created_at: timestamp("created_at").defaultNow(),
});

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
  user_id: uuid("user_id").notNull().references(() => users.id),
  product_id: uuid("product_id").notNull().references(() => products.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
