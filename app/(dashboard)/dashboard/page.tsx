import { db } from "@/lib/db";
import { products } from "@/db/schema";
import { computeProductScore } from "@/lib/utils/scoring";
import { LoanCard } from "@/components/loan-card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const allProducts = await db.select().from(products);

  const scored = allProducts
    .map((p) => ({ ...p, score: computeProductScore(p) }))
    .sort((a, b) => b.score - a.score);

  const top5 = scored.slice(0, 5);
  const bestMatch = top5[0];
  const others = top5.slice(1);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold">
          Best Match for You
        </h1>
        <div className="mt-4">
          <LoanCard product={bestMatch} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Other Recommended Loan Products
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((p) => (
            <LoanCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
