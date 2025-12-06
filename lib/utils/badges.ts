import type { Product } from "@/lib/types";

export type ProductBadge = string;

export function getProductBadges(product: Product): ProductBadge[] {
  const badges: ProductBadge[] = [];

  const apr = Number(product.rate_apr);
  const minIncome = Number(product.min_income);
  const creditScore = product.min_credit_score ?? 0;

  // low apr
  if (!Number.isNaN(apr) && apr < 10) {
    badges.push("Low APR");
  }

  // prepayment
  if (product.prepayment_allowed) {
    badges.push("Prepayment Allowed");
  } else {
    badges.push("No Prepayment");
  }

  // fast disbursal
  if (product.disbursal_speed === "instant" || product.disbursal_speed === "fast") {
    badges.push("Fast Disbursal");
  }

  // flexible tenure
  const spread = (product.tenure_max_months ?? 0) - (product.tenure_min_months ?? 0);
  if (spread >= 48) {
    badges.push("Flexible Tenure");
  }

  // low docs
  if (product.docs_level === "low" || product.docs_level === "minimal") {
    badges.push("Low Docs");
  }

  // salary eligibility
  if (!Number.isNaN(minIncome) && minIncome > 0) {
    const k = Math.round(minIncome / 1000);
    badges.push(`Salary ≥ ₹${k}k`);
  }

  // credit score
  if (creditScore > 0) {
    badges.push(`Credit Score ≥ ${creditScore}`);
  }

  // limit max badges for ui
  return badges.slice(0, 6);
}
