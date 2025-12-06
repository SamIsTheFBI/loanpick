"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

export interface FilterValues {
  aprRange: [number, number];
  minIncome: number;
  minCreditScore: number;
}

interface ProductsFiltersProps {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
}

function FilterContent({ filters, onFiltersChange }: ProductsFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      aprRange: [0, 20],
      minIncome: 0,
      minCreditScore: 0,
    });
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between px-4 md:px-0">
        <span className="font-semibold">Manage Filters</span>
        <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </Button>
      </div>

      <div className="space-y-6 px-4 md:px-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>APR Range</Label>
            <span className="text-sm text-muted-foreground">
              {filters.aprRange[0]}% - {filters.aprRange[1]}%
            </span>
          </div>
          <Slider
            value={filters.aprRange}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, aprRange: value as [number, number] })
            }
            min={0}
            max={20}
            step={0.5}
            className="py-2"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Min Monthly Income</Label>
            <span className="text-sm text-muted-foreground">
              ₹{filters.minIncome.toLocaleString()}
            </span>
          </div>
          <Slider
            value={[filters.minIncome]}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, minIncome: value[0] })
            }
            min={0}
            max={100000}
            step={5000}
            className="py-2"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Min Credit Score</Label>
            <span className="text-sm text-muted-foreground">
              {filters.minCreditScore || "Any"}
            </span>
          </div>
          <Slider
            value={[filters.minCreditScore]}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, minCreditScore: value[0] })
            }
            min={0}
            max={850}
            step={10}
            className="py-2"
          />
        </div>
      </div>
    </div>
  );
}

export function ProductsFilters({ filters, onFiltersChange }: ProductsFiltersProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
          <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
      </DialogContent>
    </Dialog>
  );
}
