import type { Product } from "@/lib/types";

export async function fetchProducts(filters: Record<string, string | number>) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value != null) params.append(key, String(value));
  });

  const res = await fetch(`/api/products?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = (await res.json()) as { products: Product[] };
  return data.products;
}
