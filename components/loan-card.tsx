"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeList } from "@/components/badge-list";
import { getProductBadges } from "@/lib/utils/badges";
import type { Product } from "@/lib/types";
import { ProductChatSheet } from "@/components/product-chat-sheet";

export function LoanCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  const badges = getProductBadges(product);

  return (
    <>
      <Card className="w-full shadow-sm border">
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

        <CardFooter>
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
