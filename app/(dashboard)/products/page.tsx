"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/queries/products";
import { ProductsFilters } from "@/components/products-filters";
import { ProductsGrid } from "@/components/products-grid";
import { ProductsGridSkeleton } from "@/components/product-card-skeleton";
import { useDebounce } from "@/lib/hooks/use-debounce";

export default function ProductsPage() {
  const [filters, setFilters] = useState<Record<string, string | number>>({});

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
