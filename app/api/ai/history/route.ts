import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ai_chat_messages } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  const messages = await db
    .select()
    .from(ai_chat_messages)
    .where(
      and(
        eq(ai_chat_messages.product_id, productId),
        eq(ai_chat_messages.user_id, session.user.id)
      )
    )
    .orderBy(ai_chat_messages.created_at);

  return NextResponse.json({ messages });
}
