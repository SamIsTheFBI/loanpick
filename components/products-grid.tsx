import { LoanCard } from "@/components/loan-card";
import type { Product } from "@/lib/types";

interface ProductsGridProps {
  products: Product[];
  onAsk: (product: Product) => void;
}

export function ProductsGrid({ products, onAsk }: ProductsGridProps) {
  if (products.length === 0) {
    return <p className="text-center text-muted-foreground">No products found.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <LoanCard key={product.id} product={product} />
      ))}
    </div>
  );
}
