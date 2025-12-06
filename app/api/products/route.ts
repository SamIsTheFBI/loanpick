import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/db/schema";
import { and, gte, lte, ilike } from "drizzle-orm";
import { GetProductsQuerySchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const rawQuery = Object.fromEntries(url.searchParams.entries());

  const parsed = GetProductsQuerySchema.safeParse(rawQuery);

  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Invalid query parameters" }),
      { status: 400 }
    );
  }

  const {
    bank,
    aprMin,
    aprMax,
    minIncome,
    minCreditScore,
  } = parsed.data;

  const conditions = [];

  if (bank) {
    conditions.push(ilike(products.bank, `%${bank}%`));
  }

  if (aprMin !== undefined) {
    conditions.push(gte(products.rate_apr, aprMin.toString()));
  }

  if (aprMax !== undefined) {
    conditions.push(lte(products.rate_apr, aprMax.toString()));
  }

  if (minIncome !== undefined) {
    conditions.push(gte(products.min_income, minIncome.toString()));
  }

  if (minCreditScore !== undefined) {
    conditions.push(gte(products.min_credit_score, minCreditScore));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db
    .select()
    .from(products)
    .where(whereClause);

  return new Response(
    JSON.stringify({ products: result }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    }
  );
}
