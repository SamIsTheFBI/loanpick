import { db } from "@/lib/db";
import { products } from "@/db/schema";
import { computeProductScore } from "@/lib/utils/scoring";
import { LoanCard } from "@/components/loan-card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

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
        <h1 className="text-3xl font-bold tracking-tighter">
          Welcome, {session.user.name}!
        </h1>
        <p className="text-muted-foreground mt-2">Here are your best loan matches</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Top Loan Matches</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <LoanCard product={bestMatch} isHighlighted />
          {others.map((p) => (
            <LoanCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
