"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/queries/products";
import { ProductsFilters } from "@/components/products-filters";
import { ProductsGrid } from "@/components/products-grid";
import { ProductsGridSkeleton } from "@/components/product-card-skeleton";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const debouncedFilters = useDebounce(filters, 300);

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", debouncedFilters],
    queryFn: () => fetchProducts(debouncedFilters),
  });

  if (isPending) return <ProductsGridSkeleton />;
  if (!session) return null;

  return (
    <div className="space-y-6">
      <ProductsFilters onFilter={setFilters} />

      {isLoading && <ProductsGridSkeleton />}

      {isError && (
        <p className="text-red-600 text-sm">
          {(error as Error).message || "Something went wrong."}
        </p>
      )}

      {products && <ProductsGrid products={products} onAsk={() => { }} />}
    </div>
  );
}
