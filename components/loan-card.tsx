"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeList } from "@/components/badge-list";
import { getProductBadges } from "@/lib/utils/badges";
import type { Product } from "@/lib/types";
import { ProductChatSheet } from "@/components/product-chat-sheet";
import { cn } from "@/lib/utils";

export function LoanCard({ product, isHighlighted }: { product: Product, isHighlighted?: Boolean }) {
  const [open, setOpen] = useState(false);

  const badges = getProductBadges(product);

  return (
    <>
      <Card className={cn("w-full shadow-sm border relative", isHighlighted && "border-primary border-3")}>
        {isHighlighted &&
          <div className="w-fit z-50 absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg">
            Best Match
          </div>
        }
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {product.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {product.bank} • {product.type}
          </p>
        </CardHeader>

        <CardContent className="space-y-2">
          <p><strong>APR:</strong> {product.rate_apr}%</p>
          <p><strong>Min Income:</strong> ₹{product.min_income}</p>
          <p><strong>Credit Score:</strong> {product.min_credit_score}</p>

          <BadgeList badges={badges} />
        </CardContent>

        <CardFooter className="mt-auto">
          <Button className="w-full" onClick={() => setOpen(true)}>
            Ask About Product
          </Button>
        </CardFooter>
      </Card>

      <ProductChatSheet
        product={product}
        open={open}
        onCloseAction={() => setOpen(false)}
      />
    </>
  );
}
