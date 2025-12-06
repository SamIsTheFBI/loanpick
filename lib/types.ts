import { products } from "@/db/schema";

export type Product = typeof products.$inferSelect;

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}
