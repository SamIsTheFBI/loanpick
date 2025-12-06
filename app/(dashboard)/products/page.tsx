"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/queries/products";
import { ProductsFilters, type FilterValues } from "@/components/products-filters";
import { ProductsGrid } from "@/components/products-grid";
import { ProductsGridSkeleton } from "@/components/product-card-skeleton";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ProductsPage() {
  const [bankSearch, setBankSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({
    aprRange: [0, 20],
    minIncome: 0,
    minCreditScore: 0,
  });
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const debouncedBankSearch = useDebounce(bankSearch, 300);
  const debouncedFilters = useDebounce(filters, 300);

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", debouncedBankSearch, debouncedFilters],
    queryFn: () => fetchProducts({
      bank: debouncedBankSearch,
      aprMin: debouncedFilters.aprRange[0],
      aprMax: debouncedFilters.aprRange[1],
      minIncome: debouncedFilters.minIncome,
      minCreditScore: debouncedFilters.minCreditScore,
    }),
  });

  if (isPending) return <ProductsGridSkeleton />;
  if (!session) return null;

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by bank name..."
            value={bankSearch}
            onChange={(e) => setBankSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <ProductsFilters filters={filters} onFiltersChange={setFilters} />
      </div>

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
