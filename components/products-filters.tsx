"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FiltersProps {
  onFilter: (filters: Record<string, string | number>) => void;
}

export function ProductsFilters({ onFilter }: FiltersProps) {
  const [bank, setBank] = useState("");
  const [aprMin, setAprMin] = useState("");
  const [aprMax, setAprMax] = useState("");
  const [minIncome, setMinIncome] = useState("");
  const [minCreditScore, setMinCreditScore] = useState("");

  const applyFilters = () => {
    onFilter({
      bank,
      aprMin,
      aprMax,
      minIncome,
      minCreditScore,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-wrap gap-4 mb-6">
      <Input
        placeholder="Bank Name"
        value={bank}
        onChange={(e) => setBank(e.target.value)}
        className="xl:w-[200px]"
      />
      <Input
        placeholder="APR Min"
        value={aprMin}
        onChange={(e) => setAprMin(e.target.value)}
        className="xl:w-[120px]"
      />
      <Input
        placeholder="APR Max"
        value={aprMax}
        onChange={(e) => setAprMax(e.target.value)}
        className="xl:w-[120px]"
      />
      <Input
        placeholder="Min Income"
        value={minIncome}
        onChange={(e) => setMinIncome(e.target.value)}
        className="xl:w-[150px]"
      />
      <Input
        placeholder="Credit Score"
        value={minCreditScore}
        onChange={(e) => setMinCreditScore(e.target.value)}
        className="xl:w-[150px]"
      />

      <Button onClick={applyFilters} className="sm:col-span-2 lg:col-span-3 xl:col-span-1">
        Apply Filters
      </Button>
    </div>
  );
}
