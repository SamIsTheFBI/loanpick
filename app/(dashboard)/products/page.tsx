"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/queries/products";
import { ProductsFilters, type FilterValues } from "@/components/products-filters";
import { ProductsGrid } from "@/components/products-grid";
import { ProductsGridSkeleton } from "@/components/product-card-skeleton";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

export default function ProductsPage() {
  const [bankSearch, setBankSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({
    aprRange: [0, 20],
    minIncome: 0,
    minCreditScore: 0,
  });

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

  useEffect(() => {
    if (isError) {
      toast.error((error as Error).message || "Failed to load products");
    }
  }, [isError, error]);

  const isMobile = useIsMobile()

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 sticky z-30 top-0 backdrop-blur-md bg-background py-4">
        <SidebarTrigger />
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={isMobile ? "Search loans by bank..." : "Browse loans by bank name..."}
            value={bankSearch}
            onChange={(e) => setBankSearch(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        <ProductsFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {isLoading && <ProductsGridSkeleton />}

      {products && <ProductsGrid products={products} onAsk={() => { }} />}
    </div>
  );
}
